'use client';

interface PricingTier {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  priceSuffix?: string;
  features: string[];
}

interface OfferSchemaProps {
  pricingTiers: PricingTier[];
  organizationName: string;
  organizationUrl: string;
}

export default function OfferSchema({
  pricingTiers,
  organizationName,
  organizationUrl,
}: OfferSchemaProps) {
  const schema = pricingTiers.map((tier) => ({
    '@context': 'https://schema.org',
    '@type': 'Offer',
    name: tier.name,
    description: tier.description,
    price: tier.price.toString(),
    priceCurrency: tier.currency,
    availability: 'https://schema.org/InStock',
    seller: {
      '@type': 'Organization',
      name: organizationName,
      url: organizationUrl,
    },
    itemOffered: {
      '@type': 'Service',
      name: tier.name,
      description: tier.description,
    },
  }));

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
