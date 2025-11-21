import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Hero } from '@/components/sections/hero';
import { Projects3DCarousel } from '@/components/sections/projects-3d-carousel';
import { Services } from '@/components/sections/services';
import { Industries } from '@/components/sections/industries';
import { Process } from '@/components/sections/process';
import { About } from '@/components/sections/about';
import { Testimonials } from '@/components/sections/testimonials';
import { Team } from '@/components/sections/team';
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
        <Projects3DCarousel projects={projects} />
        <Services services={services} />
        <Industries industries={industries} services={services} projects={projects} />
        <Process />
        <About />
        <Testimonials />
        <Team />
        <FAQSection faqs={homeFAQs} variant="light" />
        <Contact />
      </main>

      <Footer />
    </>
  );
}
