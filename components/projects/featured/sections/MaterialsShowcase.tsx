"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useInView,
} from "framer-motion";

interface Material {
  name: string;
  description?: string;
  image: string;
  origin?: string;
}

interface MaterialsShowcaseProps {
  materials: Material[];
  title?: string;
  subtitle?: string;
  locale: string;
}

export function MaterialsShowcase({
  materials,
  title,
  subtitle,
  locale,
}: MaterialsShowcaseProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const isTitleInView = useInView(titleRef, { once: true, margin: "-100px" });
  const isRTL = locale === "ar";
  const [isDragging, setIsDragging] = useState(false);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
  });

  // Horizontal movement
  const x = useTransform(
    smoothProgress,
    [0.1, 0.9],
    isRTL ? ["-60%", "0%"] : ["0%", "-60%"]
  );

  const labels = {
    en: {
      title: "Materials & Craftsmanship",
      subtitle: "Premium materials sourced from around the world",
      origin: "Origin",
    },
    ar: {
      title: "المواد والحرفية",
      subtitle: "مواد فاخرة من جميع أنحاء العالم",
      origin: "المصدر",
    },
  };

  const t = labels[locale as keyof typeof labels] || labels.en;

  if (materials.length === 0) return null;

  return (
    <section
      ref={sectionRef}
      className="relative bg-neutral-100"
      style={{ height: `${Math.max(200, materials.length * 30)}vh` }}
    >
      {/* Sticky Container */}
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Background Texture */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(201,169,98,0.05),transparent_50%)]" />

        {/* Header */}
        <motion.div
          ref={titleRef}
          className="absolute top-16 left-8 lg:left-16 right-8 lg:right-16 z-20"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isTitleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4"
          >
            <div>
              <div className="flex items-center gap-4 mb-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={isTitleInView ? { width: 48 } : {}}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="h-px bg-[#c9a962]"
                />
                <span className="text-[#c9a962] text-xs tracking-[0.3em] uppercase font-light">
                  {title || t.title}
                </span>
              </div>
              <h2 className="font-SchnyderS text-4xl lg:text-5xl font-light text-neutral-950">
                {title || t.title}
              </h2>
            </div>
            <p className="text-neutral-500 text-sm font-light max-w-md">
              {subtitle || t.subtitle}
            </p>
          </motion.div>
        </motion.div>

        {/* Horizontal Scroll Container */}
        <motion.div
          ref={scrollContainerRef}
          style={{ x }}
          className="absolute top-1/2 -translate-y-1/2 flex items-center gap-8 px-8 lg:px-16"
        >
          {materials.map((material, index) => (
            <MaterialCard
              key={index}
              material={material}
              index={index}
              locale={locale}
              originLabel={t.origin}
            />
          ))}

          {/* End Spacer */}
          <div className="w-[30vw] flex-shrink-0" />
        </motion.div>

        {/* Progress Dots */}
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex items-center gap-3">
          {materials.map((_, index) => (
            <motion.div
              key={index}
              className="w-2 h-2 rounded-full bg-neutral-300"
              animate={{
                backgroundColor:
                  index <= Math.floor(smoothProgress.get() * materials.length)
                    ? "#c9a962"
                    : "#d4d4d4",
              }}
            />
          ))}
        </div>

        {/* Scroll Instruction */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-16 right-8 lg:right-16"
        >
          <motion.div
            animate={{ x: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex items-center gap-2 text-neutral-400"
          >
            <span className="text-xs tracking-wider">
              {isRTL ? "← تصفح" : "SCROLL →"}
            </span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function MaterialCard({
  material,
  index,
  locale,
  originLabel,
}: {
  material: Material;
  index: number;
  locale: string;
  originLabel: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: "-10%" });

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="relative flex-shrink-0 w-[400px] group"
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-white shadow-lg">
        <Image
          src={material.image}
          alt={material.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="400px"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Material Number */}
        <div className="absolute top-6 left-6">
          <span className="text-white/80 text-xs tracking-wider bg-neutral-950/50 px-3 py-1 rounded-full backdrop-blur-sm">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>

        {/* Hover Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileHover={{ opacity: 1, y: 0 }}
          className="absolute bottom-0 left-0 right-0 p-8"
        >
          {material.origin && (
            <div className="mb-2">
              <span className="text-white/50 text-xs tracking-wider uppercase">
                {originLabel}
              </span>
              <p className="text-white text-sm">{material.origin}</p>
            </div>
          )}
        </motion.div>

        {/* Frame Corners */}
        <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-white/0 group-hover:border-[#c9a962]/70 transition-colors duration-500" />
        <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-white/0 group-hover:border-[#c9a962]/70 transition-colors duration-500" />
        <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-white/0 group-hover:border-[#c9a962]/70 transition-colors duration-500" />
        <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-white/0 group-hover:border-[#c9a962]/70 transition-colors duration-500" />
      </div>

      {/* Text Content */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
        className="mt-6"
      >
        <h3 className="font-SchnyderS text-2xl text-neutral-950 mb-2">
          {material.name}
        </h3>
        {material.description && (
          <p className="text-neutral-600 text-sm font-light leading-relaxed">
            {material.description}
          </p>
        )}
      </motion.div>
    </motion.div>
  );
}
