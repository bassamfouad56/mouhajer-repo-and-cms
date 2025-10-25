import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { subDays } from 'date-fns';


// GET GA4 traffic sources
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const propertyId = searchParams.get('propertyId');
    const daysBack = parseInt(searchParams.get('daysBack') || '30');

    if (!propertyId) {
      return NextResponse.json({ error: 'Property ID is required' }, { status: 400 });
    }

    const startDate = subDays(new Date(), daysBack);

    const sources = await prisma.gA4TrafficSource.findMany({
      where: {
        propertyId,
        date: {
          gte: startDate,
        },
      },
      orderBy: [
        {
          date: 'desc',
        },
        {
          activeUsers: 'desc',
        },
      ],
    });

    return NextResponse.json(sources);
  } catch (error) {
    console.error('Error fetching GA4 traffic sources:', error);
    return NextResponse.json({ error: 'Failed to fetch traffic sources' }, { status: 500 });
  }
}
