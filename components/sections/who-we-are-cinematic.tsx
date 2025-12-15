"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
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
    number: "01",
    description:
      "We hold the trade license to execute heavy civil works. From excavation and piling to the concrete superstructure, our own teams are on site daily.",
    image: images?.contractor || "/projects/commercial-interior/11.jpg",
    accent: "#d4af37",
  },
  {
    id: "designer",
    title: "The Designer",
    subtitle: "We Create",
    number: "02",
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
    number: "03",
    description:
      "We manufacture your fire-rated doors, wardrobes, and custom furniture in our own local facility, ensuring perfect fit and zero shipping delays.",
    image: images?.manufacturer || "/projects/closet/_MID0095-HDR.jpg",
    accent: "#78716c",
  },
];

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

          {/* Large Number Overlay */}
          <motion.div
            initial={{ opacity: 0, x: isEven ? -50 : 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className={`absolute bottom-8 ${isEven ? "right-8" : "left-8"}`}
          >
            <span className="font-SchnyderS text-[180px] font-light leading-none text-white/10 lg:text-[240px]">
              {pillar.number}
            </span>
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

// Introduction Panel
function IntroPanel() {
  const panelRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(panelRef, { once: true });

  return (
    <div
      ref={panelRef}
      className="panel relative flex h-screen w-screen shrink-0 items-center justify-center overflow-hidden bg-neutral-950"
    >
      {/* Animated Background Grid */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.05)_0%,transparent_60%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:80px_80px]" />
      </div>

      {/* Floating Elements */}
      <motion.div
        initial={{ opacity: 0, rotate: -10 }}
        animate={isInView ? { opacity: 0.1, rotate: 0 } : {}}
        transition={{ duration: 1.5, delay: 0.5 }}
        className="absolute left-[10%] top-[20%] h-32 w-48 border border-white/10"
      />
      <motion.div
        initial={{ opacity: 0, rotate: 10 }}
        animate={isInView ? { opacity: 0.1, rotate: 0 } : {}}
        transition={{ duration: 1.5, delay: 0.7 }}
        className="absolute bottom-[25%] right-[15%] h-40 w-32 border border-[#d4af37]/20"
      />

      {/* Content */}
      <div className="relative z-10 max-w-4xl px-8 text-center">
        {/* Label */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1 }}
          className="mb-8 inline-flex items-center gap-6"
        >
          <div className="h-px w-20 bg-gradient-to-r from-transparent to-white/30" />
          <span className="font-Satoshi text-[10px] font-medium uppercase tracking-[0.4em] text-white/40">
            Who We Are
          </span>
          <div className="h-px w-20 bg-gradient-to-l from-transparent to-white/30" />
        </motion.div>

        {/* Main Title */}
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.2 }}
          className="mb-6 font-SchnyderS text-5xl font-light tracking-tight text-white sm:text-6xl lg:text-7xl"
        >
          Three Pillars
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.3 }}
          className="mb-8"
        >
          <span className="font-SchnyderS text-4xl font-light italic text-[#d4af37] sm:text-5xl lg:text-6xl">
            One Vision
          </span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.5 }}
          className="mx-auto max-w-xl font-Satoshi text-base font-light leading-relaxed text-white/50 lg:text-lg"
        >
          Discover the integrated capabilities that make MIDC the UAE's complete construction partner
        </motion.p>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-16 flex items-center justify-center gap-4"
        >
          <motion.div
            animate={{ x: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex items-center gap-3 text-white/30"
          >
            <div className="h-px w-8 bg-white/30" />
            <ArrowRight className="h-4 w-4" strokeWidth={1} />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

// Final Panel - "We Are All Three"
function FinalPanel({ pillars }: { pillars: ReturnType<typeof createPillars> }) {
  const panelRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(panelRef, { once: true, margin: "-10%" });

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
        <div className="absolute inset-0 bg-neutral-950/80" />
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/50 via-transparent to-neutral-950/90" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex h-full w-full flex-col items-center justify-center px-8">
        {/* Three Cards Preview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-12 flex gap-4"
        >
          {pillars.map((pillar, i) => (
            <motion.div
              key={pillar.id}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 + i * 0.1 }}
              className="group relative h-20 w-28 overflow-hidden border border-white/10 bg-white/5 backdrop-blur-sm lg:h-24 lg:w-36"
            >
              <SafeImage
                src={pillar.image}
                alt={pillar.title}
                fill
                className="object-cover opacity-60 transition-opacity duration-300 group-hover:opacity-80"
              />
              <div className="absolute bottom-2 left-2 font-Satoshi text-[9px] uppercase tracking-wider text-white/70">
                {pillar.subtitle}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Message */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mb-6 text-center"
        >
          <h2 className="font-SchnyderS text-3xl font-light tracking-tight text-white/80 sm:text-4xl">
            The Main Contractor. The Designer. The Manufacturer.
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1, delay: 0.5 }}
          className="mb-10"
        >
          <span className="font-SchnyderS text-5xl font-light italic text-[#d4af37] sm:text-6xl lg:text-7xl">
            We are all three.
          </span>
        </motion.div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mb-12 max-w-2xl text-center font-Satoshi text-base font-light leading-relaxed text-white/50 lg:text-lg"
        >
          Mouhajer International Design & Contracting (MIDC) is more than a
          construction firm; we are the architects of experience. From luxury
          hospitality to private residences, our reputation is built on a
          seamless fusion of aesthetic mastery and engineering rigor.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.9 }}
        >
          <Link
            href="/about"
            className="group inline-flex items-center gap-4 border-b border-[#d4af37] pb-2 font-Satoshi text-sm font-light uppercase tracking-[0.2em] text-white transition-all duration-500 hover:border-white"
          >
            Explore the MIDC Legacy
            <ArrowUpRight
              className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
              strokeWidth={1.5}
            />
          </Link>
        </motion.div>
      </div>
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
        <div className="flex items-center gap-4">
          <span className="font-SchnyderS text-4xl font-light text-[#d4af37]">
            {String(currentPanel + 1).padStart(2, "0")}
          </span>
          <div className="h-8 w-px bg-white/20" />
          <span className="font-Satoshi text-[10px] uppercase tracking-[0.2em] text-white/40">
            {panelLabels[currentPanel]}
          </span>
        </div>
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

        {/* Panel 5: Final - We Are All Three */}
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
