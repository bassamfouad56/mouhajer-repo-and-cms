import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Map Yoast SEO fields (as commonly exposed by WPGraphQL Yoast addon) to SEOEnhanced props
export type YoastGraphQL = {
  title?: string | null;
  metaDesc?: string | null;
  canonical?: string | null;
  focuskw?: string | null;
  opengraphTitle?: string | null;
  opengraphDescription?: string | null;
  opengraphUrl?: string | null;
  opengraphImage?: { sourceUrl?: string | null } | null;
  twitterTitle?: string | null;
  twitterDescription?: string | null;
};

export function mapYoastToSEO(yoast: YoastGraphQL | null | undefined, locale: string) {
  if (!yoast) return {};
  return {
    title: yoast.title ?? yoast.opengraphTitle ?? undefined,
    description: yoast.metaDesc ?? yoast.opengraphDescription ?? undefined,
    canonical: yoast.canonical ?? undefined,
    locale,
    openGraph: {
      title: yoast.opengraphTitle ?? yoast.title ?? undefined,
      description: yoast.opengraphDescription ?? yoast.metaDesc ?? undefined,
      url: yoast.opengraphUrl ?? undefined,
      images: yoast.opengraphImage?.sourceUrl ? [yoast.opengraphImage.sourceUrl] : undefined,
    },
    twitter: {
      title: yoast.twitterTitle ?? yoast.title ?? undefined,
      description: yoast.twitterDescription ?? yoast.metaDesc ?? undefined,
    },
  };
}

// Get localized text helper
export function getLocalizedText(
  content: { en: string; ar: string } | string | undefined,
  locale: 'en' | 'ar',
): string {
  if (!content) return '';
  if (typeof content === 'string') return content;
  return content[locale] || content.en || '';
}

// Format date helper
export function formatDate(date: string | Date, locale: 'en' | 'ar' = 'en'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  if (locale === 'ar') {
    return new Intl.DateTimeFormat('ar-AE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(dateObj);
  }

  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(dateObj);
}

// Truncate text helper
export function truncateText(text: string, length: number = 150): string {
  if (text.length <= length) return text;
  return text.substring(0, length).replace(/\s+\S*$/, '...');
}

// Debounce helper
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Performance helpers
export function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
}

// Form validation helpers
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}
