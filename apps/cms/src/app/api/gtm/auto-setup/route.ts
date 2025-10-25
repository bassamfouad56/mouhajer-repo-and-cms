import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * Auto-setup Google Tag Manager using existing GA4 credentials
 * POST /api/gtm/auto-setup
 */
export async function POST() {
  try {
    // 1. Check if GTM account already exists
    const existingAccount = await prisma.googleTagManagerAccount.findFirst();

    if (existingAccount) {
      return NextResponse.json(
        { error: 'Google Tag Manager account already configured' },
        { status: 400 }
      );
    }

    // 2. Get credentials from existing GA4 account
    const ga4Account = await prisma.googleAnalyticsProperty.findFirst({
      where: { isActive: true }
    });

    if (!ga4Account) {
      return NextResponse.json(
        {
          error: 'No Google Analytics 4 account found. Please set up GA4 first.',
          suggestion: 'Go to Analytics Settings to add GA4 property'
        },
        { status: 404 }
      );
    }

    // 3. Create GTM account using the same credentials
    const gtmAccount = await prisma.googleTagManagerAccount.create({
      data: {
        accountName: 'Mouhajer Tag Manager',
        accountId: 'CONFIGURE_ME',      // User needs to update this
        accountPath: 'accounts/CONFIGURE_ME', // User needs to update this
        clientEmail: ga4Account.clientEmail,
        privateKey: ga4Account.privateKey,
        projectId: ga4Account.projectId,
        isActive: true,
        syncStatus: 'pending',
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Google Tag Manager configured successfully using existing credentials!',
      account: {
        id: gtmAccount.id,
        accountName: gtmAccount.accountName,
      },
      nextSteps: [
        'Update your GTM Account ID (currently: CONFIGURE_ME)',
        'Update your Account Path (e.g., accounts/123456)',
        'Go to Analytics Settings > Tag Manager to edit',
        'Find your Account ID in GTM Admin > Account Settings',
      ]
    });

  } catch (error) {
    console.error('Auto-setup error:', error);
    return NextResponse.json(
      {
        error: 'Failed to auto-setup Google Tag Manager',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
