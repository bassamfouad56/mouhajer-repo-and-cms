/**
 * Structured Data (JSON-LD) Schema Generators for SEO
 * Implements Schema.org schemas for rich snippets in search results
 */

interface BilingualText {
  en: string;
  ar: string;
}

/**
 * Organization Schema - Use in root layout or homepage
 */
export function getOrganizationSchema(locale: 'en' | 'ar' = 'en') {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mouhajer.ae';

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${baseUrl}/#organization`,
    name: 'Mouhajer International Design and Contracting',
    alternateName: 'Mouhajer Design',
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    image: `${baseUrl}/og-image.jpg`,
    description:
      locale === 'en'
        ? 'Leading provider of architecture, interior design, and fit-out services in Dubai and Abu Dhabi'
        : 'مزود رائد لخدمات الهندسة المعمارية والتصميم الداخلي والتجهيز في دبي وأبو ظبي',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'AE',
      addressLocality: 'Dubai',
      addressRegion: 'Dubai',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      availableLanguage: ['English', 'Arabic'],
    },
    sameAs: [
      // Add social media URLs here
      // 'https://www.facebook.com/mouhajer',
      // 'https://www.instagram.com/mouhajer',
      // 'https://www.linkedin.com/company/mouhajer',
    ],
  };
}

/**
 * Local Business Schema - For location-based SEO
 */
export function getLocalBusinessSchema(locale: 'en' | 'ar' = 'en') {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mouhajer.ae';

  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${baseUrl}/#localbusiness`,
    name: 'Mouhajer International Design and Contracting',
    image: `${baseUrl}/og-image.jpg`,
    url: baseUrl,
    telephone: '+971-XX-XXXXXXX', // Replace with actual phone
    priceRange: '$$$',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '', // Add actual address
      addressLocality: 'Dubai',
      addressRegion: 'Dubai',
      postalCode: '', // Add actual postal code
      addressCountry: 'AE',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 25.2048, // Dubai coordinates - replace with actual
      longitude: 55.2708,
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '18:00',
    },
  };
}

/**
 * Website Schema - For site-wide search box
 */
export function getWebsiteSchema() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mouhajer.ae';

  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${baseUrl}/#website`,
    url: baseUrl,
    name: 'Mouhajer International',
    description: 'Interior Design and Architecture Services in Dubai',
    inLanguage: ['en-AE', 'ar-AE'],
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

/**
 * Article Schema - For blog posts
 */
export function getArticleSchema({
  title,
  description,
  slug,
  featuredImage,
  author,
  publishedAt,
  updatedAt,
  tags,
  locale = 'en',
}: {
  title: BilingualText;
  description: BilingualText;
  slug: BilingualText;
  featuredImage: string;
  author: string;
  publishedAt: string;
  updatedAt?: string;
  tags: string[];
  locale?: 'en' | 'ar';
}) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mouhajer.ae';
  const articleUrl = `${baseUrl}/${locale}/blog/${slug[locale]}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': articleUrl,
    headline: title[locale],
    description: description[locale],
    image: featuredImage,
    datePublished: publishedAt,
    dateModified: updatedAt || publishedAt,
    author: {
      '@type': 'Person',
      name: author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Mouhajer International',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': articleUrl,
    },
    keywords: tags.join(', '),
    inLanguage: locale === 'en' ? 'en-AE' : 'ar-AE',
  };
}

/**
 * Service Schema - For service pages
 */
export function getServiceSchema({
  title,
  description,
  price,
  duration,
  features,
  locale = 'en',
}: {
  title: BilingualText;
  description: BilingualText;
  price?: string;
  duration?: string;
  features?: BilingualText;
  locale?: 'en' | 'ar';
}) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mouhajer.ae';

  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: title[locale],
    description: description[locale],
    provider: {
      '@type': 'Organization',
      name: 'Mouhajer International',
      url: baseUrl,
    },
    areaServed: {
      '@type': 'City',
      name: 'Dubai',
    },
    serviceType: 'Interior Design',
    ...(price && {
      offers: {
        '@type': 'Offer',
        price: price,
        priceCurrency: 'AED',
      },
    }),
  };
}

/**
 * ImageObject Schema - For project galleries
 */
export function getImageObjectSchema({
  url,
  caption,
  width,
  height,
}: {
  url: string;
  caption?: string;
  width?: number;
  height?: number;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ImageObject',
    contentUrl: url,
    ...(caption && { caption }),
    ...(width && { width }),
    ...(height && { height }),
    author: {
      '@type': 'Organization',
      name: 'Mouhajer International',
    },
  };
}

/**
 * Breadcrumb Schema
 */
export function getBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * FAQ Schema - For pages with frequently asked questions
 */
export function getFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/**
 * Project/CreativeWork Schema - For portfolio projects
 */
export function getProjectSchema({
  title,
  description,
  images,
  category,
  locale = 'en',
}: {
  title: BilingualText;
  description: BilingualText;
  images: string[];
  category: string;
  locale?: 'en' | 'ar';
}) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mouhajer.ae';

  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: title[locale],
    description: description[locale],
    image: images,
    genre: category,
    creator: {
      '@type': 'Organization',
      name: 'Mouhajer International',
      url: baseUrl,
    },
    inLanguage: locale === 'en' ? 'en-AE' : 'ar-AE',
  };
}
