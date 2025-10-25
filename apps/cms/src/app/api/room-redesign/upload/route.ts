/**
 * Room Redesign Upload API
 * Handles file upload and initiates AI generation process
 */

import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { prisma } from '@/lib/prisma';
import { generateRoomRedesign } from '@/lib/ai-service';
import { sendRedesignEmail, sendErrorEmail } from '@/lib/email-service';
import crypto from 'crypto';
import { existsSync } from 'fs';

// Configuration
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const EXTERNAL_DRIVE = process.env.AI_OUTPUTS_PATH || '/Volumes/ExternalDrive/ai-outputs';

/**
 * POST /api/room-redesign/upload
 * Upload room image and start AI generation
 */
export async function POST(request: NextRequest) {
  try {
    // Parse form data
    const formData = await request.formData();
    const file = formData.get('image') as File;
    const email = formData.get('email') as string;
    const style = formData.get('style') as string;
    const roomType = formData.get('roomType') as string;
    const prompt = formData.get('prompt') as string;

    // Validation
    if (!file || !email) {
      return NextResponse.json(
        { error: 'Missing required fields: image and email are required' },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit` },
        { status: 400 }
      );
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: `Invalid file type. Allowed types: ${ALLOWED_TYPES.join(', ')}` },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Generate unique ID and verification token
    const redesignId = crypto.randomUUID();
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Ensure output directory exists
    if (!existsSync(EXTERNAL_DRIVE)) {
      await mkdir(EXTERNAL_DRIVE, { recursive: true });
    }

    // Save original image to external drive
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileExtension = file.name.split('.').pop() || 'jpg';
    const originalFilename = `${redesignId}_original.${fileExtension}`;
    const originalPath = join(EXTERNAL_DRIVE, originalFilename);

    try {
      await writeFile(originalPath, buffer);
      console.log(`[Upload API] Saved original image to: ${originalPath}`);
    } catch (error) {
      console.error(`[Upload API] Failed to save file:`, error);
      return NextResponse.json(
        { error: 'Failed to save uploaded file' },
        { status: 500 }
      );
    }

    // Create database record
    const redesign = await prisma.roomRedesign.create({
      data: {
        id: redesignId,
        email,
        verificationToken,
        tokenExpiry,
        status: 'PROCESSING',
        originalImagePath: originalPath,
        prompt: prompt || null,
        stylePreference: style || 'modern',
        roomType: roomType || 'living_room',
      },
    });

    console.log(`[Upload API] Created redesign record: ${redesignId}`);

    // Start AI generation in background (non-blocking)
    // Don't await - let it run asynchronously
    processAIGeneration(redesignId, originalPath, {
      email,
      style: style || 'modern',
      roomType: roomType || 'living_room',
      prompt: prompt || '',
      verificationToken,
    }).catch((error) => {
      console.error(`[Upload API] AI generation failed for ${redesignId}:`, error);
    });

    return NextResponse.json({
      success: true,
      message: 'Your room redesign is being processed. Check your email for the results!',
      redesignId,
      estimatedTime: '2-5 minutes',
    });
  } catch (error) {
    console.error('[Upload API] Unexpected error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

/**
 * Process AI generation asynchronously
 */
async function processAIGeneration(
  redesignId: string,
  originalPath: string,
  params: {
    email: string;
    style: string;
    roomType: string;
    prompt: string;
    verificationToken: string;
  }
) {
  const startTime = Date.now();

  try {
    console.log(`[AI Generation] Starting for redesign ${redesignId}`);

    // Call AI service
    const result = await generateRoomRedesign({
      inputImagePath: originalPath,
      prompt: params.prompt,
      style: params.style,
      roomType: params.roomType,
      outputId: redesignId,
      inferenceSteps: 4, // Schnell optimal steps
    });

    if (result.success && result.outputPath) {
      // Update database with success
      await prisma.roomRedesign.update({
        where: { id: redesignId },
        data: {
          status: 'COMPLETED',
          generatedImagePath: result.outputPath,
          processingTime: result.processingTime,
          inferenceSteps: result.inferenceSteps,
          aiModel: result.model || 'flux-schnell',
          completedAt: new Date(),
        },
      });

      console.log(`[AI Generation] Completed successfully for ${redesignId}`);

      // Send success email with magic link
      try {
        await sendRedesignEmail(params.email, params.verificationToken, redesignId);
        console.log(`[AI Generation] Success email sent to ${params.email}`);
      } catch (emailError) {
        console.error(`[AI Generation] Failed to send email:`, emailError);
        // Don't fail the entire process if email fails
      }
    } else {
      // AI generation failed
      throw new Error(result.error || 'AI generation failed with unknown error');
    }
  } catch (error) {
    const processingTime = Math.floor((Date.now() - startTime) / 1000);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    console.error(`[AI Generation] Failed for ${redesignId}:`, errorMessage);

    // Update database with failure
    await prisma.roomRedesign.update({
      where: { id: redesignId },
      data: {
        status: 'FAILED',
        errorMessage,
        processingTime,
        retryCount: {
          increment: 1,
        },
      },
    });

    // Send error email
    try {
      await sendErrorEmail(params.email, 'generation_failed');
      console.log(`[AI Generation] Error email sent to ${params.email}`);
    } catch (emailError) {
      console.error(`[AI Generation] Failed to send error email:`, emailError);
    }
  }
}

/**
 * GET /api/room-redesign/upload
 * Get upload status and configuration
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const redesignId = searchParams.get('id');

    if (redesignId) {
      // Get status of specific redesign
      const redesign = await prisma.roomRedesign.findUnique({
        where: { id: redesignId },
        select: {
          id: true,
          status: true,
          createdAt: true,
          completedAt: true,
          processingTime: true,
          errorMessage: true,
        },
      });

      if (!redesign) {
        return NextResponse.json(
          { error: 'Redesign not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({ redesign });
    }

    // Return configuration info
    return NextResponse.json({
      maxFileSize: MAX_FILE_SIZE,
      allowedTypes: ALLOWED_TYPES,
      estimatedProcessingTime: '2-5 minutes',
      tokenExpiry: '24 hours',
    });
  } catch (error) {
    console.error('[Upload API - GET] Error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve information' },
      { status: 500 }
    );
  }
}
