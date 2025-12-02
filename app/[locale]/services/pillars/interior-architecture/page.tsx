import { Metadata } from 'next';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import InteriorArchitectureContent from './interior-architecture-content';

export const metadata: Metadata = {
  title: 'Interior Architecture & Design | MIDC - The Uncluttered Baroque',
  description: 'Where Arabic grandeur meets European architectural discipline. Led by Eng. Maher Mouhajer, our award-winning design studio creates spaces that are both breathtaking and buildable.',
};

export default function InteriorArchitecturePage() {
  return (
    <>
      <Header />
      <InteriorArchitectureContent />
      <Footer />
    </>
  );
}
