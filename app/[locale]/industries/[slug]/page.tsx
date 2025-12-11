import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { LogoMarquee } from '@/components/logo-marquee';
import { client } from '@/sanity/lib/client';
import { industryBySlugQuery, industriesQuery, servicesQuery, projectsQuery } from '@/sanity/lib/queries';
import { urlForImage } from '@/sanity/lib/image';
import { getLocalizedValue } from '@/lib/error-handling';
import EnhancedIndustryDetail from './enhanced-industry-detail';

export const revalidate = 3600;

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

async function getIndustry(slug: string, locale: string) {
  try {
    return await client.fetch(industryBySlugQuery, { slug, locale });
  } catch (error) {
    console.error('Error fetching industry from Sanity:', error);
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const industry = await getIndustry(slug, locale);

  if (!industry) {
    return {
      title: 'Industry Not Found | MIDC',
    };
  }

  // Get localized values
  const industryTitle = getLocalizedValue(industry.title, locale, 'Industry');
  const industryExcerpt = getLocalizedValue(industry.excerpt, locale, '');
  const seoTitle = getLocalizedValue(industry.seo?.metaTitle, locale);
  const seoDescription = getLocalizedValue(industry.seo?.metaDescription, locale);

  const title = seoTitle || `${industryTitle} | Industries | MIDC`;
  const description = seoDescription || industryExcerpt || `Explore our ${industryTitle} design expertise and portfolio.`;

  return {
    title,
    description,
    keywords: industry.seo?.keywords?.length > 0 ? industry.seo.keywords : undefined,
  };
}

// Skip static generation at build time - use ISR instead
// Pages will be generated on-demand and cached
export async function generateStaticParams() {
  return [];
}

// Allow dynamic params for on-demand generation
export const dynamicParams = true;

export default async function IndustryDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  const industry = await getIndustry(slug, locale);

  if (!industry) {
    notFound();
  }

  // Get all industries for navigation
  const allIndustries = await client.fetch(industriesQuery, { locale });

  // Get localized values
  const industryTitle = getLocalizedValue(industry.title, locale, '');
  const industryExcerpt = getLocalizedValue(industry.excerpt, locale, '');

  // Transform Sanity industry to the format expected by EnhancedIndustryDetail
  const transformedIndustry = {
    id: industry._id,
    databaseId: 0,
    title: industryTitle,
    slug: industry.slug.current,
    excerpt: industryExcerpt,
    featuredImage: {
      node: {
        sourceUrl: industry.mainImage ? urlForImage(industry.mainImage)?.width(1920).height(1080).url() : '',
        altText: getLocalizedValue(industry.mainImage?.alt, locale) || industryTitle,
      },
    },
    acfFields: {
      // Include challenges and solutions from Sanity with localized values
      challenges: (industry.challenges || []).map((c: any) => ({
        title: getLocalizedValue(c.title, locale, ''),
        description: getLocalizedValue(c.description, locale, ''),
      })),
      solutions: (industry.solutions || []).map((s: any) => ({
        title: getLocalizedValue(s.title, locale, ''),
        description: getLocalizedValue(s.description, locale, ''),
      })),
      relatedProjects: (industry.relatedProjects || []).map((p: any) => p._id),
      relatedServices: (industry.relatedServices || []).map((s: any) => s._id),
    },
    _sanityData: industry,
  };

  // Transform related services with localized values
  const relatedServices = (industry.relatedServices || []).map((s: any) => ({
    id: s._id,
    title: getLocalizedValue(s.title, locale, ''),
    slug: s.slug?.current,
    excerpt: '',
    featuredImage: {
      node: {
        sourceUrl: s.mainImage ? urlForImage(s.mainImage)?.width(800).height(600).url() : '',
        altText: getLocalizedValue(s.title, locale, ''),
      },
    },
  }));

  // Transform related projects with localized values
  const relatedProjects = (industry.relatedProjects || []).map((p: any) => ({
    id: p._id,
    title: getLocalizedValue(p.title, locale, ''),
    slug: p.slug?.current,
    acfFields: {
      projectType: getLocalizedValue(p.category, locale, ''),
      location: getLocalizedValue(p.location, locale, ''),
    },
    featuredImage: {
      node: {
        sourceUrl: p.mainImage ? urlForImage(p.mainImage)?.width(800).height(600).url() : '',
        altText: getLocalizedValue(p.title, locale, ''),
      },
    },
  }));

  // Transform all industries for navigation with localized values
  const transformedAllIndustries = allIndustries.map((i: any) => ({
    id: i._id,
    title: getLocalizedValue(i.title, locale, ''),
    slug: i.slug.current,
    excerpt: getLocalizedValue(i.excerpt, locale, ''),
    featuredImage: {
      node: {
        sourceUrl: i.mainImage ? urlForImage(i.mainImage)?.width(400).height(300).url() : '',
        altText: getLocalizedValue(i.title, locale, ''),
      },
    },
  }));

  return (
    <>
      <Header />
      <EnhancedIndustryDetail
        industry={transformedIndustry}
        relatedServices={relatedServices}
        relatedProjects={relatedProjects}
        allIndustries={transformedAllIndustries}
      />
      <LogoMarquee />
      <Footer />
    </>
  );
}
