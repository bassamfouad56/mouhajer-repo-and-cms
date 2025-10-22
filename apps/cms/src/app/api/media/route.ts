import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { deleteFiles } from '@/lib/blob-upload';
import { auth } from '@/lib/auth';

export async function GET() {
  try {
    const mediaFiles = await prisma.mediaFile.findMany({
      orderBy: { uploadedAt: 'desc' },
    });
    return NextResponse.json(mediaFiles);
  } catch (error) {
    console.error('Error fetching media files:', error);
    return NextResponse.json(
      { error: 'Failed to fetch media files' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Validate required fields
    if (!body.name) {
      return NextResponse.json(
        { error: 'File name is required' },
        { status: 400 }
      );
    }

    if (!body.url) {
      return NextResponse.json(
        { error: 'File URL is required' },
        { status: 400 }
      );
    }

    if (!body.type) {
      return NextResponse.json(
        { error: 'File type is required' },
        { status: 400 }
      );
    }

    if (!body.size) {
      return NextResponse.json(
        { error: 'File size is required' },
        { status: 400 }
      );
    }

    const mediaFile = await prisma.mediaFile.create({
      data: {
        name: body.name,
        originalName: body.originalName || body.name,
        url: body.url,
        type: body.type,
        size: body.size,
        width: body.width || null,
        height: body.height || null,
        thumbnailUrl: body.thumbnailUrl || null,
        uploadedBy: body.uploadedBy || null,
        alt: body.alt || '',
        caption: body.caption || '',
      },
    });

    return NextResponse.json(mediaFile, { status: 201 });
  } catch (error) {
    console.error('Error creating media file:', error);
    return NextResponse.json(
      { error: 'Failed to create media file' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'File ID is required' },
        { status: 400 }
      );
    }

    const updatedFile = await prisma.mediaFile.update({
      where: { id },
      data: updates,
    });

    return NextResponse.json(updatedFile);
  } catch (error) {
    if (error instanceof Error && error.message.includes('Record to update not found')) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      );
    }
    console.error('Error updating media file:', error);
    return NextResponse.json(
      { error: 'Failed to update media file' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { ids } = body;

    if (!ids || !Array.isArray(ids)) {
      return NextResponse.json(
        { error: 'File IDs array is required' },
        { status: 400 }
      );
    }

    // Get media files to delete from Blob storage
    const mediaFiles = await prisma.mediaFile.findMany({
      where: { id: { in: ids } },
    });

    // Delete from database
    await prisma.mediaFile.deleteMany({
      where: { id: { in: ids } },
    });

    // Delete from Blob storage
    const urls = mediaFiles.flatMap(f => [f.url, f.thumbnailUrl].filter(Boolean) as string[]);
    if (urls.length > 0) {
      await deleteFiles(urls);
    }

    return NextResponse.json({ message: 'Files deleted successfully' });
  } catch (error) {
    console.error('Error deleting media files:', error);
    return NextResponse.json(
      { error: 'Failed to delete media files' },
      { status: 500 }
    );
  }
}
