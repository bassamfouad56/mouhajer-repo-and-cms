import { Metadata } from 'next';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { LogoMarquee } from '@/components/logo-marquee';
import { client } from '@/sanity/lib/client';
import { serviceBySlugQuery } from '@/sanity/lib/queries';
import { urlForImage } from '@/sanity/lib/image';
import CivilConstructionContent from './civil-construction-content';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Civil Construction | MIDC - The Backbone of Luxury',
  description: 'Licensed Main Contractor for heavy civil works. From ground-up construction to complex structural modifications. We build the bones of your luxury asset.',
};

async function getServiceData(locale: string) {
  try {
    const service = await client.fetch(serviceBySlugQuery, { slug: 'civil-construction', locale });
    return service;
  } catch (error) {
    console.error('Error fetching civil-construction service:', error);
    return null;
  }
}

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function CivilConstructionPage({ params }: Props) {
  const { locale } = await params;
  const service = await getServiceData(locale);

  const heroImage = service?.mainImage
    ? urlForImage(service.mainImage)?.width(1920).height(1080).url()
    : null;

  return (
    <>
      <Header />
      <CivilConstructionContent heroImage={heroImage} />
      <LogoMarquee />
      <Footer />
    </>
  );
}
