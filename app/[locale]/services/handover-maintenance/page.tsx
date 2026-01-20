import { Metadata } from 'next';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { LogoMarquee } from '@/components/logo-marquee';
import { client } from '@/sanity/lib/client';
import { serviceBySlugQuery } from '@/sanity/lib/queries';
import { urlForImage } from '@/sanity/lib/image';
import HandoverMaintenanceContent from './handover-maintenance-content';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Handover & Maintenance | MIDC - The Keys & Beyond',
  description: 'We Protect. Our job isn\'t done when we hand over the keys. We provide warranty management, 24/7 defect response, and optional long-term maintenance contracts to protect your investment.',
};

async function getServiceData(locale: string) {
  try {
    const service = await client.fetch(serviceBySlugQuery, { slug: 'handover-maintenance', locale });
    return service;
  } catch (error) {
    console.error('Error fetching handover-maintenance service:', error);
    return null;
  }
}

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HandoverMaintenancePage({ params }: Props) {
  const { locale } = await params;
  const service = await getServiceData(locale);

  const heroImage = service?.mainImage
    ? urlForImage(service.mainImage)?.width(1920).height(1080).url()
    : null;

  return (
    <>
      <Header />
      <HandoverMaintenanceContent heroImage={heroImage} />
      <LogoMarquee />
      <Footer />
    </>
  );
}
