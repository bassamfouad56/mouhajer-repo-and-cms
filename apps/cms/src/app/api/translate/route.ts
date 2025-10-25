import { NextRequest, NextResponse } from 'next/server';
import { translateToArabic, translateToEnglish } from '@/lib/google-translate';

/**
 * POST /api/translate
 * Translate text between English and Arabic
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, targetLanguage } = body;

    if (!text) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }

    if (!targetLanguage || !['ar', 'en'].includes(targetLanguage)) {
      return NextResponse.json(
        { error: 'Target language must be "ar" or "en"' },
        { status: 400 }
      );
    }

    // Translate
    const translatedText = targetLanguage === 'ar'
      ? await translateToArabic(text)
      : await translateToEnglish(text);

    return NextResponse.json({
      originalText: text,
      translatedText,
      targetLanguage,
    });
  } catch (error) {
    console.error('Translation API error:', error);
    return NextResponse.json(
      { error: 'Translation failed' },
      { status: 500 }
    );
  }
}
