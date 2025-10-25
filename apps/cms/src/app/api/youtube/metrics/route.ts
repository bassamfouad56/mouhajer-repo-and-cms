import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET summary metrics for a channel
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const channelId = searchParams.get('channelId');
    const daysBack = parseInt(searchParams.get('daysBack') || '30');

    if (!channelId) {
      return NextResponse.json(
        { error: 'Channel ID required' },
        { status: 400 }
      );
    }

    const startDate = new Date(Date.now() - daysBack * 24 * 60 * 60 * 1000);

    // Get analytics data
    const analytics = await prisma.youTubeAnalytics.findMany({
      where: {
        channelId,
        date: { gte: startDate },
      },
      orderBy: { date: 'asc' },
    });

    // Calculate summary metrics
    const totalViews = analytics.reduce((sum, day) => sum + day.views, 0);
    const totalWatchTime = analytics.reduce(
      (sum, day) => sum + day.estimatedMinutesWatched,
      0
    ) / 60; // Convert to hours

    const totalSubscribersGained = analytics.reduce(
      (sum, day) => sum + day.subscribersGained,
      0
    );
    const totalSubscribersLost = analytics.reduce(
      (sum, day) => sum + day.subscribersLost,
      0
    );
    const subscriberGrowth = totalSubscribersGained - totalSubscribersLost;

    const totalLikes = analytics.reduce((sum, day) => sum + day.likes, 0);
    const totalComments = analytics.reduce((sum, day) => sum + day.comments, 0);
    const engagementRate =
      totalViews > 0 ? ((totalLikes + totalComments) / totalViews) * 100 : 0;

    const avgViewDuration =
      analytics.length > 0
        ? analytics.reduce((sum, day) => sum + day.averageViewDuration, 0) /
          analytics.length
        : 0;

    // Get channel stats
    const channel = await prisma.youTubeChannel.findUnique({
      where: { id: channelId },
      select: { subscriberCount: true, videoCount: true },
    });

    return NextResponse.json({
      success: true,
      metrics: {
        totalViews,
        totalWatchTime: Math.round(totalWatchTime),
        totalSubscribers: channel?.subscriberCount || 0,
        totalVideos: channel?.videoCount || 0,
        averageViewDuration: Math.round(avgViewDuration),
        subscriberGrowth,
        engagementRate: parseFloat(engagementRate.toFixed(2)),
      },
      chartData: analytics.map((day) => ({
        date: day.date,
        views: day.views,
        watchTime: day.estimatedMinutesWatched,
        subscribersGained: day.subscribersGained,
        subscribersLost: day.subscribersLost,
      })),
    });
  } catch (error) {
    console.error('[YouTube] Failed to fetch metrics:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch metrics',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
