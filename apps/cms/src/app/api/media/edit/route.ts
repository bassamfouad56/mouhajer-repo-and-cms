import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

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
    const { imageUrl, crop, resize, rotation } = body;

    if (!imageUrl) {
      return NextResponse.json(
        { error: 'Image URL is required' },
        { status: 400 }
      );
    }

    // Extract the file path from URL
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
    let sharpInstance = sharp(imageBuffer);

    // Apply rotation if specified
    if (rotation) {
      sharpInstance = sharpInstance.rotate(rotation);
    }

    // Apply crop if specified
    if (crop && crop.width > 0 && crop.height > 0) {
      sharpInstance = sharpInstance.extract({
        left: Math.round(crop.x),
        top: Math.round(crop.y),
        width: Math.round(crop.width),
        height: Math.round(crop.height),
      });
    }

    // Apply resize if specified
    if (resize && (resize.width || resize.height)) {
      const resizeOptions: {
        width?: number;
        height?: number;
        fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside';
      } = {
        fit: (resize.fit as 'cover' | 'contain' | 'fill' | 'inside' | 'outside') || 'contain',
      };

      if (resize.width) resizeOptions.width = Math.round(resize.width);
      if (resize.height) resizeOptions.height = Math.round(resize.height);

      sharpInstance = sharpInstance.resize(resizeOptions);
    }

    // Process the image
    const processedBuffer = await sharpInstance
      .webp({ quality: 90 })
      .toBuffer();

    // Generate new filename
    const ext = '.webp';
    const originalName = path.basename(filePath, path.extname(filePath));
    const newFileName = `${originalName}-edited-${uuidv4()}${ext}`;
    const newFilePath = path.join(
      process.cwd(),
      'public',
      'uploads',
      'images',
      newFileName
    );

    // Save the edited image
    await fs.writeFile(newFilePath, processedBuffer);

    // Get new image metadata
    const newMetadata = await sharp(processedBuffer).metadata();

    // Generate URL for the new image
    const newUrl = `/uploads/images/${newFileName}`;

    return NextResponse.json({
      url: newUrl,
      width: newMetadata.width,
      height: newMetadata.height,
      size: processedBuffer.length,
    });
  } catch (error) {
    console.error('Image editing error:', error);
    return NextResponse.json(
      { error: 'Failed to edit image' },
      { status: 500 }
    );
  }
}
