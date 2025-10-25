import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { subDays } from 'date-fns';


// GET Search Console queries
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const propertyId = searchParams.get('propertyId');
    const daysBack = parseInt(searchParams.get('daysBack') || '30');
    const limit = parseInt(searchParams.get('limit') || '100');

    if (!propertyId) {
      return NextResponse.json({ error: 'Property ID is required' }, { status: 400 });
    }

    const startDate = subDays(new Date(), daysBack);

    const queries = await prisma.gSCQuery.findMany({
      where: {
        propertyId,
        date: {
          gte: startDate,
        },
      },
      orderBy: [
        {
          clicks: 'desc',
        },
        {
          impressions: 'desc',
        },
      ],
      take: limit,
    });

    return NextResponse.json(queries);
  } catch (error) {
    console.error('Error fetching Search Console queries:', error);
    return NextResponse.json({ error: 'Failed to fetch queries' }, { status: 500 });
  }
}
