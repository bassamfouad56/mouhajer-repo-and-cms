import { Metadata } from 'next';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { ClientsHero } from '@/components/clients/clients-hero';
import { CompanyWeKeep } from '@/components/clients/company-we-keep';
import { HospitalityPartners } from '@/components/clients/hospitality-partners';
import { CorporatePartners } from '@/components/clients/corporate-partners';
import { PrivateCircle } from '@/components/clients/private-circle';
import { ClientTestimonials } from '@/components/clients/client-testimonials';
import {
  getSanityClients,
  getFeaturedTestimonials
} from '@/sanity/lib/fetch';

export const revalidate = 3600; // Revalidate every hour

export const metadata: Metadata = {
  title: 'Our Clients & Partners | MIDC',
  description: 'Trusted by the Visionaries. We do not just have customers. We have enduring partnerships with the leaders shaping the UAE skyline.',
  openGraph: {
    title: 'Our Clients & Partners | MIDC',
    description: 'Enduring partnerships with Abu Dhabi National Hotels, Wasl Asset Management, Emaar Hospitality, and the UAE\'s most prestigious brands.',
    images: [
      {
        url: '/founder/CID_2106_00_COVER.jpg',
        width: 1200,
        height: 630,
        alt: 'MIDC Clients & Partners',
      },
    ],
  },
};

export default async function ClientsPage() {
  // Fetch all data in parallel
  const [clients, testimonials] = await Promise.all([
    getSanityClients(),
    getFeaturedTestimonials(),
  ]);

  // Categorize clients
  const hospitalityClients = clients.filter((c: any) => c.category === 'hospitality');
  const corporateClients = clients.filter((c: any) =>
    ['corporate', 'retail', 'manufacturing'].includes(c.category)
  );
  const privateClients = clients.filter((c: any) =>
    c.category === 'private' || c.isConfidential
  );
  const featuredClients = clients.filter((c: any) => c.featured);

  return (
    <>
      <Header />
      <main className="relative">
        {/* Hero Section */}
        <ClientsHero />

        {/* Section 1: The Company We Keep */}
        <CompanyWeKeep clients={featuredClients} />

        {/* Section 2: Hospitality Partners */}
        <HospitalityPartners clients={hospitalityClients} />

        {/* Section 3: Corporate & Commercial Partners */}
        <CorporatePartners clients={corporateClients} />

        {/* Section 4: Private Circle (VIP Residential) */}
        <PrivateCircle clients={privateClients} />

        {/* Section 5: Client Testimonials */}
        <ClientTestimonials testimonials={testimonials} />
      </main>
      <Footer />
    </>
  );
}
