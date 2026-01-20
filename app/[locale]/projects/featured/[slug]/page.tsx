import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { client } from '@/sanity/lib/client';
import { featuredProjectBySlugQuery } from '@/sanity/lib/queries';
import { urlForImage } from '@/sanity/lib/image';
import { getLocalizedValue } from '@/lib/error-handling';
import { FeaturedProjectTemplate } from '@/components/projects/featured';
import type { FeaturedProjectData, GalleryImage } from '@/components/projects/featured';

export const revalidate = 3600;

interface PageProps {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

// Fetch featured project with all extended fields
async function getFeaturedProject(slug: string, locale: string) {
  try {
    const project = await client.fetch(featuredProjectBySlugQuery, { slug, locale });
    return project;
  } catch (error) {
    console.error('Error fetching featured project from Sanity:', error);
    return null;
  }
}

// Transform Sanity featured project to FeaturedProjectData format
function transformToFeaturedProjectData(project: any, locale: string): FeaturedProjectData {
  // Transform gallery images
  const galleryImages: GalleryImage[] = (project.gallery || []).map((img: any) => {
    const imageUrl = img?.asset ? urlForImage(img)?.width(1920).height(1280).url() : null;
    return imageUrl ? {
      url: imageUrl,
      alt: getLocalizedValue(img.alt, locale) || '',
      caption: getLocalizedValue(img.caption, locale) || '',
      category: img.category,
    } : null;
  }).filter(Boolean);

  // Get main image URL
  const mainImageUrl = project.mainImage
    ? urlForImage(project.mainImage)?.width(1920).height(1080).url() ?? null
    : null;

  return {
    id: project._id,
    title: project.title,
    slug: project.slug?.current || '',
    excerpt: project.excerpt,
    mainImage: mainImageUrl,
    videoUrl: project.videoUrl,
    gallery: galleryImages,
    year: project.year,
    area: project.area,
    status: project.status,
    client: project.client,
    duration: project.duration,
    budget: project.budget,
    units: project.units,
    challenge: project.challenge,
    approach: project.approach,
    scope: project.scope,
    outcome: project.outcome,
    testimonial: project.testimonial,
    featuredContent: project.featuredContent,
    sector: project.sector,
    projectType: project.projectType,
    location: project.location,
    services: project.services,
    tags: project.tags,
    relatedFeaturedProjects: (project.relatedFeaturedProjects || []).map((p: any) => ({
      id: p._id,
      title: p.title,
      slug: p.slug?.current,
      mainImage: p.mainImage ? urlForImage(p.mainImage)?.width(800).height(600).url() : null,
    })),
    allFeaturedProjects: (project.allFeaturedProjects || []).map((p: any) => ({
      id: p._id,
      slug: p.slug?.current,
    })),
  };
}

// Generate metadata
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = await getFeaturedProject(slug, locale);

  if (!project) {
    return {
      title: 'Featured Project Not Found',
    };
  }

  const projectTitle = getLocalizedValue(project.title, locale, 'Featured Project');
  const projectExcerpt = getLocalizedValue(project.excerpt, locale, '');

  // Use SEO fields from Sanity if available
  const seo = project.seo || {};
  const title = getLocalizedValue(seo.metaTitle, locale) || `${projectTitle} | MIDC Featured Project`;
  const description = getLocalizedValue(seo.metaDescription, locale) || projectExcerpt || `Discover ${projectTitle} - a signature project showcasing MIDC's excellence in luxury design and construction.`;
  const keywords = seo.keywords || [];

  return {
    title,
    description,
    keywords: keywords.length > 0 ? keywords : undefined,
    openGraph: {
      title,
      description,
      type: 'article',
    },
  };
}

export default async function FeaturedProjectPage({ params }: PageProps) {
  const { locale, slug } = await params;
  const project = await getFeaturedProject(slug, locale);

  if (!project) {
    notFound();
  }

  const featuredProjectData = transformToFeaturedProjectData(project, locale);

  return (
    <>
      <Header />
      <FeaturedProjectTemplate project={featuredProjectData} locale={locale} />
      <Footer />
    </>
  );
}
