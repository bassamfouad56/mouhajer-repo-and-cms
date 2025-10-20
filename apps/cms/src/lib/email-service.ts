/**
 * Email Service - Magic Link Email Sending
 * Sends verification emails with magic links for room redesign results
 */

import nodemailer from 'nodemailer';

// Create reusable transporter
const transporter = nodemailer.createTransporter({
  host: process.env.EMAIL_HOST || 'smtp.zoho.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: false, // Use TLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

/**
 * Send email using configured transporter
 */
export async function sendEmail(options: EmailOptions): Promise<void> {
  try {
    const from = process.env.EMAIL_FROM || `"Mouhajer Design" <${process.env.EMAIL_USER}>`;

    await transporter.sendMail({
      from,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text || options.html.replace(/<[^>]*>/g, ''), // Strip HTML for text version
    });

    console.log(`[Email Service] Email sent successfully to ${options.to}`);
  } catch (error) {
    console.error(`[Email Service] Failed to send email to ${options.to}:`, error);
    throw new Error(`Failed to send email: ${error}`);
  }
}

/**
 * Send room redesign magic link email
 */
export async function sendRedesignEmail(
  email: string,
  token: string,
  redesignId: string
): Promise<void> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3010';
  const magicLink = `${appUrl}/room-redesign/view?token=${token}`;

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your AI Room Redesign is Ready!</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);">

          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 20px; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">
                🎨 Your Room Transformation is Ready!
              </h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 20px; color: #333333; font-size: 16px; line-height: 24px;">
                Great news! We've used cutting-edge AI technology to create a stunning redesign of your space.
              </p>

              <p style="margin: 0 0 30px; color: #666666; font-size: 14px; line-height: 22px;">
                Your personalized before-and-after comparison is now available to view. Simply click the button below to see your transformed space and explore the possibilities!
              </p>

              <!-- CTA Button -->
              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td align="center" style="padding: 20px 0;">
                    <a href="${magicLink}"
                       style="display: inline-block;
                              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                              color: #ffffff;
                              text-decoration: none;
                              padding: 16px 40px;
                              border-radius: 6px;
                              font-size: 16px;
                              font-weight: bold;
                              box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);">
                      View My Redesign →
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Features -->
              <div style="margin: 30px 0; padding: 20px; background-color: #f8f9fa; border-radius: 6px; border-left: 4px solid #667eea;">
                <p style="margin: 0 0 10px; color: #333333; font-size: 14px; font-weight: bold;">
                  What's included:
                </p>
                <ul style="margin: 0; padding: 0 0 0 20px; color: #666666; font-size: 14px; line-height: 22px;">
                  <li>Interactive before & after slider</li>
                  <li>High-quality AI-generated images</li>
                  <li>Downloadable results</li>
                  <li>Shareable link for friends & family</li>
                </ul>
              </div>

              <!-- Alternative Link -->
              <p style="margin: 30px 0 0; color: #999999; font-size: 12px; line-height: 18px;">
                Button not working? Copy and paste this link into your browser:<br>
                <a href="${magicLink}" style="color: #667eea; word-break: break-all;">${magicLink}</a>
              </p>

              <!-- Security Notice -->
              <div style="margin: 30px 0 0; padding: 15px; background-color: #fff3cd; border-radius: 6px; border-left: 4px solid #ffc107;">
                <p style="margin: 0; color: #856404; font-size: 13px; line-height: 20px;">
                  🔒 <strong>Security Note:</strong> This link is unique to you and expires in 24 hours for your privacy and security.
                </p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; background-color: #f8f9fa; border-radius: 0 0 8px 8px; border-top: 1px solid #e9ecef;">
              <p style="margin: 0 0 10px; color: #666666; font-size: 14px; line-height: 20px; text-align: center;">
                <strong>Mouhajer Design</strong><br>
                Transforming spaces with AI-powered creativity
              </p>

              <p style="margin: 20px 0 0; color: #999999; font-size: 12px; line-height: 18px; text-align: center;">
                Have questions? Reply to this email or visit our website.<br>
                <a href="${appUrl}" style="color: #667eea; text-decoration: none;">www.mouhajerdesign.com</a>
              </p>
            </td>
          </tr>
        </table>

        <!-- Spam Warning -->
        <p style="margin: 20px 0 0; color: #999999; font-size: 11px; line-height: 16px; text-align: center; max-width: 600px;">
          You received this email because you requested an AI room redesign at Mouhajer Design.
          This is a one-time notification and you won't receive further emails unless you submit another redesign request.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  const text = `
Your AI Room Redesign is Ready!

Great news! We've used cutting-edge AI technology to create a stunning redesign of your space.

Click here to view your before-and-after comparison:
${magicLink}

This link expires in 24 hours for your security.

What's included:
- Interactive before & after slider
- High-quality AI-generated images
- Downloadable results
- Shareable link for friends & family

---
Mouhajer Design
Transforming spaces with AI-powered creativity
${appUrl}
  `.trim();

  await sendEmail({
    to: email,
    subject: '🎨 Your AI Room Redesign is Ready to View!',
    html,
    text,
  });
}

/**
 * Send error notification email (if AI generation fails)
 */
export async function sendErrorEmail(
  email: string,
  errorType: 'generation_failed' | 'upload_failed' | 'unknown'
): Promise<void> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3010';

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Room Redesign Issue</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);">

          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 20px; color: #dc3545; font-size: 24px;">
                ⚠️ Issue with Your Room Redesign
              </h2>

              <p style="margin: 0 0 20px; color: #333333; font-size: 16px; line-height: 24px;">
                We're sorry, but we encountered an issue while processing your room redesign request.
              </p>

              <p style="margin: 0 0 30px; color: #666666; font-size: 14px; line-height: 22px;">
                Our team has been notified and is working to resolve this. Please try uploading your image again, or contact us for assistance.
              </p>

              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td align="center" style="padding: 20px 0;">
                    <a href="${appUrl}/room-redesign"
                       style="display: inline-block;
                              background-color: #667eea;
                              color: #ffffff;
                              text-decoration: none;
                              padding: 14px 32px;
                              border-radius: 6px;
                              font-size: 16px;
                              font-weight: bold;">
                      Try Again
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 30px 0 0; color: #666666; font-size: 14px; line-height: 22px; text-align: center;">
                Need help? Contact us at <a href="mailto:${process.env.EMAIL_USER}" style="color: #667eea;">${process.env.EMAIL_USER}</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  await sendEmail({
    to: email,
    subject: 'Issue with Your Room Redesign Request',
    html,
  });
}

/**
 * Verify email configuration is valid
 */
export async function verifyEmailConfig(): Promise<boolean> {
  try {
    await transporter.verify();
    console.log('[Email Service] Email configuration verified successfully');
    return true;
  } catch (error) {
    console.error('[Email Service] Email configuration verification failed:', error);
    return false;
  }
}
