import { NextRequest, NextResponse } from 'next/server';
import { createGA4ServiceFromDB } from '@/lib/google-analytics';

// POST sync GA4 data
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { propertyId, daysBack = 30 } = body;

    if (!propertyId) {
      return NextResponse.json({ error: 'Property ID is required' }, { status: 400 });
    }

    const service = await createGA4ServiceFromDB(propertyId);
    await service.syncAll(propertyId, daysBack);

    return NextResponse.json({
      success: true,
      message: `Successfully synced ${daysBack} days of data`,
    });
  } catch (error) {
    console.error('Error syncing GA4 data:', error);
    return NextResponse.json(
      {
        error: 'Failed to sync data',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
