import { google } from 'googleapis';
import { prisma } from './prisma';
import { format, subDays } from 'date-fns';

export interface GBPCredentials {
  clientEmail: string;
  privateKey: string;
}

export interface GBPLocation {
  name: string;
  locationName: string;
  address: string;
  phoneNumber?: string;
  websiteUrl?: string;
  categories?: string[];
}

export interface GBPReview {
  reviewId: string;
  reviewer: {
    displayName: string;
    profilePhotoUrl?: string;
  };
  starRating: 'ONE' | 'TWO' | 'THREE' | 'FOUR' | 'FIVE';
  comment?: string;
  createTime: Date;
  updateTime: Date;
  reviewReply?: {
    comment: string;
    updateTime: Date;
  };
}

export interface GBPInsights {
  businessImpressionsDesktop: number;
  businessImpressionsMobile: number;
  businessConversions: number;
  callClicks: number;
  websiteClicks: number;
  directionsClicks: number;
  photoViews: number;
  queriesChain?: number;
  queriesDirect?: number;
}

export interface GBPMetrics {
  location: string;
  date: Date;
  views: number;
  searches: number;
  actions: number;
  photos: number;
  direction_requests: number;
  call_clicks: number;
  website_clicks: number;
}

export class GoogleBusinessProfileService {
  private mybusiness: any;
  private accountId: string;
  private locationId: string;

  constructor(credentials: GBPCredentials, accountId: string, locationId: string) {
    this.accountId = accountId;
    this.locationId = locationId;

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: credentials.clientEmail,
        private_key: credentials.privateKey.replace(/\\n/g, '\n'),
      },
      scopes: [
        'https://www.googleapis.com/auth/business.manage',
        'https://www.googleapis.com/auth/plus.business.manage',
      ],
    });

    this.mybusiness = google.mybusinessbusinessinformation({
      version: 'v1',
      auth,
    });
  }

  /**
   * Get location details
   */
  async getLocationDetails(): Promise<GBPLocation | null> {
    try {
      const locationName = `accounts/${this.accountId}/locations/${this.locationId}`;

      const response = await this.mybusiness.accounts.locations.get({
        name: locationName,
      });

      const location = response.data;

      return {
        name: location.name || '',
        locationName: location.title || location.locationName || '',
        address: this.formatAddress(location.address),
        phoneNumber: location.phoneNumbers?.primaryPhone || undefined,
        websiteUrl: location.websiteUri || undefined,
        categories: location.categories?.map((cat: any) => cat.displayName) || [],
      };
    } catch (error) {
      console.error('Error fetching location details:', error);
      return null;
    }
  }

  /**
   * Get reviews for a location
   */
  async getReviews(): Promise<GBPReview[]> {
    try {
      const locationName = `accounts/${this.accountId}/locations/${this.locationId}`;

      // Note: Reviews API requires special setup and may need Business Profile Performance API
      const response = await this.mybusiness.accounts.locations.reviews.list({
        parent: locationName,
      });

      return (response.data.reviews || []).map((review: any) => ({
        reviewId: review.reviewId || review.name?.split('/').pop() || '',
        reviewer: {
          displayName: review.reviewer?.displayName || 'Anonymous',
          profilePhotoUrl: review.reviewer?.profilePhotoUrl,
        },
        starRating: review.starRating || 'FIVE',
        comment: review.comment,
        createTime: new Date(review.createTime),
        updateTime: new Date(review.updateTime),
        reviewReply: review.reviewReply
          ? {
              comment: review.reviewReply.comment,
              updateTime: new Date(review.reviewReply.updateTime),
            }
          : undefined,
      }));
    } catch (error) {
      console.error('Error fetching reviews:', error);
      return [];
    }
  }

  /**
   * Reply to a review
   */
  async replyToReview(reviewId: string, replyText: string): Promise<boolean> {
    try {
      const reviewName = `accounts/${this.accountId}/locations/${this.locationId}/reviews/${reviewId}`;

      await this.mybusiness.accounts.locations.reviews.updateReply({
        name: reviewName,
        requestBody: {
          comment: replyText,
        },
      });

      return true;
    } catch (error) {
      console.error('Error replying to review:', error);
      return false;
    }
  }

  /**
   * Get insights/analytics (simplified version)
   * Note: Full insights require Business Profile Performance API
   */
  async getBasicInsights(startDate: string, endDate: string): Promise<GBPInsights> {
    // Placeholder - actual implementation requires Business Profile Performance API
    // which has different authentication requirements
    return {
      businessImpressionsDesktop: 0,
      businessImpressionsMobile: 0,
      businessConversions: 0,
      callClicks: 0,
      websiteClicks: 0,
      directionsClicks: 0,
      photoViews: 0,
    };
  }

  /**
   * Get review statistics
   */
  async getReviewStats(): Promise<{
    totalReviews: number;
    averageRating: number;
    ratingDistribution: Record<string, number>;
    unansweredReviews: number;
    recentReviews: number;
  }> {
    const reviews = await this.getReviews();

    const stats = {
      totalReviews: reviews.length,
      averageRating: 0,
      ratingDistribution: {
        ONE: 0,
        TWO: 0,
        THREE: 0,
        FOUR: 0,
        FIVE: 0,
      },
      unansweredReviews: 0,
      recentReviews: 0,
    };

    if (reviews.length === 0) return stats;

    // Calculate statistics
    const ratingMap: Record<string, number> = { ONE: 1, TWO: 2, THREE: 3, FOUR: 4, FIVE: 5 };
    let totalStars = 0;

    const thirtyDaysAgo = subDays(new Date(), 30);

    reviews.forEach((review) => {
      const stars = ratingMap[review.starRating] || 5;
      totalStars += stars;
      stats.ratingDistribution[review.starRating]++;

      if (!review.reviewReply) {
        stats.unansweredReviews++;
      }

      if (review.createTime >= thirtyDaysAgo) {
        stats.recentReviews++;
      }
    });

    stats.averageRating = totalStars / reviews.length;

    return stats;
  }

  /**
   * Sync reviews to database
   */
  async syncReviews(dbAccountId: string): Promise<void> {
    const reviews = await this.getReviews();

    for (const review of reviews) {
      await prisma.gBPReview.upsert({
        where: {
          accountId_reviewId: {
            accountId: dbAccountId,
            reviewId: review.reviewId,
          },
        },
        update: {
          reviewerName: review.reviewer.displayName,
          reviewerPhotoUrl: review.reviewer.profilePhotoUrl,
          starRating: this.convertStarRating(review.starRating),
          comment: review.comment,
          createTime: review.createTime,
          updateTime: review.updateTime,
          replyComment: review.reviewReply?.comment,
          replyUpdateTime: review.reviewReply?.updateTime,
        },
        create: {
          accountId: dbAccountId,
          reviewId: review.reviewId,
          reviewerName: review.reviewer.displayName,
          reviewerPhotoUrl: review.reviewer.profilePhotoUrl,
          starRating: this.convertStarRating(review.starRating),
          comment: review.comment,
          createTime: review.createTime,
          updateTime: review.updateTime,
          replyComment: review.reviewReply?.comment,
          replyUpdateTime: review.reviewReply?.updateTime,
        },
      });
    }

    // Update last sync time
    await prisma.googleBusinessProfileAccount.update({
      where: { id: dbAccountId },
      data: {
        lastSyncAt: new Date(),
        syncStatus: 'success',
      },
    });
  }

  /**
   * Verify connection
   */
  async verifyConnection(): Promise<boolean> {
    try {
      const location = await this.getLocationDetails();
      return location !== null;
    } catch (error) {
      console.error('Business Profile connection verification failed:', error);
      return false;
    }
  }

  /**
   * List all locations for an account
   */
  async listLocations(): Promise<GBPLocation[]> {
    try {
      const response = await this.mybusiness.accounts.locations.list({
        parent: `accounts/${this.accountId}`,
      });

      return (response.data.locations || []).map((location: any) => ({
        name: location.name || '',
        locationName: location.title || location.locationName || '',
        address: this.formatAddress(location.address),
        phoneNumber: location.phoneNumbers?.primaryPhone,
        websiteUrl: location.websiteUri,
        categories: location.categories?.map((cat: any) => cat.displayName) || [],
      }));
    } catch (error) {
      console.error('Error listing locations:', error);
      return [];
    }
  }

  // Helper methods

  private formatAddress(address: any): string {
    if (!address) return '';

    const parts = [
      address.addressLines?.join(', '),
      address.locality,
      address.administrativeArea,
      address.postalCode,
      address.regionCode,
    ].filter(Boolean);

    return parts.join(', ');
  }

  private convertStarRating(rating: string): number {
    const map: Record<string, number> = {
      ONE: 1,
      TWO: 2,
      THREE: 3,
      FOUR: 4,
      FIVE: 5,
    };
    return map[rating] || 5;
  }
}

/**
 * Factory function to create Business Profile service from database
 */
export async function createGBPServiceFromDB(
  accountId: string
): Promise<GoogleBusinessProfileService> {
  const account = await prisma.googleBusinessProfileAccount.findUnique({
    where: { id: accountId },
  });

  if (!account) {
    throw new Error('Business Profile account not found');
  }

  if (!account.isActive) {
    throw new Error('Business Profile account is not active');
  }

  return new GoogleBusinessProfileService(
    {
      clientEmail: account.clientEmail,
      privateKey: account.privateKey,
    },
    account.gbpAccountId,
    account.locationId
  );
}
