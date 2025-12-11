'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

export function ClientsHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true });

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[90vh] w-full overflow-hidden bg-neutral-950"
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/80 via-neutral-950/50 to-neutral-950" />
        <img
          src="/projects/commercial-interior/11.jpg"
          alt="Luxury hotel interior"
          className="h-full w-full object-cover opacity-40"
        />
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:80px_80px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto flex h-full min-h-[90vh] max-w-7xl flex-col items-center justify-center px-6 py-32 text-center lg:px-12">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-8 flex items-center gap-4"
        >
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#d4af37]/50" />
          <span className="font-Satoshi text-xs font-light uppercase tracking-[0.3em] text-[#d4af37]">
            Our Clients & Partners
          </span>
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#d4af37]/50" />
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="mb-6 font-SchnyderS text-5xl font-light tracking-tight text-white sm:text-6xl lg:text-7xl xl:text-8xl"
        >
          Trusted by the Visionaries.
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto mb-16 max-w-3xl font-Satoshi text-lg font-light leading-relaxed text-white/60 sm:text-xl lg:text-2xl"
        >
          We do not just have customers. We have enduring partnerships with the
          leaders shaping the UAE skyline.
        </motion.p>

      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-neutral-950 to-transparent" />
    </section>
  );
}
