'use client';

import { useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { SafeImage } from '@/components/safe-image';

const clients = [
  { name: 'ADNH', fullName: 'Abu Dhabi National Hotels' },
  { name: 'Wasl', fullName: 'Wasl Properties' },
  { name: 'Emaar', fullName: 'Emaar Properties' },
];

export function StandardsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ['6%', '-6%']);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-white py-32 sm:py-40 lg:py-48"
    >
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-linear-to-b from-white via-neutral-50/30 to-white" />

      <div className="relative z-10 mx-auto max-w-[1600px] px-6 lg:px-12 xl:px-16">

        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="mb-32"
        >
          <div className="mb-8">
            <div className="mb-2 h-px w-16 bg-neutral-900" />
            <span className="font-Satoshi text-[10px] font-medium uppercase tracking-[0.3em] text-neutral-400">
              Company Culture
            </span>
          </div>

          <h2 className="mb-12 font-SchnyderS text-5xl font-light leading-[1.05] tracking-tight text-neutral-950 sm:text-6xl lg:text-7xl xl:text-8xl">
            We Are All Allergic
            <br />
            <span className="text-neutral-300">to Average</span>
          </h2>
        </motion.div>

        {/* Main Content Grid */}
        <div className="mb-32 grid gap-20 lg:grid-cols-12 lg:gap-24">

          {/* Left: Large Founder Image with Quote */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            className="lg:col-span-7"
          >
            <motion.div
              style={{ y: imageY }}
              className="relative aspect-3/4 overflow-hidden bg-neutral-100"
            >
              <SafeImage
                src="/founder/CEO Arabia.jpg"
                alt="Eng. Maher Mouhajer on construction site"
                fill
                className="object-cover object-center"
              />

              {/* Minimal gradient for text */}
              <div className="absolute inset-0 bg-linear-to-t from-neutral-950/70 via-transparent to-transparent" />

              {/* Quote overlay - bottom */}
              <div className="absolute bottom-0 left-0 right-0 p-10 lg:p-12 xl:p-16">
                <div className="border-l-2 border-[#d4af37] pl-6">
                  <p className="font-SchnyderS text-2xl font-light leading-tight text-white lg:text-3xl">
                    "Excellence is not an act, but a habit embedded in every team member."
                  </p>
                  <div className="mt-4 font-Satoshi text-sm font-light text-white/60">
                    — Eng. Maher Mouhajer
                  </div>
                </div>
              </div>

              {/* Gold accent line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-[#d4af37]" />
            </motion.div>
          </motion.div>

          {/* Right: Content */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
            className="flex flex-col justify-center lg:col-span-5"
          >
            <div className="space-y-8 font-Satoshi text-lg font-light leading-relaxed text-neutral-600 lg:text-xl">
              <p>
                The{' '}
                <span className="font-normal text-neutral-950">"MIDC Standard"</span>{' '}
                is not just Eng. Maher's rule; it is the company's heartbeat.
              </p>

              <p>
                Whether it is a site laborer ensuring a clean workspace or a senior architect
                refining a Royal Suite layout, every employee understands that{' '}
                <span className="font-normal text-neutral-950">
                  "good enough" is not in our vocabulary
                </span>
                .
              </p>

              <p>
                Eng. Maher Mouhajer is often found on-site, not to police his team, but to support them.
                He is there to solve the impossible problems and to celebrate the breakthroughs.
              </p>
            </div>

            {/* Client Trust Section */}
            <div className="mt-16 border-t border-neutral-200 pt-12">
              <p className="mb-8 font-Satoshi text-base font-normal text-neutral-950 lg:text-lg">
                It is this culture of mutual trust and high expectations that has earned MIDC the
                loyalty of clients like:
              </p>

              <div className="space-y-4">
                {clients.map((client, index) => (
                  <motion.div
                    key={client.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                    className="group flex items-center gap-4 border-l-2 border-neutral-200 pl-6 transition-all duration-300 hover:border-[#d4af37]"
                  >
                    <div>
                      <div className="font-SchnyderS text-2xl font-light text-neutral-950 transition-colors duration-300 group-hover:text-[#d4af37]">
                        {client.name}
                      </div>
                      <div className="font-Satoshi text-sm font-light text-neutral-400">
                        {client.fullName}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Full-Width Excellence Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="mb-32"
        >
          <div className="mb-16 text-center">
            <h3 className="mb-6 font-SchnyderS text-4xl font-light text-neutral-950 lg:text-5xl xl:text-6xl">
              A Leader Who Leads by Example
            </h3>
            <p className="mx-auto max-w-2xl font-Satoshi text-lg font-light text-neutral-600">
              From award ceremonies to construction sites, Eng. Maher is personally invested in every detail.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:gap-12">
            {/* Image 1: Award Recognition */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative aspect-video overflow-hidden bg-neutral-100"
            >
              <Image
                src="/founder/CID_2106_00_COVER.jpg"
                alt="Eng. Maher Mouhajer - Magazine Cover Feature"
                fill
                quality={100}
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                unoptimized={false}
              />

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-neutral-950/80 via-transparent to-transparent" />

              {/* Text overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-10">
                <div className="mb-3 h-px w-12 bg-[#d4af37]" />
                <h4 className="mb-2 font-SchnyderS text-2xl font-light text-white lg:text-3xl">
                  Recognition of Excellence
                </h4>
                <p className="font-Satoshi text-sm font-light text-white/70">
                  Arabian Property Awards & industry honors for uncompromising quality
                </p>
              </div>
            </motion.div>

            {/* Image 2: On-Site Leadership */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative aspect-video overflow-hidden bg-neutral-100"
            >
              <Image
                src="/founder/CEO Arabia.jpg"
                alt="Eng. Maher Mouhajer - Leadership Excellence"
                fill
                quality={100}
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                unoptimized={false}
              />

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-neutral-950/80 via-transparent to-transparent" />

              {/* Text overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-10">
                <div className="mb-3 h-px w-12 bg-[#d4af37]" />
                <h4 className="mb-2 font-SchnyderS text-2xl font-light text-white lg:text-3xl">
                  On-Site Leadership
                </h4>
                <p className="font-Satoshi text-sm font-light text-white/70">
                  Personal oversight from foundation to final finish
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Bottom CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="border-t border-neutral-200 pt-20 text-center"
        >
          <h3 className="mb-8 font-SchnyderS text-3xl font-light text-neutral-950 lg:text-4xl xl:text-5xl">
            See the Results of Our Obsession
          </h3>
          <p className="mx-auto mb-12 max-w-2xl font-Satoshi text-lg font-light text-neutral-600">
            From Arabian Property Awards to the trust of the region's most prestigious brands,
            our commitment to excellence speaks for itself.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6">
            <Link
              href="/about/awards"
              className="group inline-flex items-center gap-4 border border-[#d4af37] bg-[#d4af37]/5 px-10 py-5 font-Satoshi text-sm font-light uppercase tracking-[0.2em] text-neutral-950 transition-all duration-300 hover:bg-[#d4af37] hover:text-white"
            >
              <span>View Our Achievements</span>
              <svg
                className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>

            <Link
              href="/about/clients"
              className="group inline-flex items-center gap-4 border border-neutral-300 bg-white px-10 py-5 font-Satoshi text-sm font-light uppercase tracking-[0.2em] text-neutral-950 transition-all duration-300 hover:border-neutral-900 hover:bg-neutral-50"
            >
              <span>Meet Our Clients</span>
              <svg
                className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
