import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createGBPServiceFromDB } from '@/lib/google-business-profile';

// GET reviews for an account
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const accountId = searchParams.get('accountId');

    if (!accountId) {
      return NextResponse.json({ error: 'Account ID is required' }, { status: 400 });
    }

    const reviews = await prisma.gBPReview.findMany({
      where: { accountId },
      orderBy: { createTime: 'desc' },
    });

    return NextResponse.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}

// POST reply to a review
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { accountId, reviewId, replyText } = body;

    if (!accountId || !reviewId || !replyText) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Get service instance
    const service = await createGBPServiceFromDB(accountId);

    // Reply to review via API
    const success = await service.replyToReview(reviewId, replyText);

    if (!success) {
      return NextResponse.json({ error: 'Failed to post reply' }, { status: 500 });
    }

    // Update database
    await prisma.gBPReview.updateMany({
      where: {
        accountId,
        reviewId,
      },
      data: {
        replyComment: replyText,
        replyUpdateTime: new Date(),
      },
    });

    return NextResponse.json({ success: true, message: 'Reply posted successfully' });
  } catch (error) {
    console.error('Error replying to review:', error);
    return NextResponse.json(
      {
        error: 'Failed to reply to review',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
