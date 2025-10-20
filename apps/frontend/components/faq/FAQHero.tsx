'use client';

import { useTranslations } from 'next-intl';
import { HelpCircle, Search } from 'lucide-react';
import { useState } from 'react';

interface FAQHeroProps {
  locale: string;
}

export default function FAQHero({ locale }: FAQHeroProps) {
  const t = useTranslations('faq');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // In production, implement search functionality
    console.log('Search query:', searchQuery);
  };

  return (
    <section className="relative bg-gradient-to-br from-primary/10 via-background to-primary/5 py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-primary/10 p-4 rounded-full">
              <HelpCircle className="w-16 h-16 text-primary" aria-hidden="true" />
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            {t('hero.title')}
          </h1>

          <p className="text-xl text-muted-foreground mb-10">
            {t('hero.subtitle')}
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="relative">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground"
                aria-hidden="true"
              />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('hero.searchPlaceholder')}
                className="w-full pl-12 pr-4 py-4 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                aria-label={t('hero.searchPlaceholder')}
              />
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
