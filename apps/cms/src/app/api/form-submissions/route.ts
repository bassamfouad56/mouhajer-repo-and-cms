import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';

const prisma = new PrismaClient();

/**
 * GET /api/form-submissions
 * Get all form submissions (admin only)
 */
export async function GET(request: Request) {
  try {
    // Check authentication
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const formId = searchParams.get('formId');
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Build where clause
    const where: any = {};
    if (status && status !== 'all') {
      where.status = status;
    }
    if (formId && formId !== 'all') {
      where.formId = formId;
    }

    // Fetch submissions
    const submissions = await prisma.formSubmission.findMany({
      where,
      orderBy: { submittedAt: 'desc' },
      take: limit,
      skip: offset,
    });

    const total = await prisma.formSubmission.count({ where });

    return NextResponse.json({
      submissions,
      total,
      limit,
      offset,
    });
  } catch (error) {
    console.error('Error fetching form submissions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch form submissions' },
      { status: 500 }
    );
  }
}
