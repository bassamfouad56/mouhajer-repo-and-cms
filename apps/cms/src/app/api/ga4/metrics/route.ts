import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { subDays, format } from 'date-fns';


// GET GA4 metrics
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const propertyId = searchParams.get('propertyId');
    const daysBack = parseInt(searchParams.get('daysBack') || '30');

    if (!propertyId) {
      return NextResponse.json({ error: 'Property ID is required' }, { status: 400 });
    }

    const startDate = subDays(new Date(), daysBack);

    const metrics = await prisma.gA4Metrics.findMany({
      where: {
        propertyId,
        date: {
          gte: startDate,
        },
      },
      orderBy: {
        date: 'asc',
      },
    });

    return NextResponse.json(metrics);
  } catch (error) {
    console.error('Error fetching GA4 metrics:', error);
    return NextResponse.json({ error: 'Failed to fetch metrics' }, { status: 500 });
  }
}
