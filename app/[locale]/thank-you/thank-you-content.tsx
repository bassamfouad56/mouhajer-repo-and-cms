"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import Link from "next/link";
import {
  CheckCircle2,
  FileSearch,
  UserCheck,
  Phone,
  ArrowRight,
  Mail,
  MessageCircle,
  Home,
  Trophy,
  Sparkles,
} from "lucide-react";
import { SafeImage } from "@/components/safe-image";

// Project images for showcase
const PROJECT_IMAGES = [
  {
    src: "/website%202.0%20content/projects/hospitality/_DSC3629-HDR.jpg",
    title: "Address Boulevard VIP Suite",
    category: "Hospitality",
  },
  {
    src: "/website%202.0%20content/services/industries/luxury%20hospitality/_MID3940-HDR.jpg",
    title: "Sheraton Abu Dhabi",
    category: "Hospitality",
  },
  {
    src: "/website%202.0%20content/services/industries/highend%20residential/_MID0001-HDR-2.jpg",
    title: "Address Boulevard Penthouse",
    category: "Residential",
  },
  {
    src: "/website%202.0%20content/services/industries/commercial%20and%20corporate/_MID1004-HDR.jpg",
    title: "Corporate Excellence",
    category: "Commercial",
  },
];

export default function ThankYouContent() {
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="relative bg-[#faf8f5]">
      {/* Cinematic Hero */}
      <CinematicHero />

      {/* What Happens Next Section */}
      <WhatsNextSection />

      {/* Project Preview Showcase */}
      <ProjectShowcase />

      {/* Promise Section */}
      <PromiseSection />

      {/* Contact Section */}
      <ContactSection />

      {/* Explore More CTA */}
      <ExploreCTA />
    </main>
  );
}

// ============================================================================
// CINEMATIC HERO
// ============================================================================

function CinematicHero() {
  const heroRef = useRef<HTMLElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <section ref={heroRef} className="relative min-h-screen overflow-hidden">
      {/* Background Image with Parallax */}
      <motion.div
        className="absolute inset-0"
        style={{ scale: imageScale, y: imageY }}
      >
        <SafeImage
          src="/website%202.0%20content/projects/hospitality/_DSC3629-HDR.jpg"
          alt="Luxury Interior"
          fill
          className="object-cover"
          priority
        />
        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/70 via-neutral-950/50 to-neutral-950/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/50 via-transparent to-neutral-950/50" />

        {/* Subtle gold glow */}
        <div className="absolute bottom-0 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-[#8f7852]/10 blur-[150px]" />
      </motion.div>

      {/* Film Grain */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.04]">
        <div className="h-full w-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iMC44IiBudW1PY3RhdmVzPSI0IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsdGVyPSJ1cmwoI2EpIi8+PC9zdmc+')] bg-repeat" />
      </div>

      {/* Corner Accents */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isLoaded ? { opacity: 1 } : {}}
        transition={{ duration: 1, delay: 1 }}
        className="pointer-events-none absolute inset-0 z-20"
      >
        <div className="absolute left-8 top-32 h-20 w-20 border-l border-t border-[#8f7852]/50 lg:left-16" />
        <div className="absolute bottom-32 right-8 h-20 w-20 border-b border-r border-[#8f7852]/50 lg:right-16" />
      </motion.div>

      {/* Main Content */}
      <motion.div
        style={{ opacity, y }}
        className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 py-32 lg:px-12"
      >
        <div className="mx-auto max-w-4xl text-center">
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={isLoaded ? { scale: 1, opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.3, type: "spring" }}
            className="mb-10 inline-flex"
          >
            <div className="relative">
              <div className="flex h-28 w-28 items-center justify-center border-2 border-emerald-400/40 bg-emerald-400/10 backdrop-blur-sm">
                <CheckCircle2
                  className="h-14 w-14 text-emerald-400"
                  strokeWidth={1.5}
                />
              </div>
              {/* Decorative corners */}
              <div className="absolute -left-2 -top-2 h-4 w-4 border-l-2 border-t-2 border-emerald-400/60" />
              <div className="absolute -bottom-2 -right-2 h-4 w-4 border-b-2 border-r-2 border-emerald-400/60" />
            </div>
          </motion.div>

          {/* Label */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mb-6 flex items-center justify-center gap-4"
          >
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-emerald-400/60" />
            <span className="font-Satoshi text-xs font-medium uppercase tracking-[0.4em] text-emerald-400">
              Submission Confirmed
            </span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-emerald-400/60" />
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.7 }}
            className="mb-8 font-SchnyderS text-5xl font-light leading-[1.1] tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl"
          >
            Your Project is
            <br />
            <span className="text-[#8f7852]">Now in Our Queue</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="mx-auto max-w-2xl font-Satoshi text-xl font-light leading-relaxed text-white/70 lg:text-2xl"
          >
            We have received your consultation brief. A confirmation email has
            been sent to the address you provided.
          </motion.p>

          {/* Response Time Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 1.1 }}
            className="mt-12 inline-flex items-center gap-3 border border-[#8f7852]/40 bg-[#8f7852]/10 px-8 py-4 backdrop-blur-sm"
          >
            <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
            <span className="font-Satoshi text-sm font-light text-white">
              Expected response:{" "}
              <strong className="font-medium text-[#8f7852]">
                Within 48 hours
              </strong>
            </span>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isLoaded ? { opacity: 1 } : {}}
        transition={{ duration: 0.8, delay: 1.5 }}
        className="absolute bottom-12 left-1/2 z-10 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-3"
        >
          <span className="font-Satoshi text-[10px] font-light uppercase tracking-[0.4em] text-white/40">
            What Happens Next
          </span>
          <div className="h-12 w-px bg-gradient-to-b from-[#8f7852] to-transparent" />
        </motion.div>
      </motion.div>
    </section>
  );
}

// ============================================================================
// WHAT'S NEXT SECTION
// ============================================================================

function WhatsNextSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const steps = [
    {
      icon: FileSearch,
      title: "Review",
      description:
        "Your project details are being reviewed by our Senior Project Manager to assess scope and feasibility.",
      image:
        "/website%202.0%20content/services/industries/commercial%20and%20corporate/_MID1004-HDR.jpg",
    },
    {
      icon: UserCheck,
      title: "Assignment",
      description:
        "Based on your project type, we assign the most relevant Technical Lead to your file.",
      image:
        "/website%202.0%20content/services/industries/luxury%20hospitality/_MID3940-HDR.jpg",
    },
    {
      icon: Phone,
      title: "Contact",
      description:
        "You will receive a call or WhatsApp message within 48 hours to schedule your discovery meeting.",
      image:
        "/website%202.0%20content/services/industries/highend%20residential/_MID0001-HDR-2.jpg",
    },
  ];

  return (
    <section ref={sectionRef} className="relative bg-[#faf8f5] py-32 lg:py-40">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div
          className="h-full w-full"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #8f7852 1px, transparent 0)`,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-[1400px] px-6 lg:px-12">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-20 text-center"
        >
          <div className="mb-6 flex items-center justify-center gap-4">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#8f7852]" />
            <span className="font-Satoshi text-[10px] font-medium uppercase tracking-[0.4em] text-[#8f7852]">
              The Process
            </span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#8f7852]" />
          </div>

          <h2 className="font-SchnyderS text-5xl font-light tracking-tight text-neutral-900 sm:text-6xl lg:text-7xl">
            What Happens
            <br />
            <span className="text-[#8f7852]">Next?</span>
          </h2>
        </motion.div>

        {/* Steps */}
        <div className="space-y-24 lg:space-y-32">
          {steps.map((step, index) => (
            <StepCard
              key={index}
              step={step}
              index={index}
              isEven={index % 2 === 0}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function StepCard({
  step,
  index,
  isEven,
}: {
  step: { icon: any; title: string; description: string; image: string };
  index: number;
  isEven: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: 0.2 }}
      className={`grid gap-12 lg:grid-cols-2 lg:gap-20 ${isEven ? "" : "lg:direction-rtl"}`}
    >
      {/* Image */}
      <motion.div
        initial={{ opacity: 0, x: isEven ? -40 : 40 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.3 }}
        className={`relative ${isEven ? "" : "lg:order-2"}`}
      >
        <div className="group relative overflow-hidden">
          <div className="aspect-[4/3] w-full">
            <SafeImage
              src={step.image}
              alt={step.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/50 to-transparent" />

          {/* Step Number */}
          <div className="absolute bottom-6 left-6 flex h-16 w-16 items-center justify-center border border-[#8f7852] bg-neutral-950/80 backdrop-blur-sm">
            <span className="font-SchnyderS text-3xl font-light text-[#8f7852]">
              {String(index + 1).padStart(2, "0")}
            </span>
          </div>
        </div>

        {/* Decorative Frame */}
        <div className="absolute -bottom-3 -right-3 h-full w-full border border-[#8f7852]/20 -z-10" />
      </motion.div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, x: isEven ? 40 : -40 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.4 }}
        className={`flex flex-col justify-center ${isEven ? "" : "lg:order-1"}`}
      >
        {/* Icon */}
        <div className="mb-8 flex h-20 w-20 items-center justify-center border border-[#8f7852]/30 bg-[#8f7852]/5">
          <step.icon className="h-10 w-10 text-[#8f7852]" strokeWidth={1.5} />
        </div>

        {/* Title */}
        <h3 className="mb-6 font-SchnyderS text-4xl font-light text-neutral-900 lg:text-5xl">
          {step.title}
        </h3>

        {/* Description */}
        <p className="font-Satoshi text-lg font-light leading-relaxed text-neutral-600">
          {step.description}
        </p>

        {/* Divider */}
        <div className="mt-8 h-px w-24 bg-gradient-to-r from-[#8f7852] to-transparent" />
      </motion.div>
    </motion.div>
  );
}

// ============================================================================
// PROJECT SHOWCASE
// ============================================================================

function ProjectShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-20%"]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-neutral-950 py-32 lg:py-40"
    >
      {/* Background */}
      <div className="absolute left-1/4 top-1/2 h-[600px] w-[600px] -translate-y-1/2 rounded-full bg-[#8f7852]/[0.05] blur-[200px]" />

      {/* Film Grain */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.03]">
        <div className="h-full w-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iMC44IiBudW1PY3RhdmVzPSI0IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsdGVyPSJ1cmwoI2EpIi8+PC9zdmc+')] bg-repeat" />
      </div>

      {/* Corner Accents */}
      <div className="pointer-events-none absolute left-8 top-20 h-16 w-16 border-l border-t border-[#8f7852]/30 lg:left-16" />
      <div className="pointer-events-none absolute bottom-20 right-8 h-16 w-16 border-b border-r border-[#8f7852]/30 lg:right-16" />

      <div className="relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-16 px-6 text-center lg:px-12"
        >
          <div className="mb-6 flex items-center justify-center gap-4">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#8f7852]" />
            <span className="font-Satoshi text-[10px] font-medium uppercase tracking-[0.4em] text-[#8f7852]">
              While You Wait
            </span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#8f7852]" />
          </div>

          <h2 className="font-SchnyderS text-5xl font-light tracking-tight text-white sm:text-6xl lg:text-7xl">
            Explore Our
            <br />
            <span className="text-[#8f7852]">Portfolio</span>
          </h2>
        </motion.div>

        {/* Scrolling Projects */}
        <motion.div style={{ x }} className="flex gap-6 px-6 lg:gap-8">
          {[...PROJECT_IMAGES, ...PROJECT_IMAGES].map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 * (index % 4) }}
              className="group relative w-[350px] flex-shrink-0 lg:w-[450px]"
            >
              <div className="relative overflow-hidden">
                <div className="aspect-[4/3] w-full">
                  <SafeImage
                    src={project.src}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-neutral-950/20 to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-90" />

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 transition-transform duration-500 group-hover:translate-y-0">
                  <div className="mb-2 font-Satoshi text-xs font-light uppercase tracking-wider text-[#8f7852]">
                    {project.category}
                  </div>
                  <h3 className="font-SchnyderS text-2xl font-light text-white lg:text-3xl">
                    {project.title}
                  </h3>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <Link
            href="/projects"
            className="group inline-flex items-center gap-3 border border-[#8f7852] bg-transparent px-10 py-5 font-Satoshi text-sm font-light tracking-widest text-[#8f7852] transition-all hover:bg-[#8f7852] hover:text-neutral-950"
          >
            <span>VIEW ALL PROJECTS</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-2" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

// ============================================================================
// PROMISE SECTION
// ============================================================================

function PromiseSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-[#faf8f5] py-32 lg:py-40"
    >
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-20">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative overflow-hidden">
              <div className="aspect-[3/4] w-full">
                <SafeImage
                  src="/website%202.0%20content/services/industries/luxury%20hospitality/_MID3940-HDR.jpg"
                  alt="Luxury Interior"
                  fill
                  className="object-cover"
                />
              </div>
              {/* Gold border accent */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#8f7852]/60 via-[#8f7852] to-[#8f7852]/60" />
            </div>

            {/* Decorative Frame */}
            <div className="absolute -bottom-4 -right-4 h-full w-full border border-[#8f7852]/20 -z-10" />

            {/* Award Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="absolute -right-6 top-8 bg-neutral-950 p-6 shadow-2xl lg:-right-12"
            >
              <Trophy
                className="mb-3 h-8 w-8 text-[#8f7852]"
                strokeWidth={1.5}
              />
              <div className="font-SchnyderS text-3xl font-light text-white">
                5+
              </div>
              <div className="font-Satoshi text-xs font-light uppercase tracking-wider text-white/60">
                International Awards
              </div>
            </motion.div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col justify-center"
          >
            {/* Label */}
            <div className="mb-6 flex items-center gap-4">
              <Sparkles className="h-4 w-4 text-[#8f7852]" />
              <span className="font-Satoshi text-xs font-medium uppercase tracking-[0.3em] text-[#8f7852]">
                Our Promise
              </span>
            </div>

            {/* Quote */}
            <blockquote className="mb-10 font-SchnyderS text-4xl font-light leading-[1.3] text-neutral-900 lg:text-5xl xl:text-6xl">
              &ldquo;Every project we undertake carries the same commitment to
              perfection.
              <span className="text-[#8f7852]">
                {" "}
                Excellence is not our goal—it&apos;s our standard.
              </span>
              &rdquo;
            </blockquote>

            {/* Attribution */}
            <div className="mb-10">
              <div className="mb-2 font-Satoshi text-lg font-medium text-neutral-900">
                Maher Mouhajer
              </div>
              <div className="font-Satoshi text-sm font-light text-neutral-500">
                Founder & CEO
              </div>
            </div>

            {/* Stats */}
            <div className="flex gap-12">
              {[
                { number: "25+", label: "Years Experience" },
                { number: "200+", label: "Projects Delivered" },
              ].map((stat, index) => (
                <div key={index}>
                  <div className="mb-1 font-SchnyderS text-4xl font-light text-[#8f7852]">
                    {stat.number}
                  </div>
                  <div className="font-Satoshi text-xs font-light uppercase tracking-wider text-neutral-500">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// CONTACT SECTION
// ============================================================================

function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-neutral-950 py-32 lg:py-40"
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <SafeImage
          src="/website%202.0%20content/services/industries/highend%20residential/_MID0001-HDR-2.jpg"
          alt="Background"
          fill
          className="object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/90 to-neutral-950" />
      </div>

      {/* Film Grain */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.03]">
        <div className="h-full w-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iMC44IiBudW1PY3RhdmVzPSI0IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsdGVyPSJ1cmwoI2EpIi8+PC9zdmc+')] bg-repeat" />
      </div>

      {/* Corner Accents */}
      <div className="pointer-events-none absolute left-8 top-20 h-16 w-16 border-l border-t border-[#8f7852]/30 lg:left-16" />
      <div className="pointer-events-none absolute bottom-20 right-8 h-16 w-16 border-b border-r border-[#8f7852]/30 lg:right-16" />

      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.2, type: "spring" }}
            className="mb-8 inline-flex"
          >
            <div className="flex h-20 w-20 items-center justify-center border border-[#8f7852]/40 bg-[#8f7852]/10">
              <MessageCircle
                className="h-10 w-10 text-[#8f7852]"
                strokeWidth={1.5}
              />
            </div>
          </motion.div>

          {/* Title */}
          <h2 className="mb-6 font-SchnyderS text-5xl font-light tracking-tight text-white sm:text-6xl lg:text-7xl">
            Need to Speak
            <br />
            <span className="text-[#8f7852]">Now?</span>
          </h2>

          <p className="mb-12 font-Satoshi text-lg font-light leading-relaxed text-white/60">
            If your inquiry is time-sensitive or involves an active tender
            deadline, please contact our Executive Office directly.
          </p>

          {/* Contact Cards */}
          <div className="mb-12 grid gap-6 sm:grid-cols-2">
            <motion.a
              href={`tel:${process.env.NEXT_PUBLIC_PHONE || "+971-4-323-4567"}`}
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="group flex items-center gap-5 border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all hover:border-[#8f7852]/50 hover:bg-white/10"
            >
              <div className="flex h-14 w-14 items-center justify-center border border-[#8f7852]/40 bg-[#8f7852]/10">
                <Phone className="h-6 w-6 text-[#8f7852]" strokeWidth={1.5} />
              </div>
              <div className="text-left">
                <div className="mb-1 font-Satoshi text-xs font-light uppercase tracking-wider text-white/50">
                  Direct Line
                </div>
                <div className="font-Satoshi text-lg font-light text-white transition-colors group-hover:text-[#8f7852]">
                  {process.env.NEXT_PUBLIC_PHONE || "+971-4-323-4567"}
                </div>
              </div>
            </motion.a>

            <motion.a
              href={`mailto:${process.env.NEXT_PUBLIC_EMAIL || "info@mouhajerdesign.com"}`}
              initial={{ opacity: 0, x: 20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="group flex items-center gap-5 border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all hover:border-[#8f7852]/50 hover:bg-white/10"
            >
              <div className="flex h-14 w-14 items-center justify-center border border-[#8f7852]/40 bg-[#8f7852]/10">
                <Mail className="h-6 w-6 text-[#8f7852]" strokeWidth={1.5} />
              </div>
              <div className="text-left">
                <div className="mb-1 font-Satoshi text-xs font-light uppercase tracking-wider text-white/50">
                  Email
                </div>
                <div className="font-Satoshi text-lg font-light text-white transition-colors group-hover:text-[#8f7852]">
                  {process.env.NEXT_PUBLIC_EMAIL || "info@mouhajerdesign.com"}
                </div>
              </div>
            </motion.a>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="font-Satoshi text-sm font-light text-white/40"
          >
            (Please reference your Name or Organization when calling)
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}

// ============================================================================
// EXPLORE CTA
// ============================================================================

function ExploreCTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section ref={sectionRef} className="relative bg-[#faf8f5] py-32 lg:py-40">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div
          className="h-full w-full"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #8f7852 1px, transparent 0)`,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          {/* Label */}
          <div className="mb-6 flex items-center justify-center gap-4">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#8f7852]" />
            <span className="font-Satoshi text-[10px] font-medium uppercase tracking-[0.4em] text-[#8f7852]">
              Continue Exploring
            </span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#8f7852]" />
          </div>

          {/* Title */}
          <h2 className="mb-8 font-SchnyderS text-5xl font-light tracking-tight text-neutral-900 sm:text-6xl lg:text-7xl">
            Discover More
            <br />
            <span className="text-[#8f7852]">About Us</span>
          </h2>

          <p className="mx-auto mb-12 max-w-2xl font-Satoshi text-lg font-light leading-relaxed text-neutral-600">
            While you wait for our team to reach out, explore our services,
            award-winning projects, and learn more about the Mouhajer
            difference.
          </p>

          {/* CTAs */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/"
              className="group inline-flex items-center gap-3 border-2 border-[#8f7852] bg-[#8f7852] px-10 py-5 font-Satoshi text-sm font-medium tracking-widest text-neutral-900 transition-all hover:bg-transparent hover:text-[#8f7852]"
            >
              <Home className="h-4 w-4" />
              <span>RETURN HOME</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-2" />
            </Link>
            <Link
              href="/about/awards"
              className="group inline-flex items-center gap-3 border-2 border-neutral-300 px-10 py-5 font-Satoshi text-sm font-light tracking-widest text-neutral-700 transition-all hover:border-[#8f7852] hover:text-[#8f7852]"
            >
              <Trophy className="h-4 w-4" />
              <span>VIEW AWARDS</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-2" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
