"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { urlForImage } from "@/sanity/lib/image";

interface ImageSeparatorProps {
  value: {
    style: "fullwidth" | "contained" | "narrow" | "duo" | "beforeAfter";
    image?: any;
    imageLeft?: any;
    imageRight?: any;
    caption?: { en?: string; ar?: string };
    enableParallax?: boolean;
    aspectRatio?: string;
  };
  locale?: string;
}

// Full-width Cinematic Separator
function FullWidthSeparator({ value, locale = "en" }: ImageSeparatorProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(
    scrollYProgress,
    [0, 1],
    ["0%", value.enableParallax !== false ? "20%" : "0%"],
  );
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.3, 0.7, 1],
    [0.6, 1, 1, 0.6],
  );

  const imageUrl = value.image?.asset
    ? urlForImage(value.image)?.width(1920).height(800).url()
    : null;

  if (!imageUrl) return null;

  const caption = value.caption?.[locale as "en" | "ar"] || value.caption?.en;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 1 }}
      className="group relative my-20 -mx-6 h-[60vh] min-h-[400px] cursor-pointer overflow-hidden lg:-mx-12 lg:my-28"
    >
      <motion.div style={{ y }} className="absolute inset-0 scale-110">
        <motion.div style={{ opacity }} className="h-full w-full">
          <Image
            src={imageUrl}
            alt={value.image?.alt || "Article image"}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </motion.div>
      </motion.div>

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30" />

      {/* Corner accents */}
      <div className="absolute left-4 top-4 h-12 w-12 border-l-2 border-t-2 border-white/30 transition-all duration-300 group-hover:h-16 group-hover:w-16 group-hover:border-[#8f7852]" />
      <div className="absolute bottom-4 right-4 h-12 w-12 border-b-2 border-r-2 border-white/30 transition-all duration-300 group-hover:h-16 group-hover:w-16 group-hover:border-[#8f7852]" />

      {/* Caption */}
      {caption && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6 lg:p-8">
          <p className="font-Satoshi text-sm font-light italic text-white/80 lg:text-base">
            {caption}
          </p>
        </div>
      )}
    </motion.div>
  );
}

// Contained Image Separator
function ContainedSeparator({ value, locale = "en" }: ImageSeparatorProps) {
  const imageUrl = value.image?.asset
    ? urlForImage(value.image)?.width(1200).height(800).url()
    : null;

  if (!imageUrl) return null;

  const caption = value.caption?.[locale as "en" | "ar"] || value.caption?.en;
  const aspectClass = getAspectClass(value.aspectRatio);

  return (
    <motion.figure
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8 }}
      className="my-16"
    >
      <div
        className={`group relative overflow-hidden rounded-lg bg-neutral-100 shadow-lg ${aspectClass}`}
      >
        <Image
          src={imageUrl}
          alt={value.image?.alt || "Article image"}
          fill
          className="object-cover transition-all duration-1000 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      </div>
      {caption && (
        <figcaption className="mt-4 text-center font-Satoshi text-sm font-light italic text-neutral-500">
          {caption}
        </figcaption>
      )}
    </motion.figure>
  );
}

// Narrow/Focused Image Separator
function NarrowSeparator({ value, locale = "en" }: ImageSeparatorProps) {
  const imageUrl = value.image?.asset
    ? urlForImage(value.image)?.width(800).height(600).url()
    : null;

  if (!imageUrl) return null;

  const caption = value.caption?.[locale as "en" | "ar"] || value.caption?.en;
  const aspectClass = getAspectClass(value.aspectRatio);

  return (
    <motion.figure
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8 }}
      className="mx-auto my-16 max-w-2xl"
    >
      <div
        className={`group relative overflow-hidden rounded-lg bg-neutral-100 shadow-md ${aspectClass}`}
      >
        <Image
          src={imageUrl}
          alt={value.image?.alt || "Article image"}
          fill
          className="object-cover transition-all duration-700 group-hover:scale-105"
        />
      </div>
      {caption && (
        <figcaption className="mt-4 text-center font-Satoshi text-sm font-light italic text-neutral-500">
          {caption}
        </figcaption>
      )}
    </motion.figure>
  );
}

// Side-by-Side Duo Separator
function DuoSeparator({ value, locale = "en" }: ImageSeparatorProps) {
  const leftUrl = value.imageLeft?.asset
    ? urlForImage(value.imageLeft)?.width(800).height(600).url()
    : null;
  const rightUrl = value.imageRight?.asset
    ? urlForImage(value.imageRight)?.width(800).height(600).url()
    : null;

  if (!leftUrl || !rightUrl) return null;

  const caption = value.caption?.[locale as "en" | "ar"] || value.caption?.en;

  return (
    <motion.figure
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8 }}
      className="my-16 -mx-6 lg:-mx-12"
    >
      <div className="grid grid-cols-2 gap-4 lg:gap-6">
        <div className="group relative aspect-[4/3] overflow-hidden bg-neutral-100">
          <Image
            src={leftUrl}
            alt={value.imageLeft?.alt || "Left image"}
            fill
            className="object-cover transition-all duration-700 group-hover:scale-105"
          />
        </div>
        <div className="group relative aspect-[4/3] overflow-hidden bg-neutral-100">
          <Image
            src={rightUrl}
            alt={value.imageRight?.alt || "Right image"}
            fill
            className="object-cover transition-all duration-700 group-hover:scale-105"
          />
        </div>
      </div>
      {caption && (
        <figcaption className="mt-4 px-6 text-center font-Satoshi text-sm font-light italic text-neutral-500 lg:px-12">
          {caption}
        </figcaption>
      )}
    </motion.figure>
  );
}

// Before/After Slider Separator
function BeforeAfterSeparator({ value, locale = "en" }: ImageSeparatorProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const beforeUrl = value.imageLeft?.asset
    ? urlForImage(value.imageLeft)?.width(1200).height(800).url()
    : null;
  const afterUrl = value.imageRight?.asset
    ? urlForImage(value.imageRight)?.width(1200).height(800).url()
    : null;

  if (!beforeUrl || !afterUrl) return null;

  const caption = value.caption?.[locale as "en" | "ar"] || value.caption?.en;

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 100;
    setSliderPosition(Math.min(Math.max(x, 0), 100));
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging) {
      handleMove(e.clientX);
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length > 0) {
      handleMove(e.touches[0].clientX);
    }
  };

  return (
    <motion.figure
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8 }}
      className="my-16"
    >
      <div
        ref={containerRef}
        className="relative aspect-[16/10] cursor-ew-resize select-none overflow-hidden rounded-lg bg-neutral-100"
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        onTouchStart={() => setIsDragging(true)}
        onTouchEnd={() => setIsDragging(false)}
      >
        {/* After Image (Background) */}
        <Image
          src={afterUrl}
          alt={value.imageRight?.alt || "After image"}
          fill
          className="pointer-events-none object-cover"
          draggable={false}
        />

        {/* Before Image (Clipped) */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${sliderPosition}%` }}
        >
          <div
            className="relative h-full"
            style={{ width: `${containerRef.current?.offsetWidth || 100}px` }}
          >
            <Image
              src={beforeUrl}
              alt={value.imageLeft?.alt || "Before image"}
              fill
              className="pointer-events-none object-cover"
              draggable={false}
            />
          </div>
        </div>

        {/* Slider Handle */}
        <div
          className="absolute bottom-0 top-0 w-1 bg-white shadow-lg"
          style={{ left: `${sliderPosition}%`, transform: "translateX(-50%)" }}
        >
          <div className="absolute left-1/2 top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-lg">
            <div className="flex gap-0.5">
              <div className="h-4 w-0.5 bg-neutral-400" />
              <div className="h-4 w-0.5 bg-neutral-400" />
            </div>
          </div>
        </div>

        {/* Labels */}
        <div className="pointer-events-none absolute bottom-4 left-4 rounded-full bg-black/60 px-3 py-1 font-Satoshi text-xs text-white backdrop-blur-sm">
          Before
        </div>
        <div className="pointer-events-none absolute bottom-4 right-4 rounded-full bg-black/60 px-3 py-1 font-Satoshi text-xs text-white backdrop-blur-sm">
          After
        </div>
      </div>
      {caption && (
        <figcaption className="mt-4 text-center font-Satoshi text-sm font-light italic text-neutral-500">
          {caption}
        </figcaption>
      )}
    </motion.figure>
  );
}

// Helper function
function getAspectClass(aspectRatio?: string): string {
  const aspectClasses: Record<string, string> = {
    "16/9": "aspect-video",
    "4/3": "aspect-[4/3]",
    "3/2": "aspect-[3/2]",
    "1/1": "aspect-square",
    "21/9": "aspect-[21/9]",
  };
  return aspectClasses[aspectRatio || "16/9"] || "aspect-video";
}

// Main Export Component
export function ImageSeparator({ value, locale = "en" }: ImageSeparatorProps) {
  if (!value) return null;

  switch (value.style) {
    case "fullwidth":
      return <FullWidthSeparator value={value} locale={locale} />;
    case "contained":
      return <ContainedSeparator value={value} locale={locale} />;
    case "narrow":
      return <NarrowSeparator value={value} locale={locale} />;
    case "duo":
      return <DuoSeparator value={value} locale={locale} />;
    case "beforeAfter":
      return <BeforeAfterSeparator value={value} locale={locale} />;
    default:
      return <ContainedSeparator value={value} locale={locale} />;
  }
}
