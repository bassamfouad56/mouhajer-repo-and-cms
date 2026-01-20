"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
  className?: string;
}

export function BeforeAfterSlider({
  beforeImage,
  afterImage,
  beforeLabel = "Before",
  afterLabel = "After",
  className = "",
}: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  }, []);

  const handleMouseDown = useCallback(() => {
    setIsDragging(true);
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;
      handleMove(e.clientX);
    },
    [isDragging, handleMove]
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isDragging) return;
      handleMove(e.touches[0].clientX);
    },
    [isDragging, handleMove]
  );

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("touchmove", handleTouchMove);
      window.addEventListener("touchend", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove]);

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8 }}
      className={`group relative overflow-hidden ${className}`}
      onMouseDown={handleMouseDown}
      onTouchStart={handleMouseDown}
      onClick={(e) => handleMove(e.clientX)}
    >
      {/* After image (background) */}
      <div className="relative aspect-[16/10] w-full">
        <Image
          src={afterImage}
          alt={afterLabel}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 80vw"
        />

        {/* After label */}
        <div className="absolute bottom-4 right-4 border border-[#c9a962]/30 bg-neutral-950/80 px-3 py-1.5 backdrop-blur-sm sm:bottom-6 sm:right-6">
          <span className="font-Satoshi text-xs font-light uppercase tracking-wider text-[#c9a962]">
            {afterLabel}
          </span>
        </div>
      </div>

      {/* Before image (clipped) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        <div className="relative aspect-[16/10] w-full">
          <Image
            src={beforeImage}
            alt={beforeLabel}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 80vw"
          />

          {/* Before label */}
          <div className="absolute bottom-4 left-4 border border-white/20 bg-neutral-950/80 px-3 py-1.5 backdrop-blur-sm sm:bottom-6 sm:left-6">
            <span className="font-Satoshi text-xs font-light uppercase tracking-wider text-white/70">
              {beforeLabel}
            </span>
          </div>
        </div>
      </div>

      {/* Slider handle */}
      <div
        className="absolute bottom-0 top-0 z-10 w-1 cursor-ew-resize"
        style={{ left: `${sliderPosition}%`, transform: "translateX(-50%)" }}
      >
        {/* Vertical line */}
        <div className="h-full w-px bg-white shadow-lg" />

        {/* Handle circle */}
        <div
          className={`absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white bg-neutral-950/80 shadow-lg backdrop-blur-sm transition-transform duration-200 ${
            isDragging ? "scale-110" : "group-hover:scale-105"
          }`}
        >
          {/* Arrows */}
          <svg
            className="h-5 w-5 text-white"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M8 12H4m0 0l3-3m-3 3l3 3M16 12h4m0 0l-3-3m3 3l-3 3" />
          </svg>
        </div>

        {/* Glow effect */}
        <div className="absolute inset-y-0 left-1/2 w-8 -translate-x-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      {/* Corner accents */}
      <div className="absolute left-0 top-0 h-16 w-16 border-l-2 border-t-2 border-white/20" />
      <div className="absolute bottom-0 right-0 h-16 w-16 border-b-2 border-r-2 border-[#c9a962]/30" />

      {/* Instruction text */}
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: isDragging ? 0 : 1 }}
        className="pointer-events-none absolute left-1/2 top-4 -translate-x-1/2"
      >
        <span className="rounded-full bg-neutral-950/80 px-4 py-2 font-Satoshi text-xs font-light text-white/60 backdrop-blur-sm">
          Drag to compare
        </span>
      </motion.div>
    </motion.div>
  );
}
