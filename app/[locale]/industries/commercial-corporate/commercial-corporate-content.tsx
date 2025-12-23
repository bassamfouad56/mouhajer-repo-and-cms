'use client';

import { useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, ChevronDown, Zap, Shield, Target, Building2, Store, Utensils } from 'lucide-react';
import { FAQSection } from '@/components/sections/faq';

export default function CommercialCorporateContent() {
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
      {/* Hero Section - VERBATIM from content.md lines 874-878 */}
      <section
        ref={heroRef}
        className="relative h-screen min-h-[700px] max-h-[1000px] overflow-hidden bg-neutral-950"
      >
        {/* Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-neutral-950 to-black" />
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
                Commercial & Corporate
              </span>
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-white/40" />
            </motion.div>

            {/* Main Title - VERBATIM from content.md line 877 */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, delay: 0.5 }}
              className="mb-8 font-SchnyderS text-5xl font-light leading-[1.1] tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl"
            >
              Defining Business
              <br />
              <span className="text-[#c9a962]">Environments.</span>
            </motion.h1>

            {/* Subheadline - VERBATIM from content.md line 878 */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="mx-auto mb-12 max-w-3xl px-4 font-Satoshi text-lg font-light leading-relaxed text-white/70 sm:px-0 sm:text-xl"
            >
              Engineered for performance. Designed for the brand.
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

      {/* Section 1: Time is Revenue - VERBATIM from content.md lines 879-884 */}
      <TimeIsRevenueSection />

      {/* Section 2: Our Commercial Capabilities - VERBATIM from content.md lines 886-890 */}
      <CommercialCapabilitiesSection />

      {/* Section 3: Case Study - VERBATIM from content.md lines 891-897 */}
      <CaseStudySection />

      {/* Section 4: Client Logos Placeholder */}
      <ClientLogosSection />

      {/* Section 5: Expert Insights FAQ */}
      <FAQSection
        label="Expert Insights"
        title="Operational"
        titleHighlight="Protocols"
        subtitle="Ensuring your business opens on time"
        faqs={[
          {
            question: 'What is the timeline for a standard office fit-out?',
            answer: 'Speed is our priority. Because we have in-house joinery and MEP teams, we can execute a high-end office fit-out (1,000 sq. m) in as little as 12-16 weeks. We often run 24-hour shifts to meet aggressive opening dates for clients like Osoul and Louis Vuitton.',
          },
          {
            question: 'Do you handle the Civil Defence approvals?',
            answer: 'Yes. This is the most critical part of the commercial fit-out. Our engineering team prepares all Fire & Life Safety drawings and manages the inspection process with Dubai Civil Defence (DCD) to ensure you get your Occupancy Certificate on time.',
          },
          {
            question: 'Can you work in an occupied office tower?',
            answer: 'Yes. We are experts at logistics in high-rise towers (like the Burj Vista or Opus Tower). We manage the strict booking slots for freight elevators and loading bays to ensure materials arrive without disrupting other tenants.',
          },
        ]}
      />

      {/* Section 6: CTA - VERBATIM from content.md lines 909-911 */}
      <BuildForBusinessCTA />
    </main>
  );
}

// Section 1: Time is Revenue - VERBATIM from content.md lines 879-884
function TimeIsRevenueSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  // VERBATIM from lines 882-884
  const advantages = [
    {
      icon: Zap,
      title: 'Fast-Track Fit-Out',
      description: 'Because we manufacture our own joinery and have in-house MEP teams, we cut weeks off the schedule. We don\'t wait for suppliers.',
    },
    {
      icon: Shield,
      title: 'Durability',
      description: 'Commercial spaces take a beating. We specify "High-Traffic" grade materials (flooring, stone, hardware) that look pristine on Day 1 and Day 1,000.',
    },
    {
      icon: Target,
      title: 'Brand Alignment',
      description: 'We translate your brand guidelines into physical space.',
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

            {/* VERBATIM headline from line 880 */}
            <h2 className="mb-10 font-SchnyderS text-5xl font-light leading-[1.05] tracking-tight text-neutral-950 sm:text-6xl lg:text-7xl">
              Time is
              <br />
              <span className="text-[#c9a962]">Revenue.</span>
            </h2>

            {/* VERBATIM content from line 881 */}
            <div className="max-w-4xl space-y-6 font-Satoshi text-lg font-light leading-relaxed text-neutral-600 lg:text-xl">
              <p>
                In commercial real estate, every day of construction is a day of lost rent or revenue. MIDC is structured for speed.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Advantage Cards - VERBATIM from lines 882-884 */}
        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {advantages.map((advantage, index) => {
            const Icon = advantage.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                className="group relative overflow-hidden border border-neutral-200 bg-neutral-50 p-8 transition-all duration-500 hover:border-[#c9a962] hover:bg-white hover:shadow-2xl hover:shadow-neutral-900/10"
              >
                <Icon className="mb-6 h-12 w-12 text-[#c9a962]" />
                <h3 className="mb-4 font-SchnyderS text-2xl font-light leading-tight text-neutral-950">
                  {advantage.title}
                </h3>
                <p className="font-Satoshi text-sm font-light leading-relaxed text-neutral-600">
                  {advantage.description}
                </p>
                <div className="absolute bottom-0 left-0 h-1 w-0 bg-[#c9a962] transition-all duration-500 group-hover:w-full" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// Section 2: Our Commercial Capabilities - VERBATIM from content.md lines 886-890
function CommercialCapabilitiesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  // VERBATIM from lines 888-890
  const capabilities = [
    {
      icon: Building2,
      title: 'Corporate Headquarters',
      description: 'Creating productive, acoustically optimized workspaces (Ref: C1 Headquarters, Opus Tower).',
    },
    {
      icon: Store,
      title: 'Luxury Retail',
      description: 'High-precision fit-outs where the finish must match the product (Ref: Louis Vuitton Manufactures, Askim).',
    },
    {
      icon: Utensils,
      title: 'F&B & Restaurants',
      description: 'Integrating complex kitchen MEP systems with dining aesthetics (Ref: Arto Coffee, La Terrazza).',
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

          {/* VERBATIM headline from line 887 */}
          <h2 className="font-SchnyderS text-5xl font-light leading-tight tracking-tight text-neutral-950 sm:text-6xl lg:text-7xl">
            Our Commercial
            <br />
            <span className="text-[#c9a962]">Capabilities</span>
          </h2>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-3">
          {capabilities.map((capability, index) => {
            const Icon = capability.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative overflow-hidden border border-neutral-200 bg-white p-8 transition-all duration-500 hover:border-[#c9a962] hover:shadow-2xl hover:shadow-neutral-900/10"
              >
                <Icon className="mb-6 h-10 w-10 text-[#c9a962]" />
                <h3 className="mb-4 font-SchnyderS text-xl font-light leading-tight text-neutral-950">
                  {capability.title}
                </h3>
                <p className="font-Satoshi text-sm font-light leading-relaxed text-neutral-600">
                  {capability.description}
                </p>
                <div className="absolute bottom-0 left-0 h-1 w-0 bg-[#c9a962] transition-all duration-500 group-hover:w-full" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// Section 3: Case Study - VERBATIM from content.md lines 891-897
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
            {/* Placeholder for C1 HQ image */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-Satoshi text-sm text-neutral-400">Image Placeholder</span>
            </div>
          </motion.div>

          {/* Content - VERBATIM from lines 892-897 */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          >
            <div className="mb-8">
              <div className="mb-2 h-px w-16 bg-neutral-900" />
              <span className="font-Satoshi text-[10px] font-medium uppercase tracking-[0.3em] text-neutral-400">
                Case Study: The HQ
              </span>
            </div>

            {/* VERBATIM from line 893 */}
            <h2 className="mb-6 font-SchnyderS text-4xl font-light leading-tight tracking-tight text-neutral-950 sm:text-5xl">
              C1 New Head Quarter
              <br />
              <span className="text-[#c9a962]">Office Building</span>
            </h2>

            {/* VERBATIM from line 894 */}
            <p className="mb-4 font-Satoshi text-lg font-medium text-neutral-950">
              Client: Osoul
            </p>

            {/* VERBATIM from line 895 */}
            <p className="mb-4 font-Satoshi text-lg font-light text-neutral-600">
              Scope: 7 Floors of high-spec office fit-out.
            </p>

            {/* VERBATIM from line 896 */}
            <p className="mb-8 font-Satoshi text-lg font-light leading-relaxed text-neutral-600">
              Outcome: Delivered a fully automated, smart-office environment that serves as the operational hub for a major holding company.
            </p>

            {/* VERBATIM CTA from line 897 */}
            <Link
              href="/projects"
              className="group inline-flex items-center gap-3 border border-neutral-950 px-8 py-4 font-Satoshi text-sm font-light tracking-widest text-neutral-950 transition-all hover:bg-neutral-950 hover:text-white"
            >
              <span>VIEW ALL COMMERCIAL & CORPORATE CASE STUDIES</span>
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
            Commercial <span className="text-[#c9a962]">Partners</span>
          </h3>

          {/* Placeholder for client logos */}
          <div className="flex flex-wrap items-center justify-center gap-12">
            {['Osoul', 'Louis Vuitton', 'Emaar', 'Opus Tower', 'Askim'].map((client, index) => (
              <div
                key={index}
                className="flex h-16 w-32 items-center justify-center border border-neutral-200 bg-white px-4"
              >
                <span className="font-Satoshi text-xs text-neutral-400">{client}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// Section 6: CTA - VERBATIM from content.md lines 909-911
function BuildForBusinessCTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true });

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-neutral-950 py-32 lg:py-40"
    >
      <div className="absolute left-0 top-0 h-[400px] w-[400px] rounded-full bg-[#c9a962]/10 blur-[120px]" />
      <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-[#c9a962]/10 blur-[120px]" />

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

          {/* VERBATIM headline from line 910 */}
          <h2 className="mb-8 font-SchnyderS text-5xl font-light leading-tight tracking-tight text-white sm:text-6xl lg:text-7xl">
            Build for
            <br />
            <span className="text-[#c9a962]">Business.</span>
          </h2>

          {/* VERBATIM CTAs from line 911 */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/contact"
              className="group inline-flex items-center gap-3 border border-[#c9a962] bg-[#c9a962] px-10 py-5 font-Satoshi text-sm font-light tracking-widest text-neutral-950 transition-all hover:bg-transparent hover:text-[#c9a962]"
            >
              <span>DISCUSS YOUR FIT-OUT</span>
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-2" />
            </Link>
            <a
              href="/downloads/midc-profile-2025.pdf"
              className="group inline-flex items-center gap-3 border border-white/30 px-10 py-5 font-Satoshi text-sm font-light tracking-widest text-white transition-all hover:border-[#c9a962] hover:text-[#c9a962]"
            >
              <span>DOWNLOAD MIDC PROFILE 2025</span>
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-2" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
