import { NextRequest, NextResponse } from 'next/server';
import { googleTagManagerService } from '@/lib/google-tag-manager';
import { prisma } from '@/lib/prisma';


// POST sync GTM data
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { accountId } = body;

    if (!accountId) {
      return NextResponse.json(
        { error: 'Account ID is required' },
        { status: 400 }
      );
    }

    // Load account config
    const account = await googleTagManagerService.loadConfigFromDatabase(accountId);

    // Sync all GTM data (containers, tags, triggers, variables)
    const result = await googleTagManagerService.syncAll(
      accountId,
      account.accountPath
    );

    return NextResponse.json({
      success: true,
      result,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to sync GTM data', details: error.message },
      { status: 500 }
    );
  }
}
