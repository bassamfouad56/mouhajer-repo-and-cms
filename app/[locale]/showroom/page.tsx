import { Metadata } from 'next';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import ShowroomContent from './showroom-content';

export const metadata: Metadata = {
  title: 'Furniture Showroom | Mouhajer Design Studio',
  description: 'Explore our curated collection of luxury furniture. From elegant seating to statement lighting, discover pieces that transform spaces.',
};

export default function ShowroomPage() {
  return (
    <>
      <Header />
      <ShowroomContent />
      <Footer />
    </>
  );
}
