export const locales = ['en', 'ar'] as const;
export const defaultLocale = 'en' as const;

export type Locale = (typeof locales)[number];

export function getDirection(locale: Locale): 'ltr' | 'rtl' {
  return locale === 'ar' ? 'rtl' : 'ltr';
}

export function getLocaleLabel(locale: Locale): string {
  const labels: Record<Locale, string> = {
    en: 'English',
    ar: 'العربية'
  };
  return labels[locale];
}
