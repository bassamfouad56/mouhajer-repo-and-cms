import { Metadata } from 'next';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { LogoMarquee } from '@/components/logo-marquee';
import { client } from '@/sanity/lib/client';
import { serviceBySlugQuery } from '@/sanity/lib/queries';
import { urlForImage } from '@/sanity/lib/image';
import MEPEngineeringContent from './mep-engineering-content';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'MEP Engineering | MIDC - The Invisible Art',
  description: 'Perfect comfort. Zero noise. Absolute efficiency. Our in-house MEP Division ensures your asset runs silently and efficiently.',
};

async function getServiceData(locale: string) {
  try {
    const service = await client.fetch(serviceBySlugQuery, { slug: 'mep-engineering', locale });
    return service;
  } catch (error) {
    console.error('Error fetching mep-engineering service:', error);
    return null;
  }
}

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function MEPEngineeringPage({ params }: Props) {
  const { locale } = await params;
  const service = await getServiceData(locale);

  const heroImage = service?.mainImage
    ? urlForImage(service.mainImage)?.width(1920).height(1080).url()
    : null;

  return (
    <>
      <Header />
      <MEPEngineeringContent heroImage={heroImage} />
      <LogoMarquee />
      <Footer />
    </>
  );
}
