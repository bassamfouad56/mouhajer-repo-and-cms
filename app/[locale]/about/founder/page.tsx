import { Metadata } from 'next';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { FounderHero } from '@/components/founder/founder-hero';
import { DualitiesSection } from '@/components/founder/dualities-section';
import { UnitySection } from '@/components/founder/unity-section';
import { StandardsSection } from '@/components/founder/standards-section';

// Use dynamic rendering to speed up build
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'The Founder | Eng. Maher Mouhajer | MIDC',
  description: 'Discover the visionary behind MIDC - Eng. Maher Mouhajer. A design philosophy defined by dualities: European precision and Arabian warmth. Curating visual splendor for the Middle East\'s most discerning clientele.',
  openGraph: {
    title: 'The Founder | Eng. Maher Mouhajer | MIDC',
    description: 'The Mind Behind the Masterpiece - Eng. Maher Mouhajer\'s philosophy of blending European precision with Arabian warmth.',
    images: [
      {
        url: '/founder/CID_2106_00_COVER.jpg',
        width: 1200,
        height: 630,
        alt: 'Eng. Maher Mouhajer - CEO & Founder of MIDC',
      },
    ],
  },
};

export default function FounderPage() {
  return (
    <>
      <Header />
      <main className="relative">
        {/* Hero Section - Eng. Maher on site with team, drone shot */}
        <FounderHero />

        {/* Section 1: Defined by Dualities - Design Philosophy */}
        <DualitiesSection />

        {/* Section 2: Unity is Strength - Leadership & In-house Teams */}
        <UnitySection />

        {/* Section 3: Allergic to Average - The MIDC Standard */}
        <StandardsSection />
      </main>
      <Footer />
    </>
  );
}
