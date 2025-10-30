# Production Environment Setup

Your local environment is now configured! Here's how to add the same configuration to production.

## ✅ Local Setup Complete

The following has been added to `apps/cms/.env.local`:

```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=mouhajergallery@gmail.com
SMTP_PASS=ubzyuauifiitxwky
EMAIL_FROM=noreply@mouhajerdesign.com
```

**Next:** Restart your local CMS server to apply these changes:
```bash
# Stop the current server (Ctrl+C) then run:
npm run dev:cms
```

---

## 🌐 Production Setup (Vercel)

You have **TWO OPTIONS** to add environment variables to production:

### Option 1: Automatic Setup (Recommended)

Run the provided script:

```bash
# From the root directory
./setup-production-env.sh
```

This script will:
1. Check if Vercel CLI is installed
2. Add all SMTP variables to your production environment
3. Guide you through redeployment

**If Vercel CLI is not installed:**
```bash
npm install -g vercel
vercel login
```

### Option 2: Manual Setup via Vercel Dashboard

1. **Go to Vercel Dashboard:**
   - Visit: https://vercel.com/dashboard
   - Select your Mouhajer CMS project

2. **Navigate to Settings:**
   - Click on "Settings" tab
   - Click on "Environment Variables" in the sidebar

3. **Add each variable:**

   Click "Add New" and enter each variable:

   | Name | Value | Environment |
   |------|-------|-------------|
   | `SMTP_HOST` | `smtp.gmail.com` | Production |
   | `SMTP_PORT` | `587` | Production |
   | `SMTP_USER` | `mouhajergallery@gmail.com` | Production |
   | `SMTP_PASS` | `ubzyuauifiitxwky` | Production |
   | `EMAIL_FROM` | `noreply@mouhajerdesign.com` | Production |

4. **Save and Redeploy:**
   - After adding all variables, trigger a new deployment
   - Go to "Deployments" tab → Click "Redeploy" on the latest deployment
   - Or push a new commit to trigger automatic deployment

---

## 🚀 Deploy to Production

After adding environment variables, deploy your changes:

### Using Vercel CLI:
```bash
# Deploy CMS to production
cd apps/cms
vercel --prod
```

### Using Git (Automatic):
```bash
# Commit and push (if you have auto-deploy enabled)
git add .
git commit -m "Add email notifications to enquiry form"
git push origin main
```

---

## ✅ Testing Production

Once deployed, test the form:

1. **Visit your production website**
2. **Fill out the enquiry form**
3. **Verify:**
   - ✅ Form submits successfully
   - ✅ You receive emails at:
     - inquiry@mouhajerdesign.com
     - bassamfoaud@gmail.com
   - ✅ User receives confirmation email
   - ✅ Lead appears in CMS database

---

## 🔒 Security Notes

### Gmail Security:
- ✅ Using Gmail App Password (more secure than regular password)
- ✅ App Password is restricted to SMTP only
- ✅ Can be revoked anytime in Google Account settings

### Best Practices:
- 🔐 Never commit `.env.local` files to Git
- 🔐 Environment variables in Vercel are encrypted
- 🔐 Only use App Passwords, never your main Gmail password

---

## 📊 Monitoring Emails in Production

### Check Vercel Logs:
```bash
vercel logs --follow
```

### Or via Dashboard:
1. Go to Vercel Dashboard
2. Select your project
3. Click on a deployment
4. View "Functions" logs to see email sending status

Look for these log messages:
- ✅ `[Email Service] Notification email sent successfully`
- ✅ `[Email Service] Confirmation email sent successfully`
- ❌ `[Email Service] Failed to send email` (if there are issues)

---

## 🆘 Troubleshooting

### Emails not sending in production?

1. **Verify environment variables are set:**
   ```bash
   vercel env ls
   ```

2. **Check recent deployment logs:**
   ```bash
   vercel logs
   ```

3. **Verify Gmail settings:**
   - Ensure 2-Step Verification is enabled
   - Check App Password is still valid
   - Try regenerating App Password if needed

4. **Test SMTP credentials:**
   - Create a simple test script locally with production credentials
   - Verify SMTP access isn't blocked

### Form not submitting?

1. Check browser console for errors
2. Verify CMS API endpoint is accessible
3. Check network tab for failed requests
4. Review Vercel function logs

---

## 📈 Production Recommendations

For high-volume production use, consider upgrading to a dedicated email service:

### Recommended Services:

1. **SendGrid** (Recommended)
   - Free tier: 100 emails/day
   - Better deliverability
   - Detailed analytics
   - Easy setup

   ```bash
   SMTP_HOST=smtp.sendgrid.net
   SMTP_PORT=587
   SMTP_USER=apikey
   SMTP_PASS=your_sendgrid_api_key
   ```

2. **AWS SES**
   - Very low cost: $0.10 per 1,000 emails
   - Highly scalable
   - Requires AWS account

3. **Postmark**
   - Transactional email specialist
   - Great deliverability
   - Developer-friendly

### Why upgrade from Gmail?

- 📊 Better analytics and tracking
- 🚀 Higher sending limits
- 📧 Better deliverability rates
- 🛡️ Professional email infrastructure
- 📈 Detailed bounce/complaint handling

---

## 📝 Current Configuration Summary

### Local Development:
- ✅ SMTP configured in `apps/cms/.env.local`
- ✅ Emails sent from: mouhajergallery@gmail.com
- ✅ Notifications to: inquiry@mouhajerdesign.com, bassamfoaud@gmail.com

### Production (After Setup):
- 🔄 Add variables via script or Vercel dashboard
- 🔄 Deploy to production
- 🔄 Test form submission

---

**Ready to deploy?** Run the setup script or add variables manually, then deploy! 🚀
