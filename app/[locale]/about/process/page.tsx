import { Metadata } from 'next';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { ProcessHero } from '@/components/process/process-hero';
import { OrchestrationSection } from '@/components/process/orchestration-section';
import { PhasesSection } from '@/components/process/phases-section';

// Use dynamic rendering to speed up build
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Our Process | MIDC - From First Sketch to Final Polish',
  description: 'Discover the MIDC Protocol - A methodology built on 25 years of refining the art of delivery. Six phases of integrated precision from discovery to white-glove handover.',
  openGraph: {
    title: 'Our Process | MIDC - From First Sketch to Final Polish',
    description: 'A methodology built on 25 years of refining the art of delivery. We don\'t just build, we orchestrate.',
    images: [
      {
        url: '',
        width: 1200,
        height: 630,
        alt: 'MIDC Process - Integrated Construction Excellence',
      },
    ],
  },
};

export default function ProcessPage() {
  return (
    <>
      <Header />
      <main className="relative">
        {/* Hero Section - From First Sketch to Final Polish */}
        <ProcessHero />

        {/* Orchestration Section - We Don't Just Build, We Orchestrate */}
        <OrchestrationSection />

        {/* All 6 Phases */}
        <PhasesSection />
      </main>
      <Footer />
    </>
  );
}
