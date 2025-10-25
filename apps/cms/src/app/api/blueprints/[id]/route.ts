import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/blueprints/[id] - Get single blueprint
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const blueprint = await prisma.contentBlueprint.findUnique({
      where: { id: params.id },
    });

    if (!blueprint) {
      return NextResponse.json(
        { error: 'Blueprint not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(blueprint);
  } catch (error) {
    console.error('Error fetching blueprint:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blueprint' },
      { status: 500 }
    );
  }
}

// PUT /api/blueprints/[id] - Update blueprint
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const {
      name,
      displayName,
      description,
      blueprintType,
      allowMultiple,
      icon,
      category,
      fields,
    } = body;

    // Check if blueprint exists
    const existing = await prisma.contentBlueprint.findUnique({
      where: { id: params.id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Blueprint not found' },
        { status: 404 }
      );
    }

    // Prevent editing system blueprints
    if (existing.isSystem) {
      return NextResponse.json(
        { error: 'Cannot edit system blueprints' },
        { status: 403 }
      );
    }

    // Check if new name conflicts with another blueprint
    if (name && name !== existing.name) {
      const nameConflict = await prisma.contentBlueprint.findUnique({
        where: { name },
      });

      if (nameConflict) {
        return NextResponse.json(
          { error: 'Blueprint with this name already exists' },
          { status: 409 }
        );
      }
    }

    // Update blueprint
    const blueprint = await prisma.contentBlueprint.update({
      where: { id: params.id },
      data: {
        ...(name && { name }),
        ...(displayName && { displayName }),
        ...(description !== undefined && { description }),
        ...(blueprintType && { blueprintType }),
        ...(allowMultiple !== undefined && { allowMultiple }),
        ...(icon && { icon }),
        ...(category && { category }),
        ...(fields && { fields }),
      },
    });

    return NextResponse.json(blueprint);
  } catch (error) {
    console.error('Error updating blueprint:', error);
    return NextResponse.json(
      { error: 'Failed to update blueprint' },
      { status: 500 }
    );
  }
}

// DELETE /api/blueprints/[id] - Delete blueprint
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if blueprint exists
    const existing = await prisma.contentBlueprint.findUnique({
      where: { id: params.id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Blueprint not found' },
        { status: 404 }
      );
    }

    // Prevent deleting system blueprints
    if (existing.isSystem) {
      return NextResponse.json(
        { error: 'Cannot delete system blueprints' },
        { status: 403 }
      );
    }

    // Check if there are any instances of this blueprint
    const instanceCount = await prisma.blueprintInstance.count({
      where: { blueprintId: params.id },
    });

    if (instanceCount > 0) {
      return NextResponse.json(
        {
          error: `Cannot delete blueprint: ${instanceCount} instance(s) exist. Delete all instances first.`,
        },
        { status: 409 }
      );
    }

    // Delete blueprint
    await prisma.contentBlueprint.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting blueprint:', error);
    return NextResponse.json(
      { error: 'Failed to delete blueprint' },
      { status: 500 }
    );
  }
}
