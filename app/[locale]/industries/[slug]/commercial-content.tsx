'use client';

import { useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import {
  ChevronRight,
  ArrowRight,
  Clock,
  Shield,
  Palette,
  Building2,
  Store,
  UtensilsCrossed,
  Award,
  Phone,
  Download,
} from 'lucide-react';
import { FAQSection } from '@/components/sections/faq';

// Commercial client logos - using official CDN sources
const commercialClients = [
  { name: 'Emaar', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Emaar_Properties_Logo.svg/320px-Emaar_Properties_Logo.svg.png' },
  { name: 'DAMAC', logo: 'https://seeklogo.com/images/D/damac-properties-logo-D14B7C8B48-seeklogo.com.png' },
  { name: 'Nakheel', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Nakheel_Properties_logo.svg/320px-Nakheel_Properties_logo.svg.png' },
  { name: 'Meraas', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Meraas-logo.svg/320px-Meraas-logo.svg.png' },
  { name: 'Louis Vuitton', logo: 'https://seeklogo.com/images/L/louis-vuitton-logo-5F4A44E9FA-seeklogo.com.png' },
  { name: 'Osoul', logo: '' }, // Text fallback - no public logo available
];

export default function CommercialContent() {
  const heroRef = useRef<HTMLDivElement>(null);
  const isHeroInView = useInView(heroRef, { once: true });

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.8, 0.6]);

  const faqs = [
    {
      question: "What is the timeline for a standard office fit-out?",
      answer: "Speed is our priority. Because we have in-house joinery and MEP teams, we can execute a high-end office fit-out (1,000 sq. m) in as little as 12-16 weeks. We often run 24-hour shifts to meet aggressive opening dates for clients like Osoul and Louis Vuitton."
    },
    {
      question: "Do you handle the Civil Defence approvals?",
      answer: "Yes. This is the most critical part of the commercial fit-out. Our engineering team prepares all Fire & Life Safety drawings and manages the inspection process with Dubai Civil Defence (DCD) to ensure you get your Occupancy Certificate on time."
    },
    {
      question: "Can you work in an occupied office tower?",
      answer: "Yes. We are experts at logistics in high-rise towers (like the Burj Vista or Opus Tower). We manage the strict booking slots for freight elevators and loading bays to ensure materials arrive without disrupting other tenants."
    }
  ];

  const capabilities = [
    {
      icon: Building2,
      title: "Corporate Headquarters",
      description: "Creating productive, acoustically optimized workspaces.",
      reference: "Ref: C1 Headquarters, Opus Tower"
    },
    {
      icon: Store,
      title: "Luxury Retail",
      description: "High-precision fit-outs where the finish must match the product.",
      reference: "Ref: Louis Vuitton Manufactures, Askim"
    },
    {
      icon: UtensilsCrossed,
      title: "F&B & Restaurants",
      description: "Integrating complex kitchen MEP systems with dining aesthetics.",
      reference: "Ref: Arto Coffee, La Terrazza"
    }
  ];

  return (
    <main className="relative bg-white">
      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative min-h-[85vh] overflow-hidden lg:min-h-[90vh]"
      >
        {/* Background Image with Parallax */}
        <motion.div
          style={{ y }}
          className="absolute inset-0"
        >
          <Image
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069"
            alt="Modern Corporate Office Interior"
            fill
            className="object-cover"
            priority
          />
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-neutral-950/30" />
        </motion.div>

        <motion.div style={{ opacity }} className="relative z-10 flex min-h-[85vh] flex-col justify-end px-6 pb-20 pt-32 lg:min-h-[90vh] lg:px-12 lg:pb-32">
          <div className="mx-auto w-full max-w-[1400px]">
            {/* Breadcrumbs */}
            <motion.nav
              initial={{ opacity: 0, y: -10 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="mb-8 flex items-center gap-2 text-sm font-light text-neutral-300"
            >
              <Link href="/" className="transition-colors hover:text-white">Home</Link>
              <ChevronRight size={16} />
              <Link href="/industries" className="transition-colors hover:text-white">Industries</Link>
              <ChevronRight size={16} />
              <span className="text-white">Commercial</span>
            </motion.nav>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="mb-6 text-5xl font-light tracking-tight text-white lg:text-8xl"
            >
              Defining Business Environments.
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="max-w-2xl text-xl font-light leading-relaxed text-neutral-200 lg:text-2xl"
            >
              Engineered for performance. Designed for the brand.
            </motion.p>
          </div>
        </motion.div>
      </section>

      {/* Section 1: Time is Revenue */}
      <section className="relative bg-neutral-950 px-6 py-24 lg:px-12 lg:py-32">
        <div className="mx-auto max-w-[1400px]">
          <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
            {/* Left: Content */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <h2 className="mb-8 text-4xl font-light tracking-tight text-white lg:text-5xl">
                  Time is Revenue.
                </h2>
                <p className="mb-10 text-lg font-light leading-relaxed text-neutral-300">
                  In commercial real estate, every day of construction is a day of lost rent or revenue. MIDC is structured for speed.
                </p>
              </motion.div>

              {/* Features */}
              <div className="space-y-8">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="flex gap-6"
                >
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/5">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="mb-2 text-xl font-light text-white">Fast-Track Fit-Out</h3>
                    <p className="text-base font-light text-neutral-400">
                      Because we manufacture our own joinery and have in-house MEP teams, we cut weeks off the schedule. We don&apos;t wait for suppliers.
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="flex gap-6"
                >
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/5">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="mb-2 text-xl font-light text-white">Durability</h3>
                    <p className="text-base font-light text-neutral-400">
                      Commercial spaces take a beating. We specify &quot;High-Traffic&quot; grade materials (flooring, stone, hardware) that look pristine on Day 1 and Day 1,000.
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="flex gap-6"
                >
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/5">
                    <Palette className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="mb-2 text-xl font-light text-white">Brand Alignment</h3>
                    <p className="text-base font-light text-neutral-400">
                      We translate your brand guidelines into physical space.
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Right: Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative aspect-[4/5] overflow-hidden"
            >
              <Image
                src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=2069"
                alt="Modern Office Space"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/50 to-transparent" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section 2: Our Commercial Capabilities */}
      <section className="relative bg-white px-6 py-24 lg:px-12 lg:py-32">
        <div className="mx-auto max-w-[1400px]">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-16 text-center"
          >
            <h2 className="mb-6 text-4xl font-light tracking-tight text-neutral-950 lg:text-5xl">
              Our Commercial Capabilities
            </h2>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-3">
            {capabilities.map((capability, index) => (
              <motion.div
                key={capability.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group border border-neutral-200 p-8 transition-all hover:border-neutral-950 hover:shadow-lg"
              >
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full border border-neutral-200 transition-all group-hover:border-neutral-950 group-hover:bg-neutral-950">
                  <capability.icon className="h-6 w-6 text-neutral-600 transition-colors group-hover:text-white" />
                </div>
                <h3 className="mb-3 text-2xl font-light tracking-tight text-neutral-950">
                  {capability.title}
                </h3>
                <p className="mb-2 text-base font-light leading-relaxed text-neutral-600">
                  {capability.description}
                </p>
                {capability.reference && (
                  <p className="text-sm font-light italic text-neutral-400">
                    {capability.reference}
                  </p>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: Case Study - The HQ */}
      <section className="relative bg-neutral-50 px-6 py-24 lg:px-12 lg:py-32">
        <div className="mx-auto max-w-[1400px]">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Left: Image with Award Badge */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070"
                  alt="C1 New Head Quarter Office Building"
                  fill
                  className="object-cover"
                />
              </div>
              {/* Badge */}
              <div className="absolute -bottom-6 -right-6 flex items-center gap-3 bg-neutral-950 px-6 py-4 shadow-xl lg:-right-8">
                <Award className="h-8 w-8 text-amber-400" />
                <div>
                  <p className="text-xs font-light uppercase tracking-wider text-neutral-400">Smart Office</p>
                  <p className="text-sm font-medium text-white">Fully Automated</p>
                  <p className="text-xs font-light text-neutral-400">7 Floors</p>
                </div>
              </div>
            </motion.div>

            {/* Right: Content */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="flex flex-col justify-center lg:pl-8"
            >
              <div className="mb-4 flex items-center gap-3">
                <div className="h-px w-8 bg-neutral-400" />
                <span className="text-sm font-light uppercase tracking-widest text-neutral-500">Case Study</span>
              </div>
              <h2 className="mb-6 text-4xl font-light tracking-tight text-neutral-950 lg:text-5xl">
                The HQ
              </h2>

              <div className="mb-8 space-y-4">
                <div>
                  <span className="text-sm font-medium uppercase tracking-wider text-neutral-500">Project</span>
                  <p className="text-lg font-light text-neutral-950">C1 New Head Quarter Office Building</p>
                </div>
                <div>
                  <span className="text-sm font-medium uppercase tracking-wider text-neutral-500">Client</span>
                  <p className="text-lg font-light text-neutral-950">Osoul</p>
                </div>
                <div>
                  <span className="text-sm font-medium uppercase tracking-wider text-neutral-500">Scope</span>
                  <p className="text-lg font-light text-neutral-950">7 Floors of high-spec office fit-out</p>
                </div>
                <div>
                  <span className="text-sm font-medium uppercase tracking-wider text-neutral-500">Outcome</span>
                  <p className="text-lg font-light text-neutral-950">
                    Delivered a fully automated, smart-office environment that serves as the operational hub for a major holding company.
                  </p>
                </div>
              </div>

              <Link
                href="/projects?filter=commercial"
                className="group inline-flex items-center gap-3 text-sm font-light uppercase tracking-widest text-neutral-950 transition-colors hover:text-neutral-600"
              >
                <span>View All Commercial & Corporate Case Studies</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-2" />
              </Link>
            </motion.div>
          </div>

          {/* Client Logos */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-24"
          >
            <p className="mb-8 text-center text-sm font-light uppercase tracking-widest text-neutral-500">
              Commercial Clients
            </p>
            <div className="flex flex-wrap items-center justify-center gap-12 lg:gap-16">
              {commercialClients.map((client) => (
                <div key={client.name} className="relative h-12 w-24 grayscale opacity-60 transition-all hover:grayscale-0 hover:opacity-100">
                  <Image
                    src={client.logo}
                    alt={client.name}
                    fill
                    className="object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                  <span className="absolute inset-0 flex items-center justify-center text-sm font-light text-neutral-400">
                    {client.name}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Section 4: FAQ - Operational Protocols */}
      <FAQSection
        label="Operational Protocols"
        title="Ensuring Your Business"
        titleHighlight="Opens On Time."
        faqs={faqs}
        variant="light"
        showCTA={false}
      />

      {/* Section 5: CTA - Build for Business */}
      <section className="relative bg-neutral-950 px-6 py-24 lg:px-12 lg:py-32">
        <div className="mx-auto max-w-[900px] text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="mb-12 text-4xl font-light tracking-tight text-white lg:text-6xl">
              Build for Business.
            </h2>

            <div className="flex flex-col items-center justify-center gap-6 sm:flex-row">
              <Link
                href="/contact"
                className="group inline-flex items-center gap-3 border border-white bg-white px-8 py-4 text-sm font-light uppercase tracking-widest text-neutral-950 transition-all hover:bg-transparent hover:text-white"
              >
                <Phone className="h-4 w-4" />
                <span>Discuss Your Fit-Out</span>
              </Link>
              <Link
                href="/downloads/midc-profile-2025.pdf"
                className="group inline-flex items-center gap-3 border border-white/30 px-8 py-4 text-sm font-light uppercase tracking-widest text-white transition-all hover:border-white hover:bg-white hover:text-neutral-950"
              >
                <Download className="h-4 w-4" />
                <span>Download MIDC Profile 2025</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
