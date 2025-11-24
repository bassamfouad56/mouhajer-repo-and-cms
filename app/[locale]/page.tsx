import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Hero } from '@/components/sections/hero';
import { FeaturedProjects } from '@/components/sections/featured-projects';
import { Services } from '@/components/sections/services';
import { WhyChooseUs } from '@/components/sections/why-choose-us';
import { StatsShowcase } from '@/components/sections/stats-showcase';
import { Industries } from '@/components/sections/industries';
import { Process } from '@/components/sections/process';
import { Testimonials } from '@/components/sections/testimonials';
import { Contact } from '@/components/sections/contact';
import { FAQSection } from '@/components/sections/faq';
import { getProjects, getServices, getIndustries } from '@/lib/wordpress';
import { homeFAQs } from '@/lib/faq-data';

export const revalidate = 3600; // Revalidate every hour

export default async function Home() {
  // Fetch data from WordPress
  const [projects, services, industries] = await Promise.all([
    getProjects(),
    getServices(),
    getIndustries(),
  ]);

  return (
    <>
      <Header />

      <main className="relative">
        <Hero />
        <FeaturedProjects projects={projects} />
        <Services services={services} />
        <WhyChooseUs />
        <StatsShowcase />
        <Industries industries={industries} services={services} projects={projects} />
        <Process />
        <Testimonials />
        <FAQSection faqs={homeFAQs} variant="light" />
        <Contact />
      </main>

      <Footer />
    </>
  );
}
