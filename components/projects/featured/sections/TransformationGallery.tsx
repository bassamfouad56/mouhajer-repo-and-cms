"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import Image from "next/image";

interface GalleryImage {
  url: string;
  alt?: string;
  caption?: string;
}

interface TransformationGalleryProps {
  title: string;
  beforeImages: GalleryImage[];
  afterImages: GalleryImage[];
  locale: string;
}

export function TransformationGallery({
  title,
  beforeImages,
  afterImages,
  locale,
}: TransformationGalleryProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [hasAutoPlayed, setHasAutoPlayed] = useState(false);

  const isRTL = locale === "ar";

  // Create pairs of before/after images
  const pairs = beforeImages
    .map((before, index) => ({
      before,
      after: afterImages[index] || afterImages[0],
    }))
    .slice(0, Math.min(beforeImages.length, afterImages.length));

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.2], [100, 0]);

  // Auto-demo animation on first view
  useEffect(() => {
    if (hasAutoPlayed) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAutoPlayed) {
          setHasAutoPlayed(true);
          // Run the demo animation
          const demo = async () => {
            await new Promise((r) => setTimeout(r, 500));
            // Move to 20%
            for (let i = 50; i >= 20; i -= 2) {
              setSliderPosition(i);
              await new Promise((r) => setTimeout(r, 20));
            }
            await new Promise((r) => setTimeout(r, 300));
            // Move to 80%
            for (let i = 20; i <= 80; i += 2) {
              setSliderPosition(i);
              await new Promise((r) => setTimeout(r, 20));
            }
            await new Promise((r) => setTimeout(r, 300));
            // Return to center
            for (let i = 80; i >= 50; i -= 2) {
              setSliderPosition(i);
              await new Promise((r) => setTimeout(r, 20));
            }
          };
          demo();
        }
      },
      { threshold: 0.5 },
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [hasAutoPlayed]);

  // Handle slider drag
  const handleSliderMove = useCallback((clientX: number) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  }, []);

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);
  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (isDragging) handleSliderMove(e.clientX);
    },
    [isDragging, handleSliderMove],
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      handleSliderMove(e.touches[0].clientX);
    },
    [handleSliderMove],
  );

  useEffect(() => {
    const handleGlobalMouseUp = () => setIsDragging(false);
    window.addEventListener("mouseup", handleGlobalMouseUp);
    return () => window.removeEventListener("mouseup", handleGlobalMouseUp);
  }, []);

  const labels = {
    en: { before: "Before", after: "After", dragHint: "Drag to compare" },
    ar: { before: "قبل", after: "بعد", dragHint: "اسحب للمقارنة" },
  };
  const t = isRTL ? labels.ar : labels.en;

  if (pairs.length === 0) return null;

  const currentPair = pairs[activeIndex];

  return (
    <section
      ref={containerRef}
      className="relative py-24 md:py-32 bg-[#111] overflow-hidden"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <motion.div style={{ opacity, y }} className="relative z-10">
        {/* Section Title */}
        <motion.div
          className="text-center mb-12 md:mb-16 px-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-[#8f7852] text-sm tracking-[0.3em] uppercase block mb-4">
            {isRTL ? "رحلة التحول" : "Transformation Journey"}
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl text-white font-light">
            {title}
          </h2>
        </motion.div>

        {/* Before/After Slider */}
        <div className="max-w-6xl mx-auto px-6">
          <div
            ref={sliderRef}
            className="relative aspect-[16/10] md:aspect-[16/9] rounded-lg overflow-hidden cursor-ew-resize select-none"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onTouchMove={handleTouchMove}
          >
            {/* After Image (Full) */}
            <div className="absolute inset-0">
              <Image
                src={currentPair.after.url}
                alt={currentPair.after.alt || "After"}
                fill
                className="object-cover"
                priority
              />
              {/* After Label */}
              <motion.div
                className="absolute top-4 right-4 md:top-6 md:right-6 px-4 py-2 bg-[#8f7852] text-black text-xs font-medium tracking-wider uppercase"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                {t.after}
              </motion.div>
            </div>

            {/* Before Image (Clipped) */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${sliderPosition}%` }}
            >
              <div
                className="relative w-full h-full"
                style={{ width: `${100 / (sliderPosition / 100)}%` }}
              >
                <Image
                  src={currentPair.before.url}
                  alt={currentPair.before.alt || "Before"}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              {/* Before Label */}
              <motion.div
                className="absolute top-4 left-4 md:top-6 md:left-6 px-4 py-2 bg-white/90 text-black text-xs font-medium tracking-wider uppercase"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                {t.before}
              </motion.div>
            </div>

            {/* Slider Handle */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-[#8f7852] transform -translate-x-1/2 z-20"
              style={{ left: `${sliderPosition}%` }}
            >
              {/* Handle Circle */}
              <motion.div
                className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 rounded-full bg-[#8f7852] flex items-center justify-center shadow-xl ${
                  isDragging ? "scale-110" : ""
                } transition-transform`}
                whileHover={{ scale: 1.1 }}
                animate={isDragging ? { scale: 1.1 } : { scale: 1 }}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="text-black"
                >
                  <path
                    d="M8 4L4 8L8 12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M16 4L20 8L16 12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </motion.div>

              {/* Drag Hint */}
              {!hasAutoPlayed && (
                <motion.div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 mt-12 whitespace-nowrap text-white/60 text-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.5 }}
                >
                  {t.dragHint}
                </motion.div>
              )}
            </div>

            {/* Gradient Overlays */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            </div>
          </div>

          {/* Progress Bar (for multiple pairs) */}
          {pairs.length > 1 && (
            <div className="flex justify-center gap-6 mt-8">
              {/* Navigation Dots */}
              <div className="flex items-center gap-3">
                {pairs.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveIndex(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === activeIndex
                        ? "bg-[#8f7852] scale-125"
                        : "bg-white/30 hover:bg-white/50"
                    }`}
                    aria-label={`View comparison ${index + 1}`}
                  />
                ))}
              </div>

              {/* Prev/Next Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveIndex(Math.max(0, activeIndex - 1))}
                  disabled={activeIndex === 0}
                  className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:border-[#8f7852] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M15 19L8 12L15 5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <button
                  onClick={() =>
                    setActiveIndex(Math.min(pairs.length - 1, activeIndex + 1))
                  }
                  disabled={activeIndex === pairs.length - 1}
                  className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:border-[#8f7852] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M9 5L16 12L9 19"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* Captions */}
          <AnimatePresence mode="wait">
            {(currentPair.before.caption || currentPair.after.caption) && (
              <motion.div
                key={activeIndex}
                className="mt-6 text-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <p className="text-white/50 text-sm">
                  {currentPair.before.caption || currentPair.after.caption}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Decorative Corners */}
        <div className="absolute top-12 left-12 w-16 h-16 border-l border-t border-[#8f7852]/20" />
        <div className="absolute top-12 right-12 w-16 h-16 border-r border-t border-[#8f7852]/20" />
        <div className="absolute bottom-12 left-12 w-16 h-16 border-l border-b border-[#8f7852]/20" />
        <div className="absolute bottom-12 right-12 w-16 h-16 border-r border-b border-[#8f7852]/20" />
      </motion.div>
    </section>
  );
}
