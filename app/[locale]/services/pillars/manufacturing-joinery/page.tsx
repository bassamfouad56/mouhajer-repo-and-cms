import { Metadata } from 'next';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import ManufacturingJoineryContent from './manufacturing-joinery-content';

export const metadata: Metadata = {
  title: 'Manufacturing & Joinery | MIDC - The Mouhajer Factory',
  description: 'Luxury cannot be bought from a catalogue. It must be crafted. Our in-house joinery factory in Sharjah employs 70+ master craftsmen producing bespoke millwork, custom cabinetry, and one-of-a-kind furniture for ultra-luxury interiors.',
};

export default function ManufacturingJoineryPage() {
  return (
    <>
      <Header />
      <ManufacturingJoineryContent />
      <Footer />
    </>
  );
}
