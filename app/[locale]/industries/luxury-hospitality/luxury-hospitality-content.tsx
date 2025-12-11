'use client';

import { useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { SafeImage } from '@/components/safe-image';
import { ArrowRight, ChevronDown, Volume2, Moon, Truck, Building, Sparkles, Utensils, Thermometer } from 'lucide-react';
import { FAQSection } from '@/components/sections/faq';

export default function LuxuryHospitalityContent() {
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
      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative h-screen min-h-[700px] max-h-[1000px] overflow-hidden bg-neutral-950"
      >
        {/* Background Image Placeholder */}
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
                Luxury Hospitality
              </span>
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-white/40" />
            </motion.div>

            {/* Main Title - VERBATIM from content.md line 780 */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, delay: 0.5 }}
              className="mb-8 font-SchnyderS text-5xl font-light leading-[1.1] tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl"
            >
              The Art of the
              <br />
              <span className="text-[#d4af37]">Live Renovation.</span>
            </motion.h1>

            {/* Subheadline - VERBATIM from content.md line 781 */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="mx-auto mb-12 max-w-3xl px-4 font-Satoshi text-lg font-light leading-relaxed text-white/70 sm:px-0 sm:text-xl"
            >
              Upgrading your asset while protecting your guest experience.
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

      {/* Section 1: Invisible Construction - VERBATIM from content.md lines 783-788 */}
      <InvisibleConstructionSection />

      {/* Section 2: Our Hospitality Capabilities - VERBATIM from content.md lines 789-794 */}
      <HospitalityCapabilitiesSection />

      {/* Section 3: Case Study - VERBATIM from content.md lines 795-800 */}
      <CaseStudySection />

      {/* Section 4: Client Logos Placeholder */}
      <ClientLogosSection />

      {/* Section 5: Expert Insights FAQ - VERBATIM from content.md lines 806-816 */}
      <FAQSection
        label="Expert Insights"
        title="Hotel Renovation"
        titleHighlight="Questions"
        subtitle="Clear answers for operators and asset managers"
        faqs={[
          {
            question: 'How do you renovate a "Live" hotel without complaints?',
            answer: 'We use a proprietary Live Environment Protocol. This involves creating acoustic buffer zones, using silent demolition tools, and scheduling noisy works during strict windows (typically 10:00 AM – 4:00 PM). We also use separate service elevators and back-of-house routes so your guests never see a worker.',
          },
          {
            question: 'Do you handle FF&E procurement?',
            answer: 'Yes. We are a full turnkey contractor. We procure Furniture, Fixtures, and Equipment (FF&E) directly from manufacturers, often using our own factory for bespoke joinery. This ensures the "Sheraton Standard" or "Ritz-Carlton Standard" is met without the markup of third-party agents.',
          },
          {
            question: 'Can you work with our brand standards?',
            answer: 'Absolutely. We have extensive experience working with international operator guidelines (Marriott, Hyatt, Accor, Hilton). We understand the non-negotiable standards for safety, material durability, and brand identity.',
          },
        ]}
      />

      {/* Section 6: CTA - VERBATIM from content.md lines 817-819 */}
      <RevitalizeAssetCTA />
    </main>
  );
}

// Section 1: Invisible Construction - VERBATIM from content.md lines 783-788
function InvisibleConstructionSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  const methodologies = [
    {
      icon: Volume2,
      title: 'Acoustic Barriers',
      description: 'We build temporary sound-proof walls that look like finished decor.',
    },
    {
      icon: Moon,
      title: 'Night Works',
      description: 'We schedule heavy drilling and demolition during specific windows to ensure zero noise during guest sleeping hours.',
    },
    {
      icon: Truck,
      title: 'Logistics',
      description: 'We use separate service elevators and back-of-house routes. Your guests never see a worker in a hard hat.',
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

            {/* VERBATIM headline from line 783 */}
            <h2 className="mb-10 font-SchnyderS text-5xl font-light leading-[1.05] tracking-tight text-neutral-950 sm:text-6xl lg:text-7xl">
              Invisible
              <br />
              <span className="text-[#d4af37]">Construction.</span>
            </h2>

            {/* VERBATIM content from lines 784-785 */}
            <div className="max-w-4xl space-y-6 font-Satoshi text-lg font-light leading-relaxed text-neutral-600 lg:text-xl">
              <p>
                Renovating a 5-star hotel is like performing heart surgery while the patient is awake. The biggest fear for any operator (like ADNH or Ritz-Carlton) is guest complaints.
              </p>
              <p className="text-neutral-950 font-medium">
                MIDC specializes in Live Environment Renovations. We have perfected a methodology that isolates the construction zone.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Methodology Cards - VERBATIM from lines 786-788 */}
        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {methodologies.map((method, index) => {
            const Icon = method.icon;
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
                  {method.title}
                </h3>
                <p className="font-Satoshi text-sm font-light leading-relaxed text-neutral-600">
                  {method.description}
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

// Section 2: Our Hospitality Capabilities - VERBATIM from content.md lines 789-794
function HospitalityCapabilitiesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  // VERBATIM from lines 791-794
  const capabilities = [
    {
      icon: Building,
      title: 'Lobbies & Public Areas',
      description: 'Creating the "Wow Factor" arrival experience (Ref: Sheraton Abu Dhabi, Sofitel JBR).',
    },
    {
      icon: Sparkles,
      title: 'VIP & Royal Suites',
      description: 'High-spec fit-outs involving gold leaf, mother-of-pearl, and smart automation (Ref: Address Boulevard, Grand Hyatt).',
    },
    {
      icon: Utensils,
      title: 'F&B Venues',
      description: 'Fast-track restaurant fit-outs that maximize revenue days (Ref: Radisson Blu, Address Marina).',
    },
    {
      icon: Thermometer,
      title: 'MEP Upgrades',
      description: 'Replacing aging HVAC units with energy-efficient systems that reduce operational costs (Ref: Park Hyatt Villas).',
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

          {/* VERBATIM headline from line 790 */}
          <h2 className="font-SchnyderS text-5xl font-light leading-tight tracking-tight text-neutral-950 sm:text-6xl lg:text-7xl">
            Our Hospitality
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

// Section 3: Case Study - VERBATIM from content.md lines 795-800
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
            {/* Placeholder for Sheraton Abu Dhabi image */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-Satoshi text-sm text-neutral-400">Image Placeholder</span>
            </div>
          </motion.div>

          {/* Content - VERBATIM from lines 796-800 */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          >
            <div className="mb-8">
              <div className="mb-2 h-px w-16 bg-neutral-900" />
              <span className="font-Satoshi text-[10px] font-medium uppercase tracking-[0.3em] text-neutral-400">
                Case Study: The Award Winner
              </span>
            </div>

            {/* VERBATIM from line 797 */}
            <h2 className="mb-6 font-SchnyderS text-4xl font-light leading-tight tracking-tight text-neutral-950 sm:text-5xl">
              Sheraton Abu Dhabi
              <br />
              <span className="text-[#d4af37]">Hotel & Resort</span>
            </h2>

            {/* VERBATIM from line 798 */}
            <p className="mb-4 font-Satoshi text-lg font-medium text-neutral-950">
              Client: Abu Dhabi National Hotels (ADNH)
            </p>

            {/* VERBATIM from line 799 */}
            <p className="mb-8 font-Satoshi text-lg font-light leading-relaxed text-neutral-600">
              Scope: Full renovation of Lobby, VIP Lounge, and Guestrooms. Outcome: Delivered on time and won the Arabian Property Award for Best Hotel Interior.
            </p>

            {/* VERBATIM CTA from line 800 */}
            <Link
              href="/projects"
              className="group inline-flex items-center gap-3 border border-neutral-950 px-8 py-4 font-Satoshi text-sm font-light tracking-widest text-neutral-950 transition-all hover:bg-neutral-950 hover:text-white"
            >
              <span>VIEW ALL HOSPITALITY CASE STUDIES</span>
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
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
            Hospitality <span className="text-[#d4af37]">Partners</span>
          </h3>

          {/* Placeholder for client logos */}
          <div className="flex flex-wrap items-center justify-center gap-12">
            {['ADNH', 'Marriott', 'Hyatt', 'Ritz-Carlton', 'Sofitel', 'Radisson'].map((client, index) => (
              <div
                key={index}
                className="flex h-16 w-32 items-center justify-center border border-neutral-200 bg-white px-4"
              >
                <span className="font-Satoshi text-xs text-neutral-400">{client}</span>
              </div>
            ))}
          </div>

          {/* Awards placeholder */}
          <div className="mt-12">
            <p className="mb-4 font-Satoshi text-sm font-light text-neutral-500">Related Awards</p>
            <div className="flex flex-wrap items-center justify-center gap-8">
              <div className="border border-[#d4af37]/30 bg-[#d4af37]/5 px-6 py-3">
                <span className="font-Satoshi text-xs text-[#d4af37]">Best Hotel Suite Interior (Arabia)</span>
              </div>
              <div className="border border-[#d4af37]/30 bg-[#d4af37]/5 px-6 py-3">
                <span className="font-Satoshi text-xs text-[#d4af37]">Best Hotel Interior (Abu Dhabi)</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// Section 6: CTA - VERBATIM from content.md lines 817-819
function RevitalizeAssetCTA() {
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
              Section 6
            </span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-white/40" />
          </div>

          {/* VERBATIM headline from line 818 */}
          <h2 className="mb-8 font-SchnyderS text-5xl font-light leading-tight tracking-tight text-white sm:text-6xl lg:text-7xl">
            Revitalize
            <br />
            <span className="text-[#d4af37]">Your Asset.</span>
          </h2>

          {/* VERBATIM CTAs from line 819 */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/contact"
              className="group inline-flex items-center gap-3 border border-[#d4af37] bg-[#d4af37] px-10 py-5 font-Satoshi text-sm font-light tracking-widest text-neutral-950 transition-all hover:bg-transparent hover:text-[#d4af37]"
            >
              <span>CONSULT ON HOTEL RENOVATION</span>
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-2" />
            </Link>
            <a
              href="/downloads/midc-hospitality-profile.pdf"
              className="group inline-flex items-center gap-3 border border-white/30 px-10 py-5 font-Satoshi text-sm font-light tracking-widest text-white transition-all hover:border-[#d4af37] hover:text-[#d4af37]"
            >
              <span>DOWNLOAD MIDC HOSPITALITY PROFILE</span>
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-2" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
