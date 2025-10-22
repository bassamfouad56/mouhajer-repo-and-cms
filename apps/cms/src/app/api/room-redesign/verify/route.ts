/**
 * Room Redesign Verification API
 * Verifies magic link tokens and returns redesign data
 */

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * GET /api/room-redesign/verify?token=xxx
 * Verify magic link token and return redesign data
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    // Validate token parameter
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Token parameter is required' },
        { status: 400 }
      );
    }

    // Find redesign by verification token
    const redesign = await prisma.roomRedesign.findUnique({
      where: { verificationToken: token },
      select: {
        id: true,
        email: true,
        status: true,
        tokenExpiry: true,
        originalImagePath: true,
        generatedImagePath: true,
        stylePreference: true,
        roomType: true,
        prompt: true,
        aiModel: true,
        processingTime: true,
        viewCount: true,
        createdAt: true,
        completedAt: true,
        errorMessage: true,
      },
    });

    // Check if redesign exists
    if (!redesign) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired verification link' },
        { status: 404 }
      );
    }

    // Check if token has expired
    if (redesign.tokenExpiry < new Date()) {
      // Update status to expired
      await prisma.roomRedesign.update({
        where: { id: redesign.id },
        data: { status: 'EXPIRED' },
      });

      return NextResponse.json(
        {
          success: false,
          error: 'This link has expired. Links are valid for 24 hours only.',
          expired: true,
        },
        { status: 410 } // Gone
      );
    }

    // Check processing status
    if (redesign.status === 'PROCESSING' || redesign.status === 'UPLOADING') {
      return NextResponse.json(
        {
          success: false,
          error: 'Your redesign is still being processed. Please check your email again in a few minutes.',
          status: redesign.status,
          processing: true,
        },
        { status: 202 } // Accepted
      );
    }

    // Check if generation failed
    if (redesign.status === 'FAILED') {
      return NextResponse.json(
        {
          success: false,
          error: 'AI generation failed. Please try uploading your image again.',
          status: redesign.status,
          errorDetails: redesign.errorMessage,
          failed: true,
        },
        { status: 500 }
      );
    }

    // Check if completed successfully
    if (redesign.status !== 'COMPLETED' || !redesign.generatedImagePath) {
      return NextResponse.json(
        {
          success: false,
          error: 'Redesign not ready yet. Please try again shortly.',
          status: redesign.status,
        },
        { status: 202 }
      );
    }

    // Success - return redesign data
    // Increment view count and update viewedAt timestamp
    await prisma.roomRedesign.update({
      where: { id: redesign.id },
      data: {
        viewCount: { increment: 1 },
        viewedAt: redesign.viewCount === 0 ? new Date() : undefined, // Only set on first view
      },
    });

    // Construct image URLs (served via image API)
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3010';
    const originalImageUrl = `${baseUrl}/api/room-redesign/image/${redesign.id}/original`;
    const generatedImageUrl = `${baseUrl}/api/room-redesign/image/${redesign.id}/generated`;

    return NextResponse.json({
      success: true,
      redesign: {
        id: redesign.id,
        originalImageUrl,
        generatedImageUrl,
        style: redesign.stylePreference || 'modern',
        roomType: redesign.roomType || 'living_room',
        prompt: redesign.prompt,
        aiModel: redesign.aiModel || 'flux-schnell',
        processingTime: redesign.processingTime,
        viewCount: redesign.viewCount + 1, // Include the current view
        createdAt: redesign.createdAt,
        completedAt: redesign.completedAt,
      },
    });
  } catch (error) {
    console.error('[Verify API] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'An error occurred while verifying your link. Please try again.',
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/room-redesign/verify
 * Submit feedback/rating for a redesign
 */
export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Token parameter is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { rating, feedback } = body;

    // Validate rating
    if (rating !== undefined && (typeof rating !== 'number' || rating < 1 || rating > 5)) {
      return NextResponse.json(
        { success: false, error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    // Find redesign
    const redesign = await prisma.roomRedesign.findUnique({
      where: { verificationToken: token },
      select: { id: true, tokenExpiry: true },
    });

    if (!redesign) {
      return NextResponse.json(
        { success: false, error: 'Invalid verification link' },
        { status: 404 }
      );
    }

    if (redesign.tokenExpiry < new Date()) {
      return NextResponse.json(
        { success: false, error: 'This link has expired' },
        { status: 410 }
      );
    }

    // Update feedback
    await prisma.roomRedesign.update({
      where: { id: redesign.id },
      data: {
        userRating: rating,
        userFeedback: feedback,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Thank you for your feedback!',
    });
  } catch (error) {
    console.error('[Verify API - POST] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit feedback' },
      { status: 500 }
    );
  }
}
