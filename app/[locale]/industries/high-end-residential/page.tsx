import { Metadata } from 'next';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { LogoMarquee } from '@/components/logo-marquee';
import HighEndResidentialContent from './high-end-residential-content';

// Use dynamic rendering to speed up build
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'High-End Residential | MIDC - Private Sanctuaries',
  description: 'A home designed for your status. Built for your peace. MIDC delivers turnkey luxury villas and penthouses with absolute discretion.',
};

export default function HighEndResidentialPage() {
  return (
    <>
      <Header />
      <HighEndResidentialContent />
      <LogoMarquee />
      <Footer />
    </>
  );
}
