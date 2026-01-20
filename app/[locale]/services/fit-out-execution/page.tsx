import { Metadata } from 'next';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { LogoMarquee } from '@/components/logo-marquee';
import { client } from '@/sanity/lib/client';
import { serviceBySlugQuery } from '@/sanity/lib/queries';
import { urlForImage } from '@/sanity/lib/image';
import FitOutExecutionContent from './fit-out-execution-content';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Fit-Out Execution | MIDC - The Craftsmen',
  description: 'Where design becomes reality. Our multi-trade installation teams execute the final fit-out with precision timing, zero tolerance for defects, and absolute respect for the client\'s timeline.',
};

async function getServiceData(locale: string) {
  try {
    const service = await client.fetch(serviceBySlugQuery, { slug: 'fit-out-execution', locale });
    return service;
  } catch (error) {
    console.error('Error fetching fit-out execution service:', error);
    return null;
  }
}

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function FitOutExecutionPage({ params }: Props) {
  const { locale } = await params;
  const service = await getServiceData(locale);

  const heroImage = service?.mainImage
    ? urlForImage(service.mainImage)?.width(1920).height(1080).url()
    : null;

  return (
    <>
      <Header />
      <FitOutExecutionContent heroImage={heroImage} />
      <LogoMarquee />
      <Footer />
    </>
  );
}
