'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Layers, Calendar, MessageSquare } from 'lucide-react';

const protocols = [
  {
    id: 'parallel',
    icon: Layers,
    title: 'Parallel Engineering',
    description: 'Our MEP engineers solve cooling issues while the designers are drawing the ceiling, not after.',
  },
  {
    id: 'logistics',
    icon: Calendar,
    title: 'Preventative Logistics',
    description: 'We order materials based on a master schedule that predicts bottlenecks weeks in advance.',
  },
  {
    id: 'communication',
    icon: MessageSquare,
    title: 'Zero-Gap Communication',
    description: 'The person who drew the joinery is the same person inspecting its installation.',
  },
];

export function OrchestrationSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-neutral-950 py-24 sm:py-32 lg:py-40"
    >
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:60px_60px]" />
        <div className="absolute left-1/2 top-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#d4af37]/[0.02] blur-[150px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-12">
        {/* Header */}
        <div className="mb-16 lg:mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="mb-6 flex items-center gap-4"
          >
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-white/30" />
            <span className="font-Satoshi text-xs font-light uppercase tracking-[0.3em] text-white/40">
              The MIDC Difference
            </span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-white/30" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mb-8 font-SchnyderS text-4xl font-light tracking-tight text-white sm:text-5xl lg:text-6xl"
          >
            We Don&apos;t Just Build.
            <br />
            <span className="text-[#d4af37]">We Orchestrate.</span>
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-4xl space-y-6 font-Satoshi text-base font-light leading-relaxed text-white/70 lg:text-lg"
          >
            <p>
              Many firms can design a beautiful villa, and many can build a strong structure.
              But very few can{' '}
              <span className="font-medium text-white">synchronize the two perfectly</span>.
            </p>
            <p>
              Our process is not a linear list of tasks; it is a synchronized ecosystem.
              We use the{' '}
              <span className="font-medium text-white">"MIDC Protocol"</span>, a rigorous workflow
              where the Design, MEP, and Construction teams work in parallel, not in sequence.
            </p>
          </motion.div>
        </div>

        {/* Protocol Grid */}
        <div className="mb-16 grid gap-6 md:grid-cols-3 lg:mb-24 lg:gap-8">
          {protocols.map((protocol, index) => {
            const Icon = protocol.icon;
            return (
              <motion.div
                key={protocol.id}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.3 + index * 0.1 }}
                className="group relative border border-white/5 bg-white/[0.02] p-8 backdrop-blur-sm transition-all duration-300 hover:border-[#d4af37]/20 hover:bg-white/[0.04] lg:p-10"
              >
                {/* Icon */}
                <div className="mb-6 inline-flex h-14 w-14 items-center justify-center border border-[#d4af37]/30 bg-[#d4af37]/5 transition-all duration-300 group-hover:border-[#d4af37]/50 group-hover:bg-[#d4af37]/10">
                  <Icon className="h-6 w-6 text-[#d4af37]" strokeWidth={1} />
                </div>

                {/* Content */}
                <h3 className="mb-4 font-SchnyderS text-xl font-light text-white transition-colors group-hover:text-[#d4af37] lg:text-2xl">
                  {protocol.title}
                </h3>
                <p className="font-Satoshi text-sm font-light leading-relaxed text-white/60 lg:text-base">
                  {protocol.description}
                </p>

                {/* Number */}
                <div className="absolute right-6 top-6 font-SchnyderS text-5xl font-extralight text-white/[0.03]">
                  0{index + 1}
                </div>

                {/* Corner accent */}
                <div className="absolute bottom-0 right-0 h-12 w-12 border-b border-r border-[#d4af37]/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </motion.div>
            );
          })}
        </div>

        {/* Closing Statement */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="border-t border-white/5 pt-16"
        >
          <div className="mx-auto max-w-3xl text-center">
            <p className="font-SchnyderS text-2xl font-light italic text-white/80 lg:text-3xl">
              This isn&apos;t just "turnkey." It is{' '}
              <span className="not-italic text-[#d4af37]">integrated precision</span>.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
