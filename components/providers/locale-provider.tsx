'use client';

import { useEffect } from 'react';
import { type Locale } from '@/i18n/config';

interface LocaleProviderProps {
  locale: Locale;
  direction: 'ltr' | 'rtl';
  children: React.ReactNode;
}

export function LocaleProvider({ locale, direction, children }: LocaleProviderProps) {
  useEffect(() => {
    // Set HTML lang and dir attributes
    document.documentElement.lang = locale;
    document.documentElement.dir = direction;

    // Add/remove RTL class for styling
    if (direction === 'rtl') {
      document.documentElement.classList.add('rtl');
      document.body.classList.add('font-arabic');
    } else {
      document.documentElement.classList.remove('rtl');
      document.body.classList.remove('font-arabic');
    }

    return () => {
      // Cleanup on unmount
      document.documentElement.classList.remove('rtl');
      document.body.classList.remove('font-arabic');
    };
  }, [locale, direction]);

  return (
    <div dir={direction} className={direction === 'rtl' ? 'font-arabic' : ''}>
      {children}
    </div>
  );
}
