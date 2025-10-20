import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { deleteFile } from '@/lib/blob-upload';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const media = await prisma.mediaFile.findUnique({
      where: { id },
    });

    if (!media) {
      return NextResponse.json(
        { error: 'Media file not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(media);
  } catch (error) {
    console.error('Error fetching media:', error);
    return NextResponse.json(
      { error: 'Failed to fetch media file' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await request.json();

    const updatedMedia = await prisma.mediaFile.update({
      where: { id },
      data: body,
    });

    return NextResponse.json(updatedMedia);
  } catch (error) {
    if (error instanceof Error && error.message.includes('Record to update not found')) {
      return NextResponse.json(
        { error: 'Media file not found' },
        { status: 404 }
      );
    }
    console.error('Error updating media:', error);
    return NextResponse.json(
      { error: 'Failed to update media file' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;

    // Get media file details
    const media = await prisma.mediaFile.findUnique({
      where: { id },
    });

    if (!media) {
      return NextResponse.json(
        { error: 'Media file not found' },
        { status: 404 }
      );
    }

    // Delete from database
    await prisma.mediaFile.delete({
      where: { id },
    });

    // Delete from Blob storage
    await deleteFile(media.url);

    // Delete thumbnail if exists
    if (media.thumbnailUrl) {
      await deleteFile(media.thumbnailUrl);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message.includes('Record to delete does not exist')) {
      return NextResponse.json(
        { error: 'Media file not found' },
        { status: 404 }
      );
    }
    console.error('Error deleting media:', error);
    return NextResponse.json(
      { error: 'Failed to delete media file' },
      { status: 500 }
    );
  }
}
