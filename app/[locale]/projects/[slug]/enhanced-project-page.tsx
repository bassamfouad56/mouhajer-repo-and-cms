"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Project } from "@/lib/wordpress";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
  useInView,
} from "framer-motion";
import {
  ArrowRight,
  MapPin,
  Calendar,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  Award,
  Quote,
  Building,
  Users,
  Clock,
  CheckCircle2,
  Play,
  Sparkles,
  Video,
  Image as ImageIcon,
} from "lucide-react";
import { ImageGalleryModal } from "@/components/image-gallery-modal";
import { getSafeImageUrl, filterValidImages } from "@/lib/error-handling";

interface ProjectPageClientProps {
  project: Project;
  relatedProjects?: Project[];
  allProjects?: Project[];
}

// ============================================
// 1. CINEMATIC HERO BANNER
// ============================================
function HeroBanner({
  project,
  heroImage,
}: {
  project: Project;
  heroImage: string;
}) {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

  return (
    <section ref={heroRef} className="relative h-screen w-full overflow-hidden">
      {/* Parallax Background */}
      <motion.div style={{ y, scale }} className="absolute inset-0">
        <Image
          src={heroImage}
          alt={project.title || "Project"}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        {/* Cinematic Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/60 via-neutral-950/30 to-neutral-950" />
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/50 via-transparent to-neutral-950/50" />
      </motion.div>

      {/* Decorative Lines */}
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 1.5, delay: 0.5 }}
          className="absolute left-[10%] top-0 h-full w-px origin-top bg-gradient-to-b from-[#8f7852]/30 via-[#8f7852]/10 to-transparent"
        />
        <motion.div
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 1.5, delay: 0.7 }}
          className="absolute right-[10%] top-0 h-full w-px origin-top bg-gradient-to-b from-[#8f7852]/30 via-[#8f7852]/10 to-transparent"
        />
      </div>

      {/* Content */}
      <motion.div
        style={{ opacity }}
        className="relative z-10 flex h-full flex-col items-center justify-center px-6"
      >
        {/* Award Badge */}
        {project.acfFields?.awards && (
          <motion.div
            initial={{ opacity: 0, y: -30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mb-10 flex items-center gap-3 rounded-full border border-[#8f7852]/40 bg-[#8f7852]/10 px-8 py-4 backdrop-blur-md"
          >
            <Award className="h-5 w-5 text-[#8f7852]" />
            <span className="text-sm font-light tracking-widest text-[#8f7852]">
              AWARD-WINNING PROJECT
            </span>
          </motion.div>
        )}

        {/* Project Type Label - Only show if data exists */}
        {project.acfFields?.projectType && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mb-8 flex items-center gap-6"
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: 64 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="h-px bg-gradient-to-r from-transparent to-white/40"
            />
            <span className="text-xs font-light uppercase tracking-[0.5em] text-white/60">
              {project.acfFields.projectType}
            </span>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: 64 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="h-px bg-gradient-to-l from-transparent to-white/40"
            />
          </motion.div>
        )}

        {/* Project Title */}
        <motion.h1
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            duration: 1.2,
            delay: 0.5,
            type: "spring",
            damping: 20,
          }}
          className="mb-10 max-w-6xl text-center font-SchnyderS text-4xl font-light tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl"
        >
          {project.title}
        </motion.h1>

        {/* Location - Only show if data exists */}
        {project.acfFields?.location && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex items-center gap-3 rounded-full bg-white/5 px-6 py-3 backdrop-blur-sm"
          >
            <MapPin className="h-4 w-4 text-[#8f7852]" />
            <span className="text-sm font-light tracking-wide text-white/80">
              {project.acfFields.location}
            </span>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}

// ============================================
// PROJECT GALLERY CAROUSEL COMPONENT
// ============================================
function ProjectGalleryCarousel({
  images,
  onImageClick,
}: {
  images: Array<{ sourceUrl: string; altText?: string }>;
  onImageClick: (index: number) => void;
}) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [direction, setDirection] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const thumbsContainerRef = useRef<HTMLDivElement>(null);
  const autoScrollRef = useRef<number | null>(null);
  const dragStartX = useRef(0);
  const scrollStartX = useRef(0);

  // Create looped images for infinite scroll effect (3x the images)
  const loopedImages = [...images, ...images, ...images];
  const singleSetWidth = useRef(0);

  // Main carousel autoplay
  useEffect(() => {
    if (isHovered || images.length <= 1) return;

    const autoplayInterval = setInterval(() => {
      setDirection(1);
      setSelectedIndex((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(autoplayInterval);
  }, [isHovered, images.length]);

  // Auto-scroll thumbnails smoothly
  useEffect(() => {
    if (!thumbsContainerRef.current || images.length <= 3 || isDragging) return;

    const container = thumbsContainerRef.current;
    const thumbWidth = 192 + 16; // w-48 (192px) + gap (16px)
    singleSetWidth.current = thumbWidth * images.length;

    // Start from the middle set
    if (container.scrollLeft < singleSetWidth.current * 0.5) {
      container.scrollLeft = singleSetWidth.current;
    }

    const scrollSpeed = 0.5;
    let lastTime = performance.now();

    const smoothScroll = (currentTime: number) => {
      if (isHovered || isDragging) {
        lastTime = currentTime;
        autoScrollRef.current = requestAnimationFrame(smoothScroll);
        return;
      }

      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;

      container.scrollLeft += scrollSpeed * (deltaTime / 16);

      // Loop back when reaching the end of middle set
      if (container.scrollLeft >= singleSetWidth.current * 2) {
        container.scrollLeft = singleSetWidth.current;
      }
      // Loop forward when reaching the start
      if (container.scrollLeft <= 0) {
        container.scrollLeft = singleSetWidth.current;
      }

      autoScrollRef.current = requestAnimationFrame(smoothScroll);
    };

    autoScrollRef.current = requestAnimationFrame(smoothScroll);

    return () => {
      if (autoScrollRef.current) {
        cancelAnimationFrame(autoScrollRef.current);
      }
    };
  }, [images.length, isHovered, isDragging]);

  // Drag handlers for thumbnails
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!thumbsContainerRef.current) return;
    setIsDragging(true);
    dragStartX.current = e.clientX;
    scrollStartX.current = thumbsContainerRef.current.scrollLeft;
    thumbsContainerRef.current.style.cursor = "grabbing";
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging || !thumbsContainerRef.current) return;
      const dx = e.clientX - dragStartX.current;
      thumbsContainerRef.current.scrollLeft = scrollStartX.current - dx;
    },
    [isDragging],
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    if (thumbsContainerRef.current) {
      thumbsContainerRef.current.style.cursor = "grab";
    }
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (!thumbsContainerRef.current) return;
    setIsDragging(true);
    dragStartX.current = e.touches[0].clientX;
    scrollStartX.current = thumbsContainerRef.current.scrollLeft;
  }, []);

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!isDragging || !thumbsContainerRef.current) return;
      const dx = e.touches[0].clientX - dragStartX.current;
      thumbsContainerRef.current.scrollLeft = scrollStartX.current - dx;
    },
    [isDragging],
  );

  // Navigation handlers
  const goToPrev = useCallback(() => {
    setDirection(-1);
    setSelectedIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  const goToNext = useCallback(() => {
    setDirection(1);
    setSelectedIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const goToIndex = useCallback(
    (index: number) => {
      const actualIndex = index % images.length;
      setDirection(actualIndex > selectedIndex ? 1 : -1);
      setSelectedIndex(actualIndex);
    },
    [selectedIndex, images.length],
  );

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goToPrev();
      if (e.key === "ArrowRight") goToNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goToPrev, goToNext]);

  // Slide animation variants
  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0,
      scale: 1.02,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      zIndex: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? "100%" : "-100%",
      opacity: 0,
      scale: 0.98,
      zIndex: 0,
    }),
  };

  if (images.length === 0) return null;

  return (
    <div
      className="space-y-6"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        handleMouseUp();
      }}
    >
      {/* Main Carousel with Fade/Slide Transition */}
      <div className="group relative overflow-hidden rounded-2xl bg-neutral-100">
        <div className="relative aspect-[16/10] max-h-[70vh] w-full">
          <AnimatePresence initial={false} custom={direction} mode="popLayout">
            <motion.div
              key={selectedIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 200, damping: 25 },
                opacity: { duration: 0.5, ease: "easeInOut" },
                scale: { duration: 0.5, ease: "easeInOut" },
              }}
              className="absolute inset-0 cursor-pointer"
              onClick={() => onImageClick(selectedIndex)}
            >
              <Image
                src={images[selectedIndex].sourceUrl}
                alt={
                  images[selectedIndex].altText ||
                  `Project image ${selectedIndex + 1}`
                }
                fill
                className="object-cover"
                sizes="100vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/20 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </motion.div>
          </AnimatePresence>

          {/* Click to expand hint */}
          <div className="absolute bottom-4 right-4 z-10 flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:opacity-100">
            <Maximize2 className="h-4 w-4 text-neutral-950" />
            <span className="text-sm font-medium text-neutral-950">
              Click to expand
            </span>
          </div>
        </div>

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={goToPrev}
              className="absolute left-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 opacity-0 shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-white group-hover:opacity-100"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-6 w-6 text-neutral-950" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 opacity-0 shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-white group-hover:opacity-100"
              aria-label="Next image"
            >
              <ChevronRight className="h-6 w-6 text-neutral-950" />
            </button>
          </>
        )}

        {/* Image Counter */}
        <div className="absolute bottom-4 left-4 z-10 flex items-center gap-2 rounded-full bg-neutral-950/80 px-4 py-2 backdrop-blur-sm">
          <ImageIcon className="h-4 w-4 text-[#8f7852]" />
          <span className="text-sm font-medium text-white">
            {selectedIndex + 1} / {images.length}
          </span>
        </div>
      </div>

      {/* Thumbnail Strip - Bigger, Draggable, Auto-scrolling */}
      {images.length > 1 && (
        <div className="relative -mx-6 lg:-mx-12">
          {/* Gradient fade edges */}
          <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-16 bg-gradient-to-r from-white to-transparent lg:w-24" />
          <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-16 bg-gradient-to-l from-white to-transparent lg:w-24" />

          {/* Scrollable Thumbnail Container */}
          <div
            ref={thumbsContainerRef}
            className="flex cursor-grab gap-4 overflow-x-scroll px-6 py-2 lg:px-12"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              WebkitOverflowScrolling: "touch",
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={() => setIsDragging(false)}
          >
            {loopedImages.map((img, index) => {
              const actualIndex = index % images.length;
              const isSelected = actualIndex === selectedIndex;

              return (
                <motion.button
                  key={`thumb-${index}`}
                  onClick={() => !isDragging && goToIndex(index)}
                  whileHover={{ scale: isDragging ? 1 : 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className={`relative shrink-0 overflow-hidden transition-all duration-500 ${
                    isSelected
                      ? "ring-2 ring-[#8f7852] ring-offset-2"
                      : "opacity-60 hover:opacity-100"
                  }`}
                  style={{ pointerEvents: isDragging ? "none" : "auto" }}
                >
                  <div className="relative h-24 w-40 md:h-28 md:w-48 lg:h-32 lg:w-56">
                    <Image
                      src={img.sourceUrl}
                      alt={img.altText || `Thumbnail ${actualIndex + 1}`}
                      fill
                      className="object-cover"
                      sizes="224px"
                      draggable={false}
                    />
                    {/* Subtle hover overlay */}
                    <div
                      className={`absolute inset-0 transition-colors duration-300 ${
                        isSelected
                          ? "bg-transparent"
                          : "bg-neutral-950/10 hover:bg-transparent"
                      }`}
                    />
                  </div>
                  {/* Active indicator */}
                  {isSelected && (
                    <motion.div
                      layoutId="activeThumbBar"
                      className="absolute bottom-0 left-0 right-0 h-1 bg-[#8f7852]"
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 25,
                      }}
                    />
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================
// 2. OVERVIEW + CHALLENGE (Side by Side)
// ============================================
function OverviewChallengeSection({
  project,
  images,
  onImageClick,
}: {
  project: Project;
  images: Array<{ sourceUrl: string; altText?: string }>;
  onImageClick: (index: number) => void;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-white py-24 lg:py-32"
    >
      <div className="relative mx-auto max-w-7xl px-6 lg:px-12">
        {/* Two Column Layout */}
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-20">
          {/* Left: Overview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-8">
              <h2 className="font-SchnyderS text-3xl font-light text-neutral-950 lg:text-4xl">
                Overview
              </h2>
            </div>

            {/* Project Details Cards */}
            {(() => {
              const details = [
                project.acfFields?.location
                  ? {
                      label: "Location",
                      value: project.acfFields.location,
                      icon: MapPin,
                    }
                  : null,
                project.acfFields?.client
                  ? {
                      label: "Client",
                      value: project.acfFields.client,
                      icon: Users,
                    }
                  : null,
                project.acfFields?.status
                  ? {
                      label: "Status",
                      value: project.acfFields.status,
                      icon: CheckCircle2,
                    }
                  : null,
                project.acfFields?.projectType
                  ? {
                      label: "Type",
                      value: project.acfFields.projectType,
                      icon: Building,
                    }
                  : null,
                project.acfFields?.projectDates || project.acfFields?.duration
                  ? {
                      label: "Dates",
                      value:
                        project.acfFields?.projectDates ||
                        project.acfFields?.duration,
                      icon: Calendar,
                    }
                  : null,
              ].filter(Boolean) as Array<{
                label: string;
                value: string;
                icon: React.ComponentType<{ className?: string }>;
              }>;

              if (details.length === 0) return null;

              return (
                <div className="grid grid-cols-2 gap-4">
                  {details.map((item, index) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={isInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                      className="rounded-2xl bg-neutral-50 p-5"
                    >
                      <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-white">
                        <item.icon className="h-4 w-4 text-[#8f7852]" />
                      </div>
                      <span className="text-[10px] font-light uppercase tracking-wider text-neutral-400">
                        {item.label}
                      </span>
                      <p className="mt-1 font-medium text-neutral-950">
                        {item.value}
                      </p>
                    </motion.div>
                  ))}
                </div>
              );
            })()}
          </motion.div>

          {/* Right: The Challenge */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="mb-8">
              <h2 className="font-SchnyderS text-3xl font-light text-neutral-950 lg:text-4xl">
                The Challenge
              </h2>
            </div>

            {project.acfFields?.challenge && (
              <p className="mb-8 text-lg font-light leading-relaxed text-neutral-600 lg:text-xl">
                {project.acfFields.challenge}
              </p>
            )}

            {/* Challenge Points - Only show if data exists */}
            {project.acfFields?.challengePoints &&
              project.acfFields.challengePoints.length > 0 && (
                <div className="space-y-4">
                  {project.acfFields.challengePoints
                    .slice(0, 4)
                    .map((item: string, index: number) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: 20 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                        className="flex items-start gap-3"
                      >
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[#8f7852]/10">
                          <CheckCircle2 className="h-3.5 w-3.5 text-[#8f7852]" />
                        </div>
                        <span className="text-sm font-light text-neutral-700">
                          {item}
                        </span>
                      </motion.div>
                    ))}
                </div>
              )}
          </motion.div>
        </div>

        {/* Project Gallery - Cinematic Carousel */}
        {images.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.4 }}
            className="mt-20"
          >
            <ProjectGalleryCarousel
              images={images}
              onImageClick={onImageClick}
            />
          </motion.div>
        )}
      </div>
    </section>
  );
}

// ============================================
// 3. DESIGN APPROACH SECTION - Cinematic Split Layout
// ============================================
function DesignApproachSection({
  project,
  images,
}: {
  project: Project;
  images?: Array<{ sourceUrl: string; altText?: string }>;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
  const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.1, 1, 1.05]);

  const approachText =
    project.acfFields?.approach || project.acfFields?.projectDescription;

  if (!approachText) return null;

  // Split approach into paragraphs for better formatting
  const paragraphs = approachText.split(/\n\n|\. (?=[A-Z])/).filter((p: string) => p.trim());
  const mainStatement = paragraphs[0];
  const supportingText = paragraphs.slice(1).join(". ");

  // Get approach image (use 3rd or 4th image from gallery for variety)
  const approachImage = images?.[2]?.sourceUrl || images?.[3]?.sourceUrl || images?.[0]?.sourceUrl;

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-neutral-950"
    >
      {/* Two Column Layout */}
      <div className="grid lg:grid-cols-2">
        {/* Left - Content */}
        <div className="relative z-10 flex flex-col justify-center px-6 py-24 lg:px-12 lg:py-32 xl:px-20">
          {/* Section Label */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="mb-8 flex items-center gap-4"
          >
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#8f7852]" />
            <span className="text-[10px] font-medium uppercase tracking-[0.4em] text-[#8f7852]">
              Our Approach
            </span>
          </motion.div>

          {/* Main Statement */}
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mb-8 font-SchnyderS text-3xl font-light leading-[1.2] text-white sm:text-4xl lg:text-5xl xl:text-6xl"
          >
            {mainStatement}
          </motion.h2>

          {/* Supporting Text */}
          {supportingText && (
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-10 max-w-xl text-base font-light leading-relaxed text-white/60 lg:text-lg"
            >
              {supportingText}
            </motion.p>
          )}

          {/* Design Principles - if we have scope items, show first 3 */}
          {project.acfFields?.scopeOfWork && project.acfFields.scopeOfWork.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="space-y-4"
            >
              {project.acfFields.scopeOfWork.slice(0, 3).map((item: { title: string }, index: number) => (
                <div
                  key={index}
                  className="flex items-center gap-4 border-l border-white/10 pl-4 transition-colors hover:border-[#8f7852]/50"
                >
                  <span className="font-SchnyderS text-lg text-[#8f7852]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="text-sm font-light text-white/80">
                    {item.title}
                  </span>
                </div>
              ))}
            </motion.div>
          )}

          {/* Corner Accent */}
          <div className="absolute bottom-8 left-6 hidden lg:block lg:left-12 xl:left-20">
            <div className="h-16 w-px bg-gradient-to-b from-[#8f7852]/30 to-transparent" />
            <div className="h-px w-16 bg-gradient-to-r from-[#8f7852]/30 to-transparent" />
          </div>
        </div>

        {/* Right - Image */}
        <div className="relative min-h-[50vh] overflow-hidden lg:min-h-[80vh]">
          {approachImage && (
            <motion.div
              style={{ y: imageY, scale: imageScale }}
              className="absolute inset-0"
            >
              <Image
                src={approachImage}
                alt="Design approach"
                fill
                className="object-cover"
                sizes="50vw"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-l from-transparent via-neutral-950/20 to-neutral-950/80 lg:via-transparent lg:to-neutral-950" />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/60 via-transparent to-transparent" />
            </motion.div>
          )}

          {/* Decorative Frame */}
          <div className="absolute right-6 top-6 hidden lg:block">
            <div className="h-16 w-px bg-[#8f7852]/30" />
            <div className="h-px w-16 bg-[#8f7852]/30" />
          </div>
          <div className="absolute bottom-6 right-6 hidden lg:block">
            <div className="absolute bottom-0 right-0 h-16 w-px bg-[#8f7852]/30" />
            <div className="absolute bottom-0 right-0 h-px w-16 bg-[#8f7852]/30" />
          </div>

          {/* Quote Overlay - Optional */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="absolute bottom-8 left-6 right-6 lg:bottom-12 lg:left-12 lg:right-12"
          >
            <div className="rounded-lg border border-white/10 bg-neutral-950/80 p-6 backdrop-blur-sm">
              <p className="text-sm font-light italic text-white/70">
                &ldquo;Every space tells a story. Our role is to make it unforgettable.&rdquo;
              </p>
              <span className="mt-2 block text-[10px] uppercase tracking-widest text-[#8f7852]">
                — Design Philosophy
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Decorative Line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : {}}
        transition={{ duration: 1.2, delay: 0.6 }}
        className="absolute bottom-0 left-0 right-0 h-px origin-left bg-gradient-to-r from-[#8f7852]/40 via-[#8f7852]/20 to-transparent"
      />
    </section>
  );
}

// ============================================
// 3.5 BEFORE/AFTER SECTION
// ============================================
function BeforeAfterSection({
  images,
}: {
  images: Array<{ sourceUrl: string; altText?: string }>;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  // Before/After pairs - use different images for visual contrast
  const beforeAfterPairs = [
    {
      before: images[2]?.sourceUrl || images[0]?.sourceUrl,
      after: images[0]?.sourceUrl,
      label: "Transformation 1",
    },
    ...(images.length >= 4
      ? [
          {
            before: images[4]?.sourceUrl || images[1]?.sourceUrl,
            after: images[1]?.sourceUrl,
            label: "Transformation 2",
          },
        ]
      : []),
  ];

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(5, Math.min(95, (x / rect.width) * 100));
    setSliderPosition(percentage);
  }, []);

  const handleMouseDown = useCallback(() => setIsDragging(true), []);
  const handleMouseUp = useCallback(() => setIsDragging(false), []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) handleMove(e.clientX);
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging) handleMove(e.touches[0].clientX);
    };

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("touchmove", handleTouchMove);
      window.addEventListener("touchend", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleMouseUp);
    };
  }, [isDragging, handleMove, handleMouseUp]);

  const currentPair = beforeAfterPairs[currentIndex] || beforeAfterPairs[0];

  // Only show if we have at least 2 images
  if (images.length < 2) return null;

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-white py-24 lg:py-32"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="mb-12"
        >
          <h2 className="mb-4 font-SchnyderS text-3xl font-light text-neutral-950 lg:text-4xl">
            Before & After
          </h2>
          <p className="max-w-2xl text-lg font-light text-neutral-600">
            Drag the slider to reveal the transformation
          </p>
        </motion.div>

        {/* Before/After Slider */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div
            ref={containerRef}
            className="group relative mx-auto aspect-[16/9] container cursor-ew-resize overflow-hidden rounded-2xl shadow-xl"
            onMouseDown={handleMouseDown}
            onTouchStart={handleMouseDown}
            onClick={(e) => !isDragging && handleMove(e.clientX)}
          >
            {/* After Image */}
            <div className="absolute inset-0">
              <Image
                src={currentPair.after}
                alt="After"
                fill
                className="object-cover"
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-neutral-950/5" />
              <div className="absolute bottom-6 right-6 flex items-center gap-2 rounded-full bg-[#8f7852] px-4 py-2">
                <Sparkles className="h-4 w-4 text-neutral-950" />
                <span className="text-xs font-medium uppercase text-neutral-950">
                  After
                </span>
              </div>
            </div>

            {/* Before Image (Clipped) */}
            <div
              className="absolute inset-0 z-10 overflow-hidden"
              style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
            >
              <Image
                src={currentPair.before}
                alt="Before"
                fill
                className="object-cover"
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-neutral-950/10" />
              <div className="absolute bottom-6 left-6 flex items-center gap-2 rounded-full bg-neutral-950 px-4 py-2">
                <Clock className="h-4 w-4 text-white/70" />
                <span className="text-xs font-medium uppercase text-white">
                  Before
                </span>
              </div>
            </div>

            {/* Slider Handle */}
            <div
              className="absolute bottom-0 top-0 z-20 w-1"
              style={{
                left: `${sliderPosition}%`,
                transform: "translateX(-50%)",
              }}
            >
              <div className="h-full w-1 bg-white shadow-lg" />
              <div className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white bg-neutral-950">
                <div className="flex items-center gap-0.5">
                  <ChevronLeft className="h-4 w-4 text-[#8f7852]" />
                  <ChevronRight className="h-4 w-4 text-[#8f7852]" />
                </div>
              </div>
            </div>
          </div>

          {/* Tabs for multiple transformations */}
          {beforeAfterPairs.length > 1 && (
            <div className="mt-6 flex justify-center gap-3">
              {beforeAfterPairs.map((pair, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentIndex(index);
                    setSliderPosition(50);
                  }}
                  className={`rounded-full px-4 py-2 text-xs font-medium transition-all ${
                    currentIndex === index
                      ? "bg-neutral-950 text-white"
                      : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                  }`}
                >
                  {pair.label}
                </button>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}

// ============================================
// 4. SCOPE OF WORK SECTION - Cinematic Scroll Reveal
// ============================================

// Cinematic Scope Item with scroll-based reveal
function CinematicScopeItem({
  item,
  index,
  totalItems,
}: {
  item: { title: string; desc: string };
  index: number;
  totalItems: number;
}) {
  const itemRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(itemRef, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={itemRef}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.15 }}
      className="group relative"
    >
      <div className="flex gap-6 lg:gap-8">
        {/* Number */}
        <div className="flex-shrink-0">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#8f7852]/30 bg-[#8f7852]/10 transition-colors duration-300 group-hover:border-[#8f7852] group-hover:bg-[#8f7852]/20 lg:h-14 lg:w-14">
            <span className="font-SchnyderS text-xl font-light text-[#8f7852] lg:text-2xl">
              {String(index + 1).padStart(2, "0")}
            </span>
          </div>
          {/* Connecting Line */}
          {index < totalItems - 1 && (
            <div className="mx-auto mt-4 h-16 w-px bg-gradient-to-b from-[#8f7852]/30 to-transparent lg:h-20" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 pb-8 lg:pb-12">
          <h3 className="mb-3 font-SchnyderS text-2xl font-light text-white transition-colors duration-300 group-hover:text-[#8f7852] lg:text-3xl">
            {item.title}
          </h3>
          <p className="text-base font-light leading-relaxed text-white/60 lg:text-lg">
            {item.desc}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

// Main Scope Section
function ScopeOfWorkSection({
  project,
  images,
}: {
  project: Project;
  images: Array<{ sourceUrl: string; altText?: string }>;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const scopeItems = project.acfFields?.scopeOfWork || [];

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1.1, 1.2]);

  if (scopeItems.length === 0) return null;

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-neutral-950 py-32 lg:py-48"
    >
      {/* Background Image with Parallax */}
      <motion.div
        className="absolute inset-0"
        style={{ y: bgY, scale: bgScale }}
      >
        {images[0] && (
          <Image
            src={images[0].sourceUrl}
            alt="Scope of Work Background"
            fill
            className="object-cover"
          />
        )}
        <div className="absolute inset-0 bg-neutral-950/85" />
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-950 via-transparent to-neutral-950" />
      </motion.div>

      {/* Decorative Elements */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[10%] top-0 h-full w-px bg-gradient-to-b from-transparent via-[#8f7852]/10 to-transparent" />
        <div className="absolute right-[10%] top-0 h-full w-px bg-gradient-to-b from-transparent via-[#8f7852]/10 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-6 lg:px-12">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center lg:mb-24"
        >
          <div className="mb-4 flex items-center justify-center gap-3">
            <div className="h-px w-8 bg-[#8f7852]" />
            <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#8f7852]">
              Deliverables
            </span>
            <div className="h-px w-8 bg-[#8f7852]" />
          </div>
          <h2 className="font-SchnyderS text-4xl font-light text-white lg:text-5xl xl:text-6xl">
            Scope of <span className="text-[#8f7852]">Work</span>
          </h2>
        </motion.div>

        {/* Scope Items */}
        <div className="space-y-2">
          {scopeItems.map(
            (item: { title: string; desc: string }, index: number) => (
              <CinematicScopeItem
                key={item.title}
                item={item}
                index={index}
                totalItems={scopeItems.length}
              />
            )
          )}
        </div>
      </div>
    </section>
  );
}

// ============================================
// 5. THE OUTCOME SECTION - Character Reveal on Scroll
// ============================================

// Character Reveal Component
function CharacterReveal({
  text,
  scrollYProgress,
  className = "",
}: {
  text: string;
  scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"];
  className?: string;
}) {
  const words = text.split(" ");

  return (
    <span className={className}>
      {words.map((word, wordIndex) => (
        <span key={wordIndex} className="inline-block whitespace-nowrap">
          {word.split("").map((char, charIndex) => {
            const totalChars = text.replace(/ /g, "").length;
            const charPosition =
              text.split(" ").slice(0, wordIndex).join("").length + charIndex;
            const start = charPosition / totalChars;
            const end = Math.min(1, start + 0.03);

            return (
              <CharacterSpan
                key={charIndex}
                char={char}
                scrollYProgress={scrollYProgress}
                start={start * 0.8}
                end={end * 0.8 + 0.1}
              />
            );
          })}
          {wordIndex < words.length - 1 && <span>&nbsp;</span>}
        </span>
      ))}
    </span>
  );
}

// Individual Character with scroll-based opacity
function CharacterSpan({
  char,
  scrollYProgress,
  start,
  end,
}: {
  char: string;
  scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"];
  start: number;
  end: number;
}) {
  const opacity = useTransform(scrollYProgress, [start, end], [0.15, 1]);

  return (
    <motion.span style={{ opacity }} className="inline-block">
      {char}
    </motion.span>
  );
}

function OutcomeSection({ project }: { project: Project }) {
  const sectionRef = useRef<HTMLElement>(null);
  const outcomes = project.acfFields?.outcomes || [];

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const outcomeText = project.acfFields?.outcome || "";

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-neutral-950 py-32 lg:py-48"
    >
      <div className="relative mx-auto max-w-7xl px-6 lg:px-12">
        {/* Section Title */}
        <div className="mb-16 text-center lg:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-4 flex items-center justify-center gap-3"
          >
            <div className="h-px w-8 bg-[#8f7852]" />
            <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#8f7852]">
              Results
            </span>
            <div className="h-px w-8 bg-[#8f7852]" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-SchnyderS text-4xl font-light text-white lg:text-5xl xl:text-6xl"
          >
            The <span className="text-[#8f7852]">Outcome</span>
          </motion.h2>
        </div>

        {/* Character Reveal Text */}
        {outcomeText && (
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-xl font-light leading-relaxed text-white lg:text-2xl xl:text-3xl">
              <CharacterReveal
                text={outcomeText}
                scrollYProgress={scrollYProgress}
              />
            </p>
          </div>
        )}

        {/* Achievement Stats */}
        {outcomes.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mx-auto mt-20 max-w-4xl"
          >
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
              {outcomes.map(
                (stat: { value: string; label: string }, index: number) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="text-center"
                  >
                    <span className="font-SchnyderS text-4xl font-light text-[#8f7852] lg:text-5xl">
                      {stat.value}
                    </span>
                    <p className="mt-2 text-sm font-light text-white/50">
                      {stat.label}
                    </p>
                  </motion.div>
                ),
              )}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}

// ============================================
// 6. OUTCOME & RESULTS SECTION
// (Before/After, Gallery, Videos, Testimonial)
// ============================================
function OutcomeResultsSection({
  project,
  images,
  onImageClick,
}: {
  project: Project;
  images: Array<{ sourceUrl: string; altText?: string }>;
  onImageClick: (index: number) => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  // Before/After pairs
  const beforeAfterPairs = [
    {
      before: images[2]?.sourceUrl || images[0]?.sourceUrl,
      after: images[0]?.sourceUrl,
      label: "Transformation 1",
    },
    {
      before: images[4]?.sourceUrl || images[1]?.sourceUrl,
      after: images[1]?.sourceUrl,
      label: "Transformation 2",
    },
  ];

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(5, Math.min(95, (x / rect.width) * 100));
    setSliderPosition(percentage);
  }, []);

  const handleMouseDown = useCallback(() => setIsDragging(true), []);
  const handleMouseUp = useCallback(() => setIsDragging(false), []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) handleMove(e.clientX);
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging) handleMove(e.touches[0].clientX);
    };

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("touchmove", handleTouchMove);
      window.addEventListener("touchend", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleMouseUp);
    };
  }, [isDragging, handleMove, handleMouseUp]);

  const currentPair = beforeAfterPairs[currentIndex] || beforeAfterPairs[0];

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-neutral-100 py-24 lg:py-32"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="mb-16 text-center"
        >
          <h2 className="font-SchnyderS text-4xl font-light text-neutral-950 lg:text-5xl">
            Outcome & Results
          </h2>
        </motion.div>

        {/* Before/After Slider */}
        {images.length >= 2 && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-16"
          >
            <h3 className="mb-6 text-center font-Satoshi text-sm font-medium uppercase tracking-wider text-neutral-600">
              Before & After
            </h3>
            <div
              ref={containerRef}
              className="group relative mx-auto aspect-[16/9] container cursor-ew-resize overflow-hidden rounded-2xl shadow-xl"
              onMouseDown={handleMouseDown}
              onTouchStart={handleMouseDown}
              onClick={(e) => !isDragging && handleMove(e.clientX)}
            >
              {/* After Image */}
              <div className="absolute inset-0">
                <Image
                  src={currentPair.after}
                  alt="After"
                  fill
                  className="object-cover"
                  sizes="100vw"
                />
                <div className="absolute bottom-6 right-6 flex items-center gap-2 rounded-full bg-[#8f7852] px-4 py-2">
                  <Sparkles className="h-4 w-4 text-neutral-950" />
                  <span className="text-xs font-medium uppercase text-neutral-950">
                    After
                  </span>
                </div>
              </div>

              {/* Before Image (Clipped) */}
              <div
                className="absolute inset-0 z-10 overflow-hidden"
                style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
              >
                <Image
                  src={currentPair.before}
                  alt="Before"
                  fill
                  className="object-cover"
                  sizes="100vw"
                />
                <div className="absolute inset-0 bg-neutral-950/10" />
                <div className="absolute bottom-6 left-6 flex items-center gap-2 rounded-full bg-neutral-950 px-4 py-2">
                  <Clock className="h-4 w-4 text-white/70" />
                  <span className="text-xs font-medium uppercase text-white">
                    Before
                  </span>
                </div>
              </div>

              {/* Slider Handle */}
              <div
                className="absolute bottom-0 top-0 z-20 w-1"
                style={{
                  left: `${sliderPosition}%`,
                  transform: "translateX(-50%)",
                }}
              >
                <div className="h-full w-1 bg-white shadow-lg" />
                <div className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white bg-neutral-950">
                  <div className="flex items-center gap-0.5">
                    <ChevronLeft className="h-4 w-4 text-[#8f7852]" />
                    <ChevronRight className="h-4 w-4 text-[#8f7852]" />
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            {beforeAfterPairs.length > 1 && (
              <div className="mt-6 flex justify-center gap-3">
                {beforeAfterPairs.map((pair, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setCurrentIndex(index);
                      setSliderPosition(50);
                    }}
                    className={`rounded-full px-4 py-2 text-xs font-medium transition-all ${
                      currentIndex === index
                        ? "bg-neutral-950 text-white"
                        : "bg-white text-neutral-600 hover:bg-neutral-200"
                    }`}
                  >
                    {pair.label}
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Video Placeholder */}
        {project.acfFields?.videoUrl && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mb-16"
          >
            <h3 className="mb-6 font-Satoshi text-sm font-medium uppercase tracking-wider text-neutral-600">
              <Video className="mb-0.5 mr-2 inline-block h-4 w-4" />
              Behind the Scenes
            </h3>
            <div className="relative aspect-video overflow-hidden rounded-2xl bg-neutral-950">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#8f7852]">
                  <Play className="ml-1 h-8 w-8 text-neutral-950" />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Testimonial - Only show if data exists */}
        {project.acfFields?.testimonial && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="rounded-3xl bg-[#8f7852] p-10 text-center lg:p-16"
          >
            <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-full bg-neutral-950">
              <Quote className="h-8 w-8 text-[#8f7852]" />
            </div>
            <blockquote className="mx-auto max-w-3xl">
              <p className="font-SchnyderS text-2xl font-light leading-relaxed text-neutral-950 lg:text-3xl">
                &ldquo;{project.acfFields.testimonial}&rdquo;
              </p>
            </blockquote>
            {project.acfFields?.testimonialAuthor && (
              <>
                <div className="mx-auto mt-8 h-px w-16 bg-neutral-950/30" />
                <p className="mt-4 text-sm font-medium text-neutral-950">
                  {project.acfFields.testimonialAuthor}
                </p>
              </>
            )}
          </motion.div>
        )}
      </div>
    </section>
  );
}

// ============================================
// 8. PROJECT NAVIGATION (Prev/Next)
// ============================================
function ProjectNavigationSection({
  allProjects,
  currentSlug,
}: {
  allProjects: Project[];
  currentSlug: string;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const currentIndex = allProjects.findIndex((p) => p.slug === currentSlug);
  const prevProject =
    currentIndex > 0
      ? allProjects[currentIndex - 1]
      : allProjects[allProjects.length - 1];
  const nextProject =
    currentIndex < allProjects.length - 1
      ? allProjects[currentIndex + 1]
      : allProjects[0];

  // Show section even with fewer projects - the CTA is always valuable
  const hasPrevNext = allProjects.length >= 2;

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-neutral-950"
    >
      <div className={`grid ${hasPrevNext ? "lg:grid-cols-3" : ""}`}>
        {/* Previous Project */}
        {hasPrevNext && (
          <Link
            href={`/projects/${prevProject.slug}`}
            className="group relative h-[35vh] min-h-[280px] overflow-hidden"
          >
            <motion.div
              initial={{ scale: 1.1 }}
              whileHover={{ scale: 1 }}
              transition={{ duration: 0.7 }}
              className="absolute inset-0"
            >
              <Image
                src={
                  prevProject.featuredImage?.node?.sourceUrl ||
                  "/placeholder.jpg"
                }
                alt={prevProject.title || "Previous Project"}
                fill
                className="object-cover"
                sizes="33vw"
              />
              <div className="absolute inset-0 bg-neutral-950/70 transition-colors group-hover:bg-neutral-950/50" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              className="relative z-10 flex h-full flex-col justify-center px-6 lg:px-8"
            >
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/5 transition-colors group-hover:border-[#8f7852]/50 lg:h-10 lg:w-10">
                  <ChevronLeft className="h-4 w-4 text-white transition-colors group-hover:text-[#8f7852] lg:h-5 lg:w-5" />
                </div>
                <span className="text-[10px] font-light uppercase tracking-wider text-white/50 lg:text-xs">
                  Previous
                </span>
              </div>
              <h3 className="font-SchnyderS text-xl font-light text-white transition-colors group-hover:text-[#8f7852] lg:text-2xl">
                {prevProject.title}
              </h3>
              {prevProject.acfFields?.projectType && (
                <span className="mt-2 text-[10px] font-light uppercase tracking-wider text-white/40">
                  {prevProject.acfFields.projectType}
                </span>
              )}
            </motion.div>
          </Link>
        )}

        {/* Center CTA - Book Consultation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative flex h-[35vh] min-h-[280px] flex-col items-center justify-center border-x border-white/10 bg-gradient-to-b from-neutral-900 to-neutral-950 px-6 lg:px-8"
        >
          {/* Decorative Elements */}
          <div className="absolute left-6 top-6 h-12 w-12">
            <div className="absolute left-0 top-0 h-6 w-px bg-[#8f7852]/30" />
            <div className="absolute left-0 top-0 h-px w-6 bg-[#8f7852]/30" />
          </div>
          <div className="absolute bottom-6 right-6 h-12 w-12">
            <div className="absolute bottom-0 right-0 h-6 w-px bg-[#8f7852]/30" />
            <div className="absolute bottom-0 right-0 h-px w-6 bg-[#8f7852]/30" />
          </div>

          {/* Content */}
          <div className="text-center">
            <span className="mb-3 inline-block text-[10px] font-medium uppercase tracking-[0.2em] text-[#8f7852] lg:text-xs">
              Ready to Start?
            </span>
            <h3 className="mb-4 font-SchnyderS text-2xl font-light text-white lg:text-3xl">
              Let&apos;s Create
              <br />
              <span className="text-[#8f7852]">Something Exceptional</span>
            </h3>
            <p className="mb-6 max-w-xs text-sm font-light leading-relaxed text-white/60">
              Transform your vision into reality with our expert team
            </p>
            <Link
              href="/contact/book-consultation"
              className="group/btn inline-flex items-center gap-3 rounded-full border border-[#8f7852] bg-[#8f7852]/10 px-6 py-3 transition-all hover:bg-[#8f7852] lg:px-8"
            >
              <span className="text-sm font-medium text-[#8f7852] transition-colors group-hover/btn:text-neutral-950">
                Book Consultation
              </span>
              <ArrowRight className="h-4 w-4 text-[#8f7852] transition-all group-hover/btn:translate-x-1 group-hover/btn:text-neutral-950" />
            </Link>
          </div>
        </motion.div>

        {/* Next Project */}
        {hasPrevNext && (
          <Link
            href={`/projects/${nextProject.slug}`}
            className="group relative h-[35vh] min-h-[280px] overflow-hidden"
          >
            <motion.div
              initial={{ scale: 1.1 }}
              whileHover={{ scale: 1 }}
              transition={{ duration: 0.7 }}
              className="absolute inset-0"
            >
              <Image
                src={
                  nextProject.featuredImage?.node?.sourceUrl ||
                  "/placeholder.jpg"
                }
                alt={nextProject.title || "Next Project"}
                fill
                className="object-cover"
                sizes="33vw"
              />
              <div className="absolute inset-0 bg-neutral-950/70 transition-colors group-hover:bg-neutral-950/50" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              className="relative z-10 flex h-full flex-col items-end justify-center px-6 text-right lg:px-8"
            >
              <div className="mb-3 flex items-center gap-2">
                <span className="text-[10px] font-light uppercase tracking-wider text-white/50 lg:text-xs">
                  Next
                </span>
                <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/5 transition-colors group-hover:border-[#8f7852]/50 lg:h-10 lg:w-10">
                  <ChevronRight className="h-4 w-4 text-white transition-colors group-hover:text-[#8f7852] lg:h-5 lg:w-5" />
                </div>
              </div>
              <h3 className="font-SchnyderS text-xl font-light text-white transition-colors group-hover:text-[#8f7852] lg:text-2xl">
                {nextProject.title}
              </h3>
              {nextProject.acfFields?.projectType && (
                <span className="mt-2 text-[10px] font-light uppercase tracking-wider text-white/40">
                  {nextProject.acfFields.projectType}
                </span>
              )}
            </motion.div>
          </Link>
        )}
      </div>
    </section>
  );
}

// ============================================
// 9. RELATED PROJECTS SECTION
// ============================================
function RelatedProjectsSection({
  projects,
  currentSlug,
}: {
  projects: Project[];
  currentSlug: string;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const filtered =
    projects?.filter((p) => p.slug !== currentSlug).slice(0, 3) || [];

  if (filtered.length === 0) return null;

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-white py-24 lg:py-32"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="mb-12 flex items-end justify-between"
        >
          <div>
            <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#8f7852]">
              Explore More
            </span>
            <h2 className="mt-2 font-SchnyderS text-3xl font-light text-neutral-950 lg:text-4xl">
              Related Projects
            </h2>
          </div>
          <Link
            href="/projects"
            className="group hidden items-center gap-2 text-sm font-light text-neutral-600 hover:text-neutral-950 md:flex"
          >
            View All
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          {filtered.map((project, index) => (
            <motion.div
              key={project.slug}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 * index }}
            >
              <Link href={`/projects/${project.slug}`} className="group block">
                <div className="relative mb-4 aspect-[4/3] overflow-hidden rounded-xl">
                  <Image
                    src={
                      project.featuredImage?.node?.sourceUrl ||
                      "/placeholder.jpg"
                    }
                    alt={project.title || "Project"}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="33vw"
                  />
                </div>
                {project.acfFields?.projectType && (
                  <span className="text-[10px] font-light uppercase tracking-wider text-neutral-400">
                    {project.acfFields.projectType}
                  </span>
                )}
                <h3 className="mt-1 font-SchnyderS text-xl font-light text-neutral-950 transition-colors group-hover:text-[#8f7852]">
                  {project.title}
                </h3>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================
export function EnhancedProjectPageClient({
  project,
  relatedProjects = [],
  allProjects = [],
}: ProjectPageClientProps) {
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Process gallery images
  const galleryImages = filterValidImages([
    ...(project.acfFields?.gallery || []),
    project.featuredImage?.node,
  ]).map((img) => ({
    sourceUrl: getSafeImageUrl(img?.sourceUrl),
    altText: img?.altText || project.title || "Project image",
  }));

  const heroImage =
    galleryImages[0]?.sourceUrl && galleryImages[0].sourceUrl !== ""
      ? galleryImages[0].sourceUrl
      : project.featuredImage?.node?.sourceUrl &&
          project.featuredImage.node.sourceUrl !== ""
        ? project.featuredImage.node.sourceUrl
        : "/founder/CID_2106_00_COVER.jpg";

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
    setGalleryOpen(true);
  };

  return (
    <>
      <main>
        {/* 1. Hero Banner - Project Name */}
        <HeroBanner project={project} heroImage={heroImage} />

        {/* 2. Overview + Challenge (Side by Side) + Gallery */}
        <OverviewChallengeSection
          project={project}
          images={galleryImages}
          onImageClick={handleImageClick}
        />

        {/* 3. Design Approach */}
        <DesignApproachSection project={project} images={galleryImages} />

        {/* 3.5 Before & After */}
        <BeforeAfterSection images={galleryImages} />

        {/* 4. Scope of Work - Immersive Scroll Reveal */}
        <ScopeOfWorkSection project={project} images={galleryImages} />

        {/* 5. The Outcome */}
        <OutcomeSection project={project} />

        {/* 6. Outcome & Results (Before/After, Gallery, Videos, Testimonial) */}
        <OutcomeResultsSection
          project={project}
          images={galleryImages}
          onImageClick={handleImageClick}
        />

        {/* 9. Related Projects */}
        <RelatedProjectsSection
          projects={relatedProjects.length > 0 ? relatedProjects : allProjects}
          currentSlug={project.slug || ""}
        />

        {/* 8. Project Navigation (Prev/Next) */}
        <ProjectNavigationSection
          allProjects={allProjects}
          currentSlug={project.slug || ""}
        />
      </main>

      {/* Gallery Modal */}
      <ImageGalleryModal
        images={galleryImages}
        isOpen={galleryOpen}
        onClose={() => setGalleryOpen(false)}
        initialIndex={selectedImageIndex}
      />
    </>
  );
}
