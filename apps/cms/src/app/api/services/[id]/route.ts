import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const service = await prisma.service.findUnique({
      where: { id },
    });

    if (!service) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      );
    }

    // Transform to match expected format
    const transformedService = {
      id: service.id,
      title: {
        en: service.titleEn,
        ar: service.titleAr,
      },
      description: {
        en: service.descriptionEn,
        ar: service.descriptionAr,
      },
      shortDescription: {
        en: service.shortDescriptionEn,
        ar: service.shortDescriptionAr,
      },
      icon: service.icon,
      features: {
        en: service.featuresEn,
        ar: service.featuresAr,
      },
      price: service.price,
      duration: service.duration,
      featured: service.featured,
      status: service.status,
      createdAt: service.createdAt.toISOString(),
      updatedAt: service.updatedAt.toISOString(),
    };

    return NextResponse.json(transformedService);
  } catch (error) {
    console.error('Error fetching service:', error);
    return NextResponse.json(
      { error: 'Failed to fetch service' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    const updateData: any = {};
    if (body.title?.en) updateData.titleEn = body.title.en;
    if (body.title?.ar) updateData.titleAr = body.title.ar;
    if (body.description?.en) updateData.descriptionEn = body.description.en;
    if (body.description?.ar) updateData.descriptionAr = body.description.ar;
    if (body.shortDescription?.en) updateData.shortDescriptionEn = body.shortDescription.en;
    if (body.shortDescription?.ar) updateData.shortDescriptionAr = body.shortDescription.ar;
    if (body.icon !== undefined) updateData.icon = body.icon;
    if (body.features?.en) updateData.featuresEn = body.features.en;
    if (body.features?.ar) updateData.featuresAr = body.features.ar;
    if (body.price !== undefined) updateData.price = body.price;
    if (body.duration !== undefined) updateData.duration = body.duration;
    if (body.featured !== undefined) updateData.featured = body.featured;
    if (body.status) updateData.status = body.status;

    const updatedService = await prisma.service.update({
      where: { id },
      data: updateData,
    });

    // Transform to match expected format
    const transformedService = {
      id: updatedService.id,
      title: {
        en: updatedService.titleEn,
        ar: updatedService.titleAr,
      },
      description: {
        en: updatedService.descriptionEn,
        ar: updatedService.descriptionAr,
      },
      shortDescription: {
        en: updatedService.shortDescriptionEn,
        ar: updatedService.shortDescriptionAr,
      },
      icon: updatedService.icon,
      features: {
        en: updatedService.featuresEn,
        ar: updatedService.featuresAr,
      },
      price: updatedService.price,
      duration: updatedService.duration,
      featured: updatedService.featured,
      status: updatedService.status,
      createdAt: updatedService.createdAt.toISOString(),
      updatedAt: updatedService.updatedAt.toISOString(),
    };

    return NextResponse.json(transformedService);
  } catch (error) {
    if (error instanceof Error && error.message.includes('Record to update not found')) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      );
    }
    console.error('Error updating service:', error);
    return NextResponse.json(
      { error: 'Failed to update service' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    const { id } = await params;
    await prisma.service.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Service deleted successfully' });
  } catch (error) {
    if (error instanceof Error && error.message.includes('Record to delete does not exist')) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      );
    }
    console.error('Error deleting service:', error);
    return NextResponse.json(
      { error: 'Failed to delete service' },
      { status: 500 }
    );
  }
}
