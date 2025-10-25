import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createNaturalLanguageService } from '@/lib/google-natural-language';

// POST analyze text sentiment and entities
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, sourceType, sourceId, saveToDatabase = true } = body;

    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }

    console.log(`[Natural Language] Analyzing ${sourceType || 'text'} (${text.length} chars)`);

    // Get credentials from config or environment
    const config = await prisma.nLConfig.findFirst({
      where: { name: 'default' },
    });

    const clientEmail = config?.clientEmail || process.env.GOOGLE_NL_CLIENT_EMAIL;
    const privateKey = config?.privateKey || process.env.GOOGLE_NL_PRIVATE_KEY;

    if (!clientEmail || !privateKey) {
      return NextResponse.json(
        { error: 'Natural Language API not configured' },
        { status: 500 }
      );
    }

    // Analyze content
    const service = await createNaturalLanguageService(clientEmail, privateKey);
    const analysis = await service.analyzeContent(text);

    // Save to database if requested
    let savedAnalysis = null;
    if (saveToDatabase) {
      savedAnalysis = await prisma.nLAnalysis.create({
        data: {
          sourceType: sourceType || 'custom',
          sourceId: sourceId || null,
          text,
          sentimentScore: analysis.sentiment.score,
          sentimentMagnitude: analysis.sentiment.magnitude,
          sentimentLabel: analysis.sentiment.label,
          entities: analysis.entities as any,
          keywords: analysis.keywords,
          categories: analysis.categories as any,
          language: analysis.language,
        },
      });
    }

    console.log(`[Natural Language] Analysis complete: ${analysis.sentiment.label}`);

    return NextResponse.json({
      success: true,
      analysis: {
        sentiment: analysis.sentiment,
        entities: analysis.entities,
        keywords: analysis.keywords,
        categories: analysis.categories,
        language: analysis.language,
      },
      saved: savedAnalysis ? { id: savedAnalysis.id } : null,
    });
  } catch (error) {
    console.error('[Natural Language] Analysis failed:', error);

    return NextResponse.json(
      {
        error: 'Analysis failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
