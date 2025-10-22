import { env } from '@/lib/env'
import type { WithContext, Organization, LocalBusiness, Service, Article, FAQPage, BreadcrumbList, ImageObject, BlogPosting } from 'schema-dts'
import type { Project, Service as CMSService, BlogPost, BilingualContent } from '@/lib/cms-types'

// Helper type to make schema-dts compatible with our use case
type SchemaLD<T> = Partial<WithContext<any>> & { '@context': string; '@type': string }

// Helper to get localized text
function getLocalizedText(content: BilingualContent | string | undefined | null, locale: 'en' | 'ar'): string {
  if (!content) return ''
  if (typeof content === 'string') return content
  return content[locale] || content.en || ''
}

// Base organization schema
export function generateOrganizationLD(): WithContext<Organization> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${env.NEXT_PUBLIC_SITE_URL}#organization`,
    name: 'Mouhajer International Design and Contracting',
    alternateName: 'Mouhajer Design',
    url: env.NEXT_PUBLIC_SITE_URL,
    logo: {
      '@type': 'ImageObject' as const,
      url: `${env.NEXT_PUBLIC_SITE_URL}/logo.png`,
      width: '300',
      height: '100',
    } as ImageObject,
    image: `${env.NEXT_PUBLIC_SITE_URL}/logo.png`,
    description: 'Luxury Interior Design and Contracting Company in Dubai, UAE',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Dubai, UAE',
      addressLocality: 'Dubai',
      addressRegion: 'Dubai',
      postalCode: '',
      addressCountry: 'AE',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: env.NEXT_PUBLIC_PHONE_NUMBER || '+971-50-123-4567',
      contactType: 'customer service',
      areaServed: 'AE',
      availableLanguage: ['English', 'Arabic'],
    },
    sameAs: [
      'https://www.facebook.com/mouhajerdesign',
      'https://www.instagram.com/mouhajerdesign',
      'https://www.linkedin.com/company/mouhajer-design',
    ],
    foundingDate: '2000',
    founder: {
      '@type': 'Person',
      name: 'Maher Mouhajer',
      jobTitle: 'CEO & Founder',
    },
    areaServed: {
      '@type': 'Country',
      name: 'United Arab Emirates',
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Interior Design Services',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Interior Design',
            description: 'Luxury interior design services for residential and commercial spaces',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Fit-out Services',
            description: 'Complete fit-out solutions for villas, offices, and hotels',
          },
        },
      ],
    },
  }
}

// Local business schema for location-specific pages
export function generateLocalBusinessLD(location?: string): WithContext<LocalBusiness> {
  const baseOrg = generateOrganizationLD() as any

  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${env.NEXT_PUBLIC_SITE_URL}${location ? `/${location}` : ''}#localbusiness`,
    ...baseOrg,
    priceRange: '$$$',
    paymentAccepted: 'Cash, Credit Card, Bank Transfer',
    currenciesAccepted: 'AED, USD',
    openingHours: 'Mo-Su 09:00-18:00',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      bestRating: '5',
      worstRating: '1',
      ratingCount: '150',
    },
  }
}

// Service schema
export function generateServiceLD(service: CMSService, locale: 'en' | 'ar'): SchemaLD<Service> {
  const serviceName = getLocalizedText(service.title, locale)
  const serviceSlug = getLocalizedText(service.slug, locale)
  const description = getLocalizedText(service.description, locale)

  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${env.NEXT_PUBLIC_SITE_URL}/${locale}/services/${serviceSlug}#service`,
    name: serviceName,
    description: description,
    provider: {
      '@type': 'Organization',
      '@id': `${env.NEXT_PUBLIC_SITE_URL}#organization`,
    },
    areaServed: service.serviceArea?.map((area: string) => ({
      '@type': 'City',
      name: area.charAt(0).toUpperCase() + area.slice(1).replace('-', ' '),
    })) || [
      {
        '@type': 'Country',
        name: 'United Arab Emirates',
      },
    ],
    serviceType: serviceName,
    ...(service.images && service.images.length > 0 && {
      image: {
        '@type': 'ImageObject',
        url: service.images[0],
        width: 800,
        height: 600,
      },
    }),
    ...(service.price && {
      offers: {
        '@type': 'Offer',
        description: `Professional ${serviceName.toLowerCase()} services in Dubai, UAE`,
        price: service.price,
        priceCurrency: 'AED',
        areaServed: {
          '@type': 'Country',
          name: 'United Arab Emirates',
        },
      },
    }),
    ...(service.averageRating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: service.averageRating.toString(),
        bestRating: '5',
        worstRating: '1',
        ratingCount: service.viewCount?.toString() || '1',
      },
    }),
  }
}

// Article schema for projects
export function generateProjectLD(project: Project, locale: 'en' | 'ar'): SchemaLD<Article> {
  const title = getLocalizedText(project.title, locale)
  const description = getLocalizedText(project.description, locale)
  const projectSlug = getLocalizedText(project.slug, locale)

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${env.NEXT_PUBLIC_SITE_URL}/${locale}/projects/${projectSlug}#article`,
    headline: title,
    description: description,
    url: `${env.NEXT_PUBLIC_SITE_URL}/${locale}/projects/${projectSlug}`,
    datePublished: project.publishedAt || project.createdAt,
    dateModified: project.updatedAt,
    author: {
      '@type': 'Organization',
      '@id': `${env.NEXT_PUBLIC_SITE_URL}#organization`,
    },
    publisher: {
      '@type': 'Organization',
      '@id': `${env.NEXT_PUBLIC_SITE_URL}#organization`,
    },
    ...(project.featuredImage && {
      image: {
        '@type': 'ImageObject',
        url: project.featuredImage.url,
        width: project.featuredImage.width || 1200,
        height: project.featuredImage.height || 630,
      },
    }),
    articleSection: 'Interior Design Projects',
    keywords: project.category || 'Interior Design',
    ...(project.location && {
      contentLocation: {
        '@type': 'Place',
        name: project.location,
      },
    }),
  }
}

// Blog Post schema
export function generateBlogPostLD(post: BlogPost, locale: 'en' | 'ar'): SchemaLD<BlogPosting> {
  const title = getLocalizedText(post.title, locale)
  const excerpt = getLocalizedText(post.excerpt, locale)
  const postSlug = getLocalizedText(post.slug, locale)

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${env.NEXT_PUBLIC_SITE_URL}/${locale}/blog/${postSlug}#blogpost`,
    headline: title,
    description: excerpt,
    url: `${env.NEXT_PUBLIC_SITE_URL}/${locale}/blog/${postSlug}`,
    datePublished: post.publishedAt || post.createdAt,
    dateModified: post.updatedAt,
    author: (post.author && typeof post.author === 'object') ? {
      '@type': 'Person',
      name: post.author.name,
      ...(post.author.avatar && {
        image: {
          '@type': 'ImageObject',
          url: post.author.avatar,
        },
      }),
    } : {
      '@type': 'Organization',
      '@id': `${env.NEXT_PUBLIC_SITE_URL}#organization`,
    },
    publisher: {
      '@type': 'Organization',
      '@id': `${env.NEXT_PUBLIC_SITE_URL}#organization`,
    },
    ...(post.featuredImage && {
      image: {
        '@type': 'ImageObject',
        url: post.featuredImage,
        width: 1200,
        height: 630,
      },
    }),
    articleSection: post.category || 'Interior Design',
    keywords: post.tags?.join(', ') || '',
    ...(post.readTime && {
      timeRequired: `PT${post.readTime}M`,
    }),
  }
}

// FAQ schema
export function generateFAQLD(faqs: any[], locale: 'en' | 'ar'): WithContext<FAQPage> {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: getLocalizedText(faq.question, locale),
      acceptedAnswer: {
        '@type': 'Answer',
        text: getLocalizedText(faq.answer, locale),
      },
    })),
  }
}

// Breadcrumb schema
export function generateBreadcrumbLD(breadcrumbs: Array<{ name: string; url: string }>): WithContext<BreadcrumbList> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  }
}

// ItemList schema for collections (projects, services, blog)
export function generateItemListLD(items: (Project | CMSService | BlogPost)[], type: 'Project' | 'Service' | 'BlogPost', locale: 'en' | 'ar'): WithContext<any> {
  const baseUrl = env.NEXT_PUBLIC_SITE_URL
  const path = type === 'Project' ? 'projects' : type === 'Service' ? 'services' : 'blog'

  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': `${baseUrl}/${locale}/${path}#itemlist`,
    name: `${type} Collection`,
    description: `Browse our collection of ${type.toLowerCase()}s`,
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => {
      const title = getLocalizedText(item.title, locale)
      const slug = getLocalizedText(item.slug, locale)

      return {
        '@type': 'ListItem',
        position: index + 1,
        name: title,
        url: `${baseUrl}/${locale}/${path}/${slug}`,
      }
    }),
  }
}

// Website schema
export function generateWebsiteLD(): WithContext<any> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${env.NEXT_PUBLIC_SITE_URL}#website`,
    name: 'Mouhajer International Design and Contracting',
    alternateName: 'Mouhajer Design',
    url: env.NEXT_PUBLIC_SITE_URL,
    description: 'Luxury Interior Design and Contracting Company in Dubai, UAE',
    publisher: {
      '@type': 'Organization',
      '@id': `${env.NEXT_PUBLIC_SITE_URL}#organization`,
    },
    inLanguage: ['en-US', 'ar-AE'],
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${env.NEXT_PUBLIC_SITE_URL}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}

// Helper to combine multiple schemas
export function combineSchemas(...schemas: any[]) {
  return schemas.filter(Boolean)
}