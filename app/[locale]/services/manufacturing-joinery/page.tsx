import { Metadata } from 'next';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { LogoMarquee } from '@/components/logo-marquee';
import { client } from '@/sanity/lib/client';
import { serviceBySlugQuery } from '@/sanity/lib/queries';
import { urlForImage } from '@/sanity/lib/image';
import ManufacturingJoineryContent from './manufacturing-joinery-content';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Manufacturing & Joinery | MIDC - The Mouhajer Factory',
  description: 'Luxury cannot be bought from a catalogue. It must be crafted. Our in-house joinery factory in Sharjah employs 70+ master craftsmen producing bespoke millwork, custom cabinetry, and one-of-a-kind furniture for ultra-luxury interiors.',
};

async function getServiceData(locale: string) {
  try {
    const service = await client.fetch(serviceBySlugQuery, { slug: 'manufacturing-joinery', locale });
    return service;
  } catch (error) {
    console.error('Error fetching manufacturing-joinery service:', error);
    return null;
  }
}

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function ManufacturingJoineryPage({ params }: Props) {
  const { locale } = await params;
  const service = await getServiceData(locale);

  const heroImage = service?.mainImage
    ? urlForImage(service.mainImage)?.width(1920).height(1080).url()
    : null;

  return (
    <>
      <Header />
      <ManufacturingJoineryContent heroImage={heroImage} />
      <LogoMarquee />
      <Footer />
    </>
  );
}
