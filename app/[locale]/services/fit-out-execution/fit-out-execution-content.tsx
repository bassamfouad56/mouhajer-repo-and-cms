'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { FAQSection } from '@/components/sections/faq';
import Link from 'next/link';
import { SafeImage } from '@/components/safe-image';

// Professional minimalist SVG icons
const IconFlooring = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="4" width="40" height="40" />
    <path d="M4 16h40M4 28h40M4 40h20M24 4v36" />
    <path d="M14 4v12M34 16v12M14 28v12" />
  </svg>
);

const IconJoinery = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
    <rect x="8" y="8" width="32" height="32" rx="2" />
    <path d="M8 20h32M24 8v32" />
    <circle cx="16" cy="14" r="2" />
    <circle cx="32" cy="14" r="2" />
  </svg>
);

const IconMEP = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="24" cy="24" r="8" />
    <path d="M24 4v8M24 36v8M4 24h8M36 24h8" />
    <path d="M10 10l6 6M32 32l6 6M10 38l6-6M32 16l6-6" />
  </svg>
);

const IconFinishes = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 4l4 8 4-8" />
    <path d="M24 12v24" />
    <path d="M12 36h24l-12 8z" />
    <circle cx="24" cy="28" r="4" />
  </svg>
);

export default function FitOutExecutionContent() {
  return (
    <main className="overflow-hidden bg-white">
      <HeroSection />
      <Section1 />
      <Section2 />
      <Section3 />
      <Section4 />
      <Section5 />
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
      {/* Background Image */}
      <div className="absolute inset-0">
        <SafeImage
          src="/projects/turnkey-design-fitout/_MID2543-HDR.jpg"
          alt="Luxury fit-out execution"
          fill
          className="object-cover"
          priority
        />
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
          The
          <br />
          <span className="text-[#c9a962]">Craftsmen</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          className="mx-auto mb-12 max-w-3xl px-4 font-Satoshi text-lg font-light leading-relaxed text-white/70 sm:px-0 sm:text-xl"
        >
          The difference between a drawing and a landmark is the hand that builds it.
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
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            className="lg:col-span-5"
          >
            <h2 className="mb-6 font-SchnyderS text-4xl font-light leading-tight tracking-tight text-neutral-950 sm:text-5xl lg:text-6xl">
              We <span className="italic">Install</span>.
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            className="space-y-6 lg:col-span-7"
          >
            <p className="font-Satoshi text-lg font-light leading-relaxed text-neutral-700 lg:text-xl">
              This is the stage where 90% of interior contractors fail. They have beautiful drawings. They have expensive materials. But they send poorly trained subcontractors to site, and the result is crooked tiles, visible seams, and paint splatter on marble floors.
            </p>

            <p className="font-Satoshi text-lg font-light leading-relaxed text-neutral-700 lg:text-xl">
              We are not that contractor. <span className="font-medium text-neutral-950">We employ full-time installation teams</span> — masons, tilers, carpenters, painters, electricians, and finishers — who work exclusively for MIDC. They know our standards. They know our details. They know that "good enough" is not acceptable.
            </p>

            <p className="font-Satoshi text-lg font-light leading-relaxed text-neutral-700 lg:text-xl">
              Every installer is trained in our internal "MIDC Installation Standards" manual. Every foreman carries a digital punchlist. Every trade knows they will be held accountable — not by an external QA consultant, but by Eng. Maher Mouhajer himself, who visits every major project weekly.
            </p>

            <p className="font-Satoshi text-lg font-light leading-relaxed text-neutral-700 lg:text-xl">
              This is not faster. It is not cheaper. But it is the only way to ensure that the space you imagined in 3D renderings is the space you walk into on opening day.
            </p>
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
      icon: IconFlooring,
      title: 'Flooring & Wall Finishes',
      subtitle: 'The Foundation of Visual Quality',
      image: '/projects/commercial-interior/_MID7362-HDR.jpg',
      items: [
        {
          label: 'Marble & Stone Installation',
          desc: 'We use laser-guided leveling systems to ensure floor tiles are within 1mm tolerance. Book-matched slabs are dry-laid before installation to verify vein continuity. Grouting is done with color-matched epoxy (not cement) for stain resistance.',
        },
        {
          label: 'Hardwood & Engineered Flooring',
          desc: 'We acclimatize wood planks on-site for 72 hours before installation to prevent post-install expansion. Subfloors are checked for moisture content. Planks are glued + nailed (not floating) for hotel-grade durability.',
        },
        {
          label: 'Wall Paneling & Feature Walls',
          desc: 'Whether it&apos;s fluted wood panels, leather-wrapped walls, or backlit onyx — we install it with hidden fixings, perfect alignment, and no visible fasteners. Every joint is laser-checked for straightness.',
        },
      ],
    },
    {
      id: 2,
      icon: IconJoinery,
      title: 'Joinery & Furniture Installation',
      subtitle: 'From Factory to Final Position',
      image: '/projects/bedroom-interior/Master bedroom cam1.jpg',
      items: [
        {
          label: 'Built-In Cabinetry',
          desc: 'Our joinery installation teams are the same craftsmen who built the pieces in our factory. They know every drawer, hinge, and handle. If a cabinet doesn&apos;t fit perfectly (e.g., due to a site dimension error), they modify it on-site with portable tools.',
        },
        {
          label: 'Furniture Placement & Styling',
          desc: 'We don&apos;t just "deliver furniture." We place, level, style, and photograph every piece. For hotel projects, we follow brand standards for pillow arrangement, artwork placement, and amenity positioning.',
        },
        {
          label: 'Artwork & Mirrors',
          desc: 'We use French cleats and hidden brackets (not visible wire hangers). Every frame is leveled with a digital inclinometer. For large mirrors (e.g., gym walls), we use steel sub-frames anchored to structural concrete.',
        },
      ],
    },
    {
      id: 3,
      icon: IconMEP,
      title: 'MEP Final Connections',
      subtitle: 'Lighting, Power, Plumbing',
      image: '/projects/commercial-interior/11.jpg',
      items: [
        {
          label: 'Lighting Installation & Aiming',
          desc: 'We install all architectural lighting (recessed, linear, pendant) and then "aim" every spotlight to highlight artwork, floral arrangements, and key design features. Dimming systems are programmed with preset scenes.',
        },
        {
          label: 'Electrical Fit-Out',
          desc: 'We install power outlets, USB sockets, floor boxes, and concealed cable management systems. Every outlet is tested for grounding and polarity before handover.',
        },
        {
          label: 'Plumbing & Sanitary Fixtures',
          desc: 'We install luxury fixtures (Hansgrohe, Dornbracht, etc.) with proper waterproofing, pressure testing, and chrome protection during construction. Faucets are polished before handover (no fingerprints).',
        },
      ],
    },
    {
      id: 4,
      icon: IconFinishes,
      title: 'Final Finishes & Detailing',
      subtitle: 'The Last 5% That Defines Luxury',
      image: '/projects/turnkey-design-fitout/_MID2653-HDR.jpg',
      items: [
        {
          label: 'Paint Touch-Ups & Wall Perfection',
          desc: 'After all trades are complete, we send in a "finish team" to repair any dings, scratches, or paint chips caused during installation. Walls are inspected under raking light (angled light that reveals imperfections).',
        },
        {
          label: 'Hardware & Accessory Install',
          desc: 'Towel bars, robe hooks, toilet paper holders, door stops — these "small details" are installed last, polished, and aligned perfectly. No crooked towel bars. No loose screws.',
        },
        {
          label: 'Final Clean & White-Glove Handover',
          desc: 'We hire professional post-construction cleaners (not laborers) to deep-clean every surface. Windows are polished. Floors are buffed. Protective films are removed. The space is photo-ready on handover day.',
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
          Our Fit-Out Capabilities
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
                <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
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
      <div className="mx-auto max-w-7xl">

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          className="mb-12 font-SchnyderS text-4xl font-light leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl"
        >
          Case Study
        </motion.h2>

        <div className="grid gap-16 lg:grid-cols-2 lg:gap-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            className="space-y-6"
          >
            <div className="inline-block border-b-2 border-[#c9a962] pb-2 font-Satoshi text-sm font-light uppercase tracking-wider text-[#c9a962]">
              Armani Hotel, Burj Khalifa
            </div>

            <h3 className="font-SchnyderS text-3xl font-light text-white lg:text-4xl">
              160 Guest Rooms — Zero Rework
            </h3>

            <p className="font-Satoshi text-base font-light leading-relaxed text-white/70 lg:text-lg">
              The Armani Hotel renovation was a masterclass in precision fit-out. The challenge: install new flooring, wall panels, lighting, and furniture in 160 occupied guest rooms — without disrupting hotel operations.
            </p>

            <p className="font-Satoshi text-base font-light leading-relaxed text-white/70 lg:text-lg">
              Our approach:
            </p>

            <ul className="space-y-4 border-l-2 border-[#c9a962] pl-6">
              <li className="font-Satoshi text-base font-light leading-relaxed text-white/70">
                <span className="font-medium text-white">Rolling Schedule</span> — We fit-out 4 rooms per week, working night shifts (11 PM to 7 AM) to avoid guest disturbance.
              </li>
              <li className="font-Satoshi text-base font-light leading-relaxed text-white/70">
                <span className="font-medium text-white">Pre-Fabrication</span> — All joinery, lighting, and millwork was pre-assembled and tested in our factory before delivery to site.
              </li>
              <li className="font-Satoshi text-base font-light leading-relaxed text-white/70">
                <span className="font-medium text-white">Quality Gates</span> — Every room was inspected by our QA team, then by Armani&apos;s brand standards team, then by hotel management. No room opened until it was perfect.
              </li>
            </ul>

            <p className="font-Satoshi text-base font-light leading-relaxed text-white/70 lg:text-lg">
              Result: <span className="font-medium text-white">160 rooms completed in 10 months. Zero defects. Zero guest complaints. Zero rework.</span>
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
                Project Stats
              </div>
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <div className="mb-2 font-SchnyderS text-4xl font-light text-[#c9a962]">
                    160
                  </div>
                  <div className="font-Satoshi text-sm font-light text-white/70">
                    Guest rooms renovated
                  </div>
                </div>
                <div>
                  <div className="mb-2 font-SchnyderS text-4xl font-light text-[#c9a962]">
                    10
                  </div>
                  <div className="font-Satoshi text-sm font-light text-white/70">
                    Months to completion
                  </div>
                </div>
                <div>
                  <div className="mb-2 font-SchnyderS text-4xl font-light text-[#c9a962]">
                    0
                  </div>
                  <div className="font-Satoshi text-sm font-light text-white/70">
                    Guest complaints
                  </div>
                </div>
                <div>
                  <div className="mb-2 font-SchnyderS text-4xl font-light text-[#c9a962]">
                    0
                  </div>
                  <div className="font-Satoshi text-sm font-light text-white/70">
                    Rooms requiring rework
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
  return (
    <FAQSection
      label="Expert Insights"
      title="Questions"
      titleHighlight="& Answers"
      showCTA={false}
      faqs={[
        {
          question: 'Why does fit-out always take longer than promised?',
          answer:
            "Because most contractors don't control their supply chain. They order materials from 10 different suppliers, and if one shipment is delayed (e.g., Italian marble stuck in customs), the entire schedule collapses. We avoid this by: (1) Manufacturing joinery in-house, (2) Pre-ordering long-lead items (stone, fabrics, lighting) at project start, and (3) Maintaining buffer stock of common finishes. We also build 10% schedule contingency into every timeline — not because we expect delays, but because surprises happen (e.g., hidden structural issues).",
        },
        {
          question: 'How do you prevent damage during installation?',
          answer:
            'Three layers of protection: (1) Floor protection — We lay corrugated cardboard + reinforced plastic over finished floors until final handover. (2) Corner guards — Every door frame, column, and furniture corner gets foam corner guards during construction. (3) Final inspection — Before we remove protection, we walk every space with the client, looking for dings, scratches, or defects. If we find damage, we fix it before handover (not after).',
        },
        {
          question: 'Can you work around an operating business (e.g., a restaurant staying open during renovation)?',
          answer:
            "Yes — but it doubles the complexity. We've renovated operating hotel lobbies, restaurants, and offices by: (1) Phasing the work (e.g., close half the restaurant, renovate it, reopen, then close the other half), (2) Working night shifts or weekends, (3) Using dust barriers, sound blankets, and HEPA vacuums to minimize disruption. It takes longer and costs more, but it's possible — and often necessary for businesses that can't afford to close.",
        },
      ]}
    />
  );
}

function Section5() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section
      ref={ref}
      className="relative flex min-h-[70vh] items-center justify-center overflow-hidden bg-neutral-950 px-6 py-32 sm:px-12 sm:py-40 lg:px-20 lg:py-48"
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <SafeImage
          src="/projects/commercial-interior/16.jpg"
          alt="Luxury fit-out execution"
          fill
          className="object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-neutral-950/70" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-6 inline-block border border-white/20 px-6 py-2 font-Satoshi text-sm font-light uppercase tracking-[0.2em] text-white/60"
        >
          Get Started
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          className="mb-8 font-SchnyderS text-4xl font-light leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl"
        >
          Ready to
          <br />
          <span className="text-[#c9a962]">Execute Perfection?</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          className="mx-auto mb-12 max-w-2xl font-Satoshi text-lg font-light leading-relaxed text-white/70"
        >
          Let&apos;s discuss your project timeline, budget, and quality expectations.
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
            Start Your Project
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
    </section>
  );
}
