'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { SafeImage } from '@/components/safe-image';

// Professional minimalist SVG icons
const IconHandover = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
    <rect x="8" y="8" width="32" height="32" rx="2" />
    <path d="M16 20l6 6 10-10" />
    <path d="M16 32h16" />
    <path d="M16 38h8" />
  </svg>
);

const IconWarranty = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
    <path d="M24 4L8 12v12c0 11 7 21 16 24 9-3 16-13 16-24V12L24 4z" />
    <path d="M24 20v8M24 32v2" />
  </svg>
);

const IconMaintenance = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="24" cy="24" r="8" />
    <path d="M24 4v8M24 36v8M4 24h8M36 24h8" />
    <path d="M10 10l6 6M32 32l6 6M10 38l6-6M32 16l6-6" />
  </svg>
);

const IconTraining = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
    <rect x="8" y="12" width="32" height="24" rx="2" />
    <path d="M24 36v8M16 44h16" />
    <path d="M16 24h16M16 30h8" />
  </svg>
);

export default function HandoverMaintenanceContent() {
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
          src="/projects/commercial-interior/18.jpg"
          alt="Handover and maintenance services"
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
          The Keys
          <br />
          <span className="text-[#d4af37]">& Beyond</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          className="mx-auto mb-12 max-w-3xl px-4 font-Satoshi text-lg font-light leading-relaxed text-white/70 sm:px-0 sm:text-xl"
        >
          We don&apos;t just build your asset. We protect it.
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
              We <span className="italic">Protect</span>.
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            className="space-y-6 lg:col-span-7"
          >
            <p className="font-Satoshi text-lg font-light leading-relaxed text-neutral-700 lg:text-xl">
              Most contractors disappear the day after handover. They got paid. They moved on. If something breaks — a drawer stops closing, a light flickers, a faucet drips — you&apos;re on your own.
            </p>

            <p className="font-Satoshi text-lg font-light leading-relaxed text-neutral-700 lg:text-xl">
              We don&apos;t operate that way. <span className="font-medium text-neutral-950">We stay</span>. We provide a 12-month defects liability period (standard in UAE construction contracts) and extend it with optional maintenance contracts for clients who want long-term peace of mind.
            </p>

            <p className="font-Satoshi text-lg font-light leading-relaxed text-neutral-700 lg:text-xl">
              Why? Because we built it. We know every screw, hinge, and wire. We know which HVAC unit serves which zone. We know which marble slab came from which quarry batch. If something goes wrong, we don&apos;t need to "investigate" — we already know the answer.
            </p>

            <p className="font-Satoshi text-lg font-light leading-relaxed text-neutral-700 lg:text-xl">
              This is not just good service. It&apos;s good business. A well-maintained interior lasts 15-20 years. A neglected one starts showing wear in 3-5 years. We want your space to look as good in Year 5 as it did on opening day.
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

  const services = [
    {
      id: 1,
      icon: IconHandover,
      title: 'Handover & Documentation',
      subtitle: 'The Final Step',
      items: [
        {
          label: 'Pre-Handover Inspection',
          desc: 'We conduct a room-by-room walkthrough with the client, documenting any defects on a digital punchlist. Nothing is marked "complete" until the client agrees.',
        },
        {
          label: 'As-Built Drawings',
          desc: 'We provide updated CAD drawings showing the final installed layout (not the original design — the "as-built" reality). This is critical for future renovations or maintenance.',
        },
        {
          label: 'O&M Manuals (Operations & Maintenance)',
          desc: 'We compile manuals for all MEP systems, custom joinery, and specialty finishes. Includes warranty certificates, care instructions, and emergency contact numbers.',
        },
        {
          label: 'Warranty Certificates',
          desc: 'We provide manufacturer warranties for all fixtures, appliances, and materials — and aggregate them into a single "Warranty Tracker" spreadsheet with expiry dates.',
        },
      ],
    },
    {
      id: 2,
      icon: IconWarranty,
      title: '12-Month Defects Liability Period',
      subtitle: 'Standard Protection',
      items: [
        {
          label: 'What&apos;s Covered',
          desc: 'Any defect caused by faulty workmanship or materials (e.g., paint peeling, drawer not closing, tile cracking). We fix it at no cost.',
        },
        {
          label: 'What&apos;s Not Covered',
          desc: 'Damage caused by misuse, accidents, or normal wear-and-tear (e.g., scratched marble from dragging furniture). We&apos;ll still fix it — but we&apos;ll charge for it.',
        },
        {
          label: 'Response Time',
          desc: 'Non-urgent defects (e.g., cosmetic touch-ups): Fixed within 7 days. Urgent defects (e.g., plumbing leak, electrical fault): Technician on-site within 24 hours.',
        },
        {
          label: 'Emergency Support',
          desc: 'For hotel/restaurant clients, we provide 24/7 emergency response. If a guest room floods at 2 AM, we&apos;re there. No voicemail. No delays.',
        },
      ],
    },
    {
      id: 3,
      icon: IconMaintenance,
      title: 'Post-Warranty Maintenance',
      subtitle: 'Optional Long-Term Contracts',
      items: [
        {
          label: 'Annual Maintenance Contracts (AMC)',
          desc: 'Quarterly inspections + priority service + discounted repair rates. Ideal for hotels, restaurants, and high-traffic commercial spaces.',
        },
        {
          label: 'On-Call Maintenance',
          desc: 'No contract. Pay-per-visit. We show up when you need us. Ideal for residential villas and small offices.',
        },
        {
          label: 'Refurbishment Planning',
          desc: 'After 5-7 years, luxury interiors need a "refresh" (e.g., reupholstering furniture, refinishing floors, repainting). We provide a refurbishment roadmap and budget estimate.',
        },
      ],
    },
    {
      id: 4,
      icon: IconTraining,
      title: 'Training & Handover Sessions',
      subtitle: 'Knowledge Transfer',
      items: [
        {
          label: 'MEP Systems Training',
          desc: 'We train your facilities team on HVAC controls, lighting scenes, and electrical panels. They get a printed manual + video tutorials.',
        },
        {
          label: 'Finishing Care Instructions',
          desc: 'How to clean marble without etching it. How to maintain wood floors. Which cleaners to avoid. We provide a printed "Care Guide" for every material in your space.',
        },
        {
          label: 'Warranty Claim Process',
          desc: 'If a fixture fails (e.g., a faucet cartridge), we walk you through the warranty claim process — or handle it for you if you&apos;re on a maintenance contract.',
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
          What We Provide After Handover
        </motion.h2>

        <div className="space-y-32">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.8,
                  ease: [0.22, 1, 0.36, 1],
                  delay: 0.2 + index * 0.1,
                }}
                className="group grid gap-12 lg:grid-cols-12"
              >
                <div className="lg:col-span-3">
                  <div className="mb-6 inline-flex h-20 w-20 items-center justify-center border border-neutral-200 bg-white text-[#d4af37] transition-all duration-300 group-hover:bg-[#d4af37] group-hover:text-white">
                    <IconComponent />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-SchnyderS text-2xl font-light text-neutral-950 transition-colors duration-300 group-hover:text-[#d4af37] lg:text-3xl">
                      {service.title}
                    </h3>
                    <p className="font-Satoshi text-sm font-light uppercase tracking-wider text-neutral-500">
                      {service.subtitle}
                    </p>
                  </div>
                </div>

                <div className="space-y-8 lg:col-span-9">
                  {service.items.map((item, itemIndex) => (
                    <div
                      key={itemIndex}
                      className="border-l-2 border-[#d4af37] pl-6 transition-colors hover:border-neutral-950"
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
            <div className="inline-block border-b-2 border-[#d4af37] pb-2 font-Satoshi text-sm font-light uppercase tracking-wider text-[#d4af37]">
              Four Seasons Resort, Jumeirah Beach
            </div>

            <h3 className="font-SchnyderS text-3xl font-light text-white lg:text-4xl">
              5-Year Maintenance Contract
            </h3>

            <p className="font-Satoshi text-base font-light leading-relaxed text-white/70 lg:text-lg">
              After completing the resort&apos;s beachfront villas renovation in 2019, Four Seasons signed a 5-year maintenance contract with MIDC. Here&apos;s what we&apos;ve delivered:
            </p>

            <ul className="space-y-4 border-l-2 border-[#d4af37] pl-6">
              <li className="font-Satoshi text-base font-light leading-relaxed text-white/70">
                <span className="font-medium text-white">Quarterly Inspections</span> — We inspect all 60 villas every 3 months, documenting wear-and-tear and scheduling preventive maintenance.
              </li>
              <li className="font-Satoshi text-base font-light leading-relaxed text-white/70">
                <span className="font-medium text-white">24/7 Emergency Response</span> — Average response time: 2.3 hours (from call to technician on-site).
              </li>
              <li className="font-Satoshi text-base font-light leading-relaxed text-white/70">
                <span className="font-medium text-white">Proactive Refurbishment</span> — In Year 3, we refinished all outdoor teak furniture (sun damage). In Year 4, we reupholstered 15 villa headboards (fabric fading).
              </li>
              <li className="font-Satoshi text-base font-light leading-relaxed text-white/70">
                <span className="font-medium text-white">Cost Savings</span> — By catching issues early, Four Seasons avoided major repairs. Estimated savings over 5 years: AED 1.2M vs. reactive maintenance.
              </li>
            </ul>

            <p className="font-Satoshi text-base font-light leading-relaxed text-white/70 lg:text-lg">
              Client feedback: &quot;MIDC treats our property as if it were their own. We never worry about maintenance — they&apos;re always one step ahead.&quot;
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
                Maintenance Stats (5 Years)
              </div>
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <div className="mb-2 font-SchnyderS text-4xl font-light text-[#d4af37]">
                    240
                  </div>
                  <div className="font-Satoshi text-sm font-light text-white/70">
                    Routine inspections
                  </div>
                </div>
                <div>
                  <div className="mb-2 font-SchnyderS text-4xl font-light text-[#d4af37]">
                    87
                  </div>
                  <div className="font-Satoshi text-sm font-light text-white/70">
                    Emergency callouts
                  </div>
                </div>
                <div>
                  <div className="mb-2 font-SchnyderS text-4xl font-light text-[#d4af37]">
                    2.3h
                  </div>
                  <div className="font-Satoshi text-sm font-light text-white/70">
                    Avg. response time
                  </div>
                </div>
                <div>
                  <div className="mb-2 font-SchnyderS text-4xl font-light text-[#d4af37]">
                    1.2M
                  </div>
                  <div className="font-Satoshi text-sm font-light text-white/70">
                    AED saved vs. reactive
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

  const insights = [
    {
      question: 'Do I really need a maintenance contract, or can I just call you when something breaks?',
      answer:
        'You can absolutely call us on-demand (pay-per-visit). But here&apos;s the trade-off: Without a contract, we don&apos;t proactively monitor your space. We don&apos;t catch small issues before they become expensive problems. For example, a slow plumbing leak behind a wall might go unnoticed for months — causing AED 50,000 in water damage. With quarterly inspections, we&apos;d catch it during the first visit and fix it for AED 500. Maintenance contracts aren&apos;t about fixing things faster — they&apos;re about preventing things from breaking in the first place.',
    },
    {
      question: 'What happens if MIDC goes out of business? Will I lose my warranty?',
      answer:
        'Valid concern. Here&apos;s our safety net: (1) We provide manufacturer warranties (not just contractor warranties) for all fixtures, appliances, and materials. Even if MIDC vanished tomorrow, you could claim warranty directly from Hansgrohe, Daikin, etc. (2) We&apos;re a 30+ year-old company with 200+ employees, AED 100M+ annual revenue, and a track record of completing 1,000+ projects. We&apos;re not going anywhere. (3) For large projects (e.g., hotels), we can arrange third-party warranty insurance through providers like Qatar Insurance Company.',
    },
    {
      question: 'Can I hire a cheaper contractor for post-warranty maintenance?',
      answer:
        'Yes — but they won&apos;t know your space the way we do. They&apos;ll need to "figure out" which HVAC unit serves which room, where the shutoff valves are, what type of wood finish was used (so they can match it for repairs). Every service call becomes an investigation, which wastes time and money. We already have all that information. We walk in, diagnose the issue in 5 minutes, and fix it. That speed and knowledge is what you&apos;re paying for.',
    },
  ];

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-white px-6 py-32 sm:px-12 sm:py-40 lg:px-20 lg:py-48"
    >
      <div className="mx-auto max-w-5xl">

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          className="mb-20 font-SchnyderS text-4xl font-light leading-tight tracking-tight text-neutral-950 sm:text-5xl lg:text-6xl"
        >
          Expert Insights
        </motion.h2>

        <div className="space-y-16">
          {insights.map((insight, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1],
                delay: 0.2 + index * 0.1,
              }}
              className="border-l-2 border-[#d4af37] pl-8 transition-colors hover:border-neutral-950"
            >
              <h3 className="mb-6 font-SchnyderS text-2xl font-light leading-tight text-neutral-950 lg:text-3xl">
                {insight.question}
              </h3>
              <p className="font-Satoshi text-base font-light leading-relaxed text-neutral-600 lg:text-lg">
                {insight.answer}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
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
      <div className="relative z-10 mx-auto max-w-4xl text-center">

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          className="mb-8 font-SchnyderS text-4xl font-light leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl"
        >
          Protect Your
          <br />
          <span className="text-[#d4af37]">Investment</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          className="mx-auto mb-12 max-w-2xl font-Satoshi text-lg font-light leading-relaxed text-white/70"
        >
          Let&apos;s discuss warranty coverage and maintenance options for your project.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
          className="flex flex-col items-center justify-center gap-6 sm:flex-row"
        >
          <Link
            href="/contact"
            className="group inline-flex items-center gap-3 border-2 border-[#d4af37] bg-[#d4af37] px-8 py-4 font-Satoshi text-sm font-medium uppercase tracking-wider text-neutral-950 transition-all hover:bg-transparent hover:text-[#d4af37]"
          >
            Discuss Maintenance
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
