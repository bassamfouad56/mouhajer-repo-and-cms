import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * Auto-setup Google Business Profile using existing GA4 credentials
 * POST /api/business-profile/auto-setup
 */
export async function POST() {
  try {
    // 1. Check if GBP account already exists
    const existingAccount = await prisma.googleBusinessProfileAccount.findFirst();

    if (existingAccount) {
      return NextResponse.json(
        { error: 'Google Business Profile account already configured' },
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

    // 3. Create GBP account using the same credentials
    const gbpAccount = await prisma.googleBusinessProfileAccount.create({
      data: {
        accountName: 'Mouhajer Business Profile',
        gbpAccountId: 'accounts/CONFIGURE_ME', // User needs to update this
        locationId: 'locations/CONFIGURE_ME',   // User needs to update this
        locationName: 'Mouhajer Design & Contracting',
        clientEmail: ga4Account.clientEmail,
        privateKey: ga4Account.privateKey,
        isActive: true,
        syncStatus: 'pending',
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Google Business Profile configured successfully using existing credentials!',
      account: {
        id: gbpAccount.id,
        accountName: gbpAccount.accountName,
        locationName: gbpAccount.locationName,
      },
      nextSteps: [
        'Update your GBP Account ID (currently: accounts/CONFIGURE_ME)',
        'Update your Location ID (currently: locations/CONFIGURE_ME)',
        'Go to Analytics Settings > Google Business Profile to edit',
      ]
    });

  } catch (error) {
    console.error('Auto-setup error:', error);
    return NextResponse.json(
      {
        error: 'Failed to auto-setup Google Business Profile',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
