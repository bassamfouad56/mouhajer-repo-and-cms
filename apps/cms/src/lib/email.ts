import nodemailer from 'nodemailer';

// Email configuration
const SMTP_HOST = process.env.SMTP_HOST || 'smtp.gmail.com';
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '587');
const SMTP_USER = process.env.SMTP_USER || '';
const SMTP_PASS = process.env.SMTP_PASS || '';
const EMAIL_FROM = process.env.EMAIL_FROM || 'noreply@mouhajerdesign.com';

// Create reusable transporter
let transporter: nodemailer.Transporter | null = null;

function getTransporter() {
  if (!transporter) {
    if (!SMTP_USER || !SMTP_PASS) {
      console.warn('[Email Service] SMTP credentials not configured. Emails will not be sent.');
      console.warn('Please set SMTP_USER and SMTP_PASS environment variables.');
      return null;
    }

    transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });
  }
  return transporter;
}

interface LeadData {
  name: string;
  email?: string;
  phone: string;
  company?: string;
  projectType?: string;
  service?: string;
  projectLocation?: string;
  budget?: string;
  timeline?: string;
  message?: string;
  locale?: string;
}

/**
 * Send notification email to admin/sales team
 */
export async function sendLeadNotificationEmail(leadData: LeadData) {
  const transport = getTransporter();
  if (!transport) {
    console.warn('[Email Service] Skipping notification email - SMTP not configured');
    return { success: false, error: 'SMTP not configured' };
  }

  try {
    const subject = `New Lead: ${leadData.name} - ${leadData.projectType || 'Inquiry'}`;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #202020; color: white; padding: 20px; text-align: center; }
            .content { background-color: #f9f9f9; padding: 20px; }
            .field { margin-bottom: 15px; }
            .label { font-weight: bold; color: #202020; }
            .value { color: #555; }
            .footer { text-align: center; padding: 20px; color: #888; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>New Lead Submission</h1>
            </div>
            <div class="content">
              <div class="field">
                <span class="label">Name:</span>
                <span class="value">${leadData.name}</span>
              </div>
              ${leadData.email ? `
                <div class="field">
                  <span class="label">Email:</span>
                  <span class="value"><a href="mailto:${leadData.email}">${leadData.email}</a></span>
                </div>
              ` : ''}
              <div class="field">
                <span class="label">Phone:</span>
                <span class="value"><a href="tel:${leadData.phone}">${leadData.phone}</a></span>
              </div>
              ${leadData.company ? `
                <div class="field">
                  <span class="label">Company:</span>
                  <span class="value">${leadData.company}</span>
                </div>
              ` : ''}
              ${leadData.projectType || leadData.service ? `
                <div class="field">
                  <span class="label">Service/Project Type:</span>
                  <span class="value">${leadData.projectType || leadData.service}</span>
                </div>
              ` : ''}
              ${leadData.projectLocation ? `
                <div class="field">
                  <span class="label">Project Location:</span>
                  <span class="value">${leadData.projectLocation}</span>
                </div>
              ` : ''}
              ${leadData.budget ? `
                <div class="field">
                  <span class="label">Budget:</span>
                  <span class="value">${leadData.budget}</span>
                </div>
              ` : ''}
              ${leadData.timeline ? `
                <div class="field">
                  <span class="label">Timeline:</span>
                  <span class="value">${leadData.timeline}</span>
                </div>
              ` : ''}
              ${leadData.message ? `
                <div class="field">
                  <span class="label">Message:</span>
                  <div class="value">${leadData.message.replace(/\n/g, '<br>')}</div>
                </div>
              ` : ''}
              <div class="field">
                <span class="label">Submission Date:</span>
                <span class="value">${new Date().toLocaleString()}</span>
              </div>
            </div>
            <div class="footer">
              <p>This is an automated notification from Mouhajer Design website.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Send to both email addresses
    const recipients = ['inquiry@mouhajerdesign.com', 'bassamfoaud@gmail.com'];

    await transport.sendMail({
      from: EMAIL_FROM,
      to: recipients.join(', '),
      subject: subject,
      html: html,
    });

    console.log('[Email Service] Notification email sent successfully to:', recipients.join(', '));
    return { success: true };
  } catch (error) {
    console.error('[Email Service] Failed to send notification email:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

/**
 * Send confirmation email to the user
 */
export async function sendLeadConfirmationEmail(leadData: LeadData) {
  const transport = getTransporter();
  if (!transport || !leadData.email) {
    console.warn('[Email Service] Skipping confirmation email - SMTP not configured or no email provided');
    return { success: false, error: 'SMTP not configured or no email' };
  }

  try {
    const isArabic = leadData.locale === 'ar';

    const subject = isArabic
      ? 'شكراً لتواصلك مع موهاجر للتصميم'
      : 'Thank You for Contacting Mouhajer Design';

    const html = isArabic ? `
      <!DOCTYPE html>
      <html dir="rtl">
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.8; color: #333; direction: rtl; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #202020; color: white; padding: 30px; text-align: center; }
            .content { background-color: #F2F1E5; padding: 30px; }
            .footer { text-align: center; padding: 20px; color: #888; font-size: 12px; }
            .cta-button {
              display: inline-block;
              background-color: #202020;
              color: white;
              padding: 12px 30px;
              text-decoration: none;
              margin: 20px 0;
              border-radius: 4px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>موهاجر الدولية للتصميم</h1>
            </div>
            <div class="content">
              <h2>عزيزي/عزيزتي ${leadData.name}،</h2>
              <p>شكراً لتواصلك معنا! نحن في موهاجر للتصميم نقدر اهتمامك بخدماتنا.</p>
              <p>لقد استلمنا طلبك وسيقوم فريقنا بمراجعته والتواصل معك في أقرب وقت ممكن.</p>
              <p><strong>تفاصيل طلبك:</strong></p>
              <ul>
                ${leadData.projectType || leadData.service ? `<li>نوع الخدمة: ${leadData.projectType || leadData.service}</li>` : ''}
                ${leadData.projectLocation ? `<li>الموقع: ${leadData.projectLocation}</li>` : ''}
              </ul>
              <p>في الوقت ذاته، ندعوك لاستكشاف أعمالنا السابقة ومشاريعنا المميزة على موقعنا الإلكتروني.</p>
              <div style="text-align: center;">
                <a href="https://mouhajerdesign.com" class="cta-button">زيارة الموقع</a>
              </div>
              <p>إذا كان لديك أي استفسارات عاجلة، لا تتردد في الاتصال بنا:</p>
              <p>
                📧 <a href="mailto:inquiry@mouhajerdesign.com">inquiry@mouhajerdesign.com</a><br>
                📱 <a href="tel:+97143388988">+971 4 338 8988</a>
              </p>
              <p>مع أطيب التحيات،<br>فريق موهاجر للتصميم</p>
            </div>
            <div class="footer">
              <p>موهاجر الدولية للتصميم - التصميم الداخلي الفاخر في دبي</p>
            </div>
          </div>
        </body>
      </html>
    ` : `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #202020; color: white; padding: 30px; text-align: center; }
            .content { background-color: #F2F1E5; padding: 30px; }
            .footer { text-align: center; padding: 20px; color: #888; font-size: 12px; }
            .cta-button {
              display: inline-block;
              background-color: #202020;
              color: white;
              padding: 12px 30px;
              text-decoration: none;
              margin: 20px 0;
              border-radius: 4px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Mouhajer International Design</h1>
            </div>
            <div class="content">
              <h2>Dear ${leadData.name},</h2>
              <p>Thank you for reaching out to us! We at Mouhajer Design appreciate your interest in our services.</p>
              <p>We have received your inquiry and our team will review it and get back to you as soon as possible.</p>
              <p><strong>Your Inquiry Details:</strong></p>
              <ul>
                ${leadData.projectType || leadData.service ? `<li>Service Type: ${leadData.projectType || leadData.service}</li>` : ''}
                ${leadData.projectLocation ? `<li>Location: ${leadData.projectLocation}</li>` : ''}
              </ul>
              <p>In the meantime, we invite you to explore our previous work and featured projects on our website.</p>
              <div style="text-align: center;">
                <a href="https://mouhajerdesign.com" class="cta-button">Visit Our Website</a>
              </div>
              <p>If you have any urgent questions, please don't hesitate to contact us:</p>
              <p>
                📧 <a href="mailto:inquiry@mouhajerdesign.com">inquiry@mouhajerdesign.com</a><br>
                📱 <a href="tel:+97143388988">+971 4 338 8988</a>
              </p>
              <p>Best regards,<br>Mouhajer Design Team</p>
            </div>
            <div class="footer">
              <p>Mouhajer International Design - High-End Interior Design in Dubai</p>
            </div>
          </div>
        </body>
      </html>
    `;

    await transport.sendMail({
      from: EMAIL_FROM,
      to: leadData.email,
      subject: subject,
      html: html,
    });

    console.log('[Email Service] Confirmation email sent successfully to:', leadData.email);
    return { success: true };
  } catch (error) {
    console.error('[Email Service] Failed to send confirmation email:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

/**
 * Send both notification and confirmation emails
 */
export async function sendLeadEmails(leadData: LeadData) {
  const results = await Promise.allSettled([
    sendLeadNotificationEmail(leadData),
    sendLeadConfirmationEmail(leadData),
  ]);

  return {
    notification: results[0].status === 'fulfilled' ? results[0].value : { success: false },
    confirmation: results[1].status === 'fulfilled' ? results[1].value : { success: false },
  };
}
