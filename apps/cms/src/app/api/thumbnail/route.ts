import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const imageUrl = searchParams.get('url');
    const width = parseInt(searchParams.get('width') || '300');
    const height = parseInt(searchParams.get('height') || '300');
    const fit = (searchParams.get('fit') || 'cover') as 'cover' | 'contain' | 'fill' | 'inside' | 'outside';

    if (!imageUrl) {
      return NextResponse.json(
        { error: 'Image URL is required' },
        { status: 400 }
      );
    }

    // Validate dimensions
    if (width < 1 || width > 2000 || height < 1 || height > 2000) {
      return NextResponse.json(
        { error: 'Width and height must be between 1 and 2000 pixels' },
        { status: 400 }
      );
    }

    // Extract the file path from URL
    // Assuming URL is like /uploads/images/filename.webp
    const urlPath = imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;
    const filePath = path.join(process.cwd(), 'public', urlPath);

    // Check if file exists
    try {
      await fs.access(filePath);
    } catch {
      return NextResponse.json(
        { error: 'Image file not found' },
        { status: 404 }
      );
    }

    // Read the image file
    const imageBuffer = await fs.readFile(filePath);

    // Generate thumbnail
    const thumbnail = await sharp(imageBuffer)
      .resize(width, height, { fit })
      .webp({ quality: 80 })
      .toBuffer();

    // Return the thumbnail with proper headers
    return new Response(thumbnail, {
      headers: {
        'Content-Type': 'image/webp',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Thumbnail generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate thumbnail' },
      { status: 500 }
    );
  }
}
