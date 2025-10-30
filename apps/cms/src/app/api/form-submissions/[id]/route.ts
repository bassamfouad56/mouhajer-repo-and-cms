import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';

const prisma = new PrismaClient();

/**
 * GET /api/form-submissions/[id]
 * Get a single form submission (admin only)
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const submission = await prisma.formSubmission.findUnique({
      where: { id: params.id },
    });

    if (!submission) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
    }

    return NextResponse.json(submission);
  } catch (error) {
    console.error('Error fetching form submission:', error);
    return NextResponse.json(
      { error: 'Failed to fetch form submission' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/form-submissions/[id]
 * Update a form submission (admin only)
 */
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { status, notes } = body;

    const submission = await prisma.formSubmission.update({
      where: { id: params.id },
      data: {
        ...(status && { status }),
        ...(notes !== undefined && { notes }),
      },
    });

    return NextResponse.json(submission);
  } catch (error) {
    console.error('Error updating form submission:', error);
    return NextResponse.json(
      { error: 'Failed to update form submission' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/form-submissions/[id]
 * Delete a form submission (admin only)
 */
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await prisma.formSubmission.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting form submission:', error);
    return NextResponse.json(
      { error: 'Failed to delete form submission' },
      { status: 500 }
    );
  }
}
