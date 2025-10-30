#!/usr/bin/env tsx
/**
 * Script to upload hero banner video and update homepage
 * Usage: npx tsx scripts/upload-hero-video.ts
 */

import { readFile } from 'fs/promises';
import { join } from 'path';
import { homedir } from 'os';
import { PrismaClient } from '@prisma/client';
import { put } from '@vercel/blob';

const prisma = new PrismaClient();

async function uploadVideo(filePath: string, fileName: string) {
  console.log(`📹 Reading video file: ${filePath}`);
  const fileBuffer = await readFile(filePath);
  const fileSize = fileBuffer.length;

  console.log(`📊 File size: ${(fileSize / 1024 / 1024).toFixed(2)} MB`);

  // Upload to Vercel Blob
  console.log('☁️  Uploading to Vercel Blob Storage...');
  const blob = await put(
    `videos/${Date.now()}-${fileName}`,
    fileBuffer,
    {
      access: 'public',
      contentType: 'video/mp4',
    }
  );

  console.log(`✅ Uploaded to: ${blob.url}`);

  // Save to database
  console.log('💾 Saving to database...');
  const mediaFile = await prisma.mediaFile.create({
    data: {
      filename: fileName,
      originalName: fileName,
      url: blob.url,
      thumbnailUrl: null,
      mimeType: 'video/mp4',
      type: 'video',
      size: fileSize,
      width: null,
      height: null,
      alt: 'Hero Banner Background Video',
    },
  });

  console.log(`✅ Media file created with ID: ${mediaFile.id}`);
  return mediaFile;
}

async function updateHeroBanner(videoUrl: string) {
  const heroBlockId = 'd139c9ca-e8be-4ce9-967e-942897469491';

  console.log(`🔄 Updating hero banner block: ${heroBlockId}`);

  // Get current block data
  const block = await prisma.pageBlock.findUnique({
    where: { id: heroBlockId },
  });

  if (!block) {
    throw new Error('Hero banner block not found!');
  }

  // Parse current data
  const currentData = typeof block.data === 'string'
    ? JSON.parse(block.data)
    : block.data;

  // Add video URL
  const updatedData = {
    ...currentData,
    backgroundVideo: videoUrl,
  };

  // Update block
  await prisma.pageBlock.update({
    where: { id: heroBlockId },
    data: {
      data: updatedData,
    },
  });

  console.log('✅ Hero banner updated with video background!');
}

async function main() {
  try {
    console.log('🚀 Starting hero banner video upload...\n');

    // Path to video file
    const videoPath = join(homedir(), 'Downloads', 'banner-2s.mp4');
    const fileName = 'banner-2s.mp4';

    // Upload video
    const mediaFile = await uploadVideo(videoPath, fileName);

    // Update hero banner
    await updateHeroBanner(mediaFile.url);

    console.log('\n🎉 Success! Hero banner video uploaded and configured.');
    console.log(`📹 Video URL: ${mediaFile.url}`);
    console.log('\n💡 Refresh your homepage to see the video background!');
  } catch (error) {
    console.error('\n❌ Error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
