'use client';

import { useTranslations } from 'next-intl';
import { Check, X } from 'lucide-react';

interface ComparisonFeature {
  name: string;
  basic: boolean;
  premium: boolean;
  luxury: boolean;
}

interface PricingComparisonProps {
  locale: string;
}

export default function PricingComparison({ locale }: PricingComparisonProps) {
  const t = useTranslations('pricing');

  // Comparison features - In production, fetch from CMS
  const features: ComparisonFeature[] = [
    {
      name: locale === 'en' ? '3D Visualization' : 'تصور ثلاثي الأبعاد',
      basic: true,
      premium: true,
      luxury: true,
    },
    {
      name: locale === 'en' ? 'Custom Furniture Design' : 'تصميم أثاث مخصص',
      basic: false,
      premium: true,
      luxury: true,
    },
    {
      name: locale === 'en' ? 'Project Management' : 'إدارة المشروع',
      basic: false,
      premium: true,
      luxury: true,
    },
    {
      name: locale === 'en' ? 'Premium Materials' : 'مواد فاخرة',
      basic: false,
      premium: false,
      luxury: true,
    },
    {
      name: locale === 'en' ? 'Smart Home Integration' : 'تكامل المنزل الذكي',
      basic: false,
      premium: false,
      luxury: true,
    },
    {
      name: locale === 'en' ? 'Ongoing Support (1 year)' : 'دعم مستمر (سنة واحدة)',
      basic: false,
      premium: false,
      luxury: true,
    },
  ];

  const renderCheckmark = (value: boolean) => {
    if (value) {
      return <Check className="w-6 h-6 text-primary mx-auto" aria-label="Included" />;
    }
    return <X className="w-6 h-6 text-muted-foreground/30 mx-auto" aria-label="Not included" />;
  };

  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            {t('comparison.title')}
          </h2>

          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full bg-card rounded-lg border border-border">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-6 font-semibold text-lg">
                    {t('comparison.feature')}
                  </th>
                  <th className="p-6 font-semibold text-lg text-center">
                    {t('comparison.basic')}
                  </th>
                  <th className="p-6 font-semibold text-lg text-center bg-primary/5">
                    {t('comparison.premium')}
                  </th>
                  <th className="p-6 font-semibold text-lg text-center">
                    {t('comparison.luxury')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {features.map((feature, index) => (
                  <tr
                    key={index}
                    className={`border-b border-border last:border-b-0 ${
                      index % 2 === 0 ? 'bg-muted/20' : ''
                    }`}
                  >
                    <td className="p-6 font-medium">{feature.name}</td>
                    <td className="p-6 text-center">{renderCheckmark(feature.basic)}</td>
                    <td className="p-6 text-center bg-primary/5">
                      {renderCheckmark(feature.premium)}
                    </td>
                    <td className="p-6 text-center">{renderCheckmark(feature.luxury)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile View */}
          <div className="md:hidden space-y-6">
            {['basic', 'premium', 'luxury'].map((tier) => (
              <div key={tier} className="bg-card rounded-lg border border-border p-6">
                <h3 className="text-xl font-bold mb-4 capitalize">
                  {t(`comparison.${tier}`)}
                </h3>
                <ul className="space-y-3">
                  {features.map((feature, index) => {
                    const isIncluded =
                      tier === 'basic'
                        ? feature.basic
                        : tier === 'premium'
                        ? feature.premium
                        : feature.luxury;
                    return (
                      <li
                        key={index}
                        className={`flex items-center gap-3 ${
                          isIncluded ? 'text-foreground' : 'text-muted-foreground/50'
                        }`}
                      >
                        {isIncluded ? (
                          <Check className="w-5 h-5 text-primary flex-shrink-0" />
                        ) : (
                          <X className="w-5 h-5 flex-shrink-0" />
                        )}
                        <span>{feature.name}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
