'use client';

import { useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

const certifications = [
  { name: 'ISO 9001', description: 'Quality Management' },
  { name: 'ISO 14001', description: 'Environmental Management' },
  { name: 'ISO 45001', description: 'Occupational Health & Safety' },
];

const awards = [
  'Arabian Property Awards - Best Hotel Interior',
  'Arabian Property Awards - Best Residential Apartment',
  'Middle East Design Award - Luxury Hospitality',
  'Dubai Quality Award - Construction Excellence',
];

const industries = [
  {
    title: 'Luxury Hospitality',
    subtitle: 'The Partner of Choice for 5-Star Brands',
    description: 'We understand the delicate balance of hospitality renovation, upgrading operating assets, without disrupting the guest experience.',
    link: '/industries/hospitality',
  },
  {
    title: 'High-End Residential',
    subtitle: 'Creating Private Sanctuaries',
    description: 'For over 25 years, MIDC has been the secret behind some of Dubai\'s most exclusive private addresses.',
    link: '/industries/residential',
  },
  {
    title: 'Commercial & Corporate',
    subtitle: 'Defining Business Environments',
    description: 'We build spaces that empower business. Our design-build approach ensures functional, branded environments delivered on tight timelines.',
    link: '/industries/commercial',
  },
];

export function IndustryValidation() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const leftY = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const rightY = useTransform(scrollYProgress, [0, 1], [-20, 20]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.5, 1, 1, 0.5]);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-screen items-center overflow-hidden bg-neutral-100 px-4 py-16 sm:px-6 sm:py-20 lg:px-12 lg:py-24"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:40px_40px] sm:bg-[size:60px_60px]" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left Column - Certifications & Awards */}
          <motion.div style={{ y: leftY, opacity }}>
            {/* Certifications */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="mb-10 sm:mb-12"
            >
              <div className="mb-4 flex items-center gap-3 sm:mb-6 sm:gap-4">
                <div className="h-px w-8 bg-neutral-300 sm:w-12" />
                <span className="text-[10px] font-light uppercase tracking-[0.2em] text-neutral-400 sm:text-xs sm:tracking-[0.3em]">
                  Industry Validation
                </span>
              </div>

              <h2 className="mb-6 text-3xl font-extralight tracking-tight text-neutral-950 sm:mb-8 sm:text-4xl lg:text-5xl">
                Certified for
                <br />
                <span className="text-neutral-300">High-Value Execution</span>
              </h2>

              {/* ISO Certifications */}
              <div className="space-y-3 sm:space-y-4">
                {certifications.map((cert, index) => (
                  <motion.div
                    key={cert.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                    className="group flex items-center gap-4 border border-neutral-200 bg-white p-4 transition-all hover:border-neutral-300 sm:gap-5 sm:p-5"
                  >
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center border border-neutral-950 sm:h-12 sm:w-12">
                      <span className="text-xs font-light text-neutral-950 sm:text-sm">✓</span>
                    </div>
                    <div className="flex-grow">
                      <div className="text-sm font-light text-neutral-950 sm:text-base">{cert.name}</div>
                      <div className="text-xs font-light text-neutral-500 sm:text-sm">{cert.description}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Awards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="mb-4 flex items-center gap-3 sm:mb-6">
                <div className="h-px w-8 bg-neutral-300 sm:w-12" />
                <span className="text-[10px] font-light uppercase tracking-[0.15em] text-neutral-400 sm:text-xs sm:tracking-[0.2em]">
                  Recognition & Awards
                </span>
              </div>

              <div className="space-y-2 sm:space-y-3">
                {awards.map((award, index) => (
                  <motion.div
                    key={award}
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                    className="flex items-start gap-3 sm:gap-4"
                  >
                    <span className="mt-1.5 h-1 w-1 flex-shrink-0 bg-neutral-950" />
                    <span className="text-xs font-light text-neutral-600 sm:text-sm">{award}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column - Industries */}
          <motion.div style={{ y: rightY }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-6 sm:mb-8"
            >
              <div className="mb-4 flex items-center gap-3 sm:mb-6 sm:gap-4">
                <div className="h-px w-8 bg-neutral-300 sm:w-12" />
                <span className="text-[10px] font-light uppercase tracking-[0.2em] text-neutral-400 sm:text-xs sm:tracking-[0.3em]">
                  Sectors of Expertise
                </span>
              </div>

              <h3 className="text-2xl font-extralight tracking-tight text-neutral-950 sm:text-3xl lg:text-4xl">
                Industries We Serve
              </h3>
              <p className="mt-2 text-xs font-light text-neutral-500 sm:text-sm">
                Delivering turnkey excellence across the UAE&apos;s most dynamic industries.
              </p>
            </motion.div>

            {/* Industry Cards */}
            <div className="space-y-3 sm:space-y-4">
              {industries.map((industry, index) => (
                <motion.div
                  key={industry.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                >
                  <Link
                    href={industry.link}
                    className="group block border border-neutral-200 bg-white p-5 transition-all hover:border-neutral-300 sm:p-6"
                  >
                    <div className="mb-3 sm:mb-4">
                      <div className="mb-1 text-base font-light text-neutral-950 sm:text-lg">
                        {industry.title}
                      </div>
                      <div className="text-[10px] font-light text-neutral-400 sm:text-xs">
                        {industry.subtitle}
                      </div>
                    </div>

                    <p className="mb-3 text-xs font-light leading-relaxed text-neutral-500 sm:mb-4 sm:text-sm">
                      {industry.description}
                    </p>

                    <div className="flex items-center gap-2 text-[10px] font-light text-neutral-400 transition-colors group-hover:text-neutral-950 sm:text-xs">
                      <span>Learn More</span>
                      <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" strokeWidth={1} />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
