import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { translateText, translateBatch } from '@/lib/translator';

/**
 * POST /api/translate - Translate text using Groq LLM
 *
 * Request body:
 * {
 *   text: string;
 *   sourceLanguage?: 'en' | 'ar';
 *   targetLanguage: 'en' | 'ar';
 *   contentType?: 'title' | 'description' | 'content' | 'alt' | 'general';
 *   context?: string;
 * }
 *
 * OR for batch translation:
 * {
 *   batch: Array<{ text: string; field: string; contentType?: string }>;
 *   sourceLanguage: 'en' | 'ar';
 *   targetLanguage: 'en' | 'ar';
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized - Please log in' },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Check for batch translation
    if (body.batch && Array.isArray(body.batch)) {
      const { batch, sourceLanguage, targetLanguage } = body;

      if (!sourceLanguage || !targetLanguage) {
        return NextResponse.json(
          { error: 'Source and target languages are required for batch translation' },
          { status: 400 }
        );
      }

      const results = await translateBatch(batch, sourceLanguage, targetLanguage);

      return NextResponse.json({
        success: true,
        translations: results,
        count: Object.keys(results).length,
      });
    }

    // Single translation
    const {
      text,
      sourceLanguage = 'en',
      targetLanguage,
      contentType,
      context,
    } = body;

    // Validate required fields
    if (!text || !targetLanguage) {
      return NextResponse.json(
        { error: 'Text and target language are required' },
        { status: 400 }
      );
    }

    if (!['en', 'ar'].includes(targetLanguage)) {
      return NextResponse.json(
        { error: 'Target language must be "en" or "ar"' },
        { status: 400 }
      );
    }

    // Perform translation
    const result = await translateText({
      text,
      sourceLanguage,
      targetLanguage,
      contentType,
      context,
    });

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error('Translation API error:', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Translation failed',
      },
      { status: 500 }
    );
  }
}
