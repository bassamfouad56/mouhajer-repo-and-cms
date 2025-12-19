'use client';

import { useRef, useState } from 'react';
import { motion, useInView, useScroll, useTransform, useSpring, useMotionValueEvent } from 'framer-motion';
import { SafeImage } from '@/components/safe-image';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

const processSteps = [
  {
    title: 'Discovery',
    subtitle: 'Understanding Your Vision',
    description: 'We begin with an in-depth consultation to understand your aspirations, lifestyle needs, and aesthetic preferences. Every detail matters.',
    features: ['Site Analysis', 'Client Brief', 'Budget Planning'],
    image: '/placeholder.jpg',
    imageAlt: 'Consultation meeting with architects',
  },
  {
    title: 'Concept',
    subtitle: 'Crafting the Blueprint',
    description: 'Our design team creates initial concepts, mood boards, and 3D visualizations that bring your vision to life before construction begins.',
    features: ['3D Modeling', 'Material Selection', 'Design Approval'],
    image: '/placeholder.jpg',
    imageAlt: 'Architectural blueprints and designs',
  },
  {
    title: 'Engineering',
    subtitle: 'Technical Excellence',
    description: 'Detailed engineering drawings, structural calculations, and MEP coordination ensure your project is built to perfection.',
    features: ['Structural Design', 'MEP Planning', 'Permit Acquisition'],
    image: '/placeholder.jpg',
    imageAlt: 'Engineering and technical drawings',
  },
  {
    title: 'Construction',
    subtitle: 'Building Dreams',
    description: 'Our in-house construction teams execute with precision. Grade-A materials, skilled craftsmen, and rigorous quality control.',
    features: ['Quality Assurance', 'Progress Reports', 'Safety Compliance'],
    image: '/placeholder.jpg',
    imageAlt: 'Construction site with workers',
  },
  {
    title: 'Fit-Out',
    subtitle: 'Interior Mastery',
    description: 'From custom joinery to imported finishes, our fit-out specialists transform shells into stunning living and working spaces.',
    features: ['Custom Millwork', 'Premium Finishes', 'Lighting Design'],
    image: '/placeholder.jpg',
    imageAlt: 'Luxury interior fit-out in progress',
  },
  {
    title: 'Handover',
    subtitle: 'Your Keys, Our Pride',
    description: 'Final inspections, snag resolution, and a comprehensive handover. We stay connected for post-completion support.',
    features: ['Final Inspection', 'Documentation', 'Warranty Support'],
    image: '/placeholder.jpg',
    imageAlt: 'Completed luxury property',
  },
];

export function Process() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const [activeStep, setActiveStep] = useState(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  // Smooth progress for the timeline
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  // Background parallax
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);

  // Track scroll position to update active step
  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    const stepProgress = latest * processSteps.length;
    const newStep = Math.min(Math.floor(stepProgress * 1.5), processSteps.length - 1);
    if (newStep !== activeStep && newStep >= 0) {
      setActiveStep(newStep);
    }
  });

  return (
    <section
      ref={sectionRef}
      id="process"
      className="relative min-h-[300vh] overflow-hidden bg-[#faf8f5] scroll-mt-24"
    >
      {/* Background Elements */}
      <motion.div className="absolute inset-0" style={{ y: backgroundY }}>
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#faf8f5] via-white to-[#faf8f5]" />

        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(201,169,98,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(201,169,98,0.03)_1px,transparent_1px)] bg-[size:80px_80px]" />

        {/* Animated gradient orbs */}
        <motion.div
          className="absolute left-[20%] top-[10%] h-[500px] w-[500px] rounded-full bg-[#c9a962]/[0.03] blur-[150px]"
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute right-[10%] top-[40%] h-[400px] w-[400px] rounded-full bg-white/[0.02] blur-[120px]"
          animate={{
            x: [0, -30, 0],
            y: [0, -50, 0],
            scale: [1, 1.15, 1]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut', delay: 5 }}
        />
        <motion.div
          className="absolute left-[40%] bottom-[20%] h-[600px] w-[600px] rounded-full bg-[#c9a962]/[0.02] blur-[180px]"
          animate={{
            x: [0, -40, 0],
            y: [0, 40, 0]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut', delay: 10 }}
        />
      </motion.div>

      {/* Sticky Container */}
      <div ref={containerRef} className="sticky top-0 h-screen overflow-hidden">
        <div className="relative z-10 flex h-full flex-col px-6 py-20 lg:px-12 lg:py-24">
          {/* Header */}
          <div className="mx-auto w-full max-w-[1800px]">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="mb-8 flex flex-col items-start justify-between gap-6 lg:mb-12 lg:flex-row lg:items-end"
            >
              <div>
                <div className="mb-4 flex items-center gap-4">
                  <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#c9a962]/50" />
                  <span className="font-Satoshi text-xs font-light uppercase tracking-[0.3em] text-neutral-500">
                    How We Work
                  </span>
                </div>
                <h2 className="font-SchnyderS text-4xl font-light tracking-tight text-neutral-900 sm:text-5xl lg:text-6xl">
                  Complete Lifecycle
                  <br />
                  <span className="text-neutral-400">Control</span>
                </h2>
              </div>

              <p className="max-w-md font-Satoshi text-sm font-light text-neutral-600 lg:text-base lg:text-right">
                From concept to completion, every phase flows through our integrated system.
                <span className="text-neutral-800"> Six stages, one seamless journey.</span>
              </p>
            </motion.div>

            {/* Timeline Progress */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mb-8 lg:mb-12"
            >
              <div className="relative h-px w-full bg-white/10">
                <motion.div
                  className="absolute left-0 top-0 h-full bg-gradient-to-r from-[#c9a962] to-[#c9a962]/50"
                  style={{ width: useTransform(smoothProgress, [0, 0.7], ['0%', '100%']) }}
                />

                {/* Step markers */}
                <div className="absolute -top-2 flex w-full justify-between">
                  {processSteps.map((step, index) => (
                    <motion.div
                      key={step.title}
                      className={`relative flex h-4 w-4 items-center justify-center rounded-full border transition-all duration-500 ${
                        index <= activeStep
                          ? 'border-[#c9a962] bg-[#c9a962]'
                          : 'border-neutral-300 bg-white'
                      }`}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                    >
                      {index <= activeStep && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="h-1.5 w-1.5 rounded-full bg-neutral-950"
                        />
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Main Content - Two Column Layout */}
          <div className="mx-auto flex flex-1 w-full max-w-[1800px] items-center">
            <div className="grid w-full gap-8 lg:grid-cols-12 lg:gap-12">
              {/* Left Column - Image */}
              <motion.div
                className="relative lg:col-span-7"
                initial={{ opacity: 0, x: -50 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <div className="relative aspect-[4/3] overflow-hidden lg:aspect-[16/10]">
                  {processSteps.map((step, index) => (
                    <motion.div
                      key={step.title}
                      className="absolute inset-0"
                      initial={{ opacity: 0, scale: 1.1 }}
                      animate={{
                        opacity: index === activeStep ? 1 : 0,
                        scale: index === activeStep ? 1 : 1.1,
                      }}
                      transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
                    >
                      <SafeImage
                        src={step.image}
                        alt={step.imageAlt}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 60vw"
                      />

                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-r from-[#faf8f5]/70 via-[#faf8f5]/30 to-transparent" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#faf8f5] via-transparent to-transparent" />
                    </motion.div>
                  ))}


                  {/* Corner accents */}
                  <div className="absolute left-0 top-0 h-20 w-20 border-l border-t border-[#c9a962]/20" />
                  <div className="absolute bottom-0 right-0 h-20 w-20 border-b border-r border-[#c9a962]/20" />

                  {/* Animated scan line */}
                  <motion.div
                    className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-[#c9a962]/30 to-transparent"
                    animate={{ top: ['0%', '100%', '0%'] }}
                    transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                  />
                </div>

                {/* Decorative elements below image */}
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-px w-8 bg-[#c9a962]/30" />
                    <span className="font-Satoshi text-xs font-light text-neutral-500">
                      Phase {activeStep + 1} of {processSteps.length}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    {processSteps.map((_, index) => (
                      <motion.div
                        key={index}
                        className={`h-1 rounded-full transition-all duration-300 ${
                          index === activeStep ? 'w-6 bg-[#c9a962]' : 'w-1 bg-white/20'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Right Column - Content */}
              <motion.div
                className="flex flex-col justify-center lg:col-span-5"
                initial={{ opacity: 0, x: 50 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                <div className="relative">
                  {processSteps.map((step, index) => (
                    <motion.div
                      key={step.title}
                      className={`${index === activeStep ? 'relative' : 'absolute inset-0'}`}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{
                        opacity: index === activeStep ? 1 : 0,
                        y: index === activeStep ? 0 : 30,
                      }}
                      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                    >
                      {/* Subtitle */}
                      <motion.div
                        className="mb-3 inline-flex items-center gap-2 border border-[#c9a962]/30 bg-[#c9a962]/5 px-4 py-2"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: index === activeStep ? 1 : 0, x: index === activeStep ? 0 : -20 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                      >
                        <span className="font-Satoshi text-xs font-light uppercase tracking-wider text-[#c9a962]">
                          {step.subtitle}
                        </span>
                      </motion.div>

                      {/* Title */}
                      <h3 className="mb-4 font-SchnyderS text-4xl font-light text-neutral-900 lg:text-5xl xl:text-6xl">
                        {step.title}
                      </h3>

                      {/* Description */}
                      <p className="mb-6 font-Satoshi text-base font-light leading-relaxed text-neutral-600 lg:text-lg">
                        {step.description}
                      </p>

                      {/* Features */}
                      <div className="mb-8 space-y-3">
                        {step.features.map((feature, fIndex) => (
                          <motion.div
                            key={feature}
                            className="flex items-center gap-3"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{
                              opacity: index === activeStep ? 1 : 0,
                              x: index === activeStep ? 0 : -20
                            }}
                            transition={{ duration: 0.4, delay: 0.2 + fIndex * 0.1 }}
                          >
                            <CheckCircle2 className="h-4 w-4 text-[#c9a962]" strokeWidth={1.5} />
                            <span className="font-Satoshi text-sm font-light text-neutral-700">{feature}</span>
                          </motion.div>
                        ))}
                      </div>

                      {/* Navigation hint */}
                      <div className="flex items-center gap-4 border-t border-[#c9a962]/20 pt-6">
                        <span className="font-Satoshi text-xs font-light text-neutral-500">
                          Scroll to explore all phases
                        </span>
                        <motion.div
                          animate={{ y: [0, 5, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          <ArrowRight className="h-4 w-4 rotate-90 text-[#c9a962]/50" strokeWidth={1} />
                        </motion.div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>

          {/* Bottom CTA */}
          <motion.div
            className="mx-auto mt-8 w-full max-w-[1800px]"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <div className="flex items-center justify-between border-t border-[#c9a962]/20 pt-6">
              <span className="font-Satoshi text-sm font-light text-neutral-500">
                Ready to begin your journey?
              </span>
              <Link
                href="#contact"
                className="group flex items-center gap-3 font-Satoshi text-sm font-light tracking-wide text-neutral-600 transition-colors hover:text-[#c9a962]"
              >
                Start Your Project
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" strokeWidth={1} />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Floating decorative elements that animate on scroll */}
      <motion.div
        className="pointer-events-none fixed left-[5%] top-1/2 h-px w-32 bg-gradient-to-r from-[#c9a962]/20 to-transparent"
        style={{
          opacity: useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]),
          x: useTransform(scrollYProgress, [0, 1], [0, 100]),
        }}
      />
      <motion.div
        className="pointer-events-none fixed right-[5%] top-1/3 h-32 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent"
        style={{
          opacity: useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]),
          y: useTransform(scrollYProgress, [0, 1], [0, 200]),
        }}
      />

      {/* Corner decorations */}
      <div className="pointer-events-none absolute left-8 top-24 hidden h-32 w-32 border-l border-t border-white/5 lg:block" />
      <div className="pointer-events-none absolute bottom-24 right-8 hidden h-32 w-32 border-b border-r border-white/5 lg:block" />
    </section>
  );
}
