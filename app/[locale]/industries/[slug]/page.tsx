import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { LogoMarquee } from '@/components/logo-marquee';
import { client } from '@/sanity/lib/client';
import { industryBySlugQuery, industriesQuery } from '@/sanity/lib/queries';
import { urlForImage } from '@/sanity/lib/image';
import { getLocalizedValue } from '@/lib/error-handling';
import EnhancedIndustryDetail from './enhanced-industry-detail';
import ResidentialContent from './residential-content';
import CommercialContent from './commercial-content';

export const revalidate = 3600;

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

async function getIndustry(slug: string, locale: string) {
  try {
    const result = await client.fetch(industryBySlugQuery, { slug, locale });
    return result;
  } catch (error) {
    console.error('Error fetching industry from Sanity:', error);
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { locale, slug } = await params;

    // Custom metadata for residential page
    if (slug === 'residential') {
      return {
        title: 'Private Sanctuaries | Luxury Residential Design | MIDC',
        description: 'A home designed for your status. Built for your peace. Over 25 years of creating exclusive private villas and penthouses in Dubai\'s most prestigious communities.',
        keywords: ['luxury residential', 'private villa', 'penthouse design', 'Dubai', 'interior design', 'high-end homes'],
      };
    }

    // Custom metadata for commercial page
    if (slug === 'commercial') {
      return {
        title: 'Defining Business Environments | Commercial & Corporate | MIDC',
        description: 'Engineered for performance. Designed for the brand. Fast-track commercial fit-outs with in-house joinery and MEP teams in Dubai.',
        keywords: ['commercial fit-out', 'office design', 'corporate headquarters', 'retail fit-out', 'Dubai', 'business interiors'],
      };
    }

    const industry = await getIndustry(slug, locale);

    if (!industry) {
      return {
        title: 'Industry Not Found | MIDC',
      };
    }

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
  } catch (error) {
    console.error('Error in generateMetadata:', error);
    return {
      title: 'Industry | MIDC',
    };
  }
}

export async function generateStaticParams() {
  // Pre-generate pages for known industry slugs
  try {
    const industries = await client.fetch(`*[_type == "industry"]{ "slug": slug.current }`);
    if (industries && industries.length > 0) {
      return industries
        .filter((i: any) => i.slug)
        .map((i: any) => ({ slug: i.slug }));
    }
  } catch (error) {
    console.error('Error generating static params for industries:', error);
  }
  return [];
}

export const dynamicParams = true;

function getSafeImageUrl(image: any, width: number, height: number): string {
  if (!image) return '';
  try {
    const builder = urlForImage(image);
    if (!builder) return '';
    return builder.width(width).height(height).url() || '';
  } catch {
    return '';
  }
}

export default async function IndustryDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  const industry = await getIndustry(slug, locale);

  if (!industry) {
    notFound();
  }

  // Get all industries for navigation
  let allIndustries: any[] = [];
  try {
    allIndustries = await client.fetch(industriesQuery, { locale }) || [];
  } catch {
    allIndustries = [];
  }

  const industryTitle = getLocalizedValue(industry.title, locale, 'Industry');
  const industryExcerpt = getLocalizedValue(industry.excerpt, locale, '');

  // Get content from Sanity (it might be a PortableText array or string)
  let industryContent = '';
  if (industry.content) {
    if (typeof industry.content === 'string') {
      industryContent = industry.content;
    } else if (Array.isArray(industry.content)) {
      // PortableText array - convert to simple text for now
      industryContent = industry.content
        .filter((block: any) => block._type === 'block')
        .map((block: any) =>
          block.children?.map((child: any) => child.text || '').join('') || ''
        )
        .join('\n');
    }
  }

  const transformedIndustry = {
    id: industry._id || '',
    databaseId: 0,
    title: industryTitle,
    slug: industry.slug?.current || slug,
    excerpt: industryExcerpt,
    content: industryContent,
    date: industry._createdAt || new Date().toISOString(),
    modified: industry._updatedAt || new Date().toISOString(),
    featuredImage: {
      node: {
        sourceUrl: getSafeImageUrl(industry.mainImage, 1920, 1080),
        altText: getLocalizedValue(industry.mainImage?.alt, locale) || industryTitle,
      },
    },
    acfFields: {
      challenges: (industry.challenges || []).map((c: any) => ({
        title: getLocalizedValue(c?.title, locale, ''),
        description: getLocalizedValue(c?.description, locale, ''),
      })),
      solutions: (industry.solutions || []).map((s: any) => ({
        title: getLocalizedValue(s?.title, locale, ''),
        description: getLocalizedValue(s?.description, locale, ''),
      })),
      relatedProjects: (industry.relatedProjects || []).map((p: any) => p?._id).filter(Boolean),
      relatedServices: (industry.relatedServices || []).map((s: any) => s?._id).filter(Boolean),
    },
  };

  const relatedServices = (industry.relatedServices || [])
    .filter((s: any) => s?._id && s?.slug?.current)
    .map((s: any) => ({
      id: s._id,
      title: getLocalizedValue(s.title, locale, ''),
      slug: s.slug.current,
      excerpt: '',
      featuredImage: {
        node: {
          sourceUrl: getSafeImageUrl(s.mainImage, 800, 600),
          altText: getLocalizedValue(s.title, locale, ''),
        },
      },
    }));

  const relatedProjects = (industry.relatedProjects || [])
    .filter((p: any) => p?._id && p?.slug?.current)
    .map((p: any) => ({
      id: p._id,
      title: getLocalizedValue(p.title, locale, ''),
      slug: p.slug.current,
      acfFields: {
        projectType: getLocalizedValue(p.category, locale, ''),
        location: getLocalizedValue(p.location, locale, ''),
      },
      featuredImage: {
        node: {
          sourceUrl: getSafeImageUrl(p.mainImage, 800, 600),
          altText: getLocalizedValue(p.title, locale, ''),
        },
      },
    }));

  const transformedAllIndustries = (allIndustries || [])
    .filter((i: any) => i?._id && i?.slug?.current)
    .map((i: any) => ({
      id: i._id,
      title: getLocalizedValue(i.title, locale, ''),
      slug: i.slug.current,
      excerpt: getLocalizedValue(i.excerpt, locale, ''),
      featuredImage: {
        node: {
          sourceUrl: getSafeImageUrl(i.mainImage, 400, 300),
          altText: getLocalizedValue(i.title, locale, ''),
        },
      },
    }));

  // Use custom content component for residential
  if (slug === 'residential') {
    return (
      <>
        <Header />
        <ResidentialContent />
        <LogoMarquee />
        <Footer />
      </>
    );
  }

  // Use custom content component for commercial
  if (slug === 'commercial') {
    return (
      <>
        <Header />
        <CommercialContent />
        <LogoMarquee />
        <Footer />
      </>
    );
  }

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
