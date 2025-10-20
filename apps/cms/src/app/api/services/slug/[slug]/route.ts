import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { corsHeaders } from '@/lib/cors';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const { searchParams } = new URL(request.url);
    const lang = searchParams.get('lang') || 'en';

    const service = await prisma.service.findFirst({
      where: {
        OR: [
          { slugEn: slug },
          { slugAr: slug },
        ],
        status: 'published',
      },
    });

    if (!service) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404, headers: corsHeaders }
      );
    }

    // Transform to match expected format with all fields
    const transformedService = {
      id: service.id,
      title: {
        en: service.titleEn,
        ar: service.titleAr,
      },
      slug: {
        en: service.slugEn,
        ar: service.slugAr,
      },
      description: {
        en: service.descriptionEn,
        ar: service.descriptionAr,
      },
      shortDescription: {
        en: service.shortDescriptionEn,
        ar: service.shortDescriptionAr,
      },
      icon: service.icon,
      images: service.images || [],
      features: {
        en: service.featuresEn,
        ar: service.featuresAr,
      },
      price: service.price,
      duration: service.duration,
      featured: service.featured,
      status: service.status,
      seo: {
        metaTitleEn: service.seoMetaTitleEn,
        metaTitleAr: service.seoMetaTitleAr,
        metaDescEn: service.seoMetaDescEn,
        metaDescAr: service.seoMetaDescAr,
        keywordsEn: service.seoKeywordsEn || [],
        keywordsAr: service.seoKeywordsAr || [],
      },
      targetLocations: service.targetLocations || [],
      serviceArea: service.serviceArea || [],
      faqs: service.faqs || null,
      relatedServiceIds: service.relatedServiceIds || [],
      viewCount: service.viewCount,
      averageRating: service.averageRating,
      createdAt: service.createdAt.toISOString(),
      updatedAt: service.updatedAt.toISOString(),
    };

    return NextResponse.json(transformedService, { headers: corsHeaders });
  } catch (error) {
    console.error('Error fetching service by slug:', error);
    return NextResponse.json(
      { error: 'Failed to fetch service' },
      { status: 500, headers: corsHeaders }
    );
  }
}
