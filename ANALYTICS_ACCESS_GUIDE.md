# How to Access Your Analytics Features

## 🎯 Quick Access URLs

### New Features (Just Implemented!)

**Unified Analytics Overview**
- URL: `/analytics/overview`
- Shows: All platforms in one view (Ads, GA4, Search Console, GTM)
- Best for: Quick overview of all your marketing data

**Google Analytics 4 Dashboard**
- URL: `/analytics/ga4`
- Shows: User behavior, sessions, pageviews, engagement, revenue
- Best for: Understanding how users interact with your site

**Google Search Console Dashboard**
- URL: `/analytics/search-console`
- Shows: Search performance, keywords, clicks, impressions, SEO data
- Best for: Monitoring organic search performance

### Existing Features

**Google Ads Dashboard**
- URL: `/analytics`
- Shows: Ad campaigns, impressions, clicks, costs, conversions, ROAS

**Tag Manager Dashboard**
- URL: `/analytics/gtm`
- Shows: Containers, tags, triggers, variables

**Analytics Settings**
- URL: `/analytics/settings`
- Use for: Adding/managing all analytics properties and credentials

## 🚀 Getting Started (First Time Setup)

### Step 1: Access the Settings Page

Navigate to: `http://localhost:3000/analytics/settings` (or your CMS URL)

You'll see tabs for:
- Google Ads
- Google Tag Manager
- **Google Analytics 4** (NEW)
- **Search Console** (NEW)

### Step 2: Add Your First GA4 Property

1. Click the "Google Analytics 4" tab
2. Click "Add Property" button
3. Fill in the form:
   ```
   Property Name: My Website Analytics
   Property ID: 123456789 (your GA4 property ID)
   Measurement ID: G-XXXXXXXXXX (optional)
   Client Email: service-account@project.iam.gserviceaccount.com
   Private Key: -----BEGIN PRIVATE KEY----- ... -----END PRIVATE KEY-----
   Project ID: your-google-cloud-project
   ```
4. Click "Save" - it will verify the connection
5. If successful, you'll see "Property added successfully!"

### Step 3: Add Your Search Console Property

1. Click the "Search Console" tab
2. Click "Add Property"
3. Fill in the form:
   ```
   Property Name: My Website SEO
   Site URL: https://yourdomain.com
   Client Email: service-account@project.iam.gserviceaccount.com
   Private Key: -----BEGIN PRIVATE KEY----- ... -----END PRIVATE KEY-----
   Project ID: your-google-cloud-project
   ```
4. Click "Save"

### Step 4: Sync Your Data

**For GA4:**
1. Go to `/analytics/ga4`
2. Select your property from dropdown
3. Click "Sync Data" button
4. Wait 30-60 seconds for sync to complete
5. Dashboard will populate with data

**For Search Console:**
1. Go to `/analytics/search-console`
2. Select your property from dropdown
3. Click "Sync Data" button
4. Wait 30-60 seconds for sync to complete
5. Dashboard will populate with SEO data

### Step 5: View Unified Overview

Navigate to `/analytics/overview` to see all your marketing data in one place!

## 📊 Dashboard Features

### Unified Overview Dashboard (`/analytics/overview`)

**What you'll see:**
- Quick stats cards for all platforms
- Platform status indicators (green = active)
- Quick action buttons:
  - Manage Accounts
  - Refresh Data
  - View Reports

**Use cases:**
- Morning check-in to see overall performance
- Executive reports (screenshot this page)
- Comparing performance across platforms

### GA4 Dashboard (`/analytics/ga4`)

**What you'll see:**
- 5 stat cards: Active Users, Sessions, Page Views, Engagement Rate, Revenue
- 2 interactive charts:
  - Active Users Trend (line chart)
  - Engagement Metrics (bar chart)
- Daily metrics table with full breakdown

**Key metrics explained:**
- **Active Users**: People who engaged with your site
- **Sessions**: Number of visits
- **Engagement Rate**: % of sessions that lasted 10+ seconds
- **Screen Page Views**: Total pages viewed
- **Revenue**: E-commerce transactions (if configured)

**Actions:**
- Select different properties (if you have multiple)
- Click "Sync Data" to refresh
- Scroll down for daily breakdown

### Search Console Dashboard (`/analytics/search-console`)

**What you'll see:**
- 4 stat cards: Clicks, Impressions, CTR, Average Position
- 2 trend charts:
  - Clicks & Impressions (blue/purple lines)
  - CTR & Position (green/orange lines)
- Top Queries table (your best keywords)
- Daily performance table

**Key metrics explained:**
- **Clicks**: People who clicked your link in search results
- **Impressions**: Times your site appeared in search results
- **CTR**: Click-through rate (clicks ÷ impressions)
- **Position**: Average ranking position in search results (1.0 = #1)

**Use cases:**
- Find your top-performing keywords
- Identify pages that need SEO improvement
- Monitor position changes over time

## 🔧 Troubleshooting

### "No properties configured" message

**Solution:** You haven't added any properties yet. Go to `/analytics/settings` and add one.

### "Failed to fetch data" error

**Possible causes:**
1. Property not synced yet - Click "Sync Data"
2. Service account doesn't have access - Check Google Cloud permissions
3. API not enabled - Enable GA4 Data API / Search Console API

### Empty charts/tables

**Solution:**
1. Click "Sync Data" button
2. Wait for sync to complete
3. If still empty, check that your property has data in Google Analytics/Search Console
4. New properties may need 24-48 hours to collect data

### "accounts.map is not a function" error (for Google Ads)

**Solution:** This is now fixed! Refresh the page. If you still see it:
1. Check that `/api/google-ads/accounts` returns an array
2. Verify your Google Ads accounts are set up in settings

## 📍 Navigation Structure

```
Your CMS
├── /analytics/overview          ← START HERE (unified view)
├── /analytics                   ← Google Ads
├── /analytics/ga4               ← Google Analytics 4 (NEW)
├── /analytics/search-console    ← Search Console (NEW)
├── /analytics/gtm               ← Tag Manager
└── /analytics/settings          ← Manage all properties
```

## 💡 Best Practices

### Daily Routine
1. Check `/analytics/overview` for quick status
2. Review GA4 for user behavior trends
3. Check Search Console for SEO performance
4. Deep dive into specific platforms as needed

### Weekly Tasks
1. Sync all data (click "Sync Data" on each dashboard)
2. Review top queries in Search Console
3. Check engagement trends in GA4
4. Compare costs vs. revenue in Google Ads

### Monthly Reports
1. Take screenshots of overview dashboard
2. Export daily metrics tables
3. Identify trends and anomalies
4. Adjust marketing strategies accordingly

## 🎁 Pro Tips

**Bookmark These:**
- Add `/analytics/overview` to your browser bookmarks
- Create browser tabs for each dashboard
- Set up browser notifications for important metrics

**Keyboard Shortcuts:**
- Ctrl+R / Cmd+R to refresh data
- Use browser back/forward to navigate quickly

**Data Export:**
- Right-click on tables → "Copy"
- Paste into Excel/Google Sheets
- Or take screenshots for reports

## ❓ Common Questions

**Q: How often should I sync data?**
A: Once per day is usually enough. Google updates data every 24-48 hours.

**Q: Can I have multiple properties?**
A: Yes! Add as many as you want. Use the dropdown to switch between them.

**Q: Is this data real-time?**
A: GA4 has real-time metrics (last 30 minutes). Search Console is delayed 2-3 days by Google.

**Q: Where's my Google Ads data?**
A: That's on the main `/analytics` page (existing feature).

**Q: Can I export this data?**
A: Currently via copy/paste from tables. We can add CSV export if you need it.

## 🚀 What's Next?

Now that you have access to all the dashboards, you can:

1. **Start using them daily** to monitor performance
2. **Add automation** for daily data syncing (cron jobs)
3. **Build custom reports** tailored to your needs
4. **Add competitor intelligence** ($528/month - optional)
5. **Implement automated alerts** for important metrics

Need help with any of these? Just ask!
