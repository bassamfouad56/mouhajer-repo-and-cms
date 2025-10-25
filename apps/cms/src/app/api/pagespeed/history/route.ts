import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { subDays } from 'date-fns';

// GET historical PageSpeed analysis data
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');
    const strategy = searchParams.get('strategy') || 'mobile';
    const days = parseInt(searchParams.get('days') || '30', 10);
    const limit = parseInt(searchParams.get('limit') || '100', 10);

    const startDate = subDays(new Date(), days);

    // Build where clause
    const where: any = {
      timestamp: { gte: startDate },
    };

    if (url) {
      where.url = url;
    }

    if (strategy && strategy !== 'all') {
      where.strategy = strategy;
    }

    const analyses = await prisma.pageSpeedAnalysis.findMany({
      where,
      orderBy: { timestamp: 'desc' },
      take: limit,
      select: {
        id: true,
        url: true,
        strategy: true,
        performanceScore: true,
        lcp: true,
        fid: true,
        cls: true,
        fcp: true,
        ttfb: true,
        speedIndex: true,
        totalBlockingTime: true,
        interactive: true,
        timestamp: true,
      },
    });

    return NextResponse.json({
      success: true,
      count: analyses.length,
      analyses,
    });
  } catch (error) {
    console.error('[PageSpeed] Failed to fetch history:', error);

    return NextResponse.json(
      {
        error: 'Failed to fetch analysis history',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
