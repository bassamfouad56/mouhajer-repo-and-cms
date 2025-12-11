'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { SafeImage } from '@/components/safe-image';
import { ArrowRight } from 'lucide-react';

export function TestFounderLegacy() {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.1, 1, 1.1]);
  const textY = useTransform(scrollYProgress, [0, 0.5, 1], [50, 0, -50]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-neutral-950"
    >
      {/* Full Bleed Image Section */}
      <div className="relative h-screen min-h-[700px] max-h-[1000px]">
        <motion.div style={{ scale: imageScale }} className="absolute inset-0">
          <SafeImage
            src="/founder/CEO Arabia.jpg"
            alt="Dubai skyline at golden hour"
            fill
            className="object-cover"
            priority
          />

          {/* Cinematic overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/70 to-neutral-950/30" />
        </motion.div>

        {/* Content */}
        <motion.div
          style={{ y: textY }}
          className="relative z-10 flex h-full items-end px-6 pb-20 lg:px-12 lg:pb-32"
        >
          <div className="max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
            >
              <div className="mb-8 inline-flex items-center gap-3 border border-white/10 bg-white/5 px-6 py-3 backdrop-blur-md">
                <span className="font-Satoshi text-xs font-light uppercase tracking-[0.4em] text-white/70">
                  Chapter III
                </span>
              </div>

              <h2 className="mb-10 font-SchnyderS text-5xl font-light leading-[1.05] text-white sm:text-6xl lg:text-7xl xl:text-8xl">
                Building
                <br />
                <span className="text-[#d4af37]">a Legacy</span>
              </h2>

              <p className="max-w-3xl font-Satoshi text-xl font-light leading-relaxed text-white/80 lg:text-2xl">
                From the lobbies of five-star hotels to the private suites of royalty,
                Eng. Maher's work has become synonymous with uncompromising luxury in the Middle East.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Projects Showcase Grid */}
      <div className="relative bg-neutral-950 py-32 lg:py-40">
        <div className="mx-auto max-w-7xl px-6 lg:px-12">

          {/* Intro */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-24 text-center"
          >
            <p className="mx-auto max-w-3xl font-Satoshi text-lg font-light leading-relaxed text-white/60 lg:text-xl">
              Every project is a chapter in a larger story. A testament to what happens
              when vision, discipline, and craft converge.
            </p>
          </motion.div>

          {/* Featured Projects - 2x2 Grid */}
          <div className="mb-32 grid gap-8 sm:grid-cols-2 lg:gap-12">

            {/* Project 1 */}
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="group relative aspect-[4/5] overflow-hidden bg-neutral-900"
            >
              <SafeImage
                src="/founder/CEO Arabia.jpg"
                alt="Luxury hotel suite"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-neutral-950/40 to-transparent" />

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-10">
                <div className="mb-4 h-px w-12 bg-[#d4af37]" />
                <h3 className="mb-3 font-SchnyderS text-3xl font-light text-white lg:text-4xl">
                  Address Boulevard
                  <br />
                  VIP Suite
                </h3>
                <p className="font-Satoshi text-sm font-light text-white/70">
                  Best Hotel Suite Interior — Arabia
                </p>
              </div>

              {/* Award badge */}
              <div className="absolute right-6 top-6 border border-[#d4af37]/40 bg-[#d4af37]/10 px-4 py-2 backdrop-blur-sm">
                <span className="font-Satoshi text-xs font-light uppercase tracking-wider text-[#d4af37]">
                  Award Winner
                </span>
              </div>
            </motion.div>

            {/* Project 2 */}
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="group relative aspect-[4/5] overflow-hidden bg-neutral-900"
            >
              <SafeImage
                src="/founder/CEO Arabia.jpg"
                alt="Luxury residential interior"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-neutral-950/40 to-transparent" />

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-10">
                <div className="mb-4 h-px w-12 bg-[#d4af37]" />
                <h3 className="mb-3 font-SchnyderS text-3xl font-light text-white lg:text-4xl">
                  Boulevard
                  <br />
                  Penthouse
                </h3>
                <p className="font-Satoshi text-sm font-light text-white/70">
                  Fendi-Inspired High-Altitude Sanctuary
                </p>
              </div>

              {/* Award badge */}
              <div className="absolute right-6 top-6 border border-[#d4af37]/40 bg-[#d4af37]/10 px-4 py-2 backdrop-blur-sm">
                <span className="font-Satoshi text-xs font-light uppercase tracking-wider text-[#d4af37]">
                  5-Star Winner
                </span>
              </div>
            </motion.div>

            {/* Project 3 */}
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="group relative aspect-[4/5] overflow-hidden bg-neutral-900"
            >
              <SafeImage
                src="/founder/CEO Arabia.jpg"
                alt="Luxury hotel lobby"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-neutral-950/40 to-transparent" />

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-10">
                <div className="mb-4 h-px w-12 bg-[#d4af37]" />
                <h3 className="mb-3 font-SchnyderS text-3xl font-light text-white lg:text-4xl">
                  Sheraton
                  <br />
                  Abu Dhabi
                </h3>
                <p className="font-Satoshi text-sm font-light text-white/70">
                  Heritage Modernization Without Compromise
                </p>
              </div>

              {/* Award badge */}
              <div className="absolute right-6 top-6 border border-[#d4af37]/40 bg-[#d4af37]/10 px-4 py-2 backdrop-blur-sm">
                <span className="font-Satoshi text-xs font-light uppercase tracking-wider text-[#d4af37]">
                  5-Star Winner
                </span>
              </div>
            </motion.div>

            {/* Project 4 */}
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="group relative aspect-[4/5] overflow-hidden bg-neutral-900"
            >
              <SafeImage
                src="/founder/CEO Arabia.jpg"
                alt="Luxury hotel design"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-neutral-950/40 to-transparent" />

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-10">
                <div className="mb-4 h-px w-12 bg-[#d4af37]" />
                <h3 className="mb-3 font-SchnyderS text-3xl font-light text-white lg:text-4xl">
                  Sofitel
                  <br />
                  Dubai JBR
                </h3>
                <p className="font-Satoshi text-sm font-light text-white/70">
                  French Elegance Meets Local Culture
                </p>
              </div>

              {/* Award badge */}
              <div className="absolute right-6 top-6 border border-[#d4af37]/40 bg-[#d4af37]/10 px-4 py-2 backdrop-blur-sm">
                <span className="font-Satoshi text-xs font-light uppercase tracking-wider text-[#d4af37]">
                  Award Winner
                </span>
              </div>
            </motion.div>

          </div>

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="border-t border-white/10 pt-20 text-center"
          >
            <h3 className="mb-8 font-SchnyderS text-4xl font-light text-white lg:text-5xl">
              This is Only the Beginning
            </h3>
            <p className="mx-auto mb-12 max-w-2xl font-Satoshi text-lg font-light text-white/60">
              Explore the full portfolio of projects that define modern Arabian luxury.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-6">
              <Link
                href="/projects"
                className="group inline-flex items-center gap-4 border border-[#d4af37] bg-[#d4af37] px-12 py-6 font-Satoshi text-sm font-light uppercase tracking-[0.2em] text-neutral-950 transition-all duration-300 hover:bg-[#d4af37]/90"
              >
                <span>View Full Portfolio</span>
                <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-2" strokeWidth={1.5} />
              </Link>

              <Link
                href="/about/awards"
                className="group inline-flex items-center gap-4 border border-white/20 bg-white/5 px-12 py-6 font-Satoshi text-sm font-light uppercase tracking-[0.2em] text-white backdrop-blur-sm transition-all duration-300 hover:border-white/40 hover:bg-white/10"
              >
                <span>See Our Awards</span>
                <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-2" strokeWidth={1.5} />
              </Link>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
