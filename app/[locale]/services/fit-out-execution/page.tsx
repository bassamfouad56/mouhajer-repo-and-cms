import { Metadata } from 'next';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { LogoMarquee } from '@/components/logo-marquee';
import FitOutExecutionContent from './fit-out-execution-content';

// Use dynamic rendering to speed up build
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Fit-Out Execution | MIDC - The Craftsmen',
  description: 'Where design becomes reality. Our multi-trade installation teams execute the final fit-out with precision timing, zero tolerance for defects, and absolute respect for the client&apos;s timeline.',
};

export default function FitOutExecutionPage() {
  return (
    <>
      <Header />
      <FitOutExecutionContent />
      <LogoMarquee />
      <Footer />
    </>
  );
}
