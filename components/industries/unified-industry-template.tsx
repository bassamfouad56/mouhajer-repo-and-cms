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
import { getPartnersByCategory } from "@/lib/partner-logos";

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

interface Client {
  id: string;
  name: string;
  logo?: string | null;
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
  certificatePath?: string;
  awardTitle?: string;
  awardRegion?: string;
  awardYear?: string;
  image?: string;
}

interface AwardCertificate {
  title: string;
  region: string;
  project: string;
  year: string;
  certificate: string;
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

interface PartnersContent {
  title: string;
  titleHighlight: string;
  partnerCategory: "hospitality" | "corporate" | "luxury" | "developer";
  awards?: AwardCertificate[];
  showLocations?: boolean;
  locations?: string[];
}

interface FAQSectionContent {
  label: string;
  title: string;
  titleHighlight: string;
  subtitle: string;
  faqs: FAQ[];
}

export interface UnifiedIndustryTemplateProps {
  // Data from Sanity/Server
  projects?: Project[];
  clients?: Client[];
  heroImage?: string | null;
  caseStudyProject?: Project | null;

  // Content Configuration
  hero: HeroContent;
  immersiveSection: ImmersiveSectionContent;
  caseStudy: CaseStudy;
  partners: PartnersContent;
  faqSection: FAQSectionContent;
  cta: CTAContent;

  // Industry Slug for filtering projects
  industrySlug: string;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function UnifiedIndustryTemplate({
  projects = [],
  clients = [],
  heroImage,
  caseStudyProject,
  hero,
  immersiveSection,
  caseStudy,
  partners,
  faqSection,
  cta,
  industrySlug,
}: UnifiedIndustryTemplateProps) {
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
              DISCOVER OUR EXPERTISE
            </span>
            <ChevronDown className="h-4 w-4 text-white/50" />
          </motion.div>
        </motion.div>
      </section>

      {/* Immersive Scroll-Driven Section */}
      <ImmersiveSection content={immersiveSection} />

      {/* Case Study Section */}
      <CaseStudySectionComponent
        caseStudy={caseStudy}
        project={caseStudyProject}
      />

      {/* Partners & Awards Section */}
      <PartnersSectionComponent content={partners} clients={clients} />

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
// IMMERSIVE SCROLL-DRIVEN SECTION
// ============================================================================

function ImmersiveSection({ content }: { content: ImmersiveSectionContent }) {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-50px" });
  const [activeCapability, setActiveCapability] = useState<number>(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Scroll-driven animations
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, -100]);
  const contentOpacity = useTransform(scrollYProgress, [0.1, 0.25], [0, 1]);
  const contentY = useTransform(scrollYProgress, [0.1, 0.25], [100, 0]);

  // Scroll-driven capability switching
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const index = Math.min(
      content.capabilities.length - 1,
      Math.floor(latest * content.capabilities.length),
    );
    setActiveCapability(index);
  });

  return (
    <section
      ref={sectionRef}
      className="relative bg-neutral-950"
      style={{ height: "400vh" }}
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Multi-layer Background Images with Parallax */}
        <div className="absolute inset-0">
          {content.images.map((image, index) => (
            <motion.div
              key={index}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{
                opacity:
                  activeCapability === index ||
                  (index === content.images.length - 1 &&
                    activeCapability >= content.images.length - 1)
                    ? 0.5
                    : 0,
                scale: activeCapability === index ? 1 : 1.05,
              }}
              transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
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
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-neutral-950/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/60 via-transparent to-neutral-950/40" />
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

          {/* Bottom Section: Capabilities with Image Gallery */}
          <motion.div
            style={{ opacity: contentOpacity, y: contentY }}
            className="mx-auto w-full max-w-[1600px]"
          >
            {/* Capability Navigation */}
            <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
              {/* Left: Active Capability Detail */}
              <div className="lg:col-span-5">
                <motion.div
                  key={activeCapability}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 30 }}
                  transition={{ duration: 0.6 }}
                >
                  <span className="mb-2 block font-Satoshi text-[10px] font-medium uppercase tracking-[0.3em] text-[#8f7852]">
                    {content.capabilities[activeCapability]?.subtitle}
                  </span>
                  <h3 className="mb-4 font-SchnyderS text-3xl font-light text-white lg:text-4xl xl:text-5xl">
                    {content.capabilities[activeCapability]?.title}
                  </h3>
                  <p className="mb-6 font-Satoshi text-base font-light leading-relaxed text-white/60 lg:text-lg">
                    {content.capabilities[activeCapability]?.description}
                  </p>

                  {/* Method Tag */}
                  <div className="inline-flex items-center gap-3 border border-[#8f7852]/30 bg-[#8f7852]/5 px-4 py-3">
                    <span className="font-Satoshi text-xs font-medium uppercase tracking-wider text-[#8f7852]">
                      {content.capabilities[activeCapability]?.methodology}
                    </span>
                    <span className="font-Satoshi text-xs font-light text-white/50">
                      {content.capabilities[activeCapability]?.methodDesc}
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
                      onClick={() => setActiveCapability(index)}
                      initial={{ opacity: 0, y: 30 }}
                      animate={isInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                      className={`group relative overflow-hidden border p-4 text-left transition-all duration-500 sm:p-5 lg:p-6 ${
                        activeCapability === index
                          ? "border-[#8f7852]/60 bg-white/10"
                          : "border-white/10 bg-white/5 hover:border-[#8f7852]/30 hover:bg-white/8"
                      }`}
                    >
                      {/* Active indicator bar */}
                      <motion.div
                        className="absolute bottom-0 left-0 h-0.5 bg-[#8f7852]"
                        initial={{ width: "0%" }}
                        animate={{
                          width: activeCapability === index ? "100%" : "0%",
                        }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                      />

                      {/* Corner accent */}
                      <div
                        className={`absolute left-0 top-0 h-6 w-px transition-all duration-300 ${
                          activeCapability === index
                            ? "bg-[#8f7852]"
                            : "bg-[#8f7852]/30"
                        }`}
                      />
                      <div
                        className={`absolute left-0 top-0 h-px w-6 transition-all duration-300 ${
                          activeCapability === index
                            ? "bg-[#8f7852]"
                            : "bg-[#8f7852]/30"
                        }`}
                      />

                      <span
                        className={`mb-1 block font-Satoshi text-[9px] font-medium uppercase tracking-[0.2em] transition-colors sm:text-[10px] ${
                          activeCapability === index
                            ? "text-[#8f7852]"
                            : "text-[#8f7852]/50"
                        }`}
                      >
                        {cap.subtitle}
                      </span>
                      <span
                        className={`block font-SchnyderS text-lg font-light transition-colors sm:text-xl lg:text-2xl ${
                          activeCapability === index
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

          {/* Scroll Indicator */}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// CASE STUDY SECTION
// ============================================================================

function CaseStudySectionComponent({
  caseStudy,
  project,
}: {
  caseStudy: CaseStudy;
  project?: Project | null;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Scroll-driven reveal animations
  const imageScale = useTransform(scrollYProgress, [0, 0.3], [1.1, 1]);
  const imageOpacity = useTransform(scrollYProgress, [0, 0.2], [0.3, 1]);
  const contentY = useTransform(scrollYProgress, [0.1, 0.4], [100, 0]);
  const contentOpacity = useTransform(scrollYProgress, [0.1, 0.35], [0, 1]);
  const labelX = useTransform(scrollYProgress, [0.15, 0.4], [-30, 0]);
  const titleY = useTransform(scrollYProgress, [0.2, 0.45], [60, 0]);
  const detailsY = useTransform(scrollYProgress, [0.25, 0.5], [40, 0]);
  const detailsOpacity = useTransform(scrollYProgress, [0.25, 0.45], [0, 1]);
  const certificateOpacity = useTransform(scrollYProgress, [0.2, 0.4], [0, 1]);
  const certificateScale = useTransform(scrollYProgress, [0.2, 0.4], [0.9, 1]);

  const backgroundImage = project?.mainImage || caseStudy.image;

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-neutral-950"
    >
      {/* Full-width Image Section with Scroll-Driven Reveal */}
      <div className="relative h-[80vh] min-h-[600px] lg:h-[90vh] lg:min-h-[700px]">
        {/* Background Image with Parallax Scale */}
        <motion.div
          className="absolute inset-0"
          style={{ scale: imageScale, opacity: imageOpacity }}
        >
          {backgroundImage ? (
            <SafeImage
              src={backgroundImage}
              alt={caseStudy.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-neutral-800" />
          )}
        </motion.div>

        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-neutral-950/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/80 via-transparent to-neutral-950/60" />

        {/* Film Grain Overlay */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.02]">
          <div className="h-full w-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iMC44IiBudW1PY3RhdmVzPSI0IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsdGVyPSJ1cmwoI2EpIi8+PC9zdmc+')] bg-repeat" />
        </div>

        {/* Animated Corner Decorations */}
        <motion.div
          className="pointer-events-none absolute left-6 top-8 z-30 hidden h-16 w-16 sm:block lg:left-12"
          style={{ opacity: contentOpacity }}
        >
          <motion.div
            className="absolute left-0 top-0 w-px bg-[#8f7852]/50"
            style={{
              height: useTransform(scrollYProgress, [0.2, 0.4], [0, 32]),
            }}
          />
          <motion.div
            className="absolute left-0 top-0 h-px bg-[#8f7852]/50"
            style={{
              width: useTransform(scrollYProgress, [0.2, 0.4], [0, 32]),
            }}
          />
        </motion.div>
        <motion.div
          className="pointer-events-none absolute right-6 top-8 z-30 hidden h-16 w-16 sm:block lg:right-12"
          style={{ opacity: contentOpacity }}
        >
          <motion.div
            className="absolute right-0 top-0 w-px bg-[#8f7852]/50"
            style={{
              height: useTransform(scrollYProgress, [0.25, 0.45], [0, 32]),
            }}
          />
          <motion.div
            className="absolute right-0 top-0 h-px bg-[#8f7852]/50"
            style={{
              width: useTransform(scrollYProgress, [0.25, 0.45], [0, 32]),
            }}
          />
        </motion.div>

        {/* Award Certificate Display with Scroll Animation */}
        {caseStudy.certificatePath && (
          <motion.div
            style={{ opacity: certificateOpacity, scale: certificateScale }}
            className="absolute right-6 top-20 z-20 hidden lg:right-12 lg:top-24 xl:right-16 lg:block"
          >
            <Link
              href={caseStudy.certificatePath}
              target="_blank"
              className="group block"
            >
              <div className="relative overflow-hidden border-4 border-[#8f7852]/80 bg-white p-3 shadow-2xl transition-all duration-300 hover:border-[#8f7852] hover:shadow-[#8f7852]/30">
                {/* PDF Certificate Embed */}
                <div className="relative h-[340px] w-[240px] overflow-hidden bg-white lg:h-[420px] lg:w-[300px] xl:h-[480px] xl:w-[340px]">
                  <object
                    data={`${caseStudy.certificatePath}#toolbar=0&navpanes=0&scrollbar=0&view=FitH,top`}
                    type="application/pdf"
                    className="pointer-events-none h-full w-full"
                    title={caseStudy.awardTitle || "Award Certificate"}
                  >
                    {/* Fallback for browsers that don't support object */}
                    <div className="flex h-full w-full flex-col items-center justify-center bg-[#faf8f5] p-6 text-center">
                      <Award className="mb-4 h-16 w-16 text-[#8f7852]" />
                      <div className="mb-2 font-SchnyderS text-xl font-light text-neutral-900">
                        {caseStudy.awardTitle}
                      </div>
                      <div className="mb-4 font-Satoshi text-sm text-[#8f7852]">
                        {caseStudy.awardRegion} {caseStudy.awardYear}
                      </div>
                      <div className="font-Satoshi text-xs text-neutral-500">
                        International Property Awards
                      </div>
                    </div>
                  </object>
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-neutral-950/0 transition-all duration-300 group-hover:bg-neutral-950/60">
                  <div className="flex flex-col items-center gap-3 opacity-0 transition-opacity group-hover:opacity-100">
                    <span className="font-Satoshi text-sm font-medium uppercase tracking-wider text-white">
                      View Full Certificate
                    </span>
                    <ArrowRight className="h-5 w-5 text-[#8f7852]" />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        )}

        {/* Content Overlay with Scroll-Driven Reveal */}
        <div className="absolute inset-0 flex items-end">
          <div className="w-full px-6 pb-16 lg:px-12 lg:pb-24 xl:px-16">
            <div className="mx-auto max-w-[1600px]">
              <motion.div
                ref={contentRef}
                style={{ y: contentY, opacity: contentOpacity }}
                className="max-w-3xl"
              >
                {/* Label with slide-in */}
                <motion.div
                  className="mb-6 flex items-center gap-4"
                  style={{ x: labelX, opacity: contentOpacity }}
                >
                  <motion.div
                    className="h-px bg-gradient-to-r from-transparent to-[#8f7852]"
                    style={{
                      width: useTransform(scrollYProgress, [0.2, 0.4], [0, 64]),
                    }}
                  />
                  <span className="font-Satoshi text-[10px] font-medium uppercase tracking-[0.4em] text-[#8f7852]">
                    Case Study
                  </span>
                </motion.div>

                {/* Title with staggered reveal */}
                <motion.div style={{ y: titleY }} className="overflow-hidden">
                  <h2 className="mb-6 font-SchnyderS text-4xl font-light leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl xl:text-7xl">
                    {caseStudy.title}
                    <br />
                    <span className="text-[#8f7852]">
                      {caseStudy.titleHighlight}
                    </span>
                  </h2>
                </motion.div>

                {/* Details with delayed reveal */}
                <motion.div
                  style={{ y: detailsY, opacity: detailsOpacity }}
                  className="space-y-3"
                >
                  {/* Client */}
                  <p className="font-Satoshi text-lg font-medium text-white lg:text-xl">
                    Client: {caseStudy.client}
                  </p>

                  {/* Scope & Challenge */}
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
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* View Projects CTA with scroll reveal */}
      <motion.div
        className="relative bg-neutral-950 py-12 lg:py-16"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6 }}
      >
        <div className="relative z-10 mx-auto max-w-[1600px] px-6 lg:px-12 xl:px-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-end"
          >
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
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

// ============================================================================
// PARTNERS & AWARDS SECTION
// ============================================================================

function PartnersSectionComponent({
  content,
  clients,
}: {
  content: PartnersContent;
  clients: Client[];
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  // Get partners from static data
  const partners = getPartnersByCategory(content.partnerCategory);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-white py-24"
    >
      <div className="mx-auto max-w-[1600px] px-6 lg:px-12 xl:px-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h3 className="mb-8 font-SchnyderS text-3xl font-light text-neutral-950">
            {content.title}{" "}
            <span className="text-[#8f7852]">{content.titleHighlight}</span>
          </h3>

          {/* Partner Logos */}
          <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-12">
            {clients.length > 0
              ? clients.map((client) => (
                  <div
                    key={client.id}
                    className="flex h-16 w-36 items-center justify-center border border-neutral-200 bg-[#faf8f5] px-4 grayscale transition-all hover:grayscale-0"
                  >
                    {client.logo ? (
                      <Image
                        src={client.logo}
                        alt={client.name}
                        width={120}
                        height={48}
                        className="max-h-10 w-auto object-contain"
                      />
                    ) : (
                      <span className="font-Satoshi text-xs text-neutral-400">
                        {client.name}
                      </span>
                    )}
                  </div>
                ))
              : partners.map((partner, index) => (
                  <div
                    key={index}
                    className="flex h-16 w-36 items-center justify-center border border-neutral-200 bg-[#faf8f5] px-4 grayscale transition-all hover:grayscale-0"
                  >
                    <Image
                      src={partner.logo}
                      alt={partner.name}
                      width={120}
                      height={48}
                      className="max-h-10 w-auto object-contain"
                    />
                  </div>
                ))}
          </div>

          {/* Awards Certificates */}
          {content.awards && content.awards.length > 0 && (
            <div className="mt-16">
              <p className="mb-8 font-Satoshi text-sm font-light uppercase tracking-wider text-neutral-500">
                Related Awards
              </p>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
                {content.awards.map((award, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  >
                    <Link
                      href={award.certificate}
                      target="_blank"
                      className="group block"
                    >
                      <div className="relative overflow-hidden border-2 border-[#8f7852]/40 bg-white p-2 shadow-lg transition-all duration-300 hover:border-[#8f7852] hover:shadow-xl">
                        {/* PDF Certificate Embed */}
                        <div className="relative h-[280px] overflow-hidden bg-white sm:h-[320px]">
                          <object
                            data={`${award.certificate}#toolbar=0&navpanes=0&scrollbar=0&view=FitH,top`}
                            type="application/pdf"
                            className="pointer-events-none h-full w-full"
                            title={`${award.title} - ${award.region}`}
                          >
                            {/* Fallback */}
                            <div className="flex h-full w-full flex-col items-center justify-center bg-[#faf8f5] p-4 text-center">
                              <Award className="mb-3 h-12 w-12 text-[#8f7852]" />
                              <div className="mb-1 font-SchnyderS text-lg font-light text-neutral-900">
                                {award.title}
                              </div>
                              <div className="mb-2 font-Satoshi text-sm text-[#8f7852]">
                                {award.region}
                              </div>
                              <div className="font-Satoshi text-xs text-neutral-500">
                                {award.year}
                              </div>
                            </div>
                          </object>
                        </div>

                        {/* Award Info */}
                        <div className="border-t border-neutral-100 bg-[#faf8f5] px-4 py-3 text-center">
                          <div className="mb-1 font-Satoshi text-xs font-medium text-neutral-900">
                            {award.title}
                          </div>
                          <div className="font-Satoshi text-[10px] text-[#8f7852]">
                            {award.region} • {award.year}
                          </div>
                        </div>

                        {/* Hover Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center bg-neutral-950/0 transition-all duration-300 group-hover:bg-neutral-950/60">
                          <div className="flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                            <span className="font-Satoshi text-xs font-medium uppercase tracking-wider text-white">
                              View Certificate
                            </span>
                            <ArrowRight className="h-4 w-4 text-[#8f7852]" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Locations */}
          {content.showLocations &&
            content.locations &&
            content.locations.length > 0 && (
              <div className="mt-16">
                <h3 className="mb-8 font-SchnyderS text-2xl font-light text-neutral-950">
                  Exclusive <span className="text-[#8f7852]">Locations</span>
                </h3>

                <div className="flex flex-wrap items-center justify-center gap-6">
                  {content.locations.map((location, index) => (
                    <div
                      key={index}
                      className="border border-neutral-200 bg-white px-6 py-3"
                    >
                      <span className="font-Satoshi text-sm text-neutral-600">
                        {location}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
        </motion.div>
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
