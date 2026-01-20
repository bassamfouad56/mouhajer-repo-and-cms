"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  AnimatePresence,
} from "framer-motion";
import {
  Award,
  ArrowRight,
  X,
  Download,
  Star,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { SafeImage } from "@/components/safe-image";
import Link from "next/link";

// ============================================================================
// TYPES
// ============================================================================

interface AwardData {
  id: string;
  title: string;
  project: string;
  projectSlug?: string;
  projectImage?: string;
  year: number;
  organization: string;
  level: string;
  certificate: string;
  description?: string;
}

interface CinematicAwardsPageProps {
  awards: AwardData[];
}

// Sample project images for carousel (these would typically come from the awards data)
const PROJECT_IMAGES = [
  "/website%202.0%20content/projects/hospitality/_DSC3629-HDR.jpg",
  "/website%202.0%20content/services/industries/luxury%20hospitality/_MID3940-HDR.jpg",
  "/website%202.0%20content/services/industries/highend%20residential/_MID0001-HDR-2.jpg",
  "/website%202.0%20content/services/industries/commercial%20and%20corporate/_MID1004-HDR.jpg",
];

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function CinematicAwardsPage({ awards }: CinematicAwardsPageProps) {
  const [selectedAward, setSelectedAward] = useState<AwardData | null>(null);

  return (
    <main className="relative bg-[#faf8f5]">
      {/* Video Hero */}
      <AwardsHeroSection />

      {/* Featured Awards Showcase */}
      <FeaturedAwardsSection
        awards={awards}
        onViewCertificate={setSelectedAward}
      />

      {/* Awards Gallery Grid */}
      <AwardsGallerySection
        awards={awards}
        onViewCertificate={setSelectedAward}
      />

      {/* Recognition Statement */}
      <RecognitionStatement />

      {/* Final CTA */}
      <AwardsCTA />

      {/* Certificate Modal */}
      <CertificateModal
        award={selectedAward}
        onClose={() => setSelectedAward(null)}
      />
    </main>
  );
}

// ============================================================================
// HERO SECTION WITH VIDEO BACKGROUND
// ============================================================================

function AwardsHeroSection() {
  const heroRef = useRef<HTMLElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative min-h-[90vh] overflow-hidden bg-[#faf8f5]"
    >
      {/* Video Background */}
      <motion.div className="absolute inset-0" style={{ scale: videoScale }}>
        <div className="absolute inset-0 h-full w-full overflow-hidden">
          <iframe
            className="absolute left-1/2 top-1/2 h-[56.25vw] min-h-screen w-[177.77vh] min-w-full -translate-x-1/2 -translate-y-1/2"
            src="https://www.youtube.com/embed/FWywP5GXOmg?autoplay=1&mute=1&loop=1&playlist=FWywP5GXOmg&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&enablejsapi=1"
            title="Awards Ceremony"
            allow="autoplay; encrypted-media"
          />
        </div>

        {/* Light Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#faf8f5]/90 via-[#faf8f5]/70 to-[#faf8f5]/95" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#faf8f5]/80 via-transparent to-[#faf8f5]/80" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(250,248,245,0.6)_100%)]" />

        {/* Subtle gold accent */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(201,169,98,0.08)_0%,transparent_60%)]" />
      </motion.div>

      {/* Corner Accents */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isLoaded ? { opacity: 1 } : {}}
        transition={{ duration: 1, delay: 0.5 }}
        className="pointer-events-none absolute inset-0 z-20"
      >
        <div className="absolute left-8 top-32 h-24 w-24 border-l border-t border-[#c9a962]/40 lg:left-16" />
        <div className="absolute bottom-32 right-8 h-24 w-24 border-b border-r border-[#c9a962]/40 lg:right-16" />
      </motion.div>

      {/* Main Content */}
      <motion.div
        style={{ opacity, y }}
        className="relative z-10 flex min-h-[90vh] flex-col items-center justify-center px-6 py-32 lg:px-12"
      >
        <div className="mx-auto max-w-5xl text-center">
          {/* Label */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mb-8 flex items-center justify-center gap-6"
          >
            <div className="h-px w-20 bg-gradient-to-r from-transparent to-[#c9a962]" />
            <span className="font-Satoshi text-[11px] font-medium uppercase tracking-[0.5em] text-[#c9a962]">
              International Recognition
            </span>
            <div className="h-px w-20 bg-gradient-to-l from-transparent to-[#c9a962]" />
          </motion.div>

          {/* Main Title */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.5 }}
            className="mb-10"
          >
            <h1 className="font-SchnyderS text-6xl font-light leading-[1.05] tracking-tight text-neutral-900 sm:text-7xl md:text-8xl lg:text-9xl">
              Excellence,
              <br />
              <span className="text-[#c9a962]">Certified</span>
            </h1>
          </motion.div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mx-auto max-w-2xl font-Satoshi text-xl font-light leading-relaxed text-neutral-600 lg:text-2xl"
          >
            We don&apos;t build for awards. We build for perfection.
            <br />
            <span className="text-neutral-500">
              The recognition is simply the result.
            </span>
          </motion.p>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 1.1 }}
            className="mt-16 flex flex-wrap items-center justify-center gap-12 lg:gap-20"
          >
            {[
              { number: "5+", label: "International Awards" },
              { number: "25+", label: "Years of Excellence" },
              { number: "100%", label: "Client Satisfaction" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="mb-2 font-SchnyderS text-5xl font-light text-[#c9a962] lg:text-6xl">
                  {stat.number}
                </div>
                <div className="font-Satoshi text-xs font-light uppercase tracking-[0.2em] text-neutral-500">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>

          {/* Decorative element */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isLoaded ? { opacity: 1 } : {}}
            transition={{ duration: 1, delay: 1.4 }}
            className="mt-20 flex items-center justify-center gap-3"
          >
            <div className="h-px w-12 bg-[#c9a962]/40" />
            <div className="h-2 w-2 rotate-45 bg-[#c9a962]/60" />
            <div className="h-px w-12 bg-[#c9a962]/40" />
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isLoaded ? { opacity: 1 } : {}}
        transition={{ duration: 0.8, delay: 1.7 }}
        className="absolute bottom-12 left-1/2 z-10 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-3"
        >
          <span className="font-Satoshi text-[10px] font-light uppercase tracking-[0.4em] text-neutral-400">
            View Our Achievements
          </span>
          <div className="h-12 w-px bg-gradient-to-b from-[#c9a962] to-transparent" />
        </motion.div>
      </motion.div>
    </section>
  );
}

// ============================================================================
// IMAGE CAROUSEL COMPONENT
// ============================================================================

function ImageCarousel({
  images,
  projectName,
}: {
  images: string[];
  projectName: string;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  // Auto-play
  useEffect(() => {
    if (!isAutoPlaying || images.length <= 1) return;
    const interval = setInterval(nextSlide, 4000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide, images.length]);

  if (images.length === 0) return null;

  return (
    <div
      className="group relative overflow-hidden"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Images */}
      <div className="relative aspect-[16/10] w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <SafeImage
              src={images[currentIndex]}
              alt={`${projectName} - Image ${currentIndex + 1}`}
              fill
              className="object-cover"
            />
          </motion.div>
        </AnimatePresence>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/40 via-transparent to-transparent" />
      </div>

      {/* Navigation Arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center bg-white/90 text-neutral-800 opacity-0 shadow-lg transition-all duration-300 hover:bg-[#c9a962] hover:text-white group-hover:opacity-100"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center bg-white/90 text-neutral-800 opacity-0 shadow-lg transition-all duration-300 hover:bg-[#c9a962] hover:text-white group-hover:opacity-100"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 transition-all duration-300 ${
                index === currentIndex
                  ? "w-6 bg-[#c9a962]"
                  : "w-2 bg-white/60 hover:bg-white"
              }`}
            />
          ))}
        </div>
      )}

      {/* Image Counter */}
      <div className="absolute right-4 top-4 z-10 bg-neutral-900/60 px-3 py-1.5 font-Satoshi text-xs text-white backdrop-blur-sm">
        {currentIndex + 1} / {images.length}
      </div>
    </div>
  );
}

// ============================================================================
// FEATURED AWARDS SECTION
// ============================================================================

function FeaturedAwardsSection({
  awards,
  onViewCertificate,
}: {
  awards: AwardData[];
  onViewCertificate: (award: AwardData) => void;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  // Get top 3 awards for featured display
  const featuredAwards = awards.slice(0, 3);

  return (
    <section ref={sectionRef} className="relative bg-white py-32 lg:py-40">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#faf8f5] via-white to-white" />

      <div className="relative z-10 mx-auto max-w-[1600px] px-6 lg:px-12 xl:px-20">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-24 text-center"
        >
          <div className="mb-6 flex items-center justify-center gap-4">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#c9a962]" />
            <span className="font-Satoshi text-[10px] font-medium uppercase tracking-[0.4em] text-[#c9a962]">
              Featured Recognition
            </span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#c9a962]" />
          </div>

          <h2 className="font-SchnyderS text-5xl font-light tracking-tight text-neutral-900 sm:text-6xl lg:text-7xl">
            Award-Winning
            <br />
            <span className="text-[#c9a962]">Excellence</span>
          </h2>
        </motion.div>

        {/* Featured Awards */}
        <div className="space-y-32 lg:space-y-40">
          {featuredAwards.map((award, index) => (
            <FeaturedAwardCard
              key={award.id}
              award={award}
              index={index}
              onViewCertificate={onViewCertificate}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturedAwardCard({
  award,
  index,
  onViewCertificate,
}: {
  award: AwardData;
  index: number;
  onViewCertificate: (award: AwardData) => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: "-100px" });
  const isEven = index % 2 === 0;

  // Create carousel images - use award's project image + sample images
  const carouselImages = [
    award.projectImage || PROJECT_IMAGES[0],
    ...PROJECT_IMAGES.filter((img) => img !== award.projectImage).slice(0, 3),
  ].filter(Boolean) as string[];

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: 0.2 }}
      className={`grid gap-12 lg:grid-cols-2 lg:gap-20 ${isEven ? "" : "lg:direction-rtl"}`}
    >
      {/* Certificate Display */}
      <motion.div
        initial={{ opacity: 0, x: isEven ? -40 : 40 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.3 }}
        className={`relative ${isEven ? "" : "lg:order-2"}`}
      >
        <div className="group relative">
          {/* Decorative Frame */}
          <div className="absolute -inset-4 border border-[#c9a962]/20 lg:-inset-6" />
          <div className="absolute -inset-8 border border-[#c9a962]/10 lg:-inset-10" />

          {/* Certificate */}
          <div className="relative overflow-hidden bg-white shadow-2xl shadow-neutral-200/50">
            {/* Gold Top Border */}
            <div className="absolute left-0 right-0 top-0 h-1 bg-gradient-to-r from-[#c9a962]/60 via-[#c9a962] to-[#c9a962]/60" />

            {/* Certificate Preview */}
            <div className="aspect-[8.5/11] w-full bg-white p-4 lg:p-6">
              <iframe
                src={`${award.certificate}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
                className="h-full w-full"
                title={`${award.title} Certificate`}
              />
            </div>

            {/* Hover Overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-neutral-900/0 transition-all duration-500 group-hover:bg-neutral-900/80">
              <div className="flex gap-4 opacity-0 transition-all duration-300 group-hover:opacity-100">
                <button
                  onClick={() => onViewCertificate(award)}
                  className="flex items-center gap-2 border-2 border-[#c9a962] bg-[#c9a962] px-6 py-3 font-Satoshi text-sm font-medium text-neutral-900 transition-all hover:bg-transparent hover:text-[#c9a962]"
                >
                  <ExternalLink className="h-4 w-4" />
                  View Full Size
                </button>
                <a
                  href={award.certificate}
                  download
                  className="flex items-center gap-2 border-2 border-white/50 px-6 py-3 font-Satoshi text-sm font-light text-white transition-all hover:border-[#c9a962] hover:text-[#c9a962]"
                >
                  <Download className="h-4 w-4" />
                  Download
                </a>
              </div>
            </div>
          </div>

          {/* Corner Accents */}
          <div className="absolute -left-2 -top-2 h-6 w-6 border-l-2 border-t-2 border-[#c9a962]" />
          <div className="absolute -bottom-2 -right-2 h-6 w-6 border-b-2 border-r-2 border-[#c9a962]" />
        </div>
      </motion.div>

      {/* Award Details */}
      <motion.div
        initial={{ opacity: 0, x: isEven ? 40 : -40 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.4 }}
        className={`flex flex-col justify-center ${isEven ? "" : "lg:order-1"}`}
      >
        {/* Year Badge */}
        <div className="mb-8 inline-flex w-fit items-center gap-3 border border-[#c9a962]/30 bg-[#c9a962]/5 px-5 py-2">
          <span className="font-SchnyderS text-3xl font-light text-[#c9a962]">
            {award.year}
          </span>
          <div className="h-6 w-px bg-[#c9a962]/30" />
          <span className="font-Satoshi text-xs font-light uppercase tracking-wider text-neutral-600">
            {award.organization}
          </span>
        </div>

        {/* Title */}
        <h3 className="mb-6 font-SchnyderS text-4xl font-light leading-[1.1] text-neutral-900 lg:text-5xl xl:text-6xl">
          {award.title}
        </h3>

        {/* Level */}
        <div className="mb-8 flex items-center gap-3">
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className="h-4 w-4 fill-[#c9a962] text-[#c9a962]"
              />
            ))}
          </div>
          <span className="font-Satoshi text-sm font-medium text-[#c9a962]">
            {award.level}
          </span>
        </div>

        {/* Description */}
        {award.description && (
          <p className="mb-10 font-Satoshi text-lg font-light leading-relaxed text-neutral-600">
            {award.description}
          </p>
        )}

        {/* Divider */}
        <div className="mb-10 h-px w-24 bg-gradient-to-r from-[#c9a962] to-transparent" />

        {/* Winning Project */}
        <div className="mb-6">
          <span className="mb-3 block font-Satoshi text-xs font-light uppercase tracking-[0.3em] text-neutral-400">
            Winning Project
          </span>
          <div className="flex items-center gap-4">
            <span className="font-SchnyderS text-2xl font-light text-neutral-800 lg:text-3xl">
              {award.project}
            </span>
            {award.projectSlug && (
              <Link
                href={`/en/projects/${award.projectSlug}`}
                className="group flex h-10 w-10 items-center justify-center border border-neutral-300 transition-all hover:border-[#c9a962] hover:bg-[#c9a962]"
              >
                <ArrowRight className="h-4 w-4 text-neutral-600 transition-colors group-hover:text-white" />
              </Link>
            )}
          </div>
        </div>

        {/* Project Image Carousel */}
        {carouselImages.length > 0 && (
          <div className="mt-4 max-w-lg">
            <ImageCarousel
              images={carouselImages}
              projectName={award.project}
            />
            {award.projectSlug && (
              <Link
                href={`/en/projects/${award.projectSlug}`}
                className="mt-4 inline-flex items-center gap-2 font-Satoshi text-sm text-neutral-600 transition-colors hover:text-[#c9a962]"
              >
                <span>View Full Project</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

// ============================================================================
// AWARDS GALLERY SECTION
// ============================================================================

function AwardsGallerySection({
  awards,
  onViewCertificate,
}: {
  awards: AwardData[];
  onViewCertificate: (award: AwardData) => void;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  // Group awards by year
  const awardsByYear = awards.reduce(
    (acc, award) => {
      const year = award.year;
      if (!acc[year]) acc[year] = [];
      acc[year].push(award);
      return acc;
    },
    {} as Record<number, AwardData[]>
  );

  const years = Object.keys(awardsByYear)
    .map(Number)
    .sort((a, b) => b - a);

  return (
    <section ref={sectionRef} className="relative bg-[#faf8f5] py-32 lg:py-40">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div
          className="h-full w-full"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #c9a962 1px, transparent 0)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-[1600px] px-6 lg:px-12 xl:px-20">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-20 text-center"
        >
          <div className="mb-6 flex items-center justify-center gap-4">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#c9a962]" />
            <span className="font-Satoshi text-[10px] font-medium uppercase tracking-[0.4em] text-[#c9a962]">
              Complete Collection
            </span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#c9a962]" />
          </div>

          <h2 className="font-SchnyderS text-5xl font-light tracking-tight text-neutral-900 sm:text-6xl lg:text-7xl">
            All
            <span className="text-[#c9a962]"> Awards</span>
          </h2>
        </motion.div>

        {/* Awards by Year */}
        <div className="space-y-24">
          {years.map((year, yearIndex) => (
            <motion.div
              key={year}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: yearIndex * 0.15 }}
            >
              {/* Year Header */}
              <div className="mb-12 flex items-center gap-6">
                <span className="font-SchnyderS text-6xl font-light text-[#c9a962] lg:text-7xl">
                  {year}
                </span>
                <div className="h-px flex-1 bg-gradient-to-r from-[#c9a962]/40 to-transparent" />
              </div>

              {/* Awards Grid */}
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {awardsByYear[year].map((award, awardIndex) => (
                  <GalleryAwardCard
                    key={award.id}
                    award={award}
                    index={awardIndex}
                    onViewCertificate={onViewCertificate}
                  />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function GalleryAwardCard({
  award,
  index,
  onViewCertificate,
}: {
  award: AwardData;
  index: number;
  onViewCertificate: (award: AwardData) => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group"
    >
      <div className="relative overflow-hidden bg-white shadow-lg shadow-neutral-200/30 transition-all duration-500 hover:shadow-xl hover:shadow-[#c9a962]/10">
        {/* Certificate Preview */}
        <div className="relative aspect-[8.5/11] w-full">
          <iframe
            src={`${award.certificate}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
            className="h-full w-full"
            title={`${award.title} Certificate`}
          />

          {/* Hover Overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-neutral-900/0 transition-all duration-300 group-hover:bg-neutral-900/70">
            <div className="flex flex-col gap-3 opacity-0 transition-all duration-300 group-hover:opacity-100">
              <button
                onClick={() => onViewCertificate(award)}
                className="flex items-center justify-center gap-2 bg-[#c9a962] px-5 py-2.5 font-Satoshi text-sm font-medium text-neutral-900 transition-all hover:bg-white"
              >
                <ExternalLink className="h-4 w-4" />
                View Certificate
              </button>
              <a
                href={award.certificate}
                download
                className="flex items-center justify-center gap-2 border border-white/50 px-5 py-2.5 font-Satoshi text-sm font-light text-white transition-all hover:border-[#c9a962] hover:text-[#c9a962]"
              >
                <Download className="h-4 w-4" />
                Download PDF
              </a>
            </div>
          </div>
        </div>

        {/* Card Footer */}
        <div className="border-t border-neutral-100 p-5">
          <div className="mb-2 flex items-center gap-2">
            <Award className="h-4 w-4 text-[#c9a962]" strokeWidth={1.5} />
            <span className="font-Satoshi text-xs font-light text-neutral-500">
              {award.organization}
            </span>
          </div>
          <h4 className="mb-2 font-SchnyderS text-xl font-light text-neutral-900">
            {award.title}
          </h4>
          <p className="font-Satoshi text-sm font-light text-neutral-500">
            {award.project}
          </p>
        </div>

        {/* Gold accent line */}
        <div className="absolute left-0 right-0 top-0 h-0.5 scale-x-0 bg-[#c9a962] transition-transform duration-500 group-hover:scale-x-100" />
      </div>
    </motion.div>
  );
}

// ============================================================================
// RECOGNITION STATEMENT
// ============================================================================

function RecognitionStatement() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-neutral-950 py-40 lg:py-56"
    >
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute left-1/4 top-1/2 h-[600px] w-[600px] -translate-y-1/2 rounded-full bg-[#c9a962]/[0.08] blur-[200px]" />
        <div className="absolute bottom-0 right-1/4 h-[400px] w-[400px] rounded-full bg-[#c9a962]/[0.05] blur-[150px]" />
      </div>

      {/* Film Grain */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.03]">
        <div className="h-full w-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iMC44IiBudW1PY3RhdmVzPSI0IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsdGVyPSJ1cmwoI2EpIi8+PC9zdmc+')] bg-repeat" />
      </div>

      {/* Corner Accents */}
      <div className="pointer-events-none absolute left-8 top-20 h-20 w-20 border-l border-t border-[#c9a962]/30 lg:left-16" />
      <div className="pointer-events-none absolute bottom-20 right-8 h-20 w-20 border-b border-r border-[#c9a962]/30 lg:right-16" />

      <div className="relative z-10 mx-auto max-w-5xl px-6 text-center lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1 }}
        >
          {/* Quote Mark */}
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12 flex justify-center"
          >
            <div className="font-SchnyderS text-[120px] leading-none text-[#c9a962]/30 lg:text-[180px]">
              &ldquo;
            </div>
          </motion.div>

          {/* Statement */}
          <motion.blockquote
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mb-12 font-SchnyderS text-4xl font-light leading-[1.3] text-white sm:text-5xl lg:text-6xl"
          >
            Every project we undertake carries the same commitment to perfection
            that earned these recognitions.{" "}
            <span className="text-[#c9a962]">
              Excellence is not our goal—it&apos;s our standard.
            </span>
          </motion.blockquote>

          {/* Attribution */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="mb-3 font-Satoshi text-sm font-medium text-[#c9a962]">
              Maher Mouhajer
            </div>
            <div className="font-Satoshi text-xs font-light uppercase tracking-[0.3em] text-white/40">
              Founder & CEO
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// ============================================================================
// AWARDS CTA
// ============================================================================

function AwardsCTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true });

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-[#faf8f5] py-40"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-[#faf8f5] to-[#faf8f5]" />

      {/* Subtle Pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div
          className="h-full w-full"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #c9a962 1px, transparent 0)`,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-[1200px] px-6 text-center lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          {/* Label */}
          <div className="mb-8 flex items-center justify-center gap-4">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#c9a962]" />
            <span className="font-Satoshi text-[10px] font-medium uppercase tracking-[0.4em] text-[#c9a962]">
              Your Project, Our Expertise
            </span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#c9a962]" />
          </div>

          {/* Title */}
          <h2 className="mb-8 font-SchnyderS text-5xl font-light leading-tight tracking-tight text-neutral-900 sm:text-6xl lg:text-7xl">
            Build Your
            <br />
            <span className="text-[#c9a962]">Award-Worthy</span>
            <br />
            Project
          </h2>

          {/* Subtitle */}
          <p className="mx-auto mb-14 max-w-2xl font-Satoshi text-lg font-light leading-relaxed text-neutral-600">
            Partner with a team that has proven its excellence on the
            international stage. Every project we undertake carries the same
            commitment to perfection.
          </p>

          {/* CTAs */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/contact"
              className="group inline-flex items-center gap-3 border-2 border-[#c9a962] bg-[#c9a962] px-10 py-5 font-Satoshi text-sm font-medium tracking-widest text-neutral-900 transition-all hover:bg-transparent hover:text-[#c9a962]"
            >
              <span>START YOUR PROJECT</span>
              <ArrowRight
                size={18}
                className="transition-transform group-hover:translate-x-2"
              />
            </Link>
            <Link
              href="/projects"
              className="group inline-flex items-center gap-3 border-2 border-neutral-300 px-10 py-5 font-Satoshi text-sm font-light tracking-widest text-neutral-700 transition-all hover:border-[#c9a962] hover:text-[#c9a962]"
            >
              <span>VIEW ALL PROJECTS</span>
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

// ============================================================================
// CERTIFICATE MODAL
// ============================================================================

function CertificateModal({
  award,
  onClose,
}: {
  award: AwardData | null;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {award && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/95 p-4 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 30 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative h-[90vh] w-full max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute -right-2 -top-2 z-10 flex h-12 w-12 items-center justify-center bg-[#c9a962] text-neutral-900 transition-all hover:bg-white sm:-right-4 sm:-top-4"
            >
              <X className="h-5 w-5" strokeWidth={2} />
            </button>

            {/* Certificate Frame */}
            <div className="relative h-full w-full">
              {/* Decorative Frame */}
              <div className="absolute -inset-3 border-2 border-[#c9a962]/40 sm:-inset-4" />

              {/* Certificate */}
              <div className="h-full w-full overflow-hidden bg-white shadow-2xl">
                <iframe
                  src={award.certificate}
                  className="h-full w-full"
                  title={`${award.title} Certificate - Full View`}
                />
              </div>

              {/* Corner Accents */}
              <div className="absolute -left-2 -top-2 h-6 w-6 border-l-2 border-t-2 border-[#c9a962] sm:-left-3 sm:-top-3 sm:h-8 sm:w-8" />
              <div className="absolute -bottom-2 -right-2 h-6 w-6 border-b-2 border-r-2 border-[#c9a962] sm:-bottom-3 sm:-right-3 sm:h-8 sm:w-8" />
            </div>

            {/* Award Info & Download */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="absolute -bottom-20 left-0 right-0 flex flex-col items-center gap-4 sm:-bottom-24 sm:flex-row sm:justify-between"
            >
              <div className="text-center sm:text-left">
                <h3 className="font-SchnyderS text-xl font-light text-white sm:text-2xl">
                  {award.title}
                </h3>
                <p className="font-Satoshi text-sm font-light text-white/60">
                  {award.organization} · {award.year}
                </p>
              </div>
              <a
                href={award.certificate}
                download
                className="flex items-center gap-3 bg-[#c9a962] px-8 py-4 font-Satoshi text-sm font-medium text-neutral-900 transition-all hover:bg-white"
              >
                <Download className="h-4 w-4" />
                Download Certificate
              </a>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default CinematicAwardsPage;
