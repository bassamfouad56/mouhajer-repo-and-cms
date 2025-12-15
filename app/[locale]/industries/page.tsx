import { Metadata } from 'next';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { LogoMarquee } from '@/components/logo-marquee';
import { client } from '@/sanity/lib/client';
import { industriesQuery, servicesQuery, projectsQuery } from '@/sanity/lib/queries';
import EnhancedIndustriesPageContent from './enhanced-industries-page-content';

export const metadata: Metadata = {
  title: 'Industries We Serve | MIDC - Specialized Expertise',
  description: '25+ years of specialized expertise across Luxury Hospitality, High-End Residential, and Commercial & Corporate sectors. From concept to handover, we deliver excellence in every industry.',
};

export const revalidate = 3600;

type Props = {
  params: Promise<{ locale: string }>;
};

// Industries to exclude from display
const EXCLUDED_INDUSTRIES = ['healthcare', 'education'];

async function getIndustries(locale: string) {
  try {
    const industries = await client.fetch(industriesQuery, { locale });
    // Filter out excluded industries (healthcare and education)
    const filteredIndustries = (industries || []).filter(
      (industry: { slug?: { current?: string } }) =>
        !EXCLUDED_INDUSTRIES.includes(industry.slug?.current || '')
    );
    return filteredIndustries;
  } catch (error) {
    console.error('Error fetching industries from Sanity:', error);
    return [];
  }
}

async function getServices(locale: string) {
  try {
    const services = await client.fetch(servicesQuery, { locale });
    return services || [];
  } catch (error) {
    console.error('Error fetching services from Sanity:', error);
    return [];
  }
}

async function getProjects(locale: string) {
  try {
    const projects = await client.fetch(projectsQuery, { locale });
    return projects || [];
  } catch (error) {
    console.error('Error fetching projects from Sanity:', error);
    return [];
  }
}

export default async function IndustriesPage({ params }: Props) {
  const { locale } = await params;

  const [industries, services, projects] = await Promise.all([
    getIndustries(locale),
    getServices(locale),
    getProjects(locale),
  ]);

  return (
    <>
      <Header />
      <EnhancedIndustriesPageContent
        industries={industries}
        services={services}
        projects={projects}
      />
      <LogoMarquee />
      <Footer />
    </>
  );
}
