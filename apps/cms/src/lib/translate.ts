/**
 * Translation utility for English <-> Arabic translation
 * Uses Google Translate API
 */

export async function translateText(
  text: string,
  targetLang: 'ar' | 'en'
): Promise<string> {
  if (!text || text.trim() === '') return '';

  try {
    // Using Google Translate API via a free endpoint
    const sourceLang = targetLang === 'ar' ? 'en' : 'ar';

    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;

    const response = await fetch(url);
    const data = await response.json();

    // Extract translated text from response
    if (data && data[0] && data[0][0] && data[0][0][0]) {
      return data[0][0][0];
    }

    return text;
  } catch (error) {
    console.error('Translation error:', error);
    return text;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(later, wait);
  };
}
