import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { corsResponse } from '@/lib/cors';

// GET - List all handoffs (for marketing dashboard)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = searchParams.get('limit');

    const where: any = {};
    if (status && status !== 'all') {
      where.status = status;
    }

    const handoffs = await prisma.projectHandoff.findMany({
      where,
      take: limit ? parseInt(limit) : undefined,
      orderBy: { createdAt: 'desc' },
      include: {
        // Note: We'll add project relation when Prisma generates the client
      },
    });

    // Manually fetch related projects
    const handoffsWithProjects = await Promise.all(
      handoffs.map(async (handoff) => {
        const project = await prisma.project.findUnique({
          where: { id: handoff.projectId },
        });

        return {
          ...handoff,
          project: project ? {
            id: project.id,
            title: {
              en: project.titleEn,
              ar: project.titleAr,
            },
            category: project.category,
            images: project.images,
          } : null,
        };
      })
    );

    return corsResponse(handoffsWithProjects);
  } catch (error) {
    console.error('Error fetching handoffs:', error);
    return corsResponse(
      { error: 'Failed to fetch handoffs' },
      { status: 500 }
    );
  }
}
