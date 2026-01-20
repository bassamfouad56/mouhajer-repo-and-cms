"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";

interface StatItemProps {
  value: number;
  suffix: string;
  label: string;
  delay: number;
}

function AnimatedCounter({
  value,
  suffix,
  duration = 2.5,
}: {
  value: number;
  suffix: string;
  duration?: number;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const end = value;
    const totalFrames = 60 * duration;
    const increment = end / totalFrames;

    const counter = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(counter);
      } else {
        setCount(Math.floor(start));
      }
    }, 1000 / 60);

    return () => clearInterval(counter);
  }, [isInView, value, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {count}
      {suffix}
    </span>
  );
}

function StatItem({ value, suffix, label, delay }: StatItemProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className="group relative flex flex-col items-center text-center"
    >
      {/* Value */}
      <div className="mb-2 font-SchnyderS text-5xl font-light tracking-tight text-[#262420] sm:text-6xl md:text-7xl lg:text-8xl">
        <AnimatedCounter value={value} suffix={suffix} />
      </div>

      {/* Label */}
      <div className="font-Satoshi text-[10px] font-light uppercase tracking-[0.15em] text-[#3d3a36]/60 sm:text-xs sm:tracking-[0.2em]">
        {label}
      </div>

      {/* Hover line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : {}}
        transition={{ duration: 0.6, delay: delay + 0.3 }}
        className="mt-4 h-px w-12 origin-center bg-[#c9a962]/40 sm:mt-6 sm:w-16"
      />
    </motion.div>
  );
}

// Luxury interior images for the background carousel
const backgroundImages = [
  {
    src: "/placeholder.jpg",
    alt: "Luxury living room with marble floors",
  },
  {
    src: "/placeholder.jpg",
    alt: "Elegant master bedroom suite",
  },
  {
    src: "/placeholder.jpg",
    alt: "Modern luxury bathroom interior",
  },
  {
    src: "/placeholder.jpg",
    alt: "Premium commercial interior",
  },
];

export function StatsBanner() {
  const t = useTranslations("Stats");
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [activeImage, setActiveImage] = useState(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const backgroundScale = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [1.1, 1, 1.1]
  );

  // Auto-rotate background images
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveImage((prev) => (prev + 1) % backgroundImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    { value: 400, suffix: "+", label: t("projectsCompleted") },
    { value: 20, suffix: "+", label: t("yearsExperience") },
    { value: 10, suffix: "+", label: t("internationalAwards") },
    { value: 100, suffix: "%", label: t("clientSatisfaction") },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-screen items-center overflow-hidden bg-[#faf8f5] py-24 sm:py-32 lg:py-40"
    >
      {/* Background Images with Crossfade */}
      <motion.div
        style={{ y: 0, scale: backgroundScale }}
        className="absolute inset-0"
      >
        {backgroundImages.map((image, index) => (
          <motion.div
            key={`bg-image-${index}`}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: index === activeImage ? 1 : 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="100vw"
              className="object-cover"
              priority={index === 0}
            />
          </motion.div>
        ))}

        {/* Light overlay */}
        <div className="absolute inset-0 bg-[#faf8f5]/75" />

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#faf8f5] via-transparent to-[#faf8f5]" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#faf8f5]/50 via-transparent to-[#faf8f5]/50" />

        {/* Subtle grid */}
      </motion.div>

      {/* Top border line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : {}}
        transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
        className="absolute left-0 top-0 h-px w-full origin-left bg-gradient-to-r from-transparent via-[#c9a962]/30 to-transparent"
      />

      {/* Bottom border line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : {}}
        transition={{ duration: 1, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
        className="absolute bottom-0 left-0 h-px w-full origin-right bg-gradient-to-r from-transparent via-[#c9a962]/30 to-transparent"
      />

      {/* Floating decorative elements */}
      <motion.div
        className="absolute left-[10%] top-1/4 h-32 w-px bg-gradient-to-b from-transparent via-[#c9a962]/20 to-transparent"
        animate={{ opacity: [0.3, 0.6, 0.3], y: [0, -20, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute right-[15%] bottom-1/4 h-px w-24 bg-gradient-to-r from-transparent via-[#262420]/10 to-transparent"
        animate={{ opacity: [0.2, 0.5, 0.2], x: [0, 20, 0] }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-12">
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12 flex items-center justify-center gap-4 lg:mb-16"
        >
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#c9a962]/50" />
          <span className="font-Satoshi text-xs font-light uppercase tracking-[0.3em] text-[#c9a962]">
            {t("heading")}
          </span>
          <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#c9a962]/50" />
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-8 sm:gap-12 lg:grid-cols-4 lg:gap-8">
          {stats.map((stat, index) => (
            <StatItem key={stat.label} {...stat} delay={index * 0.1} />
          ))}
        </div>

        {/* Image indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16 flex items-center justify-center gap-2"
        >
          {backgroundImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveImage(index)}
              className={`h-1 transition-all duration-500 ${
                index === activeImage
                  ? "w-8 bg-[#c9a962]"
                  : "w-2 bg-[#262420]/20 hover:bg-[#262420]/40"
              }`}
              aria-label={`View image ${index + 1}`}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
