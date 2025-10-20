'use client';

import PricingCard from './PricingCard';

interface PricingTier {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  priceSuffix?: string;
  features: string[];
  highlighted?: boolean;
  ctaText: string;
}

interface PricingGridProps {
  tiers: PricingTier[];
  locale: string;
}

export default function PricingGrid({ tiers, locale }: PricingGridProps) {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {tiers.map((tier) => (
            <PricingCard key={tier.id} tier={tier} locale={locale} />
          ))}
        </div>
      </div>
    </section>
  );
}
