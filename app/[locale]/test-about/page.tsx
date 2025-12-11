import { Metadata } from 'next';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { TestFounderHero } from '@/components/founder/test-founder-hero';
import { DualitiesSection } from '@/components/founder/dualities-section';
import { UnitySection } from '@/components/founder/unity-section';
import { StandardsSection } from '@/components/founder/standards-section';

export const metadata: Metadata = {
  title: 'The Founder | Eng. Maher Mouhajer | MIDC',
  description: 'Discover the visionary behind MIDC - Eng. Maher Mouhajer. A design philosophy defined by dualities: European precision and Arabian warmth. Curating visual splendor for the Middle East\'s most discerning clientele.',
};

export default function TestAboutPage() {
  return (
    <>
      <Header />
      <main className="relative">
        {/* Hero Section - Eng. Maher on site with team, drone shot */}
        <TestFounderHero />

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
