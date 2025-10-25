import { google, searchconsole_v1 } from 'googleapis';
import { prisma } from "./prisma";
import { format, subDays } from 'date-fns';


export interface GSCCredentials {
  clientEmail: string;
  privateKey: string;
}

export interface GSCPerformanceData {
  date: Date;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export interface GSCQueryData {
  date: Date;
  query: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export interface GSCPageData {
  date: Date;
  page: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export interface GSCInsight {
  totalClicks: number;
  totalImpressions: number;
  averageCTR: number;
  averagePosition: number;
  topQueries: Array<{ query: string; clicks: number; impressions: number }>;
  topPages: Array<{ page: string; clicks: number; impressions: number }>;
}

export class GoogleSearchConsoleService {
  private searchConsole: searchconsole_v1.Searchconsole;
  private siteUrl: string;

  constructor(credentials: GSCCredentials, siteUrl: string) {
    this.siteUrl = siteUrl;

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: credentials.clientEmail,
        private_key: credentials.privateKey.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
    });

    this.searchConsole = google.searchconsole({
      version: 'v1',
      auth,
    });
  }

  /**
   * Get performance data (overall stats)
   */
  async getPerformance(startDate: string, endDate: string): Promise<GSCPerformanceData[]> {
    const response = await this.searchConsole.searchanalytics.query({
      siteUrl: this.siteUrl,
      requestBody: {
        startDate,
        endDate,
        dimensions: ['date'],
        rowLimit: 25000,
      },
    });

    return (
      response.data.rows?.map((row) => ({
        date: new Date(row.keys?.[0] || ''),
        clicks: row.clicks || 0,
        impressions: row.impressions || 0,
        ctr: row.ctr || 0,
        position: row.position || 0,
      })) || []
    );
  }

  /**
   * Get query performance (keyword data)
   */
  async getQueryPerformance(startDate: string, endDate: string, limit: number = 1000): Promise<GSCQueryData[]> {
    const response = await this.searchConsole.searchanalytics.query({
      siteUrl: this.siteUrl,
      requestBody: {
        startDate,
        endDate,
        dimensions: ['date', 'query'],
        rowLimit: limit,
      },
    });

    return (
      response.data.rows?.map((row) => ({
        date: new Date(row.keys?.[0] || ''),
        query: row.keys?.[1] || '',
        clicks: row.clicks || 0,
        impressions: row.impressions || 0,
        ctr: row.ctr || 0,
        position: row.position || 0,
      })) || []
    );
  }

  /**
   * Get page performance (URL data)
   */
  async getPagePerformance(startDate: string, endDate: string, limit: number = 1000): Promise<GSCPageData[]> {
    const response = await this.searchConsole.searchanalytics.query({
      siteUrl: this.siteUrl,
      requestBody: {
        startDate,
        endDate,
        dimensions: ['date', 'page'],
        rowLimit: limit,
      },
    });

    return (
      response.data.rows?.map((row) => ({
        date: new Date(row.keys?.[0] || ''),
        page: row.keys?.[1] || '',
        clicks: row.clicks || 0,
        impressions: row.impressions || 0,
        ctr: row.ctr || 0,
        position: row.position || 0,
      })) || []
    );
  }

  /**
   * Get top queries (most clicked/impressed)
   */
  async getTopQueries(startDate: string, endDate: string, limit: number = 100): Promise<GSCQueryData[]> {
    const response = await this.searchConsole.searchanalytics.query({
      siteUrl: this.siteUrl,
      requestBody: {
        startDate,
        endDate,
        dimensions: ['query'],
        rowLimit: limit,
      },
    });

    const endDateObj = new Date(endDate);

    return (
      response.data.rows?.map((row) => ({
        date: endDateObj,
        query: row.keys?.[0] || '',
        clicks: row.clicks || 0,
        impressions: row.impressions || 0,
        ctr: row.ctr || 0,
        position: row.position || 0,
      })) || []
    );
  }

  /**
   * Get top pages (most clicked/impressed)
   */
  async getTopPages(startDate: string, endDate: string, limit: number = 100): Promise<GSCPageData[]> {
    const response = await this.searchConsole.searchanalytics.query({
      siteUrl: this.siteUrl,
      requestBody: {
        startDate,
        endDate,
        dimensions: ['page'],
        rowLimit: limit,
      },
    });

    const endDateObj = new Date(endDate);

    return (
      response.data.rows?.map((row) => ({
        date: endDateObj,
        page: row.keys?.[0] || '',
        clicks: row.clicks || 0,
        impressions: row.impressions || 0,
        ctr: row.ctr || 0,
        position: row.position || 0,
      })) || []
    );
  }

  /**
   * Get comprehensive insights
   */
  async getInsights(startDate: string, endDate: string): Promise<GSCInsight> {
    const [performance, topQueries, topPages] = await Promise.all([
      this.getPerformance(startDate, endDate),
      this.getTopQueries(startDate, endDate, 10),
      this.getTopPages(startDate, endDate, 10),
    ]);

    const totalClicks = performance.reduce((sum, day) => sum + day.clicks, 0);
    const totalImpressions = performance.reduce((sum, day) => sum + day.impressions, 0);
    const averageCTR = totalImpressions > 0 ? totalClicks / totalImpressions : 0;
    const averagePosition =
      performance.length > 0
        ? performance.reduce((sum, day) => sum + day.position, 0) / performance.length
        : 0;

    return {
      totalClicks,
      totalImpressions,
      averageCTR,
      averagePosition,
      topQueries: topQueries.map((q) => ({
        query: q.query,
        clicks: q.clicks,
        impressions: q.impressions,
      })),
      topPages: topPages.map((p) => ({
        page: p.page,
        clicks: p.clicks,
        impressions: p.impressions,
      })),
    };
  }

  /**
   * Sync performance data to database
   */
  async syncPerformance(dbPropertyId: string, startDate: string, endDate: string) {
    const performanceData = await this.getPerformance(startDate, endDate);

    for (const data of performanceData) {
      await prisma.gSCPerformance.upsert({
        where: {
          propertyId_date: {
            propertyId: dbPropertyId,
            date: data.date,
          },
        },
        update: {
          clicks: data.clicks,
          impressions: data.impressions,
          ctr: data.ctr,
          position: data.position,
        },
        create: {
          propertyId: dbPropertyId,
          date: data.date,
          clicks: data.clicks,
          impressions: data.impressions,
          ctr: data.ctr,
          position: data.position,
        },
      });
    }

    // Update last sync time
    await prisma.googleSearchConsoleProperty.update({
      where: { id: dbPropertyId },
      data: {
        lastSyncAt: new Date(),
        syncStatus: 'success',
        syncErrorMessage: null,
      },
    });
  }

  /**
   * Sync query data to database
   */
  async syncQueries(dbPropertyId: string, startDate: string, endDate: string, limit: number = 1000) {
    const queries = await this.getQueryPerformance(startDate, endDate, limit);

    for (const query of queries) {
      await prisma.gSCQuery.upsert({
        where: {
          propertyId_date_query: {
            propertyId: dbPropertyId,
            date: query.date,
            query: query.query,
          },
        },
        update: {
          clicks: query.clicks,
          impressions: query.impressions,
          ctr: query.ctr,
          position: query.position,
        },
        create: {
          propertyId: dbPropertyId,
          date: query.date,
          query: query.query,
          clicks: query.clicks,
          impressions: query.impressions,
          ctr: query.ctr,
          position: query.position,
        },
      });
    }
  }

  /**
   * Sync page data to database
   */
  async syncPages(dbPropertyId: string, startDate: string, endDate: string, limit: number = 1000) {
    const pages = await this.getPagePerformance(startDate, endDate, limit);

    for (const page of pages) {
      await prisma.gSCPage.upsert({
        where: {
          propertyId_date_page: {
            propertyId: dbPropertyId,
            date: page.date,
            page: page.page,
          },
        },
        update: {
          clicks: page.clicks,
          impressions: page.impressions,
          ctr: page.ctr,
          position: page.position,
        },
        create: {
          propertyId: dbPropertyId,
          date: page.date,
          page: page.page,
          clicks: page.clicks,
          impressions: page.impressions,
          ctr: page.ctr,
          position: page.position,
        },
      });
    }
  }

  /**
   * Sync all data (performance + queries + pages)
   */
  async syncAll(dbPropertyId: string, daysBack: number = 30) {
    const endDate = format(new Date(), 'yyyy-MM-dd');
    const startDate = format(subDays(new Date(), daysBack), 'yyyy-MM-dd');

    try {
      await this.syncPerformance(dbPropertyId, startDate, endDate);
      await this.syncQueries(dbPropertyId, startDate, endDate);
      await this.syncPages(dbPropertyId, startDate, endDate);
    } catch (error) {
      await prisma.googleSearchConsoleProperty.update({
        where: { id: dbPropertyId },
        data: {
          syncStatus: 'error',
          syncErrorMessage: error instanceof Error ? error.message : 'Unknown error',
        },
      });
      throw error;
    }
  }

  /**
   * Verify credentials and connection
   */
  async verifyConnection(): Promise<boolean> {
    try {
      const response = await this.searchConsole.sites.get({
        siteUrl: this.siteUrl,
      });
      return !!response.data;
    } catch (error) {
      console.error('Search Console connection verification failed:', error);
      return false;
    }
  }

  /**
   * List all sites accessible with current credentials
   */
  async listSites(): Promise<string[]> {
    try {
      const response = await this.searchConsole.sites.list();
      return response.data.siteEntry?.map((site) => site.siteUrl || '') || [];
    } catch (error) {
      console.error('Failed to list sites:', error);
      return [];
    }
  }
}

/**
 * Factory function to create Search Console service instance from database property
 */
export async function createGSCServiceFromDB(
  propertyId: string
): Promise<GoogleSearchConsoleService> {
  const property = await prisma.googleSearchConsoleProperty.findUnique({
    where: { id: propertyId },
  });

  if (!property) {
    throw new Error('Search Console property not found');
  }

  if (!property.isActive) {
    throw new Error('Search Console property is not active');
  }

  return new GoogleSearchConsoleService(
    {
      clientEmail: property.clientEmail,
      privateKey: property.privateKey,
    },
    property.siteUrl
  );
}
