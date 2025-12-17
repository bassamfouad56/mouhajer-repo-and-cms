'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import { getFeaturedPartners } from '@/lib/partner-logos';
import { ArrowUpRight } from 'lucide-react';

const categoryDescriptions: Record<string, string> = {
  hospitality: 'World-class hotel groups and hospitality leaders',
  developer: 'Visionary real estate developers shaping the UAE skyline',
  luxury: 'Premium furniture and lifestyle brands',
  corporate: 'Industry-leading technology and infrastructure partners',
};

export function FeaturedPartnerships() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  const featuredPartners = getFeaturedPartners();

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-neutral-950 py-24 lg:py-32"
    >
      {/* Background accent */}
      <div className="absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 bg-[#d4af37]/5 blur-[150px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-12">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="mb-4 flex items-center justify-center gap-4"
          >
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#d4af37]/50" />
            <span className="font-Satoshi text-xs font-light uppercase tracking-[0.3em] text-[#d4af37]">
              Featured Partnerships
            </span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#d4af37]/50" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-6 font-SchnyderS text-4xl font-light text-white lg:text-5xl"
          >
            The Company We Keep
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto max-w-2xl font-Satoshi text-lg text-white/50"
          >
            Our partnerships with industry leaders reflect our commitment to excellence
            and our capability to deliver at the highest standards.
          </motion.p>
        </div>

        {/* Partners Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {featuredPartners.map((partner, index) => (
            <motion.div
              key={partner.name}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 * (index % 8) }}
              className="group relative overflow-hidden rounded-2xl border border-white/5 bg-gradient-to-b from-white/[0.03] to-transparent p-6 backdrop-blur-sm transition-all duration-500 hover:border-[#d4af37]/30 hover:bg-white/[0.05]"
            >
              {/* Hover glow effect */}
              <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-[#d4af37]/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

              <div className="relative z-10">
                {/* Logo */}
                <div className="mb-6 flex h-16 items-center justify-start">
                  <Image
                    src={partner.logo}
                    alt={partner.name}
                    width={140}
                    height={56}
                    className="h-12 w-auto max-w-[120px] object-contain brightness-0 invert opacity-70 transition-all duration-300 group-hover:opacity-100"
                    unoptimized
                  />
                </div>

                {/* Partner Name */}
                <h3 className="mb-2 font-SchnyderS text-xl text-white transition-colors duration-300 group-hover:text-[#d4af37]">
                  {partner.name}
                </h3>

                {/* Category Badge */}
                <span className="mb-4 inline-block rounded-full border border-white/10 px-3 py-1 font-Satoshi text-xs capitalize text-white/40">
                  {partner.category}
                </span>

                {/* Stats */}
                <div className="flex items-center justify-between border-t border-white/5 pt-4">
                  <div>
                    <div className="font-SchnyderS text-2xl text-[#d4af37]">
                      {partner.projects}+
                    </div>
                    <div className="font-Satoshi text-xs text-white/40">
                      Joint Projects
                    </div>
                  </div>

                  {/* Arrow icon on hover */}
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 transition-all duration-300 group-hover:border-[#d4af37]/50 group-hover:bg-[#d4af37]/10">
                    <ArrowUpRight className="h-4 w-4 text-white/40 transition-colors duration-300 group-hover:text-[#d4af37]" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Category Descriptions */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-20 grid gap-8 border-t border-white/5 pt-16 sm:grid-cols-2 lg:grid-cols-4"
        >
          {Object.entries(categoryDescriptions).map(([category, description]) => (
            <div key={category} className="text-center">
              <h4 className="mb-2 font-Satoshi text-xs font-medium uppercase tracking-widest text-[#d4af37]">
                {category}
              </h4>
              <p className="font-Satoshi text-sm leading-relaxed text-white/40">
                {description}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
