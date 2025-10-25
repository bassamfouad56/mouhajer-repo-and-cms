import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

/**
 * GET /api/global-components
 * Fetch enabled global components for the frontend
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type');
    const lang = searchParams.get('lang') || 'en';

    const where: any = {
      enabled: true
    };

    if (type) {
      where.type = type;
    }

    const components = await prisma.globalComponent.findMany({
      where,
      orderBy: { type: 'asc' },
    });

    // Transform the data to return only the appropriate language
    const transformedComponents = components.map(component => ({
      id: component.id,
      type: component.type,
      displayName: component.displayName,
      data: lang === 'ar' ? component.dataAr : component.dataEn,
      enabled: component.enabled
    }));

    return NextResponse.json(transformedComponents);
  } catch (error) {
    console.error('Failed to fetch global components:', error);
    return NextResponse.json(
      { error: 'Failed to fetch global components' },
      { status: 500 }
    );
  }
}