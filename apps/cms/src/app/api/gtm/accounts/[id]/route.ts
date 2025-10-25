import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';


// GET single GTM account
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const account = await prisma.googleTagManagerAccount.findUnique({
      where: { id: params.id },
      include: {
        containers: {
          include: {
            _count: {
              select: { tags: true, triggers: true, variables: true },
            },
          },
        },
        _count: {
          select: { containers: true },
        },
      },
    });

    if (!account) {
      return NextResponse.json(
        { error: 'Account not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(account);
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to fetch account', details: error.message },
      { status: 500 }
    );
  }
}

// PUT update GTM account
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const {
      accountName,
      clientEmail,
      privateKey,
      projectId,
      isActive,
    } = body;

    const account = await prisma.googleTagManagerAccount.update({
      where: { id: params.id },
      data: {
        accountName,
        clientEmail,
        privateKey,
        projectId,
        isActive,
      },
    });

    return NextResponse.json(account);
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to update account', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE GTM account
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.googleTagManagerAccount.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to delete account', details: error.message },
      { status: 500 }
    );
  }
}
