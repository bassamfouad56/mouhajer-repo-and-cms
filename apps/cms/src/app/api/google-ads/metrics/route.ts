import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';


// GET metrics with filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const accountId = searchParams.get('accountId');
    const campaignId = searchParams.get('campaignId');
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');

    if (!accountId) {
      return NextResponse.json(
        { error: 'Account ID is required' },
        { status: 400 }
      );
    }

    const where: any = { accountId };

    if (campaignId) {
      where.campaignId = campaignId;
    }

    if (dateFrom && dateTo) {
      where.date = {
        gte: new Date(dateFrom),
        lte: new Date(dateTo),
      };
    }

    const metrics = await prisma.googleAdsMetrics.findMany({
      where,
      orderBy: { date: 'desc' },
      take: 100,
    });

    // Calculate summary
    const summary = metrics.reduce(
      (acc, metric) => ({
        totalImpressions: acc.totalImpressions + metric.impressions,
        totalClicks: acc.totalClicks + metric.clicks,
        totalCost: acc.totalCost + metric.cost,
        totalConversions: acc.totalConversions + metric.conversions,
        totalConversionValue: acc.totalConversionValue + metric.conversionValue,
      }),
      {
        totalImpressions: 0,
        totalClicks: 0,
        totalCost: 0,
        totalConversions: 0,
        totalConversionValue: 0,
      }
    );

    return NextResponse.json({
      metrics,
      summary: {
        ...summary,
        averageCtr: summary.totalClicks / summary.totalImpressions || 0,
        averageCpc: summary.totalCost / summary.totalClicks || 0,
        costPerConversion: summary.totalCost / summary.totalConversions || 0,
        roas: summary.totalConversionValue / summary.totalCost || 0,
      },
      count: metrics.length,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to fetch metrics', details: error.message },
      { status: 500 }
    );
  }
}
