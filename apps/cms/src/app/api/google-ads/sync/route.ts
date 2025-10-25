import { NextRequest, NextResponse } from 'next/server';
import { googleAdsService } from '@/lib/google-ads';
import { prisma } from '@/lib/prisma';


// POST sync campaigns and metrics
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { accountId, syncType = 'all', dateFrom, dateTo } = body;

    if (!accountId) {
      return NextResponse.json(
        { error: 'Account ID is required' },
        { status: 400 }
      );
    }

    // Load account config
    const account = await googleAdsService.loadConfigFromDatabase(accountId);

    let result: any = {};

    if (syncType === 'campaigns' || syncType === 'all') {
      // Sync campaigns
      const campaignsResult = await googleAdsService.syncCampaigns(
        accountId,
        account.customerId
      );
      result.campaigns = campaignsResult;
    }

    if (syncType === 'metrics' || syncType === 'all') {
      if (!dateFrom || !dateTo) {
        return NextResponse.json(
          { error: 'dateFrom and dateTo are required for metrics sync' },
          { status: 400 }
        );
      }

      // Sync metrics
      const metricsResult = await googleAdsService.syncMetrics(
        accountId,
        account.customerId,
        dateFrom,
        dateTo
      );
      result.metrics = metricsResult;
    }

    return NextResponse.json({
      success: true,
      result,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to sync data', details: error.message },
      { status: 500 }
    );
  }
}
