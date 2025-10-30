import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import nodemailer from "nodemailer";

const prisma = new PrismaClient();

/**
 * POST /api/form-submit
 * Public endpoint for submitting dynamic forms
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { formId, formName, data, locale = "en" } = body;

    // Validate required fields
    if (!formId || !data) {
      return NextResponse.json(
        { error: "Missing required fields: formId and data are required" },
        { status: 400 }
      );
    }

    // Get client metadata
    const userAgent = request.headers.get("user-agent") || undefined;
    const forwardedFor = request.headers.get("x-forwarded-for");
    const realIp = request.headers.get("x-real-ip");
    const ipAddress = forwardedFor?.split(",")[0] || realIp || undefined;

    // Store submission in database
    const submission = await prisma.formSubmission.create({
      data: {
        formId,
        formName: formName || formId,
        data,
        locale,
        ipAddress,
        userAgent,
        status: "new",
        submittedAt: new Date(),
      },
    });

    // Fetch form configuration to check for email notifications
    try {
      const formInstance = await prisma.blueprintInstance.findFirst({
        where: {
          id: formId,
          blueprint: {
            name: "Form",
          },
        },
      });

      if (formInstance) {
        const formData = locale === "ar" ? formInstance.dataAr : formInstance.dataEn;
        const notifications = (formData as any)?.notifications;
        const crmIntegration = (formData as any)?.crmIntegration;

        // Send email notification if enabled
        if (notifications?.enabled && notifications?.recipients) {
          await sendFormNotification({
            recipients: notifications.recipients,
            subject: notifications.subject || "New Form Submission",
            formName: formName || formId,
            submissionData: data,
            submissionId: submission.id,
          });
        }

        // Create CRM lead if enabled
        if (crmIntegration?.connectWithCRM) {
          await createCRMLead({
            formData: data,
            crmConfig: crmIntegration,
            submissionId: submission.id,
            locale,
          });
        }
      }
    } catch (emailError) {
      // Log email error but don't fail the submission
      console.error("Error sending notification email:", emailError);
    }

    return NextResponse.json({
      success: true,
      message: "Form submitted successfully",
      submissionId: submission.id,
    });
  } catch (error) {
    console.error("Form submission error:", error);
    return NextResponse.json(
      { error: "Failed to submit form. Please try again later." },
      { status: 500 }
    );
  }
}

/**
 * Send email notification for form submission
 */
async function sendFormNotification({
  recipients,
  subject,
  formName,
  submissionData,
  submissionId,
}: {
  recipients: string;
  subject: string;
  formName: string;
  submissionData: Record<string, any>;
  submissionId: string;
}) {
  try {
    // Configure email transporter
    const transporter = nodemailer.createTransporter({
      service: "zoho",
      host: "smtp.zoho.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER || "supply@mouhajerdesign.com",
        pass: process.env.EMAIL_PASSWORD || process.env.NEXT_EMAIL_PASSWORD,
      },
    });

    // Build email HTML
    let dataRows = "";
    for (const [key, value] of Object.entries(submissionData)) {
      const formattedKey = key
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (str) => str.toUpperCase());
      const formattedValue = typeof value === "object" ? JSON.stringify(value) : value;
      dataRows += `<tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>${formattedKey}:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${formattedValue}</td></tr>`;
    }

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #f4f4f4; padding: 20px; text-align: center; }
            .content { padding: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { text-align: left; padding: 8px; border: 1px solid #ddd; }
            .footer { margin-top: 20px; padding: 20px; background-color: #f4f4f4; text-align: center; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>${subject}</h2>
            </div>
            <div class="content">
              <p>A new form submission has been received.</p>
              <p><strong>Form:</strong> ${formName}</p>
              <p><strong>Submission ID:</strong> ${submissionId}</p>
              <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>

              <h3>Submission Details:</h3>
              <table>
                ${dataRows}
              </table>
            </div>
            <div class="footer">
              <p>This is an automated message from Mouhajer Design CMS</p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Send email to all recipients
    const recipientList = recipients.split(",").map((email) => email.trim());

    await transporter.sendMail({
      from: process.env.EMAIL_USER || "supply@mouhajerdesign.com",
      to: recipientList,
      subject: subject,
      html: emailHtml,
    });

    console.log(`Email notification sent to: ${recipientList.join(", ")}`);
  } catch (error) {
    console.error("Failed to send email notification:", error);
    throw error;
  }
}

/**
 * Create a CRM lead from form submission
 */
async function createCRMLead({
  formData,
  crmConfig,
  submissionId,
  locale,
}: {
  formData: Record<string, any>;
  crmConfig: any;
  submissionId: string;
  locale: string;
}) {
  try {
    const fieldMapping = crmConfig.fieldMapping || {};

    // Extract lead data using field mapping
    const leadData: any = {
      // Required fields
      name: formData[fieldMapping.nameField] || formData.name || formData.fullName || "Unknown",
      phone: formData[fieldMapping.phoneField] || formData.phone || formData.phoneNumber || "",

      // Optional fields
      email: formData[fieldMapping.emailField] || formData.email,
      source: crmConfig.leadSource || "website_form",
      status: crmConfig.defaultStatus || "new",
      qualified: crmConfig.autoQualify || false,
      score: crmConfig.autoQualify ? 75 : 50, // Auto-qualified leads get higher score

      // Project details
      projectType: formData[fieldMapping.projectTypeField] || formData.projectType || formData.serviceType || "General Inquiry",
      budgetRange: formData[fieldMapping.budgetField] || formData.budget || formData.budgetRange,
      timeline: formData[fieldMapping.timelineField] || formData.timeline || formData.startDate,
      city: formData[fieldMapping.cityField] || formData.city || formData.location,
      area: formData.area,
      propertySize: formData.propertySize,

      // Message/Notes
      message: formData[fieldMapping.messageField] || formData.message || formData.comments || formData.description,

      // Additional data
      interestedIn: formData.interestedIn || formData.interests || [],
      stylePreference: formData.stylePreference || formData.style || [],

      // Store submission reference
      formSubmissionId: submissionId,
    };

    // Add locale-specific notes
    if (locale === "ar") {
      leadData.notesAr = `Form submission: ${submissionId}\n${leadData.message || ""}`;
    } else {
      leadData.notesEn = `Form submission: ${submissionId}\n${leadData.message || ""}`;
    }

    // Create lead via GraphQL mutation
    const graphqlEndpoint = process.env.NEXT_PUBLIC_GRAPHQL_URL || "http://localhost:3000/api/graphql";

    const mutation = `
      mutation CreateLead($input: CreateLeadInput!) {
        createLead(input: $input) {
          id
          name
          email
          phone
          status
        }
      }
    `;

    const response = await fetch(graphqlEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: mutation,
        variables: {
          input: leadData,
        },
      }),
    });

    const result = await response.json();

    if (result.errors) {
      console.error("GraphQL errors creating lead:", result.errors);
      throw new Error(result.errors[0]?.message || "Failed to create lead");
    }

    console.log(`✅ CRM Lead created successfully: ${result.data?.createLead?.id}`);
    return result.data?.createLead;
  } catch (error) {
    console.error("Failed to create CRM lead:", error);
    // Don't throw - we don't want to fail the form submission if CRM fails
    // Just log the error
  }
}
