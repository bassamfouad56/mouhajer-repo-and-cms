import { Metadata } from 'next';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { LogoMarquee } from '@/components/logo-marquee';
import { client } from '@/sanity/lib/client';
import { industriesQuery, servicesQuery, clientsQuery } from '@/sanity/lib/queries';
import EnhancedIndustriesPageContent from './enhanced-industries-page-content';

export const metadata: Metadata = {
  title: 'Industries We Serve | MIDC - Specialized Expertise',
  description: '25+ years of specialized expertise across Luxury Hospitality, High-End Residential, and Commercial & Corporate sectors. From concept to handover, we deliver excellence in every industry.',
};

export const revalidate = 3600;

type Props = {
  params: Promise<{ locale: string }>;
};

async function getIndustries(locale: string) {
  try {
    const industries = await client.fetch(industriesQuery, { locale });
    // Deduplicate by slug (for i18n variants)
    const seenSlugs = new Set<string>();
    const filteredIndustries = (industries || []).filter(
      (industry: { slug?: { current?: string } }) => {
        const slug = industry.slug?.current || '';
        if (seenSlugs.has(slug)) return false;
        seenSlugs.add(slug);
        return true;
      }
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

async function getClients(locale: string) {
  try {
    const clients = await client.fetch(clientsQuery, { locale });
    return clients || [];
  } catch (error) {
    console.error('Error fetching clients from Sanity:', error);
    return [];
  }
}

export default async function IndustriesPage({ params }: Props) {
  const { locale } = await params;

  const [industries, services, clients] = await Promise.all([
    getIndustries(locale),
    getServices(locale),
    getClients(locale),
  ]);

  return (
    <>
      <Header />
      <EnhancedIndustriesPageContent
        industries={industries}
        services={services}
      />
      <LogoMarquee clients={clients} />
      <Footer />
    </>
  );
}
