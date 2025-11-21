import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    // Validate email
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { success: false, message: 'Valid email is required' },
        { status: 400 }
      );
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    // Send confirmation email to subscriber
    await transporter.sendMail({
      from: `"Mouhajer International Design" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Welcome to Mouhajer Design Newsletter',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #fafafa;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #fafafa; padding: 40px 20px;">
              <tr>
                <td align="center">
                  <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border: 1px solid #e5e5e5;">
                    <!-- Header -->
                    <tr>
                      <td style="background-color: #0a0a0a; padding: 40px; text-align: center;">
                        <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 300; letter-spacing: 4px;">
                          MOUHAJER
                        </h1>
                        <p style="margin: 5px 0 0 0; color: #a3a3a3; font-size: 10px; letter-spacing: 2px;">
                          INTERNATIONAL DESIGN
                        </p>
                      </td>
                    </tr>

                    <!-- Content -->
                    <tr>
                      <td style="padding: 60px 40px; color: #171717;">
                        <h2 style="margin: 0 0 20px 0; font-size: 28px; font-weight: 300; color: #0a0a0a;">
                          Welcome to Our Newsletter
                        </h2>
                        <p style="margin: 0 0 20px 0; line-height: 1.8; color: #525252; font-size: 16px;">
                          Thank you for subscribing to the Mouhajer International Design newsletter!
                        </p>
                        <p style="margin: 0 0 20px 0; line-height: 1.8; color: #525252; font-size: 16px;">
                          You'll now receive:
                        </p>
                        <ul style="margin: 0 0 30px 0; padding-left: 20px; line-height: 2; color: #525252; font-size: 16px;">
                          <li>Latest design trends and inspiration</li>
                          <li>Exclusive project reveals</li>
                          <li>Design tips from our experts</li>
                          <li>News and updates from our studio</li>
                        </ul>
                        <p style="margin: 0 0 20px 0; line-height: 1.8; color: #525252; font-size: 16px;">
                          We're excited to share our passion for luxury interior design with you.
                        </p>
                      </td>
                    </tr>

                    <!-- CTA -->
                    <tr>
                      <td style="padding: 0 40px 60px 40px; text-align: center;">
                        <a href="${process.env.NEXT_PUBLIC_SITE_URL}/projects"
                           style="display: inline-block; padding: 16px 40px; background-color: #0a0a0a; color: #ffffff; text-decoration: none; font-size: 14px; letter-spacing: 2px;">
                          VIEW OUR PROJECTS
                        </a>
                      </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                      <td style="background-color: #fafafa; padding: 40px; text-align: center; border-top: 1px solid #e5e5e5;">
                        <p style="margin: 0 0 10px 0; color: #737373; font-size: 14px;">
                          Mouhajer International Design
                        </p>
                        <p style="margin: 0 0 10px 0; color: #737373; font-size: 14px;">
                          Dubai, UAE
                        </p>
                        <p style="margin: 0 0 20px 0; color: #737373; font-size: 14px;">
                          <a href="mailto:${process.env.NEXT_PUBLIC_EMAIL}" style="color: #737373; text-decoration: none;">
                            ${process.env.NEXT_PUBLIC_EMAIL}
                          </a>
                        </p>
                        <p style="margin: 0; color: #a3a3a3; font-size: 12px;">
                          You received this email because you subscribed to our newsletter.
                          <br>
                          <a href="${process.env.NEXT_PUBLIC_SITE_URL}" style="color: #737373; text-decoration: underline;">
                            Unsubscribe
                          </a>
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
    });

    // Send notification to admin
    await transporter.sendMail({
      from: `"Mouhajer Website" <${process.env.SMTP_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: 'New Newsletter Subscription',
      html: `
        <!DOCTYPE html>
        <html>
          <body style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>New Newsletter Subscription</h2>
            <p>A new user has subscribed to the newsletter:</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
          </body>
        </html>
      `,
    });

    return NextResponse.json(
      { success: true, message: 'Successfully subscribed to newsletter' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to subscribe. Please try again.' },
      { status: 500 }
    );
  }
}
