"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface GalleryImage {
  url: string;
  alt?: string;
  caption?: string;
  category?:
    | "exterior"
    | "interior"
    | "detail"
    | "before"
    | "after"
    | "process";
}

interface ImmersiveGalleryProps {
  images: GalleryImage[];
  projectTitle: string;
  locale: string;
}

export function ImmersiveGallery({
  images,
  projectTitle,
  locale,
}: ImmersiveGalleryProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const isRTL = locale === "ar";

  // Get unique categories
  const categories = [
    "all",
    ...new Set(
      images.filter((img) => img.category).map((img) => img.category!),
    ),
  ];

  // Filter images by category
  const filteredImages =
    activeCategory === "all"
      ? images
      : images.filter((img) => img.category === activeCategory);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!lightboxOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxOpen(false);
      if (e.key === "ArrowRight")
        setLightboxIndex((i) => Math.min(i + 1, filteredImages.length - 1));
      if (e.key === "ArrowLeft") setLightboxIndex((i) => Math.max(i - 1, 0));
    };

    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [lightboxOpen, filteredImages.length]);

  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  }, []);

  const categoryLabels: Record<string, { en: string; ar: string }> = {
    all: { en: "All", ar: "الكل" },
    exterior: { en: "Exterior", ar: "خارجي" },
    interior: { en: "Interior", ar: "داخلي" },
    detail: { en: "Details", ar: "تفاصيل" },
    process: { en: "Process", ar: "العملية" },
  };

  const labels = {
    en: { title: "Project Gallery", close: "Close" },
    ar: { title: "معرض المشروع", close: "إغلاق" },
  };
  const t = isRTL ? labels.ar : labels.en;

  // Masonry-like grid pattern
  const getGridClass = (index: number) => {
    const patterns = [
      "col-span-1 row-span-1",
      "col-span-1 row-span-2",
      "col-span-2 row-span-1",
      "col-span-1 row-span-1",
      "col-span-1 row-span-1",
      "col-span-2 row-span-2",
    ];
    return patterns[index % patterns.length];
  };

  if (images.length === 0) return null;

  return (
    <section
      ref={containerRef}
      className="relative py-24 md:py-32 bg-[#111] overflow-hidden"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-16">
        {/* Section Header */}
        <motion.div
          className="text-center mb-12 md:mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-[#8f7852] text-sm tracking-[0.3em] uppercase block mb-4">
            {isRTL ? "استكشف المشروع" : "Explore The Project"}
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl text-white font-light">
            {t.title}
          </h2>
        </motion.div>

        {/* Category Filters */}
        {categories.length > 2 && (
          <motion.div
            className="flex flex-wrap justify-center gap-3 mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 text-sm tracking-wider uppercase transition-all duration-300 ${
                  activeCategory === cat
                    ? "bg-[#8f7852] text-black"
                    : "border border-white/20 text-white/60 hover:border-[#8f7852]/50 hover:text-white"
                }`}
              >
                {isRTL
                  ? categoryLabels[cat]?.ar
                  : categoryLabels[cat]?.en || cat}
              </button>
            ))}
          </motion.div>
        )}

        {/* Masonry Grid */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 auto-rows-[200px] md:auto-rows-[250px] gap-4"
          layout
        >
          <AnimatePresence mode="popLayout">
            {filteredImages.map((image, index) => (
              <motion.div
                key={image.url}
                className={`relative overflow-hidden cursor-pointer group ${getGridClass(index)}`}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05, duration: 0.4 }}
                onClick={() => openLightbox(index)}
              >
                <Image
                  src={image.url}
                  alt={image.alt || `${projectTitle} - Image ${index + 1}`}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300" />
                {/* Category Badge */}
                {image.category && (
                  <div className="absolute top-3 left-3 px-2 py-1 bg-black/60 text-white/80 text-xs tracking-wider uppercase opacity-0 group-hover:opacity-100 transition-opacity">
                    {isRTL
                      ? categoryLabels[image.category]?.ar
                      : categoryLabels[image.category]?.en}
                  </div>
                )}
                {/* Zoom Icon */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-12 h-12 rounded-full bg-[#8f7852] flex items-center justify-center">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      className="text-black"
                    >
                      <path
                        d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      <path
                        d="M10 7V13M7 10H13"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxOpen(false)}
          >
            {/* Close Button */}
            <button
              className="absolute top-6 right-6 z-10 w-12 h-12 flex items-center justify-center text-white/60 hover:text-white transition-colors"
              onClick={() => setLightboxOpen(false)}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M18 6L6 18M6 6L18 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>

            {/* Navigation Arrows */}
            {lightboxIndex > 0 && (
              <button
                className="absolute left-4 md:left-8 z-10 w-12 h-12 flex items-center justify-center text-white/60 hover:text-white transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex((i) => i - 1);
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M15 19L8 12L15 5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            )}
            {lightboxIndex < filteredImages.length - 1 && (
              <button
                className="absolute right-4 md:right-8 z-10 w-12 h-12 flex items-center justify-center text-white/60 hover:text-white transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex((i) => i + 1);
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M9 5L16 12L9 19"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            )}

            {/* Image */}
            <motion.div
              key={lightboxIndex}
              className="relative max-w-[90vw] max-h-[85vh] w-full h-full"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={filteredImages[lightboxIndex].url}
                alt={filteredImages[lightboxIndex].alt || ""}
                fill
                className="object-contain"
                priority
              />
            </motion.div>

            {/* Caption & Counter */}
            <div className="absolute bottom-6 left-0 right-0 text-center">
              {filteredImages[lightboxIndex].caption && (
                <p className="text-white/70 text-sm mb-2">
                  {filteredImages[lightboxIndex].caption}
                </p>
              )}
              <p className="text-white/40 text-xs tracking-wider">
                {lightboxIndex + 1} / {filteredImages.length}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
