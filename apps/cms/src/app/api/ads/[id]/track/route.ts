import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const { type } = body; // 'impression' or 'click'

    if (type === 'impression') {
      const ad = await prisma.advertisement.update({
        where: { id },
        data: {
          impressionCount: {
            increment: 1,
          },
        },
      });

      return NextResponse.json({ success: true, impressionCount: ad.impressionCount });
    } else if (type === 'click') {
      const ad = await prisma.advertisement.update({
        where: { id },
        data: {
          clickCount: {
            increment: 1,
          },
        },
      });

      return NextResponse.json({ success: true, clickCount: ad.clickCount });
    } else {
      return NextResponse.json(
        { error: 'Invalid tracking type. Must be "impression" or "click"' },
        { status: 400 }
      );
    }
  } catch (error) {
    if (error instanceof Error && error.message.includes('Record to update not found')) {
      return NextResponse.json(
        { error: 'Advertisement not found' },
        { status: 404 }
      );
    }
    console.error('Error tracking ad:', error);
    return NextResponse.json(
      { error: 'Failed to track advertisement' },
      { status: 500 }
    );
  }
}
