import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { subDays } from 'date-fns';

// GET statistics for Business Profile account
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const accountId = searchParams.get('accountId');

    if (!accountId) {
      return NextResponse.json({ error: 'Account ID is required' }, { status: 400 });
    }

    // Get all reviews
    const reviews = await prisma.gBPReview.findMany({
      where: { accountId },
    });

    // Calculate statistics
    const totalReviews = reviews.length;
    const thirtyDaysAgo = subDays(new Date(), 30);

    const stats = {
      totalReviews,
      averageRating: 0,
      ratingDistribution: {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
      },
      unansweredReviews: 0,
      recentReviews: 0,
      positiveReviews: 0,
      negativeReviews: 0,
      responseRate: 0,
    };

    if (totalReviews === 0) {
      return NextResponse.json(stats);
    }

    let totalStars = 0;
    let answeredCount = 0;

    reviews.forEach((review) => {
      // Rating distribution
      totalStars += review.starRating;
      stats.ratingDistribution[review.starRating as keyof typeof stats.ratingDistribution]++;

      // Positive vs negative
      if (review.starRating >= 4) stats.positiveReviews++;
      if (review.starRating <= 2) stats.negativeReviews++;

      // Unanswered
      if (review.replyComment) {
        answeredCount++;
      } else {
        stats.unansweredReviews++;
      }

      // Recent reviews (last 30 days)
      if (review.createTime >= thirtyDaysAgo) {
        stats.recentReviews++;
      }
    });

    stats.averageRating = totalStars / totalReviews;
    stats.responseRate = (answeredCount / totalReviews) * 100;

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching Business Profile stats:', error);
    return NextResponse.json({ error: 'Failed to fetch statistics' }, { status: 500 });
  }
}
