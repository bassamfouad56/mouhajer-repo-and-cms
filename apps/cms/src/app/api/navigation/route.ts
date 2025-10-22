import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

// GET /api/navigation - Get all nav items with hierarchy
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get all nav items ordered by order field
    const navItems = await prisma.navItem.findMany({
      orderBy: [
        { order: 'asc' }
      ],
      include: {
        children: {
          orderBy: { order: 'asc' },
          include: {
            children: {
              orderBy: { order: 'asc' }
            }
          }
        }
      },
      where: {
        parentId: null // Only get top-level items
      }
    });

    return NextResponse.json(navItems);
  } catch (error) {
    console.error('Error fetching navigation items:', error);
    return NextResponse.json(
      { error: 'Failed to fetch navigation items' },
      { status: 500 }
    );
  }
}

// POST /api/navigation - Create new nav item
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();

    // Validate required fields
    if (!data.labelEn || !data.labelAr || !data.type) {
      return NextResponse.json(
        { error: 'Missing required fields: labelEn, labelAr, type' },
        { status: 400 }
      );
    }

    // Create nav item
    const navItem = await prisma.navItem.create({
      data: {
        labelEn: data.labelEn,
        labelAr: data.labelAr,
        url: data.url || null,
        type: data.type,
        icon: data.icon || null,
        target: data.target || '_self',
        parentId: data.parentId || null,
        order: data.order || 0,
        isActive: data.isActive !== undefined ? data.isActive : true,
        openInNewTab: data.openInNewTab || false,
        cssClass: data.cssClass || null,
        badge: data.badge || null,
        badgeColor: data.badgeColor || null,
        description: data.description || null,
        megaMenuColumns: data.megaMenuColumns || null,
        megaMenuImage: data.megaMenuImage || null,
        requiresAuth: data.requiresAuth || false,
        requiredRoles: data.requiredRoles || []
      }
    });

    return NextResponse.json(navItem, { status: 201 });
  } catch (error) {
    console.error('Error creating navigation item:', error);
    return NextResponse.json(
      { error: 'Failed to create navigation item' },
      { status: 500 }
    );
  }
}
