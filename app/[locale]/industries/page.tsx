import { Metadata } from 'next';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { FAQSection } from '@/components/sections/faq';
import { getIndustries, getServices, getProjects } from '@/lib/wordpress';
import EnhancedIndustriesPageContent from './enhanced-industries-page-content';

export const metadata: Metadata = {
  title: 'Industries We Serve | Mouhajer Design Studio',
  description: 'Bringing expertise and innovation across diverse sectors including residential, commercial, hospitality, retail, healthcare, education, and more.',
};

export const revalidate = 3600;

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function IndustriesPage({ params }: Props) {
  const { locale } = await params;

  const [industries, services, projects] = await Promise.all([
    getIndustries(locale),
    getServices(locale),
    getProjects(locale),
  ]);

  return (
    <>
      <Header />
      <EnhancedIndustriesPageContent
        industries={industries}
        services={services}
        projects={projects}
      />
      <Footer />
    </>
  );
}
