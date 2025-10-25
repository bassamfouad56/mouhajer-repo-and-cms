import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createNaturalLanguageService } from '@/lib/google-natural-language';

// POST batch analyze multiple texts
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { texts, sourceType, saveToDatabase = true } = body;

    if (!texts || !Array.isArray(texts) || texts.length === 0) {
      return NextResponse.json(
        { error: 'Array of texts is required' },
        { status: 400 }
      );
    }

    if (texts.length > 100) {
      return NextResponse.json(
        { error: 'Maximum 100 texts per batch' },
        { status: 400 }
      );
    }

    console.log(`[Natural Language] Batch analyzing ${texts.length} texts`);

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

    // Analyze all texts
    const service = await createNaturalLanguageService(clientEmail, privateKey);
    const results = [];

    for (let i = 0; i < texts.length; i++) {
      const text = texts[i];

      if (!text || text.trim().length === 0) {
        results.push({ error: 'Empty text', index: i });
        continue;
      }

      try {
        const analysis = await service.analyzeContent(text);

        // Save to database if requested
        let savedAnalysis = null;
        if (saveToDatabase) {
          savedAnalysis = await prisma.nLAnalysis.create({
            data: {
              sourceType: sourceType || 'batch',
              sourceId: null,
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

        results.push({
          index: i,
          sentiment: analysis.sentiment,
          keywords: analysis.keywords,
          saved: savedAnalysis ? { id: savedAnalysis.id } : null,
        });
      } catch (error) {
        console.error(`[Natural Language] Failed to analyze text ${i}:`, error);
        results.push({
          index: i,
          error: error instanceof Error ? error.message : 'Analysis failed',
        });
      }
    }

    const successCount = results.filter((r) => !r.error).length;
    const errorCount = results.filter((r) => r.error).length;

    console.log(`[Natural Language] Batch complete: ${successCount} success, ${errorCount} errors`);

    return NextResponse.json({
      success: true,
      results,
      summary: {
        total: texts.length,
        successful: successCount,
        failed: errorCount,
      },
    });
  } catch (error) {
    console.error('[Natural Language] Batch analysis failed:', error);

    return NextResponse.json(
      {
        error: 'Batch analysis failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
