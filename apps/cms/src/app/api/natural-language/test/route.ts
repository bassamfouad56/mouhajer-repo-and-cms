import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createNaturalLanguageService } from '@/lib/google-natural-language';

// POST test connection
export async function POST(request: NextRequest) {
  try {
    console.log('[Natural Language] Testing API connection...');

    // Get credentials from config or environment
    const config = await prisma.nLConfig.findFirst({
      where: { name: 'default' },
    });

    const clientEmail = config?.clientEmail || process.env.GOOGLE_NL_CLIENT_EMAIL;
    const privateKey = config?.privateKey || process.env.GOOGLE_NL_PRIVATE_KEY;

    if (!clientEmail || !privateKey) {
      return NextResponse.json(
        {
          success: false,
          error: 'Natural Language API credentials not configured',
          message: 'Please configure credentials in settings or environment variables',
        },
        { status: 400 }
      );
    }

    // Test connection
    const service = await createNaturalLanguageService(clientEmail, privateKey);
    const isConnected = await service.testConnection();

    if (!isConnected) {
      return NextResponse.json(
        {
          success: false,
          error: 'Connection test failed',
          message: 'Could not connect to Natural Language API. Please check your credentials.',
        },
        { status: 500 }
      );
    }

    // Perform a sample analysis to verify full functionality
    const sampleAnalysis = await service.analyzeSentiment(
      'This is a wonderful integration that makes sentiment analysis easy!'
    );

    console.log('[Natural Language] Connection test successful');

    return NextResponse.json({
      success: true,
      message: 'Natural Language API connection successful',
      sampleAnalysis: {
        score: sampleAnalysis.score,
        magnitude: sampleAnalysis.magnitude,
        label: sampleAnalysis.label,
      },
    });
  } catch (error) {
    console.error('[Natural Language] Connection test failed:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Connection test failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
