import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET detailed analysis by ID
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const analysis = await prisma.pageSpeedAnalysis.findUnique({
      where: { id },
    });

    if (!analysis) {
      return NextResponse.json({ error: 'Analysis not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      analysis,
    });
  } catch (error) {
    console.error('[PageSpeed] Failed to fetch analysis details:', error);

    return NextResponse.json(
      {
        error: 'Failed to fetch analysis details',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
