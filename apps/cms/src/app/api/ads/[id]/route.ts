import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const ad = await prisma.advertisement.findUnique({
      where: { id },
    });

    if (!ad) {
      return NextResponse.json(
        { error: 'Advertisement not found' },
        { status: 404 }
      );
    }

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

    return NextResponse.json(transformedAd);
  } catch (error) {
    console.error('Error fetching ad:', error);
    return NextResponse.json(
      { error: 'Failed to fetch advertisement' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await request.json();

    const updateData: any = {};
    if (body.title?.en) updateData.titleEn = body.title.en;
    if (body.title?.ar) updateData.titleAr = body.title.ar;
    if (body.description?.en !== undefined) updateData.descriptionEn = body.description.en;
    if (body.description?.ar !== undefined) updateData.descriptionAr = body.description.ar;
    if (body.image !== undefined) updateData.image = body.image;
    if (body.videoUrl !== undefined) updateData.videoUrl = body.videoUrl;
    if (body.linkUrl) updateData.linkUrl = body.linkUrl;
    if (body.ctaText?.en) updateData.ctaTextEn = body.ctaText.en;
    if (body.ctaText?.ar) updateData.ctaTextAr = body.ctaText.ar;
    if (body.zone) updateData.zone = body.zone;
    if (body.type) updateData.type = body.type;
    if (body.htmlContent?.en !== undefined) updateData.htmlContentEn = body.htmlContent.en;
    if (body.htmlContent?.ar !== undefined) updateData.htmlContentAr = body.htmlContent.ar;
    if (body.startDate) updateData.startDate = new Date(body.startDate);
    if (body.endDate) updateData.endDate = new Date(body.endDate);
    if (body.alwaysActive !== undefined) updateData.alwaysActive = body.alwaysActive;
    if (body.pages !== undefined) updateData.pages = body.pages;
    if (body.showOnAllPages !== undefined) updateData.showOnAllPages = body.showOnAllPages;
    if (body.priority !== undefined) updateData.priority = body.priority;
    if (body.maxImpressions !== undefined) updateData.maxImpressions = body.maxImpressions;
    if (body.active !== undefined) updateData.active = body.active;
    if (body.featured !== undefined) updateData.featured = body.featured;

    const updatedAd = await prisma.advertisement.update({
      where: { id },
      data: updateData,
    });

    // Transform to match expected format
    const transformedAd = {
      id: updatedAd.id,
      title: {
        en: updatedAd.titleEn,
        ar: updatedAd.titleAr,
      },
      description: {
        en: updatedAd.descriptionEn,
        ar: updatedAd.descriptionAr,
      },
      image: updatedAd.image,
      videoUrl: updatedAd.videoUrl,
      linkUrl: updatedAd.linkUrl,
      ctaText: {
        en: updatedAd.ctaTextEn,
        ar: updatedAd.ctaTextAr,
      },
      zone: updatedAd.zone,
      type: updatedAd.type,
      htmlContent: {
        en: updatedAd.htmlContentEn,
        ar: updatedAd.htmlContentAr,
      },
      startDate: updatedAd.startDate.toISOString(),
      endDate: updatedAd.endDate.toISOString(),
      alwaysActive: updatedAd.alwaysActive,
      pages: updatedAd.pages,
      showOnAllPages: updatedAd.showOnAllPages,
      priority: updatedAd.priority,
      maxImpressions: updatedAd.maxImpressions,
      impressionCount: updatedAd.impressionCount,
      clickCount: updatedAd.clickCount,
      active: updatedAd.active,
      featured: updatedAd.featured,
      createdAt: updatedAd.createdAt.toISOString(),
      updatedAt: updatedAd.updatedAt.toISOString(),
    };

    return NextResponse.json(transformedAd);
  } catch (error) {
    if (error instanceof Error && error.message.includes('Record to update not found')) {
      return NextResponse.json(
        { error: 'Advertisement not found' },
        { status: 404 }
      );
    }
    console.error('Error updating ad:', error);
    return NextResponse.json(
      { error: 'Failed to update advertisement' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    await prisma.advertisement.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message.includes('Record to delete does not exist')) {
      return NextResponse.json(
        { error: 'Advertisement not found' },
        { status: 404 }
      );
    }
    console.error('Error deleting ad:', error);
    return NextResponse.json(
      { error: 'Failed to delete advertisement' },
      { status: 500 }
    );
  }
}
