'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Trophy, Star, Award } from 'lucide-react';

const awards = [
  {
    year: '2024',
    title: 'Best Hotel Interior UAE',
    organization: 'Arabian Property Awards',
    category: 'Hospitality',
  },
  {
    year: '2023',
    title: 'Best Residential Apartment',
    organization: 'Arabian Property Awards',
    category: 'Residential',
  },
  {
    year: '2023',
    title: 'Luxury Hospitality Excellence',
    organization: 'Middle East Design Awards',
    category: 'Hospitality',
  },
  {
    year: '2022',
    title: 'Construction Excellence',
    organization: 'Dubai Quality Award',
    category: 'Construction',
  },
  {
    year: '2021',
    title: 'Best Interior Design Firm',
    organization: 'Gulf Design Awards',
    category: 'Design',
  },
  {
    year: '2020',
    title: 'Innovation in Construction',
    organization: 'Emirates Construction Awards',
    category: 'Construction',
  },
];

export function AboutAwards() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-neutral-100 py-24 sm:py-32 lg:py-40"
    >
      {/* Background */}

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-12">
        {/* Header */}
        <div className="mb-16 lg:mb-24">
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6 }}
                className="mb-6 flex items-center gap-4"
              >
                <div className="h-px w-12 bg-neutral-300" />
                <Trophy className="h-4 w-4 text-[#c9a962]" strokeWidth={1} />
                <span className="font-Satoshi text-xs font-light uppercase tracking-[0.3em] text-neutral-400">
                  Recognition
                </span>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="font-SchnyderS text-4xl font-light tracking-tight text-neutral-950 sm:text-5xl lg:text-6xl"
              >
                Celebrated on
                <br />
                <span className="text-neutral-400">the Global Stage</span>
              </motion.h2>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex items-end"
            >
              <p className="max-w-lg font-Satoshi text-base font-light leading-relaxed text-neutral-600">
                Excellence is not just a promise; it is our track record. Our awards reflect
                our commitment to delivering exceptional quality in every project we undertake.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Awards Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {awards.map((award, index) => (
            <motion.div
              key={`${award.year}-${award.title}`}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
              className="group relative border border-neutral-200 bg-white p-8 transition-all duration-300 hover:border-[#c9a962]/30 hover:shadow-lg"
            >
              {/* Year */}
              <div className="absolute right-6 top-6 font-SchnyderS text-5xl font-extralight text-neutral-100">
                {award.year.slice(2)}
              </div>

              {/* Badge */}
              <div className="mb-6 inline-flex items-center gap-2 border border-[#c9a962]/30 bg-[#c9a962]/5 px-3 py-1.5">
                <Award className="h-3 w-3 text-[#c9a962]" strokeWidth={1} />
                <span className="font-Satoshi text-[10px] font-light uppercase tracking-wider text-[#c9a962]">
                  {award.category}
                </span>
              </div>

              {/* Title */}
              <h3 className="mb-3 font-SchnyderS text-xl font-light text-neutral-950 transition-colors group-hover:text-[#c9a962] lg:text-2xl">
                {award.title}
              </h3>

              {/* Organization */}
              <p className="mb-4 font-Satoshi text-sm font-light text-neutral-500">
                {award.organization}
              </p>

              {/* Year display */}
              <div className="flex items-center gap-2 border-t border-neutral-100 pt-4">
                <Star className="h-3 w-3 text-[#c9a962]" fill="currentColor" />
                <span className="font-Satoshi text-xs font-light text-neutral-400">
                  {award.year}
                </span>
              </div>

              {/* Hover corner */}
              <div className="absolute bottom-0 right-0 h-12 w-12 border-b border-r border-[#c9a962]/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-16 border-t border-neutral-200 pt-16 lg:mt-24"
        >
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {[
              { value: '10+', label: 'International Awards' },
              { value: '5', label: 'Arabian Property Awards' },
              { value: '3', label: 'Design Excellence Awards' },
              { value: '2', label: 'Construction Awards' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.9 + index * 0.1 }}
                className="text-center"
              >
                <div className="mb-2 font-SchnyderS text-4xl font-light text-[#c9a962] lg:text-5xl">
                  {stat.value}
                </div>
                <div className="font-Satoshi text-xs font-light uppercase tracking-[0.15em] text-neutral-500">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
