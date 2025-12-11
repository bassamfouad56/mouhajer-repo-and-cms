'use client';

import { useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, ChevronDown, UserCheck, Shield, Lock, Home, Building2, Factory, Palette } from 'lucide-react';
import { FAQSection } from '@/components/sections/faq';

export default function HighEndResidentialContent() {
  const heroRef = useRef<HTMLDivElement>(null);
  const isHeroInView = useInView(heroRef, { once: true });

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);

  return (
    <main className="relative bg-white">
      {/* Hero Section - VERBATIM from content.md lines 821-825 */}
      <section
        ref={heroRef}
        className="relative h-screen min-h-[700px] max-h-[1000px] overflow-hidden bg-neutral-950"
      >
        {/* Background - Visual Context: A serene, dusk shot of a private villa in Jumeirah Bay */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-neutral-950 to-black" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:80px_80px]" />
        </div>

        {/* Hero Content */}
        <motion.div
          style={{ opacity: heroOpacity, y: heroY }}
          className="relative z-10 flex h-full flex-col items-center justify-center px-6 pt-24 lg:px-12"
        >
          <div className="mx-auto max-w-5xl text-center">
            {/* Subtitle */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mb-8 flex items-center justify-center gap-4"
            >
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-white/40" />
              <span className="font-Satoshi text-xs font-light uppercase tracking-[0.4em] text-white/70">
                High-End Residential
              </span>
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-white/40" />
            </motion.div>

            {/* Main Title - VERBATIM from content.md line 824 */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, delay: 0.5 }}
              className="mb-8 font-SchnyderS text-5xl font-light leading-[1.1] tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl"
            >
              Private
              <br />
              <span className="text-[#d4af37]">Sanctuaries.</span>
            </motion.h1>

            {/* Subheadline - VERBATIM from content.md line 825 */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="mx-auto mb-12 max-w-3xl px-4 font-Satoshi text-lg font-light leading-relaxed text-white/70 sm:px-0 sm:text-xl"
            >
              A home designed for your status. Built for your peace.
            </motion.p>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isHeroInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="flex flex-col items-center gap-2"
          >
            <span className="font-Satoshi text-[10px] font-light tracking-[0.2em] text-white/50">
              DISCOVER OUR EXPERTISE
            </span>
            <ChevronDown className="h-4 w-4 text-white/50" />
          </motion.div>
        </motion.div>
      </section>

      {/* Section 1: Absolute Discretion - VERBATIM from content.md lines 827-836 */}
      <AbsoluteDiscretionSection />

      {/* Section 2: Our Residential Capabilities - VERBATIM from content.md lines 838-846 */}
      <ResidentialCapabilitiesSection />

      {/* Section 3: Case Study - VERBATIM from content.md lines 848-854 */}
      <CaseStudySection />

      {/* Section 4: Client Logos Placeholder */}
      <ClientLogosSection />

      {/* Section 5: Expert Insights FAQ - VERBATIM from content.md lines 857-868 */}
      <FAQSection
        label="Expert Insights"
        title="Addressing"
        titleHighlight="Your Vision"
        subtitle="Professional guidance for private homeowners"
        faqs={[
          {
            question: 'Do I need to hire a separate architect and contractor?',
            answer: 'No, and we advise against it. Hiring separate entities often leads to conflict and delays. With MIDC, you have a single contract. We design the villa, we engineer it, and we build it. If a design detail is expensive, we tell you immediately, not after construction starts.',
          },
          {
            question: 'My villa is in a gated community (District One). Can you work there?',
            answer: "Yes. We are pre-qualified to work in Dubai's most exclusive gated communities, including District One, Jumeirah Bay, and Emirates Hills. We handle all the specific logistics, gate passes, and developer approvals (Meydan, Meraas, Nakheel) so you don't have to.",
          },
          {
            question: 'How do you ensure my privacy?',
            answer: "Privacy is our default setting. We sign strict Non-Disclosure Agreements (NDAs). Your home's location, floor plans, and photos are never shared publicly without your explicit written permission. Our site teams are vetted and trained in discretion.",
          },
        ]}
      />

      {/* Section 6: CTA - VERBATIM from content.md lines 870-872 */}
      <CommissionMasterpieceCTA />
    </main>
  );
}

// Section 1: Absolute Discretion - VERBATIM from content.md lines 827-836
function AbsoluteDiscretionSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  // VERBATIM from lines 832-836
  const services = [
    {
      icon: UserCheck,
      title: 'White-Glove Service',
      description: 'You deal directly with Eng. Maher and a dedicated Senior Project Manager.',
    },
    {
      icon: Shield,
      title: 'Privacy Protocols',
      description: 'We have strict NDA protocols. No photos of your home are published without your explicit permission.',
    },
    {
      icon: Lock,
      title: 'Security Integration',
      description: 'We integrate advanced security systems (CCTV, Biometrics) into the architectural design seamlessly.',
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-white py-32 sm:py-40 lg:py-48"
    >
      <div className="mx-auto max-w-[1600px] px-6 lg:px-12 xl:px-16">
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-20">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-12"
          >
            <div className="mb-8">
              <div className="mb-2 h-px w-16 bg-neutral-900" />
              <span className="font-Satoshi text-[10px] font-medium uppercase tracking-[0.3em] text-neutral-400">
                Section 1
              </span>
            </div>

            {/* VERBATIM headline from line 828 */}
            <h2 className="mb-10 font-SchnyderS text-5xl font-light leading-[1.05] tracking-tight text-neutral-950 sm:text-6xl lg:text-7xl">
              Absolute
              <br />
              <span className="text-[#d4af37]">Discretion.</span>
            </h2>

            {/* VERBATIM content from lines 830-831 */}
            <div className="max-w-4xl space-y-6 font-Satoshi text-lg font-light leading-relaxed text-neutral-600 lg:text-xl">
              <p>
                For over 25 years, Eng. Maher Mouhajer has been the secret architect behind some of the region's most exclusive addresses. We understand that for our VIP clients, privacy is the ultimate luxury.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Service Cards - VERBATIM from lines 832-836 */}
        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                className="group relative overflow-hidden border border-neutral-200 bg-neutral-50 p-8 transition-all duration-500 hover:border-[#d4af37] hover:bg-white hover:shadow-2xl hover:shadow-neutral-900/10"
              >
                <Icon className="mb-6 h-12 w-12 text-[#d4af37]" />
                <h3 className="mb-4 font-SchnyderS text-2xl font-light leading-tight text-neutral-950">
                  {service.title}
                </h3>
                <p className="font-Satoshi text-sm font-light leading-relaxed text-neutral-600">
                  {service.description}
                </p>
                <div className="absolute bottom-0 left-0 h-1 w-0 bg-[#d4af37] transition-all duration-500 group-hover:w-full" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// Section 2: Our Residential Capabilities - VERBATIM from content.md lines 838-846
function ResidentialCapabilitiesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  // VERBATIM from lines 840-846
  const capabilities = [
    {
      icon: Home,
      title: 'Turnkey Villa Construction',
      description: 'From the first pile in the ground to the final landscaped garden (Ref: District One, Jumeirah Bay).',
    },
    {
      icon: Building2,
      title: 'Penthouse Fit-Out',
      description: 'Managing the logistics of working in high-rise towers (Ref: Address Boulevard Fendi Penthouse).',
    },
    {
      icon: Factory,
      title: 'Bespoke Manufacturing',
      description: 'We do not buy furniture; we make it. Our factory creates custom walk-in wardrobes, vanity units, and loose furniture tailored to your taste.',
    },
    {
      icon: Palette,
      title: 'The "Uncluttered Baroque"',
      description: 'A design style that blends the opulence of your heritage with the comfort of modern living.',
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-neutral-50 py-32 sm:py-40 lg:py-48"
    >
      <div className="mx-auto max-w-[1600px] px-6 lg:px-12 xl:px-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center"
        >
          <div className="mb-4 flex items-center justify-center gap-4">
            <div className="h-px w-12 bg-neutral-300" />
            <span className="font-Satoshi text-[10px] font-medium uppercase tracking-[0.3em] text-neutral-400">
              Section 2
            </span>
            <div className="h-px w-12 bg-neutral-300" />
          </div>

          {/* VERBATIM headline from line 839 */}
          <h2 className="font-SchnyderS text-5xl font-light leading-tight tracking-tight text-neutral-950 sm:text-6xl lg:text-7xl">
            Our Residential
            <br />
            <span className="text-[#d4af37]">Capabilities</span>
          </h2>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {capabilities.map((capability, index) => {
            const Icon = capability.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative overflow-hidden border border-neutral-200 bg-white p-8 transition-all duration-500 hover:border-[#d4af37] hover:shadow-2xl hover:shadow-neutral-900/10"
              >
                <Icon className="mb-6 h-10 w-10 text-[#d4af37]" />
                <h3 className="mb-4 font-SchnyderS text-xl font-light leading-tight text-neutral-950">
                  {capability.title}
                </h3>
                <p className="font-Satoshi text-sm font-light leading-relaxed text-neutral-600">
                  {capability.description}
                </p>
                <div className="absolute bottom-0 left-0 h-1 w-0 bg-[#d4af37] transition-all duration-500 group-hover:w-full" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// Section 3: Case Study - VERBATIM from content.md lines 848-854
function CaseStudySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-white py-32 sm:py-40 lg:py-48"
    >
      <div className="mx-auto max-w-[1600px] px-6 lg:px-12 xl:px-16">
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-20 items-center">
          {/* Image Placeholder */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="relative aspect-[4/3] overflow-hidden bg-neutral-200"
          >
            {/* Placeholder for Boulevard Penthouse image */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-Satoshi text-sm text-neutral-400">Image Placeholder</span>
            </div>
          </motion.div>

          {/* Content - VERBATIM from lines 849-854 */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          >
            <div className="mb-8">
              <div className="mb-2 h-px w-16 bg-neutral-900" />
              <span className="font-Satoshi text-[10px] font-medium uppercase tracking-[0.3em] text-neutral-400">
                Case Study: The Penthouse
              </span>
            </div>

            {/* VERBATIM from line 850 */}
            <h2 className="mb-6 font-SchnyderS text-4xl font-light leading-tight tracking-tight text-neutral-950 sm:text-5xl">
              Boulevard Penthouse
              <br />
              <span className="text-[#d4af37]">70-71</span>
            </h2>

            {/* VERBATIM from line 851 */}
            <p className="mb-4 font-Satoshi text-lg font-medium text-neutral-950">
              Scope: Design & Build of a duplex penthouse.
            </p>

            {/* VERBATIM from line 851 */}
            <p className="mb-4 font-Satoshi text-lg font-light text-neutral-600">
              Challenge: Working on the 70th floor of a live hotel tower.
            </p>

            {/* VERBATIM from line 852 */}
            <p className="mb-8 font-Satoshi text-lg font-light leading-relaxed text-neutral-600">
              Outcome: A 5-Star Award Winner for Best Residential Interior, featuring Fendi-inspired joinery and smart home integration.
            </p>

            {/* Award badge placeholder */}
            <div className="mb-8 inline-block border border-[#d4af37]/30 bg-[#d4af37]/5 px-6 py-3">
              <span className="font-Satoshi text-sm text-[#d4af37]">Best Residential Interior Apartment (Dubai)</span>
            </div>

            {/* VERBATIM CTA from line 854 */}
            <div className="block">
              <Link
                href="/projects"
                className="group inline-flex items-center gap-3 border border-neutral-950 px-8 py-4 font-Satoshi text-sm font-light tracking-widest text-neutral-950 transition-all hover:bg-neutral-950 hover:text-white"
              >
                <span>VIEW ALL RESIDENTIAL CASE STUDIES</span>
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// Section 4: Client Logos Placeholder
function ClientLogosSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-neutral-50 py-24"
    >
      <div className="mx-auto max-w-[1600px] px-6 lg:px-12 xl:px-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h3 className="mb-8 font-SchnyderS text-3xl font-light text-neutral-950">
            Residential <span className="text-[#d4af37]">Locations</span>
          </h3>

          {/* Placeholder for location badges */}
          <div className="flex flex-wrap items-center justify-center gap-6">
            {['Jumeirah Bay (Bulgari Island)', 'District One (MBR City)', 'Palm Jumeirah (The Fronds)', 'Emirates Hills'].map((location, index) => (
              <div
                key={index}
                className="border border-neutral-200 bg-white px-6 py-3"
              >
                <span className="font-Satoshi text-sm text-neutral-600">{location}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// Section 6: CTA - VERBATIM from content.md lines 870-872
function CommissionMasterpieceCTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true });

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-neutral-950 py-32 lg:py-40"
    >
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:80px_80px]" />
      <div className="absolute left-0 top-0 h-[400px] w-[400px] rounded-full bg-[#d4af37]/10 blur-[120px]" />
      <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-[#d4af37]/10 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-[1200px] px-6 text-center lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <div className="mb-8 flex items-center justify-center gap-4">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-white/40" />
            <span className="font-Satoshi text-[10px] font-medium uppercase tracking-[0.3em] text-white/70">
              Section 5
            </span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-white/40" />
          </div>

          {/* VERBATIM headline from line 871 */}
          <h2 className="mb-8 font-SchnyderS text-5xl font-light leading-tight tracking-tight text-white sm:text-6xl lg:text-7xl">
            Commission Your
            <br />
            <span className="text-[#d4af37]">Masterpiece.</span>
          </h2>

          {/* VERBATIM CTAs from line 872 */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/contact"
              className="group inline-flex items-center gap-3 border border-[#d4af37] bg-[#d4af37] px-10 py-5 font-Satoshi text-sm font-light tracking-widest text-neutral-950 transition-all hover:bg-transparent hover:text-[#d4af37]"
            >
              <span>REQUEST PRIVATE CONSULTATION</span>
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-2" />
            </Link>
            <a
              href="/downloads/midc-residential-profile.pdf"
              className="group inline-flex items-center gap-3 border border-white/30 px-10 py-5 font-Satoshi text-sm font-light tracking-widest text-white transition-all hover:border-[#d4af37] hover:text-[#d4af37]"
            >
              <span>DOWNLOAD MIDC RESIDENTIAL PROFILE</span>
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-2" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
