import { Metadata } from 'next';

interface BilingualText {
  en: string;
  ar: string;
}

interface PageSEO {
  metaTitle: BilingualText;
  metaDescription: BilingualText;
  keywords: string[];
}

interface GenerateMetadataParams {
  title: BilingualText;
  description: BilingualText;
  slug: BilingualText;
  seo?: PageSEO;
  image?: string;
  type?: 'website' | 'article' | 'product';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  tags?: string[];
  locale?: 'en' | 'ar';
}

/**
 * Generate comprehensive metadata for pages
 */
export function generatePageMetadata({
  title,
  description,
  slug,
  seo,
  image,
  type = 'website',
  publishedTime,
  modifiedTime,
  author,
  tags,
  locale = 'en',
}: GenerateMetadataParams): Metadata {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mouhajer.ae';
  const currentTitle = seo?.metaTitle?.[locale] || title[locale];
  const currentDescription = seo?.metaDescription?.[locale] || description[locale];
  const keywords = seo?.keywords || [];

  const metadata: Metadata = {
    title: currentTitle,
    description: currentDescription,
    keywords: keywords.length > 0 ? keywords : undefined,
    authors: author ? [{ name: author }] : undefined,
    openGraph: {
      title: currentTitle,
      description: currentDescription,
      url: `${baseUrl}/${locale}/${slug[locale]}`,
      siteName: 'Mouhajer International',
      locale: locale === 'en' ? 'en_AE' : 'ar_AE',
      type,
      images: image
        ? [
            {
              url: image,
              width: 1200,
              height: 630,
              alt: currentTitle,
            },
          ]
        : undefined,
      publishedTime,
      modifiedTime,
    },
    twitter: {
      card: 'summary_large_image',
      title: currentTitle,
      description: currentDescription,
      images: image ? [image] : undefined,
    },
    alternates: {
      canonical: `${baseUrl}/${locale}/${slug[locale]}`,
      languages: {
        en: `${baseUrl}/en/${slug.en}`,
        ar: `${baseUrl}/ar/${slug.ar}`,
      },
    },
  };

  // Add article-specific metadata
  if (type === 'article' && tags && tags.length > 0) {
    metadata.keywords = [...(metadata.keywords || []), ...tags];
  }

  return metadata;
}

/**
 * Generate metadata for blog posts
 */
export function generateBlogMetadata({
  title,
  excerpt,
  slug,
  featuredImage,
  author,
  publishedAt,
  tags,
  locale = 'en',
}: {
  title: BilingualText;
  excerpt: BilingualText;
  slug: BilingualText;
  featuredImage: string;
  author: string;
  publishedAt: string;
  tags: string[];
  locale?: 'en' | 'ar';
}): Metadata {
  return generatePageMetadata({
    title,
    description: excerpt,
    slug,
    image: featuredImage,
    type: 'article',
    publishedTime: publishedAt,
    author,
    tags,
    locale,
  });
}

/**
 * Generate metadata for projects
 */
export function generateProjectMetadata({
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
}): Metadata {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mouhajer.ae';

  return {
    title: title[locale],
    description: description[locale],
    keywords: ['interior design', 'Dubai', category, 'Mouhajer'],
    openGraph: {
      title: title[locale],
      description: description[locale],
      url: baseUrl,
      siteName: 'Mouhajer International',
      locale: locale === 'en' ? 'en_AE' : 'ar_AE',
      type: 'website',
      images: images.slice(0, 4).map((url) => ({
        url,
        width: 1200,
        height: 630,
        alt: title[locale],
      })),
    },
    twitter: {
      card: 'summary_large_image',
      title: title[locale],
      description: description[locale],
      images: images.slice(0, 1),
    },
  };
}

/**
 * Generate metadata for services
 */
export function generateServiceMetadata({
  title,
  shortDescription,
  price,
  duration,
  locale = 'en',
}: {
  title: BilingualText;
  shortDescription: BilingualText;
  price?: string;
  duration?: string;
  locale?: 'en' | 'ar';
}): Metadata {
  const keywords = [
    'interior design services',
    'Dubai',
    'Mouhajer',
    title[locale],
  ];

  if (price) keywords.push('pricing');
  if (duration) keywords.push(duration);

  return {
    title: title[locale],
    description: shortDescription[locale],
    keywords,
    openGraph: {
      title: title[locale],
      description: shortDescription[locale],
      siteName: 'Mouhajer International',
      locale: locale === 'en' ? 'en_AE' : 'ar_AE',
      type: 'product',
    },
    twitter: {
      card: 'summary',
      title: title[locale],
      description: shortDescription[locale],
    },
  };
}

/**
 * Get breadcrumb structured data
 */
export function getBreadcrumbStructuredData(items: Array<{ name: string; url: string }>) {
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
