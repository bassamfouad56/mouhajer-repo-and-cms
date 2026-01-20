"use client";

import { useRef, useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  AnimatePresence,
} from "framer-motion";
import {
  Ear,
  Palette,
  Cpu,
  Package,
  Hammer,
  Key,
  ArrowRight,
  ChevronDown,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface ProcessPageCinematicProps {
  images: string[];
}

const phases = [
  {
    id: "phase-01",
    number: "01",
    title: "Discovery",
    subtitle: "Conceptualization",
    headline: "It Starts With Listening",
    icon: Ear,
    description:
      "Before we draw a single line, we listen. We need to understand the soul of the project.",
    points: ["The Brief", "Site Analysis", "Feasibility Study"],
    duration: "2-3 weeks",
  },
  {
    id: "phase-02",
    number: "02",
    title: "Design",
    subtitle: "Development",
    headline: "Imagination Meets Precision",
    icon: Palette,
    description:
      "Where Eng. Maher's vision takes shape. We build the entire project digitally first.",
    points: ["3D Visualization", "Material Selection", "Client Approval"],
    duration: "4-6 weeks",
  },
  {
    id: "phase-03",
    number: "03",
    title: "Engineering",
    subtitle: "MEP Integration",
    headline: "The Heartbeat of the Building",
    icon: Cpu,
    description:
      "Our in-house MEP Division takes over. This is our biggest differentiator.",
    points: ["HVAC Design", "Electrical Planning", "Code Compliance"],
    duration: "3-4 weeks",
  },
  {
    id: "phase-04",
    number: "04",
    title: "Planning",
    subtitle: "Material Control",
    headline: "Precision Logistics",
    icon: Package,
    description:
      "A luxury project lives or dies by its materials. We leave nothing to chance.",
    points: ["Global Sourcing", "Quality Verification", "Master Scheduling"],
    duration: "2-4 weeks",
  },
  {
    id: "phase-05",
    number: "05",
    title: "Execution",
    subtitle: "Construction",
    headline: "The Art of Building",
    icon: Hammer,
    description:
      'Where Eng. Maher\'s "On-Site Leadership" comes alive with military precision.',
    points: ["HSE Standards", "Skilled Artisans", "Quality Assurance"],
    duration: "12-20 weeks",
  },
  {
    id: "phase-06",
    number: "06",
    title: "Handover",
    subtitle: "Legacy",
    headline: "White-Glove Delivery",
    icon: Key,
    description:
      "We don't just hand over keys. We hand over a functioning reality.",
    points: ["Snagging", "Deep Cleaning", "Training"],
    duration: "1-2 weeks",
  },
];

export function ProcessPageCinematic({ images }: ProcessPageCinematicProps) {
  const [activePhase, setActivePhase] = useState(0);
  const [showIndicator, setShowIndicator] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const phasesContainerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: phasesContainerRef,
    offset: ["start start", "end end"],
  });

  // Update active phase based on scroll and hide indicator near footer
  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (value) => {
      const phaseIndex = Math.min(
        Math.floor(value * phases.length),
        phases.length - 1
      );
      setActivePhase(phaseIndex);
      // Hide indicator when past the phases section (entering CTA/footer)
      setShowIndicator(value < 0.95);
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  return (
    <main ref={containerRef} className="relative bg-neutral-950">
      {/* Hero Section */}
      <HeroSection />

      {/* Lifecycle Progress Indicator - Fixed on side */}
      <LifecycleIndicator
        activePhase={activePhase}
        scrollProgress={scrollYProgress}
        show={showIndicator}
      />

      {/* Full-screen Phase Sections */}
      <div ref={phasesContainerRef}>
        {phases.map((phase, index) => (
          <PhaseSection
            key={phase.id}
            phase={phase}
            index={index}
            backgroundImage={images[index] || images[0]}
          />
        ))}
      </div>

      {/* CTA Section */}
      <CTASection backgroundImage={images[images.length - 1] || images[0]} />
    </main>
  );
}

function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(heroRef, { once: true });

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);

  return (
    <section
      ref={heroRef}
      className="relative h-screen min-h-[800px] overflow-hidden"
    >
      {/* Video Background */}
      <motion.div style={{ scale }} className="absolute inset-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="h-full w-full object-cover"
        >
          <source src="/banner-2s.mp4" type="video/mp4" />
        </video>

        {/* Cinematic Overlays */}
        <div className="absolute inset-0 bg-neutral-950/70" />
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/50 via-transparent to-neutral-950" />
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/80 via-transparent to-neutral-950/80" />
      </motion.div>

      {/* Hero Content */}
      <motion.div
        style={{ opacity, y }}
        className="relative z-10 flex h-full flex-col items-center justify-center px-6 pt-24"
      >
        <div className="mx-auto max-w-5xl text-center">
          {/* Lifecycle Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mb-12"
          >
            <div className="inline-flex items-center gap-4 rounded-full border border-[#c9a962]/30 bg-[#c9a962]/10 px-8 py-3 backdrop-blur-sm">
              <div className="flex -space-x-1">
                {phases.slice(0, 6).map((_, i) => (
                  <div
                    key={i}
                    className="h-2 w-2 rounded-full border border-neutral-950 bg-[#c9a962]"
                    style={{ opacity: 1 - i * 0.1 }}
                  />
                ))}
              </div>
              <span className="font-Satoshi text-xs font-light uppercase tracking-[0.3em] text-[#c9a962]">
                6-Phase Lifecycle
              </span>
            </div>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.5 }}
            className="mb-8 font-SchnyderS text-5xl font-light leading-[1.1] tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl"
          >
            From First Sketch
            <br />
            to <span className="text-[#c9a962]">Final Polish</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="mx-auto mb-16 max-w-2xl font-Satoshi text-lg font-light leading-relaxed text-white/60 lg:text-xl"
          >
            A methodology built on 25 years of refining the art of delivery.
            Every phase connected. Every detail controlled.
          </motion.p>

          {/* Lifecycle Visual Preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="flex items-center justify-center gap-4"
          >
            {phases.map((phase, index) => {
              const Icon = phase.icon;
              return (
                <motion.div
                  key={phase.id}
                  className="group relative"
                  whileHover={{ scale: 1.1 }}
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-white/5 backdrop-blur-sm transition-all duration-300 group-hover:border-[#c9a962] group-hover:bg-[#c9a962]/20">
                    <Icon
                      className="h-5 w-5 text-white/70 transition-colors group-hover:text-[#c9a962]"
                      strokeWidth={1.5}
                    />
                  </div>
                  {index < phases.length - 1 && (
                    <div className="absolute left-full top-1/2 h-px w-4 -translate-y-1/2 bg-gradient-to-r from-white/30 to-transparent" />
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.8, delay: 1.2 }}
        className="absolute bottom-12 left-1/2 z-10 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-3"
        >
          <span className="font-Satoshi text-[10px] font-light uppercase tracking-[0.3em] text-white/40">
            Begin the Journey
          </span>
          <ChevronDown className="h-5 w-5 text-white/40" />
        </motion.div>
      </motion.div>
    </section>
  );
}

function LifecycleIndicator({
  activePhase,
  scrollProgress,
  show,
}: {
  activePhase: number;
  scrollProgress: any;
  show: boolean;
}) {
  const progressHeight = useTransform(scrollProgress, [0, 1], ["0%", "100%"]);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: show ? 1 : 0, x: show ? 0 : -20 }}
      transition={{ duration: 0.3 }}
      className="fixed left-8 top-1/2 z-50 hidden -translate-y-1/2 lg:block"
    >
      <div className="relative flex flex-col items-center">
        {/* Progress Track */}
        <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-white/10">
          <motion.div
            style={{ height: progressHeight }}
            className="w-full bg-gradient-to-b from-[#c9a962] via-[#c9a962] to-[#c9a962]/50"
          />
        </div>

        {/* Phase Dots */}
        <div className="relative flex flex-col gap-8">
          {phases.map((phase, index) => {
            const Icon = phase.icon;
            const isActive = index === activePhase;
            const isPast = index < activePhase;

            return (
              <motion.div
                key={phase.id}
                className="relative flex items-center gap-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {/* Dot/Icon */}
                <motion.div
                  animate={{
                    scale: isActive ? 1.2 : 1,
                    backgroundColor:
                      isActive || isPast ? "#c9a962" : "transparent",
                  }}
                  className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                    isActive
                      ? "border-[#c9a962] shadow-[0_0_20px_rgba(201,169,98,0.5)]"
                      : isPast
                        ? "border-[#c9a962]/50"
                        : "border-white/20"
                  }`}
                >
                  <Icon
                    className={`h-4 w-4 transition-colors ${
                      isActive || isPast ? "text-neutral-950" : "text-white/40"
                    }`}
                    strokeWidth={1.5}
                  />
                </motion.div>

                {/* Label */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="absolute left-14 whitespace-nowrap"
                    >
                      <div className="rounded-lg bg-[#c9a962]/20 px-4 py-2 backdrop-blur-sm">
                        <span className="font-Satoshi text-xs font-medium text-[#c9a962]">
                          {phase.title}
                        </span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

function PhaseSection({
  phase,
  index,
  backgroundImage,
}: {
  phase: (typeof phases)[0];
  index: number;
  backgroundImage: string;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-20%" });
  const Icon = phase.icon;

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const imageScale = useTransform(scrollYProgress, [0, 1], [1.2, 1]);
  const imageY = useTransform(scrollYProgress, [0, 1], [-100, 100]);
  const contentY = useTransform(scrollYProgress, [0, 0.5, 1], [100, 0, -50]);
  const contentOpacity = useTransform(
    scrollYProgress,
    [0, 0.3, 0.7, 1],
    [0, 1, 1, 0]
  );

  return (
    <section
      ref={sectionRef}
      className="relative h-screen min-h-[800px] overflow-hidden"
    >
      {/* Background Image with Parallax */}
      <motion.div
        style={{ scale: imageScale, y: imageY }}
        className="absolute inset-0"
      >
        {backgroundImage ? (
          <Image
            src={backgroundImage}
            alt={phase.title}
            fill
            className="object-cover"
            sizes="100vw"
            priority={index < 2}
          />
        ) : (
          <div className="h-full w-full bg-neutral-900" />
        )}

        {/* Cinematic Overlays */}
        <div className="absolute inset-0 bg-neutral-950/75" />
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-neutral-950/50 h-full" />

        {/* Animated grain texture */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`,
          }}
        />
      </motion.div>

      {/* Phase Number - Large Background */}
      <div className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 select-none">
        <motion.span
          initial={{ opacity: 0, x: 100 }}
          animate={isInView ? { opacity: 0.03, x: 0 } : {}}
          transition={{ duration: 1, delay: 0.3 }}
          className="font-SchnyderS text-[40vw] font-light leading-none text-white"
        >
          {phase.number}
        </motion.span>
      </div>

      {/* Content */}
      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-10 flex h-full items-center"
      >
        <div className="mx-auto w-full max-w-7xl px-6 lg:px-12">
          <div className="max-w-2xl">
            {/* Phase Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-8 flex items-center gap-6"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[#c9a962]/30 bg-[#c9a962]/10 backdrop-blur-sm">
                <Icon className="h-7 w-7 text-[#c9a962]" strokeWidth={1.5} />
              </div>
              <div>
                <div className="font-Satoshi text-xs font-light uppercase tracking-[0.4em] text-[#c9a962]">
                  Phase {phase.number}
                </div>
                <div className="mt-1 font-Satoshi text-sm font-light text-white/40">
                  {phase.duration}
                </div>
              </div>
            </motion.div>

            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mb-4"
            >
              <h2 className="font-SchnyderS text-5xl font-light leading-tight tracking-tight text-white md:text-6xl lg:text-7xl">
                {phase.title}
                <span className="block text-[#c9a962]">{phase.subtitle}</span>
              </h2>
            </motion.div>

            {/* Headline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mb-8 font-Satoshi text-xl font-light italic text-white/60 lg:text-2xl"
            >
              {phase.headline}
            </motion.p>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mb-10 font-Satoshi text-base font-light leading-relaxed text-white/50 lg:text-lg"
            >
              {phase.description}
            </motion.p>

            {/* Key Points */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-wrap gap-3"
            >
              {phase.points.map((point, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.4, delay: 0.7 + i * 0.1 }}
                  className="rounded-full border border-white/10 bg-white/5 px-5 py-2.5 font-Satoshi text-sm font-light text-white/70 backdrop-blur-sm"
                >
                  {point}
                </motion.span>
              ))}
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Lifecycle Connection Line */}
      {index < phases.length - 1 && (
        <div className="absolute bottom-0 left-1/2 h-32 w-px -translate-x-1/2 bg-gradient-to-b from-[#c9a962]/50 to-transparent" />
      )}

      {/* Corner Accents */}
      <div className="absolute left-8 top-8 hidden h-20 w-20 border-l border-t border-white/10 lg:block" />
      <div className="absolute bottom-8 right-8 hidden h-20 w-20 border-b border-r border-[#c9a962]/30 lg:block" />
    </section>
  );
}

function CTASection({ backgroundImage }: { backgroundImage: string }) {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true });

  return (
    <section
      ref={sectionRef}
      className="relative h-screen min-h-[700px] overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0">
        {backgroundImage && (
          <Image
            src={backgroundImage}
            alt="Start your project"
            fill
            className="object-cover"
            sizes="100vw"
          />
        )}
        <div className="absolute inset-0 bg-neutral-950/85" />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/50 to-neutral-950/80" />
      </div>

      {/* Lifecycle Complete Badge */}
      <div className="absolute left-1/2 top-20 -translate-x-1/2">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8 }}
          className="flex items-center gap-3 rounded-full border border-[#c9a962]/30 bg-[#c9a962]/10 px-6 py-2 backdrop-blur-sm"
        >
          <div className="flex -space-x-1">
            {phases.map((phase, i) => {
              const Icon = phase.icon;
              return (
                <div
                  key={i}
                  className="flex h-6 w-6 items-center justify-center rounded-full border border-neutral-950 bg-[#c9a962]"
                >
                  <Icon className="h-3 w-3 text-neutral-950" strokeWidth={2} />
                </div>
              );
            })}
          </div>
          <span className="font-Satoshi text-xs font-light uppercase tracking-[0.2em] text-[#c9a962]">
            Lifecycle Complete
          </span>
        </motion.div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex h-full items-center justify-center px-6">
        <div className="mx-auto max-w-4xl text-center">
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-6 font-SchnyderS text-5xl font-light tracking-tight text-white md:text-6xl lg:text-7xl xl:text-8xl"
          >
            Ready to Begin
            <br />
            <span className="text-[#c9a962]">Your Journey?</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mx-auto mb-12 max-w-2xl font-Satoshi text-lg font-light leading-relaxed text-white/50 lg:text-xl"
          >
            Let&apos;s discuss how our integrated lifecycle can bring your
            vision to life. From concept to completion, every phase under one
            roof.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Link
              href="/contact"
              className="group inline-flex items-center gap-3 bg-[#c9a962] px-10 py-5 font-Satoshi text-sm font-light tracking-widest text-neutral-950 transition-all hover:bg-white"
            >
              <span>START YOUR PROJECT</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              href="/projects"
              className="inline-flex items-center gap-3 border border-white/20 px-10 py-5 font-Satoshi text-sm font-light tracking-widest text-white transition-all hover:border-[#c9a962] hover:text-[#c9a962]"
            >
              <span>SEE OUR WORK</span>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 h-32 w-full bg-gradient-to-t from-neutral-950 to-transparent" />
    </section>
  );
}
