'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { BeforeAfterSlider } from '@/components/before-after-slider';

const transformations = [
  {
    id: 1,
    title: 'Villa Al Barsha',
    category: 'Residential',
    beforeImage: '',
    afterImage: '',
    beforeLabel: 'Before',
    afterLabel: 'After',
  },
  {
    id: 2,
    title: 'Downtown Penthouse',
    category: 'Luxury Residential',
    beforeImage: '',
    afterImage: '',
    beforeLabel: 'Before',
    afterLabel: 'After',
  },
];

export function TransformationShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-neutral-950 py-24 sm:py-32 lg:py-40"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-neutral-900/50 via-transparent to-neutral-900/50" />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center sm:mb-20"
        >
          <div className="mb-6 flex items-center justify-center gap-4">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#d4af37]/50" />
            <span className="font-Satoshi text-xs font-light uppercase tracking-[0.3em] text-[#d4af37]">
              Transformation
            </span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#d4af37]/50" />
          </div>

          <h2 className="font-SchnyderM text-4xl font-light text-white sm:text-5xl lg:text-6xl">
            Witness the
            <span className="block text-[#d4af37]">Transformation</span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl font-Satoshi text-base font-light leading-relaxed text-white/60 sm:text-lg">
            From concept to completion, explore our dramatic renovations and see
            how we transform ordinary spaces into extraordinary living experiences.
          </p>
        </motion.div>

        {/* Before/After Sliders Grid */}
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          {transformations.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="group"
            >
              {/* Project Info */}
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <span className="font-Satoshi text-xs font-light uppercase tracking-wider text-[#d4af37]">
                    {project.category}
                  </span>
                  <h3 className="mt-1 font-SchnyderS text-xl font-light text-white sm:text-2xl">
                    {project.title}
                  </h3>
                </div>
                <div className="h-8 w-8 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm" />
              </div>

              {/* Before/After Slider */}
              <BeforeAfterSlider
                beforeImage={project.beforeImage}
                afterImage={project.afterImage}
                beforeLabel={project.beforeLabel}
                afterLabel={project.afterLabel}
                className="rounded-sm"
              />
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <p className="font-Satoshi text-sm font-light text-white/40">
            Every project tells a story of transformation.{' '}
            <a
              href="/projects"
              className="text-[#d4af37] transition-colors duration-300 hover:text-[#d4af37]/80"
            >
              View all projects
            </a>
          </p>
        </motion.div>
      </div>

      {/* Decorative elements */}
      <div className="absolute left-0 top-1/4 h-64 w-64 rounded-full bg-[#d4af37]/5 blur-3xl" />
      <div className="absolute bottom-1/4 right-0 h-64 w-64 rounded-full bg-[#d4af37]/5 blur-3xl" />
    </section>
  );
}
