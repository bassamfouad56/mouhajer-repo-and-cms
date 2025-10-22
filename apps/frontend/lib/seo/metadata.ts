import { Metadata } from 'next'
// NOTE: This file is currently unused. Sanity CMS is not used in this project.
// import { urlFor } from '@/lib/sanity/image'
import { env } from '@/lib/env'

// Placeholder for urlFor since Sanity is not used
const urlFor = (img: any) => ({
  width: (w: number) => ({ height: (h: number) => ({ quality: (q: number) => ({ url: () => '' }) }) }),
});

interface LocalizedContent {
  en: string
  ar: string
}

interface SEOData {
  title?: LocalizedContent | string
  description?: LocalizedContent | string
  canonical?: string
  ogImage?: any
  locale: 'en' | 'ar'
  type?: 'website' | 'article' | 'profile'
  publishedTime?: string
  modifiedTime?: string
  section?: string
  tags?: string[]
  authors?: string[]
}

export function generateMetadata(data: SEOData, siteSettings?: any): Metadata {
  const locale = data.locale
  const title = getLocalizedText(data.title, locale)
  const description = getLocalizedText(data.description, locale)

  // Fallback to site settings
  const siteTitle = siteSettings?.siteTitle ? getLocalizedText(siteSettings.siteTitle, locale) : 'Mouhajer International Design'
  const siteDescription = siteSettings?.siteDescription ? getLocalizedText(siteSettings.siteDescription, locale) : 'Luxury Interior Design in Dubai'

  const finalTitle = title ? `${title} | ${siteTitle}` : siteTitle
  const finalDescription = description || siteDescription

  const siteUrl = env.NEXT_PUBLIC_SITE_URL
  const canonicalUrl = data.canonical ? `${siteUrl}${data.canonical}` : siteUrl

  const ogImageUrl = data.ogImage
    ? urlFor(data.ogImage).width(1200).height(630).quality(90).url()
    : siteSettings?.defaultOgImage
      ? urlFor(siteSettings.defaultOgImage).width(1200).height(630).quality(90).url()
      : `${siteUrl}/og-default.jpg`

  const metadata: any = {
    title: finalTitle || undefined,
    description: finalDescription || undefined,

    // Canonical URL and alternates
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: canonicalUrl.replace('/ar/', '/en/'),
        ar: canonicalUrl.replace('/en/', '/ar/'),
      },
    },

    // Open Graph
    openGraph: {
      title: finalTitle || '',
      description: finalDescription || '',
      url: canonicalUrl,
      siteName: siteTitle || '',
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: title || siteTitle,
        } as any,
      ],
      locale: locale === 'en' ? 'en_US' : 'ar_AE',
      type: data.type || 'website',
      ...(data.publishedTime && { publishedTime: data.publishedTime }),
      ...(data.modifiedTime && { modifiedTime: data.modifiedTime }),
      ...(data.section && { section: data.section }),
      ...(data.tags && { tags: data.tags }),
      ...(data.authors && { authors: data.authors }),
    } as any,

    // Twitter Card
    twitter: {
      card: 'summary_large_image',
      title: finalTitle,
      description: finalDescription,
      images: [ogImageUrl],
      ...(siteSettings?.twitterHandle && { creator: siteSettings.twitterHandle }),
    },

    // Additional meta tags
    other: {
      'og:locale:alternate': locale === 'en' ? 'ar_AE' : 'en_US',
    },

    // Robots
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }

  return metadata as Metadata
}

function getLocalizedText(content: LocalizedContent | string | undefined, locale: 'en' | 'ar'): string | undefined {
  if (!content) return undefined
  if (typeof content === 'string') return content
  return content[locale] || content.en
}

// Generate metadata for services
export function generateServiceMetadata(service: any, locale: 'en' | 'ar', siteSettings?: any): Metadata {
  const serviceName = getLocalizedText(service.name, locale)
  const summary = getLocalizedText(service.summary, locale)
  const seoTitle = getLocalizedText(service.seoTitle, locale)
  const seoDescription = getLocalizedText(service.seoDescription, locale)

  return generateMetadata({
    title: seoTitle || `${serviceName} - Interior Design Services`,
    description: seoDescription || summary || '',
    canonical: `/${locale}/services/${service.slug.current}`,
    ogImage: service.heroImage,
    locale,
    type: 'article',
    section: 'Services',
  } as any, siteSettings)
}

// Generate metadata for projects
export function generateProjectMetadata(project: any, locale: 'en' | 'ar', siteSettings?: any): Metadata {
  const projectTitle = getLocalizedText(project.title, locale)
  const excerpt = getLocalizedText(project.excerpt, locale)
  const seoTitle = getLocalizedText(project.seoTitle, locale)
  const seoDescription = getLocalizedText(project.seoDescription, locale)

  return generateMetadata({
    title: seoTitle || `${projectTitle} - Interior Design Project`,
    description: seoDescription || excerpt || '',
    canonical: `/${locale}/projects/${project.slug.current}`,
    ogImage: project.heroImage,
    locale,
    type: 'article',
    section: 'Projects',
    ...(project.completionDate && { publishedTime: project.completionDate }),
    ...(project._updatedAt && { modifiedTime: project._updatedAt }),
    tags: project.tags,
  } as any, siteSettings)
}

// Generate metadata for landing pages
export function generateLandingPageMetadata(landingPage: any, locale: 'en' | 'ar', siteSettings?: any): Metadata {
  const pageTitle = getLocalizedText(landingPage.title, locale)
  const seoTitle = getLocalizedText(landingPage.seoTitle, locale)
  const seoDescription = getLocalizedText(landingPage.seoDescription, locale)

  const serviceName = landingPage.service?.name ? getLocalizedText(landingPage.service.name, locale) : ''
  const location = landingPage.location

  return generateMetadata({
    title: seoTitle || `${serviceName} in ${location} - ${pageTitle}`,
    description: seoDescription || '',
    canonical: `/${locale}/${landingPage.slug.current}`,
    ogImage: landingPage.ogImage || landingPage.heroSection?.backgroundImage,
    locale,
    type: 'website',
  } as any, siteSettings)
}

// Generate metadata for blog posts
export function generatePostMetadata(post: any, locale: 'en' | 'ar', siteSettings?: any): Metadata {
  return generateMetadata({
    title: post.title || '',
    description: post.excerpt || '',
    canonical: `/${locale}/blog/${post.slug.current}`,
    ogImage: post.mainImage,
    locale,
    type: 'article',
    section: 'Blog',
    publishedTime: post.publishedAt,
    modifiedTime: post._updatedAt,
    authors: post.author?.name ? [post.author.name] : undefined,
    tags: post.categories?.map((cat: any) => cat.title) || undefined,
  } as any, siteSettings)
}