"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";

interface CinematicDividerProps {
  image?: string;
  quote?: string;
  author?: string;
}

export function CinematicDivider({
  image = "/team/MID9563.jpg",
  quote = "Excellence is not a destination but a continuous journey of refinement.",
  author = "MIDC Philosophy",
}: CinematicDividerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.2, 1.1, 1]);
  const textOpacity = useTransform(
    scrollYProgress,
    [0.2, 0.4, 0.6, 0.8],
    [0, 1, 1, 0]
  );
  const textY = useTransform(scrollYProgress, [0.2, 0.5, 0.8], [50, 0, -50]);

  return (
    <section
      ref={containerRef}
      className="relative h-[60vh] min-h-[400px] overflow-hidden lg:h-[70vh]"
    >
      {/* Parallax Background Image */}
      <motion.div
        style={{ y: imageY, scale: imageScale }}
        className="absolute inset-0"
      >
        <Image
          src={image}
          alt="MIDC Excellence"
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        {/* Cinematic overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/60 via-neutral-950/40 to-neutral-950/70" />
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/50 via-transparent to-neutral-950/50" />
      </motion.div>

      {/* Quote Overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          style={{ opacity: textOpacity, y: textY }}
          className="mx-auto max-w-4xl px-6 text-center lg:px-12"
        >
          {/* Decorative line */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.2 }}
            className="mx-auto mb-8 h-px w-24 origin-center bg-gradient-to-r from-transparent via-[#c9a962]/60 to-transparent"
          />

          {/* Quote */}
          <p className="mb-6 font-SchnyderS text-2xl font-light italic leading-relaxed text-white/90 sm:text-3xl lg:text-4xl">
            &ldquo;{quote}&rdquo;
          </p>

          {/* Author */}
          <span className="font-Satoshi text-xs font-light uppercase tracking-[0.3em] text-[#c9a962]/80">
            {author}
          </span>

          {/* Decorative line */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.4 }}
            className="mx-auto mt-8 h-px w-24 origin-center bg-gradient-to-r from-transparent via-[#c9a962]/60 to-transparent"
          />
        </motion.div>
      </div>

      {/* Corner accents */}
      <div className="absolute left-6 top-6 h-16 w-16 border-l border-t border-white/10 lg:left-12 lg:top-12" />
      <div className="absolute bottom-6 right-6 h-16 w-16 border-b border-r border-white/10 lg:bottom-12 lg:right-12" />
    </section>
  );
}
