import { GoogleAdsApi, Customer } from 'google-ads-api';
import { prisma } from "./prisma";


export interface GoogleAdsConfig {
  client_id: string;
  client_secret: string;
  developer_token: string;
  refresh_token: string;
  login_customer_id?: string;
}

export interface CampaignMetrics {
  campaignId: string;
  campaignName: string;
  status: string;
  impressions: number;
  clicks: number;
  cost: number;
  conversions: number;
  ctr: number;
  averageCpc: number;
}

export class GoogleAdsService {
  private client: GoogleAdsApi | null = null;
  private config: GoogleAdsConfig | null = null;

  constructor(config?: GoogleAdsConfig) {
    if (config) {
      this.config = config;
      this.initializeClient();
    }
  }

  private initializeClient() {
    if (!this.config) {
      throw new Error('Google Ads configuration is missing');
    }

    this.client = new GoogleAdsApi({
      client_id: this.config.client_id,
      client_secret: this.config.client_secret,
      developer_token: this.config.developer_token,
    });
  }

  async loadConfigFromDatabase(accountId: string) {
    const account = await prisma.googleAdsAccount.findUnique({
      where: { id: accountId },
    });

    if (!account) {
      throw new Error('Google Ads account not found');
    }

    this.config = {
      client_id: account.clientId,
      client_secret: account.clientSecret,
      developer_token: account.developerToken,
      refresh_token: account.refreshToken,
      login_customer_id: account.loginCustomerId || undefined,
    };

    this.initializeClient();
    return account;
  }

  async getCustomer(customerId: string): Promise<Customer> {
    if (!this.client || !this.config) {
      throw new Error('Google Ads client not initialized');
    }

    const customer = this.client.Customer({
      customer_id: customerId,
      refresh_token: this.config.refresh_token,
      login_customer_id: this.config.login_customer_id,
    });

    return customer;
  }

  async getCampaigns(customerId: string): Promise<any[]> {
    const customer = await this.getCustomer(customerId);

    const campaigns = await customer.query(`
      SELECT
        campaign.id,
        campaign.name,
        campaign.status,
        campaign.bidding_strategy_type,
        campaign_budget.amount_micros
      FROM campaign
      WHERE campaign.status IN ('ENABLED', 'PAUSED')
      ORDER BY campaign.name
    `);

    return campaigns;
  }

  async getCampaignMetrics(
    customerId: string,
    dateFrom: string,
    dateTo: string
  ): Promise<CampaignMetrics[]> {
    const customer = await this.getCustomer(customerId);

    const query = `
      SELECT
        campaign.id,
        campaign.name,
        campaign.status,
        metrics.impressions,
        metrics.clicks,
        metrics.cost_micros,
        metrics.conversions,
        metrics.ctr,
        metrics.average_cpc
      FROM campaign
      WHERE
        campaign.status IN ('ENABLED', 'PAUSED')
        AND segments.date BETWEEN '${dateFrom}' AND '${dateTo}'
      ORDER BY metrics.cost_micros DESC
    `;

    const results = await customer.query(query);

    return results.map((row: any) => ({
      campaignId: row.campaign.id.toString(),
      campaignName: row.campaign.name,
      status: row.campaign.status,
      impressions: row.metrics.impressions || 0,
      clicks: row.metrics.clicks || 0,
      cost: (row.metrics.cost_micros || 0) / 1_000_000,
      conversions: row.metrics.conversions || 0,
      ctr: row.metrics.ctr || 0,
      averageCpc: (row.metrics.average_cpc || 0) / 1_000_000,
    }));
  }

  async getAccountMetrics(
    customerId: string,
    dateFrom: string,
    dateTo: string
  ): Promise<any> {
    const customer = await this.getCustomer(customerId);

    const query = `
      SELECT
        metrics.impressions,
        metrics.clicks,
        metrics.cost_micros,
        metrics.conversions,
        metrics.all_conversions,
        metrics.conversions_value,
        metrics.ctr,
        metrics.average_cpc,
        metrics.average_cpm,
        metrics.search_impression_share,
        segments.date
      FROM customer
      WHERE segments.date BETWEEN '${dateFrom}' AND '${dateTo}'
      ORDER BY segments.date DESC
    `;

    const results = await customer.query(query);

    return results.map((row: any) => ({
      date: row.segments.date,
      impressions: row.metrics.impressions || 0,
      clicks: row.metrics.clicks || 0,
      cost: (row.metrics.cost_micros || 0) / 1_000_000,
      conversions: row.metrics.conversions || 0,
      allConversions: row.metrics.all_conversions || 0,
      conversionValue: row.metrics.conversions_value || 0,
      ctr: row.metrics.ctr || 0,
      averageCpc: (row.metrics.average_cpc || 0) / 1_000_000,
      averageCpm: (row.metrics.average_cpm || 0) / 1_000_000,
      searchImpressionShare: row.metrics.search_impression_share || 0,
    }));
  }

  async syncCampaigns(accountId: string, customerId: string) {
    try {
      const campaigns = await this.getCampaigns(customerId);

      for (const campaign of campaigns) {
        await prisma.googleAdsCampaign.upsert({
          where: {
            accountId_campaignId: {
              accountId,
              campaignId: campaign.campaign.id.toString(),
            },
          },
          update: {
            campaignName: campaign.campaign.name,
            status: campaign.campaign.status,
            biddingStrategy: campaign.campaign.bidding_strategy_type,
            budgetMicros: campaign.campaign_budget?.amount_micros || null,
            budget: campaign.campaign_budget?.amount_micros
              ? Number(campaign.campaign_budget.amount_micros) / 1_000_000
              : null,
            updatedAt: new Date(),
          },
          create: {
            accountId,
            campaignId: campaign.campaign.id.toString(),
            campaignName: campaign.campaign.name,
            status: campaign.campaign.status,
            biddingStrategy: campaign.campaign.bidding_strategy_type,
            budgetMicros: campaign.campaign_budget?.amount_micros || null,
            budget: campaign.campaign_budget?.amount_micros
              ? Number(campaign.campaign_budget.amount_micros) / 1_000_000
              : null,
          },
        });
      }

      await prisma.googleAdsAccount.update({
        where: { id: accountId },
        data: {
          lastSyncAt: new Date(),
          syncStatus: 'success',
          syncErrorMessage: null,
        },
      });

      return { success: true, count: campaigns.length };
    } catch (error: any) {
      await prisma.googleAdsAccount.update({
        where: { id: accountId },
        data: {
          syncStatus: 'error',
          syncErrorMessage: error.message,
        },
      });

      throw error;
    }
  }

  async syncMetrics(
    accountId: string,
    customerId: string,
    dateFrom: string,
    dateTo: string
  ) {
    try {
      const metrics = await this.getAccountMetrics(customerId, dateFrom, dateTo);

      for (const metric of metrics) {
        await prisma.googleAdsMetrics.upsert({
          where: {
            accountId_campaignId_date: {
              accountId,
              campaignId: null,
              date: new Date(metric.date),
            },
          },
          update: {
            impressions: metric.impressions,
            clicks: metric.clicks,
            cost: metric.cost,
            costMicros: BigInt(Math.round(metric.cost * 1_000_000)),
            conversions: metric.conversions,
            conversionValue: metric.conversionValue,
            ctr: metric.ctr,
            averageCpc: metric.averageCpc,
            averageCpm: metric.averageCpm,
            searchImpressionShare: metric.searchImpressionShare,
            updatedAt: new Date(),
          },
          create: {
            accountId,
            campaignId: null,
            date: new Date(metric.date),
            impressions: metric.impressions,
            clicks: metric.clicks,
            cost: metric.cost,
            costMicros: BigInt(Math.round(metric.cost * 1_000_000)),
            conversions: metric.conversions,
            conversionValue: metric.conversionValue,
            ctr: metric.ctr,
            averageCpc: metric.averageCpc,
            averageCpm: metric.averageCpm,
            searchImpressionShare: metric.searchImpressionShare,
          },
        });
      }

      return { success: true, count: metrics.length };
    } catch (error: any) {
      throw error;
    }
  }
}

export const googleAdsService = new GoogleAdsService();
