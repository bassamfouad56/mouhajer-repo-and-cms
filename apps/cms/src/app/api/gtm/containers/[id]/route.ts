import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';


// GET single container with all tags, triggers, and variables
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const container = await prisma.gTMContainer.findUnique({
      where: { id: params.id },
      include: {
        tags: {
          orderBy: { name: 'asc' },
        },
        triggers: {
          orderBy: { name: 'asc' },
        },
        variables: {
          orderBy: { name: 'asc' },
        },
        account: true,
      },
    });

    if (!container) {
      return NextResponse.json(
        { error: 'Container not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(container);
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to fetch container', details: error.message },
      { status: 500 }
    );
  }
}
