import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getJobBySlug, getAllJobSlugs } from '../jobs-data';
import JobDetailContent from './job-detail-content';

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

// Skip static generation at build time - use ISR instead
// Pages will be generated on-demand and cached
export async function generateStaticParams() {
  return [];
}

// Allow dynamic params for on-demand generation
export const dynamicParams = true;
export const revalidate = 3600;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const job = getJobBySlug(slug);

  if (!job) {
    return {
      title: 'Job Not Found | MIDC Careers',
    };
  }

  return {
    title: `${job.title} | MIDC Careers`,
    description: job.description,
    openGraph: {
      title: `${job.title} - Join Our Team | MIDC`,
      description: job.description,
    },
  };
}

export default async function JobDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const job = getJobBySlug(slug);

  if (!job) {
    notFound();
  }

  return <JobDetailContent job={job} />;
}
