"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface OverviewSectionProps {
  overview: string;
  locale: string;
}

export function OverviewSection({ overview, locale }: OverviewSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const isRTL = locale === "ar";

  const labels = {
    en: { title: "Overview" },
    ar: { title: "نظرة عامة" },
  };

  const t = labels[locale as keyof typeof labels] || labels.en;

  if (!overview) return null;

  return (
    <section
      ref={sectionRef}
      className="relative py-24 md:py-32 bg-white"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="container mx-auto px-6 md:px-16">
        {/* Section Label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-4 mb-8"
        >
          <motion.div
            initial={{ width: 0 }}
            animate={isInView ? { width: 48 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="h-px bg-[#8f7852]"
          />
          <span className="text-[#8f7852] text-xs tracking-[0.3em] uppercase font-light">
            {t.title}
          </span>
        </motion.div>

        {/* Overview Text */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <p className="font-SchnyderS text-2xl md:text-3xl lg:text-4xl text-neutral-900 font-light leading-relaxed">
            {overview}
          </p>
        </motion.div>

        {/* Decorative Line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 h-px bg-gradient-to-r from-[#8f7852] via-[#8f7852]/50 to-transparent origin-left"
        />
      </div>
    </section>
  );
}
