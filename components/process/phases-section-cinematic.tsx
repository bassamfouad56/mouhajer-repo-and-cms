'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useInView, useSpring } from 'framer-motion';
import { Ear, Palette, Cpu, Package, Hammer, Key, CheckCircle2 } from 'lucide-react';
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

export function PhasesSectionCinematic() {
  const containerRef = useRef<HTMLElement>(null);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Smooth spring animation for progress
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const progressHeight = useTransform(smoothProgress, [0, 1], ['0%', '100%']);

  // Parallax background movement
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const backgroundOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.4, 0.6, 0.4]);

  return (
    <section ref={containerRef} className="relative overflow-hidden bg-white py-32 dark:bg-neutral-950">
      {/* Animated background layers */}
      <div className="absolute inset-0">
        {/* Gradient mesh background */}
        <motion.div
          style={{ y: backgroundY, opacity: backgroundOpacity }}
          className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(212,175,55,0.15),transparent)]"
        />
        <motion.div
          style={{ y: useTransform(backgroundY, (v) => `${parseFloat(v as string) * -0.5}%`) }}
          className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_120%,rgba(212,175,55,0.1),transparent)]"
        />

        {/* Noise texture overlay */}
        <div
          className="absolute inset-0 opacity-[0.015] dark:opacity-[0.025]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`,
          }}
        />

        {/* Geometric pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(212,175,55,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(212,175,55,0.02)_1px,transparent_1px)] bg-size-[80px_80px]" />

        {/* Floating orbs */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute -right-40 -top-40 h-96 w-96 rounded-full bg-[#d4af37] blur-[120px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.05, 0.15, 0.05],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 2,
          }}
          className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-[#d4af37] blur-[120px]"
        />
      </div>

      {/* Fixed Progress Sidebar - Desktop Only */}
      <div className="fixed left-0 top-0 z-40 hidden h-screen w-24 items-center lg:flex xl:w-32">
        <div className="relative h-full w-full bg-neutral-950/95 backdrop-blur-xl">
          {/* Vertical progress bar */}
          <div className="absolute left-0 top-0 h-full w-1 bg-neutral-800">
            <motion.div
              style={{ height: progressHeight }}
              className="relative w-full bg-linear-to-b from-[#d4af37] to-[#d4af37]/50"
            >
              <div className="absolute inset-0 animate-pulse bg-linear-to-b from-[#d4af37]/50 to-transparent" />
            </motion.div>
          </div>

          {/* Step indicators */}
          <div className="flex h-full flex-col items-center justify-center gap-8 py-20">
            {phases.map((phase, index) => (
              <StepIndicator
                key={phase.id}
                isCompleted={completedSteps.includes(index)}
                Icon={phase.icon}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="relative lg:ml-24 xl:ml-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-24 text-center"
          >
            <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-[#d4af37]/20 bg-[#d4af37]/5 px-6 py-2.5 backdrop-blur-sm">
              <div className="h-2 w-2 animate-pulse rounded-full bg-[#d4af37]" />
              <span className="font-Satoshi text-xs font-light uppercase tracking-[0.3em] text-neutral-600 dark:text-neutral-400">
                The MIDC Protocol
              </span>
            </div>

            <h2 className="mb-6 font-SchnyderS text-5xl font-light tracking-tight text-neutral-900 dark:text-white md:text-6xl lg:text-7xl">
              From Vision to<br />
              <span className="text-[#d4af37]">Reality</span>
            </h2>

            <p className="mx-auto max-w-2xl font-Satoshi text-lg font-light leading-relaxed text-neutral-600 dark:text-neutral-400">
              Six integrated phases. One seamless execution. A methodology refined over 25 years.
            </p>
          </motion.div>

          {/* Phase cards with connecting lines */}
          <div className="relative space-y-32">
            {/* Animated connecting line - SVG path */}
            <svg
              className="pointer-events-none absolute left-1/2 top-0 hidden h-full w-full -translate-x-1/2 lg:block"
              style={{ zIndex: 0 }}
            >
              <defs>
                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#d4af37" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#d4af37" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#d4af37" stopOpacity="0.3" />
                </linearGradient>

                {/* Glow filter */}
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>

              {/* Draw connecting line through card centers */}
              {phases.map((_, index) => {
                if (index === phases.length - 1) return null;

                return (
                  <ConnectingLine
                    key={`line-${index}`}
                    index={index}
                    totalCards={phases.length}
                    scrollProgress={smoothProgress}
                  />
                );
              })}
            </svg>

            {phases.map((phase, index) => (
              <PhaseCard
                key={phase.id}
                phase={phase}
                index={index}
                onComplete={() => {
                  if (!completedSteps.includes(index)) {
                    setCompletedSteps((prev) => [...prev, index]);
                  }
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ConnectingLine({
  index,
  totalCards,
  scrollProgress,
}: {
  index: number;
  totalCards: number;
  scrollProgress: any;
}) {
  // Calculate the scroll range for this connection
  const segmentStart = index / (totalCards - 1);
  const segmentEnd = (index + 1) / (totalCards - 1);

  const pathLength = useTransform(
    scrollProgress,
    [segmentStart, segmentEnd],
    [0, 1]
  );

  // Vertical spacing between cards
  const cardSpacing = 800;
  const startY = index * cardSpacing + 400;
  const endY = (index + 1) * cardSpacing + 400;
  const midY = (startY + endY) / 2;

  // Create a smooth S-curve path
  const pathD = `M 50% ${startY}
                 Q 48% ${startY + 100}, 48% ${midY - 100}
                 Q 48% ${midY + 100}, 50% ${endY}`;

  return (
    <>
      {/* Background path (faded) */}
      <motion.path
        d={pathD}
        stroke="rgba(212, 175, 55, 0.1)"
        strokeWidth="2"
        fill="none"
        strokeDasharray="8 8"
      />

      {/* Animated foreground path with glow */}
      <motion.path
        d={pathD}
        stroke="url(#lineGradient)"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        filter="url(#glow)"
        initial={{ pathLength: 0 }}
        style={{ pathLength }}
      />

      {/* Connection nodes with pulse */}
      <motion.g>
        <motion.circle
          cx="50%"
          cy={startY}
          r="8"
          fill="#d4af37"
          opacity="0.3"
          animate={{ scale: [1, 1.5, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <motion.circle
          cx="50%"
          cy={startY}
          r="6"
          fill="#d4af37"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: index * 0.2 }}
        />
      </motion.g>

      {index === totalCards - 2 && (
        <motion.g>
          <motion.circle
            cx="50%"
            cy={endY}
            r="8"
            fill="#d4af37"
            opacity="0.3"
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ duration: 2, repeat: Infinity, delay: 1 }}
          />
          <motion.circle
            cx="50%"
            cy={endY}
            r="6"
            fill="#d4af37"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: (index + 1) * 0.2 }}
          />
        </motion.g>
      )}
    </>
  );
}

function StepIndicator({
  isCompleted,
  Icon,
}: {
  isCompleted: boolean;
  Icon: any;
}) {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0.5 }}
      animate={{
        scale: isCompleted ? 1.1 : 0.9,
        opacity: isCompleted ? 1 : 0.4,
      }}
      transition={{ duration: 0.4 }}
      className="relative"
    >
      {/* Glow effect when completed */}
      {isCompleted && (
        <motion.div
          className="absolute inset-0 rounded-full bg-[#d4af37] blur-xl"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}

      <div
        className={`relative flex h-14 w-14 items-center justify-center rounded-full border-2 transition-all duration-500 ${
          isCompleted
            ? 'border-[#d4af37] bg-[#d4af37]/10'
            : 'border-neutral-700 bg-transparent'
        }`}
      >
        {isCompleted ? (
          <CheckCircle2 className="h-6 w-6 text-[#d4af37]" strokeWidth={1.5} />
        ) : (
          <Icon className="h-5 w-5 text-neutral-500" strokeWidth={1.5} />
        )}
      </div>
    </motion.div>
  );
}

const PhaseCard = ({
  phase,
  index,
  onComplete,
}: {
  phase: typeof phases[0];
  index: number;
  onComplete: () => void;
}, ref: any) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, {
    margin: '-100px',
    amount: 0.5,
  });

  const Icon = phase.icon;
  const isEven = index % 2 === 0;

  // Parallax effect for the card
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start end', 'end start'],
  });

  const cardY = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.1, 1, 1.1]);

  // Mark as complete when in view
  useEffect(() => {
    if (isInView) {
      onComplete();
    }
  }, [isInView, onComplete]);

  return (
    <motion.div
      ref={cardRef}
      style={{ y: cardY }}
      initial={{ opacity: 0, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
      className="group relative z-10"
    >
      {/* Connection point indicator */}
      <div className="absolute left-1/2 top-1/2 z-20 hidden -translate-x-1/2 -translate-y-1/2 lg:block">
        <motion.div
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex h-4 w-4 items-center justify-center"
        >
          <div className="absolute h-4 w-4 animate-ping rounded-full bg-[#d4af37]/50" />
          <div className="h-3 w-3 rounded-full bg-[#d4af37] shadow-[0_0_20px_rgba(212,175,55,0.6)]" />
        </motion.div>
      </div>

      {/* Floating step card */}
      <div className="relative overflow-hidden rounded-3xl bg-white shadow-[0_20px_70px_-15px_rgba(0,0,0,0.2)] transition-all duration-700 hover:shadow-[0_30px_90px_-15px_rgba(212,175,55,0.3)] dark:bg-neutral-900/95 dark:shadow-[0_20px_70px_-15px_rgba(0,0,0,0.5)] dark:backdrop-blur-xl">
        {/* Top accent line */}
        <div className="h-1 w-full bg-linear-to-r from-transparent via-[#d4af37] to-transparent" />

        {/* Subtle background pattern for the card */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute inset-0 bg-[linear-gradient(45deg,#d4af37_1px,transparent_1px),linear-gradient(-45deg,#d4af37_1px,transparent_1px)] bg-size-[20px_20px]" />
        </div>

        <div className={`grid lg:grid-cols-2 ${isEven ? '' : 'lg:grid-flow-dense'}`}>
          {/* Content side */}
          <div className={`relative p-12 lg:p-16 ${isEven ? '' : 'lg:col-start-1'}`}>
            {/* Gradient overlay on content side */}
            <div className="absolute inset-0 bg-linear-to-br from-[#d4af37]/5 via-transparent to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100" />

            <div className="relative">
              {/* Header */}
              <div className="mb-10">
                {/* Step number and icon */}
                <div className="mb-6 flex items-center gap-4">
                  <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-linear-to-br from-[#d4af37]/20 to-[#d4af37]/5">
                    <div className="absolute inset-0 rounded-2xl bg-[#d4af37]/10 blur-xl transition-opacity duration-500 group-hover:opacity-100" />
                    <Icon className="relative h-9 w-9 text-[#d4af37]" strokeWidth={1.5} />
                  </div>
                  <div className="flex items-center gap-2 text-neutral-500">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-Satoshi text-xs font-light">{phase.duration}</span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="mb-3 font-SchnyderS text-4xl font-light leading-tight tracking-tight text-neutral-900 dark:text-white lg:text-5xl">
                  {phase.title}
                </h3>
                <p className="font-Satoshi text-lg font-light italic text-[#d4af37]">
                  {phase.headline}
                </p>
              </div>

              {/* Description */}
              <p className="mb-10 font-Satoshi text-base font-light leading-relaxed text-neutral-600 dark:text-neutral-400">
                {phase.description}
              </p>

              {/* Deliverables */}
              <div className="space-y-5">
                {phase.points.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className="group/item relative pl-8"
                  >
                    {/* Animated bullet */}
                    <div className="absolute left-0 top-1 flex h-5 w-5 items-center justify-center">
                      <div className="h-2 w-2 rounded-full bg-[#d4af37] transition-all duration-300 group-hover/item:scale-150 group-hover/item:shadow-[0_0_10px_rgba(212,175,55,0.6)]" />
                      <div className="absolute h-5 w-5 rounded-full border border-[#d4af37]/30 transition-all duration-300 group-hover/item:scale-110" />
                    </div>

                    <div>
                      <h4 className="mb-1 font-Satoshi text-sm font-medium text-neutral-900 dark:text-neutral-200">
                        {item.label}
                      </h4>
                      <p className="font-Satoshi text-sm font-light leading-relaxed text-neutral-600 dark:text-neutral-400">
                        {item.text}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Image side */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className={`relative h-[500px] overflow-hidden lg:h-auto ${
              isEven ? '' : 'lg:col-start-2 lg:row-start-1'
            }`}
          >
            <motion.div style={{ scale: imageScale }} className="h-full w-full">
              <SafeImage
                src={phase.image}
                alt={phase.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </motion.div>

            {/* Multi-layered gradient overlays */}
            <div className="absolute inset-0 bg-linear-to-t from-neutral-950/70 via-neutral-950/30 to-transparent" />
            <div className="absolute inset-0 bg-linear-to-r from-neutral-950/50 via-transparent to-transparent" />

            {/* Animated shimmer effect */}
            <motion.div
              animate={{
                x: ['-100%', '100%'],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatDelay: 5,
                ease: 'easeInOut',
              }}
              className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent"
            />

            {/* Decorative corner */}
            <div className="absolute left-8 top-8 h-20 w-20 border-l-2 border-t-2 border-white/30 transition-all duration-500 group-hover:h-24 group-hover:w-24 group-hover:border-[#d4af37]" />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

const PhaseCardWithRef = PhaseCard as any;
