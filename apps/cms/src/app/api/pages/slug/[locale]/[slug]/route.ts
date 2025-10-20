import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { corsResponse } from '@/lib/cors';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ locale: string; slug: string }> }
) {
  try {
    const { locale, slug } = await params;

    // Validate locale
    if (locale !== 'en' && locale !== 'ar') {
      return corsResponse(
        { error: 'Invalid locale. Use "en" or "ar"' },
        { status: 400 }
      );
    }

    // Build where clause based on locale
    const where: any = {
      status: 'published', // Only return published pages
    };

    if (locale === 'en') {
      where.slugEn = slug;
    } else {
      where.slugAr = slug;
    }

    const page = await prisma.page.findFirst({
      where,
      include: {
        blocks: {
          orderBy: { order: 'asc' },
        },
        children: {
          where: {
            status: 'published',
          },
          orderBy: { createdAt: 'desc' },
        },
        parent: true,
      },
    });

    if (!page) {
      return corsResponse(
        { error: 'Page not found' },
        { status: 404 }
      );
    }

    // Transform to match expected format
    const transformedPage = {
      id: page.id,
      title: {
        en: page.titleEn,
        ar: page.titleAr,
      },
      slug: {
        en: page.slugEn,
        ar: page.slugAr,
      },
      description: {
        en: page.descriptionEn,
        ar: page.descriptionAr,
      },
      parentId: page.parentId,
      parent: page.parent ? {
        id: page.parent.id,
        title: {
          en: page.parent.titleEn,
          ar: page.parent.titleAr,
        },
        slug: {
          en: page.parent.slugEn,
          ar: page.parent.slugAr,
        },
      } : null,
      children: page.children.map((child: any) => ({
        id: child.id,
        title: {
          en: child.titleEn,
          ar: child.titleAr,
        },
        slug: {
          en: child.slugEn,
          ar: child.slugAr,
        },
      })),
      blocks: page.blocks.map(block => ({
        id: block.id,
        type: block.type,
        data: block.data,
        order: block.order,
      })),
      seo: {
        metaTitle: {
          en: page.seoMetaTitleEn || '',
          ar: page.seoMetaTitleAr || '',
        },
        metaDescription: {
          en: page.seoMetaDescEn || '',
          ar: page.seoMetaDescAr || '',
        },
        keywords: page.seoKeywords,
      },
      status: page.status,
      featured: page.featured,
      createdAt: page.createdAt.toISOString(),
      updatedAt: page.updatedAt.toISOString(),
    };

    return corsResponse(transformedPage);
  } catch (error) {
    console.error('Error fetching page by slug:', error);
    return corsResponse(
      { error: 'Failed to fetch page' },
      { status: 500 }
    );
  }
}
