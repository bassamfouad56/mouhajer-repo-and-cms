"use client";

import { useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  useMotionValueEvent,
} from "framer-motion";
import { ArrowUpRight, History, Workflow, Award, Users } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { SafeImage } from "@/components/safe-image";

// Ecosystem links data
const ecosystemLinks = [
  {
    id: "legacy",
    icon: History,
    title: "MIDC Legacy",
    headline: "A Vision Built on Integrity",
    description:
      "Discover the journey of Mouhajer International from its inception to becoming one of the UAE's most respected contracting firms.",
    link: "/about/legacy",
    cta: "Explore Our Legacy",
  },
  {
    id: "workflow",
    icon: Workflow,
    title: "MIDC Workflow",
    headline: "Where Design Meets Engineering",
    description:
      "Explore our seamless design-and-build methodology, where in-house designers collaborate directly with civil engineers.",
    link: "/about/process",
    cta: "View Our Methodology",
  },
  {
    id: "awards",
    icon: Award,
    title: "Awards",
    headline: "Celebrated on the Global Stage",
    description:
      "Explore our gallery of achievements, including the Arabian Property Awards for Best Hotel Interior and more.",
    link: "/about/awards",
    cta: "View Our Awards",
  },
  {
    id: "clients",
    icon: Users,
    title: "Clients",
    headline: "Trusted by Industry Giants",
    description:
      "Discover the prestigious brands that rely on MIDC for their most critical renovation and construction projects.",
    link: "/about/clients",
    cta: "Meet Our Partners",
  },
];

// Press logos data
const pressLogos = [
  { name: "Arabian Business", logo: "/press/arabian-business.svg" },
  { name: "Gulf News", logo: "/press/gulf-news.svg" },
  { name: "Construction Week", logo: "/press/construction-week.svg" },
  { name: "Hotelier Middle East", logo: "/press/hotelier-me.svg" },
  { name: "Architectural Digest ME", logo: "/press/architectural-digest.svg" },
  { name: "Forbes Middle East", logo: "/press/forbes-me.svg" },
];

interface AboutJourneyProps {
  quoteImage?: string;
  quote?: string;
  quoteAuthor?: string;
}

export function AboutJourney({
  quoteImage = "/team/MID9563.jpg",
  quote = "Excellence is not a destination but a continuous journey of refinement.",
  quoteAuthor = "MIDC Philosophy",
}: AboutJourneyProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-50px" });
  const [activeChapter, setActiveChapter] = useState<
    "quote" | "ecosystem" | "press"
  >("quote");

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Track which chapter is active for pointer events
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (latest < 0.28) {
      setActiveChapter("quote");
    } else if (latest < 0.72) {
      setActiveChapter("ecosystem");
    } else {
      setActiveChapter("press");
    }
  });

  // Scroll-driven transforms for different sections
  // Chapter 1: Quote (0 - 0.25)
  const quoteOpacity = useTransform(
    scrollYProgress,
    [0, 0.08, 0.2, 0.28],
    [0, 1, 1, 0],
  );
  const quoteY = useTransform(
    scrollYProgress,
    [0, 0.08, 0.2, 0.28],
    [60, 0, 0, -60],
  );
  const quoteScale = useTransform(
    scrollYProgress,
    [0, 0.08, 0.2, 0.28],
    [0.95, 1, 1, 0.95],
  );
  const quoteImageOpacity = useTransform(
    scrollYProgress,
    [0, 0.05, 0.25, 0.3],
    [0.6, 0.4, 0.4, 0],
  );

  // Chapter 2: Ecosystem Cards (0.25 - 0.7)
  const ecosystemOpacity = useTransform(
    scrollYProgress,
    [0.22, 0.32, 0.65, 0.72],
    [0, 1, 1, 0],
  );
  const ecosystemY = useTransform(scrollYProgress, [0.22, 0.32], [80, 0]);

  // Chapter 3: Press Logos (0.7 - 1)
  const pressOpacity = useTransform(
    scrollYProgress,
    [0.68, 0.78, 0.95, 1],
    [0, 1, 1, 1],
  );
  const pressY = useTransform(scrollYProgress, [0.68, 0.78], [60, 0]);

  // Background transitions
  const bgOverlay = useTransform(
    scrollYProgress,
    [0, 0.25, 0.7, 1],
    [0.4, 0.92, 0.95, 0.92],
  );

  return (
    <section
      ref={sectionRef}
      className="relative bg-neutral-950"
      style={{ height: "400vh" }}
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Background Image with parallax */}
        <motion.div className="absolute inset-0">
          <SafeImage
            src={quoteImage}
            alt="MIDC Journey"
            fill
            className="object-cover"
            priority
          />
          <motion.div
            className="absolute inset-0 bg-[#faf8f5]"
            style={{ opacity: bgOverlay }}
          />
        </motion.div>

        {/* Gradient accents */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(201,169,98,0.06)_0%,transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(201,169,98,0.04)_0%,transparent_50%)]" />
        </div>

        {/* Film grain for dark state */}
        <motion.div
          className="pointer-events-none absolute inset-0 opacity-[0.02]"
          style={{
            opacity: useTransform(scrollYProgress, [0, 0.25], [0.03, 0]),
          }}
        >
          <div className="h-full w-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iMC44IiBudW1PY3RhdmVzPSI0IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsdGVyPSJ1cmwoI2EpIi8+PC9zdmc+')] bg-repeat" />
        </motion.div>

        {/* Corner Decorations */}
        <div className="pointer-events-none absolute left-6 top-8 z-30 hidden h-16 w-16 sm:block lg:left-12">
          <motion.div
            className="absolute left-0 top-0 w-px"
            style={{
              height: 32,
              backgroundColor: useTransform(
                scrollYProgress,
                [0, 0.25],
                ["rgba(201,169,98,0.5)", "rgba(201,169,98,0.3)"],
              ),
            }}
          />
          <motion.div
            className="absolute left-0 top-0 h-px"
            style={{
              width: 32,
              backgroundColor: useTransform(
                scrollYProgress,
                [0, 0.25],
                ["rgba(201,169,98,0.5)", "rgba(201,169,98,0.3)"],
              ),
            }}
          />
        </div>
        <div className="pointer-events-none absolute bottom-8 right-6 z-30 hidden h-16 w-16 sm:block lg:right-12">
          <motion.div
            className="absolute bottom-0 right-0 w-px"
            style={{
              height: 32,
              backgroundColor: useTransform(
                scrollYProgress,
                [0, 0.25],
                ["rgba(201,169,98,0.5)", "rgba(201,169,98,0.3)"],
              ),
            }}
          />
          <motion.div
            className="absolute bottom-0 right-0 h-px"
            style={{
              width: 32,
              backgroundColor: useTransform(
                scrollYProgress,
                [0, 0.25],
                ["rgba(201,169,98,0.5)", "rgba(201,169,98,0.3)"],
              ),
            }}
          />
        </div>

        {/* ============================================ */}
        {/* CHAPTER 1: Quote Section */}
        {/* ============================================ */}
        <motion.div
          className={`absolute inset-0 flex items-center justify-center z-10 ${activeChapter !== "quote" ? "pointer-events-none" : ""}`}
          style={{ opacity: quoteOpacity }}
        >
          <motion.div
            style={{ y: quoteY, scale: quoteScale }}
            className="mx-auto max-w-4xl px-6 text-center lg:px-12"
          >
            {/* Decorative line */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : {}}
              transition={{ duration: 1.2, delay: 0.2 }}
              className="mx-auto mb-8 h-px w-24 origin-center bg-gradient-to-r from-transparent via-[#8f7852]/60 to-transparent"
            />

            {/* Quote */}
            <p className="mb-6 font-SchnyderS text-3xl font-light italic leading-relaxed text-neutral-800 sm:text-4xl lg:text-5xl">
              &ldquo;{quote}&rdquo;
            </p>

            {/* Author */}
            <span className="font-Satoshi text-xs font-light uppercase tracking-[0.3em] text-[#b08d3e]">
              {quoteAuthor}
            </span>

            {/* Decorative line */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : {}}
              transition={{ duration: 1.2, delay: 0.4 }}
              className="mx-auto mt-8 h-px w-24 origin-center bg-gradient-to-r from-transparent via-[#8f7852]/60 to-transparent"
            />

            {/* Scroll hint */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 1.5 }}
              className="mt-16"
            ></motion.div>
          </motion.div>
        </motion.div>

        {/* ============================================ */}
        {/* CHAPTER 2: Ecosystem Cards */}
        {/* ============================================ */}
        <motion.div
          className={`absolute inset-0 flex items-center justify-center z-10 ${activeChapter !== "ecosystem" ? "pointer-events-none" : ""}`}
          style={{ opacity: ecosystemOpacity }}
        >
          <motion.div
            style={{ y: ecosystemY }}
            className="mx-auto max-w-7xl px-6 lg:px-12 w-full"
          >
            {/* Header */}
            <div className="mb-12 text-center lg:mb-16">
              <div className="mb-4 flex items-center justify-center gap-4">
                <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#8f7852]/40" />
                <span className="font-Satoshi text-[10px] font-light uppercase tracking-[0.4em] text-neutral-500">
                  Discover More
                </span>
                <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#8f7852]/40" />
              </div>
              <h2 className="font-SchnyderS text-4xl font-light tracking-tight text-neutral-900 sm:text-5xl lg:text-6xl">
                Explore the MIDC{" "}
                <span className="text-[#8f7852]">Ecosystem</span>
              </h2>
            </div>

            {/* Cards Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:gap-5">
              {ecosystemLinks.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Link href={item.link} className="group block">
                      <div className="relative overflow-hidden border border-neutral-200/50 bg-white/80 backdrop-blur-sm transition-all duration-500 hover:border-[#8f7852]/30 hover:bg-white hover:shadow-lg">
                        {/* Card Content */}
                        <div className="relative z-10 p-6 lg:p-8">
                          {/* Top Row */}
                          <div className="mb-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 items-center justify-center border border-[#8f7852]/30 bg-[#8f7852]/10 transition-all duration-500 group-hover:border-[#8f7852]/50 group-hover:bg-[#8f7852]/20">
                                <Icon
                                  className="h-4 w-4 text-[#8f7852]"
                                  strokeWidth={1.5}
                                />
                              </div>
                              <span className="font-Satoshi text-[10px] font-medium uppercase tracking-[0.15em] text-neutral-500">
                                {item.title}
                              </span>
                            </div>

                            {/* Arrow */}
                            <div className="flex h-10 w-10 items-center justify-center border border-[#8f7852]/20 bg-[#8f7852]/5 transition-all duration-500 group-hover:border-[#8f7852] group-hover:bg-[#8f7852]">
                              <ArrowUpRight
                                className="h-4 w-4 text-[#8f7852]/60 transition-all duration-500 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                                strokeWidth={2}
                              />
                            </div>
                          </div>

                          {/* Headline */}
                          <h3 className="mb-2 font-SchnyderS text-xl font-light text-neutral-900 transition-colors duration-300 group-hover:text-[#8f7852] lg:text-2xl">
                            {item.headline}
                          </h3>

                          {/* Description */}
                          <p className="font-Satoshi text-sm font-light leading-relaxed text-neutral-500">
                            {item.description}
                          </p>

                          {/* CTA */}
                          <div className="mt-4 flex items-center gap-2 border-t border-[#8f7852]/10 pt-4">
                            <span className="font-Satoshi text-xs font-medium text-[#8f7852]/70 transition-colors group-hover:text-[#8f7852]">
                              {item.cta}
                            </span>
                            <div className="h-px w-6 bg-[#8f7852]/30 transition-all duration-500 group-hover:w-10 group-hover:bg-[#8f7852]" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </motion.div>

        {/* ============================================ */}
        {/* CHAPTER 3: Press Logos (Trusted & Recognized) */}
        {/* ============================================ */}
        <motion.div
          className={`absolute inset-0 flex items-center justify-center z-10 ${activeChapter !== "press" ? "pointer-events-none" : ""}`}
          style={{ opacity: pressOpacity }}
        >
          <motion.div
            style={{ y: pressY }}
            className="mx-auto max-w-7xl px-6 lg:px-12 w-full"
          >
            {/* Header */}
            <div className="mb-12 text-center lg:mb-16">
              <div className="mb-4 flex items-center justify-center gap-4">
                <div className="h-px w-12 bg-gradient-to-r from-transparent to-neutral-300" />
                <span className="font-Satoshi text-[10px] font-light uppercase tracking-[0.4em] text-neutral-400">
                  As Seen In
                </span>
                <div className="h-px w-12 bg-gradient-to-l from-transparent to-neutral-300" />
              </div>
              <h2 className="font-SchnyderS text-4xl font-light tracking-tight text-neutral-950 sm:text-5xl lg:text-6xl">
                Trusted & <span className="text-[#8f7852]">Recognized</span>
              </h2>
            </div>

            {/* Press Logos Grid */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6 lg:gap-6">
              {pressLogos.map((press, index) => (
                <motion.div
                  key={press.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  className="group"
                >
                  <div className="flex h-20 items-center justify-center border border-neutral-200/50 bg-white/60 px-4 backdrop-blur-sm transition-all duration-500 hover:border-[#8f7852]/30 hover:bg-white hover:shadow-md lg:h-24">
                    <Image
                      src={press.logo}
                      alt={press.name}
                      width={120}
                      height={40}
                      className="h-8 w-auto object-contain opacity-40 grayscale transition-all duration-500 group-hover:opacity-100 group-hover:grayscale-0 lg:h-10"
                    />
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Bottom accent */}
            <div className="mt-12 flex items-center justify-center gap-4 lg:mt-16">
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#8f7852]/30" />
              <div className="h-2 w-2 rotate-45 bg-[#8f7852]/40" />
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#8f7852]/30" />
            </div>

            {/* CTA */}
            <div className="mt-8 text-center">
              <Link
                href="/contact"
                className="group inline-flex items-center gap-3 border border-[#8f7852] bg-[#8f7852] px-8 py-4 font-Satoshi text-xs font-medium uppercase tracking-[0.15em] text-neutral-950 transition-all duration-300 hover:bg-transparent hover:text-[#8f7852]"
              >
                <span>Start Your Project</span>
                <ArrowUpRight
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  strokeWidth={2}
                />
              </Link>
            </div>
          </motion.div>
        </motion.div>

        {/* Progress Indicator */}
        <div className="absolute bottom-8 left-1/2 z-30 -translate-x-1/2">
          <div className="flex items-center gap-3">
            {[0, 1, 2].map((index) => (
              <motion.div
                key={index}
                className="h-1 rounded-full bg-[#8f7852] transition-all duration-500"
                style={{
                  width: useTransform(
                    scrollYProgress,
                    [
                      index * 0.33,
                      index * 0.33 + 0.1,
                      (index + 1) * 0.33 - 0.1,
                      (index + 1) * 0.33,
                    ],
                    [8, 24, 24, 8],
                  ),
                  opacity: useTransform(
                    scrollYProgress,
                    [
                      index * 0.33,
                      index * 0.33 + 0.05,
                      (index + 1) * 0.33 - 0.05,
                      (index + 1) * 0.33,
                    ],
                    [0.3, 1, 1, 0.3],
                  ),
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
