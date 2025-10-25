/**
 * Translation API Integration
 * Uses Groq AI for fast, accurate translations
 */

import Groq from 'groq-sdk';

/**
 * Translate text using Groq AI
 */
export async function translateText(
  text: string,
  targetLanguage: string,
  sourceLanguage?: string
): Promise<string> {
  try {
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      console.warn('GROQ_API_KEY not configured, returning original text');
      return text;
    }

    const groq = new Groq({ apiKey });

    const languageName = targetLanguage === 'ar' ? 'Arabic' : 'English';
    const sourceLangName = sourceLanguage === 'en' ? 'English' : sourceLanguage === 'ar' ? 'Arabic' : '';

    // Context-aware prompt for website/UI translations
    const prompt = sourceLangName
      ? `You are translating website navigation and page titles. Use standard website terminology (not literal translations).

Examples of proper website terminology:
- "Home" → "الرئيسية" (NOT "المنزل")
- "About Us" → "من نحن" (NOT "حولنا")
- "Contact" → "اتصل بنا"
- "Services" → "خدماتنا"
- "Portfolio" → "أعمالنا"
- "Testimonials" → "آراء العملاء"

Translate this ${sourceLangName} website text to ${languageName} using proper web conventions. Only return the translation:\n\n${text}`
      : `You are translating website navigation and page titles. Use standard website terminology (not literal translations).

Translate this website text to ${languageName} using proper web conventions. Only return the translation:\n\n${text}`;

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      model: 'llama-3.1-8b-instant', // Fast, efficient model
      temperature: 0.3, // Low temperature for consistent translations
      max_tokens: 500,
    });

    const translation = completion.choices[0]?.message?.content?.trim();

    if (!translation) {
      throw new Error('No translation returned from Groq');
    }

    return translation;
  } catch (error) {
    console.error('Translation error:', error);
    return text; // Return original text on error
  }
}

/**
 * Translate English to Arabic
 */
export async function translateToArabic(text: string): Promise<string> {
  return translateText(text, 'ar', 'en');
}

/**
 * Translate Arabic to English
 */
export async function translateToEnglish(text: string): Promise<string> {
  return translateText(text, 'en', 'ar');
}

/**
 * Detect language of text
 */
export async function detectLanguage(text: string): Promise<string> {
  try {
    const translate = getTranslateClient();

    if (!translate) {
      return 'unknown';
    }

    const response = await translate.translations.list({
      q: text,
      target: 'en', // Target doesn't matter for detection
    });

    return response.data.translations?.[0]?.detectedSourceLanguage || 'unknown';
  } catch (error) {
    console.error('Language detection error:', error);
    return 'unknown';
  }
}
