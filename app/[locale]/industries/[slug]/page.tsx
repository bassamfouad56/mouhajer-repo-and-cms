import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { getIndustries, getServices, getProjects, Industry } from '@/lib/wordpress';
import EnhancedIndustryDetail from './enhanced-industry-detail';

export const revalidate = 3600;

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const industries = await getIndustries(locale);
  const industry = industries.find((i: Industry) => i.slug === slug);

  if (!industry) {
    return {
      title: 'Industry Not Found | Mouhajer Design Studio',
    };
  }

  return {
    title: `${industry.title} | Industries | Mouhajer Design Studio`,
    description: industry.excerpt || `Explore our ${industry.title} design expertise and portfolio.`,
  };
}

export async function generateStaticParams() {
  const locales = ['en', 'ar'];
  const paths = [];

  for (const locale of locales) {
    const industries = await getIndustries(locale);
    for (const industry of industries) {
      paths.push({
        locale,
        slug: industry.slug,
      });
    }
  }

  return paths;
}

export default async function IndustryDetailPage({ params }: Props) {
  const { locale, slug } = await params;

  const [industries, services, projects] = await Promise.all([
    getIndustries(locale),
    getServices(locale),
    getProjects(locale),
  ]);

  const industry = industries.find((i: Industry) => i.slug === slug);

  if (!industry) {
    notFound();
  }

  // Filter related services and projects
  const relatedServices = services.filter(s =>
    industry.acfFields?.relatedServices?.includes(s.id)
  );

  const relatedProjects = projects.filter(p =>
    p.acfFields?.services?.includes(industry.id) ||
    industry.acfFields?.relatedProjects?.includes(p.id)
  );

  return (
    <>
      <Header />
      <EnhancedIndustryDetail
        industry={industry}
        relatedServices={relatedServices}
        relatedProjects={relatedProjects}
        allIndustries={industries}
      />
      <Footer />
    </>
  );
}
