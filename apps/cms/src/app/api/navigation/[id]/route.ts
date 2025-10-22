import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

// GET /api/navigation/[id] - Get single nav item
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const navItem = await prisma.navItem.findUnique({
      where: { id: params.id },
      include: {
        children: {
          orderBy: { order: 'asc' }
        },
        parent: true
      }
    });

    if (!navItem) {
      return NextResponse.json(
        { error: 'Navigation item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(navItem);
  } catch (error) {
    console.error('Error fetching navigation item:', error);
    return NextResponse.json(
      { error: 'Failed to fetch navigation item' },
      { status: 500 }
    );
  }
}

// PATCH /api/navigation/[id] - Update nav item
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();

    // Check if nav item exists
    const existing = await prisma.navItem.findUnique({
      where: { id: params.id }
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Navigation item not found' },
        { status: 404 }
      );
    }

    // Update nav item
    const navItem = await prisma.navItem.update({
      where: { id: params.id },
      data: {
        ...(data.labelEn && { labelEn: data.labelEn }),
        ...(data.labelAr && { labelAr: data.labelAr }),
        ...(data.url !== undefined && { url: data.url }),
        ...(data.type && { type: data.type }),
        ...(data.icon !== undefined && { icon: data.icon }),
        ...(data.target && { target: data.target }),
        ...(data.parentId !== undefined && { parentId: data.parentId }),
        ...(data.order !== undefined && { order: data.order }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
        ...(data.openInNewTab !== undefined && { openInNewTab: data.openInNewTab }),
        ...(data.cssClass !== undefined && { cssClass: data.cssClass }),
        ...(data.badge !== undefined && { badge: data.badge }),
        ...(data.badgeColor !== undefined && { badgeColor: data.badgeColor }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.megaMenuColumns !== undefined && { megaMenuColumns: data.megaMenuColumns }),
        ...(data.megaMenuImage !== undefined && { megaMenuImage: data.megaMenuImage }),
        ...(data.requiresAuth !== undefined && { requiresAuth: data.requiresAuth }),
        ...(data.requiredRoles !== undefined && { requiredRoles: data.requiredRoles })
      }
    });

    return NextResponse.json(navItem);
  } catch (error) {
    console.error('Error updating navigation item:', error);
    return NextResponse.json(
      { error: 'Failed to update navigation item' },
      { status: 500 }
    );
  }
}

// DELETE /api/navigation/[id] - Delete nav item
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if nav item exists
    const existing = await prisma.navItem.findUnique({
      where: { id: params.id },
      include: {
        children: true
      }
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Navigation item not found' },
        { status: 404 }
      );
    }

    // Delete nav item (cascade will delete children)
    await prisma.navItem.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ message: 'Navigation item deleted successfully' });
  } catch (error) {
    console.error('Error deleting navigation item:', error);
    return NextResponse.json(
      { error: 'Failed to delete navigation item' },
      { status: 500 }
    );
  }
}
