'use client';

import { useTranslations } from 'next-intl';
import { Users } from 'lucide-react';

interface TeamHeroProps {
  locale: string;
}

export default function TeamHero({ locale }: TeamHeroProps) {
  const t = useTranslations('team');

  return (
    <section className="relative bg-gradient-to-br from-primary/10 via-background to-primary/5 py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-primary/10 p-4 rounded-full">
              <Users className="w-16 h-16 text-primary" aria-hidden="true" />
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            {t('hero.title')}
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
            {t('hero.subtitle')}
          </p>

          <div className="flex flex-wrap gap-8 justify-center mt-12">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                15+
              </div>
              <div className="text-sm md:text-base text-muted-foreground">
                {t('hero.stats.years')}
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                12
              </div>
              <div className="text-sm md:text-base text-muted-foreground">
                {t('hero.stats.members')}
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                500+
              </div>
              <div className="text-sm md:text-base text-muted-foreground">
                {t('hero.stats.projects')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
