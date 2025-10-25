import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const content = await prisma.content.findUnique({
      where: { id: params.id },
      include: {
        sections: {
          include: {
            blueprint: true,
          },
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

    if (!content) {
      return NextResponse.json({ error: 'Content not found' }, { status: 404 });
    }

    return NextResponse.json({ content });
  } catch (error) {
    console.error('Failed to fetch content:', error);
    return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const {
      titleEn,
      titleAr,
      slugEn,
      slugAr,
      descriptionEn,
      descriptionAr,
      status,
      featured,
      sections = [],
    } = body;

    // Update content
    const updatedContent = await prisma.content.update({
      where: { id: params.id },
      data: {
        titleEn,
        titleAr,
        slugEn,
        slugAr,
        descriptionEn,
        descriptionAr,
        status,
        featured,
        publishedAt: status === 'PUBLISHED' ? new Date() : null,
      },
    });

    // Update sections
    for (const section of sections) {
      await prisma.contentSection.update({
        where: { id: section.id },
        data: {
          order: section.order,
          dataEn: section.dataEn,
          dataAr: section.dataAr,
          visible: section.visible,
        },
      });
    }

    // Fetch updated content with sections
    const content = await prisma.content.findUnique({
      where: { id: params.id },
      include: {
        sections: {
          include: {
            blueprint: true,
          },
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

    return NextResponse.json({
      message: 'Content updated successfully',
      content,
    });
  } catch (error) {
    console.error('Failed to update content:', error);
    return NextResponse.json(
      {
        error: 'Failed to update content',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.content.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Content deleted successfully' });
  } catch (error) {
    console.error('Failed to delete content:', error);
    return NextResponse.json({ error: 'Failed to delete content' }, { status: 500 });
  }
}
