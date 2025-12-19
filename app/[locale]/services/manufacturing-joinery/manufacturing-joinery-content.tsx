'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { FAQSection } from '@/components/sections/faq';
import Link from 'next/link';
import Image from 'next/image';
import { SafeImage } from '@/components/safe-image';

// Professional minimalist SVG icons
const IconMillwork = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="8" width="40" height="32" rx="1" />
    <path d="M4 16h40M4 24h40M4 32h40" />
    <path d="M16 8v32M32 8v32" />
  </svg>
);

const IconFurniture = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 32h32v8H8z" />
    <path d="M12 24h24v8H12z" />
    <path d="M12 32v12M36 32v12" />
    <path d="M8 44h4M36 44h4" />
  </svg>
);

const IconPrecision = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="24" cy="24" r="18" />
    <circle cx="24" cy="24" r="8" />
    <circle cx="24" cy="24" r="2" />
    <path d="M24 6v4M24 38v4M6 24h4M38 24h4" />
  </svg>
);

const IconQuality = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 28l4 4 8-12" />
    <rect x="8" y="8" width="32" height="32" rx="2" />
    <path d="M8 16h32" />
  </svg>
);

// Partner brand logos from public/services folder
const partnerBrands = [
  { name: 'Smania', filename: 'Logo-Smania.png', alt: 'Smania Luxury Furniture' },
  { name: 'Boca do Lobo', filename: '370-logo-boca-do-lobo.png', alt: 'Boca do Lobo' },
  { name: 'Roberto Cavalli', filename: 'rc-logo.png', alt: 'Roberto Cavalli Home' },
  { name: 'Fendi Casa', filename: 'fendicasa-logo-new.png', alt: 'Fendi Casa' },
  { name: 'Bentley Home', filename: 'LOGO-BENTLEY-HOME-HAPTIC-768x578.png', alt: 'Bentley Home' },
  { name: 'Trussardi', filename: 'Trussardi_logo.png', alt: 'Trussardi Casa' },
  { name: 'Olivo', filename: 'Logo-Olivo338.png', alt: 'Olivo' },
  { name: 'Heritage Home', filename: 'Heritage Home Group logo.png', alt: 'Heritage Home Group' },
  { name: 'Brand 1', filename: 'unnamed (1).png', alt: 'Partner Brand' },
  { name: 'Brand 2', filename: 'Layer 785.png', alt: 'Partner Brand' },
  { name: 'Brand 3', filename: 'Layer 781.png', alt: 'Partner Brand' },
  { name: 'Brand 4', filename: 'Layer 779.png', alt: 'Partner Brand' },
  { name: 'Brand 5', filename: 'Layer 780.png', alt: 'Partner Brand' },
  { name: 'Brand 6', filename: 'Layer 776.png', alt: 'Partner Brand' },
  { name: 'Brand 7', filename: 'cropped-logo_trasparente.png', alt: 'Partner Brand' },
  { name: 'Brand 8', filename: 'Layer 767.png', alt: 'Partner Brand' },
  { name: 'Brand 9', filename: 'Layer 766.png', alt: 'Partner Brand' },
  { name: 'Brand 10', filename: 'unnamed.png', alt: 'Partner Brand' },
  { name: 'Brand 11', filename: 'logotipo-01.png', alt: 'Partner Brand' },
];

export default function ManufacturingJoineryContent() {
  return (
    <main className="overflow-hidden bg-white">
      <HeroSection />
      <Section1 />
      <Section2 />
      <Section3 />
      <Section4 />
      <Section5 />
      <Section6 />
    </main>
  );
}

function HeroSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section
      ref={ref}
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-neutral-950 px-6 py-32 sm:px-12 sm:py-40 lg:px-20 lg:py-48"
    >
      {/* Background Video */}
      <div className="absolute inset-0">
        {/* YouTube Video Embed */}
        <div className="absolute inset-0 h-full w-full overflow-hidden">
          <iframe
            className="absolute left-1/2 top-1/2 h-[56.25vw] min-h-screen w-[177.77vh] min-w-screen -translate-x-1/2 -translate-y-1/2"
            src="https://www.youtube.com/embed/MLCIxeg8-kA?autoplay=1&mute=1&loop=1&playlist=MLCIxeg8-kA&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&enablejsapi=1"
            title="Manufacturing & Joinery Showcase"
            allow="autoplay; encrypted-media"
          />
        </div>
        <div className="absolute inset-0 bg-neutral-950/70" />
        <div className="absolute inset-0 bg-linear-to-t from-neutral-950 via-neutral-950/50 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl text-center">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          className="mb-8 font-SchnyderS text-5xl font-light leading-[1.1] tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl"
        >
          The Mouhajer
          <br />
          <span className="text-[#c9a962]">Factory</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          className="mx-auto mb-12 max-w-3xl px-4 font-Satoshi text-lg font-light leading-relaxed text-white/70 sm:px-0 sm:text-xl"
        >
          Luxury cannot be bought from a catalogue. It must be crafted.
        </motion.p>
      </div>
    </section>
  );
}

function Section1() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-white px-6 py-32 sm:px-12 sm:py-40 lg:px-20 lg:py-48"
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-20">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            className="flex flex-col justify-center lg:col-span-6"
          >
            <div className="mb-8">
              <div className="mb-2 h-px w-16 bg-neutral-900" />
              <span className="font-Satoshi text-[10px] font-medium uppercase tracking-[0.3em] text-neutral-400">
                Our Philosophy
              </span>
            </div>

            <h2 className="mb-8 font-SchnyderS text-4xl font-light leading-tight tracking-tight text-neutral-950 sm:text-5xl lg:text-6xl">
              We <span className="italic">Make</span>.
            </h2>

            <div className="space-y-6">
              <p className="font-Satoshi text-lg font-light leading-relaxed text-neutral-700 lg:text-xl">
                Most interior contractors in the UAE outsource joinery to third-party factories in China or India. We don&apos;t. We operate our own 40,000-square-foot joinery facility in Sharjah Industrial Area, staffed with full-time craftsmen, CNC operators, and finishing specialists.
              </p>

              <p className="font-Satoshi text-lg font-light leading-relaxed text-neutral-700 lg:text-xl">
                Why? Because <span className="font-medium text-neutral-950">bespoke design demands bespoke execution</span>. When we design a sculptural reception desk, an art deco-inspired bar, or a hand-inlaid dining table, we don&apos;t hand the drawings off to a distant factory.
              </p>

              <p className="font-Satoshi text-lg font-light leading-relaxed text-neutral-700 lg:text-xl">
                This is not faster. It is not cheaper. But it is the only way to achieve the level of detail that defines ultra-luxury interiors.
              </p>
            </div>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            className="relative lg:col-span-6"
          >
            <div className="relative aspect-4/5 overflow-hidden">
              <SafeImage
                src="/placeholder.jpg"
                alt="Custom joinery craftsmanship"
                fill
                className="object-cover"
              />
              {/* Decorative frame */}
              <div className="absolute inset-4 border border-white/20 pointer-events-none" />
            </div>
            {/* Stats overlay */}
            <div className="absolute -bottom-6 left-8 right-8 grid grid-cols-2 gap-4 bg-neutral-950 p-6 lg:left-0 lg:right-auto lg:w-80">
              <div>
                <div className="font-SchnyderS text-3xl font-light text-[#c9a962]">40K</div>
                <div className="font-Satoshi text-xs font-light text-white/60">Sq ft facility</div>
              </div>
              <div>
                <div className="font-SchnyderS text-3xl font-light text-[#c9a962]">70+</div>
                <div className="font-Satoshi text-xs font-light text-white/60">Full-time craftsmen</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Section2() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const capabilities = [
    {
      id: 1,
      icon: IconMillwork,
      title: 'Custom Millwork & Built-Ins',
      subtitle: 'Architectural Joinery',
      image: '/placeholder.jpg',
      items: [
        {
          label: 'Wall Paneling & Feature Walls',
          desc: 'We produce full-height paneling systems in walnut, oak, marble-inlaid veneers, and hand-applied finishes. Every panel is shop-drawn, CNC-cut, and test-fitted before installation.',
        },
        {
          label: 'Reception Desks & Concierge Stations',
          desc: 'These are the "hero pieces" of commercial interiors. We fabricate them as sculptural objects — curved forms, backlit onyx inlays, integrated lighting, hidden cable management.',
        },
        {
          label: 'Built-In Cabinetry & Wardrobes',
          desc: 'We design and build floor-to-ceiling storage systems with soft-close mechanisms, internal LED lighting, pull-out drawers, and leather or velvet-lined interiors.',
        },
      ],
    },
    {
      id: 2,
      icon: IconFurniture,
      title: 'Furniture Manufacturing',
      subtitle: 'Bespoke Pieces',
      image: '/placeholder.jpg',
      items: [
        {
          label: 'Dining Tables',
          desc: 'Solid wood slabs, book-matched veneers, marble or brass inlay details. We produce both modern minimalist and ornate classical styles.',
        },
        {
          label: 'Lounge & Bedroom Furniture',
          desc: 'Upholstered headboards, side tables, console tables, credenzas. Each piece is designed to match the interior narrative and built to hotel-grade durability.',
        },
        {
          label: 'Outdoor Furniture (Select Materials)',
          desc: 'We manufacture teak, treated hardwood, and metal-framed outdoor furniture for resort and villa terraces.',
        },
      ],
    },
    {
      id: 3,
      icon: IconPrecision,
      title: 'CNC Precision & Hand Finishing',
      subtitle: 'The Process',
      image: '/placeholder.jpg',
      items: [
        {
          label: 'CNC Routing & Panel Cutting',
          desc: 'We use German CNC routers for precision cutting of complex shapes, fluting details, and inlay pockets. Tolerances down to 0.1mm.',
        },
        {
          label: 'Edge Banding & Veneering',
          desc: 'We apply real wood veneers (not laminates) and finish edges with solid wood or color-matched PVC. No visible seams.',
        },
        {
          label: 'Hand Sanding & Staining',
          desc: 'After CNC work, every piece goes through multi-stage hand sanding (120 → 180 → 240 grit) and hand-applied stains or lacquers. This is what separates "factory furniture" from "crafted furniture."',
        },
        {
          label: 'Spray Booth Finishing',
          desc: 'We operate an industrial spray booth for high-gloss lacquer, matte polyurethane, and metallic finishes. Multiple coats. Hand-buffed between layers.',
        },
      ],
    },
    {
      id: 4,
      icon: IconQuality,
      title: 'Quality Control & Delivery',
      subtitle: 'Pre-Installation Standards',
      image: '/placeholder.jpg',
      items: [
        {
          label: 'Pre-Approval Mock-Ups',
          desc: 'For every major joinery package, we produce a sample piece (e.g., one cabinet door, one wall panel) for client approval before full production. No surprises on site.',
        },
        {
          label: 'White-Glove Packaging',
          desc: 'We wrap finished pieces in protective foam, corner guards, and custom crating. Our delivery trucks have air-ride suspension to prevent vibration damage.',
        },
        {
          label: 'On-Site Assembly & Touch-Up',
          desc: 'Our factory foremen travel to site for final installation. If there&apos;s a scratch or misalignment, we fix it immediately with on-site touch-up kits and portable tools.',
        },
      ],
    },
  ];

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-neutral-50 px-6 py-32 sm:px-12 sm:py-40 lg:px-20 lg:py-48"
    >
      <div className="mx-auto max-w-7xl">

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          className="mb-20 font-SchnyderS text-4xl font-light leading-tight tracking-tight text-neutral-950 sm:text-5xl lg:text-6xl"
        >
          What We Manufacture In-House
        </motion.h2>

        <div className="space-y-32">
          {capabilities.map((capability, index) => {
            const IconComponent = capability.icon;
            const isEven = index % 2 === 0;
            return (
              <motion.div
                key={capability.id}
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.8,
                  ease: [0.22, 1, 0.36, 1],
                  delay: 0.2 + index * 0.1,
                }}
                className="group"
              >
                <div className={`grid gap-12 lg:grid-cols-12 lg:gap-16`}>
                  {/* Image */}
                  <div className={`relative lg:col-span-5 ${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
                    <div className="relative aspect-4/3 overflow-hidden bg-neutral-100">
                      <SafeImage
                        src={capability.image}
                        alt={capability.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    {/* Icon badge */}
                    <div className="absolute -bottom-4 -right-4 flex h-16 w-16 items-center justify-center border border-neutral-200 bg-white text-[#c9a962] shadow-lg transition-all duration-300 group-hover:bg-[#c9a962] group-hover:text-white lg:h-20 lg:w-20">
                      <IconComponent />
                    </div>
                  </div>

                  {/* Content */}
                  <div className={`flex flex-col justify-center lg:col-span-7 ${isEven ? 'lg:order-2' : 'lg:order-1'}`}>
                    <div className="space-y-2 mb-8">
                      <h3 className="font-SchnyderS text-3xl font-light text-neutral-950 transition-colors duration-300 group-hover:text-[#c9a962] lg:text-4xl">
                        {capability.title}
                      </h3>
                      <p className="font-Satoshi text-sm font-light uppercase tracking-wider text-neutral-500">
                        {capability.subtitle}
                      </p>
                    </div>

                    <div className="space-y-6">
                      {capability.items.map((item, itemIndex) => (
                        <div
                          key={itemIndex}
                          className="border-l-2 border-[#c9a962] pl-6 transition-colors hover:border-neutral-950"
                        >
                          <div className="mb-2 font-Satoshi text-lg font-medium text-neutral-950">
                            {item.label}
                          </div>
                          <p className="font-Satoshi text-base font-light leading-relaxed text-neutral-600">
                            {item.desc}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Section3() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-neutral-950 px-6 py-32 sm:px-12 sm:py-40 lg:px-20 lg:py-48"
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <SafeImage
          src="/placeholder.jpg"
          alt="Luxury joinery case study"
          fill
          className="object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-neutral-950/80" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-6 inline-block border border-white/20 px-6 py-2 font-Satoshi text-sm font-light uppercase tracking-[0.2em] text-white/60"
        >
          Case Study
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          className="mb-12 font-SchnyderS text-4xl font-light leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl"
        >
          The Address Boulevard
        </motion.h2>

        <div className="grid gap-16 lg:grid-cols-2 lg:gap-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            className="space-y-6"
          >
            <div className="inline-block border-b-2 border-[#c9a962] pb-2 font-Satoshi text-sm font-light uppercase tracking-wider text-[#c9a962]">
              The Address Boulevard, Dubai
            </div>

            <h3 className="font-SchnyderS text-3xl font-light text-white lg:text-4xl">
              342 Custom Headboards + Nightstands
            </h3>

            <p className="font-Satoshi text-base font-light leading-relaxed text-white/70 lg:text-lg">
              For the renovation of The Address Boulevard, we manufactured all bedroom joinery in-house:
            </p>

            <ul className="space-y-4 border-l-2 border-[#c9a962] pl-6">
              <li className="font-Satoshi text-base font-light leading-relaxed text-white/70">
                <span className="font-medium text-white">342 upholstered headboards</span> — fabric-wrapped MDF with internal LED backlighting and integrated USB ports.
              </li>
              <li className="font-Satoshi text-base font-light leading-relaxed text-white/70">
                <span className="font-medium text-white">684 floating nightstands</span> — wall-mounted, walnut veneer, soft-close drawers, hidden cable management.
              </li>
              <li className="font-Satoshi text-base font-light leading-relaxed text-white/70">
                <span className="font-medium text-white">All delivered on schedule</span> — phased production over 8 weeks, installed floor-by-floor with zero rework.
              </li>
            </ul>

            <p className="font-Satoshi text-base font-light leading-relaxed text-white/70 lg:text-lg">
              Client feedback: "This level of consistency is impossible to achieve with outsourced joinery. The fact that MIDC controlled the entire process — from design to delivery — gave us confidence at every stage."
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
            className="space-y-8"
          >
            <div className="space-y-4 border-t border-white/10 pt-8">
              <div className="font-Satoshi text-sm font-light uppercase tracking-wider text-white/50">
                Production Stats
              </div>
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <div className="mb-2 font-SchnyderS text-4xl font-light text-[#c9a962]">
                    70+
                  </div>
                  <div className="font-Satoshi text-sm font-light text-white/70">
                    Full-time craftsmen
                  </div>
                </div>
                <div>
                  <div className="mb-2 font-SchnyderS text-4xl font-light text-[#c9a962]">
                    40K
                  </div>
                  <div className="font-Satoshi text-sm font-light text-white/70">
                    Square feet facility
                  </div>
                </div>
                <div>
                  <div className="mb-2 font-SchnyderS text-4xl font-light text-[#c9a962]">
                    8
                  </div>
                  <div className="font-Satoshi text-sm font-light text-white/70">
                    Weeks production time
                  </div>
                </div>
                <div>
                  <div className="mb-2 font-SchnyderS text-4xl font-light text-[#c9a962]">
                    0
                  </div>
                  <div className="font-Satoshi text-sm font-light text-white/70">
                    Units requiring rework
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Section4() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-white px-6 py-32 sm:px-12 sm:py-40 lg:px-20 lg:py-48"
    >
      <div className="mx-auto max-w-7xl">

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          className="mb-8 text-center font-SchnyderS text-4xl font-light leading-tight tracking-tight text-neutral-950 sm:text-5xl lg:text-6xl"
        >
          MIDC <span className="text-[#c9a962]">Partner Brands</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
          className="mx-auto mb-16 max-w-3xl text-center font-Satoshi text-lg font-light leading-relaxed text-neutral-600"
        >
          We partner with the world&apos;s most prestigious furniture and interior brands to deliver uncompromising luxury.
        </motion.p>

        {/* Partner Brand Logos Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          className="grid grid-cols-3 gap-6 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6"
        >
          {partnerBrands.map((brand, index) => (
            <motion.div
              key={brand.filename}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1],
                delay: 0.3 + index * 0.05,
              }}
              className="group relative flex aspect-3/2 items-center justify-center rounded-sm border border-neutral-100 bg-neutral-50 p-4 transition-all duration-300 hover:border-[#c9a962]/30 hover:bg-white hover:shadow-lg"
            >
              <Image
                src={`/services/${brand.filename}`}
                alt={brand.alt}
                width={120}
                height={60}
                className="h-full w-full object-contain opacity-60 grayscale transition-all duration-300 group-hover:opacity-100 group-hover:grayscale-0"
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function Section5() {
  return (
    <FAQSection
      label="Expert Insights"
      title="Questions"
      titleHighlight="& Answers"
      showCTA={false}
      faqs={[
        {
          question: 'Why not just use IKEA or catalogue furniture for commercial projects?',
          answer:
            'IKEA is engineered for residential use — 5-10 years of occasional use. Hotels need furniture that withstands daily abuse from hundreds of guests, housekeeping staff dragging vacuum cleaners, and constant opening/closing of drawers. We build to "contract-grade" standards: reinforced joinery, commercial-grade hardware, and finishes that can be refinished (not wrapped in vinyl). An IKEA cabinet might cost AED 500. Ours costs AED 3,500. But ours lasts 20 years.',
        },
        {
          question: 'Can you replicate a designer piece I saw in a showroom?',
          answer:
            "Yes — with caveats. If you show us a photo of a sculptural console from a European brand, we can reverse-engineer it and produce a similar piece. We will not claim it's the original, and we will not use trademarked designs. But if you want something inspired by Brand X, adapted to your space, we can do that. Most luxury furniture is about proportion, finish, and craft — not patented technology.",
        },
        {
          question: 'How do you handle changes mid-production?',
          answer:
            "Short answer: badly. Once we've cut the wood, there's no undo. That's why we insist on sign-offs at every stage: shop drawings, material samples, mock-ups. If you approve the walnut stain sample and then ask for oak after we've stained 50 panels, we restart from scratch — and the cost/schedule adjusts accordingly. Our process is front-loaded with approvals to avoid this.",
        },
      ]}
    />
  );
}

function Section6() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section
      ref={ref}
      className="relative flex min-h-[70vh] items-center justify-center overflow-hidden bg-neutral-950 px-6 py-32 sm:px-12 sm:py-40 lg:px-20 lg:py-48"
    >
      <div className="relative z-10 mx-auto max-w-4xl text-center">

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          className="mb-8 font-SchnyderS text-4xl font-light leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl"
        >
          Tour the
          <br />
          <span className="text-[#c9a962]">Mouhajer Factory</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          className="mx-auto mb-12 max-w-2xl font-Satoshi text-lg font-light leading-relaxed text-white/70"
        >
          See where luxury is made. Book a factory visit and meet the craftsmen behind your project.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
          className="flex flex-col items-center justify-center gap-6 sm:flex-row"
        >
          <Link
            href="/contact"
            className="group inline-flex items-center gap-3 border-2 border-[#c9a962] bg-[#c9a962] px-8 py-4 font-Satoshi text-sm font-medium uppercase tracking-wider text-neutral-950 transition-all hover:bg-transparent hover:text-[#c9a962]"
          >
            Book Factory Tour
            <ArrowRight
              size={18}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>

          <Link
            href="/services"
            className="group inline-flex items-center gap-3 border-2 border-white px-8 py-4 font-Satoshi text-sm font-medium uppercase tracking-wider text-white transition-all hover:bg-white hover:text-neutral-950"
          >
            All Services
            <ArrowRight
              size={18}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </motion.div>
      </div>

      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950" />
    </section>
  );
}
