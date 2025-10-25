import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { GoogleYouTubeService } from '@/lib/google-youtube';

// GET all YouTube channels
export async function GET() {
  try {
    const channels = await prisma.youTubeChannel.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        channelId: true,
        channelName: true,
        description: true,
        customUrl: true,
        thumbnailUrl: true,
        subscriberCount: true,
        videoCount: true,
        viewCount: true,
        isActive: true,
        lastSyncAt: true,
        syncStatus: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ success: true, channels });
  } catch (error) {
    console.error('Failed to fetch YouTube channels:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch channels',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// POST add new YouTube channel
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { channelId, channelName, clientEmail, privateKey, projectId } = body;

    if (!channelId || !channelName || !clientEmail || !privateKey) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    console.log(`[YouTube] Adding channel: ${channelName}`);

    // Test connection and get channel details
    const service = new GoogleYouTubeService(clientEmail, privateKey);
    const channelDetails = await service.getChannelDetails(channelId);

    if (!channelDetails) {
      return NextResponse.json(
        { error: 'Channel not found or inaccessible' },
        { status: 404 }
      );
    }

    // Check if channel already exists
    const existingChannel = await prisma.youTubeChannel.findUnique({
      where: { channelId },
    });

    if (existingChannel) {
      return NextResponse.json(
        { error: 'Channel already added' },
        { status: 409 }
      );
    }

    // Create channel record
    const channel = await prisma.youTubeChannel.create({
      data: {
        channelId,
        channelName: channelDetails.title,
        description: channelDetails.description,
        customUrl: channelDetails.customUrl,
        publishedAt: channelDetails.publishedAt,
        thumbnailUrl: channelDetails.thumbnails.medium,
        subscriberCount: channelDetails.subscriberCount,
        videoCount: channelDetails.videoCount,
        viewCount: BigInt(channelDetails.viewCount),
        clientEmail,
        privateKey,
        projectId: projectId || null,
        syncStatus: 'success',
        lastSyncAt: new Date(),
      },
    });

    console.log(`[YouTube] Channel added successfully: ${channel.id}`);

    return NextResponse.json({
      success: true,
      message: 'Channel added successfully',
      channel: {
        id: channel.id,
        channelId: channel.channelId,
        channelName: channel.channelName,
        subscriberCount: channel.subscriberCount,
      },
    });
  } catch (error) {
    console.error('[YouTube] Failed to add channel:', error);

    return NextResponse.json(
      {
        error: 'Failed to add channel',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
