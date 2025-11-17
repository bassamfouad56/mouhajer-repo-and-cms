'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Lightbulb, Ruler, Palette, Hammer, Sparkles, CheckCircle2 } from 'lucide-react';

const processSteps = [
  {
    number: '01',
    title: 'Discovery & Consultation',
    description:
      'We begin by understanding your vision, lifestyle, and requirements through in-depth consultations and site analysis.',
    icon: Lightbulb,
    color: 'from-purple-500 to-blue-500',
  },
  {
    number: '02',
    title: 'Concept Development',
    description:
      'Our team creates initial design concepts, mood boards, and 3D visualizations to bring your vision to life.',
    icon: Ruler,
    color: 'from-blue-500 to-cyan-500',
  },
  {
    number: '03',
    title: 'Design Refinement',
    description:
      'We refine the designs based on your feedback, selecting materials, finishes, and furniture that align with your aesthetic.',
    icon: Palette,
    color: 'from-cyan-500 to-green-500',
  },
  {
    number: '04',
    title: 'Implementation',
    description:
      'Our expert team manages the entire execution process, coordinating with contractors and ensuring quality at every step.',
    icon: Hammer,
    color: 'from-green-500 to-yellow-500',
  },
  {
    number: '05',
    title: 'Styling & Finishing',
    description:
      'We add the final touches with carefully curated accessories, art, and styling to perfect every detail.',
    icon: Sparkles,
    color: 'from-yellow-500 to-orange-500',
  },
  {
    number: '06',
    title: 'Project Completion',
    description:
      'Final walkthrough and handover of your transformed space, along with comprehensive documentation and care guides.',
    icon: CheckCircle2,
    color: 'from-orange-500 to-red-500',
  },
];

export function Process() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section
      ref={sectionRef}
      id="process"
      className="relative overflow-hidden bg-white px-6 py-32 lg:px-12 lg:py-48"
    >
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.01)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />
        <div className="absolute right-1/4 top-0 h-96 w-96 rounded-full bg-blue-100/40 blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 h-96 w-96 rounded-full bg-purple-100/40 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1800px]">
        {/* Section Header */}
        <div className="mb-24 text-center lg:mb-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="mb-6 flex items-center justify-center gap-4"
          >
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-neutral-400" />
            <span className="text-sm font-light tracking-[0.3em] text-neutral-500">
              OUR PROCESS
            </span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-neutral-400" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl font-light tracking-tight text-neutral-950 sm:text-6xl lg:text-7xl"
          >
            How We Work
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mx-auto mt-6 max-w-2xl text-lg font-light leading-relaxed text-neutral-600"
          >
            Our proven six-step process ensures every project is executed with
            precision, creativity, and unwavering attention to detail
          </motion.p>
        </div>

        {/* Process Steps */}
        <div className="relative">
          {/* Connecting Line */}
          <div className="absolute left-8 top-0 hidden h-full w-px bg-gradient-to-b from-neutral-200 via-neutral-300 to-neutral-200 lg:block" />

          <div className="space-y-16 lg:space-y-24">
            {processSteps.map((step, index) => (
              <ProcessStep key={step.number} step={step} index={index} />
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-24 text-center lg:mt-32"
        >
          <div className="mb-8 h-px w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent" />
          <p className="mb-6 text-lg font-light text-neutral-600">
            Ready to start your design journey?
          </p>
          <a
            href="#contact"
            className="group inline-flex items-center gap-2 border-b border-neutral-950 pb-1 text-sm font-light tracking-widest text-neutral-950 transition-all hover:gap-4 focus-visible:gap-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2"
          >
            SCHEDULE A CONSULTATION
            <span className="transition-transform group-hover:translate-x-1 group-focus-visible:translate-x-1">
              →
            </span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}

function ProcessStep({
  step,
  index,
}: {
  step: (typeof processSteps)[0];
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: '-100px' });
  const Icon = step.icon;

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.1 }}
      className="relative"
    >
      <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-16">
        {/* Number & Icon */}
        <div className="relative flex items-center gap-6 lg:w-64 lg:shrink-0">
          {/* Number Circle */}
          <div className="group relative flex h-16 w-16 shrink-0 items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-neutral-100 transition-all duration-500 group-hover:scale-110 group-hover:bg-neutral-200" />
            <span className="relative text-2xl font-light text-neutral-950">
              {step.number}
            </span>

            {/* Pulsing ring on hover */}
            <motion.div
              initial={{ scale: 1, opacity: 0 }}
              whileHover={{ scale: 1.5, opacity: [0, 0.5, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="absolute inset-0 rounded-full border-2 border-neutral-400"
            />
          </div>

          {/* Icon */}
          <div className="hidden lg:block">
            <div
              className={`flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br ${step.color} opacity-10 transition-all duration-500 hover:opacity-20`}
            >
              <Icon size={24} className="text-neutral-950" strokeWidth={1.5} />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="group relative overflow-hidden border-l-2 border-neutral-200 bg-neutral-50 p-8 transition-all duration-500 hover:border-neutral-950 hover:bg-white lg:p-10">
            <h3 className="mb-4 text-2xl font-light tracking-tight text-neutral-950 lg:text-3xl">
              {step.title}
            </h3>
            <p className="text-base font-light leading-relaxed text-neutral-600 lg:text-lg">
              {step.description}
            </p>

            {/* Gradient accent on hover */}
            <div
              className={`absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r ${step.color} transition-all duration-500 group-hover:w-full`}
            />

            {/* Corner decoration */}
            <div className="absolute right-0 top-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
              <div className="h-12 w-12">
                <div
                  className={`absolute right-0 top-0 h-px w-full bg-gradient-to-l ${step.color}`}
                />
                <div
                  className={`absolute right-0 top-0 h-full w-px bg-gradient-to-b ${step.color}`}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Connecting dot for timeline */}
      <div className="absolute left-[1.875rem] top-16 hidden h-3 w-3 rounded-full border-2 border-white bg-neutral-400 shadow-lg lg:block" />
    </motion.div>
  );
}
