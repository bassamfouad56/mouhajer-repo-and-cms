import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';

const prisma = new PrismaClient();

/**
 * GET /api/form-submissions/stats
 * Get form submission statistics (admin only)
 */
export async function GET(request: Request) {
  try {
    // Check authentication
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get counts by status
    const [total, newCount, readCount, archivedCount, spamCount] = await Promise.all([
      prisma.formSubmission.count(),
      prisma.formSubmission.count({ where: { status: 'new' } }),
      prisma.formSubmission.count({ where: { status: 'read' } }),
      prisma.formSubmission.count({ where: { status: 'archived' } }),
      prisma.formSubmission.count({ where: { status: 'spam' } }),
    ]);

    return NextResponse.json({
      total,
      new: newCount,
      read: readCount,
      archived: archivedCount,
      spam: spamCount,
    });
  } catch (error) {
    console.error('Error fetching form submission stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch form submission stats' },
      { status: 500 }
    );
  }
}
