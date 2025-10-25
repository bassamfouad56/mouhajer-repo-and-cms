import { NextRequest, NextResponse } from 'next/server';
import { createGBPServiceFromDB } from '@/lib/google-business-profile';

// POST sync Business Profile data (reviews)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { accountId } = body;

    if (!accountId) {
      return NextResponse.json({ error: 'Account ID is required' }, { status: 400 });
    }

    console.log(`[GBP Sync] Starting sync for account ${accountId}`);

    const service = await createGBPServiceFromDB(accountId);

    console.log('[GBP Sync] Syncing reviews...');
    await service.syncReviews(accountId);
    console.log('[GBP Sync] Reviews synced successfully');

    return NextResponse.json({
      success: true,
      message: 'Business Profile data synced successfully',
    });
  } catch (error) {
    console.error('[GBP Sync] Sync failed:', error);

    return NextResponse.json(
      {
        error: 'Failed to sync Business Profile data',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
