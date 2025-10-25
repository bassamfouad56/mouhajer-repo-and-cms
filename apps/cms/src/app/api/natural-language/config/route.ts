import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createNaturalLanguageService } from '@/lib/google-natural-language';

// GET config
export async function GET() {
  try {
    const config = await prisma.nLConfig.findFirst({
      where: { name: 'default' },
      select: {
        id: true,
        name: true,
        clientEmail: true,
        autoAnalyzeReviews: true,
        autoAnalyzeContent: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      config: config || null,
    });
  } catch (error) {
    console.error('[Natural Language] Failed to fetch config:', error);

    return NextResponse.json(
      {
        error: 'Failed to fetch config',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// POST save config
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { clientEmail, privateKey, autoAnalyzeReviews, autoAnalyzeContent } = body;

    if (!clientEmail || !privateKey) {
      return NextResponse.json(
        { error: 'Client email and private key are required' },
        { status: 400 }
      );
    }

    console.log('[Natural Language] Saving config and testing connection...');

    // Test connection before saving
    const service = await createNaturalLanguageService(clientEmail, privateKey);
    const isConnected = await service.testConnection();

    if (!isConnected) {
      return NextResponse.json(
        { error: 'Connection test failed. Please check your credentials.' },
        { status: 400 }
      );
    }

    // Save or update config
    const config = await prisma.nLConfig.upsert({
      where: { name: 'default' },
      update: {
        clientEmail,
        privateKey,
        autoAnalyzeReviews: autoAnalyzeReviews || false,
        autoAnalyzeContent: autoAnalyzeContent || false,
        isActive: true,
      },
      create: {
        name: 'default',
        clientEmail,
        privateKey,
        autoAnalyzeReviews: autoAnalyzeReviews || false,
        autoAnalyzeContent: autoAnalyzeContent || false,
        isActive: true,
      },
    });

    console.log('[Natural Language] Config saved successfully');

    return NextResponse.json({
      success: true,
      message: 'Configuration saved successfully',
      config: {
        id: config.id,
        name: config.name,
        clientEmail: config.clientEmail,
        autoAnalyzeReviews: config.autoAnalyzeReviews,
        autoAnalyzeContent: config.autoAnalyzeContent,
      },
    });
  } catch (error) {
    console.error('[Natural Language] Failed to save config:', error);

    return NextResponse.json(
      {
        error: 'Failed to save config',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
