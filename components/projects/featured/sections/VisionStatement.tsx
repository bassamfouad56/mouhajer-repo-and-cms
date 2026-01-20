"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import Image from "next/image";

interface GalleryImage {
  url: string;
  alt?: string;
}

interface VisionStatementProps {
  challenge: string;
  approach: string;
  visionStatement?: string;
  backgroundImages: GalleryImage[];
  locale: string;
}

export function VisionStatement({
  challenge,
  approach,
  visionStatement,
  backgroundImages,
  locale,
}: VisionStatementProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isRTL = locale === "ar";

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
  });

  // Horizontal scroll effect for content
  const contentX = useTransform(
    smoothProgress,
    [0.1, 0.9],
    ["0%", isRTL ? "20%" : "-20%"]
  );

  // Parallax for background images
  const bgY = useTransform(smoothProgress, [0, 1], ["0%", "-20%"]);
  const bgOpacity = useTransform(
    smoothProgress,
    [0, 0.3, 0.7, 1],
    [0.3, 0.6, 0.6, 0.3]
  );

  // Text reveal animations
  const textOpacity = useTransform(smoothProgress, [0.1, 0.3], [0, 1]);
  const lineWidth = useTransform(smoothProgress, [0.2, 0.5], ["0%", "100%"]);

  // Section labels
  const labels = {
    en: {
      challenge: "The Challenge",
      approach: "Our Approach",
      vision: "Our Vision",
    },
    ar: {
      challenge: "التحدي",
      approach: "منهجنا",
      vision: "رؤيتنا",
    },
  };

  const t = isRTL ? labels.ar : labels.en;

  return (
    <section
      ref={containerRef}
      className="relative min-h-[80vh] py-24 md:py-32 overflow-hidden bg-[#0a0a0a]"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Background Images with Parallax */}
      <motion.div
        className="absolute inset-0"
        style={{ y: bgY, opacity: bgOpacity }}
      >
        {backgroundImages.slice(0, 2).map((img, index) => (
          <motion.div
            key={index}
            className={`absolute ${
              index === 0
                ? "top-0 right-0 w-1/2 h-2/3"
                : "bottom-0 left-0 w-1/3 h-1/2"
            } opacity-30`}
            initial={{ scale: 1.1 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 1.5 }}
          >
            <Image
              src={img.url}
              alt={img.alt || ""}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-transparent to-[#0a0a0a]" />
          </motion.div>
        ))}
      </motion.div>

      {/* Content Container */}
      <motion.div
        className="relative z-10 max-w-7xl mx-auto px-6 md:px-16"
        style={{ x: contentX }}
      >
        {/* Vision Statement - Large Quote */}
        {visionStatement && (
          <motion.div className="mb-24" style={{ opacity: textOpacity }}>
            <motion.span
              className="block text-[#c9a962] text-sm tracking-[0.3em] uppercase mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              {t.vision}
            </motion.span>
            <blockquote className="relative">
              {/* Opening Quote Mark */}
              <motion.span
                className="absolute -top-4 -left-4 md:-left-8 text-[#c9a962]/20 text-8xl md:text-9xl font-serif leading-none"
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, type: "spring" }}
              >
                "
              </motion.span>
              <motion.p
                className="text-2xl md:text-3xl lg:text-4xl text-white/90 font-light leading-relaxed max-w-4xl"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                {visionStatement}
              </motion.p>
            </blockquote>
            {/* Animated underline */}
            <motion.div
              className="mt-8 h-px bg-gradient-to-r from-[#c9a962] via-[#c9a962]/50 to-transparent"
              style={{ width: lineWidth }}
            />
          </motion.div>
        )}

        {/* Challenge & Approach Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24">
          {/* The Challenge */}
          {challenge && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center gap-4 mb-6">
                <motion.span
                  className="text-[#c9a962] text-sm tracking-[0.3em] uppercase"
                  initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                >
                  {t.challenge}
                </motion.span>
                <motion.div
                  className="flex-1 h-px bg-[#c9a962]/30"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                  style={{ transformOrigin: isRTL ? "right" : "left" }}
                />
              </div>
              <p className="text-white/70 text-lg leading-relaxed">
                {challenge}
              </p>
            </motion.div>
          )}

          {/* Our Approach */}
          {approach && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="flex items-center gap-4 mb-6">
                <motion.span
                  className="text-[#c9a962] text-sm tracking-[0.3em] uppercase"
                  initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                >
                  {t.approach}
                </motion.span>
                <motion.div
                  className="flex-1 h-px bg-[#c9a962]/30"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                  style={{ transformOrigin: isRTL ? "right" : "left" }}
                />
              </div>
              <p className="text-white/70 text-lg leading-relaxed">
                {approach}
              </p>
            </motion.div>
          )}
        </div>

        {/* Decorative Elements */}
        <motion.div
          className="absolute top-1/2 left-0 w-px h-32 bg-gradient-to-b from-transparent via-[#c9a962]/30 to-transparent"
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 1 }}
        />
        <motion.div
          className="absolute top-1/2 right-0 w-px h-32 bg-gradient-to-b from-transparent via-[#c9a962]/30 to-transparent"
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.7, duration: 1 }}
        />
      </motion.div>
    </section>
  );
}
