import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// POST /api/blueprints/[id]/duplicate - Duplicate blueprint
export async function POST(
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

    // Generate unique name for duplicate
    let duplicateName = `${existing.name}Copy`;
    let duplicateDisplayName = `${existing.displayName} (Copy)`;
    let counter = 1;

    // Check if name already exists, increment counter if needed
    while (await prisma.contentBlueprint.findUnique({ where: { name: duplicateName } })) {
      counter++;
      duplicateName = `${existing.name}Copy${counter}`;
      duplicateDisplayName = `${existing.displayName} (Copy ${counter})`;
    }

    // Create duplicate blueprint
    const duplicate = await prisma.contentBlueprint.create({
      data: {
        name: duplicateName,
        displayName: duplicateDisplayName,
        description: existing.description,
        blueprintType: existing.blueprintType,
        allowMultiple: existing.allowMultiple,
        isSystem: false, // Duplicates are never system blueprints
        icon: existing.icon,
        category: existing.category,
        fields: existing.fields,
        thumbnailUrl: existing.thumbnailUrl,
        previewData: existing.previewData,
        previewTemplate: existing.previewTemplate,
      },
    });

    return NextResponse.json(duplicate, { status: 201 });
  } catch (error) {
    console.error('Error duplicating blueprint:', error);
    return NextResponse.json(
      { error: 'Failed to duplicate blueprint' },
      { status: 500 }
    );
  }
}
