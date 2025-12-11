import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { LogoMarquee } from '@/components/logo-marquee';
import { client } from '@/sanity/lib/client';
import { projectBySlugQuery, projectsQuery } from '@/sanity/lib/queries';
import { urlForImage } from '@/sanity/lib/image';
import { EnhancedProjectPageClient } from './enhanced-project-page';
import { getLocalizedValue } from '@/lib/error-handling';

export const revalidate = 3600;

interface PageProps {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

async function getProject(slug: string, locale: string) {
  try {
    const project = await client.fetch(projectBySlugQuery, { slug, locale });
    return project;
  } catch (error) {
    console.error('Error fetching project from Sanity:', error);
    return null;
  }
}

// Skip static generation at build time - use ISR instead
// Pages will be generated on-demand and cached
export async function generateStaticParams() {
  return [];
}

// Allow dynamic params for on-demand generation
export const dynamicParams = true;

// Generate metadata
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = await getProject(slug, locale);

  if (!project) {
    return {
      title: 'Project Not Found',
    };
  }

  // Get localized values
  const projectTitle = getLocalizedValue(project.title, locale, 'Project');
  const projectExcerpt = getLocalizedValue(project.excerpt, locale, '');
  const projectCategory = getLocalizedValue(project.category, locale, '');

  // Use SEO fields from Sanity if available, otherwise fall back to defaults
  const seo = project.seo || {};
  const title = getLocalizedValue(seo.metaTitle, locale) || `${projectTitle} | MIDC Projects`;
  const description = getLocalizedValue(seo.metaDescription, locale) || projectExcerpt || `Explore our ${projectTitle} project showcasing luxury ${projectCategory.toLowerCase()} design and construction excellence.`;
  const keywords = seo.keywords || [];

  return {
    title,
    description,
    keywords: keywords.length > 0 ? keywords : undefined,
    openGraph: {
      title,
      description,
    },
  };
}

export default async function ProjectPage({ params }: PageProps) {
  const { locale, slug } = await params;
  const project = await getProject(slug, locale);

  if (!project) {
    notFound();
  }

  // Get localized values for all text fields
  const projectTitle = getLocalizedValue(project.title, locale, 'Project');
  const projectExcerpt = getLocalizedValue(project.excerpt, locale, '');
  const projectLocation = getLocalizedValue(project.location, locale, 'Dubai, UAE');
  const projectCategory = getLocalizedValue(project.category, locale, 'Luxury Development');
  const projectClient = getLocalizedValue(project.client, locale, '');

  // Transform gallery images from Sanity to the expected format
  const galleryImages = (project.gallery || []).map((img: any) => {
    const imageUrl = img ? urlForImage(img)?.width(1600).height(1200).url() : null;
    return imageUrl ? {
      sourceUrl: imageUrl,
      altText: getLocalizedValue(img.alt, locale) || projectTitle,
    } : null;
  }).filter(Boolean);

  // Get featured image URL
  const featuredImageUrl = project.mainImage
    ? urlForImage(project.mainImage)?.width(1920).height(1080).url()
    : '';

  // Transform Sanity project to format expected by EnhancedProjectPageClient
  const transformedProject = {
    id: project._id,
    databaseId: 0,
    title: projectTitle,
    slug: project.slug.current,
    excerpt: projectExcerpt,
    date: project.publishedAt,
    modified: project.publishedAt,
    content: `
      <h2>Project Overview</h2>
      <p>${projectExcerpt || 'A premium project showcasing exceptional design and construction quality.'}</p>

      <h2>Location</h2>
      <p>${projectLocation}</p>

      <h2>Category</h2>
      <p>${projectCategory}</p>

      ${projectClient ? `<h2>Client</h2><p>${projectClient}</p>` : ''}
    `,
    featuredImage: {
      node: {
        sourceUrl: featuredImageUrl || '',
        altText: getLocalizedValue(project.mainImage?.alt, locale) || projectTitle,
      },
    },
    acfFields: {
      location: projectLocation,
      projectType: projectCategory,
      yearCompleted: project.year ? String(project.year) : '',
      client: projectClient,
      area: project.area ? String(project.area) : '',
      scope: '',
      duration: '',
      size: '',
      features: [],
      challenges: [],
      results: [],
      gallery: galleryImages,
      // Include related services and industries with localized titles
      services: (project.services || []).map((s: any) => ({
        id: s._id,
        title: getLocalizedValue(s.title, locale, ''),
        slug: s.slug?.current,
      })),
      industries: (project.industries || []).map((i: any) => ({
        id: i._id,
        title: getLocalizedValue(i.title, locale, ''),
        slug: i.slug?.current,
      })),
    },
    // Keep Sanity data for image rendering
    _sanityData: project,
  };

  return (
    <>
      <Header />
      <EnhancedProjectPageClient project={transformedProject} />
      <LogoMarquee />
      <Footer />
    </>
  );
}
