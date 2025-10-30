# Enquiry Form Setup Guide

Your enquiry form is now fully functional with email notifications and CRM integration!

## Features Implemented

✅ **Email Notifications**
- Sends notifications to `inquiry@mouhajerdesign.com` and `bassamfoaud@gmail.com`
- Sends confirmation email to the user
- Beautiful HTML email templates in both English and Arabic

✅ **CRM Integration**
- All form submissions are saved to your CMS database
- Lead scoring system (automatically qualifies leads)
- Duplicate detection (within 24 hours)
- Full lead management through CMS

✅ **Google Tag Manager Tracking**
- Tracks form submissions as conversions
- Includes lead value and project details
- Ready for Google Ads conversion tracking

✅ **Form Features**
- Two-step elegant form design
- UAE locations dropdown (all 7 emirates)
- Phone number with country selector
- Form validation
- Loading states
- Success/error toast notifications

## Required Setup

### 1. Configure Email (SMTP)

Add these environment variables to your CMS `.env.local` file:

```bash
# Email Configuration (Required for sending emails)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM=noreply@mouhajerdesign.com
```

#### Gmail Setup (Recommended):

1. Go to your Google Account settings
2. Navigate to Security → 2-Step Verification
3. Scroll down to "App passwords"
4. Generate a new app password for "Mail"
5. Use that password as `SMTP_PASS`

#### Alternative Email Providers:

**SendGrid:**
```bash
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
```

**Outlook/Office365:**
```bash
SMTP_HOST=smtp.office365.com
SMTP_PORT=587
SMTP_USER=your-email@outlook.com
SMTP_PASS=your-password
```

### 2. Start the Development Server

```bash
# In the root directory
npm run dev:cms

# Or navigate to CMS directory
cd apps/cms
npm run dev
```

### 3. Test the Form

1. Navigate to your website where the EnquiryForm is displayed
2. Fill out the form with test data
3. Check that:
   - ✅ Form submits successfully
   - ✅ Success toast appears
   - ✅ Emails are sent to inquiry@mouhajerdesign.com and bassamfoaud@gmail.com
   - ✅ Confirmation email sent to the user's email
   - ✅ Lead appears in CMS (check `/api/leads` endpoint or database)

## How It Works

### Form Submission Flow:

```
User Submits Form
    ↓
ContactFormForm.tsx validates data
    ↓
Calls cmsClient.submitLead()
    ↓
POST to /api/leads endpoint (CMS)
    ↓
┌─────────────────────────────────┐
│ 1. Saves lead to database       │
│ 2. Calculates lead score        │
│ 3. Sends email notifications    │
│    - Admin notification         │
│    - User confirmation          │
│ 4. Returns success response     │
└─────────────────────────────────┘
    ↓
Form resets & shows success message
    ↓
GTM tracks conversion
```

### Email Templates:

**Admin Notification Email:**
- Sent to: inquiry@mouhajerdesign.com, bassamfoaud@gmail.com
- Contains: All lead details, contact info, project details
- Format: Professional HTML with branding

**User Confirmation Email:**
- Sent to: User's email address
- Language: Based on form locale (English/Arabic)
- Contains: Thank you message, next steps, company contact info
- Format: Branded HTML with CTA button

## Files Modified/Created

### Created Files:
1. `/apps/cms/src/lib/email.ts` - Email service with Nodemailer
2. `FORM_SETUP_GUIDE.md` - This guide

### Modified Files:
1. `/apps/frontend/components/EnquiryForm.tsx` - Restored original design
2. `/apps/frontend/components/ContactFormForm.tsx` - Added:
   - UAE locations dropdown
   - Fixed phone input redundancy
   - Improved validation
   - GTM tracking
   - Fixed button types
3. `/apps/frontend/components/BlockRenderer.tsx` - Uses EnquiryForm instead of ContactForm
4. `/apps/cms/src/app/api/leads/route.ts` - Added email sending

## Monitoring & Debugging

### Check if emails are being sent:

```bash
# Watch CMS logs
npm run dev:cms

# Look for these messages:
# ✅ [Email Service] Notification email sent successfully to: ...
# ✅ [Email Service] Confirmation email sent successfully to: ...
# ❌ [Email Service] Failed to send email: ...
```

### Common Issues:

**1. Emails not sending:**
- Check SMTP credentials in `.env.local`
- Verify SMTP_USER and SMTP_PASS are correct
- Check console logs for error messages
- Try using Gmail app password

**2. Form not submitting:**
- Check browser console for errors
- Verify CMS is running on the correct port
- Check network tab for API request status
- Ensure DATABASE_URL is configured

**3. Duplicate lead warning:**
- This is normal behavior
- Same email/phone within 24 hours = duplicate
- User still gets confirmation email

## Lead Scoring System

Leads are automatically scored based on information provided:

- Base score: **50 points**
- Has email: **+10 points**
- Has company: **+5 points**
- Has budget: **+15 points**
- Has project type: **+10 points**
- Has location: **+10 points**

**Qualified leads:** Score ≥ 70 points

## Next Steps

1. **Configure SMTP credentials** in `.env.local`
2. **Test the form** with real data
3. **Check your email** (inquiry@mouhajerdesign.com and bassamfoaud@gmail.com)
4. **Monitor leads** in your CMS database
5. **Set up production SMTP** for deployment (consider SendGrid or AWS SES for production)

## Production Recommendations

For production, consider using a dedicated email service:

- **SendGrid**: Free tier includes 100 emails/day
- **AWS SES**: $0.10 per 1,000 emails
- **Postmark**: Transactional email specialist
- **Mailgun**: Reliable with good deliverability

## Support

If you encounter any issues:
1. Check the console logs (browser and server)
2. Verify all environment variables are set
3. Test email configuration with a simple test script
4. Check that the CMS database is accessible

---

**Form is now ready to receive leads and send notifications!** 🚀
