import { Metadata } from 'next';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { FAQSection } from '@/components/sections/faq';
import { getProjects, getIndustries } from '@/lib/wordpress';
import EnhancedProjectsPageContent from './enhanced-projects-page-content';
import { projectsFAQs } from '@/lib/faq-data';

export const metadata: Metadata = {
  title: 'Our Projects | Mouhajer Design Studio',
  description: 'Explore our portfolio of residential, commercial, and hospitality design projects across the Middle East.',
};

export const revalidate = 3600;

export default async function ProjectsPage() {
  const [projects, industries] = await Promise.all([
    getProjects(),
    getIndustries(),
  ]);

  return (
    <>
      <Header />
      <EnhancedProjectsPageContent projects={projects} industries={industries} />
      <FAQSection faqs={projectsFAQs} variant="light" />
      <Footer />
    </>
  );
}
