import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * Auto-setup Google Search Console using existing GA4 credentials
 * POST /api/search-console/auto-setup
 */
export async function POST() {
  try {
    // 1. Check if GSC property already exists
    const existingProperty = await prisma.googleSearchConsoleProperty.findFirst();

    if (existingProperty) {
      return NextResponse.json(
        { error: 'Google Search Console property already configured' },
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

    // 3. Create GSC property using the same credentials
    const gscProperty = await prisma.googleSearchConsoleProperty.create({
      data: {
        propertyName: 'Mouhajer Website',
        siteUrl: 'https://mouhajer.com', // User should update if different
        clientEmail: ga4Account.clientEmail,
        privateKey: ga4Account.privateKey,
        projectId: ga4Account.projectId,
        isActive: true,
        syncStatus: 'pending',
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Google Search Console configured successfully using existing credentials!',
      property: {
        id: gscProperty.id,
        propertyName: gscProperty.propertyName,
        siteUrl: gscProperty.siteUrl,
      },
      nextSteps: [
        'Verify the Site URL matches your verified property in Search Console',
        'Go to Analytics Settings > Search Console to edit if needed',
        'Make sure the service account has access to your Search Console property',
      ]
    });

  } catch (error) {
    console.error('Auto-setup error:', error);
    return NextResponse.json(
      {
        error: 'Failed to auto-setup Google Search Console',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
