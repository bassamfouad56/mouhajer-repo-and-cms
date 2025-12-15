import { Metadata } from 'next';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { LogoMarquee } from '@/components/logo-marquee';
import ServicesPageContent from './services-page-content';
import { client } from '@/sanity/lib/client';
import { servicesQuery, featuredProjectsQuery } from '@/sanity/lib/queries';

export const metadata: Metadata = {
  title: 'Our Services | MIDC - Integrated Construction Excellence',
  description: 'From civil construction to interior architecture, MEP engineering to handover. MIDC delivers the full circle of design, engineering, and execution without splitting the vision.',
};

export const revalidate = 3600;

async function getServices(locale: string) {
  try {
    const services = await client.fetch(servicesQuery, { locale });
    return services || [];
  } catch (error) {
    console.error('Error fetching services from Sanity:', error);
    return [];
  }
}

async function getFeaturedProjects(locale: string) {
  try {
    const projects = await client.fetch(featuredProjectsQuery, { locale });
    return projects || [];
  } catch (error) {
    console.error('Error fetching projects from Sanity:', error);
    return [];
  }
}

export default async function ServicesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const services = await getServices(locale);
  const projects = await getFeaturedProjects(locale);

  return (
    <>
      <Header />
      <ServicesPageContent services={services} projects={projects} locale={locale} />
      <LogoMarquee />
      <Footer />
    </>
  );
}
