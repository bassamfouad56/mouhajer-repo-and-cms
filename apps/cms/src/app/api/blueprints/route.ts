import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/blueprints - List all blueprints
export async function GET(request: NextRequest) {
  try {
    const blueprints = await prisma.contentBlueprint.findMany({
      orderBy: [
        { isSystem: 'desc' }, // System blueprints first
        { category: 'asc' },
        { displayName: 'asc' },
      ],
    });

    return NextResponse.json(blueprints);
  } catch (error) {
    console.error('Error fetching blueprints:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blueprints' },
      { status: 500 }
    );
  }
}

// POST /api/blueprints - Create new blueprint
export async function POST(request: NextRequest) {
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

    // Validate required fields
    if (!name || !displayName || !blueprintType) {
      return NextResponse.json(
        { error: 'Missing required fields: name, displayName, blueprintType' },
        { status: 400 }
      );
    }

    // Check if blueprint with same name already exists
    const existing = await prisma.contentBlueprint.findUnique({
      where: { name },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Blueprint with this name already exists' },
        { status: 409 }
      );
    }

    // Create blueprint
    const blueprint = await prisma.contentBlueprint.create({
      data: {
        name,
        displayName,
        description: description || '',
        blueprintType,
        allowMultiple: allowMultiple !== false, // Default to true
        isSystem: false, // User-created blueprints are never system
        icon: icon || 'file-text',
        category: category || 'general',
        fields: fields || [],
      },
    });

    return NextResponse.json(blueprint, { status: 201 });
  } catch (error) {
    console.error('Error creating blueprint:', error);
    return NextResponse.json(
      { error: 'Failed to create blueprint' },
      { status: 500 }
    );
  }
}
