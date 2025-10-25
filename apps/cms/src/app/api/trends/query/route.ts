import { NextRequest, NextResponse } from 'next/server';
import { createTrendsService } from '@/lib/google-trends';
import { prisma } from '@/lib/prisma';

// POST query Google Trends
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { keyword, geo = '', timeRange = 'today 12-m', saveToDb = true } = body;

    if (!keyword) {
      return NextResponse.json({ error: 'Keyword is required' }, { status: 400 });
    }

    console.log(`[Trends API] Querying trends for "${keyword}"...`);

    const service = createTrendsService();

    // Fetch all data in parallel
    const [interestData, relatedQueries, regionalInterest] = await Promise.all([
      service.getInterestOverTime(keyword, geo, timeRange),
      service.getRelatedQueries(keyword, geo, timeRange),
      service.getRegionalInterest(keyword, geo, timeRange),
    ]);

    // Calculate peak and current interest
    const values = interestData.data.map((d) => d.value);
    const peakInterest = Math.max(...values);
    const currentInterest = values[values.length - 1] || 0;

    const result = {
      keyword,
      geo,
      timeRange,
      averageInterest: interestData.averageValue,
      peakInterest,
      currentInterest,
      interestOverTime: interestData.data,
      relatedQueries,
      regionalInterest,
    };

    // Save to database if requested
    if (saveToDb) {
      await prisma.trendsQuery.create({
        data: {
          keyword,
          geo: geo || null,
          timeRange,
          averageInterest: interestData.averageValue,
          peakInterest,
          currentInterest,
          interestOverTime: interestData.data,
          relatedQueries,
          regionalInterest,
        },
      });

      console.log('[Trends API] Query saved to database');
    }

    return NextResponse.json({
      success: true,
      result,
    });
  } catch (error) {
    console.error('[Trends API] Query failed:', error);

    return NextResponse.json(
      {
        error: 'Failed to query trends',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
