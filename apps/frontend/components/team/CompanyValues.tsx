'use client';

import { useTranslations } from 'next-intl';
import { Target, Award, Heart, Lightbulb } from 'lucide-react';

interface CompanyValuesProps {
  locale: string;
}

const valueIcons = {
  excellence: Award,
  innovation: Lightbulb,
  passion: Heart,
  integrity: Target,
};

export default function CompanyValues({ locale }: CompanyValuesProps) {
  const t = useTranslations('team');

  const values = [
    {
      key: 'excellence',
      icon: valueIcons.excellence,
      titleKey: 'values.excellence.title',
      descKey: 'values.excellence.description',
    },
    {
      key: 'innovation',
      icon: valueIcons.innovation,
      titleKey: 'values.innovation.title',
      descKey: 'values.innovation.description',
    },
    {
      key: 'passion',
      icon: valueIcons.passion,
      titleKey: 'values.passion.title',
      descKey: 'values.passion.description',
    },
    {
      key: 'integrity',
      icon: valueIcons.integrity,
      titleKey: 'values.integrity.title',
      descKey: 'values.integrity.description',
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t('values.sectionTitle')}
          </h2>
          <p className="text-xl text-muted-foreground">
            {t('values.sectionSubtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {values.map((value) => {
            const Icon = value.icon;
            return (
              <div
                key={value.key}
                className="bg-card rounded-xl p-6 text-center hover:shadow-lg transition-shadow border border-border"
              >
                <div className="flex justify-center mb-4">
                  <div className="bg-primary/10 p-4 rounded-full">
                    <Icon className="w-8 h-8 text-primary" aria-hidden="true" />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3">{t(value.titleKey)}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {t(value.descKey)}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
