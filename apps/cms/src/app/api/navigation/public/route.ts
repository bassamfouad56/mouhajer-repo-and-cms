import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { corsHeaders } from '@/lib/cors';

// GET /api/navigation/public - Get all active nav items (no auth required)
// Supports ?location=header or ?location=footer query parameter
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const location = searchParams.get('location');

    const whereClause: any = {
      isActive: true,
      parentId: null // Only get top-level items
    };

    // Filter by location if specified
    if (location) {
      whereClause.location = location;
    }

    // Get all active nav items ordered by order field
    const navItems = await prisma.navItem.findMany({
      where: whereClause,
      orderBy: [
        { order: 'asc' }
      ],
      include: {
        children: {
          where: {
            isActive: true
          },
          orderBy: { order: 'asc' },
          include: {
            children: {
              where: {
                isActive: true
              },
              orderBy: { order: 'asc' }
            }
          }
        }
      }
    });

    // Transform to bilingual format
    const transformedNav = navItems.map(item => transformNavItem(item));

    return NextResponse.json(transformedNav, { headers: corsHeaders });
  } catch (error) {
    console.error('Error fetching public navigation:', error);
    return NextResponse.json(
      { error: 'Failed to fetch navigation' },
      { status: 500, headers: corsHeaders }
    );
  }
}

// Helper function to transform nav items to frontend format
function transformNavItem(item: any): any {
  return {
    id: item.id,
    label: {
      en: item.labelEn,
      ar: item.labelAr
    },
    url: item.url,
    type: item.type,
    location: item.location,
    icon: item.icon,
    target: item.target,
    parentId: item.parentId,
    order: item.order,
    isActive: item.isActive,
    openInNewTab: item.openInNewTab,
    cssClass: item.cssClass,
    badge: item.badge,
    badgeColor: item.badgeColor,
    description: item.description,
    megaMenuColumns: item.megaMenuColumns,
    megaMenuImage: item.megaMenuImage,
    requiresAuth: item.requiresAuth,
    requiredRoles: item.requiredRoles,
    children: item.children ? item.children.map((child: any) => transformNavItem(child)) : [],
    createdAt: item.createdAt.toISOString(),
    updatedAt: item.updatedAt.toISOString()
  };
}
