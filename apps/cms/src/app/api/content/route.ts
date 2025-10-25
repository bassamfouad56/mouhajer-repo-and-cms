import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { translateToArabic } from '@/lib/google-translate';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const status = searchParams.get('status');

    const contents = await prisma.content.findMany({
      where: {
        ...(type && type !== 'ALL' ? { type: type as any } : {}),
        ...(status && status !== 'ALL' ? { status: status as any } : {}),
      },
      include: {
        _count: {
          select: { sections: true },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    return NextResponse.json({ contents });
  } catch (error) {
    console.error('Failed to fetch contents:', error);
    return NextResponse.json({ error: 'Failed to fetch contents' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      type,
      template,
      titleEn,
      titleAr,
      slugEn,
      slugAr,
      descriptionEn,
      descriptionAr,
      defaultSections = [],
    } = body;

    // Validation
    if (!type || !titleEn || !slugEn) {
      return NextResponse.json(
        { error: 'Missing required fields: type, titleEn, slugEn' },
        { status: 400 }
      );
    }

    // Server-side translation if Arabic fields are missing
    let finalTitleAr = titleAr;
    let finalDescAr = descriptionAr;
    let finalSlugAr = slugAr;

    if (!finalTitleAr && titleEn) {
      try {
        finalTitleAr = await translateToArabic(titleEn);
        finalSlugAr = finalTitleAr
          .toLowerCase()
          .replace(/[^a-z0-9\u0600-\u06FF]+/g, '-')
          .replace(/^-|-$/g, '');
      } catch (error) {
        console.error('Translation failed for title:', error);
        finalTitleAr = titleEn; // Fallback
        finalSlugAr = slugEn;
      }
    }

    if (!finalDescAr && descriptionEn) {
      try {
        finalDescAr = await translateToArabic(descriptionEn);
      } catch (error) {
        console.error('Translation failed for description:', error);
        finalDescAr = descriptionEn; // Fallback
      }
    }

    // Create content
    const content = await prisma.content.create({
      data: {
        type,
        template,
        titleEn,
        titleAr: finalTitleAr,
        slugEn,
        slugAr: finalSlugAr || slugEn,
        descriptionEn: descriptionEn || '',
        descriptionAr: finalDescAr || descriptionEn || '',
        status: 'DRAFT',
        featured: false,
      },
    });

    // Create default sections from template if provided
    if (defaultSections.length > 0) {
      // First, get all blueprints by name to map blueprintName to blueprintId
      const blueprintNames = defaultSections.map((s: any) => s.blueprintName);
      const blueprints = await prisma.contentBlueprint.findMany({
        where: {
          name: {
            in: blueprintNames,
          },
        },
      });

      const blueprintMap = blueprints.reduce(
        (acc, bp) => {
          acc[bp.name] = bp.id;
          return acc;
        },
        {} as Record<string, string>
      );

      // Create sections
      const sectionsToCreate = defaultSections
        .map((section: any) => {
          const blueprintId = blueprintMap[section.blueprintName];
          if (!blueprintId) {
            console.warn(`Blueprint not found: ${section.blueprintName}`);
            return null;
          }

          return {
            contentId: content.id,
            blueprintId,
            order: section.order,
            dataEn: section.defaultData.en,
            dataAr: section.defaultData.ar,
            visible: true,
          };
        })
        .filter(Boolean);

      if (sectionsToCreate.length > 0) {
        await prisma.contentSection.createMany({
          data: sectionsToCreate as any[],
        });
      }
    }

    // Fetch the created content with sections
    const createdContent = await prisma.content.findUnique({
      where: { id: content.id },
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
      message: 'Content created successfully',
      content: createdContent,
    });
  } catch (error) {
    console.error('Failed to create content:', error);
    return NextResponse.json(
      {
        error: 'Failed to create content',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
