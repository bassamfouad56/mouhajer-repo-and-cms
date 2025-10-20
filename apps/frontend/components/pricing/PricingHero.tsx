'use client';

import { useTranslations } from 'next-intl';
import { DollarSign } from 'lucide-react';

interface PricingHeroProps {
  locale: string;
}

export default function PricingHero({ locale }: PricingHeroProps) {
  const t = useTranslations('pricing');

  return (
    <section className="relative bg-gradient-to-br from-primary/10 via-background to-primary/5 py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-primary/10 p-4 rounded-full">
              <DollarSign className="w-16 h-16 text-primary" aria-hidden="true" />
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            {t('hero.title')}
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
            {t('hero.subtitle')}
          </p>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('hero.description')}
          </p>
        </div>
      </div>
    </section>
  );
}
