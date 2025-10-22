import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { cmsBaseUrl } from "@/lib/cms-config";

// Rate limiting (in production, use Redis or similar)
const rateLimitMap = new Map();

function rateLimit(ip: string, limit: number = 5, windowMs: number = 15 * 60 * 1000) {
  const now = Date.now();
  const windowStart = now - windowMs;

  const requests = rateLimitMap.get(ip) || [];
  const validRequests = requests.filter((time: number) => time > windowStart);

  if (validRequests.length >= limit) {
    return false;
  }

  validRequests.push(now);
  rateLimitMap.set(ip, validRequests);
  return true;
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
    if (!rateLimit(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const {
      firstName,
      email,
      phoneNumber,
      company,
      service,
      projectLocation,
      projectBudget,
      startDate,
      projectDescription,
      locale,
    } = await request.json();

    // Validate required fields
    if (!firstName || !email || !phoneNumber) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    const transporter = nodemailer.createTransport({
      service: "zoho",
      host: "smtp.zoho.com",
      port: 465,
      secure: true,
      auth: {
        user: "inquiry@mouhajerdesign.com",
        pass: process.env['NEXT_EMAIL_PASSWORD_INQUIRY'],
      },
    });

    // Admin email HTML template
    const adminEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #2c3e50; margin-bottom: 10px;">📋 New Client Enquiry</h1>
          <p style="color: #7f8c8d; font-size: 16px;">Full contact form submission</p>
        </div>

        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="color: #2c3e50; margin-top: 0;">Contact Information</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr style="border-bottom: 1px solid #e9ecef;">
              <td style="padding: 10px 0; font-weight: bold; color: #495057;">Name:</td>
              <td style="padding: 10px 0; color: #495057;">${firstName}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e9ecef;">
              <td style="padding: 10px 0; font-weight: bold; color: #495057;">Email:</td>
              <td style="padding: 10px 0; color: #495057;"><a href="mailto:${email}" style="color: #007bff; text-decoration: none;">${email}</a></td>
            </tr>
            <tr style="border-bottom: 1px solid #e9ecef;">
              <td style="padding: 10px 0; font-weight: bold; color: #495057;">Phone:</td>
              <td style="padding: 10px 0; color: #495057;"><a href="tel:${phoneNumber}" style="color: #007bff; text-decoration: none;">${phoneNumber}</a></td>
            </tr>
            <tr style="border-bottom: 1px solid #e9ecef;">
              <td style="padding: 10px 0; font-weight: bold; color: #495057;">Company:</td>
              <td style="padding: 10px 0; color: #495057;">${company || 'N/A'}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e9ecef;">
              <td style="padding: 10px 0; font-weight: bold; color: #495057;">Service:</td>
              <td style="padding: 10px 0; color: #495057;">${service || 'N/A'}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e9ecef;">
              <td style="padding: 10px 0; font-weight: bold; color: #495057;">Location:</td>
              <td style="padding: 10px 0; color: #495057;">${projectLocation || 'N/A'}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e9ecef;">
              <td style="padding: 10px 0; font-weight: bold; color: #495057;">Budget:</td>
              <td style="padding: 10px 0; color: #495057;">${projectBudget || 'N/A'}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e9ecef;">
              <td style="padding: 10px 0; font-weight: bold; color: #495057;">Start Date:</td>
              <td style="padding: 10px 0; color: #495057;">${startDate || 'N/A'}</td>
            </tr>
          </table>
        </div>

        <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="color: #856404; margin-top: 0;">Project Description:</h3>
          <p style="color: #856404; margin: 0;">${projectDescription || 'No description provided'}</p>
        </div>

        <div style="text-align: center; padding: 20px; background: #e8f4f8; border-radius: 8px;">
          <p style="color: #2c3e50; margin: 0; font-weight: bold;">⚡ Quick Actions</p>
          <div style="margin-top: 15px;">
            <a href="tel:${phoneNumber}" style="display: inline-block; margin: 5px; padding: 10px 20px; background: #28a745; color: white; text-decoration: none; border-radius: 5px;">📞 Call Now</a>
            <a href="mailto:${email}" style="display: inline-block; margin: 5px; padding: 10px 20px; background: #007bff; color: white; text-decoration: none; border-radius: 5px;">📧 Email</a>
          </div>
        </div>

        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e9ecef; color: #6c757d; font-size: 14px;">
          <p>Lead submitted from: ${request.headers.get('referer') || 'Direct'}</p>
          <p>IP Address: ${ip}</p>
          <p>Timestamp: ${new Date().toLocaleString()}</p>
        </div>
      </div>
    `;

    // Customer auto-response email
    const customerEmailHtml = locale === 'ar' ? `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; direction: rtl;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #2c3e50;">شكراً لتواصلكم معنا!</h1>
          <p style="color: #7f8c8d; font-size: 16px;">تم استلام طلبكم بنجاح</p>
        </div>

        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <p>عزيزي/عزيزتي ${firstName}،</p>
          <p>نشكركم لاختياركم مهاجر الدولية للتصميم والمقاولات. تم استلام طلبكم للاستشارة وسيقوم فريقنا بالتواصل معكم خلال 24 ساعة.</p>

          <h3>تفاصيل طلبكم:</h3>
          <ul>
            <li>الخدمة: ${service || 'غير محدد'}</li>
            <li>الموقع: ${projectLocation || 'غير محدد'}</li>
            <li>الميزانية: ${projectBudget || 'غير محدد'}</li>
            <li>رقم الهاتف: ${phoneNumber}</li>
          </ul>
        </div>

        <div style="text-align: center; padding: 20px; background: #e8f4f8; border-radius: 8px;">
          <h3>في انتظار التواصل معكم!</h3>
          <p>📞 هاتف: +971 52 304 1482</p>
          <p>📧 البريد الإلكتروني: info@mouhajerdesign.com</p>
        </div>
      </div>
    ` : `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #2c3e50;">Thank You for Your Interest!</h1>
          <p style="color: #7f8c8d; font-size: 16px;">Your request has been received successfully</p>
        </div>

        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <p>Dear ${firstName},</p>
          <p>Thank you for choosing Mouhajer International Design and Contracting. We have received your consultation request and our team will contact you within 24 hours.</p>

          <h3>Your Request Details:</h3>
          <ul>
            <li>Service: ${service || 'Not specified'}</li>
            <li>Location: ${projectLocation || 'Not specified'}</li>
            <li>Budget: ${projectBudget || 'Not specified'}</li>
            <li>Phone: ${phoneNumber}</li>
          </ul>
        </div>

        <div style="text-align: center; padding: 20px; background: #e8f4f8; border-radius: 8px;">
          <h3>We look forward to speaking with you!</h3>
          <p>📞 Phone: +971 52 304 1482</p>
          <p>📧 Email: info@mouhajerdesign.com</p>
        </div>
      </div>
    `;

    // Send emails to all recipients
    await Promise.all([
      // Email to inquiry@mouhajerdesign.com
      transporter.sendMail({
        from: "inquiry@mouhajerdesign.com",
        to: "inquiry@mouhajerdesign.com",
        subject: `📋 New Client Enquiry: ${firstName}`,
        html: adminEmailHtml,
      }),
      // Email to info@mouhajerdesign.com
      transporter.sendMail({
        from: "inquiry@mouhajerdesign.com",
        to: "info@mouhajerdesign.com",
        subject: `📋 New Client Enquiry: ${firstName}`,
        html: adminEmailHtml,
      }),
      // Email to bassamfoaud@gmail.com
      transporter.sendMail({
        from: "inquiry@mouhajerdesign.com",
        to: "bassamfoaud@gmail.com",
        subject: `📋 New Client Enquiry: ${firstName}`,
        html: adminEmailHtml,
      }),
      // Auto-response to customer
      transporter.sendMail({
        from: "inquiry@mouhajerdesign.com",
        to: email,
        subject: locale === 'ar' ? 'شكراً لتواصلكم - مهاجر للتصميم الدولية' : 'Thank You - Mouhajer International Design',
        html: customerEmailHtml,
      })
    ]);

    // Save lead to CMS database
    try {
      const cmsUrl = cmsBaseUrl;
      if (cmsUrl) {
        const leadResponse = await fetch(`${cmsUrl}/api/leads`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: firstName,
            email,
            phone: phoneNumber,
            company,
            projectType: service || 'general_inquiry',
            budgetRange: projectBudget,
            timeline: startDate,
            city: projectLocation,
            message: projectDescription,
            source: 'contact_form',
            locale,
          }),
        });

        if (!leadResponse.ok) {
          console.error('Failed to save lead to CMS:', await leadResponse.text());
        } else {
          const leadData = await leadResponse.json();
          console.log('Lead saved to CMS:', leadData.leadId);
        }
      }
    } catch (dbError) {
      // Don't fail the request if CMS save fails
      console.error('Error saving lead to CMS (non-critical):', dbError);
    }

    return NextResponse.json({
      status: 200,
      message: "Email sent successfully"
    });
  } catch (error) {
    console.error("Error sending enquiry email:", error);
    return NextResponse.json({
      error: "Failed to send email. Please try again later.",
      details: error instanceof Error ? error.message : "Unknown error",
      status: 500
    });
  }
}
