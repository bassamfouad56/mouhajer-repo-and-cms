/**
 * Room Redesign Image Serving API
 * Serves original and generated images from external drive
 */

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { readFile } from 'fs/promises';
import { existsSync } from 'fs';

const prisma = new PrismaClient();

/**
 * GET /api/room-redesign/image/[id]/[type]
 * Serve image files from external drive
 *
 * @param id - Redesign ID
 * @param type - "original" or "generated"
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; type: string }> }
) {
  try {
    const resolvedParams = await params;
    const { id, type } = resolvedParams;

    // Validate type parameter
    if (type !== 'original' && type !== 'generated') {
      return NextResponse.json(
        { error: 'Invalid image type. Must be "original" or "generated"' },
        { status: 400 }
      );
    }

    // Find redesign in database
    const redesign = await prisma.roomRedesign.findUnique({
      where: { id },
      select: {
        originalImagePath: true,
        generatedImagePath: true,
        status: true,
      },
    });

    if (!redesign) {
      return NextResponse.json(
        { error: 'Redesign not found' },
        { status: 404 }
      );
    }

    // Get appropriate file path
    const imagePath = type === 'original'
      ? redesign.originalImagePath
      : redesign.generatedImagePath;

    if (!imagePath) {
      if (type === 'generated' && redesign.status === 'PROCESSING') {
        return NextResponse.json(
          { error: 'Generated image is not ready yet. Still processing.' },
          { status: 202 }
        );
      }

      return NextResponse.json(
        { error: 'Image not found' },
        { status: 404 }
      );
    }

    // Check if file exists on disk
    if (!existsSync(imagePath)) {
      console.error(`[Image API] File not found on disk: ${imagePath}`);
      return NextResponse.json(
        { error: 'Image file not found on server' },
        { status: 404 }
      );
    }

    // Read file from external drive
    const fileBuffer = await readFile(imagePath);

    // Determine content type from file extension
    const extension = imagePath.split('.').pop()?.toLowerCase();
    const contentTypeMap: Record<string, string> = {
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'webp': 'image/webp',
    };
    const contentType = contentTypeMap[extension || 'jpg'] || 'image/jpeg';

    // Return image with proper headers
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable', // Cache for 1 year
        'Content-Length': fileBuffer.length.toString(),
      },
    });

  } catch (error) {
    console.error('[Image API] Error serving image:', error);
    return NextResponse.json(
      { error: 'Failed to serve image' },
      { status: 500 }
    );
  }
}

/**
 * HEAD /api/room-redesign/image/[id]/[type]
 * Check if image exists without downloading it
 */
export async function HEAD(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; type: string }> }
) {
  try {
    const resolvedParams = await params;
    const { id, type } = resolvedParams;

    if (type !== 'original' && type !== 'generated') {
      return new NextResponse(null, { status: 400 });
    }

    const redesign = await prisma.roomRedesign.findUnique({
      where: { id },
      select: {
        originalImagePath: true,
        generatedImagePath: true,
      },
    });

    if (!redesign) {
      return new NextResponse(null, { status: 404 });
    }

    const imagePath = type === 'original'
      ? redesign.originalImagePath
      : redesign.generatedImagePath;

    if (!imagePath || !existsSync(imagePath)) {
      return new NextResponse(null, { status: 404 });
    }

    return new NextResponse(null, {
      status: 200,
      headers: {
        'Content-Type': 'image/jpeg',
      },
    });

  } catch (error) {
    console.error('[Image API - HEAD] Error:', error);
    return new NextResponse(null, { status: 500 });
  }
}
