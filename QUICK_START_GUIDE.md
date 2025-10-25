# Quick Start Guide - Google Ads & Tag Manager Integration

This guide will get you up and running in under 15 minutes!

## What You Just Got

A complete Google Ads + Tag Manager integration with:
- 📊 Beautiful dashboards with real-time data
- 📈 Professional charts and visualizations
- 🔄 One-click data synchronization
- 🎨 Better UI than Google's native platforms
- 💾 All data stored in your database

## Prerequisites Checklist

Before you start, make sure you have:
- [ ] Google Ads account with active campaigns
- [ ] Google Tag Manager account (optional)
- [ ] Google Cloud Console access
- [ ] Admin access to your Google Ads account
- [ ] Your CMS running locally or in production

## 5-Minute Setup for Google Ads

### Step 1: Run Database Migration (1 minute)

Open your terminal and run:

```bash
cd /Users/bassamfouad/Desktop/website/mouhajer-repo-and-cms/apps/cms
npx prisma db push
```

**Note**: If you get a database connection error, make sure your database is running and accessible.

### Step 2: Get Your Credentials (5 minutes)

You need 5 pieces of information:

#### A. Developer Token
1. Go to [Google Ads](https://ads.google.com/)
2. Click **Tools & Settings** → **Setup** → **API Center**
3. Copy your **Developer Token**

#### B. Customer ID
1. Look at top-right corner of Google Ads dashboard
2. You'll see something like `123-456-7890`
3. Remove dashes → `1234567890`

#### C. OAuth2 Credentials (Client ID & Secret)
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project or select existing
3. **Enable API**: Search for "Google Ads API" and enable it
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Choose **Web application**
6. Add redirect URI: `http://localhost:3010/oauth/callback` (or your domain)
7. Save and copy **Client ID** and **Client Secret**

#### D. Refresh Token
1. Go to [OAuth Playground](https://developers.google.com/oauthplayground/)
2. Click ⚙️ (settings) → Check "Use your own OAuth credentials"
3. Paste your Client ID and Client Secret
4. In left panel, scroll to "Google Ads API v17"
5. Select `https://www.googleapis.com/auth/adwords`
6. Click **Authorize APIs** → Sign in with Google
7. Click **Exchange authorization code for tokens**
8. Copy the **Refresh token**

### Step 3: Add Account in CMS (2 minutes)

1. Start your CMS:
   ```bash
   npm run dev
   ```

2. Open browser: `http://localhost:3010/analytics/settings`

3. Click **Add Account** button

4. Fill in the form:
   - **Account Name**: Any name (e.g., "Main Ads Account")
   - **Customer ID**: Your 10-digit ID
   - **Developer Token**: From Step 2A
   - **Client ID**: From Step 2C
   - **Client Secret**: From Step 2C
   - **Refresh Token**: From Step 2D
   - **Login Customer ID**: Leave empty (unless using MCC)

5. Click **Add Account**

### Step 4: Sync & View Data (1 minute)

1. Go to `http://localhost:3010/analytics`
2. Select your account from dropdown
3. Choose date range (default is last 30 days)
4. Click **Sync Data** button
5. Wait 10-30 seconds
6. View your beautiful dashboard! 🎉

## Optional: Google Tag Manager Setup (10 minutes)

### Step 1: Create Service Account (5 minutes)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Same project as before (or create new)
3. **Enable API**: Search for "Tag Manager API" and enable it
4. Go to **Credentials** → **Create Credentials** → **Service Account**
5. Name: "GTM API Access"
6. Click **Create and Continue**
7. Grant role: **Basic** → **Editor** (or leave empty)
8. Click **Done**
9. Click on the service account you just created
10. Go to **Keys** tab → **Add Key** → **Create new key** → **JSON**
11. Save the JSON file

### Step 2: Grant Access in GTM (2 minutes)

1. Open [Google Tag Manager](https://tagmanager.google.com/)
2. Click **Admin** (top right)
3. Under Account, click **User Management**
4. Click ➕ (Add people)
5. Paste the email from JSON file (looks like `something@project.iam.gserviceaccount.com`)
6. Set permissions: **Publish** or **Edit**
7. Click **Invite**

### Step 3: Get Account Info (1 minute)

Look at your GTM URL. It looks like:
```
tagmanager.google.com/#/admin/accounts/1234567/
```

You need:
- **Account ID**: `1234567`
- **Account Path**: `accounts/1234567`

### Step 4: Add GTM Account (2 minutes)

1. Go to `http://localhost:3010/analytics/settings`
2. Click **Google Tag Manager** tab
3. Click **Add Account**
4. Fill in:
   - **Account Name**: Any name
   - **Account ID**: From Step 3
   - **Account Path**: From Step 3 (format: `accounts/123456`)
   - **Client Email**: From JSON file (`client_email` field)
   - **Project ID**: From JSON file (`project_id` field)
   - **Private Key**: Copy entire private key from JSON (including `-----BEGIN PRIVATE KEY-----`)

5. Click **Add Account**

### Step 5: Sync GTM (1 minute)

1. Go to `http://localhost:3010/analytics/gtm`
2. Select your account
3. Click **Sync GTM Data**
4. Select a container
5. Browse tags, triggers, and variables! 🎉

## Troubleshooting

### "Can't reach database server"
- Make sure PostgreSQL is running
- Check connection string in `.env` file
- Verify database credentials

### "PERMISSION_DENIED" (Google Ads)
- Developer token not approved? It may still work in test mode
- Customer ID wrong? Check format (no dashes)
- OAuth scopes wrong? Must include `adwords` scope

### "PERMISSION_DENIED" (GTM)
- Service account not added to GTM? Check User Management
- Wrong permissions? Must be Edit or Publish
- Tag Manager API not enabled? Enable in Cloud Console

### "No data available"
- Click "Sync Data" first
- Check date range (must have data in that period)
- Verify campaigns are active in Google Ads

### Charts not showing
- Clear browser cache
- Check browser console for errors
- Verify Recharts is installed: `npm list recharts`

## Navigation

Once set up, access your dashboards:

- **Google Ads Dashboard**: `http://localhost:3010/analytics`
- **GTM Dashboard**: `http://localhost:3010/analytics/gtm`
- **Settings**: `http://localhost:3010/analytics/settings`

## What's Next?

### Explore Features
- Try different date ranges
- Compare metrics across campaigns
- Export data (add this feature if needed)
- Set up automated syncing (cron job)

### Customize
- Add more metrics to dashboards
- Create custom reports
- Build email alerts
- Add budget monitoring

### Scale
- Add multiple accounts
- Set up Redis caching
- Implement webhooks
- Add user permissions

## Need Help?

Check the comprehensive docs:
- **Full Documentation**: [apps/cms/GOOGLE_ANALYTICS_INTEGRATION.md](apps/cms/GOOGLE_ANALYTICS_INTEGRATION.md)
- **Implementation Summary**: [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)

## Resources

- [Google Ads API Docs](https://developers.google.com/google-ads/api/docs/start)
- [GTM API Docs](https://developers.google.com/tag-platform/tag-manager/api/v2)
- [OAuth 2.0 Playground](https://developers.google.com/oauthplayground/)
- [Google Cloud Console](https://console.cloud.google.com/)

## Success Checklist

After setup, you should be able to:
- [ ] See your accounts in Settings page
- [ ] Sync Google Ads data successfully
- [ ] View metrics on dashboard
- [ ] See charts with real data
- [ ] Switch between date ranges
- [ ] (Optional) View GTM containers
- [ ] (Optional) Browse tags and triggers

## Congratulations! 🎉

You now have a powerful analytics platform integrated into your CMS!

**Next Steps**:
1. Bookmark your dashboards
2. Set up daily sync automation
3. Invite team members
4. Start optimizing your campaigns!

---

**Pro Tip**: Add this to your browser bookmarks bar for quick access!
