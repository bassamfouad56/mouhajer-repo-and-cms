import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { subDays } from 'date-fns';


// GET Search Console performance data
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const propertyId = searchParams.get('propertyId');
    const daysBack = parseInt(searchParams.get('daysBack') || '30');

    if (!propertyId) {
      return NextResponse.json({ error: 'Property ID is required' }, { status: 400 });
    }

    const startDate = subDays(new Date(), daysBack);

    const performance = await prisma.gSCPerformance.findMany({
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

    return NextResponse.json(performance);
  } catch (error) {
    console.error('Error fetching Search Console performance:', error);
    return NextResponse.json({ error: 'Failed to fetch performance data' }, { status: 500 });
  }
}
