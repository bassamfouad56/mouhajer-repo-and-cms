'use client';

import { Check, Sparkles } from 'lucide-react';

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

interface PricingCardProps {
  tier: PricingTier;
  locale: string;
}

export default function PricingCard({ tier, locale }: PricingCardProps) {
  const { name, description, price, currency, priceSuffix, features, highlighted, ctaText } = tier;

  const formatPrice = (price: number) => {
    if (locale === 'ar') {
      return new Intl.NumberFormat('ar-AE', {
        style: 'currency',
        currency: currency || 'AED',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(price);
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'AED',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <article
      className={`relative bg-card rounded-2xl p-8 shadow-lg border-2 transition-all duration-300 ${
        highlighted
          ? 'border-primary shadow-2xl scale-105 md:scale-110'
          : 'border-border hover:border-primary/50 hover:shadow-xl'
      }`}
    >
      {highlighted && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <div className="bg-primary text-primary-foreground px-6 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
            <Sparkles className="w-4 h-4" aria-hidden="true" />
            <span>{locale === 'en' ? 'Most Popular' : 'الأكثر شعبية'}</span>
          </div>
        </div>
      )}

      {/* Package Name */}
      <h3 className="text-2xl md:text-3xl font-bold mb-3">{name}</h3>

      {/* Description */}
      <p className="text-muted-foreground mb-6">{description}</p>

      {/* Price */}
      <div className="mb-8">
        <div className="flex items-baseline gap-2">
          <span className="text-4xl md:text-5xl font-bold text-primary">
            {formatPrice(price)}
          </span>
          {priceSuffix && (
            <span className="text-muted-foreground text-lg">
              {priceSuffix}
            </span>
          )}
        </div>
      </div>

      {/* Features List */}
      <ul className="space-y-4 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3">
            <Check
              className="w-5 h-5 text-primary flex-shrink-0 mt-0.5"
              aria-hidden="true"
            />
            <span className="text-foreground">{feature}</span>
          </li>
        ))}
      </ul>

      {/* CTA Button */}
      <a
        href={`/${locale}/contact`}
        className={`block w-full text-center py-4 rounded-lg font-semibold transition-colors ${
          highlighted
            ? 'bg-primary text-primary-foreground hover:bg-primary/90'
            : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
        }`}
      >
        {ctaText}
      </a>
    </article>
  );
}
