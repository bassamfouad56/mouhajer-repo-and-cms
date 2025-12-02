import { Metadata } from 'next';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import FitOutExecutionContent from './fit-out-execution-content';

export const metadata: Metadata = {
  title: 'Fit-Out Execution | MIDC - The Craftsmen',
  description: 'Where design becomes reality. Our multi-trade installation teams execute the final fit-out with precision timing, zero tolerance for defects, and absolute respect for the client&apos;s timeline.',
};

export default function FitOutExecutionPage() {
  return (
    <>
      <Header />
      <FitOutExecutionContent />
      <Footer />
    </>
  );
}
