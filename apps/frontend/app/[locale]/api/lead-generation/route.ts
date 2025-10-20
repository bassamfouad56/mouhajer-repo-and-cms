import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

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

    const body = await request.json();

    // Validate required fields
    const { name, email, phone, projectType, budget, message, locale } = body;

    if (!name || !email || !phone || !projectType) {
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

    // Create transporter for sending emails
    const transporter = nodemailer.createTransport({
      host: process.env['SMTP_HOST'] || "smtp.gmail.com",
      port: parseInt(process.env['SMTP_PORT'] || "587"),
      secure: false,
      auth: {
        user: process.env['SMTP_USER'],
        pass: process.env['SMTP_PASSWORD'],
      },
    });

    // Email to admin
    const adminEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #2c3e50; margin-bottom: 10px;">🏡 New Lead from Website</h1>
          <p style="color: #7f8c8d; font-size: 16px;">High-quality lead from lead generation popup</p>
        </div>

        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="color: #2c3e50; margin-top: 0;">Lead Information</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr style="border-bottom: 1px solid #e9ecef;">
              <td style="padding: 10px 0; font-weight: bold; color: #495057;">Name:</td>
              <td style="padding: 10px 0; color: #495057;">${name}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e9ecef;">
              <td style="padding: 10px 0; font-weight: bold; color: #495057;">Email:</td>
              <td style="padding: 10px 0; color: #495057;"><a href="mailto:${email}" style="color: #007bff; text-decoration: none;">${email}</a></td>
            </tr>
            <tr style="border-bottom: 1px solid #e9ecef;">
              <td style="padding: 10px 0; font-weight: bold; color: #495057;">Phone:</td>
              <td style="padding: 10px 0; color: #495057;"><a href="tel:${phone}" style="color: #007bff; text-decoration: none;">${phone}</a></td>
            </tr>
            <tr style="border-bottom: 1px solid #e9ecef;">
              <td style="padding: 10px 0; font-weight: bold; color: #495057;">Project Type:</td>
              <td style="padding: 10px 0; color: #495057;">${projectType}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e9ecef;">
              <td style="padding: 10px 0; font-weight: bold; color: #495057;">Budget:</td>
              <td style="padding: 10px 0; color: #495057;">${budget || 'Not specified'}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e9ecef;">
              <td style="padding: 10px 0; font-weight: bold; color: #495057;">Language:</td>
              <td style="padding: 10px 0; color: #495057;">${locale === 'ar' ? 'Arabic' : 'English'}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; font-weight: bold; color: #495057;">Message:</td>
              <td style="padding: 10px 0; color: #495057;">${message || 'No additional message'}</td>
            </tr>
          </table>
        </div>

        <div style="text-align: center; padding: 20px; background: #e8f4f8; border-radius: 8px;">
          <p style="color: #2c3e50; margin: 0; font-weight: bold;">⚡ Quick Actions</p>
          <div style="margin-top: 15px;">
            <a href="tel:${phone}" style="display: inline-block; margin: 5px; padding: 10px 20px; background: #28a745; color: white; text-decoration: none; border-radius: 5px;">📞 Call Now</a>
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

    // Email to customer (auto-response)
    const customerEmailHtml = locale === 'ar' ? `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; direction: rtl;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #2c3e50;">شكراً لتواصلكم معنا!</h1>
          <p style="color: #7f8c8d; font-size: 16px;">تم استلام طلبكم بنجاح</p>
        </div>

        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <p>عزيزي/عزيزتي ${name}،</p>
          <p>نشكركم لاختياركم مهاجر الدولية للتصميم والمقاولات. تم استلام طلبكم للاستشارة المجانية وسيقوم فريقنا بالتواصل معكم خلال 24 ساعة.</p>

          <h3>تفاصيل طلبكم:</h3>
          <ul>
            <li>نوع المشروع: ${projectType}</li>
            <li>الميزانية: ${budget || 'غير محدد'}</li>
            <li>رقم الهاتف: ${phone}</li>
          </ul>
        </div>

        <div style="text-align: center; padding: 20px; background: #e8f4f8; border-radius: 8px;">
          <h3>في انتظار التواصل معكم!</h3>
          <p>📞 هاتف: +971 4 323 4567</p>
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
          <p>Dear ${name},</p>
          <p>Thank you for choosing Mouhajer International Design and Contracting. We have received your request for a free consultation and our team will contact you within 24 hours.</p>

          <h3>Your Request Details:</h3>
          <ul>
            <li>Project Type: ${projectType}</li>
            <li>Budget: ${budget || 'Not specified'}</li>
            <li>Phone: ${phone}</li>
          </ul>
        </div>

        <div style="text-align: center; padding: 20px; background: #e8f4f8; border-radius: 8px;">
          <h3>We look forward to speaking with you!</h3>
          <p>📞 Phone: +971 4 323 4567</p>
          <p>📧 Email: info@mouhajerdesign.com</p>
        </div>
      </div>
    `;

    // Send emails to all recipients
    await Promise.all([
      // Email to inquiry@mouhajerdesign.com
      transporter.sendMail({
        from: process.env['SMTP_FROM'] || '"Mouhajer Design" <noreply@mouhajerdesign.com>',
        to: "inquiry@mouhajerdesign.com",
        subject: `🏡 New Lead: ${name} - ${projectType}`,
        html: adminEmailHtml,
      }),
      // Email to info@mouhajerdesign.com
      transporter.sendMail({
        from: process.env['SMTP_FROM'] || '"Mouhajer Design" <noreply@mouhajerdesign.com>',
        to: "info@mouhajerdesign.com",
        subject: `🏡 New Lead: ${name} - ${projectType}`,
        html: adminEmailHtml,
      }),
      // Email to bassamfoaud@gmail.com
      transporter.sendMail({
        from: process.env['SMTP_FROM'] || '"Mouhajer Design" <noreply@mouhajerdesign.com>',
        to: "bassamfoaud@gmail.com",
        subject: `🏡 New Lead: ${name} - ${projectType}`,
        html: adminEmailHtml,
      }),
      // Auto-response to customer
      transporter.sendMail({
        from: process.env['SMTP_FROM'] || '"Mouhajer Design" <noreply@mouhajerdesign.com>',
        to: email,
        subject: locale === 'ar' ? 'شكراً لتواصلكم - مهاجر للتصميم الدولية' : 'Thank You - Mouhajer International Design',
        html: customerEmailHtml,
      })
    ]);

    // Save lead to CMS database
    try {
      const cmsUrl = process.env['NEXT_PUBLIC_CMS_URL'];
      if (cmsUrl) {
        const leadResponse = await fetch(`${cmsUrl}/api/leads`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name,
            email,
            phone,
            projectType,
            budgetRange: budget,
            source: 'lead_popup',
            locale,
            city: null,
            area: null,
            message: `Lead from popup - Project Type: ${projectType}, Budget: ${budget || 'Not specified'}`,
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

    return NextResponse.json(
      {
        message: "Lead submitted successfully",
        status: "success"
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Lead generation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}