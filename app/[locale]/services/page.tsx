import { Metadata } from 'next';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { LogoMarquee } from '@/components/logo-marquee';
import ServicesPageContent from './services-page-content';
import { client } from '@/sanity/lib/client';
import { servicesQuery, featuredProjectsQuery, siteSettingsQuery } from '@/sanity/lib/queries';
import { urlForImage } from '@/sanity/lib/image';

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

async function getSiteSettings() {
  try {
    const settings = await client.fetch(siteSettingsQuery);
    if (!settings) return { heroImage: '' };

    const getImageUrl = (image: any, width = 1920, height = 1080): string => {
      if (!image?.asset) return '';
      try {
        return urlForImage(image)
          .width(width)
          .height(height)
          .auto('format')
          .url();
      } catch {
        return '';
      }
    };

    return {
      heroImage: getImageUrl(settings.heroImage, 2560, 1440),
      aboutImage: getImageUrl(settings.aboutImage, 1600, 1000),
    };
  } catch (error) {
    console.error('Error fetching site settings from Sanity:', error);
    return { heroImage: '' };
  }
}

export default async function ServicesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const [services, projects, siteSettings] = await Promise.all([
    getServices(locale),
    getFeaturedProjects(locale),
    getSiteSettings(),
  ]);

  return (
    <>
      <Header />
      <ServicesPageContent
        services={services}
        projects={projects}
        locale={locale}
        heroImage={siteSettings.heroImage}
      />
      <LogoMarquee />
      <Footer />
    </>
  );
}
