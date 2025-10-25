import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

/**
 * GET /api/global-components
 * Fetch all global components
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type');
    const enabled = searchParams.get('enabled');

    const where: any = {};
    if (type) where.type = type;
    if (enabled !== null) where.enabled = enabled === 'true';

    const components = await prisma.globalComponent.findMany({
      where,
      orderBy: { type: 'asc' },
    });

    return NextResponse.json(components);
  } catch (error) {
    console.error('Failed to fetch global components:', error);
    return NextResponse.json(
      { error: 'Failed to fetch global components' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/global-components
 * Create a new global component
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, displayName, dataEn = {}, dataAr = {}, enabled = true } = body;

    if (!type || !displayName) {
      return NextResponse.json(
        { error: 'Type and display name are required' },
        { status: 400 }
      );
    }

    // Check if component type already exists
    const existing = await prisma.globalComponent.findUnique({
      where: { type }
    });

    if (existing) {
      return NextResponse.json(
        { error: `Global component of type "${type}" already exists` },
        { status: 409 }
      );
    }

    const component = await prisma.globalComponent.create({
      data: {
        type,
        displayName,
        dataEn,
        dataAr,
        enabled,
      },
    });

    return NextResponse.json(component, { status: 201 });
  } catch (error) {
    console.error('Failed to create global component:', error);
    return NextResponse.json(
      { error: 'Failed to create global component' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/global-components
 * Update a global component
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, dataEn, dataAr, enabled, displayName } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Component ID is required' },
        { status: 400 }
      );
    }

    const updateData: any = {};
    if (dataEn !== undefined) updateData.dataEn = dataEn;
    if (dataAr !== undefined) updateData.dataAr = dataAr;
    if (enabled !== undefined) updateData.enabled = enabled;
    if (displayName !== undefined) updateData.displayName = displayName;

    const component = await prisma.globalComponent.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(component);
  } catch (error) {
    console.error('Failed to update global component:', error);
    return NextResponse.json(
      { error: 'Failed to update global component' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/global-components
 * Delete a global component
 */
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    const type = searchParams.get('type');

    if (!id && !type) {
      return NextResponse.json(
        { error: 'Either ID or type is required' },
        { status: 400 }
      );
    }

    const where: any = {};
    if (id) where.id = id;
    if (type) where.type = type;

    await prisma.globalComponent.delete({
      where: id ? { id } : { type },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete global component:', error);
    return NextResponse.json(
      { error: 'Failed to delete global component' },
      { status: 500 }
    );
  }
}