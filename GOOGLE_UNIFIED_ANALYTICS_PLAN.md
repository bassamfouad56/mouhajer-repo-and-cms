# Complete Google Analytics Suite Integration Plan

## Executive Summary

This plan outlines a comprehensive integration of **ALL** Google marketing and analytics tools into your CMS, creating a unified dashboard that surpasses Google's native interfaces.

### What You'll Get

A single, powerful dashboard combining:
- ✅ **Google Ads API v22** (Already Implemented)
- ✅ **Google Tag Manager API v2** (Already Implemented)
- 🆕 **Google Analytics 4 (GA4) Data API v1**
- 🆕 **Google Search Console API** (with hourly data support)
- 🆕 **Unified Marketing Dashboard**
- 🆕 **Cross-platform insights & correlations**
- 🆕 **AI-powered recommendations**

## Current Status

### ✅ Phase 1: Already Complete

You already have:
- **Google Ads Integration** - Campaign metrics, costs, conversions, ROAS
- **Google Tag Manager Integration** - Containers, tags, triggers, variables
- **Database Schema** - PostgreSQL with Prisma
- **API Routes** - RESTful endpoints for data access
- **Basic Dashboards** - Charts with Recharts

**Files:**
- `apps/cms/src/lib/google-ads.ts`
- `apps/cms/src/lib/google-tag-manager.ts`
- `apps/cms/src/app/analytics/*`
- `apps/cms/prisma/schema.prisma`

## Phase 2: Google Analytics 4 (GA4) Integration

### 2.1 GA4 Overview

**Latest Version**: Google Analytics Data API v1 (Node.js 5.2.1)
**Package**: `@google-analytics/data`
**Authentication**: Service Account or OAuth2

### 2.2 What GA4 Provides

**User Metrics:**
- Active users (realtime, daily, weekly, monthly)
- New vs. returning users
- User demographics (age, gender, location)
- User engagement time
- Session metrics (duration, pages per session, bounce rate)

**Traffic Sources:**
- Source/Medium breakdown
- Campaign tracking
- Referral traffic
- Direct/organic/social traffic
- UTM parameter tracking

**Behavior Metrics:**
- Page views & unique page views
- Event tracking (custom events)
- Conversion tracking
- E-commerce transactions (if applicable)
- Funnel analysis

**Technology:**
- Browser, OS, device breakdown
- Screen resolution
- Mobile vs. desktop traffic

**Real-time Data:**
- Active users right now
- Real-time events
- Current page views
- Active countries/cities

### 2.3 Implementation Steps

#### Step 1: Install Package
```bash
cd apps/cms
npm install @google-analytics/data
```

#### Step 2: Set Up Service Account
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Enable **Google Analytics Data API**
3. Create Service Account
4. Download JSON key
5. Add service account to GA4 property (Viewer role minimum)

#### Step 3: Database Schema
```prisma
model GoogleAnalyticsProperty {
  id                String   @id @default(uuid())
  propertyName      String   @map("property_name")
  propertyId        String   @unique @map("property_id")
  measurementId     String?  @map("measurement_id")
  clientEmail       String   @map("client_email")
  privateKey        String   @map("private_key")
  projectId         String   @map("project_id")
  isActive          Boolean  @default(true) @map("is_active")
  lastSyncAt        DateTime? @map("last_sync_at")
  syncStatus        String   @default("pending") @map("sync_status")
  createdAt         DateTime @default(now()) @map("created_at")
  updatedAt         DateTime @updatedAt @map("updated_at")
  metrics           GA4Metrics[]

  @@index([propertyId])
  @@index([isActive])
  @@map("google_analytics_properties")
}

model GA4Metrics {
  id                  String   @id @default(uuid())
  propertyId          String   @map("property_id")
  date                DateTime
  activeUsers         Int      @default(0) @map("active_users")
  newUsers            Int      @default(0) @map("new_users")
  sessions            Int      @default(0)
  bounceRate          Float    @default(0) @map("bounce_rate")
  averageSessionDuration Float @default(0) @map("average_session_duration")
  screenPageViews     Int      @default(0) @map("screen_page_views")
  eventCount          Int      @default(0) @map("event_count")
  conversions         Float    @default(0)
  totalRevenue        Float    @default(0) @map("total_revenue")
  createdAt           DateTime @default(now()) @map("created_at")
  updatedAt           DateTime @updatedAt @map("updated_at")
  property            GoogleAnalyticsProperty @relation(fields: [propertyId], references: [id], onDelete: Cascade)

  @@unique([propertyId, date])
  @@index([propertyId])
  @@index([date])
  @@map("ga4_metrics")
}

model GA4TrafficSource {
  id                String   @id @default(uuid())
  propertyId        String   @map("property_id")
  date              DateTime
  source            String
  medium            String
  campaign          String?
  sessions          Int      @default(0)
  users             Int      @default(0)
  newUsers          Int      @default(0) @map("new_users")
  bounceRate        Float    @default(0) @map("bounce_rate")
  conversions       Float    @default(0)
  revenue           Float    @default(0)
  createdAt         DateTime @default(now()) @map("created_at")
  updatedAt         DateTime @updatedAt @map("updated_at")

  @@unique([propertyId, date, source, medium, campaign])
  @@index([propertyId])
  @@index([date])
  @@index([source])
  @@map("ga4_traffic_sources")
}

model GA4RealtimeMetrics {
  id                String   @id @default(uuid())
  propertyId        String   @map("property_id")
  timestamp         DateTime @default(now())
  activeUsers       Int      @default(0) @map("active_users")
  screenPageViews   Int      @default(0) @map("screen_page_views")
  eventCount        Int      @default(0) @map("event_count")
  minutesAgo        Int      @map("minutes_ago")
  createdAt         DateTime @default(now()) @map("created_at")

  @@index([propertyId])
  @@index([timestamp])
  @@map("ga4_realtime_metrics")
}
```

#### Step 4: Service Layer
Create `apps/cms/src/lib/google-analytics.ts`:

```typescript
import { BetaAnalyticsDataClient } from '@google-analytics/data';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class GoogleAnalyticsService {
  private client: BetaAnalyticsDataClient | null = null;

  async initializeClient(propertyId: string) {
    const property = await prisma.googleAnalyticsProperty.findUnique({
      where: { id: propertyId },
    });

    if (!property) throw new Error('Property not found');

    this.client = new BetaAnalyticsDataClient({
      credentials: {
        client_email: property.clientEmail,
        private_key: property.privateKey.replace(/\\n/g, '\n'),
      },
    });

    return property;
  }

  async getMetrics(propertyId: string, dateFrom: string, dateTo: string) {
    const property = await this.initializeClient(propertyId);

    const [response] = await this.client!.runReport({
      property: `properties/${property.propertyId}`,
      dateRanges: [{ startDate: dateFrom, endDate: dateTo }],
      dimensions: [{ name: 'date' }],
      metrics: [
        { name: 'activeUsers' },
        { name: 'newUsers' },
        { name: 'sessions' },
        { name: 'bounceRate' },
        { name: 'averageSessionDuration' },
        { name: 'screenPageViews' },
        { name: 'eventCount' },
        { name: 'conversions' },
        { name: 'totalRevenue' },
      ],
    });

    return response.rows?.map(row => ({
      date: row.dimensionValues?.[0]?.value,
      activeUsers: parseInt(row.metricValues?.[0]?.value || '0'),
      newUsers: parseInt(row.metricValues?.[1]?.value || '0'),
      sessions: parseInt(row.metricValues?.[2]?.value || '0'),
      bounceRate: parseFloat(row.metricValues?.[3]?.value || '0'),
      averageSessionDuration: parseFloat(row.metricValues?.[4]?.value || '0'),
      screenPageViews: parseInt(row.metricValues?.[5]?.value || '0'),
      eventCount: parseInt(row.metricValues?.[6]?.value || '0'),
      conversions: parseFloat(row.metricValues?.[7]?.value || '0'),
      totalRevenue: parseFloat(row.metricValues?.[8]?.value || '0'),
    })) || [];
  }

  async getTrafficSources(propertyId: string, dateFrom: string, dateTo: string) {
    const property = await this.initializeClient(propertyId);

    const [response] = await this.client!.runReport({
      property: `properties/${property.propertyId}`,
      dateRanges: [{ startDate: dateFrom, endDate: dateTo }],
      dimensions: [
        { name: 'sessionSource' },
        { name: 'sessionMedium' },
        { name: 'sessionCampaignName' },
      ],
      metrics: [
        { name: 'sessions' },
        { name: 'activeUsers' },
        { name: 'newUsers' },
        { name: 'bounceRate' },
        { name: 'conversions' },
        { name: 'totalRevenue' },
      ],
    });

    return response.rows?.map(row => ({
      source: row.dimensionValues?.[0]?.value || 'direct',
      medium: row.dimensionValues?.[1]?.value || 'none',
      campaign: row.dimensionValues?.[2]?.value || null,
      sessions: parseInt(row.metricValues?.[0]?.value || '0'),
      users: parseInt(row.metricValues?.[1]?.value || '0'),
      newUsers: parseInt(row.metricValues?.[2]?.value || '0'),
      bounceRate: parseFloat(row.metricValues?.[3]?.value || '0'),
      conversions: parseFloat(row.metricValues?.[4]?.value || '0'),
      revenue: parseFloat(row.metricValues?.[5]?.value || '0'),
    })) || [];
  }

  async getRealtimeData(propertyId: string) {
    const property = await this.initializeClient(propertyId);

    const [response] = await this.client!.runRealtimeReport({
      property: `properties/${property.propertyId}`,
      dimensions: [{ name: 'unifiedScreenName' }],
      metrics: [
        { name: 'activeUsers' },
        { name: 'screenPageViews' },
        { name: 'eventCount' },
      ],
      minuteRanges: [{ name: 'last30Minutes', startMinutesAgo: 29, endMinutesAgo: 0 }],
    });

    return {
      activeUsers: parseInt(response.rows?.[0]?.metricValues?.[0]?.value || '0'),
      screenPageViews: parseInt(response.rows?.[0]?.metricValues?.[1]?.value || '0'),
      eventCount: parseInt(response.rows?.[0]?.metricValues?.[2]?.value || '0'),
      timestamp: new Date(),
    };
  }
}
```

#### Step 5: API Routes
Create endpoints for GA4 data access.

## Phase 3: Google Search Console Integration

### 3.1 Search Console Overview

**Latest Update**: Hourly data support (April 2025)
**Package**: `googleapis` (already installed)
**Authentication**: Service Account or OAuth2

### 3.2 What Search Console Provides

**Performance Metrics:**
- Clicks from Google Search
- Impressions in search results
- Average CTR (Click-through rate)
- Average position in search results
- **NEW: Hourly data** (up to 10 days)

**Query Analytics:**
- Top performing queries
- Query impressions & clicks
- Position tracking per query
- CTR per query

**Page Performance:**
- Top pages by clicks/impressions
- Page-level position tracking
- Landing page analysis

**Technical SEO:**
- Mobile usability issues
- Core Web Vitals
- Index coverage status
- Crawl errors
- Sitemap status

**Advanced Features:**
- Country-level performance
- Device breakdown (mobile/desktop/tablet)
- Search appearance types
- Rich results tracking

### 3.3 Implementation Steps

#### Step 1: Database Schema
```prisma
model GoogleSearchConsoleProperty {
  id              String   @id @default(uuid())
  propertyName    String   @map("property_name")
  siteUrl         String   @unique @map("site_url")
  clientEmail     String   @map("client_email")
  privateKey      String   @map("private_key")
  projectId       String   @map("project_id")
  isActive        Boolean  @default(true) @map("is_active")
  lastSyncAt      DateTime? @map("last_sync_at")
  syncStatus      String   @default("pending") @map("sync_status")
  createdAt       DateTime @default(now()) @map("created_at")
  updatedAt       DateTime @updatedAt @map("updated_at")
  performance     GSCPerformance[]
  queries         GSCQuery[]

  @@index([siteUrl])
  @@index([isActive])
  @@map("google_search_console_properties")
}

model GSCPerformance {
  id          String   @id @default(uuid())
  propertyId  String   @map("property_id")
  date        DateTime
  hour        Int?     // New: hourly data support
  clicks      Int      @default(0)
  impressions Int      @default(0)
  ctr         Float    @default(0)
  position    Float    @default(0)
  device      String?
  country     String?
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")
  property    GoogleSearchConsoleProperty @relation(fields: [propertyId], references: [id], onDelete: Cascade)

  @@unique([propertyId, date, hour, device, country])
  @@index([propertyId])
  @@index([date])
  @@map("gsc_performance")
}

model GSCQuery {
  id          String   @id @default(uuid())
  propertyId  String   @map("property_id")
  date        DateTime
  query       String
  clicks      Int      @default(0)
  impressions Int      @default(0)
  ctr         Float    @default(0)
  position    Float    @default(0)
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")
  property    GoogleSearchConsoleProperty @relation(fields: [propertyId], references: [id], onDelete: Cascade)

  @@unique([propertyId, date, query])
  @@index([propertyId])
  @@index([date])
  @@index([query])
  @@map("gsc_queries")
}

model GSCPage {
  id          String   @id @default(uuid())
  propertyId  String   @map("property_id")
  date        DateTime
  page        String
  clicks      Int      @default(0)
  impressions Int      @default(0)
  ctr         Float    @default(0)
  position    Float    @default(0)
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  @@unique([propertyId, date, page])
  @@index([propertyId])
  @@index([date])
  @@map("gsc_pages")
}
```

#### Step 2: Service Layer
Create `apps/cms/src/lib/google-search-console.ts`:

```typescript
import { google } from 'googleapis';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class GoogleSearchConsoleService {
  private searchconsole: any = null;

  async initializeClient(propertyId: string) {
    const property = await prisma.googleSearchConsoleProperty.findUnique({
      where: { id: propertyId },
    });

    if (!property) throw new Error('Property not found');

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: property.clientEmail,
        private_key: property.privateKey.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
    });

    this.searchconsole = google.searchconsole({ version: 'v1', auth });
    return property;
  }

  async getPerformanceData(
    propertyId: string,
    dateFrom: string,
    dateTo: string,
    dimensions: string[] = ['date']
  ) {
    const property = await this.initializeClient(propertyId);

    const response = await this.searchconsole.searchanalytics.query({
      siteUrl: property.siteUrl,
      requestBody: {
        startDate: dateFrom,
        endDate: dateTo,
        dimensions,
        rowLimit: 25000,
      },
    });

    return response.data.rows || [];
  }

  // NEW: Get hourly data (April 2025 feature)
  async getHourlyPerformance(propertyId: string, dateFrom: string, dateTo: string) {
    const property = await this.initializeClient(propertyId);

    const response = await this.searchconsole.searchanalytics.query({
      siteUrl: property.siteUrl,
      requestBody: {
        startDate: dateFrom,
        endDate: dateTo,
        dimensions: ['date', 'hour'],
        dataState: 'HOURLY_ALL',
        rowLimit: 25000,
      },
    });

    return response.data.rows || [];
  }

  async getTopQueries(propertyId: string, dateFrom: string, dateTo: string, limit: number = 100) {
    const property = await this.initializeClient(propertyId);

    const response = await this.searchconsole.searchanalytics.query({
      siteUrl: property.siteUrl,
      requestBody: {
        startDate: dateFrom,
        endDate: dateTo,
        dimensions: ['query'],
        rowLimit: limit,
      },
    });

    return response.data.rows || [];
  }

  async getTopPages(propertyId: string, dateFrom: string, dateTo: string, limit: number = 100) {
    const property = await this.initializeClient(propertyId);

    const response = await this.searchconsole.searchanalytics.query({
      siteUrl: property.siteUrl,
      requestBody: {
        startDate: dateFrom,
        endDate: dateTo,
        dimensions: ['page'],
        rowLimit: limit,
      },
    });

    return response.data.rows || [];
  }
}
```

## Phase 4: Unified Marketing Dashboard

### 4.1 Dashboard Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                  UNIFIED MARKETING DASHBOARD                 │
├─────────────────────────────────────────────────────────────┤
│  Overview  │  GA4  │  Search Console  │  Ads  │  GTM  │ AI  │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  📊 KEY METRICS (Last 30 Days)                               │
│  ┌──────────────┬──────────────┬──────────────┬────────────┐│
│  │ 👥 Users     │ 🔍 Organic   │ 💰 Ad Spend  │ 💵 Revenue ││
│  │ 127,543      │ 45,231       │ $12,450      │ $45,230    ││
│  │ +12.3% ↑     │ +8.5% ↑      │ -5.2% ↓      │ +18.9% ↑   ││
│  └──────────────┴──────────────┴──────────────┴────────────┘│
│                                                               │
│  📈 TRAFFIC SOURCES                                          │
│  ┌─────────────────────────────────────────────────────────┐│
│  │  Organic Search  ████████████████  45%  (↑ 8.5%)       ││
│  │  Paid Search     ████████          25%  (↓ 2.3%)       ││
│  │  Direct          ██████            15%  (↑ 3.1%)       ││
│  │  Social Media    ████              10%  (↑ 12.4%)      ││
│  │  Referral        ██                 5%  (↑ 1.2%)       ││
│  └─────────────────────────────────────────────────────────┘│
│                                                               │
│  🎯 CONVERSIONS FUNNEL                                       │
│  ┌─────────────────────────────────────────────────────────┐│
│  │  Page Views → Sessions → Leads → Sales                  ││
│  │  245K    →    127K    →   3.2K  →  456                  ││
│  │  (100%)      (51.8%)     (2.5%)    (14.2%)              ││
│  └─────────────────────────────────────────────────────────┘│
│                                                               │
│  🔍 SEO PERFORMANCE                                          │
│  ┌────────────────┬────────────────┬────────────────────────┐│
│  │ Top Query      │ Avg Position   │ Opportunity            ││
│  │ "interior..."  │ 3.2 (↑ 0.5)    │ ⭐ High potential     ││
│  └────────────────┴────────────────┴────────────────────────┘│
│                                                               │
│  💡 AI INSIGHTS                                              │
│  • Your organic traffic is up 8.5% - maintain SEO efforts   │
│  • Ad spend is down but ROAS improved by 24% - optimize!    │
│  • "luxury villa design" query jumped 50 positions this week││
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### 4.2 Dashboard Features

**Real-time Overview:**
- Live visitor count (GA4 realtime)
- Current active pages
- Real-time conversion tracking
- Geographic heat map

**Cross-Platform Insights:**
- Compare organic (Search Console) vs paid (Ads) performance
- Track same keywords across SEO and PPC
- Attribution modeling
- Customer journey visualization

**Advanced Analytics:**
- Cohort analysis
- Retention metrics
- LTV (Lifetime Value) tracking
- A/B test results

**Automated Reports:**
- Daily email summaries
- Weekly performance reports
- Monthly board reports
- Custom scheduled reports

**AI-Powered Recommendations:**
- Budget allocation suggestions
- Keyword opportunities
- Content gap analysis
- Conversion rate optimization tips

## Implementation Timeline

### Week 1: Setup & Infrastructure
- [ ] Install GA4 and Search Console packages
- [ ] Update Prisma schema with new models
- [ ] Run database migrations
- [ ] Set up service accounts for both APIs
- [ ] Configure API access and permissions

### Week 2: GA4 Integration
- [ ] Create GA4 service layer
- [ ] Build API routes for GA4 data
- [ ] Implement data synchronization
- [ ] Create GA4 dashboard components
- [ ] Add real-time metrics display

### Week 3: Search Console Integration
- [ ] Create Search Console service layer
- [ ] Build API routes for Search Console data
- [ ] Implement hourly data sync
- [ ] Create SEO dashboard components
- [ ] Add query and page performance views

### Week 4: Unified Dashboard
- [ ] Design unified dashboard layout
- [ ] Implement cross-platform data correlation
- [ ] Create comprehensive visualizations
- [ ] Add filtering and date range controls
- [ ] Build export functionality

### Week 5: Advanced Features
- [ ] Implement AI-powered insights
- [ ] Add automated reporting
- [ ] Create custom alerts
- [ ] Build funnel visualization
- [ ] Add attribution modeling

### Week 6: Testing & Optimization
- [ ] Performance testing
- [ ] Data accuracy verification
- [ ] UI/UX improvements
- [ ] Documentation
- [ ] Team training

## Technical Stack Summary

### APIs & Packages
```json
{
  "google-ads-api": "^21.0.1",              // ✅ Installed
  "googleapis": "latest",                    // ✅ Installed
  "@google-analytics/data": "^5.2.1",       // 🆕 To install
  "recharts": "^3.2.1",                      // ✅ Installed
  "date-fns": "^3.0.0"                      // 🆕 For date handling
}
```

### Database Models
- ✅ GoogleAdsAccount, GoogleAdsCampaign, GoogleAdsMetrics
- ✅ GoogleTagManagerAccount, GTMContainer, GTMTag, GTMTrigger, GTMVariable
- 🆕 GoogleAnalyticsProperty, GA4Metrics, GA4TrafficSource, GA4RealtimeMetrics
- 🆕 GoogleSearchConsoleProperty, GSCPerformance, GSCQuery, GSCPage

### Dashboard Pages
- ✅ `/analytics` - Google Ads dashboard
- ✅ `/analytics/gtm` - GTM dashboard
- ✅ `/analytics/settings` - Account management
- 🆕 `/analytics/ga4` - Google Analytics 4 dashboard
- 🆕 `/analytics/search-console` - Search Console dashboard
- 🆕 `/analytics/overview` - **Unified dashboard** (all platforms)
- 🆕 `/analytics/reports` - Custom reports builder
- 🆕 `/analytics/insights` - AI-powered insights

## Data Synchronization Strategy

### Real-time Data
- GA4 realtime metrics: Every 30 seconds
- GTM container status: On-demand
- Active campaigns: Every 5 minutes

### Daily Sync
- GA4 metrics: Daily at 2 AM
- Search Console performance: Daily at 3 AM
- Google Ads metrics: Daily at 4 AM
- Hourly data (Search Console): Every hour

### On-Demand Sync
- Manual refresh button for immediate updates
- Triggered sync after campaign changes
- Webhook-based updates (where available)

## Data Retention Policy

- **Raw metrics**: 13 months (matching Google's retention)
- **Aggregated data**: Indefinite (for historical analysis)
- **Real-time data**: 7 days
- **Hourly data**: 30 days

## Security & Privacy

### Data Encryption
- Service account keys encrypted in database
- API credentials in environment variables
- SSL/TLS for all API communications

### Access Control
- Role-based access (Admin, Editor, Viewer)
- API key rotation every 90 days
- Audit logs for all data access

### GDPR Compliance
- Personal data anonymization
- User consent tracking
- Right to be forgotten support
- Data export capabilities

## Cost Estimation

### API Quotas (Free Tier)
- **GA4 Data API**: 200,000 requests/day
- **Search Console API**: 50,000 rows/day
- **Google Ads API**: Unlimited (standard rate limits)
- **Tag Manager API**: Unlimited

### Estimated Usage
- Daily sync: ~500 API requests
- Real-time updates: ~2,000 requests/day
- User interactions: ~1,000 requests/day
- **Total**: ~3,500 requests/day (well within limits)

## Success Metrics

After implementation, you'll have:
- ✅ **Single Dashboard** for all Google services
- ✅ **Real-time insights** across platforms
- ✅ **Automated reporting** saving 10+ hours/week
- ✅ **Better decisions** with cross-platform data
- ✅ **Cost savings** with optimized ad spend
- ✅ **Improved ROI** through better attribution

## Next Steps

1. **Review this plan** and prioritize features
2. **Set up service accounts** for GA4 and Search Console
3. **Install required packages**
4. **Run database migrations**
5. **Start with Phase 2** (GA4 integration)
6. **Build incrementally** - test each phase before moving forward

## Resources & Documentation

- [Google Analytics Data API](https://developers.google.com/analytics/devguides/reporting/data/v1)
- [Search Console API](https://developers.google.com/webmaster-tools/v1/api_reference_index)
- [Google Ads API](https://developers.google.com/google-ads/api/docs/start)
- [Tag Manager API](https://developers.google.com/tag-platform/tag-manager/api/v2)
- [Your existing integration docs](apps/cms/GOOGLE_ANALYTICS_INTEGRATION.md)

---

**Created**: October 2025
**Status**: 📋 Ready for Implementation
**Estimated Time**: 6 weeks for complete implementation
**Difficulty**: Advanced (but we'll guide you through it!)
