import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';


// GET all Google Ads accounts
export async function GET() {
  try {
    const accounts = await prisma.googleAdsAccount.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { campaigns: true, metrics: true },
        },
      },
    });

    return NextResponse.json(accounts);
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to fetch Google Ads accounts', details: error.message },
      { status: 500 }
    );
  }
}

// POST create new Google Ads account
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      accountName,
      customerId,
      developerToken,
      clientId,
      clientSecret,
      refreshToken,
      loginCustomerId,
    } = body;

    if (!accountName || !customerId || !developerToken || !clientId || !clientSecret || !refreshToken) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const account = await prisma.googleAdsAccount.create({
      data: {
        accountName,
        customerId,
        developerToken,
        clientId,
        clientSecret,
        refreshToken,
        loginCustomerId: loginCustomerId || null,
        isActive: true,
        syncStatus: 'pending',
      },
    });

    return NextResponse.json(account, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to create Google Ads account', details: error.message },
      { status: 500 }
    );
  }
}
