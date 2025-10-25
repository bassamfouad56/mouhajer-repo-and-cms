import { NextRequest, NextResponse } from 'next/server';
import { createTrendsService } from '@/lib/google-trends';
import { prisma } from '@/lib/prisma';

// GET real-time trending searches
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const geo = searchParams.get('geo') || 'US';
    const saveToDb = searchParams.get('saveToDb') === 'true';

    console.log(`[Trends API] Fetching real-time trends for ${geo}...`);

    const service = createTrendsService();
    const trends = await service.getRealTimeTrends(geo);

    // Save to database if requested
    if (saveToDb && trends.length > 0) {
      await prisma.trendsRealtime.createMany({
        data: trends.map((trend, index) => ({
          geo,
          title: trend.title,
          formattedTraffic: trend.formattedTraffic,
          image: trend.image || null,
          articles: trend.articles || null,
          shareUrl: trend.shareUrl || null,
          trafficValue: parseInt(trend.formattedTraffic.replace(/\D/g, '')) || 0,
          rank: index + 1,
        })),
        skipDuplicates: true,
      });

      console.log(`[Trends API] Saved ${trends.length} real-time trends to database`);
    }

    return NextResponse.json({
      success: true,
      geo,
      count: trends.length,
      trends,
    });
  } catch (error) {
    console.error('[Trends API] Real-time trends failed:', error);

    return NextResponse.json(
      {
        error: 'Failed to fetch real-time trends',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
