"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { SafeImage } from "@/components/safe-image";
import {
  ArrowUpRight,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { urlForImage } from "@/sanity/lib/image";

interface SanityIndustry {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt?: string;
  mainImage?: any;
  icon?: string;
  featured?: boolean;
  order?: number;
}

interface IndustriesHorizontalScrollProps {
  industries: SanityIndustry[];
}

// Default industries data as fallback
const defaultIndustries = [
  {
    _id: "luxury-hospitality",
    title: "Luxury Hospitality",
    slug: { current: "luxury-hospitality" },
    excerpt:
      "The art of the live renovation. Upgrading your asset while protecting your guest experience. We specialize in 5-star hotel renovations with zero guest complaints.",
    accent: "#c9a962",
    image:
      "/website%202.0%20content/services/industries/luxury%20hospitality/_MID3940-HDR.jpg",
  },
  {
    _id: "high-end-residential",
    title: "High-End Residential",
    slug: { current: "high-end-residential" },
    excerpt:
      "Private sanctuaries. A home designed for your status, built for your peace. Turnkey luxury villas and penthouses with absolute discretion.",
    accent: "#d4c4a8",
    image:
      "/website%202.0%20content/services/industries/highend%20residential/_MID0001-HDR-2.jpg",
  },
  {
    _id: "commercial-corporate",
    title: "Commercial & Corporate",
    slug: { current: "commercial-corporate" },
    excerpt:
      "Engineered for performance. Designed for the brand. Fast-track commercial fit-outs with in-house joinery and MEP teams.",
    accent: "#9ca3af",
    image:
      "/website%202.0%20content/services/industries/commercial%20and%20corporate/_MID1004-HDR.jpg",
  },
];

// Get image URL from Sanity or fallback
const getImageUrl = (industry: SanityIndustry): string => {
  if (industry.mainImage?.asset) {
    try {
      return urlForImage(industry.mainImage)
        .width(1920)
        .height(1080)
        .auto("format")
        .url();
    } catch {
      // Fall through to fallback
    }
  }

  // Fallback images based on slug
  const slug = industry.slug?.current || "";
  if (slug.includes("hospitality"))
    return "/website%202.0%20content/services/industries/luxury%20hospitality/_MID3940-HDR.jpg";
  if (slug.includes("residential"))
    return "/website%202.0%20content/services/industries/highend%20residential/_MID0001-HDR-2.jpg";
  if (slug.includes("commercial") || slug.includes("corporate"))
    return "/website%202.0%20content/services/industries/commercial%20and%20corporate/_MID1004-HDR.jpg";

  return "/placeholder.jpg";
};

// Get accent color based on industry
const getAccent = (slug: string): string => {
  if (slug.includes("hospitality")) return "#c9a962";
  if (slug.includes("residential")) return "#d4c4a8";
  return "#9ca3af";
};

export function IndustriesHorizontalScroll({
  industries,
}: IndustriesHorizontalScrollProps) {
  const sectionRef = useRef<HTMLElement>(null);

  // Use CMS industries or fallback to defaults
  const panels =
    industries.length > 0
      ? industries.map((ind) => ({
          id: ind._id,
          title: ind.title,
          slug: ind.slug?.current || "",
          excerpt: ind.excerpt || "",
          image: getImageUrl(ind),
          accent: getAccent(ind.slug?.current || ""),
        }))
      : defaultIndustries.map((ind) => ({
          id: ind._id,
          title: ind.title,
          slug: ind.slug.current,
          excerpt: ind.excerpt,
          image: ind.image,
          accent: ind.accent,
        }));

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Add initial hold period (first 15% of scroll shows first panel fully)
  // Then scroll through remaining panels
  const holdRatio = 0.15; // First 15% holds on panel 1
  const scrollRatio = 1 - holdRatio; // Remaining 85% for scrolling

  // Transform vertical scroll to horizontal scroll (with initial hold)
  const x = useTransform(
    scrollYProgress,
    [0, holdRatio, 1],
    ["0%", "0%", `-${(panels.length - 1) * 100}%`]
  );

  // Progress bar width (adjusted for hold period)
  const progressWidth = useTransform(
    scrollYProgress,
    [0, holdRatio, 1],
    ["0%", `${100 / panels.length}%`, "100%"]
  );

  return (
    <section
      ref={sectionRef}
      id="industries"
      className="relative bg-neutral-950"
      style={{ height: `${panels.length * 180}vh` }}
    >
      {/* Sticky Container */}
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Fixed Header */}
        <div className="absolute left-0 right-0 top-0 z-40 px-4 pb-4 pt-20 sm:px-6 sm:pb-6 sm:pt-24 lg:px-12 lg:pb-8 lg:pt-28">
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center gap-3 lg:flex-row lg:items-start lg:justify-between lg:gap-4"
          >
            {/* Left: Title */}
            <div className="text-center lg:text-left">
              <div className="mb-2 flex items-center justify-center gap-2 lg:justify-start">
                <Sparkles className="h-3 w-3 text-[#c9a962]" strokeWidth={1} />
                <span className="font-Satoshi text-[9px] uppercase tracking-[0.3em] text-[#c9a962] sm:text-[10px] sm:tracking-[0.4em]">
                  Industries We Transform
                </span>
              </div>
              <h2 className="font-SchnyderS text-2xl font-light tracking-tight text-white sm:text-3xl md:text-4xl lg:text-5xl">
                <span className="block sm:inline">Sectors of</span>{" "}
                <span className="text-[#c9a962]">Excellence.</span>
              </h2>
            </div>

            {/* Right: Tagline */}
            <div className="hidden lg:block">
              <p className="max-w-xs text-right font-Satoshi text-sm font-light leading-relaxed text-white/50">
                Three decades of expertise.
                <br />
                <span className="text-[#c9a962]">Across every sector.</span>
              </p>
            </div>
          </motion.div>

          {/* Progress Bar */}
          <div className="mx-auto mt-4 max-w-4xl sm:mt-6 lg:mt-8">
            <div className="relative h-[2px] w-full overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="absolute left-0 top-0 h-full bg-gradient-to-r from-[#c9a962] to-[#e8d5a3]"
                style={{ width: progressWidth }}
              />
            </div>
            {/* Panel Indicators */}
            <div className="mt-3 flex justify-between sm:mt-4">
              {panels.map((panel, index) => {
                // Adjust timing for hold period on first panel
                const panelStart =
                  index === 0
                    ? 0
                    : holdRatio + ((index - 0.5) / panels.length) * scrollRatio;
                const panelActive =
                  index === 0
                    ? 0
                    : holdRatio + (index / panels.length) * scrollRatio;
                const panelMid =
                  index === 0
                    ? holdRatio
                    : holdRatio + ((index + 0.5) / panels.length) * scrollRatio;
                const panelEnd =
                  index === 0
                    ? holdRatio
                    : Math.min(
                        1,
                        holdRatio + ((index + 1) / panels.length) * scrollRatio
                      );

                return (
                  <motion.div
                    key={panel.id}
                    className="flex items-center gap-1 sm:gap-2"
                    style={{
                      opacity: useTransform(
                        scrollYProgress,
                        [panelStart, panelActive, panelMid, panelEnd],
                        [
                          index === 0 ? 1 : 0.3,
                          1,
                          1,
                          index === panels.length - 1 ? 1 : 0.3,
                        ]
                      ),
                    }}
                  >
                    <span
                      className="font-Satoshi text-[8px] uppercase tracking-[0.2em] sm:text-[10px] sm:tracking-[0.3em] lg:text-xs"
                      style={{ color: panel.accent }}
                    >
                      {panel.title}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Horizontal Scroll Container */}
        <motion.div className="flex h-full" style={{ x }}>
          {panels.map((panel, index) => {
            // Calculate adjusted scroll positions for each panel
            // First panel (index 0): content visible from start, stays during holdRatio
            // Other panels: start after holdRatio with proportional timing
            const getAdjustedProgress = (baseOffset: number) => {
              if (index === 0) {
                // First panel: animate in quickly at the start (0 to 0.05)
                return [0, 0.05];
              }
              // Other panels: adjust for hold period
              const panelScrollStart =
                holdRatio + ((index - 1) / (panels.length - 1)) * scrollRatio;
              const animStart = Math.max(
                holdRatio,
                panelScrollStart - 0.05 + baseOffset * 0.1
              );
              const animEnd = Math.min(
                1,
                panelScrollStart + 0.1 + baseOffset * 0.1
              );
              return [animStart, animEnd];
            };

            // Background scale timing
            const bgScaleStart =
              index === 0
                ? 0
                : holdRatio + ((index - 1) / (panels.length - 1)) * scrollRatio;
            const bgScaleMid =
              index === 0
                ? holdRatio * 0.5
                : holdRatio +
                  ((index - 0.5) / (panels.length - 1)) * scrollRatio;
            const bgScaleEnd =
              index === 0
                ? holdRatio
                : Math.min(
                    1,
                    holdRatio + (index / (panels.length - 1)) * scrollRatio
                  );

            return (
              <div
                key={panel.id}
                className="relative flex h-full w-screen shrink-0"
              >
                {/* Full Background Image */}
                <motion.div
                  className="absolute inset-0"
                  style={{
                    scale: useTransform(
                      scrollYProgress,
                      [bgScaleStart, bgScaleMid, bgScaleEnd],
                      [1.1, 1, 1.05]
                    ),
                  }}
                >
                  <SafeImage
                    src={panel.image}
                    alt={panel.title}
                    fill
                    className="object-cover"
                    priority={index === 0}
                  />
                  {/* Cinematic Overlays */}
                  <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/60 to-neutral-950/30 sm:via-neutral-950/40 sm:to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent sm:from-neutral-950/60" />
                  <div className="absolute inset-0 bg-neutral-950/40 sm:bg-neutral-950/30" />
                </motion.div>

                {/* Content Container */}
                <div className="relative z-10 flex h-full w-full flex-col justify-end px-4 pb-20 pt-44 sm:px-6 sm:pb-24 sm:pt-52 lg:flex-row lg:items-center lg:justify-start lg:px-12 lg:pb-16 lg:pt-64 xl:px-20">
                  {/* Main Content */}
                  <div className="max-w-full sm:max-w-xl lg:max-w-3xl">
                    {/* Label Badge */}
                    <motion.div
                      className="mb-4 flex items-center gap-3 sm:mb-6 sm:gap-4"
                      style={{
                        opacity: useTransform(
                          scrollYProgress,
                          getAdjustedProgress(0),
                          [index === 0 ? 1 : 0, 1]
                        ),
                        y: useTransform(
                          scrollYProgress,
                          getAdjustedProgress(0),
                          [index === 0 ? 0 : 40, 0]
                        ),
                      }}
                    >
                      <div
                        className="h-0.5 w-8 sm:h-1 sm:w-12"
                        style={{ backgroundColor: panel.accent }}
                      />
                      <span
                        className="font-Satoshi text-[10px] font-medium uppercase tracking-[0.3em] sm:text-xs"
                        style={{ color: panel.accent }}
                      >
                        {panel.title}
                      </span>
                    </motion.div>

                    {/* Title */}
                    <motion.h3
                      className="mb-2 font-SchnyderS text-3xl font-light leading-[1.1] text-white sm:mb-3 sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl"
                      style={{
                        opacity: useTransform(
                          scrollYProgress,
                          getAdjustedProgress(0.5),
                          [index === 0 ? 1 : 0, 1]
                        ),
                        y: useTransform(
                          scrollYProgress,
                          getAdjustedProgress(0.5),
                          [index === 0 ? 0 : 60, 0]
                        ),
                      }}
                    >
                      {panel.title}
                    </motion.h3>

                    {/* Description */}
                    <motion.p
                      className="mb-8 max-w-md font-Satoshi text-sm font-light leading-relaxed text-white/70 sm:mb-10 sm:max-w-xl sm:text-base lg:text-lg lg:leading-relaxed"
                      style={{
                        opacity: useTransform(
                          scrollYProgress,
                          getAdjustedProgress(1),
                          [index === 0 ? 1 : 0, 1]
                        ),
                        y: useTransform(
                          scrollYProgress,
                          getAdjustedProgress(1),
                          [index === 0 ? 0 : 30, 0]
                        ),
                      }}
                    >
                      {panel.excerpt}
                    </motion.p>

                    {/* Primary CTA Button */}
                    <motion.div
                      style={{
                        opacity: useTransform(
                          scrollYProgress,
                          getAdjustedProgress(1.5),
                          [index === 0 ? 1 : 0, 1]
                        ),
                      }}
                    >
                      <Link
                        href={`/industries/${panel.slug}`}
                        className="group inline-flex items-center gap-3 bg-[#c9a962] px-6 py-3.5 transition-all duration-300 hover:bg-[#b8983f] sm:px-8 sm:py-4"
                      >
                        <span className="font-Satoshi text-xs font-medium uppercase tracking-[0.15em] text-neutral-950 sm:text-sm">
                          Explore {panel.title}
                        </span>
                        <ArrowUpRight
                          className="h-4 w-4 text-neutral-950 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                          strokeWidth={2}
                        />
                      </Link>
                    </motion.div>
                  </div>
                </div>

                {/* Panel Divider */}
                {index < panels.length - 1 && (
                  <div className="absolute right-0 top-1/2 hidden h-2/3 w-px -translate-y-1/2 bg-gradient-to-b from-transparent via-white/20 to-transparent lg:block" />
                )}
              </div>
            );
          })}
        </motion.div>

        {/* Bottom Navigation Dots */}
        <div className="absolute bottom-4 left-1/2 z-40 flex -translate-x-1/2 items-center gap-4 sm:bottom-6 sm:gap-6 lg:bottom-10 lg:gap-8">
          {panels.map((panel, index) => {
            // Adjust dot timing for hold period
            const dotStart =
              index === 0
                ? 0
                : holdRatio +
                  ((index - 0.3) / (panels.length - 1)) * scrollRatio;
            const dotActive =
              index === 0
                ? 0
                : holdRatio + (index / (panels.length - 1)) * scrollRatio;
            const dotMid =
              index === 0
                ? holdRatio
                : holdRatio +
                  ((index + 0.7) / (panels.length - 1)) * scrollRatio;
            const dotEnd =
              index === 0
                ? holdRatio
                : Math.min(
                    1,
                    holdRatio +
                      ((index + 1) / (panels.length - 1)) * scrollRatio
                  );

            return (
              <motion.div
                key={panel.id}
                className="relative"
                style={{
                  scale: useTransform(
                    scrollYProgress,
                    [dotStart, dotActive, dotMid, dotEnd],
                    [
                      index === 0 ? 1.2 : 0.8,
                      1.2,
                      1.2,
                      index === panels.length - 1 ? 1.2 : 0.8,
                    ]
                  ),
                }}
              >
                <motion.div
                  className="h-1.5 rounded-full transition-all duration-500 sm:h-2"
                  style={{
                    width: useTransform(
                      scrollYProgress,
                      [dotStart, dotActive, dotMid, dotEnd],
                      [
                        index === 0 ? 32 : 6,
                        32,
                        32,
                        index === panels.length - 1 ? 32 : 6,
                      ]
                    ),
                    backgroundColor: useTransform(
                      scrollYProgress,
                      [dotStart, dotActive, dotMid, dotEnd],
                      [
                        index === 0 ? panel.accent : "rgba(255,255,255,0.2)",
                        panel.accent,
                        panel.accent,
                        index === panels.length - 1
                          ? panel.accent
                          : "rgba(255,255,255,0.2)",
                      ]
                    ),
                  }}
                />
              </motion.div>
            );
          })}
        </div>

        {/* Mobile Scroll Hint */}
        <motion.div
          className="absolute bottom-4 right-4 z-40 flex items-center gap-2 sm:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <motion.div
            animate={{ y: [0, 4, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown className="h-4 w-4 text-[#c9a962]" />
          </motion.div>
        </motion.div>

        {/* Desktop Scroll Hint */}

        {/* Corner Decorations */}
        <div className="pointer-events-none absolute bottom-6 left-4 z-30 hidden h-12 w-12 sm:block sm:left-6 lg:left-12 lg:h-16 lg:w-16">
          <div className="absolute bottom-0 left-0 h-6 w-px bg-[#c9a962]/30 lg:h-8" />
          <div className="absolute bottom-0 left-0 h-px w-6 bg-[#c9a962]/30 lg:w-8" />
        </div>
        <div className="pointer-events-none absolute right-4 top-6 z-30 hidden h-12 w-12 sm:block sm:right-6 lg:right-12 lg:h-16 lg:w-16">
          <div className="absolute right-0 top-0 h-6 w-px bg-[#c9a962]/30 lg:h-8" />
          <div className="absolute right-0 top-0 h-px w-6 bg-[#c9a962]/30 lg:w-8" />
        </div>
      </div>
    </section>
  );
}
