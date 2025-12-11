'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { Lightbulb, Palette, Zap, Package, Hammer, Key, CheckCircle2, ArrowRight } from 'lucide-react';
import { MagneticButton } from '@/components/animations/magnetic-button';
import { SVGLineDraw, SVGCircleDraw } from '@/components/animations/svg-line-draw';
import { RevealText } from '@/components/animations/reveal-text';
import Link from 'next/link';

const phases = [
  {
    id: 1,
    title: 'Discovery & Conceptualization',
    icon: Lightbulb,
    headline: 'Where Every Great Project Begins',
    description:
      'We start with a deep discovery process. This is where we align your vision, functional requirements, budget, and timeline into a cohesive creative brief.',
    deliverables: [
      'Initial Consultation & Site Analysis',
      'Client Vision & Functional Requirements Workshop',
      'Preliminary Budget & Timeline Estimates',
      'Conceptual Design Brief',
    ],
    color: '#d4af37',
  },
  {
    id: 2,
    title: 'Design Development & Visualization',
    icon: Palette,
    headline: 'From Concept to Clarity',
    description:
      'Our creative team translates your brief into stunning 3D visualizations. But unlike traditional studios, our architects and MEP engineers are already validating every detail behind the scenes.',
    deliverables: [
      '3D Photorealistic Renderings',
      'Material & Finish Boards',
      'Integrated MEP Preliminary Design',
      'Detailed Project Schedule & Cost Breakdown',
    ],
    color: '#8b5cf6',
  },
  {
    id: 3,
    title: 'Technical Engineering (MEP Core)',
    icon: Zap,
    headline: 'The Invisible Backbone',
    description:
      'This is where most contractors fail. We dedicate an entire phase to engineering HVAC, electrical, plumbing, and fire safety systems. No surprises. No last-minute compromises.',
    deliverables: [
      'Complete MEP Shop Drawings',
      'System Load Calculations & Equipment Specs',
      'Coordination with Local Authorities (DCD, Civil Defence)',
      'Clash Detection & BIM Modeling',
    ],
    color: '#3b82f6',
  },
  {
    id: 4,
    title: 'Planning & Material Control',
    icon: Package,
    headline: 'Precision Before Execution',
    description:
      'Before a single hammer swings, we lock down every material, fixture, and finish. We pre-order long-lead items, manufacture custom elements at our facility, and stage everything for zero downtime.',
    deliverables: [
      'Finalized FF&E Procurement Plan',
      'Custom Millwork & Joinery Manufacturing',
      'Material Staging & Quality Inspection',
      'Detailed Site Logistics Plan',
    ],
    color: '#10b981',
  },
  {
    id: 5,
    title: 'Execution & Safety',
    icon: Hammer,
    headline: 'Controlled. Monitored. Protected.',
    description:
      'Our own teams build it. Our own supervisors monitor it. Our HSE protocols protect it. From structural shell to final marble installation, we maintain military-grade discipline on site.',
    deliverables: [
      'Full-Scale Construction & Fit-Out',
      'Weekly Progress Reports with Photo Documentation',
      'MEP System Installation & Testing',
      'Daily Safety Audits & Compliance Checks',
    ],
    color: '#f59e0b',
  },
  {
    id: 6,
    title: 'Handover & Legacy',
    icon: Key,
    headline: "We Don't Just Hand Over Keys",
    description:
      'Our handover is not a formality. We deep-clean, test every system, train your team on operations, and provide comprehensive warranties. Then we stay engaged through our annual maintenance contracts.',
    deliverables: [
      'Complete System Testing & Commissioning',
      'Deep Cleaning & Final Snagging',
      'Staff Training on Building Systems',
      'Comprehensive Warranty & Maintenance Plans',
    ],
    color: '#d4af37',
  },
];

function PhaseCard({ phase, index, isLast }: { phase: typeof phases[0]; index: number; isLast: boolean }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: '-15%' });

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1, 0.95]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0.5]);

  const Icon = phase.icon;
  const isEven = index % 2 === 0;

  return (
    <motion.div
      ref={cardRef}
      style={{ opacity }}
      className="relative"
    >
      <div className={`grid gap-12 lg:grid-cols-2 lg:gap-20 ${isEven ? '' : 'lg:grid-flow-dense'}`}>
        {/* Content Side */}
        <motion.div
          style={{ y }}
          className={`flex flex-col justify-center ${isEven ? '' : 'lg:col-start-2'}`}
        >
          {/* Phase Icon with Circle Animation */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={isInView ? { scale: 1, rotate: 0 } : {}}
            transition={{ duration: 0.8, delay: index * 0.1, type: 'spring', stiffness: 100 }}
            className="mb-6 inline-flex items-center gap-4"
          >
            <div className="relative">
              <SVGCircleDraw
                size={60}
                strokeColor={phase.color}
                strokeWidth={2}
                duration={1.5}
                delay={index * 0.1 + 0.3}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <Icon className="h-6 w-6" style={{ color: phase.color }} strokeWidth={1.5} />
              </div>
            </div>
            <SVGLineDraw width={80} height={2} strokeColor={phase.color} duration={1} delay={index * 0.1 + 0.5} />
          </motion.div>

          {/* Icon */}
          <motion.div
            initial={{ scale: 0, rotate: -45 }}
            animate={isInView ? { scale: 1, rotate: 0 } : {}}
            transition={{ duration: 0.6, delay: index * 0.1 + 0.4, type: 'spring' }}
            className="mb-6"
          >
            <div
              className="inline-flex h-16 w-16 items-center justify-center rounded-full"
              style={{ backgroundColor: `${phase.color}15` }}
            >
              <Icon className="h-8 w-8" style={{ color: phase.color }} strokeWidth={1.5} />
            </div>
          </motion.div>

          {/* Title */}
          <motion.h3
            initial={{ opacity: 0, x: isEven ? -50 : 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: index * 0.1 + 0.5 }}
            className="mb-4 font-SchnyderS text-3xl font-light tracking-tight text-neutral-950 lg:text-4xl"
          >
            {phase.title}
          </motion.h3>

          {/* Headline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: index * 0.1 + 0.6 }}
            className="mb-6 font-SchnyderS text-xl font-light text-neutral-600 lg:text-2xl"
          >
            {phase.headline}
          </motion.p>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: index * 0.1 + 0.7 }}
            className="mb-8 font-Satoshi text-base font-light leading-relaxed text-neutral-600"
          >
            {phase.description}
          </motion.p>

          {/* Deliverables */}
          <div className="space-y-3">
            <motion.div
              initial={{ opacity: 0, x: isEven ? -20 : 20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 + 0.8 }}
              className="flex items-center gap-2"
            >
              <div className="h-px w-8" style={{ backgroundColor: phase.color }} />
              <span className="font-Satoshi text-sm font-medium uppercase tracking-wider" style={{ color: phase.color }}>
                Key Deliverables
              </span>
            </motion.div>
            {phase.deliverables.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: isEven ? -20 : 20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.4, delay: index * 0.1 + 0.9 + i * 0.1 }}
                className="flex items-start gap-3"
              >
                <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0" style={{ color: phase.color }} strokeWidth={1.5} />
                <span className="font-Satoshi text-sm font-light text-neutral-700">{item}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Visual Side */}
        <motion.div
          style={{ y, scale }}
          className={`relative ${isEven ? 'lg:col-start-2' : 'lg:col-start-1'}`}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: index * 0.1 + 0.4 }}
            className="relative aspect-[4/5] overflow-hidden rounded-sm bg-gradient-to-br from-neutral-100 to-neutral-200"
          >
            {/* Animated pattern */}
            <motion.div
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 0.1 } : {}}
              transition={{ duration: 1, delay: index * 0.1 + 0.6 }}
            >
              <div className="h-full w-full bg-[linear-gradient(45deg,transparent_48%,rgba(0,0,0,0.05)_49%,rgba(0,0,0,0.05)_51%,transparent_52%)] bg-[length:40px_40px]" />
            </motion.div>


            {/* Decorative corners */}
            <motion.div
              initial={{ scale: 0 }}
              animate={isInView ? { scale: 1 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 + 1 }}
              className="absolute left-4 top-4 h-16 w-16 border-l-2 border-t-2"
              style={{ borderColor: phase.color }}
            />
            <motion.div
              initial={{ scale: 0 }}
              animate={isInView ? { scale: 1 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 + 1.1 }}
              className="absolute bottom-4 right-4 h-16 w-16 border-b-2 border-r-2"
              style={{ borderColor: phase.color }}
            />
          </motion.div>
        </motion.div>
      </div>

      {/* Connecting Line (except for last item) */}
      {!isLast && (
        <motion.div
          initial={{ scaleY: 0 }}
          animate={isInView ? { scaleY: 1 } : {}}
          transition={{ duration: 1, delay: index * 0.1 + 1.2 }}
          className="mx-auto my-16 h-32 w-px origin-top bg-gradient-to-b from-neutral-300 to-transparent lg:my-24"
        />
      )}
    </motion.div>
  );
}

export function PhasesSectionEnhanced() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-white py-24 sm:py-32 lg:py-40">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute left-0 top-1/4 h-96 w-96 rounded-full bg-[#d4af37]/5 blur-3xl" />
        <div className="absolute bottom-1/4 right-0 h-96 w-96 rounded-full bg-[#3b82f6]/5 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-12">
        {/* Section Header */}
        <div className="mb-24 text-center lg:mb-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="mb-6 flex items-center justify-center gap-4"
          >
            <SVGLineDraw width={60} height={2} strokeColor="#d4af37" duration={1.5} delay={0.2} />
            <span className="font-Satoshi text-xs font-light uppercase tracking-[0.3em] text-neutral-400">
              The MIDC Protocol
            </span>
            <SVGLineDraw width={60} height={2} strokeColor="#d4af37" duration={1.5} delay={0.2} />
          </motion.div>

          <RevealText
            className="mb-6 font-SchnyderS text-4xl font-light tracking-tight text-neutral-950 sm:text-5xl lg:text-6xl"
            delay={0.4}
            stagger={0.02}
          >
            Six Phases of Integrated Precision
          </RevealText>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mx-auto max-w-2xl font-Satoshi text-lg font-light text-neutral-600"
          >
            From discovery to white-glove handover, every phase is designed to eliminate risk and maximize value.
          </motion.p>
        </div>

        {/* Phases */}
        <div className="space-y-0">
          {phases.map((phase, index) => (
            <PhaseCard
              key={phase.id}
              phase={phase}
              index={index}
              isLast={index === phases.length - 1}
            />
          ))}
        </div>

        {/* Final CTA */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-24 border-t border-neutral-200 pt-16 text-center lg:mt-32"
        >
          <h3 className="mb-6 font-SchnyderS text-3xl font-light text-neutral-950 lg:text-4xl">
            Ready to Experience the MIDC Difference?
          </h3>
          <p className="mb-10 font-Satoshi text-base font-light text-neutral-600">
            Let's discuss how our integrated approach can deliver your next project flawlessly.
          </p>

          <MagneticButton strength={0.25}>
            <Link
              href="/#contact"
              className="group inline-flex items-center gap-3 border border-neutral-900 bg-neutral-950 px-10 py-5 font-Satoshi text-sm font-light uppercase tracking-wider text-white transition-all duration-500 hover:border-[#d4af37] hover:bg-[#d4af37]"
            >
              <span>Start Your Project</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={1.5} />
            </Link>
          </MagneticButton>
        </motion.div>
      </div>
    </section>
  );
}
