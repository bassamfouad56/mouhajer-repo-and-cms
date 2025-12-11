import { Metadata } from 'next';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { LegacyHero } from '@/components/about/legacy-hero';
import { CompanyStorySection } from '@/components/about/company-story-section';
import { VisionMissionSection } from '@/components/about/vision-mission-section';
import { CoreValuesGrid } from '@/components/about/core-values-grid';

// Use dynamic rendering to speed up build
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'The MIDC Legacy: 25 Years of Excellence | MIDC',
  description: 'Founded in 1999, Mouhajer International Design & Contracting grew with the UAE. Discover our 25-year journey from luxury villas to major hospitality renovations.',
  openGraph: {
    title: 'The MIDC Legacy: 25 Years of Excellence',
    description: 'Over two decades of professionalism at the intersection of design and construction. Discover the MIDC story.',
    images: [
      {
        url: '/about/legacy-og.jpg',
        width: 1200,
        height: 630,
        alt: 'MIDC Legacy - 25 Years of Excellence',
      },
    ],
  },
};

export default function LegacyPage() {
  return (
    <>
      <Header />
      <main className="relative">
        {/* Hero Section - The MIDC Legacy */}
        <LegacyHero />

        {/* Section 1: Company Story - Founded in 1999 */}
        <CompanyStorySection />

        {/* Section 2: Vision, Mission & Commitment */}
        <VisionMissionSection />

        {/* Section 3: Core Values Grid */}
        <CoreValuesGrid />
      </main>
      <Footer />
    </>
  );
}
