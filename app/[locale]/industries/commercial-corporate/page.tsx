import { Metadata } from 'next';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { LogoMarquee } from '@/components/logo-marquee';
import CommercialCorporateContent from './commercial-corporate-content';

// Use dynamic rendering to speed up build
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Commercial & Corporate | MIDC - Defining Business Environments',
  description: 'Engineered for performance. Designed for the brand. MIDC delivers fast-track commercial fit-outs with in-house joinery and MEP teams.',
};

export default function CommercialCorporatePage() {
  return (
    <>
      <Header />
      <CommercialCorporateContent />
      <LogoMarquee />
      <Footer />
    </>
  );
}
