import { BetaAnalyticsDataClient } from '@google-analytics/data';
import { google } from 'googleapis';
import { prisma } from './prisma';
import { startOfDay, subDays, format } from 'date-fns';

export interface GA4Credentials {
  clientEmail: string;
  privateKey: string;
  projectId: string;
}

export interface GA4MetricsData {
  date: Date;
  activeUsers: number;
  newUsers: number;
  sessions: number;
  bounceRate: number;
  engagementRate: number;
  averageSessionDuration: number;
  screenPageViews: number;
  screenPageViewsPerSession: number;
  eventCount: number;
  conversions: number;
  totalRevenue: number;
}

export interface GA4TrafficSourceData {
  date: Date;
  sourceMedium: string;
  source: string;
  medium: string;
  campaign?: string;
  activeUsers: number;
  newUsers: number;
  sessions: number;
  bounceRate: number;
  engagementRate: number;
  conversions: number;
  totalRevenue: number;
}

export interface GA4RealtimeData {
  activeUsers: number;
  screenPageViews: number;
  eventCount: number;
  topPages: Array<{ page: string; count: number }>;
  topSources: Array<{ source: string; count: number }>;
  topCountries: Array<{ country: string; count: number }>;
  topDevices: Array<{ device: string; count: number }>;
}

export class GoogleAnalyticsService {
  private analyticsDataClient: BetaAnalyticsDataClient;
  private propertyId: string;

  constructor(credentials: GA4Credentials, propertyId: string) {
    this.propertyId = propertyId;
    this.analyticsDataClient = new BetaAnalyticsDataClient({
      credentials: {
        client_email: credentials.clientEmail,
        private_key: credentials.privateKey.replace(/\\n/g, '\n'),
      },
      projectId: credentials.projectId,
    });
  }

  /**
   * Get standard metrics for a date range
   */
  async getMetrics(startDate: string, endDate: string): Promise<GA4MetricsData[]> {
    const [response] = await this.analyticsDataClient.runReport({
      property: `properties/${this.propertyId}`,
      dateRanges: [{ startDate, endDate }],
      dimensions: [{ name: 'date' }],
      metrics: [
        { name: 'activeUsers' },
        { name: 'newUsers' },
        { name: 'sessions' },
        { name: 'bounceRate' },
        { name: 'engagementRate' },
        { name: 'averageSessionDuration' },
        { name: 'screenPageViews' },
        { name: 'eventCount' },
        { name: 'conversions' },
        { name: 'totalRevenue' },
      ],
    });

    return (
      response.rows?.map((row) => {
        const sessions = parseInt(row.metricValues?.[2]?.value || '0');
        const screenPageViews = parseInt(row.metricValues?.[6]?.value || '0');

        return {
          date: this.parseDate(row.dimensionValues?.[0]?.value || ''),
          activeUsers: parseInt(row.metricValues?.[0]?.value || '0'),
          newUsers: parseInt(row.metricValues?.[1]?.value || '0'),
          sessions,
          bounceRate: parseFloat(row.metricValues?.[3]?.value || '0'),
          engagementRate: parseFloat(row.metricValues?.[4]?.value || '0'),
          averageSessionDuration: parseFloat(row.metricValues?.[5]?.value || '0'),
          screenPageViews,
          screenPageViewsPerSession: sessions > 0 ? screenPageViews / sessions : 0,
          eventCount: parseInt(row.metricValues?.[7]?.value || '0'),
          conversions: parseInt(row.metricValues?.[8]?.value || '0'),
          totalRevenue: parseFloat(row.metricValues?.[9]?.value || '0'),
        };
      }) || []
    );
  }

  /**
   * Get traffic source metrics
   */
  async getTrafficSources(startDate: string, endDate: string): Promise<GA4TrafficSourceData[]> {
    const [response] = await this.analyticsDataClient.runReport({
      property: `properties/${this.propertyId}`,
      dateRanges: [{ startDate, endDate }],
      dimensions: [
        { name: 'date' },
        { name: 'sessionSource' },
        { name: 'sessionMedium' },
        { name: 'sessionCampaignName' },
      ],
      metrics: [
        { name: 'activeUsers' },
        { name: 'newUsers' },
        { name: 'sessions' },
        { name: 'bounceRate' },
        { name: 'engagementRate' },
        { name: 'conversions' },
        { name: 'totalRevenue' },
      ],
    });

    return (
      response.rows?.map((row) => {
        const source = row.dimensionValues?.[1]?.value || 'unknown';
        const medium = row.dimensionValues?.[2]?.value || 'unknown';
        const sourceMedium = `${source} / ${medium}`;

        return {
          date: this.parseDate(row.dimensionValues?.[0]?.value || ''),
          sourceMedium,
          source,
          medium,
          campaign: row.dimensionValues?.[3]?.value || undefined,
          activeUsers: parseInt(row.metricValues?.[0]?.value || '0'),
          newUsers: parseInt(row.metricValues?.[1]?.value || '0'),
          sessions: parseInt(row.metricValues?.[2]?.value || '0'),
          bounceRate: parseFloat(row.metricValues?.[3]?.value || '0'),
          engagementRate: parseFloat(row.metricValues?.[4]?.value || '0'),
          conversions: parseInt(row.metricValues?.[5]?.value || '0'),
          totalRevenue: parseFloat(row.metricValues?.[6]?.value || '0'),
        };
      }) || []
    );
  }

  /**
   * Get realtime data (last 30 minutes)
   */
  async getRealtimeData(): Promise<GA4RealtimeData> {
    const [response] = await this.analyticsDataClient.runRealtimeReport({
      property: `properties/${this.propertyId}`,
      metrics: [
        { name: 'activeUsers' },
        { name: 'screenPageViews' },
        { name: 'eventCount' },
      ],
    });

    // Get active users by page
    const [pageResponse] = await this.analyticsDataClient.runRealtimeReport({
      property: `properties/${this.propertyId}`,
      dimensions: [{ name: 'unifiedScreenName' }],
      metrics: [{ name: 'activeUsers' }],
      limit: 10,
    });

    // Get active users by source
    const [sourceResponse] = await this.analyticsDataClient.runRealtimeReport({
      property: `properties/${this.propertyId}`,
      dimensions: [{ name: 'sessionSource' }],
      metrics: [{ name: 'activeUsers' }],
      limit: 10,
    });

    // Get active users by country
    const [countryResponse] = await this.analyticsDataClient.runRealtimeReport({
      property: `properties/${this.propertyId}`,
      dimensions: [{ name: 'country' }],
      metrics: [{ name: 'activeUsers' }],
      limit: 10,
    });

    // Get active users by device
    const [deviceResponse] = await this.analyticsDataClient.runRealtimeReport({
      property: `properties/${this.propertyId}`,
      dimensions: [{ name: 'deviceCategory' }],
      metrics: [{ name: 'activeUsers' }],
      limit: 10,
    });

    return {
      activeUsers: parseInt(response.rows?.[0]?.metricValues?.[0]?.value || '0'),
      screenPageViews: parseInt(response.rows?.[0]?.metricValues?.[1]?.value || '0'),
      eventCount: parseInt(response.rows?.[0]?.metricValues?.[2]?.value || '0'),
      topPages:
        pageResponse.rows?.map((row) => ({
          page: row.dimensionValues?.[0]?.value || 'unknown',
          count: parseInt(row.metricValues?.[0]?.value || '0'),
        })) || [],
      topSources:
        sourceResponse.rows?.map((row) => ({
          source: row.dimensionValues?.[0]?.value || 'unknown',
          count: parseInt(row.metricValues?.[0]?.value || '0'),
        })) || [],
      topCountries:
        countryResponse.rows?.map((row) => ({
          country: row.dimensionValues?.[0]?.value || 'unknown',
          count: parseInt(row.metricValues?.[0]?.value || '0'),
        })) || [],
      topDevices:
        deviceResponse.rows?.map((row) => ({
          device: row.dimensionValues?.[0]?.value || 'unknown',
          count: parseInt(row.metricValues?.[0]?.value || '0'),
        })) || [],
    };
  }

  /**
   * Sync metrics to database
   */
  async syncMetrics(dbPropertyId: string, startDate: string, endDate: string) {
    const metrics = await this.getMetrics(startDate, endDate);

    for (const metric of metrics) {
      await prisma.gA4Metrics.upsert({
        where: {
          propertyId_date: {
            propertyId: dbPropertyId,
            date: metric.date,
          },
        },
        update: {
          activeUsers: metric.activeUsers,
          newUsers: metric.newUsers,
          sessions: metric.sessions,
          bounceRate: metric.bounceRate,
          engagementRate: metric.engagementRate,
          averageSessionDuration: metric.averageSessionDuration,
          screenPageViews: metric.screenPageViews,
          screenPageViewsPerSession: metric.screenPageViewsPerSession,
          eventCount: metric.eventCount,
          conversions: metric.conversions,
          totalRevenue: metric.totalRevenue,
        },
        create: {
          propertyId: dbPropertyId,
          date: metric.date,
          activeUsers: metric.activeUsers,
          newUsers: metric.newUsers,
          sessions: metric.sessions,
          bounceRate: metric.bounceRate,
          engagementRate: metric.engagementRate,
          averageSessionDuration: metric.averageSessionDuration,
          screenPageViews: metric.screenPageViews,
          screenPageViewsPerSession: metric.screenPageViewsPerSession,
          eventCount: metric.eventCount,
          conversions: metric.conversions,
          totalRevenue: metric.totalRevenue,
        },
      });
    }

    // Update last sync time
    await prisma.googleAnalyticsProperty.update({
      where: { id: dbPropertyId },
      data: {
        lastSyncAt: new Date(),
        syncStatus: 'success',
        syncErrorMessage: null,
      },
    });
  }

  /**
   * Sync traffic sources to database
   */
  async syncTrafficSources(dbPropertyId: string, startDate: string, endDate: string) {
    const sources = await this.getTrafficSources(startDate, endDate);

    for (const source of sources) {
      await prisma.gA4TrafficSource.upsert({
        where: {
          propertyId_date_sourceMedium: {
            propertyId: dbPropertyId,
            date: source.date,
            sourceMedium: source.sourceMedium,
          },
        },
        update: {
          source: source.source,
          medium: source.medium,
          campaign: source.campaign,
          activeUsers: source.activeUsers,
          newUsers: source.newUsers,
          sessions: source.sessions,
          bounceRate: source.bounceRate,
          engagementRate: source.engagementRate,
          conversions: source.conversions,
          totalRevenue: source.totalRevenue,
        },
        create: {
          propertyId: dbPropertyId,
          date: source.date,
          sourceMedium: source.sourceMedium,
          source: source.source,
          medium: source.medium,
          campaign: source.campaign,
          activeUsers: source.activeUsers,
          newUsers: source.newUsers,
          sessions: source.sessions,
          bounceRate: source.bounceRate,
          engagementRate: source.engagementRate,
          conversions: source.conversions,
          totalRevenue: source.totalRevenue,
        },
      });
    }
  }

  /**
   * Sync realtime data to database
   */
  async syncRealtimeData(dbPropertyId: string) {
    const realtimeData = await this.getRealtimeData();

    await prisma.gA4RealtimeMetrics.create({
      data: {
        propertyId: dbPropertyId,
        timestamp: new Date(),
        activeUsers: realtimeData.activeUsers,
        screenPageViews: realtimeData.screenPageViews,
        eventCount: realtimeData.eventCount,
        topPages: realtimeData.topPages,
        topSources: realtimeData.topSources,
        topCountries: realtimeData.topCountries,
        topDevices: realtimeData.topDevices,
      },
    });
  }

  /**
   * Sync all data (metrics + traffic sources)
   */
  async syncAll(dbPropertyId: string, daysBack: number = 30) {
    const endDate = format(new Date(), 'yyyy-MM-dd');
    const startDate = format(subDays(new Date(), daysBack), 'yyyy-MM-dd');

    try {
      console.log(`[GA4 Sync] Starting sync for property ${dbPropertyId}, dateRange: ${startDate} to ${endDate}`);

      console.log('[GA4 Sync] Step 1: Syncing metrics...');
      await this.syncMetrics(dbPropertyId, startDate, endDate);
      console.log('[GA4 Sync] Step 1: Metrics synced successfully');

      console.log('[GA4 Sync] Step 2: Syncing traffic sources...');
      await this.syncTrafficSources(dbPropertyId, startDate, endDate);
      console.log('[GA4 Sync] Step 2: Traffic sources synced successfully');

      console.log('[GA4 Sync] Step 3: Syncing realtime data...');
      try {
        await this.syncRealtimeData(dbPropertyId);
        console.log('[GA4 Sync] Step 3: Realtime data synced successfully');
      } catch (realtimeError) {
        console.warn('[GA4 Sync] Step 3: Realtime data sync failed (non-critical):', realtimeError instanceof Error ? realtimeError.message : realtimeError);
        console.warn('[GA4 Sync] Continuing without realtime data...');
      }

      console.log('[GA4 Sync] All sync operations completed successfully');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const errorDetails = error && typeof error === 'object' ? JSON.stringify(error, null, 2) : String(error);

      console.error('[GA4 Sync] Sync failed:', errorDetails);

      await prisma.googleAnalyticsProperty.update({
        where: { id: dbPropertyId },
        data: {
          syncStatus: 'error',
          syncErrorMessage: errorMessage,
        },
      });
      throw error;
    }
  }

  /**
   * Helper method to parse GA4 date format (YYYYMMDD)
   */
  private parseDate(dateString: string): Date {
    if (!dateString || dateString.length !== 8) {
      return startOfDay(new Date());
    }
    const year = parseInt(dateString.substring(0, 4));
    const month = parseInt(dateString.substring(4, 6)) - 1; // JS months are 0-indexed
    const day = parseInt(dateString.substring(6, 8));
    return new Date(year, month, day);
  }

  /**
   * Verify credentials and connection
   */
  async verifyConnection(): Promise<boolean> {
    try {
      await this.analyticsDataClient.runReport({
        property: `properties/${this.propertyId}`,
        dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
        dimensions: [{ name: 'date' }],
        metrics: [{ name: 'activeUsers' }],
        limit: 1,
      });
      return true;
    } catch (error) {
      console.error('GA4 connection verification failed:', error);
      return false;
    }
  }
}

/**
 * Factory function to create GA4 service instance from database property
 */
export async function createGA4ServiceFromDB(propertyId: string): Promise<GoogleAnalyticsService> {
  const property = await prisma.googleAnalyticsProperty.findUnique({
    where: { id: propertyId },
  });

  if (!property) {
    throw new Error('GA4 property not found');
  }

  if (!property.isActive) {
    throw new Error('GA4 property is not active');
  }

  return new GoogleAnalyticsService(
    {
      clientEmail: property.clientEmail,
      privateKey: property.privateKey,
      projectId: property.projectId,
    },
    property.propertyId
  );
}
