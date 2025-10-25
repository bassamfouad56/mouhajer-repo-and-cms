import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';


// GET all GTM accounts
export async function GET() {
  try {
    const accounts = await prisma.googleTagManagerAccount.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { containers: true },
        },
      },
    });

    return NextResponse.json(accounts);
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to fetch GTM accounts', details: error.message },
      { status: 500 }
    );
  }
}

// POST create new GTM account
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      accountName,
      accountId,
      accountPath,
      clientEmail,
      privateKey,
      projectId,
    } = body;

    if (!accountName || !accountId || !accountPath || !clientEmail || !privateKey || !projectId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const account = await prisma.googleTagManagerAccount.create({
      data: {
        accountName,
        accountId,
        accountPath,
        clientEmail,
        privateKey,
        projectId,
        isActive: true,
        syncStatus: 'pending',
      },
    });

    return NextResponse.json(account, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to create GTM account', details: error.message },
      { status: 500 }
    );
  }
}
