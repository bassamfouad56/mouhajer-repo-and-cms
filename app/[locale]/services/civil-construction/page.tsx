import { Metadata } from 'next';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { LogoMarquee } from '@/components/logo-marquee';
import CivilConstructionContent from './civil-construction-content';

// Use dynamic rendering to speed up build
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Civil Construction | MIDC - The Backbone of Luxury',
  description: 'Licensed Main Contractor for heavy civil works. From ground-up construction to complex structural modifications. We build the bones of your luxury asset.',
};

export default function CivilConstructionPage() {
  return (
    <>
      <Header />
      <CivilConstructionContent />
      <LogoMarquee />
      <Footer />
    </>
  );
}
