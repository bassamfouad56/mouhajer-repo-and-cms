import { Metadata } from 'next';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { LogoMarquee } from '@/components/logo-marquee';
import MEPEngineeringContent from './mep-engineering-content';

// Use dynamic rendering to speed up build
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'MEP Engineering | MIDC - The Invisible Art',
  description: 'Perfect comfort. Zero noise. Absolute efficiency. Our in-house MEP Division ensures your asset runs silently and efficiently.',
};

export default function MEPEngineeringPage() {
  return (
    <>
      <Header />
      <MEPEngineeringContent />
      <LogoMarquee />
      <Footer />
    </>
  );
}
