'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const processSteps = [
  {
    number: '01',
    title: 'Discover',
    description: 'We listen to your vision and analyze your space.',
  },
  {
    number: '02',
    title: 'Design',
    description: 'We create concepts and visualizations tailored to you.',
  },
  {
    number: '03',
    title: 'Develop',
    description: 'We refine every detail until it matches your vision.',
  },
  {
    number: '04',
    title: 'Deliver',
    description: 'We execute flawlessly and transform your space.',
  },
];

export function Process() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section
      ref={sectionRef}
      id="process"
      className="relative overflow-hidden bg-white px-6 py-32 lg:px-12 lg:py-40"
    >
      {/* Minimal Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="h-full w-full bg-[linear-gradient(rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.05)_1px,transparent_1px)] bg-[size:100px_100px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mb-20 lg:mb-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="flex items-end justify-between border-b border-neutral-900 pb-8"
          >
            <div>
              <span className="mb-3 block text-sm font-light tracking-[0.3em] text-neutral-400">
                PROCESS
              </span>
              <h2 className="text-5xl font-light tracking-tight text-neutral-900 lg:text-7xl">
                Four Simple Steps
              </h2>
            </div>
            <div className="hidden text-right lg:block">
              <span className="text-sm font-light tracking-wider text-neutral-400">
                From concept to completion
              </span>
            </div>
          </motion.div>
        </div>

        {/* Process Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:gap-8">
          {processSteps.map((step, index) => (
            <ProcessCard key={step.number} step={step} index={index} />
          ))}
        </div>

        {/* Minimal CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-32 flex items-center justify-between border-t border-neutral-200 pt-12"
        >
          <span className="text-sm font-light tracking-wider text-neutral-500">
            Ready to begin?
          </span>
          <a
            href="#contact"
            className="group relative inline-flex items-center gap-4 text-sm font-light tracking-[0.2em] text-neutral-900 transition-all"
          >
            <span>START YOUR PROJECT</span>
            <svg
              className="h-8 w-8 transition-transform group-hover:translate-x-2"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6 16H26M26 16L18 8M26 16L18 24"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="square"
              />
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  );
}

function ProcessCard({
  step,
  index,
}: {
  step: (typeof processSteps)[0];
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.1 }}
      className="group relative"
    >
      {/* Card Container */}
      <div className="relative h-full overflow-hidden border border-neutral-200 bg-white transition-all duration-500 hover:border-neutral-900 hover:shadow-2xl hover:shadow-neutral-900/5">
        {/* Number Badge - Top Left */}
        <div className="absolute left-0 top-0 flex h-20 w-20 items-center justify-center border-b border-r border-neutral-200 bg-neutral-50 transition-all duration-500 group-hover:border-neutral-900 group-hover:bg-neutral-900">
          <span className="text-2xl font-light text-neutral-400 transition-colors duration-500 group-hover:text-white">
            {step.number}
          </span>
        </div>

        {/* Expanding Line Animation */}
        <div className="absolute left-0 top-20 h-px w-0 bg-neutral-900 transition-all duration-700 group-hover:w-full" />

        {/* Content */}
        <div className="p-8 pb-12 pt-32">
          <h3 className="mb-4 text-4xl font-light tracking-tight text-neutral-900 lg:text-5xl">
            {step.title}
          </h3>
          <p className="text-base font-light leading-relaxed text-neutral-600 lg:text-lg">
            {step.description}
          </p>
        </div>

        {/* Decorative Corner Element - Bottom Right */}
        <div className="absolute bottom-0 right-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
          <svg
            className="h-24 w-24"
            viewBox="0 0 96 96"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <line x1="96" y1="96" x2="96" y2="48" stroke="#171717" strokeWidth="0.5" />
            <line x1="96" y1="96" x2="48" y2="96" stroke="#171717" strokeWidth="0.5" />
            <rect
              x="64"
              y="64"
              width="32"
              height="32"
              stroke="#171717"
              strokeWidth="0.5"
              fill="none"
            />
          </svg>
        </div>

        {/* Large Number Watermark */}
        <div className="pointer-events-none absolute bottom-0 right-0 select-none overflow-hidden opacity-[0.02] transition-opacity duration-500 group-hover:opacity-[0.04]">
          <span className="text-[16rem] font-light leading-none text-neutral-900">
            {step.number}
          </span>
        </div>
      </div>

      {/* Hover Shadow Effect */}
      <div className="absolute -inset-4 -z-10 bg-gradient-to-br from-neutral-900/0 via-neutral-900/0 to-neutral-900/5 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />
    </motion.div>
  );
}
