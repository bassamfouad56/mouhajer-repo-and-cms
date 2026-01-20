"use client";

import { useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
} from "framer-motion";
import { ArrowUpRight, ArrowRight, MapPin } from "lucide-react";
import { SafeImage } from "@/components/safe-image";
import { getProjectPlaceholder } from "@/lib/image-utils";
import Link from "next/link";

interface Project {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  featuredImage: {
    node: {
      sourceUrl: string;
      altText: string;
    };
  };
  acfFields?: {
    location?: string;
    projectType?: string;
    yearCompleted?: string;
  };
}

interface PortfolioShowcaseProps {
  projects: Project[];
}

// Fallback projects if no data
const fallbackProjects = [
  {
    id: "1",
    slug: "district-one-palace",
    title: "District One Palace",
    excerpt:
      "A magnificent new build construction featuring contemporary Arabian architecture with state-of-the-art amenities.",
    featuredImage: {
      node: {
        sourceUrl: "/placeholder.jpg",
        altText: "District One Palace",
      },
    },
    acfFields: {
      location: "District One, Dubai",
      projectType: "New Build Construction",
      yearCompleted: "2024",
    },
  },
  {
    id: "2",
    slug: "sheraton-abu-dhabi",
    title: "Sheraton Abu Dhabi",
    excerpt:
      "Complete renovation and fit-out of a 5-star hotel maintaining operations throughout the transformation.",
    featuredImage: {
      node: {
        sourceUrl: "/placeholder.jpg",
        altText: "Sheraton Abu Dhabi",
      },
    },
    acfFields: {
      location: "Corniche, Abu Dhabi",
      projectType: "Renovation & Fit-Out",
      yearCompleted: "2023",
    },
  },
  {
    id: "3",
    slug: "palm-jumeirah-villa",
    title: "Palm Jumeirah Frond N",
    excerpt:
      "Turnkey design and build of a modern beachfront villa with panoramic views of the Arabian Gulf.",
    featuredImage: {
      node: {
        sourceUrl: "/placeholder.jpg",
        altText: "Palm Jumeirah Villa",
      },
    },
    acfFields: {
      location: "Palm Jumeirah, Dubai",
      projectType: "Turnkey Design & Build",
      yearCompleted: "2024",
    },
  },
  {
    id: "4",
    slug: "burj-vista-office",
    title: "Burj Vista Office",
    excerpt:
      "Premium commercial fit-out featuring executive offices and collaborative spaces with stunning Burj views.",
    featuredImage: {
      node: {
        sourceUrl: "/placeholder.jpg",
        altText: "Burj Vista Office",
      },
    },
    acfFields: {
      location: "Downtown Dubai",
      projectType: "Commercial Fit-Out",
      yearCompleted: "2023",
    },
  },
  {
    id: "5",
    slug: "emirates-hills-mansion",
    title: "Emirates Hills Mansion",
    excerpt:
      "Ultra-luxury mansion with bespoke interiors, private cinema, and championship golf course views.",
    featuredImage: {
      node: {
        sourceUrl: "/placeholder.jpg",
        altText: "Emirates Hills Mansion",
      },
    },
    acfFields: {
      location: "Emirates Hills, Dubai",
      projectType: "Luxury Residential",
      yearCompleted: "2024",
    },
  },
  {
    id: "6",
    slug: "jbr-penthouse",
    title: "JBR Penthouse",
    excerpt:
      "Sky-high penthouse with floor-to-ceiling windows and bespoke Italian finishes throughout.",
    featuredImage: {
      node: {
        sourceUrl: "/placeholder.jpg",
        altText: "JBR Penthouse",
      },
    },
    acfFields: {
      location: "JBR, Dubai",
      projectType: "Luxury Penthouse",
      yearCompleted: "2024",
    },
  },
];

export function PortfolioShowcase({ projects }: PortfolioShowcaseProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Check if projects have valid images
  const projectsWithImages = projects.map((project, index) => {
    const hasValidImage =
      project.featuredImage?.node?.sourceUrl &&
      project.featuredImage.node.sourceUrl.length > 0;
    if (hasValidImage) return project;
    const fallbackProject = fallbackProjects[index % fallbackProjects.length];
    return {
      ...project,
      featuredImage: fallbackProject.featuredImage,
    };
  });

  const displayProjects =
    projects.length > 0 ? projectsWithImages.slice(0, 6) : fallbackProjects;

  // Scroll animation setup
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Update active index based on scroll
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const newIndex = Math.min(
      displayProjects.length - 1,
      Math.floor(latest * displayProjects.length)
    );
    if (newIndex !== activeIndex && newIndex >= 0) {
      setActiveIndex(newIndex);
    }
  });

  // Get current active project
  const activeProject = displayProjects[activeIndex];

  // Progress for animations
  const backgroundOpacity = useTransform(scrollYProgress, [0, 0.1], [0, 1]);
  const headerY = useTransform(scrollYProgress, [0, 0.15], [50, 0]);
  const headerOpacity = useTransform(scrollYProgress, [0, 0.15], [0, 1]);

  return (
    <section
      ref={sectionRef}
      id="portfolio"
      className="relative bg-[#faf9f6]"
      style={{ height: `${100 + displayProjects.length * 80}vh` }}
    >
      {/* Sticky Container */}
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Background Images - Crossfade */}
        {displayProjects.map((project, index) => {
          const start = index / displayProjects.length;
          const end = (index + 1) / displayProjects.length;
          const opacity = useTransform(
            scrollYProgress,
            [
              Math.max(0, start - 0.05),
              start,
              end - 0.05,
              Math.min(1, end + 0.05),
            ],
            [0, 1, 1, 0]
          );

          return (
            <motion.div
              key={project.id}
              className="absolute inset-0"
              style={{ opacity }}
            >
              <SafeImage
                src={project.featuredImage.node.sourceUrl}
                alt={project.featuredImage.node.altText || project.title}
                fallbackSrc={getProjectPlaceholder(
                  project.title,
                  project.acfFields?.projectType
                )}
                fill
                className="object-cover"
                priority={index === 0}
              />
              {/* Elegant gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/90 via-neutral-950/60 to-neutral-950/40" />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-neutral-950/30" />
            </motion.div>
          );
        })}

        {/* Content Container */}
        <div className="relative z-10 flex h-full flex-col">
          {/* Header */}
          <motion.div
            className="mx-auto w-full max-w-7xl px-6 pt-20 lg:px-12 lg:pt-24"
            style={{ y: headerY, opacity: headerOpacity }}
          >
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              {/* Left: Section Title */}
              <div>
                <div className="mb-4 flex items-center gap-4">
                  <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#c9a962]" />
                  <span className="font-Satoshi text-[10px] font-medium uppercase tracking-[0.4em] text-[#c9a962]">
                    Portfolio of Excellence
                  </span>
                </div>

                <h2 className="font-SchnyderS text-4xl font-light tracking-tight text-white sm:text-5xl lg:text-6xl xl:text-7xl">
                  A Legacy of
                  <br />
                  <span className="text-[#c9a962]">Built Projects</span>
                </h2>
              </div>

              {/* Right: Stats & CTA */}
              <div className="flex flex-col items-start gap-4 lg:items-end">
                <p className="font-Satoshi text-sm font-light text-white/60 lg:text-base">
                  400+ Delivered. Zero Failed Handovers.
                </p>
                <Link
                  href="/projects"
                  className="group inline-flex items-center gap-3 bg-[#c9a962] px-6 py-3 font-Satoshi text-sm font-medium tracking-wide text-neutral-950 transition-all hover:bg-[#b8984f]"
                >
                  View All Projects
                  <ArrowRight
                    className="h-4 w-4 transition-transform group-hover:translate-x-1"
                    strokeWidth={2}
                  />
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Main Content - Project Details + Thumbnails */}
          <div className="flex flex-1 flex-col justify-end pb-8 lg:pb-12">
            <div className="mx-auto w-full max-w-7xl px-6 lg:px-12">
              {/* Current Project Info */}
              <motion.div
                className="mb-8 lg:mb-12"
                style={{ opacity: backgroundOpacity }}
              >
                <div className="grid gap-8 lg:grid-cols-2 lg:gap-16">
                  {/* Left: Project Details */}
                  <div className="space-y-6">
                    {/* Project Type Badge */}
                    {activeProject?.acfFields?.projectType && (
                      <motion.div
                        key={`type-${activeIndex}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="inline-flex items-center gap-2 rounded-full border border-[#c9a962]/30 bg-neutral-950/40 px-4 py-1.5 backdrop-blur-sm"
                      >
                        <div className="h-1.5 w-1.5 rounded-full bg-[#c9a962]" />
                        <span className="font-Satoshi text-[10px] font-medium uppercase tracking-[0.2em] text-[#c9a962]">
                          {activeProject.acfFields.projectType}
                        </span>
                      </motion.div>
                    )}

                    {/* Project Title */}
                    <motion.h3
                      key={`title-${activeIndex}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                      className="font-SchnyderS text-3xl font-light text-white sm:text-4xl lg:text-5xl"
                    >
                      {activeProject?.title}
                    </motion.h3>

                    {/* Location */}
                    {activeProject?.acfFields?.location && (
                      <motion.div
                        key={`location-${activeIndex}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.2 }}
                        className="flex items-center gap-2 text-white/50"
                      >
                        <MapPin className="h-4 w-4" strokeWidth={1.5} />
                        <span className="font-Satoshi text-sm font-light">
                          {activeProject.acfFields.location}
                        </span>
                      </motion.div>
                    )}

                    {/* View Project Link */}
                    <motion.div
                      key={`cta-${activeIndex}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.3 }}
                    >
                      <Link
                        href={`/projects/${activeProject?.slug}`}
                        className="group inline-flex items-center gap-3 border border-white/20 bg-white/5 px-6 py-3 backdrop-blur-sm transition-all hover:border-[#c9a962] hover:bg-[#c9a962]"
                      >
                        <span className="font-Satoshi text-sm font-light tracking-wide text-white transition-colors group-hover:text-neutral-950">
                          Explore Project
                        </span>
                        <ArrowUpRight
                          className="h-4 w-4 text-white transition-all group-hover:text-neutral-950 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                          strokeWidth={1.5}
                        />
                      </Link>
                    </motion.div>
                  </div>

                  {/* Right: Progress Indicator */}
                  <div className="hidden items-end justify-end lg:flex">
                    <div className="flex items-baseline gap-2">
                      <span className="font-SchnyderS text-7xl font-light tabular-nums text-[#c9a962]">
                        {String(activeIndex + 1).padStart(2, "0")}
                      </span>
                      <span className="mb-2 font-Satoshi text-lg font-light text-white/30">
                        / {String(displayProjects.length).padStart(2, "0")}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Thumbnail Navigation */}
              <div className="relative">
                {/* Progress Bar */}
                <div className="mb-6 h-px w-full overflow-hidden bg-white/10">
                  <motion.div
                    className="h-full bg-gradient-to-r from-[#c9a962] to-[#e8d5a3]"
                    style={{
                      width: useTransform(
                        scrollYProgress,
                        [0, 1],
                        ["0%", "100%"]
                      ),
                    }}
                  />
                </div>

                {/* Thumbnails */}
                <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide lg:gap-4">
                  {displayProjects.map((project, index) => {
                    const isActive = index === activeIndex;
                    return (
                      <motion.div
                        key={project.id}
                        className={`group relative shrink-0 cursor-pointer overflow-hidden transition-all duration-500 ${
                          isActive
                            ? "w-[180px] lg:w-[240px]"
                            : "w-[100px] lg:w-[140px]"
                        }`}
                        whileHover={{ scale: 1.02 }}
                      >
                        <div
                          className={`relative aspect-[4/3] overflow-hidden ${
                            isActive ? "ring-2 ring-[#c9a962]" : ""
                          }`}
                        >
                          <SafeImage
                            src={project.featuredImage.node.sourceUrl}
                            alt={
                              project.featuredImage.node.altText || project.title
                            }
                            fallbackSrc={getProjectPlaceholder(
                              project.title,
                              project.acfFields?.projectType
                            )}
                            fill
                            className={`object-cover transition-all duration-500 ${
                              isActive
                                ? "scale-100"
                                : "scale-110 grayscale group-hover:grayscale-0"
                            }`}
                          />
                          {/* Overlay */}
                          <div
                            className={`absolute inset-0 transition-opacity duration-300 ${
                              isActive
                                ? "bg-transparent"
                                : "bg-neutral-950/40 group-hover:bg-neutral-950/20"
                            }`}
                          />
                          {/* Active indicator */}
                          {isActive && (
                            <motion.div
                              layoutId="activeThumb"
                              className="absolute bottom-0 left-0 right-0 h-1 bg-[#c9a962]"
                            />
                          )}
                        </div>
                        {/* Title - Only visible on active */}
                        <motion.div
                          className="mt-2 overflow-hidden"
                          animate={{
                            height: isActive ? "auto" : 0,
                            opacity: isActive ? 1 : 0,
                          }}
                          transition={{ duration: 0.3 }}
                        >
                          <p className="truncate font-Satoshi text-xs font-light text-white/70">
                            {project.title}
                          </p>
                        </motion.div>
                      </motion.div>
                    );
                  })}

                  {/* View All Thumbnail */}
                  <Link
                    href="/projects"
                    className="group relative flex aspect-[4/3] w-[100px] shrink-0 items-center justify-center border border-white/20 bg-white/5 backdrop-blur-sm transition-all hover:border-[#c9a962] hover:bg-[#c9a962]/10 lg:w-[140px]"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <ArrowUpRight
                        className="h-5 w-5 text-white/50 transition-colors group-hover:text-[#c9a962]"
                        strokeWidth={1.5}
                      />
                      <span className="font-Satoshi text-[10px] font-medium uppercase tracking-wider text-white/50 transition-colors group-hover:text-[#c9a962]">
                        View All
                      </span>
                    </div>
                  </Link>
                </div>
              </div>

              {/* Mobile Counter */}
              <div className="mt-4 flex items-center justify-center lg:hidden">
                <div className="flex items-baseline gap-2">
                  <span className="font-SchnyderS text-4xl font-light tabular-nums text-[#c9a962]">
                    {String(activeIndex + 1).padStart(2, "0")}
                  </span>
                  <span className="font-Satoshi text-sm font-light text-white/30">
                    / {String(displayProjects.length).padStart(2, "0")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Corner Decorations */}
        <div className="pointer-events-none absolute left-6 top-6 h-16 w-16 lg:left-12 lg:top-12">
          <div className="absolute left-0 top-0 h-12 w-px bg-gradient-to-b from-[#c9a962]/50 to-transparent" />
          <div className="absolute left-0 top-0 h-px w-12 bg-gradient-to-r from-[#c9a962]/50 to-transparent" />
        </div>
        <div className="pointer-events-none absolute bottom-6 right-6 h-16 w-16 lg:bottom-12 lg:right-12">
          <div className="absolute bottom-0 right-0 h-12 w-px bg-gradient-to-t from-[#c9a962]/50 to-transparent" />
          <div className="absolute bottom-0 right-0 h-px w-12 bg-gradient-to-l from-[#c9a962]/50 to-transparent" />
        </div>
      </div>
    </section>
  );
}
