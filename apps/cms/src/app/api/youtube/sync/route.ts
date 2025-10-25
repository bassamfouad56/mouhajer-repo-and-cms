import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { GoogleYouTubeService } from '@/lib/google-youtube';

// POST sync YouTube channel data
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { channelIdDb, daysBack = 30 } = body;

    if (!channelIdDb) {
      return NextResponse.json(
        { error: 'Channel ID required' },
        { status: 400 }
      );
    }

    console.log(`[YouTube Sync] Starting sync for channel: ${channelIdDb}`);

    // Get channel from database
    const channel = await prisma.youTubeChannel.findUnique({
      where: { id: channelIdDb },
    });

    if (!channel) {
      return NextResponse.json(
        { error: 'Channel not found' },
        { status: 404 }
      );
    }

    // Update sync status
    await prisma.youTubeChannel.update({
      where: { id: channelIdDb },
      data: {
        syncStatus: 'syncing',
        lastSyncAt: new Date(),
      },
    });

    try {
      // Create service
      const service = new GoogleYouTubeService(
        channel.clientEmail,
        channel.privateKey
      );

      // Step 1: Update channel details
      console.log(`[YouTube Sync] Step 1: Updating channel details...`);
      const channelDetails = await service.getChannelDetails(channel.channelId);

      if (channelDetails) {
        await prisma.youTubeChannel.update({
          where: { id: channelIdDb },
          data: {
            channelName: channelDetails.title,
            description: channelDetails.description,
            subscriberCount: channelDetails.subscriberCount,
            videoCount: channelDetails.videoCount,
            viewCount: BigInt(channelDetails.viewCount),
            thumbnailUrl: channelDetails.thumbnails.medium,
          },
        });
      }

      // Step 2: Sync recent videos
      console.log(`[YouTube Sync] Step 2: Syncing recent videos...`);
      const videos = await service.getRecentVideos(channel.channelId, 20);

      for (const video of videos) {
        await prisma.youTubeVideo.upsert({
          where: { videoId: video.id },
          create: {
            channelId: channelIdDb,
            videoId: video.id,
            title: video.title,
            description: video.description,
            publishedAt: video.publishedAt,
            thumbnailUrl: video.thumbnails.medium,
            duration: video.duration,
            viewCount: video.viewCount,
            likeCount: video.likeCount,
            commentCount: video.commentCount,
            tags: video.tags || [],
          },
          update: {
            title: video.title,
            viewCount: video.viewCount,
            likeCount: video.likeCount,
            commentCount: video.commentCount,
          },
        });
      }

      // Step 3: Sync analytics
      console.log(`[YouTube Sync] Step 3: Syncing analytics...`);
      const endDate = new Date().toISOString().split('T')[0];
      const startDate = new Date(Date.now() - daysBack * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0];

      const analytics = await service.getAnalytics(
        channel.channelId,
        startDate,
        endDate
      );

      for (const day of analytics) {
        await prisma.youTubeAnalytics.upsert({
          where: {
            channelId_date: {
              channelId: channelIdDb,
              date: day.date,
            },
          },
          create: {
            channelId: channelIdDb,
            date: day.date,
            views: day.views,
            estimatedMinutesWatched: day.estimatedMinutesWatched,
            averageViewDuration: day.averageViewDuration,
            subscribersGained: day.subscribersGained,
            subscribersLost: day.subscribersLost,
            likes: day.likes,
            dislikes: day.dislikes,
            shares: day.shares,
            comments: day.comments,
          },
          update: {
            views: day.views,
            estimatedMinutesWatched: day.estimatedMinutesWatched,
            averageViewDuration: day.averageViewDuration,
            subscribersGained: day.subscribersGained,
            subscribersLost: day.subscribersLost,
            likes: day.likes,
            dislikes: day.dislikes,
            shares: day.shares,
            comments: day.comments,
          },
        });
      }

      // Update sync status to success
      await prisma.youTubeChannel.update({
        where: { id: channelIdDb },
        data: {
          syncStatus: 'success',
          syncErrorMessage: null,
        },
      });

      console.log(`[YouTube Sync] Sync completed successfully`);

      return NextResponse.json({
        success: true,
        message: 'Channel data synced successfully',
        stats: {
          videosUpdated: videos.length,
          analyticsDays: analytics.length,
        },
      });
    } catch (syncError) {
      // Update sync status to error
      await prisma.youTubeChannel.update({
        where: { id: channelIdDb },
        data: {
          syncStatus: 'error',
          syncErrorMessage:
            syncError instanceof Error ? syncError.message : 'Unknown error',
        },
      });

      throw syncError;
    }
  } catch (error) {
    console.error('[YouTube Sync] Failed:', error);

    return NextResponse.json(
      {
        error: 'Sync failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
