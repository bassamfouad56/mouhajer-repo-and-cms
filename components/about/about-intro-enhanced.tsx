"use client";

import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { SafeImage } from "@/components/safe-image";
import { getProjectPlaceholder } from "@/lib/image-utils";
import {
  SVGLineDraw,
  SVGCircleDraw,
} from "@/components/animations/svg-line-draw";
import { RevealText } from "@/components/animations/reveal-text";
import { MagneticButton } from "@/components/animations/magnetic-button";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export function AboutIntroEnhanced() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ["10%", "-10%"]);
  const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.1, 1, 1.05]);
  const imageRotate = useTransform(scrollYProgress, [0, 1], [-2, 2]);

  // Parallax for decorative elements
  const decorY1 = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const decorY2 = useTransform(scrollYProgress, [0, 1], ["0%", "-20%"]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-neutral-50 py-24 sm:py-32 lg:py-40"
    >
      {/* Animated Background Pattern */}
      <div className="absolute inset-0">
        <motion.div style={{ y: decorY1 }} />
        {/* Gradient orbs */}
        <motion.div
          className="absolute -left-40 top-20 h-80 w-80 rounded-full bg-[#c9a962]/5 blur-3xl"
          style={{ y: decorY2 }}
        />
        <motion.div
          className="absolute -right-40 bottom-20 h-80 w-80 rounded-full bg-neutral-900/5 blur-3xl"
          style={{ y: decorY1 }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-12">
        {/* Main Content Section */}
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-20 xl:gap-32">
          {/* Left - Main Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col justify-center"
          >
            {/* Animated Section Label */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-8 flex items-center gap-4"
            >
              <SVGLineDraw
                width={48}
                height={2}
                strokeColor="#c9a962"
                duration={1}
                delay={0.3}
              />
              <span className="font-Satoshi text-xs font-light uppercase tracking-[0.3em] text-neutral-400">
                Who We Are
              </span>
            </motion.div>

            {/* Animated Heading */}
            <div className="mb-8 overflow-hidden">
              <RevealText
                className="font-SchnyderS text-4xl font-light tracking-tight text-neutral-950 sm:text-5xl lg:text-6xl"
                delay={0.4}
                stagger={0.025}
              >
                A Premier Turnkey Solution Provider
              </RevealText>
            </div>

            {/* Content with stagger animation */}
            <div className="space-y-6">
              {[
                "Headquartered in the UAE, we have established ourselves as a premier turnkey construction solution provider, serving the region's most demanding clients across Dubai and Abu Dhabi.",
                "In a market often fragmented by disconnected service providers, MIDC stands apart as a unified force. We bridge the critical gap between architectural design and technical execution.",
                "By integrating luxury interior fit-out, structural construction, and complex MEP engineering services under one roof, we eliminate the friction that typically plagues high-stakes projects.",
              ].map((text, index) => (
                <motion.p
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.6 + index * 0.15 }}
                  className="font-Satoshi text-base font-light leading-relaxed text-neutral-600 lg:text-lg"
                >
                  {text}
                </motion.p>
              ))}
            </div>

            {/* Luxury divider line */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : {}}
              transition={{ duration: 1.2, delay: 1.2, ease: "easeInOut" }}
              className="my-8 h-px w-full origin-left bg-gradient-to-r from-[#c9a962] via-[#c9a962]/30 to-transparent"
            />

            {/* CTA with magnetic effect */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 1.4 }}
            >
              <MagneticButton strength={0.2}>
                <Link
                  href="/about/process"
                  className="group inline-flex items-center gap-3 border border-neutral-900 bg-neutral-950 px-8 py-4 font-Satoshi text-sm font-light uppercase tracking-wider text-white transition-all duration-500 hover:bg-[#c9a962] hover:border-[#c9a962]"
                >
                  <span>Explore Our Process</span>
                  <ArrowRight
                    className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                    strokeWidth={1.5}
                  />
                </Link>
              </MagneticButton>
            </motion.div>
          </motion.div>

          {/* Right - Enhanced Image with 3D effects */}
          <motion.div
            ref={imageRef}
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            {/* Main image with parallax and 3D effect */}
            <motion.div
              style={{
                y: imageY,
                scale: imageScale,
                rotateY: imageRotate,
              }}
              className="relative aspect-[4/5] overflow-hidden"
            >
              <div className="absolute inset-0 rounded-sm">
                <SafeImage
                  src="/founder/CID_2106_00_COVER.jpg"
                  alt="MIDC Interior Design Project"
                  fallbackSrc="/placeholder.jpg"
                  fill
                  className="object-cover"
                />

                {/* Animated overlay gradient */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : {}}
                  transition={{ duration: 1, delay: 0.8 }}
                  className="absolute inset-0 bg-gradient-to-t from-neutral-950/60 via-transparent to-transparent"
                />

                {/* Animated corner frames */}
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={isInView ? { scale: 1, opacity: 1 } : {}}
                  transition={{ duration: 0.8, delay: 1 }}
                  className="absolute left-6 top-6 h-24 w-24"
                >
                  <SVGPathDraw
                    path="M 24 0 L 0 0 L 0 24"
                    width={24}
                    height={24}
                    strokeColor="#c9a962"
                    strokeWidth={2}
                    duration={1.5}
                    delay={1.2}
                  />
                </motion.div>
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={isInView ? { scale: 1, opacity: 1 } : {}}
                  transition={{ duration: 0.8, delay: 1.1 }}
                  className="absolute bottom-6 right-6 h-24 w-24"
                >
                  <SVGPathDraw
                    path="M 0 24 L 24 24 L 24 0"
                    width={24}
                    height={24}
                    strokeColor="#c9a962"
                    strokeWidth={2}
                    duration={1.5}
                    delay={1.3}
                  />
                </motion.div>
              </div>
            </motion.div>

            {/* Floating decorative element */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.8, delay: 1.4 }}
              animate={{ y: [-10, 10, -10] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -right-8 top-1/4 hidden lg:block"
            >
              <div className="h-16 w-16 rounded-full border-2 border-[#c9a962]/30 bg-white/80 backdrop-blur-sm" />
            </motion.div>
          </motion.div>
        </div>

        {/* Second Content Block - Enhanced Portfolio Description */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-32 lg:mt-40"
        >
          <div className="mx-auto max-w-5xl">
            {/* Centered luxury divider */}
            <div className="mb-12 flex items-center justify-center gap-4">
              <SVGLineDraw
                width={120}
                height={2}
                strokeColor="#c9a962"
                duration={1.5}
                delay={1}
              />
              <motion.div
                initial={{ scale: 0 }}
                animate={isInView ? { scale: 1 } : {}}
                transition={{ duration: 0.6, delay: 1.2, type: "spring" }}
              >
                <Sparkles
                  className="h-5 w-5 text-[#c9a962]"
                  strokeWidth={1.5}
                />
              </motion.div>
              <SVGLineDraw
                width={120}
                height={2}
                strokeColor="#c9a962"
                duration={1.5}
                delay={1}
              />
            </div>

            <div className="space-y-8 text-center">
              {[
                "Our portfolio speaks to the diversity of our expertise. Whether we are executing a complex hospitality renovation for a 5-star landmark like the Sheraton Abu Dhabi or managing the ground-up construction of a high-end residential villa in District One, our approach remains the same.",
                "We combine aesthetic mastery with rigorous project management excellence. From the initial concept 3D renderings to the final installation of bespoke joinery and FF&E, we control every variable to ensure your project is delivered on time, on budget, and to an award-winning standard.",
              ].map((text, index) => (
                <motion.p
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 1.4 + index * 0.2 }}
                  className="font-Satoshi text-lg font-light leading-relaxed text-neutral-600 lg:text-xl"
                >
                  {text}
                </motion.p>
              ))}
            </div>

            {/* Key Capabilities with hover effects */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 1.8 }}
              className="mt-16 grid grid-cols-2 gap-6 md:grid-cols-4"
            >
              {[
                { label: "Concept Design", icon: "✏️" },
                { label: "Luxury Fit-out", icon: "🏗️" },
                { label: "MEP Engineering", icon: "⚡" },
                { label: "FF&E Procurement", icon: "🪑" },
              ].map((item, index) => (
                <MagneticButton key={index} strength={0.15}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.5, delay: 2 + index * 0.1 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="group relative overflow-hidden border border-neutral-200 bg-white p-6 text-center transition-all duration-300 hover:border-[#c9a962]/30 hover:shadow-xl"
                  >
                    <motion.div className="absolute inset-0 bg-gradient-to-br from-[#c9a962]/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    <div className="relative">
                      <div className="mb-3 text-3xl">{item.icon}</div>
                      <div className="font-Satoshi text-sm font-light text-neutral-600">
                        {item.label}
                      </div>
                    </div>
                  </motion.div>
                </MagneticButton>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Decorative corner elements */}
      <div className="pointer-events-none absolute left-0 top-0 hidden h-64 w-64 lg:block">
        <SVGPathDraw
          path="M 64 0 L 0 0 L 0 64"
          width={64}
          height={64}
          strokeColor="#c9a962"
          strokeWidth={1}
          duration={2}
          delay={0.5}
        />
      </div>
      <div className="pointer-events-none absolute bottom-0 right-0 hidden h-64 w-64 lg:block">
        <SVGPathDraw
          path="M 0 64 L 64 64 L 64 0"
          width={64}
          height={64}
          strokeColor="#c9a962"
          strokeWidth={1}
          duration={2}
          delay={0.7}
        />
      </div>
    </section>
  );
}

// Helper component for SVG path drawing
function SVGPathDraw({
  path,
  width = 24,
  height = 24,
  strokeColor = "#c9a962",
  strokeWidth = 2,
  duration = 1,
  delay = 0,
}: {
  path: string;
  width?: number;
  height?: number;
  strokeColor?: string;
  strokeWidth?: number;
  duration?: number;
  delay?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      ref={ref}
    >
      <motion.path
        d={path}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
        transition={{
          pathLength: { duration, delay, ease: "easeInOut" },
          opacity: { duration: 0.3, delay },
        }}
      />
    </svg>
  );
}
