import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET analysis history
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const sourceType = searchParams.get('sourceType');
    const sentimentLabel = searchParams.get('sentimentLabel');

    const where: any = {};
    if (sourceType) {
      where.sourceType = sourceType;
    }
    if (sentimentLabel) {
      where.sentimentLabel = sentimentLabel;
    }

    const analyses = await prisma.nLAnalysis.findMany({
      where,
      orderBy: { analyzedAt: 'desc' },
      take: limit,
      select: {
        id: true,
        sourceType: true,
        sourceId: true,
        text: true,
        sentimentScore: true,
        sentimentMagnitude: true,
        sentimentLabel: true,
        keywords: true,
        language: true,
        analyzedAt: true,
      },
    });

    // Calculate summary statistics
    const stats = {
      total: analyses.length,
      positive: analyses.filter((a) => a.sentimentLabel === 'POSITIVE').length,
      negative: analyses.filter((a) => a.sentimentLabel === 'NEGATIVE').length,
      neutral: analyses.filter((a) => a.sentimentLabel === 'NEUTRAL').length,
      mixed: analyses.filter((a) => a.sentimentLabel === 'MIXED').length,
      avgScore:
        analyses.length > 0
          ? analyses.reduce((sum, a) => sum + a.sentimentScore, 0) / analyses.length
          : 0,
      avgMagnitude:
        analyses.length > 0
          ? analyses.reduce((sum, a) => sum + a.sentimentMagnitude, 0) / analyses.length
          : 0,
    };

    return NextResponse.json({
      success: true,
      analyses,
      stats,
    });
  } catch (error) {
    console.error('[Natural Language] Failed to fetch history:', error);

    return NextResponse.json(
      {
        error: 'Failed to fetch history',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// DELETE analysis by ID
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Analysis ID is required' },
        { status: 400 }
      );
    }

    await prisma.nLAnalysis.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Analysis deleted successfully',
    });
  } catch (error) {
    console.error('[Natural Language] Failed to delete analysis:', error);

    return NextResponse.json(
      {
        error: 'Failed to delete analysis',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
