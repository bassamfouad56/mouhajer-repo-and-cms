'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';

export function CompanyStorySection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-[#F5F0E8] py-24 sm:py-32 lg:py-40"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-12">
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
          {/* Left Column: Content - EXACT from content.md lines 449-451 */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="flex flex-col justify-center"
          >
            {/* Label */}
            <div className="mb-8 flex items-center gap-4">
              <div className="h-px w-12 bg-gradient-to-r from-[#c9a962] to-transparent" />
              <span className="font-Satoshi text-xs font-light uppercase tracking-[0.3em] text-neutral-500">
                Founded 1999
              </span>
            </div>

            {/* Headline */}
            <h2 className="mb-8 font-SchnyderS text-4xl font-light leading-[1.1] tracking-tight text-neutral-950 sm:text-5xl lg:text-6xl">
              Growing with
              <br />
              <span className="text-[#c9a962]">the UAE</span>
            </h2>

            {/* Body - 100% VERBATIM from content.md lines 449-451 */}
            <div className="space-y-6 font-Satoshi text-base font-light leading-relaxed text-neutral-700 sm:text-lg">
              <p>
                Founded in 1999, Mouhajer International Design & Contracting (MIDC) did not just appear on the landscape; we grew with the UAE. For over two decades, Maher Mouhajer has led a mission to professionalize the intersection of design and construction.
              </p>
              <p>
                What began at the turn of the millennium as a commitment to quality has evolved into a powerhouse firm. We spent our first two decades mastering the art of the private luxury villa and corporate fit-outs, building a quiet but powerful reputation among the UAE's elite. By the time we expanded into major hospitality renovations in 2020, we weren't just 'new entrants'; we were veterans ready to scale.
              </p>
            </div>

            {/* Decorative Quote */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mt-12 border-l-2 border-[#c9a962] pl-6"
            >
              <p className="font-SchnyderS text-xl font-light italic leading-relaxed text-neutral-600 sm:text-2xl">
                "We didn't just appear on the landscape;
                <br />
                we grew with the UAE."
              </p>
            </motion.div>
          </motion.div>

          {/* Right Column: Image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-neutral-200">
              {/* Placeholder for historical image */}
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900">
                <div className="text-center">
                  <p className="font-SchnyderS text-4xl font-light text-white/20">
                    1999
                  </p>
                  <p className="mt-2 font-Satoshi text-sm uppercase tracking-wider text-white/30">
                    The Beginning
                  </p>
                </div>
              </div>

              {/* Decorative Frame */}
              <div className="absolute left-4 top-4 h-24 w-24 border-l-2 border-t-2 border-[#c9a962]/30" />
              <div className="absolute bottom-4 right-4 h-24 w-24 border-b-2 border-r-2 border-[#c9a962]/30" />
            </div>

          </motion.div>
        </div>
      </div>
    </section>
  );
}
