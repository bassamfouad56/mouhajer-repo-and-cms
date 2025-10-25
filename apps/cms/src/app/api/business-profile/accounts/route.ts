import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { GoogleBusinessProfileService } from '@/lib/google-business-profile';

// GET all Business Profile accounts
export async function GET() {
  try {
    const accounts = await prisma.googleBusinessProfileAccount.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        accountName: true,
        gbpAccountId: true,
        locationId: true,
        locationName: true,
        address: true,
        phoneNumber: true,
        websiteUrl: true,
        isActive: true,
        lastSyncAt: true,
        syncStatus: true,
        syncErrorMessage: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(accounts);
  } catch (error) {
    console.error('Error fetching Business Profile accounts:', error);
    return NextResponse.json({ error: 'Failed to fetch accounts' }, { status: 500 });
  }
}

// POST create new Business Profile account
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      accountName,
      gbpAccountId,
      locationId,
      clientEmail,
      privateKey,
    } = body;

    // Validate required fields
    if (!accountName || !gbpAccountId || !locationId || !clientEmail || !privateKey) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if account already exists
    const existingAccount = await prisma.googleBusinessProfileAccount.findUnique({
      where: { gbpAccountId },
    });

    if (existingAccount) {
      return NextResponse.json(
        {
          error: 'Account already exists',
          details: `A Business Profile account with ID "${gbpAccountId}" is already configured.`,
        },
        { status: 409 }
      );
    }

    // Test connection before saving
    const service = new GoogleBusinessProfileService(
      {
        clientEmail,
        privateKey,
      },
      gbpAccountId,
      locationId
    );

    const isValid = await service.verifyConnection();
    if (!isValid) {
      return NextResponse.json(
        { error: 'Failed to verify Business Profile connection. Please check your credentials.' },
        { status: 400 }
      );
    }

    // Get location details
    const locationDetails = await service.getLocationDetails();

    // Create account in database
    const account = await prisma.googleBusinessProfileAccount.create({
      data: {
        accountName,
        gbpAccountId,
        locationId,
        locationName: locationDetails?.locationName,
        address: locationDetails?.address,
        phoneNumber: locationDetails?.phoneNumber,
        websiteUrl: locationDetails?.websiteUrl,
        clientEmail,
        privateKey,
        isActive: true,
        syncStatus: 'pending',
      },
    });

    return NextResponse.json(account, { status: 201 });
  } catch (error) {
    console.error('Error creating Business Profile account:', error);

    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      {
        error: 'Failed to create account',
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}

// DELETE Business Profile account
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Account ID is required' }, { status: 400 });
    }

    await prisma.googleBusinessProfileAccount.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting Business Profile account:', error);
    return NextResponse.json({ error: 'Failed to delete account' }, { status: 500 });
  }
}
