import { NextRequest, NextResponse } from 'next/server';
import { createTrendsService } from '@/lib/google-trends';
import { prisma } from '@/lib/prisma';

// POST compare multiple keywords
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name = 'Untitled Comparison',
      keywords,
      geo = '',
      timeRange = 'today 12-m',
      saveToDb = true,
    } = body;

    if (!keywords || !Array.isArray(keywords) || keywords.length < 2) {
      return NextResponse.json(
        { error: 'At least 2 keywords are required for comparison' },
        { status: 400 }
      );
    }

    if (keywords.length > 5) {
      return NextResponse.json(
        { error: 'Maximum 5 keywords allowed for comparison' },
        { status: 400 }
      );
    }

    console.log(`[Trends API] Comparing keywords: ${keywords.join(', ')}...`);

    const service = createTrendsService();
    const comparison = await service.compareKeywords(keywords, geo, timeRange);

    // Determine winner (keyword with highest average)
    const maxAverage = Math.max(...comparison.averages);
    const winnerIndex = comparison.averages.indexOf(maxAverage);
    const winner = keywords[winnerIndex];

    const result = {
      name,
      keywords,
      geo,
      timeRange,
      comparisonData: comparison.data,
      averages: comparison.averages.map((avg, index) => ({
        keyword: keywords[index],
        average: avg,
      })),
      winner,
    };

    // Save to database if requested
    if (saveToDb) {
      await prisma.trendsComparison.create({
        data: {
          name,
          keywords,
          geo,
          timeRange,
          comparisonData: comparison.data,
          averages: comparison.averages,
          winner,
        },
      });

      console.log('[Trends API] Comparison saved to database');
    }

    return NextResponse.json({
      success: true,
      result,
    });
  } catch (error) {
    console.error('[Trends API] Comparison failed:', error);

    return NextResponse.json(
      {
        error: 'Failed to compare keywords',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// GET comparison history
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20', 10);

    const comparisons = await prisma.trendsComparison.findMany({
      orderBy: { lastUpdatedAt: 'desc' },
      take: limit,
    });

    return NextResponse.json({
      success: true,
      count: comparisons.length,
      comparisons,
    });
  } catch (error) {
    console.error('[Trends API] Failed to fetch comparison history:', error);

    return NextResponse.json(
      {
        error: 'Failed to fetch comparison history',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
