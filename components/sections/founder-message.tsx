"use client";

import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Quote } from "lucide-react";
import Link from "next/link";
import { SafeImage } from "@/components/safe-image";
import { homepageSectionAttr } from "@/lib/sanity-visual-editing";

interface FounderSanityData {
  sectionTitle?: string;
  founderName?: string;
  founderTitle?: string;
  founderImage?: { asset?: { url?: string } };
  quote?: string;
  message?: string;
  ctaText?: string;
  ctaLink?: string;
}

interface FounderMessageProps {
  founderImage?: string;
  founderName?: string;
  founderTitle?: string;
  founderQuote?: string;
  backgroundImage?: string;
  sanityData?: FounderSanityData | null;
  homepageId?: string;
  sectionKey?: string;
}

// Default founder image fallback
const DEFAULT_FOUNDER_IMAGE = "/founder/mouhajer.png";

// Default content
const DEFAULT_QUOTE =
  "Designing a palace on paper is easy. Building it on sand requires discipline.";
const DEFAULT_MESSAGE = `For over two decades, I have led a firm that refuses to outsource the hard work. Whether we are pouring the foundation for a new mega-mansion or fitting out a 5-star hotel lobby, my team controls the process from start to finish.

My promise to you is simple: The luxury you see in the render is exactly the quality you will touch in reality.`;

export function FounderMessage({
  founderImage,
  founderName = "Eng. Maher Mouhajer",
  founderTitle = "CEO & Founder",
  sanityData,
  homepageId,
  sectionKey,
}: FounderMessageProps) {
  // Use Sanity data if available, otherwise fall back to props/defaults
  const displayName = sanityData?.founderName || founderName;
  const displayTitle = sanityData?.founderTitle || founderTitle;
  const displayImage = founderImage || DEFAULT_FOUNDER_IMAGE;
  const displayQuote = sanityData?.quote || DEFAULT_QUOTE;
  const displayMessage = sanityData?.message || DEFAULT_MESSAGE;
  const ctaText = sanityData?.ctaText || "Read the Full Story";
  const ctaLink = sanityData?.ctaLink || "/about/founder";

  // Helper for visual editing data attributes
  const getDataAttr = (fieldPath: string) => {
    if (!homepageId || !sectionKey) return {};
    return homepageSectionAttr(homepageId, sectionKey, fieldPath);
  };
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  // Parallax effect
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.1, 1, 1.05]);

  return (
    <section
      ref={sectionRef}
      id="founder"
      className="relative overflow-hidden bg-neutral-950 scroll-mt-24"
    >
      {/* Background with Parallax */}
      <motion.div className="absolute inset-0" style={{ y: backgroundY }}>
        {/* Subtle gradient background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(201,169,98,0.08),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(201,169,98,0.05),transparent_50%)]" />
      </motion.div>

      {/* Main Content Container */}
      <div className="relative z-10 mx-auto max-w-[1800px] px-6 py-24 lg:px-12 lg:py-32">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center lg:mb-20"
        >
          <div className="mb-6 flex items-center justify-center gap-4">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#8f7852]/50" />
            <span className="font-Satoshi text-[10px] font-medium uppercase tracking-[0.4em] text-[#8f7852]">
              Founder&apos;s Message
            </span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#8f7852]/50" />
          </div>
          <h2 className="font-SchnyderS text-4xl font-light tracking-tight text-white sm:text-5xl lg:text-6xl">
            We Don&apos;t Just Draw.{" "}
            <span className="text-[#8f7852]">We Build.</span>
          </h2>
        </motion.div>

        {/* Editorial Layout - Centered Card Design */}
        <div className="mx-auto max-w-6xl">
          <div className="relative grid gap-0 overflow-hidden rounded-sm lg:grid-cols-[1fr_1.2fr]">
            {/* Left - Portrait Image */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 1, delay: 0.2 }}
              className="relative aspect-[3/4] overflow-hidden bg-neutral-900 lg:aspect-auto"
            >
              <motion.div
                className="absolute inset-0"
                style={{ scale: imageScale }}
              >
                <SafeImage
                  src={displayImage}
                  alt={`${founderName} - ${founderTitle}`}
                  fill
                  className="object-cover object-top"
                  priority
                />
              </motion.div>

              {/* Elegant Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-neutral-950/20 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-neutral-950/60 hidden lg:block" />

              {/* Decorative Frame */}
              <div className="absolute inset-4 border border-white/10 pointer-events-none" />

              {/* Name Card at Bottom */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="absolute bottom-0 left-0 right-0 p-6 lg:p-8"
              >
                <div className="flex items-end justify-between">
                  <div>
                    <h3
                      className="font-SchnyderS text-2xl font-light tracking-wide text-white lg:text-3xl"
                      {...getDataAttr("founderName")}
                    >
                      {displayName}
                    </h3>
                    <p
                      className="mt-1 font-Satoshi text-xs font-light uppercase tracking-[0.2em] text-[#8f7852]"
                      {...getDataAttr("founderTitle")}
                    >
                      {displayTitle}
                    </p>
                  </div>
                  <div className="hidden h-12 w-12 items-center justify-center rounded-full border border-[#8f7852]/30 lg:flex">
                    <Quote size={18} className="text-[#8f7852]" />
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Right - Quote & Message */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 1, delay: 0.3 }}
              className="relative flex flex-col justify-center bg-[#0f0f0f] p-8 lg:p-12 xl:p-16"
            >
              {/* Large Decorative Quote Mark */}
              <div className="absolute right-8 top-8 opacity-[0.03] lg:right-12 lg:top-12">
                <span className="font-SchnyderS text-[200px] font-light leading-none text-white lg:text-[300px]">
                  "
                </span>
              </div>

              {/* Quote */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="relative z-10 mb-8"
              >
                <blockquote
                  className="font-SchnyderS text-2xl font-light leading-[1.4] tracking-wide text-white sm:text-3xl lg:text-4xl"
                  {...getDataAttr("quote")}
                >
                  <span className="text-[#8f7852]">"</span>
                  {displayQuote}
                  <span className="text-[#8f7852]">"</span>
                </blockquote>
              </motion.div>

              {/* Gold Accent Line */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={isInView ? { scaleX: 1 } : {}}
                transition={{ duration: 1, delay: 0.7 }}
                className="mb-8 h-px w-16 origin-left bg-gradient-to-r from-[#8f7852] to-transparent"
              />

              {/* Message Body */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="relative z-10 mb-10 space-y-5"
                {...getDataAttr("message")}
              >
                {displayMessage.split("\n\n").map((paragraph, index) => (
                  <p
                    key={index}
                    className={`font-Satoshi text-base font-light leading-[1.9] lg:text-lg ${
                      index === 0 ? "text-neutral-400" : "text-neutral-500"
                    }`}
                  >
                    {paragraph}
                  </p>
                ))}
              </motion.div>

              {/* CTA Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 1 }}
              >
                <Link
                  href={ctaLink}
                  className="group inline-flex items-center gap-4 border border-[#8f7852]/30 bg-transparent px-8 py-4 font-Satoshi text-xs font-light uppercase tracking-[0.2em] text-[#8f7852] transition-all duration-500 hover:border-[#8f7852] hover:bg-[#8f7852] hover:text-neutral-950"
                >
                  <span {...getDataAttr("ctaText")}>{ctaText}</span>
                  <ArrowRight
                    className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                    strokeWidth={1.5}
                  />
                </Link>
              </motion.div>

              {/* Decorative Corner Elements */}
              <div className="absolute right-0 top-0 h-20 w-20 border-r border-t border-[#8f7852]/10" />
              <div className="absolute bottom-0 left-0 h-20 w-20 border-b border-l border-[#8f7852]/10" />
            </motion.div>
          </div>
        </div>

        {/* Bottom Decorative Elements */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="mt-16 flex items-center justify-center gap-8 lg:mt-20"
        >
          <div className="h-px w-24 bg-gradient-to-r from-transparent to-[#8f7852]/30" />
          <div className="flex items-center gap-3">
            <div className="h-1.5 w-1.5 rounded-full bg-[#8f7852]/40" />
            <span className="font-Satoshi text-[10px] font-light uppercase tracking-[0.3em] text-neutral-600">
              Excellence Since 2001
            </span>
            <div className="h-1.5 w-1.5 rounded-full bg-[#8f7852]/40" />
          </div>
          <div className="h-px w-24 bg-gradient-to-l from-transparent to-[#8f7852]/30" />
        </motion.div>
      </div>

      {/* Top & Bottom Accent Lines */}
      <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-[#8f7852]/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#8f7852]/20 to-transparent" />
    </section>
  );
}
