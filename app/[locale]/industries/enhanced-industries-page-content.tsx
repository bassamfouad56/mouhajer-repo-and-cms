"use client";

import { useRef, useState } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { urlForImage } from "@/sanity/lib/image";
import { ArrowRight, ChevronDown } from "lucide-react";

// Helper to extract localized string
function getLocalizedString(
  value: string | { ar?: string; en?: string } | undefined,
  locale: string = "en",
): string {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (typeof value === "object" && value !== null) {
    return value[locale as keyof typeof value] || value.en || value.ar || "";
  }
  return "";
}

// Helper to get safe image URL from Sanity
function getSafeImageUrl(
  image: any,
  width: number,
  height: number,
): string | null {
  if (!image || !image.asset) return null;
  try {
    const builder = urlForImage(image);
    if (!builder) return null;
    const url = builder.width(width).height(height).quality(85).url();
    return url || null;
  } catch {
    return null;
  }
}

// Industry-specific fallback images mapped by slug
const INDUSTRY_FALLBACK_IMAGES: Record<
  string,
  { main: string; secondary: string; accent: string }
> = {
  "luxury-hospitality": {
    main: "/website%202.0%20content/services/industries/luxury%20hospitality/_MID3940-HDR.jpg",
    secondary: "/website%202.0%20content/projects/hospitality/_DSC3629-HDR.jpg",
    accent: "/services/industries/luxury%20hospitality/_MID3940-HDR.jpg",
  },
  "high-end-residential": {
    main: "/website%202.0%20content/services/industries/highend%20residential/_MID0001-HDR-2.jpg",
    secondary: "/website%202.0%20content/projects/residential/_MID0031-HDR.jpg",
    accent: "/services/industries/highend%20residential/_MID0001-HDR-2.jpg",
  },
  "commercial-corporate": {
    main: "/website%202.0%20content/services/industries/commercial%20and%20corporate/_MID1004-HDR.jpg",
    secondary: "/website%202.0%20content/projects/commercial/_MID7383-HDR.jpg",
    accent:
      "/services/industries/commercial%20and%20corporate/_MID1004-HDR.jpg",
  },
};

// Default fallback for unknown industries
const DEFAULT_INDUSTRY_IMAGE =
  "/website%202.0%20content/services/industries/luxury%20hospitality/_MID3940-HDR.jpg";

// Helper to get industry images based on slug
function getIndustryImages(industry: SanityIndustry): {
  main: string;
  secondary: string;
  accent: string;
} {
  const slug = industry.slug?.current || "";
  const sanityMainUrl = getSafeImageUrl(industry.mainImage, 1920, 1080);

  // Check if we have a fallback mapping for this slug
  const fallback = INDUSTRY_FALLBACK_IMAGES[slug] || {
    main: DEFAULT_INDUSTRY_IMAGE,
    secondary: DEFAULT_INDUSTRY_IMAGE,
    accent: DEFAULT_INDUSTRY_IMAGE,
  };

  return {
    main: sanityMainUrl || fallback.main,
    secondary: fallback.secondary,
    accent: fallback.accent,
  };
}

interface SanityIndustry {
  _id: string;
  title: string | { ar?: string; en?: string };
  slug: { current: string };
  excerpt?: string | { ar?: string; en?: string };
  mainImage?: any;
  icon?: string;
  featured?: boolean;
  order?: number;
}

interface IndustriesPageContentProps {
  industries: SanityIndustry[];
  services: any[];
}

// Immersive Scroll-Driven Industries Section with Dynamic Gallery
function ImmersiveIndustriesSection({
  industries,
}: {
  industries: SanityIndustry[];
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Calculate which industry is active based on scroll
  const numIndustries = industries.length;
  const segmentSize = 1 / numIndustries;

  // Update active index based on scroll progress
  scrollYProgress.on("change", (latest) => {
    const newIndex = Math.min(
      Math.floor(latest / segmentSize),
      numIndustries - 1,
    );
    if (newIndex !== activeIndex && newIndex >= 0) {
      setActiveIndex(newIndex);
    }
  });

  // Get images for the active industry
  const activeIndustry = industries[activeIndex];
  const activeImages = getIndustryImages(activeIndustry);

  return (
    <section
      ref={sectionRef}
      className="relative bg-neutral-950"
      style={{ height: `${numIndustries * 100}vh` }}
    >
      {/* Fixed Background Image Container */}
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Background Images - Crossfade using unique images per industry */}
        {industries.map((industry, index) => {
          const images = getIndustryImages(industry);
          return (
            <motion.div
              key={industry._id}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: index === activeIndex ? 1 : 0 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            >
              <Image
                src={images.main}
                alt={getLocalizedString(industry.title)}
                fill
                className="object-cover"
                sizes="100vw"
                priority={index === 0}
              />
            </motion.div>
          );
        })}

        {/* Cinematic Overlays */}
        <div className="absolute inset-0 bg-neutral-950/60" />
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/90 via-neutral-950/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-neutral-950/40" />

        {/* Gold ambient glow */}
        <motion.div
          className="absolute left-1/4 top-1/2 h-[600px] w-[600px] -translate-y-1/2 rounded-full bg-[#8f7852]/[0.08] blur-[200px]"
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Content Container */}
        <div className="relative z-10 flex h-full items-center">
          <div className="mx-auto w-full max-w-[1600px] px-6 lg:px-16">
            <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
              {/* Left Side - Text Content */}
              <div className="flex flex-col justify-center lg:col-span-4">
                {/* Label */}
                <motion.div
                  key={`label-${activeIndex}`}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  className="mb-6 flex items-center gap-4"
                >
                  <div className="h-px w-12 bg-[#8f7852]" />
                  <span className="font-Satoshi text-[10px] font-medium uppercase tracking-[0.4em] text-[#8f7852]">
                    Our Expertise
                  </span>
                </motion.div>

                {/* Title with Cinematic Animation */}
                <div className="mb-6 overflow-hidden">
                  <motion.h2
                    key={`title-${activeIndex}`}
                    initial={{ opacity: 0, y: 80, rotateX: -20 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                    exit={{ opacity: 0, y: -50 }}
                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                    className="font-SchnyderS text-4xl font-light leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl"
                  >
                    {getLocalizedString(industries[activeIndex]?.title)}
                  </motion.h2>
                </div>

                {/* Animated Divider */}
                <motion.div
                  key={`divider-${activeIndex}`}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="mb-6 h-px w-20 origin-left bg-gradient-to-r from-[#8f7852] to-transparent"
                />

                {/* Description with Fade Animation */}
                <motion.p
                  key={`desc-${activeIndex}`}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.8,
                    delay: 0.2,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="mb-10 max-w-md font-Satoshi text-base font-light leading-relaxed text-white/70 lg:text-lg"
                >
                  {getLocalizedString(industries[activeIndex]?.excerpt)}
                </motion.p>

                {/* CTA Button */}
                <motion.div
                  key={`cta-${activeIndex}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <Link
                    href={`/industries/${industries[activeIndex]?.slug?.current}`}
                    className="group inline-flex items-center gap-4 border border-[#8f7852]/50 bg-[#8f7852]/10 px-8 py-4 font-Satoshi text-xs uppercase tracking-[0.2em] text-[#8f7852] backdrop-blur-sm transition-all duration-500 hover:border-[#8f7852] hover:bg-[#8f7852] hover:text-neutral-950"
                  >
                    Explore This Sector
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-2" />
                  </Link>
                </motion.div>

                {/* Progress Dots - Below CTA on desktop */}
                <div className="mt-12 hidden lg:flex items-center gap-3">
                  {industries.map((industry, index) => {
                    const isActive = index === activeIndex;
                    return (
                      <div
                        key={industry._id}
                        className={`h-1.5 rounded-full transition-all duration-500 ${
                          isActive ? "w-10 bg-[#8f7852]" : "w-3 bg-white/20"
                        }`}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Center - Dynamic Image Gallery */}
              <div className="hidden lg:flex lg:col-span-5 items-center justify-center">
                <div className="relative w-full h-[70vh] max-h-[700px]">
                  {/* Main Feature Image - Large */}
                  <motion.div
                    key={`main-image-${activeIndex}`}
                    initial={{ opacity: 0, scale: 0.9, x: -40 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute top-0 left-0 w-[65%] h-[75%] overflow-hidden"
                  >
                    {/* Gold border frame */}
                    <div className="absolute inset-0 border border-[#8f7852]/30 z-10" />

                    <Image
                      src={activeImages.main}
                      alt={getLocalizedString(industries[activeIndex]?.title)}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 40vw"
                    />

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/50 via-transparent to-neutral-950/10" />

                    {/* Corner accents */}
                    <div className="absolute top-4 left-4 h-8 w-8 border-l border-t border-[#8f7852]/50" />
                    <div className="absolute bottom-4 right-4 h-8 w-8 border-r border-b border-[#8f7852]/50" />
                  </motion.div>

                  {/* Secondary Image - Medium, overlapping */}
                  <motion.div
                    key={`secondary-image-${activeIndex}`}
                    initial={{ opacity: 0, scale: 0.85, y: 60, x: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
                    transition={{
                      duration: 0.9,
                      delay: 0.2,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="absolute bottom-0 right-0 w-[55%] h-[55%] overflow-hidden shadow-2xl"
                  >
                    {/* Gold border frame */}
                    <div className="absolute inset-0 border-2 border-[#8f7852]/40 z-10" />

                    <Image
                      src={activeImages.secondary}
                      alt={`${getLocalizedString(industries[activeIndex]?.title)} - Detail`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 30vw"
                    />

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-neutral-950/30 via-transparent to-neutral-950/50" />

                    {/* Industry label overlay */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.5 }}
                      className="absolute bottom-4 left-4 right-4 z-20"
                    >
                      <div className="font-Satoshi text-[10px] uppercase tracking-[0.25em] text-[#8f7852]">
                        Featured Work
                      </div>
                    </motion.div>
                  </motion.div>

                  {/* Floating accent image - small */}
                  <motion.div
                    key={`accent-image-${activeIndex}`}
                    initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{
                      duration: 0.7,
                      delay: 0.4,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="absolute top-[60%] left-[55%] w-28 h-28 overflow-hidden border-2 border-[#8f7852]/50 bg-neutral-950/90 backdrop-blur-sm shadow-xl z-10"
                  >
                    {/* Show next industry's image as preview */}
                    {industries[(activeIndex + 1) % industries.length] && (
                      <>
                        <Image
                          src={
                            getIndustryImages(
                              industries[(activeIndex + 1) % industries.length],
                            ).main
                          }
                          alt="Next sector preview"
                          fill
                          className="object-cover opacity-70"
                        />
                        <div className="absolute inset-0 bg-neutral-950/30" />
                        <motion.div
                          className="absolute inset-0 flex items-center justify-center"
                          whileHover={{ scale: 1.1 }}
                        >
                          <ArrowRight className="h-5 w-5 text-[#8f7852]" />
                        </motion.div>
                      </>
                    )}
                  </motion.div>

                  {/* Decorative frame element */}
                  <div className="absolute -top-4 -left-4 h-20 w-20 border-l-2 border-t-2 border-[#8f7852]/20" />
                  <div className="absolute -bottom-4 -right-4 h-20 w-20 border-r-2 border-b-2 border-[#8f7852]/20" />
                </div>
              </div>

              {/* Right Side - Industry List */}
              <div className="hidden lg:flex flex-col justify-center items-end lg:col-span-3">
                <div className="space-y-4">
                  {industries.map((industry, index) => {
                    const isActive = index === activeIndex;
                    const title = getLocalizedString(industry.title);

                    return (
                      <motion.div
                        key={industry._id}
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        className={`flex items-center gap-4 transition-all duration-500 cursor-pointer ${
                          isActive
                            ? "opacity-100"
                            : "opacity-30 hover:opacity-60"
                        }`}
                      >
                        <span
                          className={`font-Satoshi text-sm font-light text-right transition-colors duration-300 ${
                            isActive ? "text-white" : "text-white/50"
                          }`}
                        >
                          {title}
                        </span>
                        <div
                          className={`h-px transition-all duration-500 ${
                            isActive ? "w-12 bg-[#8f7852]" : "w-6 bg-white/20"
                          }`}
                        />
                      </motion.div>
                    );
                  })}
                </div>

                {/* Scroll Progress */}
                <div className="mt-12 flex flex-col items-end gap-2">
                  <div className="h-24 w-px overflow-hidden bg-white/10">
                    <motion.div
                      className="w-full bg-[#8f7852]"
                      style={{
                        height: useTransform(
                          scrollYProgress,
                          [0, 1],
                          ["0%", "100%"],
                        ),
                      }}
                    />
                  </div>
                  <span className="font-Satoshi text-[9px] uppercase tracking-[0.2em] text-white/40">
                    Scroll
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Corner Accents */}
        <div className="pointer-events-none absolute left-8 top-24 h-20 w-20 border-l border-t border-[#8f7852]/20 lg:left-16" />
        <div className="pointer-events-none absolute bottom-24 right-8 h-20 w-20 border-b border-r border-[#8f7852]/20 lg:right-16" />

        {/* Mobile Progress Dots */}
        <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 gap-3 lg:hidden">
          {industries.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all duration-500 ${
                index === activeIndex ? "w-8 bg-[#8f7852]" : "w-2 bg-white/30"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function EnhancedIndustriesPageContent({
  industries,
}: IndustriesPageContentProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const isHeroInView = useInView(heroRef, { once: true });

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  // Get featured industry image for hero background with fallback
  const featuredIndustry = industries.find((i) => i.featured) || industries[0];
  const heroImages = featuredIndustry
    ? getIndustryImages(featuredIndustry)
    : null;
  const heroImageUrl = heroImages?.main || DEFAULT_INDUSTRY_IMAGE;

  return (
    <main className="relative bg-[#faf8f5]">
      {/* Hero Section - Cinematic Full Screen with Background Image (matching Services page) */}
      <section
        ref={heroRef}
        className="relative h-screen min-h-[800px] overflow-hidden bg-[#faf8f5]"
      >
        {/* Background Image with Parallax */}
        <motion.div style={{ scale: heroScale }} className="absolute inset-0">
          <Image
            src={heroImageUrl}
            alt="Industries we serve"
            fill
            className="object-cover"
            sizes="100vw"
            priority
            quality={90}
          />
        </motion.div>

        {/* Cinematic Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#faf8f5]/85 via-[#faf8f5]/70 to-[#faf8f5]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#faf8f5]/50 via-transparent to-[#faf8f5]/50" />

        {/* Dark top gradient for header visibility */}
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-neutral-950/70 via-neutral-950/30 to-transparent" />

        {/* Gold Accent Glow */}
        <div className="pointer-events-none absolute left-1/4 top-1/3 h-[600px] w-[600px] rounded-full bg-[#8f7852]/[0.06] blur-[150px]" />

        {/* Top Border Accent */}
        <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-[#8f7852]/30 to-transparent" />

        {/* Hero Content */}
        <motion.div
          style={{ opacity: heroOpacity }}
          className="relative z-10 flex h-full flex-col items-center justify-center px-6 pt-20"
        >
          <div className="mx-auto max-w-6xl text-center">
            {/* Minimal Label */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-12 flex items-center justify-center gap-4"
            >
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#8f7852]/50" />
              <span className="font-Satoshi text-[10px] font-light uppercase tracking-[0.4em] text-neutral-500">
                Industries
              </span>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#8f7852]/50" />
            </motion.div>

            {/* Main Title */}
            <div className="mb-6 overflow-hidden">
              <motion.h1
                initial={{ opacity: 0, y: 60 }}
                animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 1.2,
                  delay: 0.3,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="font-SchnyderS text-6xl font-light leading-[1.05] tracking-tight text-neutral-900 sm:text-7xl md:text-8xl lg:text-9xl"
              >
                Industries
              </motion.h1>
            </div>

            <div className="mb-12 overflow-hidden">
              <motion.h1
                initial={{ opacity: 0, y: 60 }}
                animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 1.2,
                  delay: 0.5,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="font-SchnyderS text-6xl font-light leading-[1.05] tracking-tight text-[#8f7852] sm:text-7xl md:text-8xl lg:text-9xl"
              >
                We Transform
              </motion.h1>
            </div>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="mx-auto mb-12 max-w-3xl px-4 font-Satoshi text-xl font-light leading-relaxed text-neutral-600 sm:px-0 sm:text-2xl"
            >
              Specialized expertise across sectors. From luxury hospitality to
              high-end residential.
            </motion.p>

            {/* Stats Row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="flex items-center justify-center gap-8 sm:gap-16"
            >
              {[
                { number: `${industries.length}+`, label: "Industries" },
                { number: "400+", label: "Projects" },
                { number: "24", label: "Years" },
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="font-SchnyderS text-4xl font-light text-neutral-900 sm:text-5xl">
                    {stat.number}
                  </div>
                  <div className="mt-1 font-Satoshi text-[10px] font-light uppercase tracking-[0.2em] text-neutral-500">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* Minimal Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isHeroInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="absolute bottom-12 left-1/2 z-10 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center gap-3"
          >
            <span className="font-Satoshi text-[9px] font-light uppercase tracking-[0.3em] text-neutral-500">
              Scroll
            </span>
            <ChevronDown className="h-4 w-4 text-neutral-500" />
          </motion.div>
        </motion.div>

        {/* Bottom Border Accent */}
        <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-[#8f7852]/20 to-transparent" />
      </section>

      {/* Immersive Scroll-Driven Industries */}
      <ImmersiveIndustriesSection industries={industries} />

      {/* CTA Section */}
      <section className="relative overflow-hidden bg-neutral-950 px-6 py-24 lg:px-12 lg:py-32">
        <div className="relative mx-auto max-w-3xl text-center">
          <h2 className="mb-6 font-SchnyderS text-4xl font-light tracking-tight text-white lg:text-5xl">
            Your Industry, Our Expertise
          </h2>
          <p className="mb-10 font-Satoshi text-lg font-light text-neutral-400">
            Discuss your project with our team
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-3 border border-[#8f7852] bg-[#8f7852] px-10 py-4 font-Satoshi text-xs uppercase tracking-[0.2em] text-neutral-950 transition-all duration-300 hover:bg-transparent hover:text-[#8f7852]"
          >
            Start a Conversation
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
