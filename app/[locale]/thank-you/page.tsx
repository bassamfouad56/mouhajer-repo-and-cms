import { Metadata } from 'next';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { LogoMarquee } from '@/components/logo-marquee';
import ThankYouContent from './thank-you-content';

export const metadata: Metadata = {
  title: 'Thank You | MIDC - Consultation Request Received',
  description: 'Your consultation request has been successfully submitted. Our team will contact you within 48 hours.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function ThankYouPage() {
  return (
    <>
      <Header />
      <ThankYouContent />
      <LogoMarquee />
      <Footer />
    </>
  );
}
