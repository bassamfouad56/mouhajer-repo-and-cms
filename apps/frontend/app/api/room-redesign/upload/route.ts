import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { v4 as uuidv4 } from "uuid";
import bucket from "../../../../firebase";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const image = formData.get("image") as File;
    const email = formData.get("email")?.toString();
    const style = formData.get("style")?.toString();
    const roomType = formData.get("roomType")?.toString();
    const prompt = formData.get("prompt")?.toString();

    // Validation
    if (!image || !email) {
      return NextResponse.json(
        { error: "Image and email are required" },
        { status: 400 }
      );
    }

    // Validate image type
    if (!image.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Please upload a valid image file" },
        { status: 400 }
      );
    }

    // Validate file size (10MB max)
    if (image.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Image size must be less than 10MB" },
        { status: 400 }
      );
    }

    let imageUrl = "";
    let uploadError = false;

    // Upload to Firebase Storage if configured
    if (bucket) {
      try {
        const buffer = Buffer.from(await image.arrayBuffer());
        const ext = image.name.split(".").pop();
        const fileName = `${uuidv4()}.${ext}`;
        const timestamp = Date.now();

        const file = bucket.file(`room-redesign/${timestamp}-${fileName}`);
        await file.save(buffer, {
          metadata: {
            contentType: image.type,
            metadata: {
              email,
              style,
              roomType,
              prompt: prompt || "",
              uploadedAt: new Date().toISOString(),
            },
          },
          public: true,
          validation: "md5",
        });

        imageUrl = `https://storage.googleapis.com/${bucket.name}/room-redesign/${timestamp}-${fileName}`;
      } catch (uploadErr) {
        console.error("Firebase upload error:", uploadErr);
        uploadError = true;
      }
    } else {
      console.warn("Firebase Storage not configured, skipping image upload");
      uploadError = true;
    }

    // Generate unique tracking ID
    const trackingId = uuidv4();

    // Send email notification
    try {
      const transporter = nodemailer.createTransport({
        service: "zoho",
        host: "smtp.zoho.com",
        port: 465,
        secure: true,
        auth: {
          user: "supply@mouhajerdesign.com",
          pass: process.env.NEXT_EMAIL_PASSWORD,
        },
      });

      // Email to admin
      const adminMailOptions = {
        from: "supply@mouhajerdesign.com",
        to: "supply@mouhajerdesign.com",
        subject: "New Room Redesign Request",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2C2B2B; border-bottom: 2px solid #2C2B2B; padding-bottom: 10px;">
              🏠 New Room Redesign Request
            </h2>

            <div style="background-color: #f5f5f5; padding: 20px; margin: 20px 0; border-radius: 8px;">
              <p><strong>Tracking ID:</strong> ${trackingId}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Room Type:</strong> ${roomType}</p>
              <p><strong>Design Style:</strong> ${style}</p>
              ${prompt ? `<p><strong>Additional Instructions:</strong> ${prompt}</p>` : ""}
              <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
            </div>

            ${
              imageUrl
                ? `
              <div style="margin: 20px 0;">
                <p><strong>Uploaded Image:</strong></p>
                <a href="${imageUrl}" style="display: inline-block; padding: 10px 20px; background-color: #2C2B2B; color: white; text-decoration: none; border-radius: 5px;">
                  View Image
                </a>
              </div>
            `
                : `
              <div style="margin: 20px 0; padding: 15px; background-color: #fff3cd; border-left: 4px solid #ffc107; border-radius: 4px;">
                <p style="margin: 0; color: #856404;">
                  ⚠️ Image upload failed. Please contact the client for the image.
                </p>
              </div>
            `
            }

            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
              <p style="font-size: 12px; color: #666;">
                This is an automated notification from the Mouhajer Room Redesign system.
              </p>
            </div>
          </div>
        `,
      };

      // Email to client
      const clientMailOptions = {
        from: "supply@mouhajerdesign.com",
        to: email,
        subject: "We Received Your Room Redesign Request!",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #2C2B2B; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; font-size: 28px;">✨ Thank You!</h1>
            </div>

            <div style="padding: 30px; background-color: #ffffff; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 8px 8px;">
              <p style="font-size: 16px; color: #333;">Hi there,</p>

              <p style="font-size: 16px; color: #333; line-height: 1.6;">
                We've received your room redesign request and our AI is already working on creating stunning design options for you!
              </p>

              <div style="background-color: #f8f9fa; padding: 20px; margin: 25px 0; border-radius: 8px; border-left: 4px solid #2C2B2B;">
                <p style="margin: 0 0 10px 0; font-weight: bold; color: #2C2B2B;">Your Request Details:</p>
                <p style="margin: 5px 0; color: #555;"><strong>Tracking ID:</strong> ${trackingId}</p>
                <p style="margin: 5px 0; color: #555;"><strong>Room Type:</strong> ${roomType?.replace("_", " ")}</p>
                <p style="margin: 5px 0; color: #555;"><strong>Design Style:</strong> ${style}</p>
              </div>

              <div style="background-color: #e7f3ff; padding: 20px; margin: 25px 0; border-radius: 8px;">
                <p style="margin: 0 0 10px 0; font-weight: bold; color: #0066cc;">⏱️ What Happens Next?</p>
                <ul style="margin: 10px 0; padding-left: 20px; color: #555;">
                  <li style="margin: 8px 0;">Our AI will process your image (takes 2-5 minutes)</li>
                  <li style="margin: 8px 0;">You'll receive an email with a secure link to view your results</li>
                  <li style="margin: 8px 0;">Compare your original photo with the AI-generated redesigns</li>
                  <li style="margin: 8px 0;">Download and share your favorite designs!</li>
                </ul>
              </div>

              <div style="text-align: center; margin: 30px 0;">
                <p style="font-size: 14px; color: #666;">
                  We'll send you another email as soon as your redesigns are ready!
                </p>
              </div>

              <div style="border-top: 1px solid #e0e0e0; padding-top: 20px; margin-top: 30px;">
                <p style="font-size: 12px; color: #999; margin: 0;">
                  Questions? Reply to this email or visit our website.
                </p>
                <p style="font-size: 12px; color: #999; margin: 5px 0 0 0;">
                  © ${new Date().getFullYear()} Mouhajer International Design. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        `,
      };

      // Send both emails
      await Promise.all([
        transporter.sendMail(adminMailOptions),
        transporter.sendMail(clientMailOptions),
      ]);

      return NextResponse.json({
        success: true,
        message: "Your request has been submitted successfully",
        trackingId,
        imageUploaded: !uploadError,
      });
    } catch (emailError) {
      console.error("Email error:", emailError);

      // Still return success if image was uploaded
      if (!uploadError) {
        return NextResponse.json({
          success: true,
          message:
            "Your request has been submitted, but email notification failed",
          trackingId,
          imageUploaded: true,
          warning: "Email notification could not be sent",
        });
      }

      // Both upload and email failed
      return NextResponse.json(
        {
          error: "Failed to process your request. Please try again later.",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      {
        error: "An unexpected error occurred. Please try again.",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
