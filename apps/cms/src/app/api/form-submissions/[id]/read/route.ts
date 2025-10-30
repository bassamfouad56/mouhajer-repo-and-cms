import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';

const prisma = new PrismaClient();

/**
 * POST /api/form-submissions/[id]/read
 * Mark a form submission as read (admin only)
 */
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const submission = await prisma.formSubmission.update({
      where: { id: params.id },
      data: {
        status: 'read',
        readAt: new Date(),
      },
    });

    return NextResponse.json(submission);
  } catch (error) {
    console.error('Error marking submission as read:', error);
    return NextResponse.json(
      { error: 'Failed to mark submission as read' },
      { status: 500 }
    );
  }
}
