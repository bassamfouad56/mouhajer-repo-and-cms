import { Metadata } from 'next';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { LogoMarquee } from '@/components/logo-marquee';
import { client } from '@/sanity/lib/client';
import { projectsQuery, industriesQuery, servicesQuery } from '@/sanity/lib/queries';
import EnhancedProjectsPageContent from './enhanced-projects-page-content';

export const metadata: Metadata = {
  title: 'Our Projects | MIDC - Portfolio of Excellence',
  description: '400+ projects delivered with zero failed handovers. Explore our luxury residential, commercial, and hospitality projects across the UAE. From empty land to final handover, all under one roof.',
};

export const revalidate = 3600;

async function getProjects(locale: string) {
  try {
    const projects = await client.fetch(projectsQuery, { locale });
    return projects || [];
  } catch (error) {
    console.error('Error fetching projects from Sanity:', error);
    return [];
  }
}

async function getIndustries(locale: string) {
  try {
    const industries = await client.fetch(industriesQuery, { locale });
    return industries || [];
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

export default async function ProjectsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const [projects, industries, services] = await Promise.all([
    getProjects(locale),
    getIndustries(locale),
    getServices(locale),
  ]);

  return (
    <>
      <Header />
      <EnhancedProjectsPageContent projects={projects} industries={industries} services={services} locale={locale} />
      <LogoMarquee />
      <Footer />
    </>
  );
}
