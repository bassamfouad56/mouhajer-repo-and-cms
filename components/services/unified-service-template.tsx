"use client";

import { useRef, useState } from "react";
import {
  motion,
  useInView,
  useScroll,
  useTransform,
  useMotionValueEvent,
} from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { SafeImage } from "@/components/safe-image";
import { ArrowRight, ChevronDown, Award } from "lucide-react";
import { FAQSection } from "@/components/sections/faq";

// ============================================================================
// TYPES
// ============================================================================

interface Project {
  id: string;
  slug: string;
  title: string;
  titleAr?: string;
  excerpt?: string;
  client?: string;
  year?: number;
  location?: string;
  mainImage?: string | null;
  gallery?: string[];
}

interface Capability {
  title: string;
  subtitle: string;
  description: string;
  methodology: string;
  methodDesc: string;
}

interface CaseStudy {
  title: string;
  titleHighlight: string;
  client: string;
  scope: string;
  challenge?: string;
  outcome: string;
  stats?: { value: string; label: string }[];
  image?: string;
}

interface FAQ {
  question: string;
  answer: string;
}

interface CTAContent {
  label: string;
  title: string;
  titleHighlight: string;
  primaryButtonText: string;
  primaryButtonHref: string;
  secondaryButtonText: string;
  secondaryButtonHref: string;
}

interface HeroContent {
  label: string;
  title: string;
  titleHighlight: string;
  subtitle: string;
}

interface ImmersiveSectionContent {
  label: string;
  title: string;
  titleHighlight: string;
  subtitle: string;
  images: string[];
  capabilities: Capability[];
}

interface FAQSectionContent {
  label: string;
  title: string;
  titleHighlight: string;
  subtitle: string;
  faqs: FAQ[];
}

export interface UnifiedServiceTemplateProps {
  // Data from Sanity/Server
  projects?: Project[];
  heroImage?: string | null;
  caseStudyProject?: Project | null;

  // Content Configuration
  hero: HeroContent;
  immersiveSection: ImmersiveSectionContent;
  caseStudy: CaseStudy;
  faqSection: FAQSectionContent;
  cta: CTAContent;

  // Service Slug for navigation
  serviceSlug: string;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function UnifiedServiceTemplate({
  projects = [],
  heroImage,
  caseStudyProject,
  hero,
  immersiveSection,
  caseStudy,
  faqSection,
  cta,
  serviceSlug,
}: UnifiedServiceTemplateProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const isHeroInView = useInView(heroRef, { once: true });

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  return (
    <main className="relative bg-white">
      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative h-screen min-h-[700px] max-h-[1000px] overflow-hidden bg-neutral-950"
      >
        {/* Background Image */}
        <motion.div className="absolute inset-0" style={{ scale: heroScale }}>
          {heroImage ? (
            <Image
              src={heroImage}
              alt={hero.title}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-neutral-950 to-black" />
          )}
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/70 to-neutral-950/40" />
        </motion.div>

        {/* Hero Content */}
        <motion.div
          style={{ opacity: heroOpacity, y: heroY }}
          className="relative z-10 flex h-full flex-col items-center justify-center px-6 pt-24 lg:px-12"
        >
          <div className="mx-auto container text-center">
            {/* Subtitle */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mb-8 flex items-center justify-center gap-4"
            >
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#8f7852]" />
              <span className="font-Satoshi text-xs font-light uppercase tracking-[0.4em] text-[#8f7852]">
                {hero.label}
              </span>
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#8f7852]" />
            </motion.div>

            {/* Main Title */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, delay: 0.5 }}
              className="mb-8 font-SchnyderS text-5xl font-light leading-[1.1] tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl"
            >
              {hero.title}
              <br />
              <span className="text-[#8f7852]">{hero.titleHighlight}</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="mx-auto mb-12 max-w-3xl px-4 font-Satoshi text-lg font-light leading-relaxed text-white/80 sm:px-0 sm:text-xl"
            >
              {hero.subtitle}
            </motion.p>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isHeroInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center gap-2"
          >
            <span className="font-Satoshi text-[10px] font-light tracking-[0.2em] text-white/50">
              DISCOVER OUR CRAFT
            </span>
            <ChevronDown className="h-4 w-4 text-white/50" />
          </motion.div>
        </motion.div>
      </section>

      {/* Immersive Scroll-Driven Section with Integrated Case Study */}
      <ImmersiveSection
        content={immersiveSection}
        caseStudy={caseStudy}
        caseStudyProject={caseStudyProject}
      />

      {/* FAQ Section */}
      <FAQSection
        label={faqSection.label}
        title={faqSection.title}
        titleHighlight={faqSection.titleHighlight}
        subtitle={faqSection.subtitle}
        faqs={faqSection.faqs}
      />

      {/* CTA Section */}
      <CTASectionComponent content={cta} />
    </main>
  );
}

// ============================================================================
// IMMERSIVE SCROLL-DRIVEN SECTION WITH INTEGRATED CASE STUDY
// ============================================================================

interface ImmersiveSectionProps {
  content: ImmersiveSectionContent;
  caseStudy: CaseStudy;
  caseStudyProject?: Project | null;
}

function ImmersiveSection({
  content,
  caseStudy,
  caseStudyProject,
}: ImmersiveSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-50px" });
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [showCaseStudy, setShowCaseStudy] = useState<boolean>(false);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Total sections: capabilities + case study
  const totalSections = content.capabilities.length + 1;
  const caseStudyImage = caseStudyProject?.mainImage || caseStudy.image;

  // Combine all images: capability images + case study image
  const allImages = [...content.images];
  if (caseStudyImage && !allImages.includes(caseStudyImage)) {
    allImages.push(caseStudyImage);
  }

  // Scroll-driven animations
  const heroOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.15], [0, -100]);
  const capabilitiesOpacity = useTransform(
    scrollYProgress,
    [0.05, 0.15, 0.7, 0.8],
    [0, 1, 1, 0],
  );
  const capabilitiesY = useTransform(scrollYProgress, [0.05, 0.15], [100, 0]);
  const caseStudyOpacity = useTransform(scrollYProgress, [0.7, 0.85], [0, 1]);
  const caseStudyY = useTransform(scrollYProgress, [0.7, 0.85], [60, 0]);

  // Scroll-driven section switching
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const capabilityProgress = latest * totalSections;
    const capabilityIndex = Math.min(
      content.capabilities.length - 1,
      Math.floor(capabilityProgress),
    );
    setActiveIndex(capabilityIndex);
    setShowCaseStudy(latest > 0.75);
  });

  // Determine which background image to show
  const getActiveImageIndex = () => {
    if (showCaseStudy) {
      return allImages.length - 1; // Show case study image
    }
    return Math.min(activeIndex, content.images.length - 1);
  };

  return (
    <section
      ref={sectionRef}
      className="relative bg-neutral-950"
      style={{ height: "550vh" }}
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Multi-layer Background Images with Parallax */}
        <div className="absolute inset-0">
          {allImages.map((image, index) => (
            <motion.div
              key={index}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{
                opacity: getActiveImageIndex() === index ? 0.6 : 0,
                scale: getActiveImageIndex() === index ? 1 : 1.08,
              }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            >
              <SafeImage
                src={image}
                alt={`Background ${index + 1}`}
                fill
                className="object-cover"
                priority={index === 0}
              />
            </motion.div>
          ))}

          {/* Cinematic Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/50 to-neutral-950/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/70 via-transparent to-neutral-950/50" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-neutral-950" />

          {/* Subtle Vignette */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
        </div>

        {/* Film Grain */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.03]">
          <div className="h-full w-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iMC44IiBudW1PY3RhdmVzPSI0IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsdGVyPSJ1cmwoI2EpIi8+PC9zdmc+')] bg-repeat" />
        </div>

        {/* Corner Decorations */}
        <div className="pointer-events-none absolute left-6 top-8 z-30 hidden h-20 w-20 sm:block lg:left-12">
          <motion.div
            className="absolute left-0 top-0 w-px bg-[#8f7852]/50"
            initial={{ height: 0 }}
            animate={isInView ? { height: 48 } : {}}
            transition={{ duration: 1, delay: 0.5 }}
          />
          <motion.div
            className="absolute left-0 top-0 h-px bg-[#8f7852]/50"
            initial={{ width: 0 }}
            animate={isInView ? { width: 48 } : {}}
            transition={{ duration: 1, delay: 0.5 }}
          />
        </div>
        <div className="pointer-events-none absolute bottom-8 right-6 z-30 hidden h-20 w-20 sm:block lg:right-12">
          <motion.div
            className="absolute bottom-0 right-0 w-px bg-[#8f7852]/50"
            initial={{ height: 0 }}
            animate={isInView ? { height: 48 } : {}}
            transition={{ duration: 1, delay: 0.7 }}
          />
          <motion.div
            className="absolute bottom-0 right-0 h-px bg-[#8f7852]/50"
            initial={{ width: 0 }}
            animate={isInView ? { width: 48 } : {}}
            transition={{ duration: 1, delay: 0.7 }}
          />
        </div>

        {/* Main Content Container */}
        <div className="relative z-10 flex h-full flex-col justify-between px-6 py-16 lg:px-12 lg:py-24 xl:px-16">
          <div className="mx-auto w-full max-w-[1600px]">
            {/* Top Section: Hero Text with Staggered Animation */}
            <motion.div
              style={{ opacity: heroOpacity, y: heroY }}
              className="mb-auto"
            >
              {/* Label */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="mb-6 flex items-center gap-4"
              >
                <motion.div
                  className="h-px bg-gradient-to-r from-transparent to-[#8f7852]"
                  initial={{ width: 0 }}
                  animate={isInView ? { width: 64 } : {}}
                  transition={{ duration: 1, delay: 0.4 }}
                />
                <span className="font-Satoshi text-[10px] font-medium uppercase tracking-[0.4em] text-[#8f7852]">
                  {content.label}
                </span>
              </motion.div>

              {/* Animated Title - Word by Word */}
              <div className="overflow-hidden">
                <motion.h2
                  initial={{ y: 100 }}
                  animate={isInView ? { y: 0 } : {}}
                  transition={{
                    duration: 1,
                    ease: [0.22, 1, 0.36, 1],
                    delay: 0.3,
                  }}
                  className="font-SchnyderS text-5xl font-light leading-[0.95] tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl"
                >
                  {content.title}
                </motion.h2>
              </div>
              <div className="overflow-hidden">
                <motion.h2
                  initial={{ y: 100 }}
                  animate={isInView ? { y: 0 } : {}}
                  transition={{
                    duration: 1,
                    ease: [0.22, 1, 0.36, 1],
                    delay: 0.5,
                  }}
                  className="font-SchnyderS text-5xl font-light leading-[0.95] tracking-tight text-[#8f7852] sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl"
                >
                  {content.titleHighlight}
                </motion.h2>
              </div>

              {/* Subtitle with fade-in */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="mt-8 max-w-xl font-Satoshi text-lg font-light leading-relaxed text-white/60 lg:text-xl"
              >
                {content.subtitle}
              </motion.p>
            </motion.div>
          </div>

          {/* Bottom Section: Capabilities Content (fades out before case study) */}
          <motion.div
            style={{ opacity: capabilitiesOpacity, y: capabilitiesY }}
            className="mx-auto w-full max-w-[1600px]"
          >
            {/* Capability Navigation */}
            <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
              {/* Left: Active Capability Detail */}
              <div className="lg:col-span-5">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 30 }}
                  transition={{ duration: 0.6 }}
                >
                  <span className="mb-2 block font-Satoshi text-[10px] font-medium uppercase tracking-[0.3em] text-[#8f7852]">
                    {content.capabilities[activeIndex]?.subtitle}
                  </span>
                  <h3 className="mb-4 font-SchnyderS text-3xl font-light text-white lg:text-4xl xl:text-5xl">
                    {content.capabilities[activeIndex]?.title}
                  </h3>
                  <p className="mb-6 font-Satoshi text-base font-light leading-relaxed text-white/60 lg:text-lg">
                    {content.capabilities[activeIndex]?.description}
                  </p>

                  {/* Method Tag */}
                  <div className="inline-flex items-center gap-3 border border-[#8f7852]/30 bg-[#8f7852]/5 px-4 py-3">
                    <span className="font-Satoshi text-xs font-medium uppercase tracking-wider text-[#8f7852]">
                      {content.capabilities[activeIndex]?.methodology}
                    </span>
                    <span className="font-Satoshi text-xs font-light text-white/50">
                      {content.capabilities[activeIndex]?.methodDesc}
                    </span>
                  </div>
                </motion.div>
              </div>

              {/* Right: Capability Selector Cards */}
              <div className="lg:col-span-7">
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  {content.capabilities.map((cap, index) => (
                    <motion.button
                      key={index}
                      onClick={() => setActiveIndex(index)}
                      initial={{ opacity: 0, y: 30 }}
                      animate={isInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                      className={`group relative overflow-hidden border p-4 text-left transition-all duration-500 sm:p-5 lg:p-6 ${
                        activeIndex === index
                          ? "border-[#8f7852]/60 bg-white/10"
                          : "border-white/10 bg-white/5 hover:border-[#8f7852]/30 hover:bg-white/8"
                      }`}
                    >
                      {/* Active indicator bar */}
                      <motion.div
                        className="absolute bottom-0 left-0 h-0.5 bg-[#8f7852]"
                        initial={{ width: "0%" }}
                        animate={{
                          width: activeIndex === index ? "100%" : "0%",
                        }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                      />

                      {/* Corner accent */}
                      <div
                        className={`absolute left-0 top-0 h-6 w-px transition-all duration-300 ${
                          activeIndex === index
                            ? "bg-[#8f7852]"
                            : "bg-[#8f7852]/30"
                        }`}
                      />
                      <div
                        className={`absolute left-0 top-0 h-px w-6 transition-all duration-300 ${
                          activeIndex === index
                            ? "bg-[#8f7852]"
                            : "bg-[#8f7852]/30"
                        }`}
                      />

                      <span
                        className={`mb-1 block font-Satoshi text-[9px] font-medium uppercase tracking-[0.2em] transition-colors sm:text-[10px] ${
                          activeIndex === index
                            ? "text-[#8f7852]"
                            : "text-[#8f7852]/50"
                        }`}
                      >
                        {cap.subtitle}
                      </span>
                      <span
                        className={`block font-SchnyderS text-lg font-light transition-colors sm:text-xl lg:text-2xl ${
                          activeIndex === index
                            ? "text-white"
                            : "text-white/70 group-hover:text-white"
                        }`}
                      >
                        {cap.title}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Case Study Content (fades in at the end) */}
          <motion.div
            style={{ opacity: caseStudyOpacity, y: caseStudyY }}
            className="absolute inset-x-0 bottom-0 px-6 pb-16 lg:px-12 lg:pb-24 xl:px-16"
          >
            <div className="mx-auto max-w-[1600px]">
              <div className="max-w-3xl">
                {/* Case Study Label */}
                <div className="mb-6 flex items-center gap-4">
                  <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#8f7852]" />
                  <span className="font-Satoshi text-[10px] font-medium uppercase tracking-[0.4em] text-[#8f7852]">
                    Case Study
                  </span>
                </div>

                {/* Case Study Title */}
                <h2 className="mb-6 font-SchnyderS text-4xl font-light leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl xl:text-7xl">
                  {caseStudy.title}
                  <br />
                  <span className="text-[#8f7852]">
                    {caseStudy.titleHighlight}
                  </span>
                </h2>

                {/* Case Study Details */}
                <div className="space-y-3">
                  <p className="font-Satoshi text-lg font-medium text-white lg:text-xl">
                    Client: {caseStudy.client}
                  </p>
                  <p className="font-Satoshi text-base font-light text-white/80 lg:text-lg">
                    Scope: {caseStudy.scope}
                  </p>
                  {caseStudy.challenge && (
                    <p className="font-Satoshi text-base font-light text-white/60 lg:text-lg">
                      Challenge: {caseStudy.challenge}
                    </p>
                  )}
                  <p className="max-w-2xl font-Satoshi text-base font-light leading-relaxed text-white/60 lg:text-lg">
                    Outcome: {caseStudy.outcome}
                  </p>
                </div>

                {/* View Projects Link */}
                <div className="mt-8">
                  <Link
                    href="/projects"
                    className="group inline-flex items-center gap-4"
                  >
                    <span className="font-Satoshi text-sm font-light tracking-wide text-white/70 transition-colors group-hover:text-[#8f7852]">
                      View All Projects
                    </span>
                    <div className="flex h-12 w-12 items-center justify-center border border-white/20 transition-all duration-300 group-hover:border-[#8f7852] group-hover:bg-[#8f7852]">
                      <ArrowRight
                        className="h-5 w-5 text-white transition-colors group-hover:text-neutral-950"
                        strokeWidth={1.5}
                      />
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Scroll Progress Indicator */}
          <motion.div
            className="absolute bottom-8 left-1/2 z-20 hidden -translate-x-1/2 lg:block"
            style={{
              opacity: useTransform(
                scrollYProgress,
                [0, 0.05, 0.9, 1],
                [1, 1, 1, 0],
              ),
            }}
          >
            <div className="flex flex-col items-center gap-2">
              <span className="font-Satoshi text-[9px] font-light uppercase tracking-[0.3em] text-white/30">
                {showCaseStudy ? "Case Study" : "Scroll to Explore"}
              </span>
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="h-10 w-px bg-gradient-to-b from-[#8f7852]/50 to-transparent"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// CTA SECTION
// ============================================================================

function CTASectionComponent({ content }: { content: CTAContent }) {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true });

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-neutral-950 py-32 lg:py-40"
    >
      <div className="absolute left-0 top-0 h-[400px] w-[400px] rounded-full bg-[#8f7852]/10 blur-[120px]" />
      <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-[#8f7852]/10 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-[1200px] px-6 text-center lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <div className="mb-8 flex items-center justify-center gap-4">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#8f7852]" />
            <span className="font-Satoshi text-[10px] font-medium uppercase tracking-[0.3em] text-[#8f7852]">
              {content.label}
            </span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#8f7852]" />
          </div>

          <h2 className="mb-8 font-SchnyderS text-5xl font-light leading-tight tracking-tight text-white sm:text-6xl lg:text-7xl">
            {content.title}
            <br />
            <span className="text-[#8f7852]">{content.titleHighlight}</span>
          </h2>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href={content.primaryButtonHref}
              className="group inline-flex items-center gap-3 border border-[#8f7852] bg-[#8f7852] px-10 py-5 font-Satoshi text-sm font-light tracking-widest text-neutral-950 transition-all hover:bg-transparent hover:text-[#8f7852]"
            >
              <span>{content.primaryButtonText}</span>
              <ArrowRight
                size={18}
                className="transition-transform group-hover:translate-x-2"
              />
            </Link>
            <Link
              href={content.secondaryButtonHref}
              className="group inline-flex items-center gap-3 border border-white/30 px-10 py-5 font-Satoshi text-sm font-light tracking-widest text-white transition-all hover:border-[#8f7852] hover:text-[#8f7852]"
            >
              <span>{content.secondaryButtonText}</span>
              <ArrowRight
                size={18}
                className="transition-transform group-hover:translate-x-2"
              />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
