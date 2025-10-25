import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { GoogleAnalyticsService } from '@/lib/google-analytics';

// GET all GA4 properties
export async function GET() {
  try {
    const properties = await prisma.googleAnalyticsProperty.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        propertyName: true,
        propertyId: true,
        measurementId: true,
        isActive: true,
        lastSyncAt: true,
        syncStatus: true,
        syncErrorMessage: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(properties);
  } catch (error) {
    console.error('Error fetching GA4 properties:', error);
    return NextResponse.json({ error: 'Failed to fetch properties' }, { status: 500 });
  }
}

// POST create new GA4 property
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { propertyName, propertyId, measurementId, clientEmail, privateKey, projectId } = body;

    // Validate required fields
    if (!propertyName || !propertyId || !clientEmail || !privateKey || !projectId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if property already exists
    const existingProperty = await prisma.googleAnalyticsProperty.findUnique({
      where: { propertyId },
    });

    if (existingProperty) {
      return NextResponse.json(
        {
          error: 'Property already exists',
          details: `A property with Property ID "${propertyId}" is already configured in your database.`,
          existingProperty: {
            id: existingProperty.id,
            name: existingProperty.propertyName,
            createdAt: existingProperty.createdAt,
          }
        },
        { status: 409 }
      );
    }

    // Test connection before saving
    const service = new GoogleAnalyticsService(
      {
        clientEmail,
        privateKey,
        projectId,
      },
      propertyId
    );

    const isValid = await service.verifyConnection();
    if (!isValid) {
      return NextResponse.json(
        { error: 'Failed to verify GA4 connection. Please check your credentials.' },
        { status: 400 }
      );
    }

    // Create property in database
    const property = await prisma.googleAnalyticsProperty.create({
      data: {
        propertyName,
        propertyId,
        measurementId,
        clientEmail,
        privateKey,
        projectId,
        isActive: true,
        syncStatus: 'pending',
      },
    });

    return NextResponse.json(property, { status: 201 });
  } catch (error) {
    console.error('Error creating GA4 property:', error);

    // Provide detailed error information
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorDetails: any = {
      error: 'Failed to create property',
      details: errorMessage,
    };

    // Check for Prisma-specific errors
    if (error && typeof error === 'object' && 'code' in error) {
      const prismaError = error as any;

      // P2002 is Prisma's unique constraint violation code
      if (prismaError.code === 'P2002') {
        errorDetails.error = 'Property already exists';
        errorDetails.details = 'This Property ID is already in use. Please use a different Property ID.';
        return NextResponse.json(errorDetails, { status: 409 });
      }

      // P2003 is foreign key constraint violation
      if (prismaError.code === 'P2003') {
        errorDetails.error = 'Database constraint violation';
        errorDetails.details = 'Foreign key constraint failed. Please check your data.';
      }

      // Add Prisma error code to details for debugging
      errorDetails.prismaCode = prismaError.code;
    }

    // In development, include full error stack
    if (process.env.NODE_ENV === 'development') {
      errorDetails.stack = error instanceof Error ? error.stack : undefined;
    }

    return NextResponse.json(errorDetails, { status: 500 });
  }
}

// PATCH update GA4 property
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, propertyName, measurementId, clientEmail, privateKey, projectId, isActive } = body;

    if (!id) {
      return NextResponse.json({ error: 'Property ID is required' }, { status: 400 });
    }

    const updateData: any = {};
    if (propertyName !== undefined) updateData.propertyName = propertyName;
    if (measurementId !== undefined) updateData.measurementId = measurementId;
    if (clientEmail !== undefined) updateData.clientEmail = clientEmail;
    if (privateKey !== undefined) updateData.privateKey = privateKey;
    if (projectId !== undefined) updateData.projectId = projectId;
    if (isActive !== undefined) updateData.isActive = isActive;

    const property = await prisma.googleAnalyticsProperty.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(property);
  } catch (error) {
    console.error('Error updating GA4 property:', error);
    return NextResponse.json({ error: 'Failed to update property' }, { status: 500 });
  }
}

// DELETE GA4 property
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Property ID is required' }, { status: 400 });
    }

    await prisma.googleAnalyticsProperty.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting GA4 property:', error);
    return NextResponse.json({ error: 'Failed to delete property' }, { status: 500 });
  }
}
