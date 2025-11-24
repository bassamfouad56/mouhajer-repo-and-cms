import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const position = formData.get('position') as string;
    const coverLetter = formData.get('coverLetter') as string;
    const resume = formData.get('resume') as File;
    const portfolio = formData.get('portfolio') as File | null;

    // Validate required fields
    if (!name || !email || !phone || !position || !resume) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create transporter
    const transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    // Convert files to attachments
    const attachments: any[] = [];

    if (resume) {
      const resumeBuffer = Buffer.from(await resume.arrayBuffer());
      attachments.push({
        filename: resume.name,
        content: resumeBuffer,
      });
    }

    if (portfolio) {
      const portfolioBuffer = Buffer.from(await portfolio.arrayBuffer());
      attachments.push({
        filename: portfolio.name,
        content: portfolioBuffer,
      });
    }

    // Email content
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: 'careers@mouhajerdesign.com',
      subject: `Job Application: ${position} - ${name}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #0a0a0a; color: white; padding: 20px; text-align: center; }
            .content { background: #f9f9f9; padding: 30px; }
            .field { margin-bottom: 20px; }
            .label { font-weight: bold; color: #555; margin-bottom: 5px; }
            .value { color: #333; }
            .footer { text-align: center; padding: 20px; color: #888; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0; font-weight: 300; letter-spacing: 3px;">MOUHAJER DESIGN</h1>
              <p style="margin: 10px 0 0 0; font-size: 14px; opacity: 0.8;">New Job Application</p>
            </div>

            <div class="content">
              <div class="field">
                <div class="label">Position Applied For:</div>
                <div class="value" style="font-size: 18px; font-weight: bold;">${position}</div>
              </div>

              <div class="field">
                <div class="label">Applicant Name:</div>
                <div class="value">${name}</div>
              </div>

              <div class="field">
                <div class="label">Email:</div>
                <div class="value"><a href="mailto:${email}">${email}</a></div>
              </div>

              <div class="field">
                <div class="label">Phone:</div>
                <div class="value"><a href="tel:${phone}">${phone}</a></div>
              </div>

              ${coverLetter ? `
                <div class="field">
                  <div class="label">Cover Letter:</div>
                  <div class="value" style="white-space: pre-wrap;">${coverLetter}</div>
                </div>
              ` : ''}

              <div class="field">
                <div class="label">Attachments:</div>
                <div class="value">
                  ${resume ? `✓ Resume: ${resume.name}<br>` : ''}
                  ${portfolio ? `✓ Portfolio: ${portfolio.name}` : ''}
                </div>
              </div>
            </div>

            <div class="footer">
              <p>This application was submitted through the Mouhajer Design careers page.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      attachments,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return NextResponse.json({
      success: true,
      message: 'Application submitted successfully!',
    });
  } catch (error) {
    console.error('Error sending application:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to submit application. Please try again.' },
      { status: 500 }
    );
  }
}
