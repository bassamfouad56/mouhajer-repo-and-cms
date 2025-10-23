import Groq from 'groq-sdk';

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || '',
});

export interface TranslationOptions {
  text: string;
  sourceLanguage?: 'en' | 'ar';
  targetLanguage: 'en' | 'ar';
  context?: string; // Optional context for better translations
  contentType?: 'title' | 'description' | 'content' | 'alt' | 'general';
}

export interface TranslationResult {
  translatedText: string;
  originalText: string;
  sourceLanguage: string;
  targetLanguage: string;
  model: string;
  tokensUsed?: number;
}

/**
 * Translate text using Groq's Llama 3.1 model
 * Provides high-quality, humanized translations
 */
export async function translateText(
  options: TranslationOptions
): Promise<TranslationResult> {
  const {
    text,
    sourceLanguage = 'en',
    targetLanguage,
    context,
    contentType = 'general',
  } = options;

  if (!text || text.trim().length === 0) {
    throw new Error('Text is required for translation');
  }

  if (!process.env.GROQ_API_KEY) {
    throw new Error('GROQ_API_KEY is not configured');
  }

  // Build context-aware prompt based on content type
  const contentTypeInstructions = {
    title: 'This is a title or heading. Keep it concise, impactful, and professional.',
    description: 'This is a description or summary. Maintain clarity and persuasiveness.',
    content: 'This is main content. Preserve the tone, style, and all formatting.',
    alt: 'This is image alt text. Be descriptive and accessible.',
    general: 'Translate naturally while preserving meaning and tone.',
  };

  const instruction = contentTypeInstructions[contentType];

  const systemPrompt = `You are a professional translator specializing in ${
    targetLanguage === 'ar' ? 'English to Arabic' : 'Arabic to English'
  } translation. You produce natural, culturally-appropriate translations that sound native, not machine-translated.

Rules:
1. Translate the text naturally and fluently
2. Preserve the original meaning and intent
3. Use appropriate cultural context for ${targetLanguage === 'ar' ? 'Arabic' : 'English'} speakers
4. Maintain any technical terms or brand names appropriately
5. Keep HTML tags, markdown formatting, or special characters intact
6. ${instruction}
${context ? `7. Context: ${context}` : ''}

Return ONLY the translated text, nothing else.`;

  const userPrompt = `Translate this ${sourceLanguage === 'en' ? 'English' : 'Arabic'} text to ${
    targetLanguage === 'ar' ? 'Arabic' : 'English'
  }:

${text}`;

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: userPrompt,
        },
      ],
      model: 'llama-3.1-8b-instant', // Fast and free tier friendly
      temperature: 0.3, // Lower temperature for more consistent translations
      max_tokens: 2048,
      top_p: 1,
      stream: false,
    });

    const translatedText = completion.choices[0]?.message?.content?.trim() || '';

    if (!translatedText) {
      throw new Error('Translation returned empty result');
    }

    return {
      translatedText,
      originalText: text,
      sourceLanguage,
      targetLanguage,
      model: 'llama-3.1-8b-instant',
      tokensUsed: completion.usage?.total_tokens,
    };
  } catch (error) {
    console.error('Translation error:', error);
    throw new Error(
      `Translation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Batch translate multiple texts
 */
export async function translateBatch(
  texts: Array<{ text: string; field: string; contentType?: TranslationOptions['contentType'] }>,
  sourceLanguage: 'en' | 'ar',
  targetLanguage: 'en' | 'ar'
): Promise<Record<string, string>> {
  const results: Record<string, string> = {};

  // Process in parallel but with rate limiting
  const chunks = chunkArray(texts, 3); // Process 3 at a time to respect rate limits

  for (const chunk of chunks) {
    const translations = await Promise.all(
      chunk.map(async (item) => {
        try {
          const result = await translateText({
            text: item.text,
            sourceLanguage,
            targetLanguage,
            contentType: item.contentType,
          });
          return { field: item.field, translation: result.translatedText };
        } catch (error) {
          console.error(`Translation failed for field ${item.field}:`, error);
          return { field: item.field, translation: '' };
        }
      })
    );

    translations.forEach(({ field, translation }) => {
      results[field] = translation;
    });
  }

  return results;
}

/**
 * Helper function to chunk array
 */
function chunkArray<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

/**
 * Validate translation quality (basic checks)
 */
export function validateTranslation(
  original: string,
  translated: string,
  targetLanguage: 'en' | 'ar'
): { isValid: boolean; issues: string[] } {
  const issues: string[] = [];

  // Check if translation is too short compared to original
  if (translated.length < original.length * 0.3) {
    issues.push('Translation appears too short');
  }

  // Check if translation is suspiciously similar to original
  if (translated === original) {
    issues.push('Translation identical to original');
  }

  // Check for Arabic characters if target is Arabic
  if (targetLanguage === 'ar') {
    const arabicRegex = /[\u0600-\u06FF]/;
    if (!arabicRegex.test(translated)) {
      issues.push('No Arabic characters found in translation');
    }
  }

  // Check for English characters if target is English
  if (targetLanguage === 'en') {
    const englishRegex = /[a-zA-Z]/;
    if (!englishRegex.test(translated)) {
      issues.push('No English characters found in translation');
    }
  }

  return {
    isValid: issues.length === 0,
    issues,
  };
}
