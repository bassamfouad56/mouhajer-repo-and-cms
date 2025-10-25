import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { subDays } from 'date-fns';


export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const daysBack = parseInt(searchParams.get('daysBack') || '30');
    const startDate = subDays(new Date(), daysBack);

    // Check if any properties are configured
    const [adsAccountCount, ga4PropertyCount, gscPropertyCount, gtmAccountCount] = await Promise.all([
      prisma.googleAdsAccount.count({ where: { isActive: true } }),
      prisma.googleAnalyticsProperty.count({ where: { isActive: true } }),
      prisma.googleSearchConsoleProperty.count({ where: { isActive: true } }),
      prisma.googleTagManagerAccount.count({ where: { isActive: true } }),
    ]);

    const hasAnyProperties = adsAccountCount > 0 || ga4PropertyCount > 0 || gscPropertyCount > 0 || gtmAccountCount > 0;

    // Fetch Google Ads stats
    const adsMetrics = await prisma.googleAdsMetrics.findMany({
      where: {
        date: { gte: startDate },
      },
    });

    const googleAdsStats = {
      totalImpressions: adsMetrics.reduce((sum, m) => sum + m.impressions, 0),
      totalClicks: adsMetrics.reduce((sum, m) => sum + m.clicks, 0),
      totalCost: adsMetrics.reduce((sum, m) => sum + m.cost, 0),
      totalConversions: adsMetrics.reduce((sum, m) => sum + m.conversions, 0),
      averageCTR: adsMetrics.length > 0
        ? adsMetrics.reduce((sum, m) => sum + m.ctr, 0) / adsMetrics.length
        : 0,
      averageCPC: adsMetrics.length > 0
        ? adsMetrics.reduce((sum, m) => sum + m.averageCpc, 0) / adsMetrics.length
        : 0,
    };

    // Fetch GA4 stats
    const ga4Metrics = await prisma.gA4Metrics.findMany({
      where: {
        date: { gte: startDate },
      },
    });

    const ga4Stats = {
      totalActiveUsers: ga4Metrics.reduce((sum, m) => sum + m.activeUsers, 0),
      totalSessions: ga4Metrics.reduce((sum, m) => sum + m.sessions, 0),
      totalPageViews: ga4Metrics.reduce((sum, m) => sum + m.screenPageViews, 0),
      averageEngagementRate: ga4Metrics.length > 0
        ? ga4Metrics.reduce((sum, m) => sum + m.engagementRate, 0) / ga4Metrics.length
        : 0,
      totalConversions: ga4Metrics.reduce((sum, m) => sum + m.conversions, 0),
      totalRevenue: ga4Metrics.reduce((sum, m) => sum + m.totalRevenue, 0),
    };

    // Fetch Search Console stats
    const gscPerformance = await prisma.gSCPerformance.findMany({
      where: {
        date: { gte: startDate },
      },
    });

    const searchConsoleStats = {
      totalClicks: gscPerformance.reduce((sum, p) => sum + p.clicks, 0),
      totalImpressions: gscPerformance.reduce((sum, p) => sum + p.impressions, 0),
      averageCTR: gscPerformance.length > 0
        ? gscPerformance.reduce((sum, p) => sum + p.ctr, 0) / gscPerformance.length
        : 0,
      averagePosition: gscPerformance.length > 0
        ? gscPerformance.reduce((sum, p) => sum + p.position, 0) / gscPerformance.length
        : 0,
    };

    // Fetch GTM stats
    const [totalContainers, totalTags, totalTriggers, totalVariables] = await Promise.all([
      prisma.gTMContainer.count(),
      prisma.gTMTag.count(),
      prisma.gTMTrigger.count(),
      prisma.gTMVariable.count(),
    ]);

    const gtmStats = {
      totalContainers,
      totalTags,
      totalTriggers,
      totalVariables,
    };

    return NextResponse.json({
      googleAds: googleAdsStats,
      ga4: ga4Stats,
      searchConsole: searchConsoleStats,
      gtm: gtmStats,
      meta: {
        hasAnyProperties,
        propertyCounts: {
          googleAds: adsAccountCount,
          ga4: ga4PropertyCount,
          searchConsole: gscPropertyCount,
          gtm: gtmAccountCount,
        },
        hasData: {
          googleAds: adsMetrics.length > 0,
          ga4: ga4Metrics.length > 0,
          searchConsole: gscPerformance.length > 0,
          gtm: totalContainers > 0,
        }
      }
    });
  } catch (error) {
    console.error('Error fetching analytics overview:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch analytics overview',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
