import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';


// GET single Google Ads account
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const account = await prisma.googleAdsAccount.findUnique({
      where: { id: params.id },
      include: {
        campaigns: true,
        metrics: {
          orderBy: { date: 'desc' },
          take: 30,
        },
        _count: {
          select: { campaigns: true, metrics: true },
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

// PUT update Google Ads account
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const {
      accountName,
      developerToken,
      clientId,
      clientSecret,
      refreshToken,
      loginCustomerId,
      isActive,
    } = body;

    const account = await prisma.googleAdsAccount.update({
      where: { id: params.id },
      data: {
        accountName,
        developerToken,
        clientId,
        clientSecret,
        refreshToken,
        loginCustomerId,
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

// DELETE Google Ads account
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.googleAdsAccount.delete({
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
