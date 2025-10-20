import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const page = await prisma.page.findUnique({
      where: { id },
      include: {
        blocks: {
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!page) {
      return NextResponse.json(
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

    return NextResponse.json(transformedPage);
  } catch (error) {
    console.error('Error fetching page:', error);
    return NextResponse.json(
      { error: 'Failed to fetch page' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    // Prepare update data
    const updateData: any = {};
    if (body.title?.en) updateData.titleEn = body.title.en;
    if (body.title?.ar) updateData.titleAr = body.title.ar;
    if (body.slug?.en) updateData.slugEn = body.slug.en;
    if (body.slug?.ar) updateData.slugAr = body.slug.ar;
    if (body.description?.en !== undefined) updateData.descriptionEn = body.description.en;
    if (body.description?.ar !== undefined) updateData.descriptionAr = body.description.ar;
    if (body.seo?.metaTitle?.en !== undefined) updateData.seoMetaTitleEn = body.seo.metaTitle.en;
    if (body.seo?.metaTitle?.ar !== undefined) updateData.seoMetaTitleAr = body.seo.metaTitle.ar;
    if (body.seo?.metaDescription?.en !== undefined) updateData.seoMetaDescEn = body.seo.metaDescription.en;
    if (body.seo?.metaDescription?.ar !== undefined) updateData.seoMetaDescAr = body.seo.metaDescription.ar;
    if (body.seo?.keywords !== undefined) updateData.seoKeywords = body.seo.keywords;
    if (body.status) updateData.status = body.status;
    if (body.featured !== undefined) updateData.featured = body.featured;

    // Handle blocks update if provided
    if (body.blocks) {
      // Delete existing blocks and create new ones
      await prisma.pageBlock.deleteMany({
        where: { pageId: id },
      });

      updateData.blocks = {
        create: body.blocks.map((block: any, index: number) => ({
          type: block.type,
          data: block.data || {},
          order: block.order ?? index,
        })),
      };
    }

    const updatedPage = await prisma.page.update({
      where: { id },
      data: updateData,
      include: {
        blocks: {
          orderBy: { order: 'asc' },
        },
      },
    });

    // Transform to match expected format
    const transformedPage = {
      id: updatedPage.id,
      title: {
        en: updatedPage.titleEn,
        ar: updatedPage.titleAr,
      },
      slug: {
        en: updatedPage.slugEn,
        ar: updatedPage.slugAr,
      },
      description: {
        en: updatedPage.descriptionEn,
        ar: updatedPage.descriptionAr,
      },
      blocks: updatedPage.blocks.map(block => ({
        id: block.id,
        type: block.type,
        data: block.data,
        order: block.order,
      })),
      seo: {
        metaTitle: {
          en: updatedPage.seoMetaTitleEn || '',
          ar: updatedPage.seoMetaTitleAr || '',
        },
        metaDescription: {
          en: updatedPage.seoMetaDescEn || '',
          ar: updatedPage.seoMetaDescAr || '',
        },
        keywords: updatedPage.seoKeywords,
      },
      status: updatedPage.status,
      featured: updatedPage.featured,
      createdAt: updatedPage.createdAt.toISOString(),
      updatedAt: updatedPage.updatedAt.toISOString(),
    };

    return NextResponse.json(transformedPage);
  } catch (error) {
    if (error instanceof Error && error.message.includes('Record to update not found')) {
      return NextResponse.json(
        { error: 'Page not found' },
        { status: 404 }
      );
    }
    console.error('Error updating page:', error);
    return NextResponse.json(
      { error: 'Failed to update page' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Blocks will be deleted automatically due to onDelete: Cascade in schema
    await prisma.page.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Page deleted successfully' });
  } catch (error) {
    if (error instanceof Error && error.message.includes('Record to delete does not exist')) {
      return NextResponse.json(
        { error: 'Page not found' },
        { status: 404 }
      );
    }
    console.error('Error deleting page:', error);
    return NextResponse.json(
      { error: 'Failed to delete page' },
      { status: 500 }
    );
  }
}
