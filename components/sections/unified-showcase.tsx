"use client";

import { useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  useInView,
} from "framer-motion";
import { SafeImage } from "@/components/safe-image";
import {
  ArrowUpRight,
  Sparkles,
  Building2,
  Home,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";

interface UnifiedShowcaseProps {
  images: {
    background: string;
    contractor?: string;
    designer?: string;
    manufacturer?: string;
    landOwners?: string;
    propertyOwners?: string;
  };
}

// Promise cards data
const promiseCards = [
  {
    id: "land-owners",
    icon: Building2,
    label: "From Ground Zero",
    title: "Land Owners",
    subtitle: "Build Your Vision",
    description:
      "You see potential in the sand. We have the engineering license to turn that empty plot into a structural masterpiece — from foundation to finishing.",
    imageKey: "landOwners",
    href: "/services/civil-construction",
    ctaText: "Explore Construction",
    accent: true,
  },
  {
    id: "property-owners",
    icon: Home,
    label: "Renaissance & Rebirth",
    title: "Property Owners",
    subtitle: "Transform Your Space",
    description:
      "You own a villa or hotel that needs a rebirth. We transform dated structures into modern assets that command attention and deliver returns.",
    imageKey: "propertyOwners",
    href: "/services/interior-architecture",
    ctaText: "Explore Transformation",
    accent: false,
  },
];

// Who We Are panels - Industries style
const whoWeArePanels = [
  {
    id: "build",
    label: "We Build",
    title: "The Main Contractor",
    subtitle: "From Foundation to Finish",
    description:
      "We hold the trade license to execute heavy civil works. From excavation and piling to the concrete superstructure, our own teams are on site daily — ensuring quality control at every pour, every weld, every connection.",
    href: "/services/civil-construction",
    ctaText: "Explore Construction",
    imageKey: "contractor",
    accent: "#c9a962",
  },
  {
    id: "design",
    label: "We Design",
    title: "The Design Studio",
    subtitle: "Vision Meets Feasibility",
    description:
      "Our creative team designs the vision, but because they work alongside the builders, every drawing is validated for cost and feasibility before you see it. No surprises, no value engineering disappointments.",
    href: "/services/interior-architecture",
    ctaText: "Explore Design",
    imageKey: "designer",
    accent: "#d4c4a8",
  },
  {
    id: "make",
    label: "We Make",
    title: "The Mouhajer Factory",
    subtitle: "Crafted Locally, Delivered Precisely",
    description:
      "Why wait for imports? We manufacture your fire-rated doors, wardrobes, and custom furniture in our own local facility — ensuring perfect fit, zero shipping delays, and the ability to adjust on the fly.",
    href: "/services/manufacturing-joinery",
    ctaText: "Explore Manufacturing",
    imageKey: "manufacturer",
    accent: "#9ca3af",
  },
];

export function UnifiedShowcase({ images }: UnifiedShowcaseProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const promiseContentRef = useRef<HTMLDivElement>(null);
  const promiseInView = useInView(promiseContentRef, { once: true, margin: "-100px" });
  const [activePanel, setActivePanel] = useState(0);

  // Total scroll height: Promise section (1 screen) + Who We Are panels (3 panels x 180vh each)
  const totalHeight = 100 + whoWeArePanels.length * 180; // vh

  // Main scroll progress for the entire unified section
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Calculate where Promise section ends and Who We Are begins
  const promiseRatio = 100 / totalHeight; // ~15% of total scroll
  const whoWeAreRatio = 1 - promiseRatio;

  // Hold ratio for the first Who We Are panel
  const holdRatio = 0.15;
  const scrollRatio = 1 - holdRatio;

  // Track active panel based on scroll
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (latest <= promiseRatio) {
      setActivePanel(-1); // Promise section
    } else {
      // Calculate which Who We Are panel we're on
      const whoWeAreProgress = (latest - promiseRatio) / whoWeAreRatio;
      const panelProgress = Math.max(0, Math.min(1, (whoWeAreProgress - holdRatio) / scrollRatio));
      const newIndex = Math.min(
        whoWeArePanels.length - 1,
        Math.floor(panelProgress * whoWeArePanels.length)
      );
      if (newIndex !== activePanel && newIndex >= 0) {
        setActivePanel(newIndex);
      }
    }
  });

  // Transform for horizontal scroll in Who We Are section
  const x = useTransform(
    scrollYProgress,
    [promiseRatio, promiseRatio + whoWeAreRatio * holdRatio, 1],
    ["0%", "0%", `-${(whoWeArePanels.length - 1) * 100}%`]
  );

  // Progress bar width for Who We Are
  const progressWidth = useTransform(
    scrollYProgress,
    [promiseRatio, promiseRatio + whoWeAreRatio * holdRatio, 1],
    ["0%", `${100 / whoWeArePanels.length}%`, "100%"]
  );

  // Promise section content opacity (fades out as we enter Who We Are)
  const promiseOpacity = useTransform(
    scrollYProgress,
    [0, promiseRatio * 0.7, promiseRatio],
    [1, 1, 0]
  );

  // Who We Are header opacity (fades in as we enter Who We Are)
  const whoWeAreHeaderOpacity = useTransform(
    scrollYProgress,
    [promiseRatio * 0.8, promiseRatio],
    [0, 1]
  );

  const getImageUrl = (imageKey: string) => {
    return images[imageKey as keyof typeof images] || images.background;
  };

  // Background image opacity transforms
  const bgPromiseOpacity = useTransform(
    scrollYProgress,
    [0, promiseRatio * 0.8, promiseRatio],
    [1, 1, 0]
  );

  return (
    <section
      ref={sectionRef}
      id="unified-showcase"
      className="relative bg-neutral-950"
      style={{ height: `${totalHeight}vh` }}
    >
      {/* Sticky Container */}
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* ============================================ */}
        {/* UNIFIED BACKGROUND SYSTEM */}
        {/* ============================================ */}

        {/* Promise Section Background (initial background) */}
        <motion.div
          className="absolute inset-0 z-0"
          style={{ opacity: bgPromiseOpacity }}
        >
          <SafeImage
            src={images.background}
            alt="Construction background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/70 via-neutral-950/50 to-neutral-950/80" />
          <div className="absolute inset-0 bg-neutral-950/40" />
        </motion.div>

        {/* Who We Are Panel Backgrounds (fade in as you scroll) */}
        {whoWeArePanels.map((panel, index) => {
          const panelStart = promiseRatio + (index / whoWeArePanels.length) * whoWeAreRatio;
          const panelEnd = promiseRatio + ((index + 1) / whoWeArePanels.length) * whoWeAreRatio;

          const bgOpacity = useTransform(
            scrollYProgress,
            [
              Math.max(promiseRatio * 0.8, panelStart - 0.05),
              panelStart,
              panelEnd - 0.05,
              Math.min(1, panelEnd + 0.02),
            ],
            [0, 1, 1, index === whoWeArePanels.length - 1 ? 1 : 0]
          );

          const bgScale = useTransform(
            scrollYProgress,
            [panelStart, (panelStart + panelEnd) / 2, panelEnd],
            [1.1, 1, 1.05]
          );

          return (
            <motion.div
              key={`bg-${panel.id}`}
              className="absolute inset-0 z-0"
              style={{ opacity: bgOpacity, scale: bgScale }}
            >
              <SafeImage
                src={getImageUrl(panel.imageKey)}
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
          );
        })}

        {/* ============================================ */}
        {/* PROMISE SECTION CONTENT */}
        {/* ============================================ */}
        <motion.div
          ref={promiseContentRef}
          className="absolute inset-0 z-10 flex items-center justify-center"
          style={{ opacity: promiseOpacity }}
        >
          <div className="mx-auto max-w-7xl px-6 py-32 lg:py-40">
            {/* Header */}
            <motion.div
              className="mb-16 text-center"
              initial={{ opacity: 0, y: 30 }}
              animate={promiseInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="mb-6 flex items-center justify-center gap-4">
                <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#c9a962]" />
                <div className="flex items-center gap-2">
                  <Sparkles className="h-3.5 w-3.5 text-[#c9a962]" strokeWidth={1.5} />
                  <span className="font-Satoshi text-[10px] font-medium uppercase tracking-[0.4em] text-[#c9a962]">
                    The Mouhajer Promise
                  </span>
                </div>
                <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#c9a962]" />
              </div>

              <h2 className="mb-4 font-SchnyderS text-3xl font-light tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
                The Architect of
                <br />
                <span className="text-[#c9a962]">Assets & Sanctuaries</span>
              </h2>

              <p className="mx-auto max-w-xl font-Satoshi text-base font-light leading-relaxed text-white/60 lg:text-lg">
                Two categories of clients.{" "}
                <span className="font-medium text-white/90">One unwavering demand: Perfection.</span>
              </p>
            </motion.div>

            {/* Cards Grid */}
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
              {promiseCards.map((card, index) => {
                const Icon = card.icon;
                const isAccent = card.accent;

                return (
                  <motion.div
                    key={card.id}
                    className="flex"
                    initial={{ opacity: 0, y: 40 }}
                    animate={promiseInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8, delay: 0.2 + index * 0.15, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Link href={card.href} className="group flex w-full">
                      <div
                        className={`relative flex w-full flex-col overflow-hidden border bg-white/5 p-6 backdrop-blur-md transition-all duration-500 sm:p-8 lg:p-10 ${
                          isAccent
                            ? "border-white/10 hover:border-[#c9a962]/30 hover:bg-white/10 hover:shadow-[0_0_60px_rgba(201,169,98,0.15)]"
                            : "border-white/10 hover:border-white/20 hover:bg-white/10 hover:shadow-[0_0_60px_rgba(255,255,255,0.05)]"
                        }`}
                      >
                        {/* Corner accents */}
                        <div
                          className={`absolute left-0 top-0 h-8 w-px ${isAccent ? "bg-[#c9a962]/30" : "bg-white/20"}`}
                        />
                        <div
                          className={`absolute left-0 top-0 h-px w-8 ${isAccent ? "bg-[#c9a962]/30" : "bg-white/20"}`}
                        />
                        <div
                          className={`absolute bottom-0 right-0 h-8 w-px ${isAccent ? "bg-[#c9a962]/30" : "bg-white/20"}`}
                        />
                        <div
                          className={`absolute bottom-0 right-0 h-px w-8 ${isAccent ? "bg-[#c9a962]/30" : "bg-white/20"}`}
                        />

                        {/* Icon */}
                        <div
                          className={`mb-4 inline-flex h-12 w-12 items-center justify-center border backdrop-blur-sm lg:h-14 lg:w-14 ${
                            isAccent
                              ? "border-[#c9a962]/30 bg-[#c9a962]/10"
                              : "border-white/20 bg-white/10"
                          }`}
                        >
                          <Icon
                            className={`h-5 w-5 lg:h-6 lg:w-6 ${isAccent ? "text-[#c9a962]" : "text-white/70"}`}
                            strokeWidth={1.5}
                          />
                        </div>

                        {/* Label */}
                        <span
                          className={`mb-2 block font-Satoshi text-[10px] font-medium uppercase tracking-[0.3em] ${
                            isAccent ? "text-[#c9a962]" : "text-white/40"
                          }`}
                        >
                          {card.label}
                        </span>

                        {/* Title */}
                        <h3 className="mb-2 font-SchnyderS text-3xl font-light text-white lg:text-4xl">
                          {card.title}
                        </h3>

                        {/* Subtitle */}
                        <p className="mb-4 font-Satoshi text-base font-light text-white/50 lg:text-lg">
                          {card.subtitle}
                        </p>

                        {/* Description */}
                        <p className="mb-8 grow font-Satoshi text-sm font-light leading-relaxed text-white/60 lg:text-base">
                          {card.description}
                        </p>

                        {/* CTA */}
                        <div className="mt-auto flex items-center gap-2 transition-transform group-hover:translate-x-1">
                          <span
                            className={`font-Satoshi text-xs font-light tracking-wide transition-colors lg:text-sm ${
                              isAccent
                                ? "text-white/70 group-hover:text-[#c9a962]"
                                : "text-white/70 group-hover:text-white"
                            }`}
                          >
                            {card.ctaText}
                          </span>
                          <div
                            className={`flex h-9 w-9 items-center justify-center border transition-all duration-300 lg:h-10 lg:w-10 ${
                              isAccent
                                ? "border-white/20 group-hover:border-[#c9a962] group-hover:bg-[#c9a962]"
                                : "border-white/20 group-hover:border-white/40 group-hover:bg-white/10"
                            }`}
                          >
                            <ArrowUpRight
                              className={`h-4 w-4 transition-colors ${
                                isAccent
                                  ? "text-white group-hover:text-neutral-950"
                                  : "text-white/70 group-hover:text-white"
                              }`}
                              strokeWidth={1.5}
                            />
                          </div>
                        </div>

                        {/* Bottom accent line on hover */}
                        <div
                          className={`absolute bottom-0 left-0 h-0.5 w-0 transition-all duration-500 group-hover:w-full ${
                            isAccent ? "bg-[#c9a962]" : "bg-white/40"
                          }`}
                        />
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>

            {/* Scroll Indicator */}
            <motion.div
              className="mt-16 flex flex-col items-center gap-2"
              initial={{ opacity: 0 }}
              animate={promiseInView ? { opacity: 1 } : {}}
              transition={{ delay: 1 }}
            >
              <span className="font-Satoshi text-[10px] uppercase tracking-[0.3em] text-white/40">
                Scroll to discover
              </span>
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <ChevronDown className="h-5 w-5 text-[#c9a962]/60" />
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* ============================================ */}
        {/* WHO WE ARE SECTION CONTENT */}
        {/* ============================================ */}
        <motion.div
          className="absolute inset-0 z-20"
          style={{ opacity: whoWeAreHeaderOpacity }}
        >
          {/* Fixed Header */}
          <div className="absolute left-0 right-0 top-0 z-40 px-4 pb-4 pt-20 sm:px-6 sm:pb-6 sm:pt-24 lg:px-12 lg:pb-8 lg:pt-28">
            <motion.div
              className="flex flex-col items-center gap-3 lg:flex-row lg:items-start lg:justify-between lg:gap-4"
            >
              {/* Left: Title */}
              <div className="text-center lg:text-left">
                <div className="mb-2 flex items-center justify-center gap-2 lg:justify-start">
                  <Sparkles className="h-3 w-3 text-[#c9a962]" strokeWidth={1} />
                  <span className="font-Satoshi text-[9px] uppercase tracking-[0.3em] text-[#c9a962] sm:text-[10px] sm:tracking-[0.4em]">
                    Who We Are
                  </span>
                </div>
                <h2 className="font-SchnyderS text-2xl font-light tracking-tight text-white sm:text-3xl md:text-4xl lg:text-5xl">
                  <span className="block sm:inline">The Contractor. The Designer.</span>{" "}
                  <span className="text-[#c9a962]">The Maker.</span>
                </h2>
              </div>

              {/* Right: Tagline */}
              <div className="hidden lg:block">
                <p className="max-w-xs text-right font-Satoshi text-sm font-light leading-relaxed text-white/50">
                  Three disciplines. One integrated team.
                  <br />
                  <span className="text-[#c9a962]">We are all three.</span>
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
                {whoWeArePanels.map((panel, index) => {
                  const panelStart = promiseRatio + (index / whoWeArePanels.length) * whoWeAreRatio;
                  const panelMid = promiseRatio + ((index + 0.5) / whoWeArePanels.length) * whoWeAreRatio;
                  const panelEnd = promiseRatio + ((index + 1) / whoWeArePanels.length) * whoWeAreRatio;

                  return (
                    <motion.div
                      key={panel.id}
                      className="flex items-center gap-1 sm:gap-2"
                      style={{
                        opacity: useTransform(
                          scrollYProgress,
                          [panelStart - 0.02, panelStart, panelMid, panelEnd],
                          [
                            index === 0 ? 1 : 0.3,
                            1,
                            1,
                            index === whoWeArePanels.length - 1 ? 1 : 0.3,
                          ]
                        ),
                      }}
                    >
                      <span
                        className="font-Satoshi text-[8px] uppercase tracking-[0.2em] sm:text-[10px] sm:tracking-[0.3em] lg:text-xs"
                        style={{ color: panel.accent }}
                      >
                        {panel.label}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Horizontal Scroll Container */}
          <motion.div className="flex h-full pt-32 sm:pt-40 lg:pt-48" style={{ x }}>
            {whoWeArePanels.map((panel, index) => {
              const panelStart = promiseRatio + (index / whoWeArePanels.length) * whoWeAreRatio;
              const panelMid = promiseRatio + ((index + 0.5) / whoWeArePanels.length) * whoWeAreRatio;

              // Content animation timing
              const getContentProgress = (offset: number) => {
                const start = panelStart + offset * 0.02;
                const end = Math.min(panelMid, start + 0.08);
                return [start, end];
              };

              return (
                <div
                  key={panel.id}
                  className="relative flex h-full w-screen shrink-0"
                >
                  {/* Content Container */}
                  <div className="relative z-10 flex h-full w-full flex-col justify-end px-4 pb-20 sm:px-6 sm:pb-24 lg:flex-row lg:items-center lg:justify-start lg:px-12 lg:pb-16 xl:px-20">
                    {/* Main Content */}
                    <div className="max-w-full sm:max-w-xl lg:max-w-3xl">
                      {/* Label Badge */}
                      <motion.div
                        className="mb-4 flex items-center gap-3 sm:mb-6 sm:gap-4"
                        style={{
                          opacity: useTransform(
                            scrollYProgress,
                            getContentProgress(0),
                            [index === 0 ? 1 : 0, 1]
                          ),
                          y: useTransform(
                            scrollYProgress,
                            getContentProgress(0),
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
                          {panel.label}
                        </span>
                      </motion.div>

                      {/* Title */}
                      <motion.h3
                        className="mb-2 font-SchnyderS text-3xl font-light leading-[1.1] text-white sm:mb-3 sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl"
                        style={{
                          opacity: useTransform(
                            scrollYProgress,
                            getContentProgress(1),
                            [index === 0 ? 1 : 0, 1]
                          ),
                          y: useTransform(
                            scrollYProgress,
                            getContentProgress(1),
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
                            getContentProgress(2),
                            [index === 0 ? 1 : 0, 1]
                          ),
                          y: useTransform(
                            scrollYProgress,
                            getContentProgress(2),
                            [index === 0 ? 0 : 30, 0]
                          ),
                        }}
                      >
                        {panel.description}
                      </motion.p>

                      {/* Primary CTA Button */}
                      <motion.div
                        style={{
                          opacity: useTransform(
                            scrollYProgress,
                            getContentProgress(3),
                            [index === 0 ? 1 : 0, 1]
                          ),
                        }}
                      >
                        <Link
                          href={panel.href}
                          className="group inline-flex items-center gap-3 bg-[#c9a962] px-6 py-3.5 transition-all duration-300 hover:bg-[#b8983f] sm:px-8 sm:py-4"
                        >
                          <span className="font-Satoshi text-xs font-medium uppercase tracking-[0.15em] text-neutral-950 sm:text-sm">
                            {panel.ctaText}
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
                  {index < whoWeArePanels.length - 1 && (
                    <div className="absolute right-0 top-1/2 hidden h-2/3 w-px -translate-y-1/2 bg-gradient-to-b from-transparent via-white/20 to-transparent lg:block" />
                  )}
                </div>
              );
            })}
          </motion.div>

          {/* Bottom Navigation Dots */}
          <div className="absolute bottom-4 left-1/2 z-40 flex -translate-x-1/2 items-center gap-4 sm:bottom-6 sm:gap-6 lg:bottom-10 lg:gap-8">
            {whoWeArePanels.map((panel, index) => {
              const panelStart = promiseRatio + (index / whoWeArePanels.length) * whoWeAreRatio;
              const panelMid = promiseRatio + ((index + 0.5) / whoWeArePanels.length) * whoWeAreRatio;
              const panelEnd = promiseRatio + ((index + 1) / whoWeArePanels.length) * whoWeAreRatio;

              return (
                <motion.div
                  key={panel.id}
                  className="relative"
                  style={{
                    scale: useTransform(
                      scrollYProgress,
                      [panelStart - 0.02, panelStart, panelMid, panelEnd],
                      [
                        index === 0 ? 1.2 : 0.8,
                        1.2,
                        1.2,
                        index === whoWeArePanels.length - 1 ? 1.2 : 0.8,
                      ]
                    ),
                  }}
                >
                  <motion.div
                    className="h-1.5 rounded-full transition-all duration-500 sm:h-2"
                    style={{
                      width: useTransform(
                        scrollYProgress,
                        [panelStart - 0.02, panelStart, panelMid, panelEnd],
                        [
                          index === 0 ? 32 : 6,
                          32,
                          32,
                          index === whoWeArePanels.length - 1 ? 32 : 6,
                        ]
                      ),
                      backgroundColor: useTransform(
                        scrollYProgress,
                        [panelStart - 0.02, panelStart, panelMid, panelEnd],
                        [
                          index === 0 ? panel.accent : "rgba(255,255,255,0.2)",
                          panel.accent,
                          panel.accent,
                          index === whoWeArePanels.length - 1
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
        </motion.div>

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
