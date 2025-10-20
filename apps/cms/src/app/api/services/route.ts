import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { corsResponse } from '@/lib/cors';
import { auth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured') === 'true';
    const limit = searchParams.get('limit');

    const where: any = {};
    if (featured) where.featured = true;

    const services = await prisma.service.findMany({
      where,
      take: limit ? parseInt(limit) : undefined,
      orderBy: { createdAt: 'desc' },
    });

    // Transform to match expected format
    const transformedServices = services.map(service => ({
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
      images: service.images,
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
        keywordsEn: service.seoKeywordsEn,
        keywordsAr: service.seoKeywordsAr,
      },
      targetLocations: service.targetLocations,
      serviceArea: service.serviceArea,
      faqs: service.faqs,
      viewCount: service.viewCount,
      averageRating: service.averageRating,
      createdAt: service.createdAt.toISOString(),
      updatedAt: service.updatedAt.toISOString(),
    }));

    return corsResponse(transformedServices);
  } catch (error) {
    console.error('Error fetching services:', error);
    return corsResponse(
      { error: 'Failed to fetch services' },
      { status: 500 }
    );
  }
}

// Helper function to generate slug
function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user.role !== 'admin') {
      return corsResponse(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Validate required fields
    if (!body.title?.en || !body.title?.ar) {
      return corsResponse(
        { error: 'Title in both English and Arabic is required' },
        { status: 400 }
      );
    }

    if (!body.description?.en || !body.description?.ar) {
      return corsResponse(
        { error: 'Description in both English and Arabic is required' },
        { status: 400 }
      );
    }

    if (!body.shortDescription?.en || !body.shortDescription?.ar) {
      return corsResponse(
        { error: 'Short description in both English and Arabic is required' },
        { status: 400 }
      );
    }

    // Generate slugs
    const slugEn = body.slug?.en || generateSlug(body.title.en);
    const slugAr = body.slug?.ar || generateSlug(body.title.ar);

    const service = await prisma.service.create({
      data: {
        titleEn: body.title.en,
        titleAr: body.title.ar,
        slugEn,
        slugAr,
        descriptionEn: body.description.en,
        descriptionAr: body.description.ar,
        shortDescriptionEn: body.shortDescription.en,
        shortDescriptionAr: body.shortDescription.ar,
        icon: body.icon || null,
        images: body.images || [],
        featuresEn: body.features?.en || [],
        featuresAr: body.features?.ar || [],
        price: body.price || null,
        duration: body.duration || null,
        featured: body.featured || false,
        status: body.status || 'published',
        // SEO fields
        seoMetaTitleEn: body.seo?.metaTitleEn || null,
        seoMetaTitleAr: body.seo?.metaTitleAr || null,
        seoMetaDescEn: body.seo?.metaDescEn || null,
        seoMetaDescAr: body.seo?.metaDescAr || null,
        seoKeywordsEn: body.seo?.keywordsEn || [],
        seoKeywordsAr: body.seo?.keywordsAr || [],
        targetLocations: body.targetLocations || [],
        serviceArea: body.serviceArea || [],
        faqs: body.faqs || null,
        relatedServiceIds: body.relatedServiceIds || [],
        viewCount: 0,
      },
    });

    // Transform to match expected format
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
      images: service.images,
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
        keywordsEn: service.seoKeywordsEn,
        keywordsAr: service.seoKeywordsAr,
      },
      targetLocations: service.targetLocations,
      serviceArea: service.serviceArea,
      faqs: service.faqs,
      viewCount: service.viewCount,
      averageRating: service.averageRating,
      createdAt: service.createdAt.toISOString(),
      updatedAt: service.updatedAt.toISOString(),
    };

    return corsResponse(transformedService, { status: 201 });
  } catch (error) {
    console.error('Error creating service:', error);
    return corsResponse(
      { error: 'Failed to create service' },
      { status: 500 }
    );
  }
}
