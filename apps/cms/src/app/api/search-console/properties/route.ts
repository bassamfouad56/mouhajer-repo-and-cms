import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { GoogleSearchConsoleService } from '@/lib/google-search-console';


// GET all Search Console properties
export async function GET() {
  try {
    const properties = await prisma.googleSearchConsoleProperty.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        propertyName: true,
        siteUrl: true,
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
    console.error('Error fetching Search Console properties:', error);
    return NextResponse.json({ error: 'Failed to fetch properties' }, { status: 500 });
  }
}

// POST create new Search Console property
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { propertyName, siteUrl, clientEmail, privateKey, projectId } = body;

    // Validate required fields
    if (!propertyName || !siteUrl || !clientEmail || !privateKey || !projectId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Test connection before saving
    const service = new GoogleSearchConsoleService(
      {
        clientEmail,
        privateKey,
      },
      siteUrl
    );

    const isValid = await service.verifyConnection();
    if (!isValid) {
      return NextResponse.json(
        { error: 'Failed to verify Search Console connection. Please check your credentials.' },
        { status: 400 }
      );
    }

    // Create property in database
    const property = await prisma.googleSearchConsoleProperty.create({
      data: {
        propertyName,
        siteUrl,
        clientEmail,
        privateKey,
        projectId,
        isActive: true,
        syncStatus: 'pending',
      },
    });

    return NextResponse.json(property, { status: 201 });
  } catch (error) {
    console.error('Error creating Search Console property:', error);
    return NextResponse.json({ error: 'Failed to create property' }, { status: 500 });
  }
}

// PATCH update Search Console property
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, propertyName, clientEmail, privateKey, projectId, isActive } = body;

    if (!id) {
      return NextResponse.json({ error: 'Property ID is required' }, { status: 400 });
    }

    const updateData: any = {};
    if (propertyName !== undefined) updateData.propertyName = propertyName;
    if (clientEmail !== undefined) updateData.clientEmail = clientEmail;
    if (privateKey !== undefined) updateData.privateKey = privateKey;
    if (projectId !== undefined) updateData.projectId = projectId;
    if (isActive !== undefined) updateData.isActive = isActive;

    const property = await prisma.googleSearchConsoleProperty.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(property);
  } catch (error) {
    console.error('Error updating Search Console property:', error);
    return NextResponse.json({ error: 'Failed to update property' }, { status: 500 });
  }
}

// DELETE Search Console property
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Property ID is required' }, { status: 400 });
    }

    await prisma.googleSearchConsoleProperty.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting Search Console property:', error);
    return NextResponse.json({ error: 'Failed to delete property' }, { status: 500 });
  }
}
