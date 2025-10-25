# Google Ads & Tag Manager Integration

This document provides comprehensive instructions for setting up and using the Google Ads and Google Tag Manager integration in your CMS.

## Overview

This integration allows you to:
- **Google Ads API v22**: View campaigns, metrics, clicks, impressions, conversions, costs, and ROI
- **Google Tag Manager API v2**: Manage containers, tags, triggers, and variables
- **Beautiful Dashboards**: Visualize data with Recharts charts and graphs
- **Real-time Sync**: Keep your data up-to-date with automatic syncing
- **Better UI/UX**: Enhanced interface compared to native Google platforms

## Architecture

### Tech Stack
- **Google Ads API**: v22 (latest as of October 2025) via `google-ads-api` npm package
- **Google Tag Manager API**: v2 via `googleapis` npm package
- **Database**: PostgreSQL with Prisma ORM
- **Visualization**: Recharts (already installed in your CMS)
- **Authentication**: OAuth2 for Google Ads, Service Account for GTM

### File Structure
```
apps/cms/
├── src/
│   ├── lib/
│   │   ├── google-ads.ts              # Google Ads service layer
│   │   └── google-tag-manager.ts      # GTM service layer
│   ├── app/
│   │   ├── analytics/
│   │   │   ├── page.tsx               # Google Ads dashboard
│   │   │   ├── gtm/
│   │   │   │   └── page.tsx           # GTM dashboard
│   │   │   └── settings/
│   │   │       └── page.tsx           # Account management
│   │   └── api/
│   │       ├── google-ads/
│   │       │   ├── accounts/          # Account CRUD
│   │       │   ├── sync/              # Data synchronization
│   │       │   └── metrics/           # Metrics retrieval
│   │       └── gtm/
│   │           ├── accounts/          # Account CRUD
│   │           ├── sync/              # Data synchronization
│   │           └── containers/        # Container data
│   └── prisma/
│       └── schema.prisma              # Database schema with new models
```

## Setup Instructions

### 1. Database Migration

First, push the new Prisma schema to your database:

```bash
cd apps/cms
npx prisma db push
npx prisma generate
```

This will create the following tables:
- `google_ads_accounts`
- `google_ads_campaigns`
- `google_ads_metrics`
- `google_tag_manager_accounts`
- `gtm_containers`
- `gtm_tags`
- `gtm_triggers`
- `gtm_variables`

### 2. Google Ads API Setup

#### Step 1: Get a Developer Token
1. Sign in to your Google Ads account
2. Go to **Tools & Settings** → **Setup** → **API Center**
3. Apply for API access and obtain your **Developer Token**

#### Step 2: Create OAuth2 Credentials
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the **Google Ads API**
4. Go to **APIs & Services** → **Credentials**
5. Create **OAuth 2.0 Client ID** (Application type: Web application)
6. Add authorized redirect URIs (e.g., `http://localhost:3010/oauth/callback`)
7. Note down your **Client ID** and **Client Secret**

#### Step 3: Get Refresh Token
You can use the OAuth Playground or generate it programmatically:

**Using OAuth Playground:**
1. Go to [OAuth 2.0 Playground](https://developers.google.com/oauthplayground/)
2. Click settings icon → Check "Use your own OAuth credentials"
3. Enter your Client ID and Client Secret
4. In Step 1, add scope: `https://www.googleapis.com/auth/adwords`
5. Click "Authorize APIs" and sign in
6. In Step 2, click "Exchange authorization code for tokens"
7. Copy the **Refresh Token**

#### Step 4: Find Your Customer ID
1. Sign in to your Google Ads account
2. Your Customer ID is displayed at the top right (format: XXX-XXX-XXXX)
3. Remove the dashes (e.g., 1234567890)

### 3. Google Tag Manager API Setup

#### Step 1: Create Service Account
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Enable the **Tag Manager API**
4. Go to **APIs & Services** → **Credentials**
5. Create **Service Account**
6. Give it a name (e.g., "GTM API Access")
7. Grant role: **Tag Manager Editor** or **Owner**
8. Create and download JSON key

#### Step 2: Grant Access in GTM
1. Open [Google Tag Manager](https://tagmanager.google.com/)
2. Go to **Admin** → **User Management**
3. Add the service account email (from JSON key)
4. Grant **Publish** or **Edit** permissions

#### Step 3: Extract Credentials
From the downloaded JSON file, you'll need:
- `client_email`
- `private_key`
- `project_id`

You'll also need:
- **Account ID**: Found in GTM URL (e.g., `tagmanager.google.com/#/admin/accounts/123456`)
- **Account Path**: Format as `accounts/123456`

### 4. Add Accounts in CMS

1. Navigate to [http://localhost:3010/analytics/settings](http://localhost:3010/analytics/settings)
2. Switch between **Google Ads** and **GTM** tabs
3. Click **Add Account** and fill in the credentials
4. Submit the form

## Usage

### Google Ads Dashboard

Navigate to [http://localhost:3010/analytics](http://localhost:3010/analytics)

**Features:**
- Select account and date range
- View summary cards: Impressions, Clicks, Cost, Conversions
- **Clicks & Impressions Over Time** line chart
- **Cost & Conversions Over Time** bar chart
- Real-time metrics: CTR, CPC, ROAS, Cost per Conversion
- **Sync Data** button to fetch latest data from Google Ads

**How to Sync:**
1. Select an account
2. Choose date range (default: last 30 days)
3. Click "Sync Data"
4. Wait for synchronization to complete
5. Data will be displayed in charts and summary cards

### GTM Dashboard

Navigate to [http://localhost:3010/analytics/gtm](http://localhost:3010/analytics/gtm)

**Features:**
- View all containers for an account
- See counts of Tags, Triggers, and Variables
- Browse detailed lists of:
  - Tags (with type and paused status)
  - Triggers (with type)
  - Variables (with type)
- **Sync GTM Data** button to fetch latest configuration

**How to Sync:**
1. Select an account
2. Click "Sync GTM Data"
3. All containers, tags, triggers, and variables will be synced
4. Select a container to view details

## API Endpoints

### Google Ads

- `GET /api/google-ads/accounts` - List all accounts
- `POST /api/google-ads/accounts` - Create new account
- `GET /api/google-ads/accounts/[id]` - Get account details
- `PUT /api/google-ads/accounts/[id]` - Update account
- `DELETE /api/google-ads/accounts/[id]` - Delete account
- `POST /api/google-ads/sync` - Sync campaigns and metrics
- `GET /api/google-ads/metrics` - Get metrics with filters

### Google Tag Manager

- `GET /api/gtm/accounts` - List all accounts
- `POST /api/gtm/accounts` - Create new account
- `GET /api/gtm/accounts/[id]` - Get account details
- `PUT /api/gtm/accounts/[id]` - Update account
- `DELETE /api/gtm/accounts/[id]` - Delete account
- `POST /api/gtm/sync` - Sync all GTM data
- `GET /api/gtm/containers/[id]` - Get container details

## Database Schema

### GoogleAdsAccount
Stores OAuth2 credentials and sync status for Google Ads accounts.

### GoogleAdsCampaign
Stores campaign information including name, status, budget, and bidding strategy.

### GoogleAdsMetrics
Stores daily metrics including impressions, clicks, cost, conversions, CTR, CPC, etc.

### GoogleTagManagerAccount
Stores service account credentials for GTM access.

### GTMContainer
Stores container information including public ID and domain names.

### GTMTag
Stores tag configurations including type, firing rules, and parameters.

### GTMTrigger
Stores trigger configurations including type and filters.

### GTMVariable
Stores variable configurations including type and parameters.

## Advanced Features

### Automatic Data Sync
You can set up a cron job to automatically sync data:

```typescript
// Example cron job (not included, can be implemented)
import { googleAdsService } from '@/lib/google-ads';

async function syncAllAccounts() {
  const accounts = await prisma.googleAdsAccount.findMany({
    where: { isActive: true }
  });

  for (const account of accounts) {
    await googleAdsService.loadConfigFromDatabase(account.id);
    await googleAdsService.syncCampaigns(account.id, account.customerId);

    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0];

    await googleAdsService.syncMetrics(
      account.id,
      account.customerId,
      yesterday,
      yesterday
    );
  }
}
```

### Custom Queries
You can extend the `GoogleAdsService` class to add custom GAQL queries:

```typescript
async getCustomMetrics(customerId: string) {
  const customer = await this.getCustomer(customerId);

  const query = `
    SELECT
      campaign.id,
      campaign.name,
      metrics.video_views,
      metrics.engagement_rate
    FROM campaign
    WHERE campaign.advertising_channel_type = 'VIDEO'
  `;

  return await customer.query(query);
}
```

## Troubleshooting

### Google Ads API Errors

**"PERMISSION_DENIED"**
- Verify your Developer Token is approved
- Check that the customer ID is correct
- Ensure OAuth2 scopes include `https://www.googleapis.com/auth/adwords`

**"QUOTA_EXCEEDED"**
- Google Ads API has rate limits
- Implement exponential backoff in production
- Consider caching frequently accessed data

**"INVALID_CUSTOMER_ID"**
- Customer ID should be numeric only (remove dashes)
- Verify the account exists and is accessible

### GTM API Errors

**"PERMISSION_DENIED"**
- Ensure service account has been added to GTM account
- Verify permissions are set to "Edit" or "Publish"
- Check that Tag Manager API is enabled in Google Cloud

**"INVALID_ARGUMENT"**
- Verify account path format: `accounts/123456`
- Check that container IDs are correct

## Security Best Practices

1. **Never commit credentials to git**
   - Credentials are stored in database (encrypted at rest)
   - Never hardcode tokens in source code

2. **Use environment variables for sensitive data**
   - Consider encrypting sensitive fields in database
   - Use database-level encryption for production

3. **Implement rate limiting**
   - Add rate limiting to API endpoints
   - Prevent abuse of sync functionality

4. **Audit logging**
   - All sync operations are logged with timestamps
   - Monitor sync status and errors

## Performance Optimization

1. **Caching**: Implement Redis caching for frequently accessed metrics
2. **Pagination**: Add pagination for large datasets
3. **Background Jobs**: Use queue system (Bull, BullMQ) for sync operations
4. **Incremental Sync**: Only sync changed data instead of full sync

## Resources

- [Google Ads API Documentation](https://developers.google.com/google-ads/api/docs/start)
- [Google Ads API v22 Release Notes](https://developers.google.com/google-ads/api/docs/release-notes)
- [Google Tag Manager API v2 Documentation](https://developers.google.com/tag-platform/tag-manager/api/v2)
- [google-ads-api npm Package](https://www.npmjs.com/package/google-ads-api)
- [googleapis npm Package](https://www.npmjs.com/package/googleapis)
- [Recharts Documentation](https://recharts.org/)

## Support

For issues or questions:
1. Check the error logs in your CMS
2. Review Google Cloud Console logs
3. Verify API quotas haven't been exceeded
4. Check that credentials are still valid

## Future Enhancements

Potential features to add:
- [ ] Email alerts for campaign performance
- [ ] Automated reports (PDF/Excel export)
- [ ] AI-powered insights and recommendations
- [ ] Budget optimization suggestions
- [ ] A/B testing for ad copies
- [ ] Integration with Google Analytics 4
- [ ] Custom dashboards per user
- [ ] Mobile app for monitoring
