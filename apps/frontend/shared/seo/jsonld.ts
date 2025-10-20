export type JsonLd = Record<string, unknown>;
const ld = <T extends JsonLd>(t: T) => t;

export const orgJsonLd = () =>
  ld({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Mouhajer',
    url: 'https://www.mouhajerdesign.com',
    logo: 'https://www.mouhajerdesign.com/logo.png',
  });

export const localBusinessJsonLd = (opts: {
  name: string;
  telephone?: string;
  address: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode?: string;
    addressCountry: string;
  };
  geo?: { latitude: number; longitude: number };
  openingHours?: string[];
}) =>
  ld({
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    ...opts,
    url: 'https://www.mouhajerdesign.com',
    image: ['https://www.mouhajerdesign.com/og/og-default.jpg'],
  });

export const serviceJsonLd = (name: string, areaServed = 'Dubai, UAE') =>
  ld({
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    areaServed,
    provider: { '@type': 'Organization', name: 'Mouhajer' },
  });

export const projectJsonLd = (opts: {
  name: string;
  description?: string;
  images?: string[];
  url: string;
}) =>
  ld({
    '@context': 'https://schema.org',
    '@type': 'Project',
    ...opts,
  });

export const breadcrumbJsonLd = (items: { name: string; item: string }[]) =>
  ld({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((b, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      ...b,
    })),
  });

export const faqJsonLd = (faqs: { q: string; a: string }[]) =>
  ld({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  });

