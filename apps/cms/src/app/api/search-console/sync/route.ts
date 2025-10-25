import { NextRequest, NextResponse } from 'next/server';
import { createGSCServiceFromDB } from '@/lib/google-search-console';

// POST sync Search Console data
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { propertyId, daysBack = 30 } = body;

    if (!propertyId) {
      return NextResponse.json({ error: 'Property ID is required' }, { status: 400 });
    }

    const service = await createGSCServiceFromDB(propertyId);
    await service.syncAll(propertyId, daysBack);

    return NextResponse.json({
      success: true,
      message: `Successfully synced ${daysBack} days of data`,
    });
  } catch (error) {
    console.error('Error syncing Search Console data:', error);
    return NextResponse.json(
      {
        error: 'Failed to sync data',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
