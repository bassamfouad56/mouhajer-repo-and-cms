"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView, useMotionValue, useTransform, animate, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SafeImage } from "@/components/safe-image";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface WhoWeAreCinematicProps {
  images?: {
    contractor: string;
    designer: string;
    manufacturer: string;
  };
}

// Pillar data - images will be passed as props
const createPillars = (images?: WhoWeAreCinematicProps["images"]) => [
  {
    id: "contractor",
    title: "The Main Contractor",
    subtitle: "We Build",
    description:
      "We hold the trade license to execute heavy civil works. From excavation and piling to the concrete superstructure, our own teams are on site daily.",
    image: images?.contractor || "/projects/commercial-interior/11.jpg",
    accent: "#d4af37",
  },
  {
    id: "designer",
    title: "The Designer",
    subtitle: "We Create",
    description:
      "Our creative team designs the vision, but because they work alongside the builders, every drawing is validated for cost and feasibility before you see it.",
    image:
      images?.designer ||
      "/projects/bedroom-interior/01 Villa Hatem Master Bedroom OP4.jpg",
    accent: "#a8a29e",
  },
  {
    id: "manufacturer",
    title: "The Manufacturer",
    subtitle: "We Craft",
    description:
      "We manufacture your fire-rated doors, wardrobes, and custom furniture in our own local facility, ensuring perfect fit and zero shipping delays.",
    image: images?.manufacturer || "/projects/closet/_MID0095-HDR.jpg",
    accent: "#78716c",
  },
];

// Stats data
const stats = [
  { value: 400, suffix: "+", label: "Projects Completed" },
  { value: 20, suffix: "+", label: "Years of Experience" },
  { value: 10, suffix: "+", label: "International Awards" },
  { value: 100, suffix: "%", label: "Client Satisfaction" },
];

// Animated Counter Component
function AnimatedCounter({
  value,
  suffix,
  isInView
}: {
  value: number;
  suffix: string;
  isInView: boolean;
}) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (isInView) {
      const controls = animate(count, value, {
        duration: 2.5,
        ease: [0.22, 1, 0.36, 1],
      });

      const unsubscribe = rounded.on("change", (v) => {
        setDisplayValue(v);
      });

      return () => {
        controls.stop();
        unsubscribe();
      };
    }
  }, [isInView, value, count, rounded]);

  return (
    <span className="tabular-nums">
      {displayValue}{suffix}
    </span>
  );
}

// Split Screen Panel Component
function PillarPanel({
  pillar,
  index,
  isEven,
}: {
  pillar: ReturnType<typeof createPillars>[0];
  index: number;
  isEven: boolean;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(panelRef, { once: true, margin: "-10%" });

  return (
    <div
      ref={panelRef}
      className="panel relative flex h-screen w-screen shrink-0 overflow-hidden"
    >
      {/* Split Layout - Image & Content */}
      <div className={`flex h-full w-full ${isEven ? "flex-row" : "flex-row-reverse"}`}>
        {/* Image Side */}
        <div className="relative h-full w-1/2">
          <motion.div
            initial={{ scale: 1.2, opacity: 0 }}
            animate={isInView ? { scale: 1, opacity: 1 } : {}}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            <SafeImage
              src={pillar.image}
              alt={pillar.title}
              fill
              className="object-cover"
              priority={index === 0}
            />
            {/* Subtle overlay */}
            <div className="absolute inset-0 bg-neutral-950/20" />
          </motion.div>

        </div>

        {/* Content Side */}
        <div className="relative flex h-full w-1/2 items-center bg-neutral-950">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />

          {/* Accent Line */}
          <motion.div
            initial={{ scaleY: 0 }}
            animate={isInView ? { scaleY: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className={`absolute top-0 h-full w-px origin-top ${isEven ? "left-0" : "right-0"}`}
            style={{ backgroundColor: pillar.accent }}
          />

          <div className={`relative z-10 px-12 lg:px-20 ${isEven ? "pl-16 lg:pl-24" : "pr-16 lg:pr-24"}`}>
            {/* Subtitle */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mb-4 flex items-center gap-4"
            >
              <span
                className="font-Satoshi text-xs font-medium uppercase tracking-[0.3em]"
                style={{ color: pillar.accent }}
              >
                {pillar.subtitle}
              </span>
              <div className="h-px w-12" style={{ backgroundColor: pillar.accent }} />
            </motion.div>

            {/* Title */}
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mb-8 font-SchnyderS text-4xl font-light tracking-tight text-white sm:text-5xl lg:text-6xl"
            >
              {pillar.title}
            </motion.h2>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mb-10 max-w-md font-Satoshi text-base font-light leading-relaxed text-white/60 lg:text-lg"
            >
              {pillar.description}
            </motion.p>

            {/* Decorative Element */}
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={isInView ? { opacity: 1, width: 60 } : {}}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="h-px"
              style={{ backgroundColor: `${pillar.accent}40` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Roles for cycling animation
const roles = [
  { text: "Main Contractor", color: "#d4af37" },
  { text: "Designer", color: "#a8a29e" },
  { text: "Manufacturer", color: "#78716c" },
];

// Introduction Panel with cycling text
function IntroPanel() {
  const panelRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(panelRef, { once: true });
  const [currentRole, setCurrentRole] = useState(0);

  // Cycle through roles
  useEffect(() => {
    if (!isInView) return;

    const interval = setInterval(() => {
      setCurrentRole((prev) => (prev + 1) % roles.length);
    }, 2500);

    return () => clearInterval(interval);
  }, [isInView]);

  return (
    <div
      ref={panelRef}
      className="panel relative flex h-screen w-screen shrink-0 items-center justify-center overflow-hidden bg-neutral-950"
    >
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Radial glow that follows current role color */}
        <motion.div
          className="absolute inset-0"
          animate={{
            background: `radial-gradient(ellipse 80% 50% at 50% 50%, ${roles[currentRole].color}08 0%, transparent 70%)`,
          }}
          transition={{ duration: 1 }}
        />
        {/* Subtle grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>

      {/* Animated vertical lines */}
      <div className="absolute inset-0 flex justify-between px-[15%]">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            initial={{ scaleY: 0, opacity: 0 }}
            animate={isInView ? { scaleY: 1, opacity: 0.1 } : {}}
            transition={{ duration: 1.5, delay: 0.3 + i * 0.2 }}
            className="h-full w-px origin-top"
            style={{ backgroundColor: roles[i].color }}
          />
        ))}
      </div>

      {/* Corner accents */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 1, delay: 0.5 }}
        className="absolute left-8 top-8 h-20 w-20 border-l-2 border-t-2 lg:left-12 lg:top-12 lg:h-28 lg:w-28"
        style={{ borderColor: `${roles[currentRole].color}30` }}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 1, delay: 0.6 }}
        className="absolute bottom-8 right-8 h-20 w-20 border-b-2 border-r-2 lg:bottom-12 lg:right-12 lg:h-28 lg:w-28"
        style={{ borderColor: `${roles[currentRole].color}30` }}
      />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center px-8">
        {/* WE ARE THE - Static with decorative lines */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1 }}
          className="mb-6 flex items-center gap-6"
        >
          <motion.div
            initial={{ width: 0 }}
            animate={isInView ? { width: 60 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="h-px bg-gradient-to-r from-transparent to-white/30"
          />
          <span className="font-Satoshi text-base font-light uppercase tracking-[0.5em] text-white/40 sm:text-lg lg:text-xl">
            We Are The
          </span>
          <motion.div
            initial={{ width: 0 }}
            animate={isInView ? { width: 60 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="h-px bg-gradient-to-l from-transparent to-white/30"
          />
        </motion.div>

        {/* Cycling Role Text with enhanced animation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.3 }}
          className="relative mb-6 flex min-h-[80px] items-center justify-center sm:min-h-[100px] md:min-h-[120px] lg:min-h-[140px] xl:min-h-[160px]"
        >
          <AnimatePresence mode="wait">
            <motion.h2
              key={currentRole}
              initial={{ opacity: 0, y: 80, rotateX: -15 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              exit={{ opacity: 0, y: -80, rotateX: 15 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="font-SchnyderS text-5xl font-light tracking-tight sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl"
              style={{ color: roles[currentRole].color }}
            >
              {roles[currentRole].text}
            </motion.h2>
          </AnimatePresence>
        </motion.div>

        {/* Role indicator dots */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mb-10 flex items-center gap-4"
        >
          {roles.map((role, index) => (
            <button
              key={role.text}
              onClick={() => setCurrentRole(index)}
              className="group relative flex items-center gap-3"
            >
              {/* Dot */}
              <motion.div
                className="relative h-3 w-3 rounded-full border-2 transition-all duration-300"
                style={{
                  borderColor: index === currentRole ? role.color : "rgba(255,255,255,0.2)",
                  backgroundColor: index === currentRole ? role.color : "transparent",
                }}
              >
                {/* Pulse effect for active */}
                {index === currentRole && (
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{ backgroundColor: role.color }}
                    animate={{ scale: [1, 1.8, 1.8], opacity: [0.5, 0, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
              </motion.div>
              {/* Label on hover/active */}
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{
                  opacity: index === currentRole ? 1 : 0,
                  x: index === currentRole ? 0 : -10,
                }}
                transition={{ duration: 0.3 }}
                className="absolute left-5 whitespace-nowrap font-Satoshi text-[10px] uppercase tracking-widest"
                style={{ color: role.color }}
              >
                {role.text}
              </motion.span>
            </button>
          ))}
        </motion.div>

        {/* Animated divider line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{ duration: 1, delay: 0.6 }}
          className="mb-8 h-px w-32 origin-center"
          style={{ backgroundColor: `${roles[currentRole].color}40` }}
        />

        {/* Sub-headline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.7 }}
        >
          <span className="font-SchnyderS text-2xl font-light italic text-white/50 sm:text-3xl lg:text-4xl">
            We are all three.
          </span>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 1 }}
          className="absolute -bottom-32 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3"
        >
          <span className="font-Satoshi text-[10px] uppercase tracking-[0.3em] text-white/30">
            Scroll
          </span>
          <motion.div
            animate={{ x: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex items-center gap-2 text-white/30"
          >
            <div className="h-px w-6 bg-white/30" />
            <ArrowRight className="h-3 w-3" strokeWidth={1.5} />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

// Final Panel - "We Are All Three" with Stats
function FinalPanel({ pillars }: { pillars: ReturnType<typeof createPillars> }) {
  const panelRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(panelRef, { once: true, margin: "-10%" });
  const statsInView = useInView(statsRef, { once: true, margin: "-20%" });

  return (
    <div
      ref={panelRef}
      className="panel relative flex h-screen w-screen shrink-0 overflow-hidden"
    >
      {/* Background with all three images blended */}
      <div className="absolute inset-0">
        {pillars.map((pillar, i) => (
          <motion.div
            key={pillar.id}
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 0.15 } : {}}
            transition={{ duration: 1, delay: i * 0.2 }}
            className="absolute inset-0"
            style={{
              clipPath: `polygon(${i * 33}% 0, ${(i + 1) * 33}% 0, ${(i + 1) * 33}% 100%, ${i * 33}% 100%)`,
            }}
          >
            <SafeImage
              src={pillar.image}
              alt=""
              fill
              className="object-cover"
            />
          </motion.div>
        ))}
        <div className="absolute inset-0 bg-neutral-950/85" />
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/50 via-transparent to-neutral-950/90" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex h-full w-full flex-col items-center justify-center px-8">
        {/* Three Cards Preview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-8 flex gap-4"
        >
          {pillars.map((pillar, i) => (
            <motion.div
              key={pillar.id}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 + i * 0.1 }}
              className="group relative h-16 w-24 overflow-hidden border border-white/10 bg-white/5 backdrop-blur-sm lg:h-20 lg:w-32"
            >
              <SafeImage
                src={pillar.image}
                alt={pillar.title}
                fill
                className="object-cover opacity-60 transition-opacity duration-300 group-hover:opacity-80"
              />
              <div className="absolute bottom-1.5 left-2 font-Satoshi text-[8px] uppercase tracking-wider text-white/70 lg:text-[9px]">
                {pillar.subtitle}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Headline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mb-4 text-center"
        >
          <h2 className="font-SchnyderS text-2xl font-light tracking-tight text-white/80 sm:text-3xl lg:text-4xl">
            The Main Contractor. The Designer. The Manufacturer.
          </h2>
        </motion.div>

        {/* Sub-headline */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1, delay: 0.5 }}
          className="mb-8"
        >
          <span className="font-SchnyderS text-4xl font-light italic text-[#d4af37] sm:text-5xl lg:text-6xl">
            We are all three.
          </span>
        </motion.div>

        {/* Body Copy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mb-10 max-w-3xl space-y-4 text-center"
        >
          <p className="font-Satoshi text-sm font-light leading-relaxed text-white/60 sm:text-base lg:text-lg">
            Mouhajer International Design & Contracting (MIDC) is more than a construction firm;
            we are the architects of experience. As a premier turnkey solution provider based in
            Dubai and Abu Dhabi, we specialize in transforming ambitious concepts into award-winning realities.
          </p>
          <p className="font-Satoshi text-sm font-light leading-relaxed text-white/50 sm:text-base lg:text-lg">
            From the intricate luxury of 5-star hospitality to the personalized grandeur of private
            residences, our reputation is built on a seamless fusion of aesthetic mastery and
            engineering rigor. We do not just build spaces; we curate environments that stand the test of time.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          ref={statsRef}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="mb-10 grid w-full max-w-4xl grid-cols-2 gap-6 lg:grid-cols-4 lg:gap-8"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 1 + index * 0.1 }}
              className="group relative text-center"
            >
              {/* Animated border line */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={isInView ? { scaleX: 1 } : {}}
                transition={{ duration: 0.8, delay: 1.2 + index * 0.1 }}
                className="absolute -top-3 left-1/2 h-px w-12 -translate-x-1/2 origin-center bg-[#d4af37]/30"
              />

              {/* Number */}
              <div className="mb-2 font-SchnyderS text-4xl font-light text-[#d4af37] sm:text-5xl lg:text-6xl">
                <AnimatedCounter
                  value={stat.value}
                  suffix={stat.suffix}
                  isInView={statsInView}
                />
              </div>

              {/* Label */}
              <div className="font-Satoshi text-[10px] uppercase tracking-[0.2em] text-white/40 sm:text-xs">
                {stat.label}
              </div>

              {/* Hover glow effect */}
              <div className="absolute -inset-4 -z-10 rounded-lg bg-[#d4af37]/0 transition-all duration-500 group-hover:bg-[#d4af37]/5" />
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 1.3 }}
        >
          <Link
            href="/about"
            className="group relative inline-flex items-center gap-4 overflow-hidden border border-[#d4af37] bg-transparent px-10 py-4 font-Satoshi text-sm font-light uppercase tracking-[0.2em] text-white transition-all duration-500 hover:text-neutral-950"
          >
            {/* Background fill on hover */}
            <span className="absolute inset-0 -translate-x-full bg-[#d4af37] transition-transform duration-500 group-hover:translate-x-0" />

            <span className="relative z-10">Explore the MIDC Legacy</span>
            <ArrowUpRight
              className="relative z-10 h-4 w-4 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
              strokeWidth={1.5}
            />
          </Link>
        </motion.div>
      </div>

      {/* Corner Accents */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 1, delay: 0.5 }}
        className="absolute left-8 top-8 h-16 w-16 border-l border-t border-[#d4af37]/20"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 1, delay: 0.6 }}
        className="absolute bottom-8 right-8 h-16 w-16 border-b border-r border-[#d4af37]/20"
      />
    </div>
  );
}

// Main Component with Horizontal Scroll
export function WhoWeAreCinematic({ images }: WhoWeAreCinematicProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [currentPanel, setCurrentPanel] = useState(0);

  // Create pillars with images
  const pillars = createPillars(images);

  // Total panels: Intro + 3 Pillars + Final = 5 panels
  const totalPanels = 5;

  useEffect(() => {
    if (!sectionRef.current || !containerRef.current) return;

    const container = containerRef.current;
    const panels = gsap.utils.toArray<HTMLElement>(".panel");

    // Kill any existing ScrollTrigger instances for this section
    ScrollTrigger.getAll().forEach((st) => {
      if (st.vars.trigger === sectionRef.current) {
        st.kill();
      }
    });

    // Create horizontal scroll animation
    const scrollTween = gsap.to(panels, {
      xPercent: -100 * (panels.length - 1),
      ease: "none",
      scrollTrigger: {
        trigger: sectionRef.current,
        pin: true,
        scrub: 0.8,
        snap: 1 / (panels.length - 1),
        end: () => "+=" + container.offsetWidth * (panels.length - 1),
        onUpdate: (self) => {
          setProgress(self.progress);
          setCurrentPanel(Math.round(self.progress * (panels.length - 1)));
        },
      },
    });

    return () => {
      scrollTween.kill();
      ScrollTrigger.getAll().forEach((st) => {
        if (st.vars.trigger === sectionRef.current) {
          st.kill();
        }
      });
    };
  }, []);

  const panelLabels = ["Intro", ...pillars.map((p) => p.subtitle), "Complete"];

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-neutral-950"
    >
      {/* Progress Bar - Top */}
      <div className="absolute left-0 top-0 z-50 h-[2px] w-full bg-white/5">
        <motion.div
          className="h-full bg-[#d4af37]"
          style={{ width: `${progress * 100}%` }}
        />
      </div>

      {/* Current Panel Indicator - Top Left */}
      <div className="absolute left-8 top-8 z-50 hidden lg:block">
        <span className="font-Satoshi text-xs uppercase tracking-[0.2em] text-white/40">
          {panelLabels[currentPanel]}
        </span>
      </div>

      {/* Horizontal Scroll Container */}
      <div ref={containerRef} className="flex h-screen">
        {/* Panel 1: Introduction */}
        <IntroPanel />

        {/* Panels 2-4: Three Pillars with alternating layout */}
        {pillars.map((pillar, index) => (
          <PillarPanel
            key={pillar.id}
            pillar={pillar}
            index={index}
            isEven={index % 2 === 0}
          />
        ))}

        {/* Panel 5: Final - We Are All Three with Stats */}
        <FinalPanel pillars={pillars} />
      </div>

      {/* Bottom Navigation */}
      <div className="absolute bottom-8 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3">
        {Array.from({ length: totalPanels }).map((_, i) => (
          <div
            key={i}
            className={`h-1 rounded-full transition-all duration-500 ${
              i === currentPanel
                ? "w-10 bg-[#d4af37]"
                : i < currentPanel
                ? "w-4 bg-white/40"
                : "w-4 bg-white/20"
            }`}
          />
        ))}
      </div>

      {/* Side Navigation - Desktop */}
      <div className="absolute right-8 top-1/2 z-50 hidden -translate-y-1/2 lg:block">
        <div className="flex flex-col items-end gap-6">
          {panelLabels.map((label, i) => (
            <div key={label} className="flex items-center gap-4">
              <span
                className={`font-Satoshi text-[10px] uppercase tracking-wider transition-all duration-300 ${
                  i === currentPanel ? "text-white/60" : "text-transparent"
                }`}
              >
                {label}
              </span>
              <div
                className={`h-3 w-3 rounded-full border transition-all duration-300 ${
                  i === currentPanel
                    ? "border-[#d4af37] bg-[#d4af37]"
                    : i < currentPanel
                    ? "border-white/40 bg-white/40"
                    : "border-white/20 bg-transparent"
                }`}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
