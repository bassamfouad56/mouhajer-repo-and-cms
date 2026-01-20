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
  Target,
  Lightbulb,
  Wrench,
  Quote,
  Building,
  Users,
  Clock,
  CheckCircle2,
  Play,
  Pause,
  Sparkles,
  Layers,
  Gem,
  Shield,
  TrendingUp,
  Video,
  Image as ImageIcon,
} from "lucide-react";
import { ImageGalleryModal } from "@/components/image-gallery-modal";
import {
  getSafeImageUrl,
  filterValidImages,
} from "@/lib/error-handling";

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
          className="absolute left-[10%] top-0 h-full w-px origin-top bg-gradient-to-b from-[#c9a962]/30 via-[#c9a962]/10 to-transparent"
        />
        <motion.div
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 1.5, delay: 0.7 }}
          className="absolute right-[10%] top-0 h-full w-px origin-top bg-gradient-to-b from-[#c9a962]/30 via-[#c9a962]/10 to-transparent"
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
            className="mb-10 flex items-center gap-3 rounded-full border border-[#c9a962]/40 bg-[#c9a962]/10 px-8 py-4 backdrop-blur-md"
          >
            <Award className="h-5 w-5 text-[#c9a962]" />
            <span className="text-sm font-light tracking-widest text-[#c9a962]">
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
          className="mb-10 max-w-6xl text-center font-SchnyderS text-5xl font-light tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl"
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
            <MapPin className="h-4 w-4 text-[#c9a962]" />
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
// 2. OVERVIEW + CHALLENGE (Side by Side)
// ============================================
function OverviewChallengeSection({
  project,
  image,
}: {
  project: Project;
  image: string;
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
            <div className="mb-8 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-950">
                <Target className="h-5 w-5 text-[#c9a962]" />
              </div>
              <div>
                <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#c9a962]">
                  01
                </span>
                <h2 className="font-SchnyderS text-3xl font-light text-neutral-950 lg:text-4xl">
                  Overview
                </h2>
              </div>
            </div>

            {(project.acfFields?.projectDescription || project.excerpt) && (
              <p className="mb-8 text-lg font-light leading-relaxed text-neutral-600 lg:text-xl">
                {project.acfFields?.projectDescription || project.excerpt}
              </p>
            )}

            {/* Quick Stats - Only show if data exists */}
            {(() => {
              const stats: Array<{ value: string; label: string; icon: React.ComponentType<{ className?: string }> }> = [];
              if (project.acfFields?.projectSize || project.acfFields?.area) {
                stats.push({
                  value: (project.acfFields?.projectSize || project.acfFields?.area) as string,
                  label: "Square Meters",
                  icon: Layers,
                });
              }
              if (project.acfFields?.duration || project.acfFields?.durationMonths) {
                stats.push({
                  value: (project.acfFields?.duration || project.acfFields?.durationMonths) as string,
                  label: "Months Duration",
                  icon: Clock,
                });
              }
              if (stats.length === 0) return null;
              return (
                <div className="grid grid-cols-2 gap-6">
                  {stats.map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={isInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                      className="rounded-2xl bg-neutral-50 p-6"
                    >
                      <stat.icon className="mb-3 h-5 w-5 text-[#c9a962]" />
                      <span className="font-SchnyderS text-3xl font-light text-neutral-950">
                        {stat.value}
                      </span>
                      <p className="mt-1 text-sm font-light text-neutral-500">
                        {stat.label}
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
            <div className="mb-8 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#c9a962]">
                <Lightbulb className="h-5 w-5 text-neutral-950" />
              </div>
              <div>
                <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#c9a962]">
                  02
                </span>
                <h2 className="font-SchnyderS text-3xl font-light text-neutral-950 lg:text-4xl">
                  The Challenge
                </h2>
              </div>
            </div>

            {project.acfFields?.challenge && (
              <p className="mb-8 text-lg font-light leading-relaxed text-neutral-600 lg:text-xl">
                {project.acfFields.challenge}
              </p>
            )}

            {/* Challenge Points - Only show if data exists */}
            {project.acfFields?.challengePoints && project.acfFields.challengePoints.length > 0 && (
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
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[#c9a962]/10">
                        <CheckCircle2 className="h-3.5 w-3.5 text-[#c9a962]" />
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

        {/* Featured Image */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.4 }}
          className="relative mt-20 aspect-[21/9] overflow-hidden rounded-2xl"
        >
          <Image
            src={image}
            alt="Project Overview"
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/30 to-transparent" />
        </motion.div>
      </div>
    </section>
  );
}

// ============================================
// 3. DESIGN APPROACH SECTION
// ============================================
function DesignApproachSection({
  project,
  images,
}: {
  project: Project;
  images: Array<{ sourceUrl: string; altText?: string }>;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const approaches = project.acfFields?.designApproach || [];

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-neutral-100 py-24 lg:py-32"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        {/* Section Label */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center"
        >
          <div className="mb-6 flex items-center justify-center gap-4">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#c9a962]" />
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-950">
              <Sparkles className="h-5 w-5 text-[#c9a962]" />
            </div>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#c9a962]" />
          </div>
          <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#c9a962]">
            03 — Philosophy
          </span>
          <h2 className="mt-3 font-SchnyderS text-4xl font-light text-neutral-950 lg:text-5xl">
            Design Approach
          </h2>
        </motion.div>

        {/* Content - Show approach text or approach items array */}
        {project.acfFields?.approach && approaches.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mx-auto max-w-4xl"
          >
            <div className="rounded-2xl bg-white p-8 lg:p-12">
              {project.acfFields.approach.split('\n\n').map((paragraph, index) => (
                <p
                  key={index}
                  className={`text-lg font-light leading-relaxed text-neutral-600 ${
                    index > 0 ? 'mt-6' : ''
                  }`}
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </motion.div>
        )}
        {approaches.length > 0 && (
          <div className="grid gap-8 lg:grid-cols-3">
            {approaches.map((item: { icon?: unknown; title: string; desc: string }, index: number) => {
              const IconComponent = item.icon as React.ComponentType<{ className?: string }> || Gem;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 40 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.2 + index * 0.15 }}
                  className="group rounded-2xl bg-white p-8 text-center transition-all duration-500 hover:bg-neutral-950"
                >
                  <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-neutral-100 transition-all duration-500 group-hover:bg-[#c9a962]">
                    <IconComponent className="h-7 w-7 text-neutral-400 transition-colors group-hover:text-neutral-950" />
                  </div>
                  <h3 className="mb-3 text-lg font-medium text-neutral-950 transition-colors group-hover:text-white">
                    {item.title}
                  </h3>
                  <p className="text-sm font-light leading-relaxed text-neutral-600 transition-colors group-hover:text-white/70">
                    {item.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Image Grid */}
        {images.length > 2 && (
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.5 }}
            className="mt-16 grid grid-cols-3 gap-4"
          >
            {images.slice(1, 4).map((image, index) => (
              <div
                key={index}
                className="relative aspect-[4/3] overflow-hidden rounded-xl"
              >
                <Image
                  src={image.sourceUrl}
                  alt={image.altText || `Design ${index + 1}`}
                  fill
                  className="object-cover transition-transform duration-700 hover:scale-110"
                  sizes="33vw"
                />
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}

// ============================================
// 4. SCOPE OF WORK SECTION
// ============================================
function ScopeOfWorkSection({ project }: { project: Project }) {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const scopeItems = project.acfFields?.scopeOfWork || [];

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-white py-24 lg:py-32"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        {/* Section Label */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-950">
              <Wrench className="h-5 w-5 text-[#c9a962]" />
            </div>
            <div>
              <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#c9a962]">
                04
              </span>
              <h2 className="font-SchnyderS text-3xl font-light text-neutral-950 lg:text-4xl">
                Scope of Work
              </h2>
            </div>
          </div>
        </motion.div>

        {/* Scope Items - Only show if data exists */}
        {scopeItems.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2">
            {scopeItems.map((item: { title: string; desc: string; icon?: unknown }, index: number) => {
              const IconComponent = item.icon as React.ComponentType<{ className?: string }> || Building;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  className="group flex items-start gap-5 rounded-2xl bg-neutral-50 p-6 transition-all duration-500 hover:bg-neutral-950"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white transition-colors group-hover:bg-[#c9a962]">
                    <IconComponent className="h-5 w-5 text-neutral-600 transition-colors group-hover:text-neutral-950" />
                  </div>
                  <div>
                    <h3 className="mb-2 font-medium text-neutral-950 transition-colors group-hover:text-white">
                      {item.title}
                    </h3>
                    <p className="text-sm font-light text-neutral-600 transition-colors group-hover:text-white/70">
                      {item.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

// ============================================
// 5. THE OUTCOME SECTION
// ============================================
function OutcomeSection({ project }: { project: Project }) {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const outcomes = project.acfFields?.outcomes || [];

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-neutral-950 py-24 lg:py-32"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(201,169,98,0.1),transparent_50%)]" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-12">
        {/* Section Label */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-12 text-center"
        >
          <div className="mb-6 flex items-center justify-center gap-4">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#c9a962]/50" />
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#c9a962]">
              <Award className="h-5 w-5 text-neutral-950" />
            </div>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#c9a962]/50" />
          </div>
          <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#c9a962]">
            05 — Results
          </span>
          <h2 className="mt-3 font-SchnyderS text-4xl font-light text-white lg:text-5xl">
            The Outcome
          </h2>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mx-auto max-w-4xl text-center"
        >
          {project.acfFields?.outcome && (
            <p className="mb-12 text-lg font-light leading-relaxed text-white/80 lg:text-xl">
              {project.acfFields.outcome}
            </p>
          )}

          {/* Achievement Stats - Only show if data exists */}
          {outcomes.length > 0 && (
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
              {outcomes.map((stat: { value: string; label: string }, index: number) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  className="border-l border-white/10 pl-4 text-left"
                >
                  <span className="font-SchnyderS text-3xl font-light text-[#c9a962] lg:text-4xl">
                    {stat.value}
                  </span>
                  <p className="mt-1 text-sm font-light text-white/50">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}

// ============================================
// 6. PROJECT DETAILS SECTION
// ============================================
function ProjectDetailsSection({ project }: { project: Project }) {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const details = [
    project.acfFields?.location
      ? { label: "Location", value: project.acfFields.location, icon: MapPin }
      : null,
    project.acfFields?.client
      ? { label: "Client", value: project.acfFields.client, icon: Users }
      : null,
    project.acfFields?.status
      ? { label: "Status", value: project.acfFields.status, icon: CheckCircle2 }
      : null,
    project.acfFields?.projectType
      ? { label: "Type", value: project.acfFields.projectType, icon: Building }
      : null,
    project.acfFields?.projectDates || project.acfFields?.duration
      ? { label: "Dates", value: project.acfFields?.projectDates || project.acfFields?.duration, icon: Calendar }
      : null,
  ].filter(Boolean) as Array<{ label: string; value: string; icon: React.ComponentType<{ className?: string }> }>;

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-white py-24 lg:py-32"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        {/* Section Label */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-950">
              <Layers className="h-5 w-5 text-[#c9a962]" />
            </div>
            <div>
              <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#c9a962]">
                06
              </span>
              <h2 className="font-SchnyderS text-3xl font-light text-neutral-950 lg:text-4xl">
                Project Details
              </h2>
            </div>
          </div>
        </motion.div>

        {/* Details Grid - Only show if there are details */}
        {details.length > 0 && (
          <div className={`grid gap-4 sm:grid-cols-2 ${details.length >= 5 ? 'lg:grid-cols-5' : details.length >= 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-2'}`}>
            {details.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                className="rounded-2xl bg-neutral-50 p-6"
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-white">
                  <item.icon className="h-4 w-4 text-[#c9a962]" />
                </div>
                <span className="text-[10px] font-light uppercase tracking-wider text-neutral-400">
                  {item.label}
                </span>
                <p className="mt-1 font-medium text-neutral-950">{item.value}</p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// ============================================
// 7. OUTCOME & RESULTS SECTION
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
          <div className="mb-6 flex items-center justify-center gap-4">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#c9a962]" />
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-950">
              <TrendingUp className="h-5 w-5 text-[#c9a962]" />
            </div>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#c9a962]" />
          </div>
          <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#c9a962]">
            07 — Showcase
          </span>
          <h2 className="mt-3 font-SchnyderS text-4xl font-light text-neutral-950 lg:text-5xl">
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
              className="group relative mx-auto aspect-[16/9] max-w-5xl cursor-ew-resize overflow-hidden rounded-2xl shadow-xl"
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
                <div className="absolute bottom-6 right-6 flex items-center gap-2 rounded-full bg-[#c9a962] px-4 py-2">
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
                    <ChevronLeft className="h-4 w-4 text-[#c9a962]" />
                    <ChevronRight className="h-4 w-4 text-[#c9a962]" />
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

        {/* Image Gallery Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mb-16"
        >
          <div className="mb-6 flex items-center justify-between">
            <h3 className="font-Satoshi text-sm font-medium uppercase tracking-wider text-neutral-600">
              <ImageIcon className="mb-0.5 mr-2 inline-block h-4 w-4" />
              Project Gallery
            </h3>
            <span className="text-sm text-neutral-400">
              {images.length} images
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {images.slice(0, 8).map((image, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                className="group relative aspect-[4/3] cursor-pointer overflow-hidden rounded-xl"
                onClick={() => onImageClick(index)}
              >
                <Image
                  src={image.sourceUrl}
                  alt={image.altText || `Gallery ${index + 1}`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="25vw"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-neutral-950/0 transition-colors group-hover:bg-neutral-950/40">
                  <Maximize2 className="h-6 w-6 text-white opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

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
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#c9a962]">
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
            className="rounded-3xl bg-[#c9a962] p-10 text-center lg:p-16"
          >
            <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-full bg-neutral-950">
              <Quote className="h-8 w-8 text-[#c9a962]" />
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

  if (allProjects.length < 2) return null;

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-neutral-950">
      <div className="grid md:grid-cols-2">
        {/* Previous Project */}
        <Link
          href={`/projects/${prevProject.slug}`}
          className="group relative h-[40vh] min-h-[300px] overflow-hidden"
        >
          <motion.div
            initial={{ scale: 1.1 }}
            whileHover={{ scale: 1 }}
            transition={{ duration: 0.7 }}
            className="absolute inset-0"
          >
            <Image
              src={prevProject.featuredImage?.node?.sourceUrl || "/placeholder.jpg"}
              alt={prevProject.title || "Previous Project"}
              fill
              className="object-cover"
              sizes="50vw"
            />
            <div className="absolute inset-0 bg-neutral-950/60 transition-colors group-hover:bg-neutral-950/40" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            className="relative z-10 flex h-full flex-col justify-center px-8 lg:px-12"
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/5 transition-colors group-hover:border-[#c9a962]/50">
                <ChevronLeft className="h-5 w-5 text-white transition-colors group-hover:text-[#c9a962]" />
              </div>
              <span className="text-xs font-light uppercase tracking-wider text-white/50">
                Previous
              </span>
            </div>
            <h3 className="font-SchnyderS text-2xl font-light text-white transition-colors group-hover:text-[#c9a962] lg:text-3xl">
              {prevProject.title}
            </h3>
          </motion.div>
        </Link>

        {/* Next Project */}
        <Link
          href={`/projects/${nextProject.slug}`}
          className="group relative h-[40vh] min-h-[300px] overflow-hidden border-l border-white/10"
        >
          <motion.div
            initial={{ scale: 1.1 }}
            whileHover={{ scale: 1 }}
            transition={{ duration: 0.7 }}
            className="absolute inset-0"
          >
            <Image
              src={nextProject.featuredImage?.node?.sourceUrl || "/placeholder.jpg"}
              alt={nextProject.title || "Next Project"}
              fill
              className="object-cover"
              sizes="50vw"
            />
            <div className="absolute inset-0 bg-neutral-950/60 transition-colors group-hover:bg-neutral-950/40" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            className="relative z-10 flex h-full flex-col items-end justify-center px-8 text-right lg:px-12"
          >
            <div className="mb-4 flex items-center gap-3">
              <span className="text-xs font-light uppercase tracking-wider text-white/50">
                Next
              </span>
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/5 transition-colors group-hover:border-[#c9a962]/50">
                <ChevronRight className="h-5 w-5 text-white transition-colors group-hover:text-[#c9a962]" />
              </div>
            </div>
            <h3 className="font-SchnyderS text-2xl font-light text-white transition-colors group-hover:text-[#c9a962] lg:text-3xl">
              {nextProject.title}
            </h3>
          </motion.div>
        </Link>
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

  const filtered = projects?.filter((p) => p.slug !== currentSlug).slice(0, 3) || [];

  if (filtered.length === 0) return null;

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-white py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="mb-12 flex items-end justify-between"
        >
          <div>
            <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#c9a962]">
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
                    src={project.featuredImage?.node?.sourceUrl || "/placeholder.jpg"}
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
                <h3 className="mt-1 font-SchnyderS text-xl font-light text-neutral-950 transition-colors group-hover:text-[#c9a962]">
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
      <main className="overflow-hidden">
        {/* 1. Hero Banner - Project Name */}
        <HeroBanner project={project} heroImage={heroImage} />

        {/* 2. Overview + Challenge (Side by Side) */}
        <OverviewChallengeSection
          project={project}
          image={galleryImages[1]?.sourceUrl || heroImage}
        />

        {/* 3. Design Approach */}
        <DesignApproachSection project={project} images={galleryImages} />

        {/* 4. Scope of Work */}
        <ScopeOfWorkSection project={project} />

        {/* 5. The Outcome */}
        <OutcomeSection project={project} />

        {/* 6. Project Details (Location, Client, Status, Type, Dates) */}
        <ProjectDetailsSection project={project} />

        {/* 7. Outcome & Results (Before/After, Gallery, Videos, Testimonial) */}
        <OutcomeResultsSection
          project={project}
          images={galleryImages}
          onImageClick={handleImageClick}
        />

        {/* 8. Project Navigation (Prev/Next) */}
        <ProjectNavigationSection
          allProjects={allProjects}
          currentSlug={project.slug || ""}
        />

        {/* 9. Related Projects */}
        <RelatedProjectsSection
          projects={relatedProjects.length > 0 ? relatedProjects : allProjects}
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
