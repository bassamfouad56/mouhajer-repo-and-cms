import { Metadata } from 'next';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { LogoMarquee } from '@/components/logo-marquee';
import LuxuryHospitalityContent from './luxury-hospitality-content';

// Use dynamic rendering to speed up build
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Luxury Hospitality | MIDC - The Art of the Live Renovation',
  description: 'Upgrading your asset while protecting your guest experience. MIDC specializes in Live Environment Renovations for 5-star hotels.',
};

export default function LuxuryHospitalityPage() {
  return (
    <>
      <Header />
      <LuxuryHospitalityContent />
      <LogoMarquee />
      <Footer />
    </>
  );
}
