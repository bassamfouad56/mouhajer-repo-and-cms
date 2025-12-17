'use client';

import { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { Ear, Palette, Cpu, Package, Hammer, Key, Check, Circle } from 'lucide-react';
import { SafeImage } from '@/components/safe-image';

const phases = [
  {
    id: 'phase-01',
    title: 'Discovery & Conceptualization',
    headline: 'It Starts With Listening',
    icon: Ear,
    description: 'Before we draw a single line, we listen. Whether you are ADNH planning a hotel renovation or a private client building a villa in District One, we need to understand the "soul" of the project.',
    points: [
      {
        label: 'The Brief',
        text: 'We define the functional needs and the aesthetic aspirations.',
      },
      {
        label: 'The Site Analysis',
        text: 'We analyze the physical space to understand its light, flow, and structural limitations.',
      },
      {
        label: 'Feasibility Study',
        text: 'We assess timeline, budget, and regulatory requirements upfront.',
      },
    ],
    duration: '2-3 weeks',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&h=1500&fit=crop',
  },
  {
    id: 'phase-02',
    title: 'Design Development & Visualization',
    headline: 'Where Imagination Meets Precision',
    icon: Palette,
    description: 'This is where Eng. Maher\'s vision takes shape. Unlike other firms that show you a mood board and hope for the best, we build the entire project digitally first.',
    points: [
      {
        label: 'The "Uncluttered Baroque"',
        text: 'Our design team creates detailed concepts that merge the grandeur of Arabic heritage with modern restraint. We refine the ornamentation until it is sophisticated, not chaotic.',
      },
      {
        label: 'Photorealistic 3D Renders',
        text: 'We provide high-fidelity 3D visualizations that show you exactly how the light will hit the marble and how the velvet will look on the chairs.',
      },
      {
        label: 'Client Approval',
        text: 'You don\'t have to guess. You see the final reality before we lay a single brick. We do not move forward until you are 100% in love with the design.',
      },
    ],
    duration: '4-6 weeks',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200&h=1500&fit=crop',
  },
  {
    id: 'phase-03',
    title: 'Technical Engineering (The MEP Core)',
    headline: 'The Heartbeat of the Building',
    icon: Cpu,
    description: 'Once the design is approved, our in-house MEP Division (Mechanical, Electrical, Plumbing) takes over. This is our biggest differentiator.',
    points: [
      {
        label: 'Seamless Integration',
        text: 'We design the AC ducts to fit perfectly within the decorative ceilings, so they are invisible.',
      },
      {
        label: 'Efficiency',
        text: 'We calculate power and cooling loads to ensure the building runs efficiently for decades, as we did for the Park Hyatt villas.',
      },
      {
        label: 'Code Compliance',
        text: 'All systems meet Dubai Municipality, Civil Defence, and DEWA requirements.',
      },
    ],
    duration: '3-4 weeks',
    image: 'https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=1200&h=1500&fit=crop',
  },
  {
    id: 'phase-04',
    title: 'Planning & Material Control',
    headline: 'Precision Logistics',
    icon: Package,
    description: 'A luxury project lives or dies by its materials. Based on our Material Control Procedures, we leave nothing to chance.',
    points: [
      {
        label: 'Global Sourcing',
        text: 'We source bespoke joinery, rare stones, and fabrics from around the world.',
      },
      {
        label: 'Verification',
        text: 'Every material sample is inspected and matched to the 3D render before ordering.',
      },
      {
        label: 'Scheduling',
        text: 'We create a master timeline to prevent "site clutter" and ensure materials arrive exactly when needed.',
      },
    ],
    duration: '2-4 weeks',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&h=1500&fit=crop',
  },
  {
    id: 'phase-05',
    title: 'Execution & Safety',
    headline: 'The Art of Construction',
    icon: Hammer,
    description: 'This is where Eng. Maher\'s "On-Site Leadership" comes alive.',
    points: [
      {
        label: 'HSE Standards',
        text: 'We maintain a zero-tolerance policy for unsafe practices. A clean site is a safe site.',
      },
      {
        label: 'Skilled Artisans',
        text: 'We use our own teams for critical finishes: stone cladding, gypsum work, and painting, to ensure the "immaculate" finish we are famous for.',
      },
      {
        label: 'Quality Assurance',
        text: 'We inspect every layer. If a wall isn\'t perfectly straight, we take it down before the paint goes on.',
      },
    ],
    duration: '12-20 weeks',
    image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1200&h=1500&fit=crop',
  },
  {
    id: 'phase-06',
    title: 'Handover & Legacy',
    headline: 'The White-Glove Handover',
    icon: Key,
    description: 'We do not just hand over a set of keys. We hand over a functioning reality.',
    points: [
      {
        label: 'The Snag List',
        text: 'We are our own harshest critics. We perform a detailed snagging process to catch even the smallest imperfections.',
      },
      {
        label: 'Deep Cleaning',
        text: 'We deliver the project immaculate and ready for immediate occupation.',
      },
      {
        label: 'Training',
        text: 'We train your team on how to operate the new systems we installed.',
      },
    ],
    duration: '1-2 weeks',
    image: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=1200&h=1500&fit=crop',
  },
];

export function PhasesSectionJourney() {
  const containerRef = useRef<HTMLElement>(null);
  const [activePhase, setActivePhase] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start center', 'end center'],
  });

  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section ref={containerRef} className="relative bg-neutral-950 py-32">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(212,175,55,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(212,175,55,0.03)_1px,transparent_1px)] bg-[size:80px_80px]" />

      <div className="container relative z-10 mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-24 text-center"
        >
          <div className="mb-6 flex items-center justify-center gap-4">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#d4af37]" />
            <span className="text-xs font-light uppercase tracking-[0.3em] text-neutral-500">
              The MIDC Protocol
            </span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#d4af37]" />
          </div>
          <h2 className="font-SchnyderS text-5xl font-light tracking-tight text-white md:text-6xl lg:text-7xl">
            Journey to <span className="text-[#d4af37]">Perfection</span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg font-light leading-relaxed text-neutral-400">
            Six integrated phases. One seamless execution.
          </p>
        </motion.div>

        {/* Interactive Journey */}
        <div className="relative">
          {/* Connecting Line - Desktop */}
          <div className="absolute left-12 top-0 hidden h-full w-px lg:block">
            {/* Background line */}
            <div className="h-full w-full bg-gradient-to-b from-[#d4af37]/20 via-[#d4af37]/10 to-transparent" />
            {/* Animated progress line */}
            <motion.div
              style={{ scaleY: pathLength }}
              className="absolute left-0 top-0 h-full w-full origin-top bg-gradient-to-b from-[#d4af37] to-[#d4af37]/50"
            />
          </div>

          {/* Phases */}
          <div className="space-y-32">
            {phases.map((phase, index) => (
              <PhaseStep
                key={phase.id}
                phase={phase}
                index={index}
                isActive={activePhase === index}
                onInView={() => setActivePhase(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function PhaseStep({
  phase,
  index,
  isActive,
  onInView,
}: {
  phase: typeof phases[0];
  index: number;
  isActive: boolean;
  onInView: () => void;
}) {
  const stepRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(stepRef, {
    margin: '-200px',
    once: false,
    amount: 0.5,
  });

  const Icon = phase.icon;

  // Trigger active state when in view
  if (isInView && !isActive) {
    onInView();
  }

  return (
    <div ref={stepRef} className="relative">
      <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
        {/* Left: Content */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative lg:pl-32"
        >
          {/* Step Number & Icon - Desktop */}
          <div className="absolute -left-[3px] top-0 hidden lg:block">
            <motion.div
              initial={{ scale: 0 }}
              animate={isInView ? { scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="relative"
            >
              {/* Outer glow ring */}
              <div className={`absolute inset-0 rounded-full bg-[#d4af37]/20 transition-all duration-500 ${isActive ? 'scale-150 opacity-100' : 'scale-100 opacity-0'}`} />

              {/* Main circle */}
              <div className="relative flex h-24 w-24 items-center justify-center rounded-full border-2 border-[#d4af37] bg-neutral-950">
                <Icon className="h-10 w-10 text-[#d4af37]" strokeWidth={1.5} />
              </div>

              {/* Completion checkmark */}
              {isActive && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-[#d4af37]"
                >
                  <Check className="h-4 w-4 text-neutral-950" strokeWidth={3} />
                </motion.div>
              )}
            </motion.div>
          </div>

          {/* Mobile Step Indicator */}
          <div className="mb-6 flex items-center gap-4 lg:hidden">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#d4af37] bg-[#d4af37]/10">
              <Icon className="h-7 w-7 text-[#d4af37]" strokeWidth={1.5} />
            </div>
          </div>

          {/* Phase Info */}
          <div className="mb-6">
            <div className="mb-2">
              <div className="h-px w-24 bg-gradient-to-r from-[#d4af37] to-transparent" />
            </div>
            <h3 className="mb-2 font-SchnyderS text-3xl font-light text-white md:text-4xl">
              {phase.title}
            </h3>
            <p className="font-Satoshi text-lg font-light text-[#d4af37]">
              {phase.headline}
            </p>
          </div>

          <p className="mb-8 text-base font-light leading-relaxed text-neutral-400">
            {phase.description}
          </p>

          {/* Key Points */}
          <div className="mb-6 space-y-4">
            <h4 className="text-xs font-medium uppercase tracking-wider text-neutral-500">
              Key Deliverables
            </h4>
            {phase.points.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.5 + i * 0.1 }}
                className="flex gap-3"
              >
                <Circle className="mt-1.5 h-2 w-2 shrink-0 fill-[#d4af37] text-[#d4af37]" />
                <div>
                  <span className="block text-sm font-medium text-neutral-200">
                    {item.label}
                  </span>
                  <span className="mt-1 block text-sm font-light leading-relaxed text-neutral-400">
                    {item.text}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Duration */}
          <div className="inline-flex items-center gap-2 rounded-full border border-[#d4af37]/30 bg-[#d4af37]/5 px-4 py-2">
            <div className="h-2 w-2 rounded-full bg-[#d4af37]" />
            <span className="text-xs font-light text-neutral-400">
              Duration: {phase.duration}
            </span>
          </div>
        </motion.div>

        {/* Right: Image */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative"
        >
          <div className="group relative aspect-[4/5] overflow-hidden rounded-lg">
            <SafeImage
              src={phase.image}
              alt={phase.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent" />

            {/* Corner Frames */}
            <div className="absolute left-6 top-6 h-16 w-16 border-l-2 border-t-2 border-[#d4af37]/50 transition-all duration-300 group-hover:h-20 group-hover:w-20" />
            <div className="absolute bottom-6 right-6 h-16 w-16 border-b-2 border-r-2 border-[#d4af37]/50 transition-all duration-300 group-hover:h-20 group-hover:w-20" />
          </div>
        </motion.div>
      </div>

      {/* Connecting Dots for Mobile */}
      {index < phases.length - 1 && (
        <div className="my-12 flex justify-center lg:hidden">
          <div className="h-12 w-px bg-gradient-to-b from-[#d4af37] to-transparent" />
        </div>
      )}
    </div>
  );
}
