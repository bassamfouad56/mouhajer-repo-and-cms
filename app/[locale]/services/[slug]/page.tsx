import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { LogoMarquee } from '@/components/logo-marquee';
import { client } from '@/sanity/lib/client';
import { serviceBySlugQuery, servicesQuery, industriesQuery } from '@/sanity/lib/queries';
import { urlForImage } from '@/sanity/lib/image';
import { Service, Industry, Project } from '@/lib/wordpress';
import { getLocalizedValue } from '@/lib/error-handling';
import EnhancedServiceDetail from './enhanced-service-detail';

export const revalidate = 3600;

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

async function getServiceBySlug(slug: string, locale: string) {
  try {
    return await client.fetch(serviceBySlugQuery, { slug, locale });
  } catch (error) {
    console.error('Error fetching service from Sanity:', error);
    return null;
  }
}

async function getServices(locale: string) {
  try {
    return await client.fetch(servicesQuery, { locale });
  } catch (error) {
    console.error('Error fetching services from Sanity:', error);
    return [];
  }
}

async function getIndustries(locale: string) {
  try {
    return await client.fetch(industriesQuery, { locale });
  } catch (error) {
    console.error('Error fetching industries from Sanity:', error);
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const service = await getServiceBySlug(slug, locale);

  if (!service) {
    return {
      title: 'Service Not Found | MIDC',
    };
  }

  const serviceTitle = getLocalizedValue(service.title, locale, 'Service');
  const serviceExcerpt = getLocalizedValue(service.excerpt, locale, '');
  const seoTitle = getLocalizedValue(service.seo?.metaTitle, locale);
  const seoDescription = getLocalizedValue(service.seo?.metaDescription, locale);

  const metaTitle = seoTitle || `${serviceTitle} | Services | MIDC`;
  const metaDescription = seoDescription || serviceExcerpt || `Explore our ${serviceTitle} integrated design-build services.`;

  return {
    title: metaTitle,
    description: metaDescription,
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      images: service.mainImage ? [{ url: urlForImage(service.mainImage).width(1200).height(630).url() }] : [],
    },
  };
}

// Skip static generation at build time - use ISR instead
// Pages will be generated on-demand and cached
export async function generateStaticParams() {
  return [];
}

// Allow dynamic params for on-demand generation
export const dynamicParams = true;

export default async function ServiceDetailPage({ params }: Props) {
  const { locale, slug } = await params;

  const [service, allServices, allIndustries] = await Promise.all([
    getServiceBySlug(slug, locale),
    getServices(locale),
    getIndustries(locale),
  ]);

  if (!service) {
    notFound();
  }

  // Get localized values
  const serviceTitle = getLocalizedValue(service.title, locale, '');
  const serviceExcerpt = getLocalizedValue(service.excerpt, locale, '');

  // Transform Sanity service to WordPress-like format for the component
  const transformedService: Service = {
    id: service._id,
    databaseId: 0,
    title: serviceTitle,
    slug: service.slug?.current || slug,
    excerpt: serviceExcerpt,
    content: '', // Sanity uses block content, handled separately
    featuredImage: service.mainImage ? {
      node: {
        sourceUrl: urlForImage(service.mainImage).width(1920).height(1080).url(),
        altText: getLocalizedValue(service.mainImage.alt, locale) || serviceTitle,
      },
    } : undefined,
    acfFields: {
      features: (service.features || []).map((f: any) => ({
        title: getLocalizedValue(f.title, locale, ''),
        description: getLocalizedValue(f.description, locale, ''),
      })),
      process: (service.process || []).map((p: any, index: number) => ({
        step: p.step || index + 1,
        title: getLocalizedValue(p.title, locale, ''),
        description: getLocalizedValue(p.description, locale, ''),
      })),
      relatedProjects: (service.relatedProjects || []).map((p: any) => p._id),
    },
  };

  // Transform related projects from Sanity
  const relatedProjects: Project[] = (service.relatedProjects || []).map((project: any) => ({
    id: project._id,
    databaseId: 0,
    title: getLocalizedValue(project.title, locale, ''),
    slug: project.slug?.current || '',
    excerpt: '',
    content: '',
    featuredImage: project.mainImage ? {
      node: {
        sourceUrl: urlForImage(project.mainImage).width(800).height(600).url(),
        altText: getLocalizedValue(project.mainImage.alt, locale) || getLocalizedValue(project.title, locale, ''),
      },
    } : undefined,
    acfFields: {
      location: getLocalizedValue(project.location, locale, ''),
      projectType: getLocalizedValue(project.category, locale, ''),
    },
  }));

  // Transform all services for navigation
  const transformedServices: Service[] = allServices.map((s: any) => ({
    id: s._id,
    databaseId: 0,
    title: getLocalizedValue(s.title, locale, ''),
    slug: s.slug?.current || '',
    excerpt: getLocalizedValue(s.excerpt, locale, ''),
    content: '',
    featuredImage: s.mainImage ? {
      node: {
        sourceUrl: urlForImage(s.mainImage).width(400).height(300).url(),
        altText: getLocalizedValue(s.mainImage.alt, locale) || getLocalizedValue(s.title, locale, ''),
      },
    } : undefined,
  }));

  // Transform industries (for related industries display)
  const transformedIndustries: Industry[] = allIndustries.map((i: any) => ({
    id: i._id,
    databaseId: 0,
    title: getLocalizedValue(i.title, locale, ''),
    slug: i.slug?.current || '',
    excerpt: getLocalizedValue(i.excerpt, locale, ''),
    content: '',
    featuredImage: i.mainImage ? {
      node: {
        sourceUrl: urlForImage(i.mainImage).width(400).height(300).url(),
        altText: getLocalizedValue(i.mainImage.alt, locale) || getLocalizedValue(i.title, locale, ''),
      },
    } : undefined,
  }));

  return (
    <>
      <Header />
      <EnhancedServiceDetail
        service={transformedService}
        relatedIndustries={transformedIndustries.slice(0, 3)}
        relatedProjects={relatedProjects}
        allServices={transformedServices}
      />
      <LogoMarquee />
      <Footer />
    </>
  );
}
