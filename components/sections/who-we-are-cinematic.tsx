"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { ArrowRight } from "lucide-react";
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
const createPillars = (images?: WhoWeAreCinematicProps['images']) => [
  {
    id: "contractor",
    title: "The Main Contractor",
    subtitle: "We Build",
    description:
      "We hold the trade license to execute heavy civil works. From excavation and piling to the concrete superstructure, our own teams are on site daily.",
    image: images?.contractor || "/projects/commercial-interior/11.jpg",
  },
  {
    id: "designer",
    title: "The Designer",
    subtitle: "We Create",
    description:
      "Our creative team designs the vision, but because they work alongside the builders, every drawing is validated for cost and feasibility before you see it.",
    image: images?.designer || "/projects/bedroom-interior/01 Villa Hatem Master Bedroom OP4.jpg",
  },
  {
    id: "manufacturer",
    title: "The Manufacturer",
    subtitle: "We Craft",
    description:
      "We manufacture your fire-rated doors, wardrobes, and custom furniture in our own local facility, ensuring perfect fit and zero shipping delays.",
    image: images?.manufacturer || "/projects/closet/_MID0095-HDR.jpg",
  },
];

// Individual Pillar Stage Component
function PillarStage({
  pillar,
  index,
  scrollYProgress,
}: {
  pillar: (typeof pillars)[0];
  index: number;
  scrollYProgress: any;
}) {
  const stageRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  // Calculate stage progress (each pillar gets 20% of scroll, stages 2-4)
  const stageStart = (index + 1) * 0.2; // 0.2, 0.4, 0.6
  const stageEnd = (index + 2) * 0.2; // 0.4, 0.6, 0.8

  const stageProgress = useTransform(
    scrollYProgress,
    [stageStart, stageStart + 0.05, stageEnd - 0.05, stageEnd],
    [0, 1, 1, 0]
  );

  const opacity = useTransform(
    scrollYProgress,
    [stageStart, stageStart + 0.03, stageEnd - 0.03, stageEnd],
    [0, 1, 1, 0]
  );

  const scale = useTransform(
    scrollYProgress,
    [stageStart, stageStart + 0.05, stageEnd - 0.05, stageEnd],
    [0.8, 1, 1, 1.1]
  );

  const y = useTransform(
    scrollYProgress,
    [stageStart, stageStart + 0.05, stageEnd - 0.05, stageEnd],
    [100, 0, 0, -100]
  );

  // Reduced blur for subtlety - only slight blur at transitions
  const blur = useTransform(
    scrollYProgress,
    [stageStart, stageStart + 0.02, stageEnd - 0.02, stageEnd],
    [3, 0, 0, 2]
  );

  const imageScale = useTransform(
    scrollYProgress,
    [stageStart, stageEnd],
    [1.2, 1]
  );

  // GSAP character animation
  useEffect(() => {
    if (!titleRef.current || hasAnimated) return;

    const chars = titleRef.current.querySelectorAll(".char");
    if (chars.length === 0) return;

    const unsubscribe = stageProgress.on("change", (progress) => {
      if (progress > 0.3 && !hasAnimated) {
        setHasAnimated(true);
        gsap.fromTo(
          chars,
          {
            opacity: 0,
            y: 80,
            rotateY: -90,
          },
          {
            opacity: 1,
            y: 0,
            rotateY: 0,
            stagger: 0.03,
            duration: 0.8,
            ease: "power4.out",
          }
        );
      }
    });

    return () => unsubscribe();
  }, [stageProgress, hasAnimated]);

  // Split title into characters
  const titleChars = pillar.title.split("").map((char, i) => (
    <span
      key={i}
      className="char inline-block opacity-0"
      style={{ transform: "perspective(1000px)" }}
    >
      {char === " " ? "\u00A0" : char}
    </span>
  ));

  return (
    <motion.div
      ref={stageRef}
      className="pointer-events-none absolute inset-0 flex items-center justify-center"
      style={{ opacity }}
    >
      {/* Background Image */}
      <motion.div className="absolute inset-0" style={{ scale: imageScale }}>
        <SafeImage
          src={pillar.image}
          alt={pillar.title}
          fill
          className="object-cover"
          priority={index === 0}
        />
        <div className="absolute inset-0 bg-neutral-950/70" />
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-transparent to-neutral-950" />
      </motion.div>

      {/* Content */}
      <motion.div
        className="relative z-10 mx-auto max-w-7xl px-6 text-center"
        style={{
          scale,
          y,
        }}
      >
        {/* Subtitle Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          className="mb-6 inline-flex items-center gap-3"
        >
          <span className="font-Satoshi text-sm font-light uppercase tracking-[0.3em] text-white/40">
            {pillar.subtitle}
          </span>
        </motion.div>

        {/* Title with Character Animation */}
        <h2
          ref={titleRef}
          className="mb-8 font-SchnyderS text-6xl font-light tracking-tight text-white sm:text-7xl md:text-8xl lg:text-9xl"
          style={{ perspective: "1000px" }}
        >
          {titleChars}
        </h2>

        {/* Description */}
        <motion.p
          className="mx-auto max-w-2xl font-Satoshi text-lg font-light leading-relaxed text-white/60 sm:text-xl"
          initial={{ opacity: 0, y: 30 }}
        >
          {pillar.description}
        </motion.p>

        {/* Decorative Elements */}
        <div className="mt-12 flex items-center justify-center gap-4">
          <div className="h-px w-16 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
          <div className="h-2 w-2 rotate-45 border border-white/30" />
          <div className="h-px w-16 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
        </div>
      </motion.div>
    </motion.div>
  );
}

// Pillar type for FusionStage
type Pillar = ReturnType<typeof createPillars>[0];

// Final Fusion Stage
function FusionStage({
  scrollYProgress,
  isComplete,
  pillars,
}: {
  scrollYProgress: any;
  isComplete: boolean;
  pillars: Pillar[];
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse tracking for 3D effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { stiffness: 100, damping: 30 };
  const rotateX = useSpring(
    useTransform(mouseY, [-0.5, 0.5], [5, -5]),
    springConfig
  );
  const rotateY = useSpring(
    useTransform(mouseX, [-0.5, 0.5], [-5, 5]),
    springConfig
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      mouseX.set(x);
      mouseY.set(y);
    },
    [mouseX, mouseY]
  );

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const opacity = useTransform(scrollYProgress, [0.8, 0.85], [0, 1]);
  const scale = useTransform(scrollYProgress, [0.8, 0.9], [0.9, 1]);
  const y = useTransform(scrollYProgress, [0.8, 0.9], [50, 0]);

  return (
    <motion.div
      ref={containerRef}
      className="pointer-events-auto absolute inset-0 flex items-center justify-center"
      style={{ opacity }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.05)_0%,transparent_70%)]" />

      {/* Content */}
      <motion.div
        className="relative z-10 mx-auto max-w-6xl px-6 text-center"
        style={{
          scale,
          y,
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
      >
        {/* Label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isComplete ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-8 flex items-center justify-center gap-4"
        >
          <div className="h-px w-12 bg-white/20" />
          <span className="font-Satoshi text-xs font-light uppercase tracking-[0.3em] text-white/40">
            Who We Are
          </span>
          <div className="h-px w-12 bg-white/20" />
        </motion.div>

        {/* Three Pillars in One Line */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isComplete ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-6"
        >
          <h2 className="font-SchnyderS text-4xl font-light tracking-tight text-white sm:text-5xl lg:text-6xl">
            The Main Contractor.{" "}
            <span className="text-white/60">The Designer. </span>
            <br />
            <span className="text-white/40">The Manufacturer.</span>
          </h2>
        </motion.div>

        {/* "We Are All Three" - Hero Text */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isComplete ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1, delay: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          className="mb-12"
        >
          <span className="font-SchnyderS text-5xl font-light italic text-[#d4af37] sm:text-6xl lg:text-7xl">
            We are all three.
          </span>
        </motion.div>

        {/* Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isComplete ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mx-auto mb-12 max-w-3xl space-y-4"
        >
          <p className="font-Satoshi text-lg font-light leading-relaxed text-white/70">
            Mouhajer International Design & Contracting (MIDC) is more than a
            construction firm; we are the architects of experience. As a premier
            turnkey solution provider based in Dubai and Abu Dhabi, we
            specialize in transforming ambitious concepts into award-winning
            realities.
          </p>
          <p className="font-Satoshi text-base font-light leading-relaxed text-white/50">
            From the intricate luxury of 5-star hospitality to the personalized
            grandeur of private residences, our reputation is built on a
            seamless fusion of aesthetic mastery and engineering rigor. We do not just build spaces; we curate environments that stand the test of time.
          </p>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isComplete ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 1 }}
        >
          <Link
            href="/about"
            className="group inline-flex items-center gap-3 border border-white bg-white px-8 py-4 font-Satoshi text-sm font-light uppercase tracking-[0.15em] text-neutral-950 transition-all duration-500 hover:bg-transparent hover:text-white"
          >
            Explore the MIDC Legacy
            <ArrowRight
              className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
              strokeWidth={1.5}
            />
          </Link>
        </motion.div>

        {/* 3D Floating Cards Behind (Decorative) */}
        <div
          className="pointer-events-none absolute inset-0 -z-10"
          style={{ perspective: "1000px" }}
        >
          {pillars.map((pillar, i) => (
            <motion.div
              key={pillar.id}
              className="absolute h-32 w-48 overflow-hidden border border-white/10 bg-neutral-900/50 backdrop-blur-sm"
              style={{
                left: `${20 + i * 25}%`,
                top: `${30 + (i % 2) * 20}%`,
                transform: `translateZ(${-50 - i * 30}px) rotateY(${-10 + i * 10}deg)`,
                opacity: 0.3,
              }}
              initial={{ opacity: 0 }}
              animate={isComplete ? { opacity: 0.3 } : {}}
              transition={{ delay: 1.5 + i * 0.2 }}
            >
              <SafeImage
                src={pillar.image}
                alt=""
                fill
                className="object-cover opacity-50"
              />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

// Introduction Stage
function IntroStage({ scrollYProgress }: { scrollYProgress: any }) {
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.1, 0.15, 0.2],
    [1, 1, 0.5, 0]
  );
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);
  const y = useTransform(scrollYProgress, [0, 0.2], [0, -50]);

  return (
    <motion.div
      className="pointer-events-none absolute inset-0 flex items-center justify-center"
      style={{ opacity, scale, y }}
    >
      <div className="absolute inset-0 bg-neutral-950" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.02)_0%,transparent_70%)]" />

      <div className="relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="mb-6 flex items-center justify-center gap-4"
        >
          <div className="h-px w-16 bg-white/20" />
          <span className="font-Satoshi text-xs font-light uppercase tracking-[0.3em] text-white/40">
            Introducing
          </span>
          <div className="h-px w-16 bg-white/20" />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="font-SchnyderS text-6xl font-light tracking-tight text-white sm:text-7xl lg:text-8xl"
        >
          Who We Are
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="mt-6 font-Satoshi text-lg font-light text-white/40"
        >
          Scroll to discover our three pillars of excellence
        </motion.p>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="mt-12"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-flex flex-col items-center gap-2 text-white/30"
          >
            <div className="h-12 w-px bg-gradient-to-b from-white/30 to-transparent" />
            <span className="font-Satoshi text-[10px] uppercase tracking-[0.2em]">
              Scroll
            </span>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}

// Main Component
export function WhoWeAreCinematic({ images }: WhoWeAreCinematicProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [isComplete, setIsComplete] = useState(false);

  // Create pillars with images
  const pillars = createPillars(images);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (progress) => {
      if (progress > 0.85 && !isComplete) {
        setIsComplete(true);
      }
    });
    return () => unsubscribe();
  }, [scrollYProgress, isComplete]);

  return (
    <section ref={sectionRef} className="relative h-[500vh] bg-neutral-950">
      {/* Sticky Container */}
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Progress Bar */}
        <motion.div
          className="absolute left-0 top-0 z-50 h-1 bg-gradient-to-r from-[#d4af37] to-white/50"
          style={{ scaleX: scrollYProgress, transformOrigin: "left" }}
        />

        {/* Stage 1: Introduction */}
        <IntroStage scrollYProgress={scrollYProgress} />

        {/* Stages 2-4: Three Pillars */}
        {pillars.map((pillar, index) => (
          <PillarStage
            key={pillar.id}
            pillar={pillar}
            index={index}
            scrollYProgress={scrollYProgress}
          />
        ))}

        {/* Stage 5: Fusion */}
        <FusionStage
          scrollYProgress={scrollYProgress}
          isComplete={isComplete}
          pillars={pillars}
        />

        {/* Side Navigation Dots */}
        <div className="absolute right-8 top-1/2 z-50 hidden -translate-y-1/2 flex-col gap-4 lg:flex">
          {["Intro", ...pillars.map((p) => p.subtitle), "All Three"].map(
            (label, i) => {
              const dotStart = i * 0.2;
              const dotEnd = (i + 1) * 0.2;
              return (
                <motion.div
                  key={label}
                  className="group flex items-center gap-3"
                >
                  <span className="font-Satoshi text-[10px] uppercase tracking-wider text-white/0 transition-colors group-hover:text-white/40">
                    {label}
                  </span>
                  <motion.div
                    className="h-2 w-2 rounded-full border border-white/30"
                    style={{
                      backgroundColor: useTransform(
                        scrollYProgress,
                        [dotStart, dotStart + 0.05, dotEnd - 0.05, dotEnd],
                        [
                          "transparent",
                          "rgba(255,255,255,0.8)",
                          "rgba(255,255,255,0.8)",
                          "transparent",
                        ]
                      ),
                    }}
                  />
                </motion.div>
              );
            }
          )}
        </div>
      </div>
    </section>
  );
}
