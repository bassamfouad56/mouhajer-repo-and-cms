'use client';

import { NextIntlClientProvider } from 'next-intl';
import { ReactNode } from 'react';

type ProvidersProps = {
  children: ReactNode;
  locale: string;
  messages: any;
};

export default function Providers({ children, locale, messages }: ProvidersProps) {
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
