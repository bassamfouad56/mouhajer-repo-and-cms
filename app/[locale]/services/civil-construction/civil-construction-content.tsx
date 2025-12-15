'use client';

import { useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { FAQSection } from '@/components/sections/faq';
import Link from 'next/link';
import { SafeImage } from '@/components/safe-image';
import { ArrowRight, ChevronDown, Hammer, Building, HardHat, Shield, Check, FileText } from 'lucide-react';

// Professional minimalist SVG icons for Civil Construction
const IconFoundation = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
    <rect x="8" y="32" width="32" height="12" />
    <path d="M4 44h40" />
    <path d="M16 32V20l8-8 8 8v12" />
    <path d="M20 32v-8h8v8" />
  </svg>
);

const IconStructure = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 44V16l16-12 16 12v28" />
    <path d="M8 20h32M8 28h32M8 36h32" />
    <path d="M16 44V32h6v12M26 44V32h6v12" />
  </svg>
);

const IconSafety = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
    <path d="M24 4L8 12v12c0 11 7 21 16 24 9-3 16-13 16-24V12L24 4z" />
    <path d="M16 24l6 6 12-12" />
  </svg>
);

const IconPermit = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
    <rect x="8" y="4" width="32" height="40" rx="2" />
    <path d="M16 12h16M16 20h16M16 28h8" />
    <circle cx="32" cy="36" r="4" />
    <path d="M30 36l2 2 4-4" />
  </svg>
);

export default function CivilConstructionContent() {
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
        {/* Background Image */}
        <div className="absolute inset-0">
          <SafeImage
            src="/projects/turnkey-design-fitout/_MID2543-HDR.jpg"
            alt="Civil construction excellence"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-neutral-950/70" />
          <div className="absolute inset-0 bg-linear-to-t from-neutral-950 via-neutral-950/50 to-transparent" />
        </div>

        {/* Hero Content */}
        <motion.div
          style={{ opacity: heroOpacity, y: heroY }}
          className="relative z-10 flex h-full flex-col items-center justify-center px-6 pt-24 lg:px-12"
        >
          <div className="mx-auto max-w-5xl text-center">
            {/* Main Title - 100% VERBATIM line 849 */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, delay: 0.5 }}
              className="mb-8 font-SchnyderS text-5xl font-light leading-[1.1] tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl"
            >
              The
              <br />
              <span className="text-[#d4af37]">Backbone of Luxury.</span>
            </motion.h1>

            {/* Subheadline - 100% VERBATIM line 850 */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="mx-auto mb-12 max-w-3xl px-4 font-Satoshi text-lg font-light leading-relaxed text-white/70 sm:px-0 sm:text-xl"
            >
              We are not just decorators. We are builders. Licensed, certified, and equipped to execute heavy civil works from the ground up.
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
              DISCOVER OUR CAPABILITIES
            </span>
            <ChevronDown className="h-4 w-4 text-white/50" />
          </motion.div>
        </motion.div>
      </section>

      {/* Section 1: Defining the Skyline - 100% VERBATIM lines 852-855 */}
      <DefiningSkylineSection />

      {/* Section 2: Technical Capabilities - 100% VERBATIM lines 857-876 */}
      <TechnicalCapabilitiesSection />

      {/* Section 3: ISO Standards - 100% VERBATIM lines 878-886 */}
      <ISOStandardsSection />

      {/* Section 4: Expert Insights (FAQ) - 100% VERBATIM lines 888-900 */}
      <ExpertInsightsSection />

      {/* Section 5: CTA - Build on Solid Ground - 100% VERBATIM lines 902-906 */}
      <BuildOnSolidGroundCTA />
    </main>
  );
}

// Section 1: Defining the Skyline - 100% VERBATIM from content.md lines 852-855
function DefiningSkylineSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

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
            className="flex flex-col justify-center lg:col-span-12"
          >
            <div className="mb-8">
              <div className="h-px w-16 bg-neutral-900" />
            </div>

            <h2 className="mb-10 font-SchnyderS text-5xl font-light leading-[1.05] tracking-tight text-neutral-950 sm:text-6xl lg:text-7xl">
              Defining
              <br />
              <span className="text-[#d4af37]">the Skyline</span>
            </h2>

            {/* 100% VERBATIM content from lines 853-855 */}
            <div className="max-w-4xl space-y-6 font-Satoshi text-lg font-light leading-relaxed text-neutral-600 lg:text-xl">
              <p>
                In a market saturated with 'fit-out' companies that are only licensed to decorate interiors, MIDC stands apart as a <strong className="font-medium text-neutral-950">fully licensed Main Contractor</strong>. This distinction is critical. It means we hold the trade licenses, the heavy machinery, and the structural engineering expertise to build the 'bones' of your asset.
              </p>
              <p>
                Whether it is the ground-up construction of a G+1 luxury villa in District One or the complex structural modification of a heritage hotel like the Sheraton Abu Dhabi, our Civil Division operates with military precision. We do not rely on third parties to build the structure. We build it ourselves.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// Section 2: Technical Capabilities - 100% VERBATIM from content.md lines 857-876
function TechnicalCapabilitiesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  // 100% VERBATIM from lines 859-876
  const capabilities = [
    {
      id: 1,
      icon: Hammer,
      title: 'Excavation & Enabling Works',
      subtitle: 'Before luxury rises, the ground must be prepared. We handle the complete enabling package.',
      items: [
        {
          label: 'Deep Excavation',
          description: 'Managing soil removal for basements and underground parking.',
        },
        {
          label: 'Shoring & Piling',
          description: 'Installing secant piles and sheet piles to stabilize the soil, ensuring the safety of neighboring structures in dense areas.',
        },
        {
          label: 'Dewatering',
          description: 'Specialized management of groundwater levels during foundation work.',
        },
      ],
    },
    {
      id: 2,
      icon: Building,
      title: 'Reinforced Concrete Superstructure',
      subtitle: 'This is the skeleton of your project. We execute complex concrete works that allow for open-plan luxury living.',
      items: [
        {
          label: 'Long-Span Slabs',
          description: 'We engineer post-tensioned slabs that allow for massive column-free spaces (essential for Grand Majlises and Ballrooms).',
        },
        {
          label: 'Laser-Leveled Flooring',
          description: 'We use laser technology during the concrete pour to guarantee a perfectly flat surface. This is a non-negotiable requirement for installing large-format Italian marble later in the project.',
        },
      ],
    },
    {
      id: 3,
      icon: HardHat,
      title: 'Structural Modifications (Renovation)',
      subtitle: 'For our hospitality partners like ADNH and Wasl, we often have to alter existing buildings.',
      items: [
        {
          label: 'Load Transfer',
          description: 'We safely remove load-bearing walls to open up lobbies or combine hotel rooms into suites (as done for the Address Boulevard VIP Suite).',
        },
        {
          label: 'Retrofitting',
          description: 'We strengthen existing columns and beams using carbon fiber or steel jacketing to support new design loads.',
        },
      ],
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-neutral-50 py-32 sm:py-40 lg:py-48"
    >
      <div className="mx-auto max-w-[1600px] px-6 lg:px-12 xl:px-16">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-20 text-center"
        >
          <div className="mb-4 flex items-center justify-center gap-4">
            <div className="h-px w-12 bg-neutral-300" />
            <span className="font-Satoshi text-[10px] font-medium uppercase tracking-[0.3em] text-neutral-400">
              Capabilities
            </span>
            <div className="h-px w-12 bg-neutral-300" />
          </div>

          <h2 className="font-SchnyderS text-5xl font-light leading-tight tracking-tight text-neutral-950 sm:text-6xl lg:text-7xl">
            Our Technical
            <br />
            <span className="text-[#d4af37]">Capabilities</span>
          </h2>
        </motion.div>

        {/* Capabilities */}
        <div className="space-y-16 lg:space-y-24">
          {capabilities.map((capability, index) => (
            <motion.div
              key={capability.id}
              initial={{ opacity: 0, y: 60 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="group relative"
            >
              <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
                {/* Left: Icon */}
                <div className="lg:col-span-3">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-neutral-200 transition-all duration-300 group-hover:border-[#d4af37] group-hover:bg-[#d4af37]">
                    <capability.icon className="h-10 w-10 text-neutral-600 transition-colors duration-300 group-hover:text-white" />
                  </div>
                </div>

                {/* Right: Content */}
                <div className="lg:col-span-9">
                  <h3 className="mb-4 font-SchnyderS text-4xl font-light leading-tight text-neutral-950 transition-colors duration-300 group-hover:text-[#d4af37] lg:text-5xl">
                    {capability.title}
                  </h3>
                  <p className="mb-8 font-Satoshi text-lg font-light italic text-neutral-500">
                    {capability.subtitle}
                  </p>

                  <div className="space-y-6">
                    {capability.items.map((item, i) => (
                      <div key={i} className="border-l-2 border-[#d4af37] pl-6">
                        <div className="mb-2 font-Satoshi text-sm font-medium uppercase tracking-[0.2em] text-neutral-400">
                          {item.label}
                        </div>
                        <p className="font-Satoshi text-base font-light leading-relaxed text-neutral-700">
                          {item.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Divider */}
              {index < capabilities.length - 1 && (
                <div className="mt-16 h-px w-full bg-neutral-200 lg:mt-24" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Section 3: ISO Standards - 100% VERBATIM from content.md lines 878-886
function ISOStandardsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  // 100% VERBATIM from lines 884-886
  const standards = [
    {
      icon: Shield,
      code: 'ISO 45001',
      title: 'Occupational Health & Safety',
      description: 'Our sites are governed by rigorous safety protocols. We have a zero-tolerance policy for unsafe practices. Every worker is PPE-compliant, and every crane lift is calculated.',
    },
    {
      icon: Check,
      code: 'ISO 9001',
      title: 'Quality Management',
      description: 'We do not wait for the consultant to find a mistake. Our internal QA/QC engineers inspect the steel reinforcement bars (rebar) before every concrete pour. If it is off by a millimeter, we fix it.',
    },
    {
      icon: FileText,
      code: 'Material Control',
      title: 'Independent Lab Testing',
      description: 'We test the compressive strength of our concrete cubes in independent labs to verify they meet the structural engineer\'s specifications.',
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-white py-32 sm:py-40 lg:py-48"
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
              Quality Standards
            </span>
            <div className="h-px w-12 bg-neutral-300" />
          </div>

          {/* 100% VERBATIM headline from line 880 */}
          <h2 className="mb-6 font-SchnyderS text-5xl font-light leading-tight tracking-tight text-neutral-950 sm:text-6xl lg:text-7xl">
            Safety & Quality:
            <br />
            <span className="text-[#d4af37]">Zero Tolerance for Error</span>
          </h2>

          {/* 100% VERBATIM from line 882 */}
          <p className="mx-auto max-w-3xl font-Satoshi text-lg font-light text-neutral-600">
            A luxury finish is impossible without a perfect structure. We operate under strict international standards to ensure that what we build lasts for generations.
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-3">
          {standards.map((standard, index) => {
            const Icon = standard.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="group relative overflow-hidden border border-neutral-200 bg-neutral-50 p-8 transition-all duration-500 hover:border-[#d4af37] hover:bg-white hover:shadow-2xl hover:shadow-neutral-900/10"
              >
                <Icon className="mb-6 h-12 w-12 text-[#d4af37]" />
                <div className="mb-3 font-Satoshi text-sm font-medium uppercase tracking-wider text-[#d4af37]">
                  {standard.code}
                </div>
                <h3 className="mb-4 font-SchnyderS text-2xl font-light leading-tight text-neutral-950">
                  {standard.title}
                </h3>
                <p className="font-Satoshi text-sm font-light leading-relaxed text-neutral-600">
                  {standard.description}
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

// Section 4: Expert Insights - 100% VERBATIM from content.md lines 888-900
function ExpertInsightsSection() {
  return (
    <FAQSection
      label="Expert Insights"
      title="Questions"
      titleHighlight="& Answers"
      showCTA={false}
      faqs={[
        {
          question: 'Can you build a villa from scratch?',
          answer: 'Yes. We handle the entire lifecycle. From the initial soil test and excavation to the final roof waterproofing, we are the single point of contact for the entire build.',
        },
        {
          question: 'Most fit-out companies cannot build the structure. How can you?',
          answer: 'You are correct. Most firms only hold a "Decor" license. MIDC holds a specific Trade License for Building Contracting. This legal authority allows us to deploy heavy machinery, cast concrete, and execute structural steel works. We do not sub-contract the skeleton of your building. We build it.',
        },
        {
          question: "Do you handle authorities' approvals?",
          answer: 'Yes. Our engineering team manages the entire submission process with Dubai Municipality, Trakhees, and Civil Defence. We ensure the structural design complies with all local codes before we break ground.',
        },
        {
          question: 'How do you ensure safety on deep excavation sites?',
          answer: 'We operate under ISO 45001 standards. For deep excavations (like basements in District One), we use advanced shoring systems to stabilize the soil. We also employ dedicated Safety Officers who have the authority to stop work immediately if a risk is detected.',
        },
      ]}
    />
  );
}

// Section 5: CTA - Build on Solid Ground - 100% VERBATIM from content.md lines 902-906
function BuildOnSolidGroundCTA() {
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
              Get Started
            </span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-white/40" />
          </div>

          {/* 100% VERBATIM headline from line 904 */}
          <h2 className="mb-8 font-SchnyderS text-5xl font-light leading-tight tracking-tight text-white sm:text-6xl lg:text-7xl">
            Build on
            <br />
            <span className="text-[#d4af37]">Solid Ground</span>
          </h2>

          {/* 100% VERBATIM text from line 905 */}
          <p className="mx-auto mb-12 max-w-3xl font-Satoshi text-lg font-light leading-relaxed text-white/70 lg:text-xl">
            Commission a contractor with the license and the legacy to build your structure right.
          </p>

          {/* 100% VERBATIM CTAs from line 906 */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="#contact"
              className="group inline-flex items-center gap-3 border border-[#d4af37] bg-[#d4af37] px-10 py-5 font-Satoshi text-sm font-light tracking-widest text-neutral-950 transition-all hover:bg-transparent hover:text-[#d4af37]"
            >
              <span>CONSULT ON CONSTRUCTION</span>
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-2" />
            </a>
            <a
              href="/downloads/midc-contracting-profile.pdf"
              className="group inline-flex items-center gap-3 border border-white/30 px-10 py-5 font-Satoshi text-sm font-light tracking-widest text-white transition-all hover:border-[#d4af37] hover:text-[#d4af37]"
            >
              <span>DOWNLOAD MIDC CONTRACTING PROFILE</span>
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-2" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
