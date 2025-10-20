'use client';

import { useTranslations } from 'next-intl';
import { Briefcase } from 'lucide-react';

interface CaseStudyHeroProps {
  locale: string;
}

export default function CaseStudyHero({ locale }: CaseStudyHeroProps) {
  const t = useTranslations('caseStudies');

  return (
    <section className="relative bg-gradient-to-br from-primary/10 via-background to-primary/5 py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-primary/10 p-4 rounded-full">
              <Briefcase className="w-16 h-16 text-primary" aria-hidden="true" />
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            {t('hero.title')}
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
            {t('hero.subtitle')}
          </p>
        </div>
      </div>
    </section>
  );
}
