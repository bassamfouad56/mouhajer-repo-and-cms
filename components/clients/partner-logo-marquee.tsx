'use client';

import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import {
  getAllPartners,
  getPartnersByCategory,
  type PartnerLogo,
} from '@/lib/partner-logos';

type Category = 'all' | 'hospitality' | 'developer' | 'luxury' | 'corporate';

const categories: { id: Category; label: string }[] = [
  { id: 'all', label: 'All Partners' },
  { id: 'hospitality', label: 'Hospitality' },
  { id: 'developer', label: 'Developers' },
  { id: 'luxury', label: 'Luxury Brands' },
  { id: 'corporate', label: 'Corporate' },
];

export function PartnerLogoMarquee() {
  const [activeCategory, setActiveCategory] = useState<Category>('all');
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  const allPartners = getAllPartners();

  const filteredPartners =
    activeCategory === 'all'
      ? allPartners
      : getPartnersByCategory(activeCategory as PartnerLogo['category']);

  // Split partners into two rows for opposite scrolling
  const row1 = filteredPartners.slice(0, Math.ceil(filteredPartners.length / 2));
  const row2 = filteredPartners.slice(Math.ceil(filteredPartners.length / 2));

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-neutral-950 py-24 lg:py-32"
    >
      {/* Subtle grid pattern */}

      <div className="relative z-10">
        {/* Section Header */}
        <div className="mx-auto mb-16 max-w-7xl px-6 text-center lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="mb-4 flex items-center justify-center gap-4"
          >
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#c9a962]/50" />
            <span className="font-Satoshi text-xs font-light uppercase tracking-[0.3em] text-[#c9a962]">
              Our Network
            </span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#c9a962]/50" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-6 font-SchnyderS text-4xl font-light text-white lg:text-5xl"
          >
            Partners in Excellence
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto max-w-2xl font-Satoshi text-lg text-white/50"
          >
            Collaborating with the region&apos;s most prestigious hospitality groups,
            developers, and luxury brands.
          </motion.p>

          {/* Category Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-2"
          >
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`rounded-full px-5 py-2 font-Satoshi text-sm transition-all duration-300 ${
                  activeCategory === cat.id
                    ? 'bg-[#c9a962] text-neutral-950'
                    : 'border border-white/10 text-white/60 hover:border-[#c9a962]/50 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </motion.div>
        </div>

        {/* Marquee Container */}
        <div className="group relative">
          {/* Fade edges */}
          <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-32 bg-gradient-to-r from-neutral-950 to-transparent" />
          <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-32 bg-gradient-to-l from-neutral-950 to-transparent" />

          {/* Row 1 - Scrolling Right */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mb-8 overflow-hidden"
          >
            <div className="animate-marquee hover-pause flex whitespace-nowrap">
              {[...row1, ...row1, ...row1].map((partner, idx) => (
                <div
                  key={`row1-${idx}`}
                  className="mx-8 flex h-20 w-40 flex-shrink-0 items-center justify-center rounded-lg border border-white/5 bg-white/[0.02] px-6 transition-all duration-300 hover:border-[#c9a962]/30 hover:bg-white/[0.05]"
                >
                  <Image
                    src={partner.logo}
                    alt={partner.name}
                    width={120}
                    height={48}
                    className="h-10 w-auto max-w-[100px] object-contain brightness-0 invert opacity-60 transition-opacity duration-300 hover:opacity-100"
                    unoptimized
                  />
                </div>
              ))}
            </div>
          </motion.div>

          {/* Row 2 - Scrolling Left */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="overflow-hidden"
          >
            <div className="animate-marquee-reverse hover-pause flex whitespace-nowrap">
              {[...row2, ...row2, ...row2].map((partner, idx) => (
                <div
                  key={`row2-${idx}`}
                  className="mx-8 flex h-20 w-40 flex-shrink-0 items-center justify-center rounded-lg border border-white/5 bg-white/[0.02] px-6 transition-all duration-300 hover:border-[#c9a962]/30 hover:bg-white/[0.05]"
                >
                  <Image
                    src={partner.logo}
                    alt={partner.name}
                    width={120}
                    height={48}
                    className="h-10 w-auto max-w-[100px] object-contain brightness-0 invert opacity-60 transition-opacity duration-300 hover:opacity-100"
                    unoptimized
                  />
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Partner Count */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <span className="font-Satoshi text-sm text-white/40">
            {filteredPartners.length} {activeCategory === 'all' ? 'total' : activeCategory} partners
          </span>
        </motion.div>
      </div>
    </section>
  );
}
