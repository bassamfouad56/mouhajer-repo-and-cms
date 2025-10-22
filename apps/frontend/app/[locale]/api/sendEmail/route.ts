import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { v4 as uuidv4 } from "uuid";
import bucket from "../../../../firebase"; // Adjust the path accordingly

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const firstName = formData.get("firstName")?.toString();
    const lastName = formData.get("lastName")?.toString();
    const phoneNumber = formData.get("phoneNumber")?.toString();
    const companyEmail = formData.get("companyEmail")?.toString();
    const companyName = formData.get("companyName")?.toString();
    const message = formData.get("message")?.toString();
    const attachments = formData.get("attachments") as any;

    if (!companyEmail) {
      throw new Error("Company email is required");
    }

    let fileUrl = "";
    if (attachments) {
      const buffer = Buffer.from(await attachments.arrayBuffer());
      const ext = attachments.name.split(".").pop();
      const fileName = `${uuidv4()}.${ext}`;

      const file = bucket.file(`supplier/${fileName}`);
      await file.save(buffer, {
        metadata: { contentType: attachments.type },
        public: true,
        validation: "md5",
      });

      fileUrl = `https://storage.googleapis.com/${bucket.name}/supplier/${fileName}`;
    }

    const transporter = nodemailer.createTransport({
      service: "zoho",
      host: "smtp.zoho.com",
      port: 465,
      secure: true,
      auth: {
        user: "supply@mouhajerdesign.com",
        pass: process.env['NEXT_EMAIL_PASSWORD'],
      },
    });

    const mailOptions = {
      from: "supply@mouhajerdesign.com",
      to: "supply@mouhajerdesign.com",
      subject: "Supplier Inquiry",
      html: `
        <h3>Hello,</h3>
        <p>You have a new supplier inquiry.</p>
        <p><strong>First Name:</strong> ${firstName}</p>
        <p><strong>Last Name:</strong> ${lastName}</p>
        <p><strong>Phone Number:</strong> ${phoneNumber}</p>
        <p><strong>Company Email:</strong> ${companyEmail}</p>
        <p><strong>Company Name:</strong> ${companyName}</p>
        <p><strong>Message:</strong> ${message}</p>
        ${
          fileUrl
            ? `<p><strong>Attachment:</strong> <a href="${fileUrl}">View File</a></p>`
            : ""
        }
      `,
      attachments: fileUrl
        ? [
            {
              filename: attachments.name,
              path: fileUrl,
            },
          ]
        : [],
    };

    await transporter.sendMail(mailOptions);
    return NextResponse.json({ status: 200, message: "Email sent" });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Email not sent", status: 500 });
  }
}
