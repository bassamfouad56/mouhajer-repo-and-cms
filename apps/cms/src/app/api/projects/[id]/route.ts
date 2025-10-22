import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const project = await prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // Transform to match expected format
    const transformedProject = {
      id: project.id,
      title: {
        en: project.titleEn,
        ar: project.titleAr,
      },
      description: {
        en: project.descriptionEn,
        ar: project.descriptionAr,
      },
      images: project.images,
      category: project.category,
      featured: project.featured,
      status: project.status,
      createdAt: project.createdAt.toISOString(),
      updatedAt: project.updatedAt.toISOString(),
    };

    return NextResponse.json(transformedProject);
  } catch (error) {
    console.error('Error fetching project:', error);
    return NextResponse.json(
      { error: 'Failed to fetch project' },
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
    if (body.images !== undefined) updateData.images = body.images;
    if (body.category) updateData.category = body.category;
    if (body.featured !== undefined) updateData.featured = body.featured;
    if (body.status) updateData.status = body.status;

    const updatedProject = await prisma.project.update({
      where: { id },
      data: updateData,
    });

    // Transform to match expected format
    const transformedProject = {
      id: updatedProject.id,
      title: {
        en: updatedProject.titleEn,
        ar: updatedProject.titleAr,
      },
      description: {
        en: updatedProject.descriptionEn,
        ar: updatedProject.descriptionAr,
      },
      images: updatedProject.images,
      category: updatedProject.category,
      featured: updatedProject.featured,
      status: updatedProject.status,
      createdAt: updatedProject.createdAt.toISOString(),
      updatedAt: updatedProject.updatedAt.toISOString(),
    };

    return NextResponse.json(transformedProject);
  } catch (error) {
    if (error instanceof Error && error.message.includes('Record to update not found')) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }
    console.error('Error updating project:', error);
    return NextResponse.json(
      { error: 'Failed to update project' },
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
    await prisma.project.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Project deleted successfully' });
  } catch (error) {
    if (error instanceof Error && error.message.includes('Record to delete does not exist')) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }
    console.error('Error deleting project:', error);
    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    );
  }
}
