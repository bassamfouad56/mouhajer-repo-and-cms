import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { subDays } from 'date-fns';

// GET query history
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const keyword = searchParams.get('keyword');
    const geo = searchParams.get('geo');
    const days = parseInt(searchParams.get('days') || '30', 10);
    const limit = parseInt(searchParams.get('limit') || '50', 10);

    const startDate = subDays(new Date(), days);

    // Build where clause
    const where: any = {
      queriedAt: { gte: startDate },
    };

    if (keyword) {
      where.keyword = { contains: keyword, mode: 'insensitive' };
    }

    if (geo) {
      where.geo = geo;
    }

    const queries = await prisma.trendsQuery.findMany({
      where,
      orderBy: { queriedAt: 'desc' },
      take: limit,
      select: {
        id: true,
        keyword: true,
        geo: true,
        timeRange: true,
        averageInterest: true,
        peakInterest: true,
        currentInterest: true,
        queriedAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      count: queries.length,
      queries,
    });
  } catch (error) {
    console.error('[Trends API] Failed to fetch query history:', error);

    return NextResponse.json(
      {
        error: 'Failed to fetch query history',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
