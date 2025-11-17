import { Metadata } from 'next';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { FAQSection } from '@/components/sections/faq';
import { getServices, getIndustries } from '@/lib/wordpress';
import ServicesPageContent from './services-page-content';
import { servicesFAQs } from '@/lib/faq-data';

export const metadata: Metadata = {
  title: 'Our Services | Mouhajer Design Studio',
  description: 'Comprehensive design services from concept to completion. Interior design, space planning, custom furniture, lighting design, and more.',
};

export const revalidate = 3600;

export default async function ServicesPage() {
  const [services, industries] = await Promise.all([
    getServices(),
    getIndustries(),
  ]);

  return (
    <>
      <Header />
      <ServicesPageContent services={services} industries={industries} />
      <FAQSection faqs={servicesFAQs} variant="light" />
      <Footer />
    </>
  );
}
