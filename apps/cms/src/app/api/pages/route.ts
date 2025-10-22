import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { corsResponse } from '@/lib/cors';
import { auth } from '@/lib/auth';

/**
 * @swagger
 * /api/pages:
 *   get:
 *     summary: Get all pages
 *     description: Retrieve a list of all pages, optionally filtered by published status
 *     tags: [Pages]
 *     security: []
 *     parameters:
 *       - in: query
 *         name: published
 *         schema:
 *           type: boolean
 *         description: Filter by published status (true for published only)
 *     responses:
 *       200:
 *         description: List of pages retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Page'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const published = searchParams.get('published') === 'true';

    const where: any = {};
    if (published) where.status = 'published';

    const pages = await prisma.page.findMany({
      where,
      include: {
        blocks: {
          orderBy: { order: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Transform to match expected format
    const transformedPages = pages.map(page => ({
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
    }));

    return corsResponse(transformedPages);
  } catch (error) {
    console.error('Error fetching pages:', error);
    return corsResponse(
      { error: 'Failed to fetch pages' },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/pages:
 *   post:
 *     summary: Create a new page
 *     description: Create a new page with bilingual content and optional blocks
 *     tags: [Pages]
 *     security:
 *       - sessionAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - slug
 *             properties:
 *               title:
 *                 $ref: '#/components/schemas/BilingualText'
 *               slug:
 *                 $ref: '#/components/schemas/BilingualText'
 *               description:
 *                 $ref: '#/components/schemas/BilingualText'
 *               blocks:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     type:
 *                       type: string
 *                     data:
 *                       type: object
 *                     order:
 *                       type: number
 *               seo:
 *                 $ref: '#/components/schemas/SEO'
 *               status:
 *                 type: string
 *                 enum: [draft, published]
 *               featured:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Page created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Page'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         description: Server error
 */
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

    if (!body.slug?.en || !body.slug?.ar) {
      return corsResponse(
        { error: 'Slug in both English and Arabic is required' },
        { status: 400 }
      );
    }

    const page = await prisma.page.create({
      data: {
        titleEn: body.title.en,
        titleAr: body.title.ar,
        slugEn: body.slug.en,
        slugAr: body.slug.ar,
        descriptionEn: body.description?.en || '',
        descriptionAr: body.description?.ar || '',
        seoMetaTitleEn: body.seo?.metaTitle?.en || null,
        seoMetaTitleAr: body.seo?.metaTitle?.ar || null,
        seoMetaDescEn: body.seo?.metaDescription?.en || null,
        seoMetaDescAr: body.seo?.metaDescription?.ar || null,
        seoKeywords: body.seo?.keywords || [],
        status: body.status || 'draft',
        featured: body.featured || false,
        blocks: {
          create: (body.blocks || []).map((block: any, index: number) => ({
            type: block.type,
            data: block.data || {},
            order: block.order ?? index,
          })),
        },
      },
      include: {
        blocks: {
          orderBy: { order: 'asc' },
        },
      },
    });

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

    return corsResponse(transformedPage, { status: 201 });
  } catch (error) {
    console.error('Error creating page:', error);
    return corsResponse(
      { error: 'Failed to create page' },
      { status: 500 }
    );
  }
}
