"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Service, Industry, Project } from "@/lib/wordpress";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useInView,
} from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Share2,
  ChevronRight,
  MapPin,
  Play,
} from "lucide-react";
import { ImageGalleryModal } from "@/components/image-gallery-modal";

interface ServiceDetailProps {
  service: Service;
  relatedIndustries: Industry[];
  relatedProjects: Project[];
  allServices: Service[];
}

// Stagger animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      damping: 25,
      stiffness: 100,
    },
  },
};

const imageRevealVariants = {
  hidden: { opacity: 0, scale: 1.1 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 1.2,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

// Animated Section Component
function AnimatedSection({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={containerVariants}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Animated Image Component with reveal effect
function AnimatedImage({
  src,
  alt,
  className = "",
  priority = false,
  aspectRatio = "aspect-[4/3]",
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  aspectRatio?: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={imageRevealVariants}
      className={`relative overflow-hidden ${aspectRatio} ${className}`}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        priority={priority}
        quality={90}
      />
    </motion.div>
  );
}

export default function EnhancedServiceDetail({
  service,
  relatedIndustries,
  relatedProjects,
  allServices,
}: ServiceDetailProps) {
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const containerRef = useRef(null);
  const heroRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const { scrollYProgress: heroScrollProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Hero parallax effects
  const heroImageY = useTransform(heroScrollProgress, [0, 1], ["0%", "30%"]);
  const heroImageScale = useTransform(heroScrollProgress, [0, 1], [1, 1.15]);
  const heroOpacity = useTransform(heroScrollProgress, [0, 0.8], [1, 0]);
  const heroTextY = useTransform(heroScrollProgress, [0, 1], ["0%", "50%"]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: service.title,
          text: service.excerpt || `Explore our ${service.title} services`,
          url: window.location.href,
        });
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  // Find next/previous services
  const currentIndex = allServices.findIndex((s) => s.id === service.id);
  const previousService =
    currentIndex > 0 ? allServices[currentIndex - 1] : null;
  const nextService =
    currentIndex < allServices.length - 1
      ? allServices[currentIndex + 1]
      : null;

  // Features and process
  const features = service.acfFields?.serviceFeatures ||
    service.acfFields?.features || [
      {
        title: "Expert Design",
        description: "Professional design solutions tailored to your needs",
      },
      {
        title: "Quality Materials",
        description: "Premium materials and finishes",
      },
      {
        title: "Timely Delivery",
        description: "Projects completed on schedule",
      },
    ];

  const processSteps = service.acfFields?.processSteps ||
    service.acfFields?.process || [
      {
        step: 1,
        title: "Consultation",
        description: "Understanding your vision and requirements",
      },
      {
        step: 2,
        title: "Design",
        description: "Creating detailed plans and visualizations",
      },
      {
        step: 3,
        title: "Execution",
        description: "Bringing the design to life with precision",
      },
      { step: 4, title: "Delivery", description: "Final touches and handover" },
    ];

  const galleryImages = relatedProjects
    .slice(0, 6)
    .map((p) => ({
      sourceUrl: p.featuredImage?.node?.sourceUrl || "",
      altText: p.title,
    }))
    .filter((img) => img.sourceUrl);

  // Get multiple images for the cinematic gallery
  const projectImages = relatedProjects
    .slice(0, 8)
    .filter((p) => p.featuredImage?.node?.sourceUrl);

  return (
    <>
      {/* Progress indicator */}
      <motion.div
        className="fixed left-0 top-0 z-50 h-0.5 bg-[#c9a962] origin-left"
        style={{ scaleX: smoothProgress }}
      />

      <main ref={containerRef} className="relative bg-[#faf8f5]">
        {/* ========== HERO SECTION ========== */}
        <section
          ref={heroRef}
          className="relative h-[100svh] min-h-[600px] overflow-hidden"
        >
          {/* Background Image with Parallax */}
          <motion.div
            className="absolute inset-0"
            style={{ y: heroImageY, scale: heroImageScale }}
          >
            {service.featuredImage?.node?.sourceUrl && (
              <Image
                src={service.featuredImage.node.sourceUrl}
                alt={service.title}
                fill
                className="object-cover"
                priority
                quality={95}
              />
            )}
            {/* Cinematic overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/60 via-transparent to-transparent" />
          </motion.div>

          {/* Hero Content */}
          <motion.div
            className="relative z-10 flex h-full flex-col"
            style={{ opacity: heroOpacity }}
          >
            {/* Top Navigation */}
            <div className="px-6 pt-24 lg:px-12 lg:pt-32">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="flex items-center justify-between"
              >
                <Link
                  href="/services"
                  className="group inline-flex items-center gap-3 text-white/70 transition-colors hover:text-white"
                >
                  <ArrowLeft
                    size={18}
                    className="transition-transform group-hover:-translate-x-1"
                  />
                  <span className="font-Satoshi text-sm tracking-wide">
                    Back to Services
                  </span>
                </Link>

                <motion.button
                  onClick={handleShare}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-2 border border-white/20 bg-white/5 px-5 py-2.5 font-Satoshi text-sm text-white backdrop-blur-sm transition-all hover:bg-white/10"
                >
                  <Share2 size={14} />
                  <span>Share</span>
                </motion.button>
              </motion.div>
            </div>

            {/* Main Hero Content */}
            <motion.div
              className="mt-auto px-6 pb-16 lg:px-12 lg:pb-24"
              style={{ y: heroTextY }}
            >
              <div className="mx-auto max-w-7xl">
                {/* Service Label */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="mb-6 flex items-center gap-4"
                >
                  <div className="h-px w-16 bg-[#c9a962]/50" />
                  <span className="font-Satoshi text-xs font-medium uppercase tracking-[0.3em] text-[#c9a962]">
                    Our Services
                  </span>
                </motion.div>

                {/* Title with stagger */}
                <div className="overflow-hidden">
                  <motion.h1
                    initial={{ y: 120, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{
                      delay: 0.6,
                      duration: 1,
                      ease: [0.25, 0.1, 0.25, 1],
                    }}
                    className="font-SchnyderS text-5xl font-light leading-[1.1] tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl"
                  >
                    {service.title}
                  </motion.h1>
                </div>

                {/* Description */}
                <motion.p
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9, duration: 0.8 }}
                  className="mt-8 max-w-2xl font-Satoshi text-lg font-light leading-relaxed text-white/80 md:text-xl"
                >
                  {service.excerpt ||
                    "Discover our comprehensive design and construction solutions tailored to your vision."}
                </motion.p>
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* ========== OVERVIEW SECTION ========== */}
        <AnimatedSection className="py-24 lg:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-12">
            <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
              {/* Left: Section Title */}
              <motion.div variants={itemVariants}>
                <span className="font-Satoshi text-xs font-medium uppercase tracking-[0.3em] text-[#c9a962]">
                  What We Offer
                </span>
                <h2 className="mt-4 font-SchnyderS text-4xl font-light leading-tight text-neutral-950 md:text-5xl lg:text-6xl">
                  Service
                  <br />
                  Overview
                </h2>
                <div className="mt-6 h-px w-24 bg-[#c9a962]" />
              </motion.div>

              {/* Right: Content */}
              <motion.div variants={itemVariants} className="lg:pt-8">
                <div
                  className="prose prose-lg prose-neutral max-w-none font-Satoshi font-light leading-relaxed text-neutral-600"
                  dangerouslySetInnerHTML={{
                    __html:
                      service.content ||
                      service.excerpt ||
                      "<p>Comprehensive design solutions tailored to your unique needs.</p>",
                  }}
                />
              </motion.div>
            </div>
          </div>
        </AnimatedSection>

        {/* ========== CINEMATIC IMAGE BREAK ========== */}
        {projectImages.length > 0 && (
          <section className="relative py-4">
            <AnimatedSection>
              <div className="grid grid-cols-2 gap-4 px-4 md:grid-cols-4 lg:px-8">
                {projectImages.slice(0, 4).map((project, index) => (
                  <motion.div
                    key={project.id}
                    variants={itemVariants}
                    className="group relative cursor-pointer overflow-hidden"
                    onClick={() => {
                      setSelectedImageIndex(index);
                      setGalleryOpen(true);
                    }}
                  >
                    <div
                      className={`relative ${index === 0 || index === 3 ? "aspect-[3/4]" : "aspect-square"}`}
                    >
                      <Image
                        src={project.featuredImage?.node?.sourceUrl || ""}
                        alt={project.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-neutral-950/0 transition-all duration-500 group-hover:bg-neutral-950/40" />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/30 bg-white/10 backdrop-blur-sm">
                          <Play className="h-5 w-5 text-white" fill="white" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </AnimatedSection>
          </section>
        )}

        {/* ========== FEATURES SECTION ========== */}
        {features.length > 0 && (
          <AnimatedSection className="bg-white py-24 lg:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-12">
              {/* Section Header */}
              <motion.div
                variants={itemVariants}
                className="mb-16 text-center lg:mb-20"
              >
                <span className="font-Satoshi text-xs font-medium uppercase tracking-[0.3em] text-[#c9a962]">
                  Key Features
                </span>
                <h2 className="mt-4 font-SchnyderS text-4xl font-light text-neutral-950 md:text-5xl">
                  What Sets Us Apart
                </h2>
              </motion.div>

              {/* Features Grid */}
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
                {features.map(
                  (
                    feature: { title: string; description: string },
                    index: number
                  ) => (
                    <motion.div
                      key={index}
                      variants={itemVariants}
                      className="group relative overflow-hidden border border-neutral-200 bg-[#faf8f5] p-8 transition-all duration-500 hover:border-[#c9a962]/30 hover:shadow-2xl lg:p-10"
                    >
                      {/* Content */}
                      <div className="relative z-10">
                        <h3 className="mb-3 font-SchnyderS text-2xl font-light text-neutral-950">
                          {feature.title}
                        </h3>
                        <p className="font-Satoshi text-base font-light leading-relaxed text-neutral-600">
                          {feature.description}
                        </p>
                      </div>

                      {/* Hover accent */}
                      <div className="absolute bottom-0 left-0 h-1 w-0 bg-[#c9a962] transition-all duration-500 group-hover:w-full" />
                    </motion.div>
                  )
                )}
              </div>
            </div>
          </AnimatedSection>
        )}

        {/* ========== FULL-WIDTH IMAGE DIVIDER ========== */}
        {projectImages.length > 4 && (
          <section className="relative h-[60vh] min-h-[400px] overflow-hidden">
            <AnimatedImage
              src={projectImages[4]?.featuredImage?.node?.sourceUrl || ""}
              alt={projectImages[4]?.title || "Project showcase"}
              aspectRatio="absolute inset-0"
              className="h-full w-full"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/70 via-neutral-950/30 to-transparent" />

            {/* Floating text */}
            <AnimatedSection className="absolute inset-0 flex items-center">
              <div className="mx-auto max-w-7xl px-6 lg:px-12">
                <motion.div variants={itemVariants}>
                  <span className="font-Satoshi text-xs font-medium uppercase tracking-[0.3em] text-[#c9a962]">
                    Excellence in Every Detail
                  </span>
                  <h3 className="mt-4 max-w-xl font-SchnyderS text-4xl font-light leading-tight text-white md:text-5xl">
                    Crafting spaces that inspire and endure
                  </h3>
                </motion.div>
              </div>
            </AnimatedSection>
          </section>
        )}

        {/* ========== PROCESS SECTION ========== */}
        {processSteps.length > 0 && (
          <AnimatedSection className="bg-neutral-950 py-24 lg:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-12">
              {/* Section Header */}
              <motion.div variants={itemVariants} className="mb-16 lg:mb-20">
                <span className="font-Satoshi text-xs font-medium uppercase tracking-[0.3em] text-[#c9a962]">
                  Our Approach
                </span>
                <h2 className="mt-4 font-SchnyderS text-4xl font-light text-white md:text-5xl lg:text-6xl">
                  Design Process
                </h2>
              </motion.div>

              {/* Process Steps */}
              <div className="relative">
                <div className="space-y-8 lg:space-y-12">
                  {processSteps.map(
                    (
                      step: {
                        step?: number;
                        title: string;
                        description: string;
                      },
                      index: number
                    ) => (
                      <motion.div
                        key={index}
                        variants={itemVariants}
                        className="group relative border-l border-white/20 pl-8 transition-all duration-500 hover:border-[#c9a962]/50"
                      >
                        {/* Content */}
                        <div className="pb-8 lg:pb-12">
                          <h3 className="mb-3 font-SchnyderS text-2xl font-light text-white transition-colors duration-500 group-hover:text-[#c9a962] md:text-3xl">
                            {step.title}
                          </h3>
                          <p className="max-w-2xl font-Satoshi text-base font-light leading-relaxed text-white/60">
                            {step.description}
                          </p>
                        </div>
                      </motion.div>
                    )
                  )}
                </div>
              </div>
            </div>
          </AnimatedSection>
        )}

        {/* ========== PROJECTS GALLERY ========== */}
        {relatedProjects.length > 0 && (
          <AnimatedSection className="py-24 lg:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-12">
              {/* Section Header */}
              <motion.div
                variants={itemVariants}
                className="mb-12 flex items-end justify-between lg:mb-16"
              >
                <div>
                  <span className="font-Satoshi text-xs font-medium uppercase tracking-[0.3em] text-[#c9a962]">
                    Portfolio
                  </span>
                  <h2 className="mt-4 font-SchnyderS text-4xl font-light text-neutral-950 md:text-5xl">
                    Recent Projects
                  </h2>
                </div>
                <Link
                  href="/projects"
                  className="hidden items-center gap-2 font-Satoshi text-sm text-neutral-600 transition-colors hover:text-neutral-950 md:inline-flex"
                >
                  <span>View All</span>
                  <ArrowRight size={16} />
                </Link>
              </motion.div>

              {/* Projects Grid - Bento Style */}
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {relatedProjects.slice(0, 6).map((project, index) => (
                  <motion.div
                    key={project.id}
                    variants={itemVariants}
                    className={`group ${index === 0 ? "md:col-span-2 md:row-span-2" : ""}`}
                  >
                    <Link
                      href={`/projects/${project.slug}`}
                      className="block h-full"
                    >
                      <div
                        className={`relative overflow-hidden ${index === 0 ? "aspect-[4/3] md:aspect-square" : "aspect-[4/3]"}`}
                      >
                        {project.featuredImage?.node?.sourceUrl && (
                          <Image
                            src={project.featuredImage.node.sourceUrl}
                            alt={project.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        )}
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-neutral-950/20 to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-80" />

                        {/* Content */}
                        <div className="absolute inset-0 flex flex-col justify-end p-6 lg:p-8">
                          {project.acfFields?.projectType && (
                            <span className="mb-2 font-Satoshi text-xs uppercase tracking-wider text-[#c9a962]">
                              {project.acfFields.projectType}
                            </span>
                          )}
                          <h3
                            className={`font-SchnyderS font-light text-white ${index === 0 ? "text-3xl md:text-4xl" : "text-2xl"}`}
                          >
                            {project.title}
                          </h3>
                          {project.acfFields?.location && (
                            <div className="mt-2 flex items-center gap-2 font-Satoshi text-sm text-white/70">
                              <MapPin size={14} />
                              {project.acfFields.location}
                            </div>
                          )}
                        </div>

                        {/* Hover Arrow */}
                        <div className="absolute right-6 top-6 flex h-12 w-12 items-center justify-center border border-white/0 bg-white/0 opacity-0 transition-all duration-500 group-hover:border-white/30 group-hover:bg-white/10 group-hover:opacity-100">
                          <ArrowRight className="h-5 w-5 text-white" />
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* Mobile CTA */}
              <motion.div
                variants={itemVariants}
                className="mt-10 text-center md:hidden"
              >
                <Link
                  href="/projects"
                  className="inline-flex items-center gap-2 border border-neutral-950 px-8 py-4 font-Satoshi text-sm text-neutral-950 transition-all hover:bg-neutral-950 hover:text-white"
                >
                  <span>View All Projects</span>
                  <ArrowRight size={16} />
                </Link>
              </motion.div>
            </div>
          </AnimatedSection>
        )}

        {/* ========== RELATED INDUSTRIES ========== */}
        {relatedIndustries.length > 0 && (
          <AnimatedSection className="border-t border-neutral-200 bg-white py-24 lg:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-12">
              <motion.div variants={itemVariants} className="mb-12 lg:mb-16">
                <span className="font-Satoshi text-xs font-medium uppercase tracking-[0.3em] text-[#c9a962]">
                  Industries We Serve
                </span>
                <h2 className="mt-4 font-SchnyderS text-4xl font-light text-neutral-950 md:text-5xl">
                  Related Sectors
                </h2>
              </motion.div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {relatedIndustries.slice(0, 3).map((industry, index) => (
                  <motion.div key={industry.id} variants={itemVariants}>
                    <Link
                      href={`/industries/${industry.slug}`}
                      className="group block h-full border border-neutral-200 bg-[#faf8f5] p-8 transition-all duration-500 hover:border-[#c9a962]/30 hover:shadow-xl lg:p-10"
                    >
                      <h3 className="mb-3 font-SchnyderS text-2xl font-light text-neutral-950 transition-colors group-hover:text-[#c9a962]">
                        {industry.title}
                      </h3>
                      <p className="mb-6 font-Satoshi text-base font-light leading-relaxed text-neutral-600">
                        {industry.excerpt ||
                          "Specialized design solutions for this sector."}
                      </p>
                      <div className="inline-flex items-center gap-2 font-Satoshi text-sm text-neutral-950 transition-transform duration-300 group-hover:translate-x-2">
                        <span>Explore</span>
                        <ArrowRight size={14} />
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </AnimatedSection>
        )}

        {/* ========== CTA SECTION ========== */}
        <AnimatedSection className="bg-neutral-950 py-24 lg:py-32">
          <div className="mx-auto max-w-4xl px-6 text-center lg:px-12">
            <motion.div variants={itemVariants}>
              <span className="font-Satoshi text-xs font-medium uppercase tracking-[0.3em] text-[#c9a962]">
                Start Your Project
              </span>
              <h2 className="mt-4 font-SchnyderS text-4xl font-light text-white md:text-5xl lg:text-6xl">
                Ready to transform your space?
              </h2>
              <p className="mx-auto mt-6 max-w-xl font-Satoshi text-lg font-light text-white/70">
                Let's discuss how we can bring your vision to life with our{" "}
                {service.title.toLowerCase()} expertise.
              </p>
              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 bg-[#c9a962] px-8 py-4 font-Satoshi text-sm font-medium text-neutral-950 transition-all hover:bg-[#b8954f]"
                >
                  <span>Get in Touch</span>
                  <ArrowRight size={16} />
                </Link>
                <Link
                  href="/projects"
                  className="inline-flex items-center gap-2 border border-white/30 px-8 py-4 font-Satoshi text-sm text-white transition-all hover:bg-white/10"
                >
                  <span>View Our Work</span>
                </Link>
              </div>
            </motion.div>
          </div>
        </AnimatedSection>

        {/* ========== NEXT/PREVIOUS NAVIGATION ========== */}
        <div className="border-t border-neutral-800 bg-neutral-950">
          <div className="mx-auto max-w-7xl">
            <div className="grid md:grid-cols-2">
              {previousService && (
                <Link
                  href={`/services/${previousService.slug}`}
                  className="group relative border-b border-neutral-800 p-10 transition-colors hover:bg-neutral-900 md:border-b-0 md:border-r lg:p-16"
                >
                  <div className="flex items-center gap-3 font-Satoshi text-xs uppercase tracking-wider text-white/40">
                    <ChevronRight size={14} className="rotate-180" />
                    <span>Previous</span>
                  </div>
                  <h3 className="mt-4 font-SchnyderS text-2xl font-light text-white transition-colors group-hover:text-[#c9a962] lg:text-3xl">
                    {previousService.title}
                  </h3>
                </Link>
              )}

              {nextService && (
                <Link
                  href={`/services/${nextService.slug}`}
                  className="group relative p-10 text-right transition-colors hover:bg-neutral-900 lg:p-16"
                >
                  <div className="flex items-center justify-end gap-3 font-Satoshi text-xs uppercase tracking-wider text-white/40">
                    <span>Next</span>
                    <ChevronRight size={14} />
                  </div>
                  <h3 className="mt-4 font-SchnyderS text-2xl font-light text-white transition-colors group-hover:text-[#c9a962] lg:text-3xl">
                    {nextService.title}
                  </h3>
                </Link>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Gallery Modal */}
      {galleryImages.length > 0 && (
        <ImageGalleryModal
          images={galleryImages}
          isOpen={galleryOpen}
          onClose={() => setGalleryOpen(false)}
          initialIndex={selectedImageIndex}
        />
      )}
    </>
  );
}
