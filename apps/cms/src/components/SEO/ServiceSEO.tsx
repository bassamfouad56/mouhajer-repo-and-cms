import Head from 'next/head';

interface ServiceSEOProps {
  service: {
    title: { en: string; ar: string };
    slug: { en: string; ar: string };
    description: { en: string; ar: string };
    shortDescription: { en: string; ar: string };
    images?: string[];
    price?: string;
    seo?: {
      metaTitleEn?: string;
      metaTitleAr?: string;
      metaDescEn?: string;
      metaDescAr?: string;
      keywordsEn?: string[];
      keywordsAr?: string[];
    };
    targetLocations?: string[];
    faqs?: Array<{
      questionEn: string;
      questionAr: string;
      answerEn: string;
      answerAr: string;
    }>;
    averageRating?: number;
    viewCount?: number;
  };
  language?: 'en' | 'ar';
  url: string;
  organizationName?: string;
  organizationLogo?: string;
}

export default function ServiceSEO({
  service,
  language = 'en',
  url,
  organizationName = 'Mouhajer Construction',
  organizationLogo,
}: ServiceSEOProps) {
  const isArabic = language === 'ar';

  // SEO Values
  const title = isArabic
    ? (service.seo?.metaTitleAr || `${service.title.ar} | ${organizationName}`)
    : (service.seo?.metaTitleEn || `${service.title.en} | ${organizationName}`);

  const description = isArabic
    ? (service.seo?.metaDescAr || service.shortDescription.ar)
    : (service.seo?.metaDescEn || service.shortDescription.en);

  const keywords = isArabic
    ? (service.seo?.keywordsAr || [])
    : (service.seo?.keywordsEn || []);

  const canonicalUrl = isArabic
    ? `${url}/ar/services/${service.slug.ar}`
    : `${url}/services/${service.slug.en}`;

  const alternateUrl = isArabic
    ? `${url}/services/${service.slug.en}`
    : `${url}/ar/services/${service.slug.ar}`;

  // Schema.org structured data
  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: isArabic ? service.title.ar : service.title.en,
    description: isArabic ? service.description.ar : service.description.en,
    provider: {
      '@type': 'Organization',
      name: organizationName,
      ...(organizationLogo && { logo: organizationLogo }),
    },
    areaServed: service.targetLocations?.map(location => ({
      '@type': 'City',
      name: location,
    })) || [],
    ...(service.images && service.images.length > 0 && {
      image: service.images[0],
    }),
    ...(service.price && {
      offers: {
        '@type': 'Offer',
        price: service.price,
        priceCurrency: 'AED',
      },
    }),
    ...(service.averageRating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: service.averageRating,
        ratingCount: service.viewCount || 1,
      },
    }),
  };

  // FAQ Schema
  const faqSchema = service.faqs && service.faqs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: service.faqs.map(faq => ({
      '@type': 'Question',
      name: isArabic ? faq.questionAr : faq.questionEn,
      acceptedAnswer: {
        '@type': 'Answer',
        text: isArabic ? faq.answerAr : faq.answerEn,
      },
    })),
  } : null;

  // BreadcrumbList Schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: isArabic ? 'الرئيسية' : 'Home',
        item: url,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: isArabic ? 'الخدمات' : 'Services',
        item: `${url}${isArabic ? '/ar' : ''}/services`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: isArabic ? service.title.ar : service.title.en,
        item: canonicalUrl,
      },
    ],
  };

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords.length > 0 && (
        <meta name="keywords" content={keywords.join(', ')} />
      )}

      {/* Canonical and Alternate URLs */}
      <link rel="canonical" href={canonicalUrl} />
      <link rel="alternate" hrefLang={isArabic ? 'ar' : 'en'} href={canonicalUrl} />
      <link rel="alternate" hrefLang={isArabic ? 'en' : 'ar'} href={alternateUrl} />
      <link rel="alternate" hrefLang="x-default" href={`${url}/services/${service.slug.en}`} />

      {/* Open Graph Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content="website" />
      <meta property="og:locale" content={isArabic ? 'ar_AE' : 'en_AE'} />
      {service.images && service.images.length > 0 && (
        <meta property="og:image" content={service.images[0]} />
      )}

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {service.images && service.images.length > 0 && (
        <meta name="twitter:image" content={service.images[0]} />
      )}

      {/* Language and Direction */}
      <html lang={language} dir={isArabic ? 'rtl' : 'ltr'} />

      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />

      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Mobile Optimization */}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="mobile-web-app-capable" content="yes" />

      {/* Geographic Tags for Local SEO */}
      {service.targetLocations && service.targetLocations.length > 0 && (
        <>
          <meta name="geo.region" content="AE" />
          <meta name="geo.placename" content={service.targetLocations[0]} />
        </>
      )}
    </Head>
  );
}
