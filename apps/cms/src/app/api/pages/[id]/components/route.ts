import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/pages/[id]/components - Get all components for a page
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const components = await prisma.blueprintInstance.findMany({
      where: {
        pageId: params.id,
      },
      include: {
        blueprint: true,
      },
      orderBy: {
        order: 'asc',
      },
    });

    return NextResponse.json(components);
  } catch (error) {
    console.error('Error fetching page components:', error);
    return NextResponse.json(
      { error: 'Failed to fetch page components' },
      { status: 500 }
    );
  }
}

// POST /api/pages/[id]/components - Add a component to a page
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { blueprintId, dataEn, dataAr, order, status } = body;

    // Validate required fields
    if (!blueprintId) {
      return NextResponse.json(
        { error: 'Missing required field: blueprintId' },
        { status: 400 }
      );
    }

    // Check if blueprint exists
    const blueprint = await prisma.contentBlueprint.findUnique({
      where: { id: blueprintId },
    });

    if (!blueprint) {
      return NextResponse.json(
        { error: 'Blueprint not found' },
        { status: 404 }
      );
    }

    // Check if page exists
    const page = await prisma.page.findUnique({
      where: { id: params.id },
    });

    if (!page) {
      return NextResponse.json(
        { error: 'Page not found' },
        { status: 404 }
      );
    }

    // Create component instance
    const component = await prisma.blueprintInstance.create({
      data: {
        blueprintId,
        pageId: params.id,
        dataEn: dataEn || {},
        dataAr: dataAr || {},
        order: order !== undefined ? order : 0,
        status: status || 'draft',
      },
      include: {
        blueprint: true,
      },
    });

    return NextResponse.json(component, { status: 201 });
  } catch (error) {
    console.error('Error creating page component:', error);
    return NextResponse.json(
      { error: 'Failed to create page component' },
      { status: 500 }
    );
  }
}

// PUT /api/pages/[id]/components - Update all components for a page
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { components } = body;

    console.log('[PUT /api/pages/[id]/components] Received request:', {
      pageId: params.id,
      componentsCount: Array.isArray(components) ? components.length : 'not an array',
      components: JSON.stringify(components, null, 2).substring(0, 500)
    });

    if (!Array.isArray(components)) {
      console.error('[PUT /api/pages/[id]/components] Components is not an array:', typeof components);
      return NextResponse.json(
        { error: 'Components must be an array' },
        { status: 400 }
      );
    }

    // Validate all components have required fields
    for (const component of components) {
      if (!component.blueprintId) {
        console.error('[PUT /api/pages/[id]/components] Missing blueprintId:', component);
        return NextResponse.json(
          { error: `Component missing blueprintId: ${component.id || 'unknown'}` },
          { status: 400 }
        );
      }
    }

    // Delete all existing components for this page
    await prisma.blueprintInstance.deleteMany({
      where: { pageId: params.id },
    });

    // Create new components
    const createdComponents = await Promise.all(
      components.map((component: any) =>
        prisma.blueprintInstance.create({
          data: {
            blueprintId: component.blueprintId,
            pageId: params.id,
            dataEn: component.dataEn || {},
            dataAr: component.dataAr || {},
            order: component.order || 0,
            status: component.status || 'draft',
          },
          include: {
            blueprint: true,
          },
        })
      )
    );

    console.log('[PUT /api/pages/[id]/components] Successfully created', createdComponents.length, 'components');
    return NextResponse.json(createdComponents);
  } catch (error) {
    console.error('[PUT /api/pages/[id]/components] Error updating page components:', error);
    return NextResponse.json(
      { error: 'Failed to update page components', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// DELETE /api/pages/[id]/components - Delete all components for a page
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.blueprintInstance.deleteMany({
      where: { pageId: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting page components:', error);
    return NextResponse.json(
      { error: 'Failed to delete page components' },
      { status: 500 }
    );
  }
}
