'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

export function ValidationSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-neutral-100 py-24 sm:py-32 lg:py-40"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-12">
        {/* Header */}
        <div className="mb-16 lg:mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="mb-6 flex items-center gap-4"
          >
            <div className="h-px w-12 bg-neutral-300" />
            <span className="font-Satoshi text-xs font-light uppercase tracking-[0.3em] text-neutral-400">
              Industry Recognition
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mb-8 font-SchnyderS text-4xl font-light tracking-tight text-neutral-950 sm:text-5xl lg:text-6xl"
          >
            Validated by the World&apos;s
            <br />
            <span className="text-neutral-400">Most Critical Judges</span>
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-4xl space-y-6 font-Satoshi text-base font-light leading-relaxed text-neutral-600 lg:text-lg"
          >
            <p>
              At MIDC, our primary measure of success is the satisfaction of our clients.
              We value the silence of a guest entering a Royal Suite or the peace of a family
              in their new villa above all else.
            </p>
            <p>
              However, when the industry&apos;s most respected governing bodies recognize our work,
              it serves as a{' '}
              <span className="font-medium text-neutral-950">powerful validation of our philosophy</span>.
              These accolades confirm that Eng. Maher&apos;s integrated approach, combining opulent design
              with rigorous execution, sets the benchmark for the Middle East.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
