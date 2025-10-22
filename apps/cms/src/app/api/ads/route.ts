import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const zone = searchParams.get('zone');
    const active = searchParams.get('active');
    const featured = searchParams.get('featured');

    const where: any = {};

    // Filter by zone if specified
    if (zone) {
      where.zone = zone;
    }

    // Filter by featured if specified
    if (featured === 'true') {
      where.featured = true;
    }

    // Filter by active status if specified
    if (active === 'true') {
      const now = new Date();
      where.active = true;
      where.OR = [
        { alwaysActive: true },
        {
          AND: [
            { startDate: { lte: now } },
            { endDate: { gte: now } }
          ]
        }
      ];
    }

    const ads = await prisma.advertisement.findMany({
      where,
      orderBy: { priority: 'desc' },
    });

    // Transform to match expected format
    const transformedAds = ads.map(ad => ({
      id: ad.id,
      title: {
        en: ad.titleEn,
        ar: ad.titleAr,
      },
      description: {
        en: ad.descriptionEn,
        ar: ad.descriptionAr,
      },
      image: ad.image,
      videoUrl: ad.videoUrl,
      linkUrl: ad.linkUrl,
      ctaText: {
        en: ad.ctaTextEn,
        ar: ad.ctaTextAr,
      },
      zone: ad.zone,
      type: ad.type,
      htmlContent: {
        en: ad.htmlContentEn,
        ar: ad.htmlContentAr,
      },
      startDate: ad.startDate.toISOString(),
      endDate: ad.endDate.toISOString(),
      alwaysActive: ad.alwaysActive,
      pages: ad.pages,
      showOnAllPages: ad.showOnAllPages,
      priority: ad.priority,
      maxImpressions: ad.maxImpressions,
      impressionCount: ad.impressionCount,
      clickCount: ad.clickCount,
      active: ad.active,
      featured: ad.featured,
      createdAt: ad.createdAt.toISOString(),
      updatedAt: ad.updatedAt.toISOString(),
    }));

    return NextResponse.json(transformedAds);
  } catch (error) {
    console.error('Error fetching ads:', error);
    return NextResponse.json(
      { error: 'Failed to fetch advertisements' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.title?.en || !body.title?.ar) {
      return NextResponse.json(
        { error: 'Title in both English and Arabic is required' },
        { status: 400 }
      );
    }

    if (!body.zone) {
      return NextResponse.json(
        { error: 'Zone is required' },
        { status: 400 }
      );
    }

    if (!body.type) {
      return NextResponse.json(
        { error: 'Type is required' },
        { status: 400 }
      );
    }

    if (!body.linkUrl) {
      return NextResponse.json(
        { error: 'Link URL is required' },
        { status: 400 }
      );
    }

    const ad = await prisma.advertisement.create({
      data: {
        titleEn: body.title.en,
        titleAr: body.title.ar,
        descriptionEn: body.description?.en || '',
        descriptionAr: body.description?.ar || '',
        image: body.image || '',
        videoUrl: body.videoUrl || null,
        linkUrl: body.linkUrl,
        ctaTextEn: body.ctaText?.en || 'Learn More',
        ctaTextAr: body.ctaText?.ar || 'اعرف المزيد',
        zone: body.zone,
        type: body.type,
        htmlContentEn: body.htmlContent?.en || null,
        htmlContentAr: body.htmlContent?.ar || null,
        startDate: body.startDate ? new Date(body.startDate) : new Date(),
        endDate: body.endDate ? new Date(body.endDate) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        alwaysActive: body.alwaysActive || false,
        pages: body.pages || [],
        showOnAllPages: body.showOnAllPages !== undefined ? body.showOnAllPages : true,
        priority: body.priority || 5,
        maxImpressions: body.maxImpressions || null,
        active: body.active !== undefined ? body.active : true,
        featured: body.featured || false,
      },
    });

    // Transform to match expected format
    const transformedAd = {
      id: ad.id,
      title: {
        en: ad.titleEn,
        ar: ad.titleAr,
      },
      description: {
        en: ad.descriptionEn,
        ar: ad.descriptionAr,
      },
      image: ad.image,
      videoUrl: ad.videoUrl,
      linkUrl: ad.linkUrl,
      ctaText: {
        en: ad.ctaTextEn,
        ar: ad.ctaTextAr,
      },
      zone: ad.zone,
      type: ad.type,
      htmlContent: {
        en: ad.htmlContentEn,
        ar: ad.htmlContentAr,
      },
      startDate: ad.startDate.toISOString(),
      endDate: ad.endDate.toISOString(),
      alwaysActive: ad.alwaysActive,
      pages: ad.pages,
      showOnAllPages: ad.showOnAllPages,
      priority: ad.priority,
      maxImpressions: ad.maxImpressions,
      impressionCount: ad.impressionCount,
      clickCount: ad.clickCount,
      active: ad.active,
      featured: ad.featured,
      createdAt: ad.createdAt.toISOString(),
      updatedAt: ad.updatedAt.toISOString(),
    };

    return NextResponse.json(transformedAd, { status: 201 });
  } catch (error) {
    console.error('Error creating ad:', error);
    return NextResponse.json(
      { error: 'Failed to create advertisement' },
      { status: 500 }
    );
  }
}
