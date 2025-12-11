'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Project } from '@/lib/wordpress';
import { motion, useScroll, useTransform, AnimatePresence, useInView } from 'framer-motion';
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
} from 'lucide-react';
import { ImageGalleryModal } from '@/components/image-gallery-modal';
import { BeforeAfterSlider } from '@/components/before-after-slider';
import { getSafeImageUrl, filterValidImages, isNonEmptyArray } from '@/lib/error-handling';

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
    offset: ['start start', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '40%']);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

  return (
    <section ref={heroRef} className="relative h-screen w-full overflow-hidden">
      {/* Parallax Background */}
      <motion.div style={{ y, scale }} className="absolute inset-0">
        <Image
          src={heroImage}
          alt={project.title || 'Project'}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        {/* Cinematic Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/60 via-neutral-950/30 to-neutral-950" />
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/50 via-transparent to-neutral-950/50" />

        {/* Animated Vignette */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(10,10,10,0.4)_100%)]"
        />
      </motion.div>

      {/* Decorative Lines */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 1.5, delay: 0.5 }}
          className="absolute left-[10%] top-0 h-full w-px origin-top bg-gradient-to-b from-[#d4af37]/30 via-[#d4af37]/10 to-transparent"
        />
        <motion.div
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 1.5, delay: 0.7 }}
          className="absolute right-[10%] top-0 h-full w-px origin-top bg-gradient-to-b from-[#d4af37]/30 via-[#d4af37]/10 to-transparent"
        />
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.5, delay: 1 }}
          className="absolute bottom-0 left-0 h-px w-full origin-left bg-gradient-to-r from-transparent via-[#d4af37]/50 to-transparent"
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
            className="mb-10 flex items-center gap-3 rounded-full border border-[#d4af37]/40 bg-[#d4af37]/10 px-8 py-4 backdrop-blur-md"
          >
            <Award className="h-5 w-5 text-[#d4af37]" />
            <span className="text-sm font-light tracking-widest text-[#d4af37]">
              AWARD-WINNING PROJECT
            </span>
          </motion.div>
        )}

        {/* Project Type Label */}
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
            {project.acfFields?.projectType || 'Luxury Project'}
          </span>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: 64 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="h-px bg-gradient-to-l from-transparent to-white/40"
          />
        </motion.div>

        {/* Project Title */}
        <motion.h1
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.5, type: 'spring', damping: 20 }}
          className="mb-10 max-w-6xl text-center font-SchnyderS text-5xl font-light tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl"
        >
          {project.title}
        </motion.h1>

        {/* Location */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex items-center gap-3 rounded-full bg-white/5 px-6 py-3 backdrop-blur-sm"
        >
          <MapPin className="h-4 w-4 text-[#d4af37]" />
          <span className="text-sm font-light tracking-wide text-white/80">
            {project.acfFields?.location || 'United Arab Emirates'}
          </span>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="absolute bottom-16 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="flex flex-col items-center gap-4"
          >
            <span className="text-[10px] font-light uppercase tracking-[0.4em] text-white/40">
              Discover
            </span>
            <div className="h-16 w-px bg-gradient-to-b from-white/50 to-transparent" />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}

// ============================================
// 2. PROJECT OVERVIEW SECTION
// ============================================
function OverviewSection({ project }: { project: Project }) {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-white py-32 lg:py-48">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.015)_1px,transparent_1px)] bg-size-[100px_100px]" />

      {/* Decorative Element */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={isInView ? { scale: 1, opacity: 0.03 } : {}}
        transition={{ duration: 1.5 }}
        className="absolute -right-64 top-1/2 h-[800px] w-[800px] -translate-y-1/2 rounded-full bg-[#d4af37]"
      />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-12">
        {/* Section Label */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-16 flex items-center gap-6"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-neutral-950">
            <Target className="h-7 w-7 text-[#d4af37]" />
          </div>
          <div>
            <span className="text-xs font-medium uppercase tracking-[0.3em] text-[#d4af37]">
              01
            </span>
            <h2 className="mt-1 font-SchnyderS text-4xl font-light text-neutral-950 lg:text-5xl">
              Project Overview
            </h2>
          </div>
        </motion.div>

        {/* Content */}
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <p className="text-xl font-light leading-relaxed text-neutral-600 lg:text-2xl">
              {project.acfFields?.projectDescription || project.excerpt ||
                'A comprehensive design and build project showcasing our commitment to luxury, innovation, and uncompromising excellence in every detail.'}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-2 gap-8"
          >
            {[
              { value: project.acfFields?.projectSize || '15,000', label: 'Square Meters', icon: Layers },
              { value: project.acfFields?.duration || '10', label: 'Months Duration', icon: Clock },
              { value: '277', label: 'Rooms Renovated', icon: Building },
              { value: '140M', label: 'AED Budget', icon: TrendingUp },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                className="group"
              >
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-100 transition-colors group-hover:bg-[#d4af37]/10">
                  <stat.icon className="h-5 w-5 text-neutral-400 transition-colors group-hover:text-[#d4af37]" />
                </div>
                <span className="font-SchnyderS text-4xl font-light text-neutral-950 lg:text-5xl">
                  {stat.value}
                </span>
                <p className="mt-1 text-sm font-light text-neutral-500">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ============================================
// 3. THE CHALLENGE SECTION
// ============================================
function ChallengeSection({ project, image }: { project: Project; image: string }) {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '15%']);

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-neutral-950 py-32 lg:py-48">
      {/* Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-size-[80px_80px]" />
      <div className="absolute left-0 top-0 h-full w-1/3 bg-gradient-to-r from-[#d4af37]/5 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-12">
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1 }}
            className="relative"
          >
            <motion.div style={{ y: imageY }} className="relative aspect-[4/5] overflow-hidden rounded-2xl">
              <Image
                src={image}
                alt="The Challenge"
                fill
                className="object-cover"
                sizes="50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/60 to-transparent" />
            </motion.div>

            {/* Floating Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="absolute -bottom-8 -right-8 flex h-32 w-32 items-center justify-center rounded-2xl bg-[#d4af37] shadow-2xl lg:h-40 lg:w-40"
            >
              <div className="text-center">
                <span className="font-SchnyderS text-4xl font-light text-neutral-950 lg:text-5xl">10</span>
                <p className="text-xs font-light uppercase tracking-wider text-neutral-950/70">Months</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, delay: 0.2 }}
            className="flex flex-col justify-center"
          >
            {/* Section Label */}
            <div className="mb-12 flex items-center gap-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#d4af37]">
                <Lightbulb className="h-7 w-7 text-neutral-950" />
              </div>
              <div>
                <span className="text-xs font-medium uppercase tracking-[0.3em] text-[#d4af37]">
                  02
                </span>
                <h2 className="mt-1 font-SchnyderS text-4xl font-light text-white lg:text-5xl">
                  The Challenge
                </h2>
              </div>
            </div>

            <p className="mb-10 text-lg font-light leading-relaxed text-white/70 lg:text-xl">
              {project.acfFields?.challenge ||
                'The client presented a formidable challenge: execute a comprehensive modernization within an incredibly aggressive timeline while maintaining the highest standards of luxury and quality.'}
            </p>

            {/* Challenge Points */}
            <div className="space-y-6">
              {[
                'Complete renovation of 277 rooms in 10 months',
                'AED 140 Million budget with zero compromise on quality',
                'Maintain heritage architectural guidelines',
                'Seamless coordination of multiple specialized teams',
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 30 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                  className="flex items-start gap-4"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#d4af37]/10">
                    <CheckCircle2 className="h-4 w-4 text-[#d4af37]" />
                  </div>
                  <span className="font-light text-white/80">{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ============================================
// 4. DESIGN APPROACH SECTION
// ============================================
function DesignApproachSection({
  project,
  images,
}: {
  project: Project;
  images: Array<{ sourceUrl: string; altText?: string }>;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-neutral-100 py-32 lg:py-48">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        {/* Section Label */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-20 text-center"
        >
          <div className="mb-8 flex items-center justify-center gap-6">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#d4af37]" />
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-neutral-950">
              <Sparkles className="h-7 w-7 text-[#d4af37]" />
            </div>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#d4af37]" />
          </div>
          <span className="text-xs font-medium uppercase tracking-[0.3em] text-[#d4af37]">
            03 — Philosophy
          </span>
          <h2 className="mt-4 font-SchnyderS text-4xl font-light text-neutral-950 lg:text-6xl">
            Design Approach
          </h2>
        </motion.div>

        {/* Content */}
        <div className="grid gap-12 lg:grid-cols-3 lg:gap-8">
          {[
            {
              icon: Gem,
              title: 'Heritage & Innovation',
              desc: 'Bridging the hotel\'s historic charm with modern luxury expectations, creating a timeless aesthetic.',
            },
            {
              icon: Shield,
              title: 'Premium Materials',
              desc: 'Only the finest materials sourced globally, ensuring lasting beauty and uncompromising durability.',
            },
            {
              icon: Wrench,
              title: 'Precision Execution',
              desc: 'Engineering and design teams working in parallel for seamless delivery without quality compromise.',
            },
          ].map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.15 }}
              className="group text-center"
            >
              <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-white shadow-sm transition-all duration-500 group-hover:bg-neutral-950 group-hover:shadow-xl">
                <item.icon className="h-8 w-8 text-neutral-400 transition-colors group-hover:text-[#d4af37]" />
              </div>
              <h3 className="mb-4 text-xl font-medium text-neutral-950">{item.title}</h3>
              <p className="font-light leading-relaxed text-neutral-600">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Image Grid */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-24 grid grid-cols-4 gap-4"
        >
          {images.slice(0, 4).map((image, index) => (
            <div
              key={index}
              className={`relative overflow-hidden rounded-xl ${
                index === 0 ? 'col-span-2 row-span-2 aspect-square' : 'aspect-[4/3]'
              }`}
            >
              <Image
                src={image.sourceUrl}
                alt={image.altText || `Design ${index + 1}`}
                fill
                className="object-cover transition-transform duration-700 hover:scale-110"
                sizes={index === 0 ? '50vw' : '25vw'}
              />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ============================================
// 5. SCOPE OF WORK SECTION
// ============================================
function ScopeOfWorkSection({ project }: { project: Project }) {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  const scopeItems = [
    {
      number: '01',
      title: 'Civil & Structural',
      desc: 'Complete overhaul of corridors, guest rooms, and public facility structures with modern engineering standards.',
      icon: Building,
    },
    {
      number: '02',
      title: 'Interior Design & Fit-Out',
      desc: 'End-to-end execution including gypsum works, wall cladding, premium flooring, and custom millwork.',
      icon: Layers,
    },
    {
      number: '03',
      title: 'FF&E Installation',
      desc: 'Sourcing and installation of custom bespoke furniture, lighting fixtures, and soft furnishings.',
      icon: Gem,
    },
    {
      number: '04',
      title: 'MEP Engineering',
      desc: 'Full upgrade of electrical and mechanical systems to meet modern energy and safety standards.',
      icon: Wrench,
    },
  ];

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-white py-32 lg:py-48">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        {/* Section Label */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <div className="mb-8 flex items-center gap-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-neutral-950">
              <Wrench className="h-7 w-7 text-[#d4af37]" />
            </div>
            <div>
              <span className="text-xs font-medium uppercase tracking-[0.3em] text-[#d4af37]">
                04
              </span>
              <h2 className="mt-1 font-SchnyderS text-4xl font-light text-neutral-950 lg:text-5xl">
                Scope of Work
              </h2>
            </div>
          </div>
        </motion.div>

        {/* Scope Items */}
        <div className="grid gap-6 md:grid-cols-2">
          {scopeItems.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              className="group relative overflow-hidden rounded-3xl bg-neutral-50 p-10 transition-all duration-500 hover:bg-neutral-950"
            >
              {/* Number Background */}
              <span className="absolute -right-4 -top-8 font-SchnyderS text-[180px] font-light leading-none text-neutral-100 transition-colors group-hover:text-white/5">
                {item.number}
              </span>

              <div className="relative">
                <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm transition-colors group-hover:bg-[#d4af37]">
                  <item.icon className="h-7 w-7 text-neutral-600 transition-colors group-hover:text-neutral-950" />
                </div>
                <h3 className="mb-4 text-xl font-medium text-neutral-950 transition-colors group-hover:text-white">
                  {item.title}
                </h3>
                <p className="font-light leading-relaxed text-neutral-600 transition-colors group-hover:text-white/70">
                  {item.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================
// 6. THE OUTCOME SECTION
// ============================================
function OutcomeSection({ project }: { project: Project }) {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-neutral-950 py-32 lg:py-48">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.1),transparent_50%)]" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-12">
        {/* Section Label */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-20 text-center"
        >
          <div className="mb-8 flex items-center justify-center gap-6">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#d4af37]/50" />
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#d4af37]">
              <Award className="h-7 w-7 text-neutral-950" />
            </div>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#d4af37]/50" />
          </div>
          <span className="text-xs font-medium uppercase tracking-[0.3em] text-[#d4af37]">
            05 — Results
          </span>
          <h2 className="mt-4 font-SchnyderS text-4xl font-light text-white lg:text-6xl">
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
          <p className="mb-16 text-xl font-light leading-relaxed text-white/80 lg:text-2xl">
            {project.acfFields?.outcome ||
              'Delivered on time and within budget, the newly renovated property stands as a testament to our capacity for large-scale commercial execution, earning prestigious industry recognition.'}
          </p>

          {/* Achievement Stats */}
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {[
              { value: '100%', label: 'On Time Delivery' },
              { value: '5-Star', label: 'Award Winner' },
              { value: 'Zero', label: 'Quality Compromises' },
              { value: 'Full', label: 'Client Satisfaction' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                className="border-l border-white/10 pl-6 text-left"
              >
                <span className="font-SchnyderS text-4xl font-light text-[#d4af37] lg:text-5xl">
                  {stat.value}
                </span>
                <p className="mt-2 text-sm font-light text-white/50">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ============================================
// 7. PROJECT DETAILS SECTION
// ============================================
function ProjectDetailsSection({ project }: { project: Project }) {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  const details = [
    { label: 'Location', value: project.acfFields?.location || 'Abu Dhabi, UAE', icon: MapPin },
    { label: 'Client', value: project.acfFields?.client || 'ADNH', icon: Users },
    { label: 'Status', value: project.acfFields?.status || 'Completed', icon: CheckCircle2 },
    { label: 'Type', value: project.acfFields?.projectType || 'Hotel / Hospitality', icon: Building },
    { label: 'Duration', value: project.acfFields?.duration || 'May 2021 - Nov 2021', icon: Calendar },
    { label: 'Completion', value: project.acfFields?.completionDate || 'November 2021', icon: Clock },
  ];

  const services = ['Interior Design', 'Fit-Out & Construction', 'FF&E', 'MEP Engineering'];

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-white py-32 lg:py-48">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        {/* Section Label */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <div className="mb-8 flex items-center gap-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-neutral-950">
              <Layers className="h-7 w-7 text-[#d4af37]" />
            </div>
            <div>
              <span className="text-xs font-medium uppercase tracking-[0.3em] text-[#d4af37]">
                06
              </span>
              <h2 className="mt-1 font-SchnyderS text-4xl font-light text-neutral-950 lg:text-5xl">
                Project Details
              </h2>
            </div>
          </div>
        </motion.div>

        {/* Details Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {details.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              className="flex items-start gap-5 rounded-2xl bg-neutral-50 p-8"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white">
                <item.icon className="h-5 w-5 text-[#d4af37]" />
              </div>
              <div>
                <span className="text-xs font-light uppercase tracking-wider text-neutral-400">
                  {item.label}
                </span>
                <p className="mt-1 font-medium text-neutral-950">{item.value}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Services Tags */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12 rounded-2xl bg-neutral-950 p-10"
        >
          <span className="text-xs font-light uppercase tracking-wider text-white/40">
            Services Delivered
          </span>
          <div className="mt-6 flex flex-wrap gap-3">
            {services.map((service) => (
              <span
                key={service}
                className="rounded-full border border-[#d4af37]/30 bg-[#d4af37]/10 px-6 py-3 text-sm font-light text-[#d4af37]"
              >
                {service}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ============================================
// 8. GALLERY CAROUSEL SECTION
// ============================================
function GallerySection({
  images,
  onImageClick,
}: {
  images: Array<{ sourceUrl: string; altText?: string }>;
  onImageClick: (index: number) => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  useEffect(() => {
    if (!isAutoPlaying || images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, images.length]);

  if (images.length === 0) return null;

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-neutral-950 py-32 lg:py-48">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        className="mb-20 px-6 text-center lg:px-12"
      >
        <div className="mb-8 flex items-center justify-center gap-6">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#d4af37]/50" />
          <span className="text-xs font-medium uppercase tracking-[0.4em] text-[#d4af37]">
            07 — Visual Journey
          </span>
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#d4af37]/50" />
        </div>
        <h2 className="font-SchnyderS text-4xl font-light text-white lg:text-6xl">
          Project Gallery
        </h2>
      </motion.div>

      {/* Main Carousel */}
      <div className="relative mx-auto max-w-7xl px-6 lg:px-12">
        <div className="relative aspect-video overflow-hidden rounded-3xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0 cursor-pointer"
              onClick={() => onImageClick(currentIndex)}
            >
              <Image
                src={images[currentIndex].sourceUrl}
                alt={images[currentIndex].altText || `Gallery ${currentIndex + 1}`}
                fill
                className="object-cover"
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/50 via-transparent to-neutral-950/20" />

              {/* Expand Icon */}
              <div className="absolute bottom-8 right-8 flex h-14 w-14 items-center justify-center rounded-full bg-white/10 backdrop-blur-md transition-colors hover:bg-white/20">
                <Maximize2 className="h-6 w-6 text-white" />
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <button
            onClick={() => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)}
            className="absolute left-8 top-1/2 flex h-16 w-16 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 backdrop-blur-md transition-all hover:bg-white/20"
          >
            <ChevronLeft className="h-8 w-8 text-white" />
          </button>
          <button
            onClick={() => setCurrentIndex((prev) => (prev + 1) % images.length)}
            className="absolute right-8 top-1/2 flex h-16 w-16 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 backdrop-blur-md transition-all hover:bg-white/20"
          >
            <ChevronRight className="h-8 w-8 text-white" />
          </button>
        </div>

        {/* Thumbnails */}
        <div className="mt-8 flex items-center justify-center gap-4">
          {images.slice(0, 7).map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`relative h-20 w-28 overflow-hidden rounded-xl transition-all ${
                currentIndex === index
                  ? 'ring-2 ring-[#d4af37] ring-offset-4 ring-offset-neutral-950'
                  : 'opacity-40 hover:opacity-70'
              }`}
            >
              <Image
                src={image.sourceUrl}
                alt={image.altText || `Thumb ${index + 1}`}
                fill
                className="object-cover"
                sizes="112px"
              />
            </button>
          ))}
          {images.length > 7 && (
            <div className="flex h-20 w-28 items-center justify-center rounded-xl bg-white/10 text-sm text-white/60">
              +{images.length - 7}
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="mt-8 flex items-center justify-center gap-6">
          <button
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
          >
            {isAutoPlaying ? <Pause className="h-5 w-5 text-white" /> : <Play className="h-5 w-5 text-white" />}
          </button>
          <span className="text-sm text-white/40">
            {currentIndex + 1} / {images.length}
          </span>
        </div>
      </div>
    </section>
  );
}

// ============================================
// 9. BEFORE & AFTER COMPARISON SECTION
// ============================================
function BeforeAfterSection({
  images,
}: {
  images: Array<{ sourceUrl: string; altText?: string }>;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  // Use pairs of images for before/after (or same image for demo)
  const beforeAfterPairs = [
    {
      before: images[2]?.sourceUrl || images[0]?.sourceUrl,
      after: images[0]?.sourceUrl,
      label: 'Guest Room Transformation',
    },
    {
      before: images[4]?.sourceUrl || images[1]?.sourceUrl,
      after: images[1]?.sourceUrl,
      label: 'Lobby Renovation',
    },
    {
      before: images[6]?.sourceUrl || images[2]?.sourceUrl,
      after: images[3]?.sourceUrl || images[2]?.sourceUrl,
      label: 'Corridor Upgrade',
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
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging, handleMove, handleMouseUp]);

  if (images.length < 2) return null;

  const currentPair = beforeAfterPairs[activeIndex];

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-white py-32 lg:py-48">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="mb-16 text-center"
        >
          <div className="mb-8 flex items-center justify-center gap-6">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#d4af37]" />
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-neutral-950">
              <Layers className="h-7 w-7 text-[#d4af37]" />
            </div>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#d4af37]" />
          </div>
          <span className="text-xs font-medium uppercase tracking-[0.3em] text-[#d4af37]">
            08 — Transformation
          </span>
          <h2 className="mt-4 font-SchnyderS text-4xl font-light text-neutral-950 lg:text-6xl">
            Before & After
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg font-light text-neutral-600">
            Drag the slider to reveal the stunning transformation
          </p>
        </motion.div>

        {/* Comparison Slider */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          ref={containerRef}
          className="group relative aspect-[16/10] cursor-ew-resize overflow-hidden rounded-3xl shadow-2xl"
          onMouseDown={handleMouseDown}
          onTouchStart={handleMouseDown}
          onClick={(e) => !isDragging && handleMove(e.clientX)}
        >
          {/* After Image (Right/Bottom) */}
          <div className="absolute inset-0">
            <Image
              src={currentPair.after}
              alt="After renovation"
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
            {/* After Label */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.5 }}
              className="absolute bottom-8 right-8 z-20 flex items-center gap-3 rounded-full bg-[#d4af37] px-6 py-3 shadow-lg"
            >
              <Sparkles className="h-4 w-4 text-neutral-950" />
              <span className="text-sm font-medium uppercase tracking-wider text-neutral-950">
                After
              </span>
            </motion.div>
          </div>

          {/* Before Image (Left/Top - Clipped) */}
          <div
            className="absolute inset-0 z-10 overflow-hidden"
            style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
          >
            <Image
              src={currentPair.before}
              alt="Before renovation"
              fill
              className="object-cover"
              sizes="100vw"
            />
            {/* Before Label */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.5 }}
              className="absolute bottom-8 left-8 z-20 flex items-center gap-3 rounded-full bg-neutral-950 px-6 py-3 shadow-lg"
            >
              <Clock className="h-4 w-4 text-white/70" />
              <span className="text-sm font-medium uppercase tracking-wider text-white">
                Before
              </span>
            </motion.div>
            {/* Dark overlay for before */}
            <div className="absolute inset-0 bg-neutral-950/10" />
          </div>

          {/* Slider Handle */}
          <div
            className="absolute bottom-0 top-0 z-30 w-1"
            style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
          >
            {/* Vertical Line */}
            <div className="h-full w-1 bg-white shadow-[0_0_20px_rgba(255,255,255,0.5)]" />

            {/* Handle Circle */}
            <motion.div
              animate={{ scale: isDragging ? 1.2 : 1 }}
              className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-4 border-white bg-neutral-950 shadow-2xl transition-shadow hover:shadow-[0_0_30px_rgba(212,175,55,0.5)]"
            >
              <div className="flex items-center gap-1">
                <ChevronLeft className="h-5 w-5 text-[#d4af37]" />
                <ChevronRight className="h-5 w-5 text-[#d4af37]" />
              </div>
            </motion.div>

            {/* Top Arrow */}
            <div className="absolute left-1/2 top-4 -translate-x-1/2">
              <motion.div
                animate={{ y: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm"
              >
                <ChevronLeft className="h-4 w-4 -rotate-90 text-white" />
              </motion.div>
            </div>

            {/* Bottom Arrow */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm"
              >
                <ChevronRight className="h-4 w-4 -rotate-90 text-white" />
              </motion.div>
            </div>
          </div>

          {/* Instruction Overlay */}
          <AnimatePresence>
            {!isDragging && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="pointer-events-none absolute left-1/2 top-8 z-40 -translate-x-1/2"
              >
                <div className="flex items-center gap-2 rounded-full bg-neutral-950/80 px-5 py-2.5 backdrop-blur-md">
                  <ChevronLeft className="h-4 w-4 text-[#d4af37]" />
                  <span className="text-xs font-light uppercase tracking-wider text-white">
                    Drag to Compare
                  </span>
                  <ChevronRight className="h-4 w-4 text-[#d4af37]" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Corner Accents */}
          <div className="pointer-events-none absolute left-4 top-4 h-12 w-12 border-l-2 border-t-2 border-white/30" />
          <div className="pointer-events-none absolute right-4 top-4 h-12 w-12 border-r-2 border-t-2 border-[#d4af37]/50" />
          <div className="pointer-events-none absolute bottom-4 left-4 h-12 w-12 border-b-2 border-l-2 border-white/30" />
          <div className="pointer-events-none absolute bottom-4 right-4 h-12 w-12 border-b-2 border-r-2 border-[#d4af37]/50" />
        </motion.div>

        {/* Comparison Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          {beforeAfterPairs.map((pair, index) => (
            <button
              key={index}
              onClick={() => {
                setActiveIndex(index);
                setSliderPosition(50);
              }}
              className={`group relative overflow-hidden rounded-xl px-6 py-3 transition-all ${
                activeIndex === index
                  ? 'bg-neutral-950 text-white'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              <span className="relative z-10 text-sm font-medium">{pair.label}</span>
              {activeIndex === index && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-neutral-950"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
            </button>
          ))}
        </motion.div>

        {/* Progress Indicator */}
        <div className="mt-8 flex items-center justify-center gap-2">
          {beforeAfterPairs.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setActiveIndex(index);
                setSliderPosition(50);
              }}
              className={`h-2 rounded-full transition-all ${
                activeIndex === index ? 'w-8 bg-[#d4af37]' : 'w-2 bg-neutral-300 hover:bg-neutral-400'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================
// 10. TESTIMONIAL SECTION
// ============================================
function TestimonialSection({ project }: { project: Project }) {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-[#d4af37] py-32 lg:py-48">
      <div className="relative mx-auto max-w-5xl px-6 text-center lg:px-12">
        {/* Quote Icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12 flex justify-center"
        >
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-neutral-950">
            <Quote className="h-12 w-12 text-[#d4af37]" />
          </div>
        </motion.div>

        {/* Quote */}
        <motion.blockquote
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <p className="font-SchnyderS text-3xl font-light leading-relaxed text-neutral-950 sm:text-4xl lg:text-5xl">
            &ldquo;{project.acfFields?.testimonial ||
              'Creating the new guidelines of Sheraton in 10 months only. The transformation was absolute, turning a classic property into a modern icon of opulence.'}&rdquo;
          </p>
        </motion.blockquote>

        {/* Attribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12"
        >
          <div className="mb-4 mx-auto h-px w-16 bg-neutral-950/30" />
          <span className="text-sm font-medium text-neutral-950">
            {project.acfFields?.testimonialAuthor || 'ADNH Management'}
          </span>
        </motion.div>
      </div>
    </section>
  );
}

// ============================================
// 11. PROJECT NAVIGATION SECTION (Prev/Next)
// ============================================
function ProjectNavigationSection({
  allProjects,
  currentSlug,
}: {
  allProjects: Project[];
  currentSlug: string;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  // Find current project index and get prev/next
  const currentIndex = allProjects.findIndex((p) => p.slug === currentSlug);
  const prevProject = currentIndex > 0 ? allProjects[currentIndex - 1] : allProjects[allProjects.length - 1];
  const nextProject = currentIndex < allProjects.length - 1 ? allProjects[currentIndex + 1] : allProjects[0];

  if (allProjects.length < 2) return null;

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-neutral-950">
      <div className="grid md:grid-cols-2">
        {/* Previous Project */}
        <Link
          href={`/projects/${prevProject.slug}`}
          className="group relative h-[50vh] min-h-[400px] overflow-hidden"
        >
          {/* Background Image */}
          <motion.div
            initial={{ scale: 1.1 }}
            whileHover={{ scale: 1 }}
            transition={{ duration: 0.7 }}
            className="absolute inset-0"
          >
            <Image
              src={prevProject.featuredImage?.node?.sourceUrl || '/placeholder.jpg'}
              alt={prevProject.title || 'Previous Project'}
              fill
              className="object-cover"
              sizes="50vw"
            />
            <div className="absolute inset-0 bg-neutral-950/60 transition-colors group-hover:bg-neutral-950/40" />
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="relative z-10 flex h-full flex-col justify-center px-8 lg:px-16"
          >
            <div className="mb-6 flex items-center gap-4">
              <motion.div
                whileHover={{ x: -8 }}
                transition={{ duration: 0.3 }}
                className="flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-white/5 backdrop-blur-sm transition-colors group-hover:border-[#d4af37]/50 group-hover:bg-[#d4af37]/10"
              >
                <ChevronLeft className="h-6 w-6 text-white transition-colors group-hover:text-[#d4af37]" />
              </motion.div>
              <span className="text-xs font-light uppercase tracking-[0.3em] text-white/50">
                Previous Project
              </span>
            </div>
            <h3 className="font-SchnyderS text-3xl font-light text-white transition-colors group-hover:text-[#d4af37] lg:text-4xl xl:text-5xl">
              {prevProject.title}
            </h3>
            <p className="mt-4 text-sm font-light text-white/60">
              {prevProject.acfFields?.projectType || 'Luxury Project'}
            </p>
          </motion.div>

          {/* Hover Line */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileHover={{ scaleX: 1 }}
            transition={{ duration: 0.4 }}
            className="absolute bottom-0 left-0 h-1 w-full origin-left bg-[#d4af37]"
          />
        </Link>

        {/* Next Project */}
        <Link
          href={`/projects/${nextProject.slug}`}
          className="group relative h-[50vh] min-h-[400px] overflow-hidden border-l border-white/10"
        >
          {/* Background Image */}
          <motion.div
            initial={{ scale: 1.1 }}
            whileHover={{ scale: 1 }}
            transition={{ duration: 0.7 }}
            className="absolute inset-0"
          >
            <Image
              src={nextProject.featuredImage?.node?.sourceUrl || '/placeholder.jpg'}
              alt={nextProject.title || 'Next Project'}
              fill
              className="object-cover"
              sizes="50vw"
            />
            <div className="absolute inset-0 bg-neutral-950/60 transition-colors group-hover:bg-neutral-950/40" />
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="relative z-10 flex h-full flex-col items-end justify-center px-8 text-right lg:px-16"
          >
            <div className="mb-6 flex items-center gap-4">
              <span className="text-xs font-light uppercase tracking-[0.3em] text-white/50">
                Next Project
              </span>
              <motion.div
                whileHover={{ x: 8 }}
                transition={{ duration: 0.3 }}
                className="flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-white/5 backdrop-blur-sm transition-colors group-hover:border-[#d4af37]/50 group-hover:bg-[#d4af37]/10"
              >
                <ChevronRight className="h-6 w-6 text-white transition-colors group-hover:text-[#d4af37]" />
              </motion.div>
            </div>
            <h3 className="font-SchnyderS text-3xl font-light text-white transition-colors group-hover:text-[#d4af37] lg:text-4xl xl:text-5xl">
              {nextProject.title}
            </h3>
            <p className="mt-4 text-sm font-light text-white/60">
              {nextProject.acfFields?.projectType || 'Luxury Project'}
            </p>
          </motion.div>

          {/* Hover Line */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileHover={{ scaleX: 1 }}
            transition={{ duration: 0.4 }}
            className="absolute bottom-0 right-0 h-1 w-full origin-right bg-[#d4af37]"
          />
        </Link>
      </div>

      {/* Center Divider with "Or" */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 z-20 hidden -translate-x-1/2 -translate-y-1/2 md:block">
        <div className="flex h-20 w-20 items-center justify-center rounded-full border border-white/20 bg-neutral-950">
          <span className="font-SchnyderS text-xl font-light text-white/60">or</span>
        </div>
      </div>
    </section>
  );
}

// ============================================
// 12. RELATED PROJECTS SECTION
// ============================================
function RelatedProjectsSection({
  projects,
  currentSlug,
}: {
  projects: Project[];
  currentSlug: string;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  const filtered = projects?.filter((p) => p.slug !== currentSlug).slice(0, 3) || [];

  if (filtered.length === 0) return null;

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-white py-32 lg:py-48">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="mb-20 flex items-end justify-between"
        >
          <div>
            <span className="text-xs font-medium uppercase tracking-[0.3em] text-[#d4af37]">
              Explore More
            </span>
            <h2 className="mt-4 font-SchnyderS text-4xl font-light text-neutral-950 lg:text-5xl">
              Related Projects
            </h2>
          </div>
          <Link
            href="/projects"
            className="group hidden items-center gap-2 text-sm font-light text-neutral-600 transition-colors hover:text-neutral-950 md:flex"
          >
            View All
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>

        {/* Projects Grid */}
        <div className="grid gap-8 md:grid-cols-3">
          {filtered.map((project, index) => (
            <motion.div
              key={project.slug}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 * index }}
            >
              <Link href={`/projects/${project.slug}`} className="group block">
                <div className="relative mb-6 aspect-[4/3] overflow-hidden rounded-2xl">
                  <Image
                    src={project.featuredImage?.node?.sourceUrl || '/placeholder.jpg'}
                    alt={project.title || 'Project'}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="33vw"
                  />
                  <div className="absolute inset-0 bg-neutral-950/0 transition-colors group-hover:bg-neutral-950/20" />
                </div>
                <span className="text-xs font-light uppercase tracking-wider text-neutral-400">
                  {project.acfFields?.projectType || 'Luxury Project'}
                </span>
                <h3 className="mt-2 font-SchnyderS text-2xl font-light text-neutral-950 transition-colors group-hover:text-[#d4af37]">
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
    altText: img?.altText || project.title || 'Project image',
  }));

  const heroImage = galleryImages[0]?.sourceUrl ||
    project.featuredImage?.node?.sourceUrl ||
    '/projects/sheraton-abu-dhabi/sheratonAD01.jpg';

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
    setGalleryOpen(true);
  };

  return (
    <>
      <main className="overflow-hidden">
        {/* 1. Hero Banner */}
        <HeroBanner project={project} heroImage={heroImage} />

        {/* 2. Overview */}
        <OverviewSection project={project} />

        {/* 3. The Challenge */}
        <ChallengeSection
          project={project}
          image={galleryImages[1]?.sourceUrl || heroImage}
        />

        {/* 4. Design Approach */}
        <DesignApproachSection project={project} images={galleryImages} />

        {/* 5. Scope of Work */}
        <ScopeOfWorkSection project={project} />

        {/* 6. The Outcome */}
        <OutcomeSection project={project} />

        {/* 7. Project Details */}
        <ProjectDetailsSection project={project} />

        {/* 8. Gallery */}
        <GallerySection images={galleryImages} onImageClick={handleImageClick} />

        {/* 9. Before & After */}
        <BeforeAfterSection images={galleryImages} />

        {/* 10. Testimonial */}
        <TestimonialSection project={project} />

        {/* 11. Project Navigation (Prev/Next) */}
        <ProjectNavigationSection
          allProjects={allProjects}
          currentSlug={project.slug || ''}
        />

        {/* 12. Related Projects */}
        <RelatedProjectsSection
          projects={relatedProjects.length > 0 ? relatedProjects : allProjects}
          currentSlug={project.slug || ''}
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
