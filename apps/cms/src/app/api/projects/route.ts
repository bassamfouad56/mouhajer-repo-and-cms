import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { corsResponse } from '@/lib/cors';
import { auth } from '@/lib/auth';

/**
 * @swagger
 * /api/projects:
 *   get:
 *     summary: Get all projects
 *     description: Retrieve a list of all projects with optional filtering by featured status or category
 *     tags: [Projects]
 *     security: []
 *     parameters:
 *       - in: query
 *         name: featured
 *         schema:
 *           type: boolean
 *         description: Filter by featured projects only
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by project category
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Limit the number of results
 *     responses:
 *       200:
 *         description: List of projects retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Project'
 *       500:
 *         description: Server error
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured') === 'true';
    const category = searchParams.get('category');
    const limit = searchParams.get('limit');

    const where: any = {};
    if (featured) where.featured = true;
    if (category) where.category = category;

    const projects = await prisma.project.findMany({
      where,
      take: limit ? parseInt(limit) : undefined,
      orderBy: { createdAt: 'desc' },
    });

    // Transform to match expected format
    const transformedProjects = projects.map(project => ({
      id: project.id,
      title: {
        en: project.titleEn,
        ar: project.titleAr,
      },
      description: {
        en: project.descriptionEn,
        ar: project.descriptionAr,
      },
      images: project.images,
      category: project.category,
      featured: project.featured,
      status: project.status,
      createdAt: project.createdAt.toISOString(),
      updatedAt: project.updatedAt.toISOString(),
    }));

    return corsResponse(transformedProjects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return corsResponse(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/projects:
 *   post:
 *     summary: Create a new project
 *     description: Create a new project with bilingual content and images (Admin only)
 *     tags: [Projects]
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
 *               - description
 *               - category
 *             properties:
 *               title:
 *                 $ref: '#/components/schemas/BilingualText'
 *               description:
 *                 $ref: '#/components/schemas/BilingualText'
 *               category:
 *                 type: string
 *               featured:
 *                 type: boolean
 *               images:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     url:
 *                       type: string
 *                       format: uri
 *                     alt:
 *                       $ref: '#/components/schemas/BilingualText'
 *     responses:
 *       201:
 *         description: Project created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
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

    if (!body.description?.en || !body.description?.ar) {
      return corsResponse(
        { error: 'Description in both English and Arabic is required' },
        { status: 400 }
      );
    }

    if (!body.category) {
      return corsResponse(
        { error: 'Category is required' },
        { status: 400 }
      );
    }

    const project = await prisma.project.create({
      data: {
        titleEn: body.title.en,
        titleAr: body.title.ar,
        descriptionEn: body.description.en,
        descriptionAr: body.description.ar,
        images: body.images || [],
        category: body.category,
        featured: body.featured || false,
        status: body.status || 'published',
      },
    });

    // Transform to match expected format
    const transformedProject = {
      id: project.id,
      title: {
        en: project.titleEn,
        ar: project.titleAr,
      },
      description: {
        en: project.descriptionEn,
        ar: project.descriptionAr,
      },
      images: project.images,
      category: project.category,
      featured: project.featured,
      status: project.status,
      createdAt: project.createdAt.toISOString(),
      updatedAt: project.updatedAt.toISOString(),
    };

    return corsResponse(transformedProject, { status: 201 });
  } catch (error) {
    console.error('Error creating project:', error);
    return corsResponse(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
}
