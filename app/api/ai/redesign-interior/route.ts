import { NextRequest, NextResponse } from "next/server";
import {
  analyzeImageWithOllama,
  checkOllamaHealth,
} from "@/lib/ai/ollama-client";
import {
  generateImageWithComfyUIImg2Img,
  checkComfyUIHealth,
} from "@/lib/ai/comfyui-client";
import { Resend } from "resend";

// Force dynamic to prevent static analysis during build
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// Initialize Resend only if API key is available
const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

// Contact information for engineer callback
const ENGINEER_PHONE = "+971 52 304 1482";
const ENGINEER_EMAIL = "mouhajergallery@gmail.com";

// Email configuration - use verified domain or Resend test domain
// To use custom domain: verify mouhajerdesign.com in Resend dashboard
const FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL ||
  "Mouhajer Design Studio <onboarding@resend.dev>";

export async function POST(request: NextRequest) {
  try {
    // Lazy load Sanity client to avoid build-time initialization
    const { client: sanityClient } = await import("@/sanity/lib/client");

    const formData = await request.formData();

    const email = formData.get("email") as string;
    const uploadedImage = formData.get("image") as File | null;
    const prompt =
      (formData.get("prompt") as string) ||
      "Redesign this interior space with modern luxury aesthetics";
    const serviceCategory =
      (formData.get("serviceCategory") as string) || "interior";
    const requestEngineerCallback =
      formData.get("requestEngineerCallback") === "true";

    // Validation
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    if (!uploadedImage) {
      return NextResponse.json(
        { error: "Please upload an interior image" },
        { status: 400 },
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 },
      );
    }

    // Validate file type
    if (!uploadedImage.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Please upload a valid image file" },
        { status: 400 },
      );
    }

    // Check if AI services are available
    const [ollamaHealthy, comfyUIHealthy] = await Promise.all([
      checkOllamaHealth(),
      checkComfyUIHealth(),
    ]);

    // Demo mode flag - proceed with lead capture even if AI is offline
    const demoMode = !ollamaHealthy || !comfyUIHealthy;

    if (demoMode) {
      console.log(
        "[Redesign] Running in demo mode - AI services unavailable:",
        {
          ollama: ollamaHealthy ? "online" : "offline",
          comfyUI: comfyUIHealthy ? "online" : "offline",
        },
      );
    }

    const startTime = Date.now();

    // Convert uploaded image to base64
    const bytes = await uploadedImage.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const uploadedImageBase64 = buffer.toString("base64");

    let imageAnalysis = "";
    let generatedImageBuffer: Buffer | null = null;

    if (!demoMode) {
      // Full AI mode - analyze and generate
      try {
        // Analyze the uploaded interior image with LLaVA
        console.log("[Redesign] Analyzing uploaded interior image...");
        imageAnalysis = await analyzeImageWithOllama(
          uploadedImageBase64,
          `Analyze this interior space in detail. Describe:
          1. The room type (living room, bedroom, kitchen, etc.)
          2. Current style and design elements
          3. Colors, materials, and textures visible
          4. Lighting conditions
          5. Key furniture and decor items
          6. Overall atmosphere and mood

          Based on this, suggest how to transform it into a modern luxury space with MIDC signature style - blending European precision with Arabic warmth.`,
          "llava",
        );

        console.log("[Redesign] Image analysis:", imageAnalysis);

        // Create enhanced prompt for redesign
        const enhancedPrompt = `Transform this interior space: ${imageAnalysis}

        Create a luxury redesign with:
        - Modern minimalist aesthetic with warm accents
        - Premium materials (marble, brass, natural wood, velvet)
        - Sophisticated ambient lighting with accent fixtures
        - Elegant furniture with clean lines
        - Subtle Arabic-inspired geometric patterns
        - Cohesive neutral color palette with gold accents

        ${prompt}

        Style: Luxury interior design, photorealistic 3D render, architectural visualization, 8K quality`;

        // Generate redesigned image with img2img
        console.log("[Redesign] Generating redesigned image...");
        generatedImageBuffer = await generateImageWithComfyUIImg2Img({
          prompt: enhancedPrompt,
          negative_prompt:
            "low quality, blurry, distorted, unrealistic, amateur, sketchy, bad design, cluttered, messy, poor lighting, cheap materials",
          input_image: uploadedImageBase64,
          width: 1024,
          height: 768,
          steps: 35,
          cfg_scale: 7.5,
          denoise: 0.65,
          seed: -1,
        });
      } catch (aiError) {
        console.error(
          "[Redesign] AI processing failed, switching to demo mode:",
          aiError,
        );
        // Continue in demo mode
      }
    }

    const generationTime = Math.round((Date.now() - startTime) / 1000);
    console.log(
      `[Redesign] Processing completed in ${generationTime}s (demo mode: ${demoMode || !generatedImageBuffer})`,
    );

    // Upload images to Sanity
    let generatedImageAsset = null;
    let uploadedImageAsset = null;

    try {
      // Always upload the original image
      uploadedImageAsset = await sanityClient.assets.upload("image", buffer, {
        filename: `original-interior-${Date.now()}.${uploadedImage.type.split("/")[1]}`,
        contentType: uploadedImage.type,
      });

      // Only upload generated image if we have one
      if (generatedImageBuffer) {
        generatedImageAsset = await sanityClient.assets.upload(
          "image",
          generatedImageBuffer,
          {
            filename: `ai-redesign-${Date.now()}.png`,
            contentType: "image/png",
          },
        );
      }
    } catch (uploadError) {
      console.error("[Redesign] Sanity upload error:", uploadError);
      // Continue without Sanity - just send email
    }

    // Create lead in Sanity with engineer callback request
    let lead = null;
    try {
      lead = await sanityClient.create({
        _type: "lead",
        email,
        prompt: "Interior Redesign Request",
        serviceCategory,
        uploadedImage: uploadedImageAsset
          ? {
              _type: "image",
              asset: {
                _type: "reference",
                _ref: uploadedImageAsset._id,
              },
            }
          : undefined,
        generatedImage: generatedImageAsset
          ? {
              _type: "image",
              asset: {
                _type: "reference",
                _ref: generatedImageAsset._id,
              },
            }
          : undefined,
        status:
          demoMode || !generatedImageBuffer ? "demo_pending" : "processing",
        modelUsed:
          demoMode || !generatedImageBuffer
            ? "Demo Mode"
            : "SDXL img2img + LLaVA",
        generationTime,
        engineerCallbackRequested: requestEngineerCallback,
        imageAnalysis: imageAnalysis || "AI analysis pending - demo mode",
        createdAt: new Date().toISOString(),
      });
    } catch (leadError) {
      console.error("[Redesign] Failed to create lead:", leadError);
      // Continue - we can still send email
    }

    // Generate image URLs from Sanity CDN (or use placeholder)
    const isDemo = demoMode || !generatedImageBuffer || !generatedImageAsset;

    // Helper to convert Sanity asset ID to URL
    // Asset ID format: image-{hash}-{width}x{height}-{format}
    const getSanityImageUrl = (assetId: string): string => {
      // Remove 'image-' prefix and convert last hyphen to dot for extension
      const parts = assetId.replace("image-", "").split("-");
      const extension = parts.pop(); // Get last part (format like 'png', 'jpg')
      const rest = parts.join("-"); // Hash and dimensions
      return `https://cdn.sanity.io/images/${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}/${process.env.NEXT_PUBLIC_SANITY_DATASET}/${rest}.${extension}`;
    };

    const generatedImageUrl = generatedImageAsset
      ? getSanityImageUrl(generatedImageAsset._id)
      : null;
    const originalImageUrl = uploadedImageAsset
      ? getSanityImageUrl(uploadedImageAsset._id)
      : null;

    // Send email
    let emailSent = false;
    let emailError: string | null = null;

    try {
      if (!resend) {
        console.log("[Redesign] Resend not configured, skipping email");
        emailError = "Email service not configured";
        if (lead) {
          await sanityClient
            .patch(lead._id)
            .set({ status: "completed" })
            .commit();
        }
      } else {
        // Different email for demo mode vs full AI mode
        const emailSubject = isDemo
          ? "Your Interior Redesign Request Received!"
          : "Your AI Interior Redesign is Ready!";

        const emailBody = isDemo
          ? `
            <!DOCTYPE html>
            <html>
              <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
              </head>
              <body style="font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; max-width: 700px; margin: 0 auto; padding: 20px;">
                <div style="background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); padding: 40px 20px; text-align: center; border-radius: 8px 8px 0 0;">
                  <h1 style="color: #8f7852; margin: 0; font-size: 28px; font-weight: 300;">Interior Redesign Request</h1>
                  <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 14px;">Mouhajer Design Studio</p>
                </div>

                <div style="background: #ffffff; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                  <p style="font-size: 16px; color: #333;">Dear Valued Client,</p>

                  <p style="font-size: 14px; color: #666; line-height: 1.8;">
                    Thank you for your interest in our Interior Redesign service! We've received your photo and a design engineer will be in touch shortly.
                  </p>

                  <div style="background: #8f7852; color: #1a1a1a; padding: 20px; border-radius: 8px; margin: 25px 0; text-align: center;">
                    <h3 style="margin: 0 0 10px 0; font-size: 18px;">Engineer Callback Scheduled</h3>
                    <p style="margin: 0; font-size: 14px;">
                      One of our design engineers will contact you within <strong>15 minutes</strong> to discuss your project and create a personalized redesign concept!
                    </p>
                  </div>

                  ${
                    originalImageUrl
                      ? `
                  <div style="margin: 30px 0;">
                    <h3 style="color: #1a1a1a; font-size: 16px; margin-bottom: 15px;">Your Submitted Space</h3>
                    <img src="${originalImageUrl}" alt="Your Interior" style="max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                  </div>
                  `
                      : ""
                  }

                  <div style="background: #f0f0f0; padding: 20px; border-radius: 8px; margin: 30px 0;">
                    <h3 style="margin: 0 0 15px 0; color: #1a1a1a; font-size: 18px;">What Happens Next?</h3>
                    <ul style="margin: 0; padding-left: 20px; color: #666; font-size: 14px;">
                      <li style="margin-bottom: 10px;">An engineer will call you within 15 minutes</li>
                      <li style="margin-bottom: 10px;">We'll discuss your vision and preferences</li>
                      <li style="margin-bottom: 10px;">You'll receive a custom AI-generated redesign</li>
                      <li style="margin-bottom: 10px;">We can then discuss bringing the design to life</li>
                    </ul>
                  </div>

                  <div style="text-align: center; margin: 30px 0;">
                    <a href="https://wa.me/971523041482?text=${encodeURIComponent("Hi! I just submitted my interior photo for redesign.")}" style="display: inline-block; background: #25D366; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 4px; font-size: 14px; font-weight: 600; margin: 5px;">WhatsApp Us</a>
                    <a href="tel:+971523041482" style="display: inline-block; background: #8f7852; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 4px; font-size: 14px; font-weight: 600; margin: 5px;">Call Now</a>
                  </div>

                  <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
                    <p style="font-size: 12px; color: #999; margin: 5px 0;">
                      Mouhajer International Design & Contracting<br>
                      Dubai, UAE | <a href="tel:${ENGINEER_PHONE}" style="color: #8f7852;">${ENGINEER_PHONE}</a>
                    </p>
                  </div>
                </div>
              </body>
            </html>
          `
          : `
            <!DOCTYPE html>
            <html>
              <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
              </head>
              <body style="font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; max-width: 700px; margin: 0 auto; padding: 20px;">
                <div style="background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); padding: 40px 20px; text-align: center; border-radius: 8px 8px 0 0;">
                  <h1 style="color: #8f7852; margin: 0; font-size: 28px; font-weight: 300;">Your Interior Redesign</h1>
                  <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 14px;">Powered by Mouhajer AI Design Studio</p>
                </div>

                <div style="background: #ffffff; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                  <p style="font-size: 16px; color: #333;">Dear Valued Client,</p>

                  <p style="font-size: 14px; color: #666; line-height: 1.8;">
                    Thank you for using our AI Interior Redesign tool! Our AI has analyzed your space and created a stunning redesign concept inspired by luxury design principles.
                  </p>

                  ${
                    requestEngineerCallback
                      ? `
                  <div style="background: #8f7852; color: #1a1a1a; padding: 20px; border-radius: 8px; margin: 25px 0; text-align: center;">
                    <h3 style="margin: 0 0 10px 0; font-size: 18px;">Engineer Callback Scheduled</h3>
                    <p style="margin: 0; font-size: 14px;">
                      One of our design engineers will contact you within <strong>15 minutes</strong> to discuss your project!
                    </p>
                  </div>
                  `
                      : ""
                  }

                  ${
                    originalImageUrl
                      ? `
                  <div style="margin: 30px 0;">
                    <h3 style="color: #1a1a1a; font-size: 16px; margin-bottom: 15px;">Your Original Space</h3>
                    <img src="${originalImageUrl}" alt="Original Interior" style="max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                  </div>
                  `
                      : ""
                  }

                  ${
                    generatedImageUrl
                      ? `
                  <div style="margin: 30px 0;">
                    <h3 style="color: #1a1a1a; font-size: 16px; margin-bottom: 15px;">AI Redesigned Concept</h3>
                    <img src="${generatedImageUrl}" alt="AI Redesigned Interior" style="max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
                  </div>
                  `
                      : ""
                  }

                  ${
                    imageAnalysis
                      ? `
                  <div style="background: #f8f8f8; padding: 20px; border-radius: 8px; margin: 25px 0;">
                    <h3 style="margin: 0 0 15px 0; color: #1a1a1a; font-size: 16px;">AI Design Analysis</h3>
                    <p style="margin: 0; font-size: 13px; color: #666; white-space: pre-line; line-height: 1.7;">${imageAnalysis.substring(0, 500)}${imageAnalysis.length > 500 ? "..." : ""}</p>
                  </div>
                  `
                      : ""
                  }

                  <div style="background: #f0f0f0; padding: 20px; border-radius: 8px; margin: 30px 0;">
                    <h3 style="margin: 0 0 15px 0; color: #1a1a1a; font-size: 18px;">Ready to Make It Real?</h3>
                    <p style="margin: 0 0 15px 0; color: #666; font-size: 14px;">
                      Our team of expert designers and engineers can bring this concept to life. Let's discuss your project!
                    </p>
                    <div style="text-align: center;">
                      <a href="https://wa.me/971523041482?text=${encodeURIComponent("Hi! I just received my AI interior redesign and would like to discuss bringing it to life.")}" style="display: inline-block; background: #25D366; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 4px; font-size: 14px; font-weight: 600; margin: 5px;">WhatsApp Us</a>
                      <a href="tel:+971523041482" style="display: inline-block; background: #8f7852; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 4px; font-size: 14px; font-weight: 600; margin: 5px;">Call Now</a>
                    </div>
                  </div>

                  <div style="border-top: 1px solid #e0e0e0; margin-top: 30px; padding-top: 20px;">
                    <p style="font-size: 12px; color: #999; margin: 0;">
                      <strong>Generation Details:</strong><br>
                      Time: ${generationTime} seconds | Technology: SDXL + LLaVA Vision AI<br>
                      ${lead ? `Reference ID: ${lead._id}` : ""}
                    </p>
                  </div>

                  <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
                    <p style="font-size: 12px; color: #999; margin: 5px 0;">
                      Mouhajer International Design & Contracting<br>
                      Dubai, UAE | <a href="tel:${ENGINEER_PHONE}" style="color: #8f7852;">${ENGINEER_PHONE}</a>
                    </p>
                  </div>
                </div>
              </body>
            </html>
          `;

        const emailResult = await resend.emails.send({
          from: FROM_EMAIL,
          to: email,
          subject: emailSubject,
          html: emailBody,
        });

        if (emailResult.data?.id) {
          emailSent = true;
          console.log(
            "[Redesign] Email sent successfully:",
            emailResult.data.id,
          );
        } else if (emailResult.error) {
          emailError = emailResult.error.message || "Failed to send email";
          console.error("[Redesign] Email send error:", emailResult.error);
        }

        // Update lead status if we have one
        if (lead) {
          await sanityClient
            .patch(lead._id)
            .set({
              status: "sent",
              emailSentAt: new Date().toISOString(),
            })
            .commit();
        }

        // Always send notification to team for callback
        if (requestEngineerCallback) {
          await resend.emails.send({
            from: FROM_EMAIL,
            to: ENGINEER_EMAIL,
            subject: `URGENT: Engineer Callback Requested - ${email}`,
            html: `
              <h2>New Interior Redesign Lead - Callback Requested</h2>
              <p><strong>Client Email:</strong> ${email}</p>
              <p><strong>Request Time:</strong> ${new Date().toLocaleString()}</p>
              <p><strong>Callback Window:</strong> Within 15 minutes</p>
              <p><strong>Mode:</strong> ${isDemo ? "Demo/Manual Follow-up Required" : "AI Generated"}</p>
              ${lead ? `<p><strong>Lead ID:</strong> ${lead._id}</p>` : ""}
              <hr>
              ${imageAnalysis ? `<p><strong>AI Analysis:</strong></p><p style="white-space: pre-line;">${imageAnalysis}</p><hr>` : ""}
              ${originalImageUrl ? `<p>Original Image: ${originalImageUrl}</p>` : ""}
              ${generatedImageUrl ? `<p>Generated Design: ${generatedImageUrl}</p>` : ""}
            `,
          });
        }
      }
    } catch (err) {
      console.error("[Redesign] Failed to send email:", err);
      emailError = err instanceof Error ? err.message : "Email sending failed";
      // Don't fail the request if email fails
      if (lead) {
        try {
          await sanityClient
            .patch(lead._id)
            .set({ status: "completed" })
            .commit();
        } catch {
          // Ignore Sanity errors
        }
      }
    }

    // Return success response with accurate email status
    let responseMessage: string;
    if (emailSent) {
      responseMessage = isDemo
        ? "Request received! Check your email for confirmation. Our team will contact you within 15 minutes."
        : "Interior redesign generated successfully! Check your email.";
    } else {
      responseMessage =
        "Request received! Our team will contact you within 15 minutes to discuss your project.";
      if (emailError) {
        console.warn("[Redesign] Email not sent:", emailError);
      }
    }

    return NextResponse.json({
      success: true,
      message: responseMessage,
      data: {
        leadId: lead?._id || null,
        imageUrl: generatedImageUrl || originalImageUrl, // Fallback to original in demo mode
        originalImageUrl,
        generationTime,
        engineerCallbackScheduled: requestEngineerCallback,
        demoMode: isDemo,
        emailSent,
        emailError: emailError || undefined,
      },
    });
  } catch (error) {
    console.error("[Redesign] Error:", error);

    return NextResponse.json(
      {
        error: "Failed to generate redesign",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

// Health check endpoint
export async function GET() {
  const [ollamaHealthy, comfyUIHealthy] = await Promise.all([
    checkOllamaHealth(),
    checkComfyUIHealth(),
  ]);

  return NextResponse.json({
    status: ollamaHealthy && comfyUIHealthy ? "healthy" : "degraded",
    services: {
      ollama: ollamaHealthy ? "online" : "offline",
      comfyUI: comfyUIHealthy ? "online" : "offline",
    },
    timestamp: new Date().toISOString(),
  });
}
