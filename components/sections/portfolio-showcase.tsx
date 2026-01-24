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
    let newIndex;
    // When user has scrolled past 90% of the section, show the last item
    // This ensures the last item is visible when leaving the section
    if (latest >= 0.9) {
      newIndex = displayProjects.length - 1;
    } else {
      newIndex = Math.min(
        displayProjects.length - 1,
        Math.floor(latest * displayProjects.length),
      );
    }
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
          const isLastItem = index === displayProjects.length - 1;

          // For the last item, keep it visible (don't fade out at the end)
          const opacity = useTransform(
            scrollYProgress,
            isLastItem
              ? [Math.max(0, start - 0.05), start, 1]
              : [
                  Math.max(0, start - 0.05),
                  start,
                  end - 0.05,
                  Math.min(1, end + 0.05),
                ],
            isLastItem ? [0, 1, 1] : [0, 1, 1, 0],
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
                  project.acfFields?.projectType,
                )}
                fill
                className="object-cover"
                priority={index === 0}
              />
              {/* Elegant gradient overlay - lighter */}
              <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/70 via-neutral-950/40 to-neutral-950/20" />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/60 via-transparent to-neutral-950/20" />
            </motion.div>
          );
        })}

        {/* Content Container */}
        <div className="relative z-10 flex h-full">
          {/* Left: Vertical Thumbnail Navigation (Desktop) */}
          <div className="hidden lg:flex w-32 xl:w-40 flex-col items-center justify-center py-8">
            {/* Vertical Progress Bar */}
            <div className="relative h-full w-px overflow-hidden bg-white/10">
              <motion.div
                className="absolute left-0 top-0 w-full bg-gradient-to-b from-[#8f7852] to-[#e8d5a3]"
                style={{
                  height: useTransform(scrollYProgress, [0, 1], ["0%", "100%"]),
                }}
              />
            </div>

            {/* Vertical Thumbnails */}
            <div className="absolute inset-y-0 left-0 flex w-32 xl:w-40 flex-col items-center justify-center overflow-hidden py-16">
              <motion.div
                className="flex flex-col gap-3"
                style={{
                  y: useTransform(
                    scrollYProgress,
                    [0, 1],
                    [0, -(displayProjects.length * 80)],
                  ),
                }}
              >
                {displayProjects.map((project, index) => {
                  const isActive = index === activeIndex;
                  return (
                    <motion.div
                      key={project.id}
                      className="group relative cursor-pointer"
                      whileHover={{ scale: 1.05 }}
                    >
                      <div
                        className={`relative h-16 w-24 xl:h-20 xl:w-28 overflow-hidden transition-all duration-300 ${
                          isActive ? "ring-2 ring-[#8f7852]" : ""
                        }`}
                      >
                        <SafeImage
                          src={project.featuredImage.node.sourceUrl}
                          alt={
                            project.featuredImage.node.altText || project.title
                          }
                          fallbackSrc={getProjectPlaceholder(
                            project.title,
                            project.acfFields?.projectType,
                          )}
                          fill
                          className={`object-cover transition-all duration-500 ${
                            isActive
                              ? "scale-105"
                              : "scale-100 grayscale group-hover:scale-105 group-hover:grayscale-0"
                          }`}
                        />
                        {/* Overlay */}
                        <div
                          className={`absolute inset-0 transition-opacity duration-300 ${
                            isActive
                              ? "bg-neutral-950/20"
                              : "bg-neutral-950/60 group-hover:bg-neutral-950/30"
                          }`}
                        />
                        {/* Active indicator bar */}
                        <motion.div
                          className="absolute bottom-0 left-0 top-0 w-1 bg-[#8f7852]"
                          initial={{ scaleY: 0 }}
                          animate={{ scaleY: isActive ? 1 : 0 }}
                          transition={{ duration: 0.3 }}
                          style={{ transformOrigin: "top" }}
                        />
                      </div>
                    </motion.div>
                  );
                })}

                {/* View All Thumbnail */}
                <Link
                  href="/projects"
                  className="group relative flex h-16 w-24 xl:h-20 xl:w-28 items-center justify-center border border-white/20 bg-white/5 backdrop-blur-sm transition-all hover:border-[#8f7852] hover:bg-[#8f7852]/10"
                >
                  <div className="flex flex-col items-center gap-1">
                    <ArrowUpRight
                      className="h-4 w-4 text-white/50 transition-colors group-hover:text-[#8f7852]"
                      strokeWidth={1.5}
                    />
                    <span className="font-Satoshi text-[8px] font-medium uppercase tracking-wider text-white/50 transition-colors group-hover:text-[#8f7852]">
                      View All
                    </span>
                  </div>
                </Link>
              </motion.div>
            </div>
          </div>

          {/* Right: Main Content */}
          <div className="flex flex-1 flex-col">
            {/* Header */}
            <motion.div
              className="px-6 pt-20 lg:px-12 lg:pt-24"
              style={{ y: headerY, opacity: headerOpacity }}
            >
              <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                {/* Left: Section Title */}
                <div>
                  <div className="mb-4 flex items-center gap-4">
                    <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#8f7852]" />
                    <span className="font-Satoshi text-[10px] font-medium uppercase tracking-[0.4em] text-[#8f7852]">
                      Portfolio of Excellence
                    </span>
                  </div>

                  <h2 className="font-SchnyderS text-4xl font-light tracking-tight text-white sm:text-5xl lg:text-6xl xl:text-7xl">
                    A Legacy of
                    <br />
                    <span className="text-[#8f7852]">Built Projects</span>
                  </h2>
                </div>

              </div>
            </motion.div>

            {/* Main Content - Project Details */}
            <div className="flex flex-1 flex-col justify-end pb-8 lg:pb-12">
              <div className="px-6 lg:px-12">
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
                          className="inline-flex items-center gap-2 rounded-full border border-[#8f7852]/30 bg-neutral-950/40 px-4 py-1.5 backdrop-blur-sm"
                        >
                          <div className="h-1.5 w-1.5 rounded-full bg-[#8f7852]" />
                          <span className="font-Satoshi text-[10px] font-medium uppercase tracking-[0.2em] text-[#8f7852]">
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
                          className="group inline-flex items-center gap-3 border border-white/20 bg-white/5 px-6 py-3 backdrop-blur-sm transition-all hover:border-[#8f7852] hover:bg-[#8f7852]"
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

                    {/* Right: View All Projects Button */}
                    <div className="hidden items-end justify-end lg:flex">
                      <Link
                        href="/projects"
                        className="group inline-flex items-center gap-3 bg-[#8f7852] px-6 py-3 font-Satoshi text-sm font-medium tracking-wide text-neutral-950 transition-all hover:bg-[#b8984f]"
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

                {/* Mobile Horizontal Thumbnails */}
                <div className="relative overflow-hidden lg:hidden">
                  <motion.div
                    className="flex gap-3 pb-4"
                    style={{
                      x: useTransform(
                        scrollYProgress,
                        [0, 1],
                        [0, -(displayProjects.length * 200)],
                      ),
                    }}
                  >
                    {displayProjects.map((project, index) => {
                      const isActive = index === activeIndex;
                      return (
                        <motion.div
                          key={project.id}
                          className="group relative w-[200px] shrink-0 cursor-pointer overflow-hidden"
                        >
                          <div
                            className={`relative aspect-[16/10] overflow-hidden transition-all duration-300 ${
                              isActive ? "ring-2 ring-[#8f7852]" : ""
                            }`}
                          >
                            <SafeImage
                              src={project.featuredImage.node.sourceUrl}
                              alt={
                                project.featuredImage.node.altText ||
                                project.title
                              }
                              fallbackSrc={getProjectPlaceholder(
                                project.title,
                                project.acfFields?.projectType,
                              )}
                              fill
                              className={`object-cover transition-all duration-500 ${
                                isActive ? "scale-105" : "scale-100 grayscale"
                              }`}
                            />
                            <div
                              className={`absolute inset-0 transition-opacity duration-300 ${
                                isActive
                                  ? "bg-neutral-950/20"
                                  : "bg-neutral-950/50"
                              }`}
                            />
                            <motion.div
                              className="absolute bottom-0 left-0 right-0 h-1 bg-[#8f7852]"
                              initial={{ scaleX: 0 }}
                              animate={{ scaleX: isActive ? 1 : 0 }}
                              transition={{ duration: 0.3 }}
                              style={{ transformOrigin: "left" }}
                            />
                          </div>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                </div>

                {/* Mobile View All Button */}
                <div className="mt-4 flex items-center justify-center lg:hidden">
                  <Link
                    href="/projects"
                    className="group inline-flex items-center gap-3 bg-[#8f7852] px-6 py-3 font-Satoshi text-sm font-medium tracking-wide text-neutral-950 transition-all hover:bg-[#b8984f]"
                  >
                    View All Projects
                    <ArrowRight
                      className="h-4 w-4 transition-transform group-hover:translate-x-1"
                      strokeWidth={2}
                    />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Corner Decorations */}
        <div className="pointer-events-none absolute left-6 top-6 h-16 w-16 lg:left-12 lg:top-12">
          <div className="absolute left-0 top-0 h-12 w-px bg-gradient-to-b from-[#8f7852]/50 to-transparent" />
          <div className="absolute left-0 top-0 h-px w-12 bg-gradient-to-r from-[#8f7852]/50 to-transparent" />
        </div>
        <div className="pointer-events-none absolute bottom-6 right-6 h-16 w-16 lg:bottom-12 lg:right-12">
          <div className="absolute bottom-0 right-0 h-12 w-px bg-gradient-to-t from-[#8f7852]/50 to-transparent" />
          <div className="absolute bottom-0 right-0 h-px w-12 bg-gradient-to-l from-[#8f7852]/50 to-transparent" />
        </div>
      </div>
    </section>
  );
}
