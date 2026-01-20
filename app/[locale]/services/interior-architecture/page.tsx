import { Metadata } from 'next';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { LogoMarquee } from '@/components/logo-marquee';
import { client } from '@/sanity/lib/client';
import { serviceBySlugQuery } from '@/sanity/lib/queries';
import { urlForImage } from '@/sanity/lib/image';
import InteriorArchitectureContent from './interior-architecture-content';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Interior Architecture & Design | MIDC - The Uncluttered Baroque',
  description: 'Where Arabic grandeur meets European architectural discipline. Led by Eng. Maher Mouhajer, our award-winning design studio creates spaces that are both breathtaking and buildable.',
};

async function getServiceData(locale: string) {
  try {
    const service = await client.fetch(serviceBySlugQuery, { slug: 'interior-architecture', locale });
    return service;
  } catch (error) {
    console.error('Error fetching interior architecture service:', error);
    return null;
  }
}

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function InteriorArchitecturePage({ params }: Props) {
  const { locale } = await params;
  const service = await getServiceData(locale);

  const heroImage = service?.mainImage
    ? urlForImage(service.mainImage)?.width(1920).height(1080).url()
    : null;

  return (
    <>
      <Header />
      <InteriorArchitectureContent heroImage={heroImage} />
      <LogoMarquee />
      <Footer />
    </>
  );
}
