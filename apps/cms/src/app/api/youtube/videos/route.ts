import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET videos for a channel
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const channelId = searchParams.get('channelId');
    const limit = parseInt(searchParams.get('limit') || '20');

    if (!channelId) {
      return NextResponse.json(
        { error: 'Channel ID required' },
        { status: 400 }
      );
    }

    const videos = await prisma.youTubeVideo.findMany({
      where: { channelId },
      orderBy: { publishedAt: 'desc' },
      take: limit,
    });

    return NextResponse.json({ success: true, videos });
  } catch (error) {
    console.error('[YouTube] Failed to fetch videos:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch videos',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
