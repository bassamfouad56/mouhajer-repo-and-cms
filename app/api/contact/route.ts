import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { createClient, type SanityClient } from "@sanity/client";

// Force dynamic to prevent static analysis during build
export const dynamic = "force-dynamic";

// Sanity client for saving leads - only create if projectId is valid
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "b6q28exv";
const isValidProjectId = projectId && /^[a-z0-9-]+$/.test(projectId);

let sanityClient: SanityClient | null = null;
if (isValidProjectId) {
  sanityClient = createClient({
    projectId,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
    apiVersion: "2024-01-01",
    token: process.env.SANITY_API_TOKEN,
    useCdn: false,
  });
}

// Map project type to Sanity service category
function mapProjectTypeToCategory(projectType: string): string {
  const mapping: Record<string, string> = {
    "Luxury Residential": "residential",
    "Hospitality / Hotel": "hospitality",
    "Commercial Fit-Out": "commercial",
    "Villa Renovation": "residential",
    "Office Interior": "commercial",
    Other: "interior",
  };
  return mapping[projectType] || "interior";
}

export async function POST(request: NextRequest) {
  try {
    const {
      name,
      email,
      phone,
      subject,
      message,
      projectType,
      budget,
      timeline,
    } = await request.json();

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Save lead to Sanity CMS
    try {
      if (sanityClient) {
        await sanityClient.create({
          _type: "lead",
          email,
          prompt: `Contact Form: ${subject}\n\nMessage: ${message}`,
          phoneNumber: phone || undefined,
          projectBudget: budget || undefined,
          timeline: timeline || undefined,
          serviceCategory: projectType
            ? mapProjectTypeToCategory(projectType)
            : undefined,
          status: "new",
          source: "contact_form",
          notes: `Name: ${name}\nProject Type: ${projectType || "N/A"}\nSubject: ${subject}`,
          createdAt: new Date().toISOString(),
        });
      }
    } catch (sanityError) {
      console.error("Failed to save lead to Sanity:", sanityError);
      // Continue with email sending even if Sanity fails
    }

    // Create email transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    // Email to admin
    const adminMailOptions = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: process.env.ADMIN_EMAIL,
      subject: `New Contact Form Submission: ${subject}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: #0a0a0a; color: white; padding: 30px 20px; text-align: center; }
              .content { background: #f9f9f9; padding: 30px 20px; }
              .field { margin-bottom: 20px; }
              .label { font-weight: bold; color: #666; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; }
              .value { margin-top: 5px; font-size: 16px; }
              .footer { text-align: center; padding: 20px; font-size: 12px; color: #999; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1 style="margin: 0; font-size: 24px; font-weight: 300; letter-spacing: 4px;">MOUHAJER</h1>
                <p style="margin: 5px 0 0; font-size: 10px; letter-spacing: 2px; color: #999;">INTERNATIONAL DESIGN</p>
              </div>
              <div class="content">
                <h2 style="margin-top: 0; font-weight: 300;">New Contact Form Submission</h2>

                <div class="field">
                  <div class="label">Name</div>
                  <div class="value">${name}</div>
                </div>

                <div class="field">
                  <div class="label">Email</div>
                  <div class="value"><a href="mailto:${email}">${email}</a></div>
                </div>

                ${
                  phone
                    ? `
                <div class="field">
                  <div class="label">Phone</div>
                  <div class="value">${phone}</div>
                </div>
                `
                    : ""
                }

                <div class="field">
                  <div class="label">Subject</div>
                  <div class="value">${subject}</div>
                </div>

                ${
                  projectType
                    ? `
                <div class="field">
                  <div class="label">Project Type</div>
                  <div class="value">${projectType}</div>
                </div>
                `
                    : ""
                }

                ${
                  budget
                    ? `
                <div class="field">
                  <div class="label">Budget Range</div>
                  <div class="value">${budget}</div>
                </div>
                `
                    : ""
                }

                ${
                  timeline
                    ? `
                <div class="field">
                  <div class="label">Timeline</div>
                  <div class="value">${timeline}</div>
                </div>
                `
                    : ""
                }

                <div class="field">
                  <div class="label">Message</div>
                  <div class="value">${message.replace(/\n/g, "<br>")}</div>
                </div>
              </div>
              <div class="footer">
                <p>This email was sent from your website contact form.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    };

    // Auto-reply to customer
    const customerMailOptions = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: email,
      subject: "Thank you for contacting Mouhajer International Design",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: #0a0a0a; color: white; padding: 30px 20px; text-align: center; }
              .content { background: #f9f9f9; padding: 30px 20px; }
              .footer { text-align: center; padding: 20px; font-size: 12px; color: #999; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1 style="margin: 0; font-size: 24px; font-weight: 300; letter-spacing: 4px;">MOUHAJER</h1>
                <p style="margin: 5px 0 0; font-size: 10px; letter-spacing: 2px; color: #999;">INTERNATIONAL DESIGN</p>
              </div>
              <div class="content">
                <h2 style="margin-top: 0; font-weight: 300;">Thank You for Reaching Out</h2>
                <p>Dear ${name},</p>
                <p>Thank you for your interest in Mouhajer International Design. We have received your message and will respond within 24-48 hours.</p>
                <p>Our team is excited to learn more about your project and explore how we can bring your vision to life.</p>
                <p style="margin-top: 30px;">Best regards,<br><strong>Mouhajer International Design Team</strong></p>
              </div>
              <div class="footer">
                <p>Dubai, United Arab Emirates<br>
                <a href="mailto:${process.env.NEXT_PUBLIC_EMAIL}">${process.env.NEXT_PUBLIC_EMAIL}</a><br>
                ${process.env.NEXT_PUBLIC_PHONE}</p>
              </div>
            </div>
          </body>
        </html>
      `,
    };

    // Send both emails
    await transporter.sendMail(adminMailOptions);
    await transporter.sendMail(customerMailOptions);

    return NextResponse.json(
      { message: "Email sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}
