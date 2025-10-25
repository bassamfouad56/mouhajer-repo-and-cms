import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';


// GET GA4 realtime data
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const propertyId = searchParams.get('propertyId');

    if (!propertyId) {
      return NextResponse.json({ error: 'Property ID is required' }, { status: 400 });
    }

    // Get latest realtime data (within last 5 minutes)
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

    const realtimeData = await prisma.gA4RealtimeMetrics.findFirst({
      where: {
        propertyId,
        timestamp: {
          gte: fiveMinutesAgo,
        },
      },
      orderBy: {
        timestamp: 'desc',
      },
    });

    if (!realtimeData) {
      return NextResponse.json({ error: 'No recent realtime data available' }, { status: 404 });
    }

    return NextResponse.json(realtimeData);
  } catch (error) {
    console.error('Error fetching GA4 realtime data:', error);
    return NextResponse.json({ error: 'Failed to fetch realtime data' }, { status: 500 });
  }
}
