export function OrganizationStructuredData() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Mouhajer International Design',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.mouhajerdesign.com',
    logo: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.mouhajerdesign.com'}/logo.png`,
    description:
      'Award-winning luxury interior design firm specializing in residential, commercial, and hospitality projects across the Middle East.',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Dubai',
      addressCountry: 'AE',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: process.env.NEXT_PUBLIC_PHONE || '+971-4-323-4567',
      contactType: 'customer service',
      email: process.env.NEXT_PUBLIC_EMAIL || 'info@mouhajerdesign.com',
      availableLanguage: ['en', 'ar'],
    },
    sameAs: [
      'https://www.instagram.com/mouhajerdesign',
      'https://www.facebook.com/mouhajerdesign',
      'https://www.linkedin.com/company/mouhajerdesign',
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function LocalBusinessStructuredData() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': process.env.NEXT_PUBLIC_SITE_URL || 'https://www.mouhajerdesign.com',
    name: 'Mouhajer International Design',
    image: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.mouhajerdesign.com'}/logo.png`,
    telephone: process.env.NEXT_PUBLIC_PHONE || '+971-4-323-4567',
    email: process.env.NEXT_PUBLIC_EMAIL || 'info@mouhajerdesign.com',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Dubai',
      addressCountry: 'AE',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 25.2048,
      longitude: 55.2708,
    },
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.mouhajerdesign.com',
    priceRange: '$$$',
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '18:00',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

interface ProjectStructuredDataProps {
  title: string;
  description: string;
  image: string;
  datePublished: string;
  category: string;
  location?: string;
}

export function ProjectStructuredData({
  title,
  description,
  image,
  datePublished,
  category,
  location,
}: ProjectStructuredDataProps) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: title,
    description,
    image,
    datePublished,
    creator: {
      '@type': 'Organization',
      name: 'Mouhajer International Design',
    },
    genre: category,
    ...(location && { contentLocation: location }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

interface BlogPostStructuredDataProps {
  title: string;
  description: string;
  image: string;
  datePublished: string;
  dateModified?: string;
  author: {
    name: string;
    role?: string;
  };
}

export function BlogPostStructuredData({
  title,
  description,
  image,
  datePublished,
  dateModified,
  author,
}: BlogPostStructuredDataProps) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description,
    image,
    datePublished,
    dateModified: dateModified || datePublished,
    author: {
      '@type': 'Person',
      name: author.name,
      ...(author.role && { jobTitle: author.role }),
    },
    publisher: {
      '@type': 'Organization',
      name: 'Mouhajer International Design',
      logo: {
        '@type': 'ImageObject',
        url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.mouhajerdesign.com'}/logo.png`,
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
