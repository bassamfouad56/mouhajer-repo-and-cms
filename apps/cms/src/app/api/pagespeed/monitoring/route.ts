import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all monitoring URLs
export async function GET(request: NextRequest) {
  try {
    const monitoring = await prisma.pageSpeedMonitoring.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      success: true,
      monitoring,
    });
  } catch (error) {
    console.error('[PageSpeed] Failed to fetch monitoring:', error);

    return NextResponse.json(
      {
        error: 'Failed to fetch monitoring URLs',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// POST add new monitoring URL
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      url,
      monitoringFrequency = 'daily',
      strategies = ['mobile', 'desktop'],
      minPerformanceScore = 80,
      maxLCP = 2500,
      maxFID = 100,
      maxCLS = 0.1,
    } = body;

    if (!name || !url) {
      return NextResponse.json(
        { error: 'Name and URL are required' },
        { status: 400 }
      );
    }

    // Check if URL already exists
    const existing = await prisma.pageSpeedMonitoring.findUnique({
      where: { url },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'This URL is already being monitored' },
        { status: 400 }
      );
    }

    const monitoring = await prisma.pageSpeedMonitoring.create({
      data: {
        name,
        url,
        monitoringFrequency,
        strategies,
        minPerformanceScore,
        maxLCP,
        maxFID,
        maxCLS,
      },
    });

    return NextResponse.json({
      success: true,
      monitoring,
    });
  } catch (error) {
    console.error('[PageSpeed] Failed to add monitoring:', error);

    return NextResponse.json(
      {
        error: 'Failed to add monitoring URL',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// DELETE remove monitoring URL
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    await prisma.pageSpeedMonitoring.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Monitoring URL removed',
    });
  } catch (error) {
    console.error('[PageSpeed] Failed to delete monitoring:', error);

    return NextResponse.json(
      {
        error: 'Failed to remove monitoring URL',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// PATCH update monitoring URL
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const monitoring = await prisma.pageSpeedMonitoring.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      monitoring,
    });
  } catch (error) {
    console.error('[PageSpeed] Failed to update monitoring:', error);

    return NextResponse.json(
      {
        error: 'Failed to update monitoring URL',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
