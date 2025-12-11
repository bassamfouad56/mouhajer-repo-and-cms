import { Metadata } from 'next';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { AwardsHero } from '@/components/awards/awards-hero';
import { ValidationSection } from '@/components/awards/validation-section';
import { AwardsShowcase } from '@/components/awards/awards-showcase';

// Use dynamic rendering to speed up build
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Awards & Recognition | MIDC',
  description: 'MIDC has been recognized globally for excellence in luxury interior design and turnkey construction. View our awards from the International Property Awards and Luxury Lifestyle Awards.',
  openGraph: {
    title: 'Awards & Recognition | MIDC',
    description: 'Celebrating global recognition for excellence in luxury interior design and turnkey construction.',
  },
};

export default function AwardsPage() {
  return (
    <>
      <Header />
      <main className="relative">
        <AwardsHero />
        <ValidationSection />
        <AwardsShowcase />
      </main>
      <Footer />
    </>
  );
}
