"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  useSpring,
} from "framer-motion";

interface ShowcaseImage {
  url: string;
  alt?: string;
  caption?: string;
}

interface CinematicShowcaseProps {
  images: ShowcaseImage[];
  locale: string;
}

export function CinematicShowcase({ images, locale }: CinematicShowcaseProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isRTL = locale === "ar";

  if (images.length < 3) return null;

  // Take first 5 images for cinematic showcase
  const showcaseImages = images.slice(0, 5);

  return (
    <div ref={containerRef} className="relative">
      {/* Full-Bleed Hero Image */}
      <FullBleedSection image={showcaseImages[0]} index={0} locale={locale} />

      {/* Split Screen Section */}
      {showcaseImages[1] && showcaseImages[2] && (
        <SplitScreenSection
          leftImage={showcaseImages[1]}
          rightImage={showcaseImages[2]}
          locale={locale}
        />
      )}

      {/* Staggered Grid */}
      {showcaseImages.length > 3 && (
        <StaggeredGrid images={showcaseImages.slice(3)} locale={locale} />
      )}
    </div>
  );
}

// Full Bleed Image with Parallax
function FullBleedSection({
  image,
  index,
  locale,
}: {
  image: ShowcaseImage;
  index: number;
  locale: string;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-20%" });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.1, 1, 1.05]);
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.2, 0.8, 1],
    [0, 1, 1, 0.5]
  );

  return (
    <section ref={sectionRef} className="relative h-[120vh] overflow-hidden">
      {/* Parallax Image */}
      <motion.div style={{ y, scale }} className="absolute inset-0">
        <Image
          src={image.url}
          alt={image.alt || "Showcase image"}
          fill
          className="object-cover"
          sizes="100vw"
          priority={index === 0}
        />
      </motion.div>

      {/* Gradient Overlays */}
      <motion.div
        style={{ opacity }}
        className="absolute inset-0 bg-gradient-to-b from-neutral-950 via-transparent to-neutral-950"
      />

      {/* Caption */}
      {image.caption && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="absolute bottom-24 left-8 lg:left-16 right-8 lg:right-16"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-px bg-[#c9a962]" />
            <span className="text-[#c9a962] text-xs tracking-[0.2em] uppercase">
              {String(index + 1).padStart(2, "0")}
            </span>
          </div>
          <p className="text-white/70 text-lg font-light max-w-2xl leading-relaxed">
            {image.caption}
          </p>
        </motion.div>
      )}

      {/* Decorative Frame */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 1, delay: 0.5 }}
        className="absolute inset-8 lg:inset-16 pointer-events-none"
      >
        <div className="absolute top-0 left-0 w-24 h-24 border-l border-t border-white/10" />
        <div className="absolute top-0 right-0 w-24 h-24 border-r border-t border-white/10" />
        <div className="absolute bottom-0 left-0 w-24 h-24 border-l border-b border-white/10" />
        <div className="absolute bottom-0 right-0 w-24 h-24 border-r border-b border-white/10" />
      </motion.div>
    </section>
  );
}

// Split Screen with Reveal Animation
function SplitScreenSection({
  leftImage,
  rightImage,
  locale,
}: {
  leftImage: ShowcaseImage;
  rightImage: ShowcaseImage;
  locale: string;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const isRTL = locale === "ar";

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const leftY = useTransform(scrollYProgress, [0, 1], ["10%", "-10%"]);
  const rightY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const gap = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    ["4rem", "2rem", "4rem"]
  );

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen py-24 lg:py-32 bg-neutral-950 overflow-hidden"
    >
      <div className="max-w-[90vw] mx-auto">
        <motion.div style={{ gap }} className="grid lg:grid-cols-2">
          {/* Left Image */}
          <motion.div
            style={{ y: leftY }}
            initial={{ opacity: 0, x: isRTL ? 100 : -100 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative aspect-[3/4] overflow-hidden rounded-lg"
          >
            <Image
              src={leftImage.url}
              alt={leftImage.alt || "Left image"}
              fill
              className="object-cover"
              sizes="50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/50 to-transparent" />

            {/* Caption */}
            {leftImage.caption && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="absolute bottom-8 left-8 right-8"
              >
                <p className="text-white/70 text-sm font-light">
                  {leftImage.caption}
                </p>
              </motion.div>
            )}
          </motion.div>

          {/* Right Image */}
          <motion.div
            style={{ y: rightY }}
            initial={{ opacity: 0, x: isRTL ? -100 : 100 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
            className="relative aspect-[3/4] overflow-hidden rounded-lg lg:mt-24"
          >
            <Image
              src={rightImage.url}
              alt={rightImage.alt || "Right image"}
              fill
              className="object-cover"
              sizes="50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/50 to-transparent" />

            {/* Caption */}
            {rightImage.caption && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="absolute bottom-8 left-8 right-8"
              >
                <p className="text-white/70 text-sm font-light">
                  {rightImage.caption}
                </p>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      </div>

      {/* Decorative Lines */}
      <motion.div
        initial={{ scaleY: 0 }}
        animate={isInView ? { scaleY: 1 } : {}}
        transition={{ duration: 1, delay: 0.3 }}
        className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#c9a962]/20 to-transparent origin-top hidden lg:block"
      />
    </section>
  );
}

// Staggered Grid with Scroll Reveal
function StaggeredGrid({
  images,
  locale,
}: {
  images: ShowcaseImage[];
  locale: string;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-50px" });

  return (
    <section
      ref={sectionRef}
      className="relative py-24 lg:py-32 bg-neutral-950 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-8 lg:px-16">
        <div className="grid grid-cols-12 gap-4 lg:gap-8">
          {images.map((image, index) => {
            // Varied grid spans for visual interest
            const spans = [
              "col-span-12 lg:col-span-8",
              "col-span-6 lg:col-span-4",
              "col-span-6 lg:col-span-6",
              "col-span-12 lg:col-span-6",
              "col-span-12 lg:col-span-7",
              "col-span-12 lg:col-span-5",
            ];
            const heights = [
              "aspect-[16/9]",
              "aspect-square",
              "aspect-[4/5]",
              "aspect-[3/2]",
              "aspect-[2/1]",
              "aspect-[4/3]",
            ];

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 60 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: index * 0.15 }}
                className={`relative overflow-hidden rounded-lg group ${spans[index % spans.length]} ${heights[index % heights.length]}`}
              >
                <Image
                  src={image.url}
                  alt={image.alt || `Grid image ${index + 1}`}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="50vw"
                />

                {/* Hover Effects */}
                <div className="absolute inset-0 bg-neutral-950/0 group-hover:bg-neutral-950/30 transition-colors duration-500" />

                {/* Caption on Hover */}
                {image.caption && (
                  <div className="absolute inset-0 flex items-end p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <p className="text-white/90 text-sm font-light">
                      {image.caption}
                    </p>
                  </div>
                )}

                {/* Corner Accents */}
                <div className="absolute top-3 left-3 w-6 h-6 border-l border-t border-white/0 group-hover:border-[#c9a962]/60 transition-colors duration-500" />
                <div className="absolute bottom-3 right-3 w-6 h-6 border-r border-b border-white/0 group-hover:border-[#c9a962]/60 transition-colors duration-500" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
