'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CarouselImage {
  url: string;
  alt: string;
  title?: string;
}

interface VideoBannerWithCarouselProps {
  videoId: string; // YouTube video ID
  images: CarouselImage[];
  title?: string;
  subtitle?: string;
}

export function VideoBannerWithCarousel({
  videoId,
  images,
  title = 'Our Projects',
  subtitle = 'Explore our portfolio of exceptional designs',
}: VideoBannerWithCarouselProps) {
  const [hoveredImage, setHoveredImage] = useState<CarouselImage | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Auto-scroll carousel
  const scroll = (direction: 'left' | 'right') => {
    if (!carouselRef.current) return;

    const scrollAmount = 320; // width of one card + gap
    const newScroll =
      direction === 'left'
        ? carouselRef.current.scrollLeft - scrollAmount
        : carouselRef.current.scrollLeft + scrollAmount;

    carouselRef.current.scrollTo({
      left: newScroll,
      behavior: 'smooth',
    });
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') scroll('left');
      if (e.key === 'ArrowRight') scroll('right');
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black">
      {/* YouTube Video Background */}
      <div className="absolute inset-0 z-0">
        <iframe
          className="absolute left-1/2 top-1/2 h-[56.25vw] min-h-screen w-[177.77vh] min-w-full -translate-x-1/2 -translate-y-1/2"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&enablejsapi=1`}
          title="Background Video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />
      </div>

      {/* Hovered Image Overlay */}
      <AnimatePresence>
        {hoveredImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            className="absolute inset-0 z-10 flex items-center justify-center"
          >
            {/* Background blur */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

            {/* Image */}
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
              className="relative z-10 h-[70vh] w-[80vw] overflow-hidden rounded-2xl shadow-2xl"
            >
              <img
                src={hoveredImage.url}
                alt={hoveredImage.alt}
                className="h-full w-full object-cover"
              />

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

              {/* Image title */}
              {hoveredImage.title && (
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <motion.h3
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="font-SchnyderS text-4xl font-light text-white md:text-5xl"
                  >
                    {hoveredImage.title}
                  </motion.h3>
                </div>
              )}

              {/* Decorative corner accents */}
              <div className="pointer-events-none absolute left-6 top-6 h-16 w-16 border-l-2 border-t-2 border-white/60" />
              <div className="pointer-events-none absolute bottom-6 right-6 h-16 w-16 border-b-2 border-r-2 border-white/60" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content Container */}
      <div className="relative z-20 flex h-full flex-col">
        {/* Hero Text */}
        <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="mb-6 font-SchnyderS text-7xl font-light leading-[0.95] tracking-tight text-white md:text-8xl lg:text-9xl">
              {title}
            </h1>
            <p className="mx-auto max-w-2xl font-Satoshi text-lg font-light text-white/90 md:text-xl">
              {subtitle}
            </p>
          </motion.div>
        </div>

        {/* Carousel Section */}
        <div className="relative pb-20">
          {/* Carousel Container */}
          <div className="relative px-6">
            {/* Navigation Buttons */}
            <button
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 z-30 -translate-y-1/2 rounded-full border border-white/20 bg-black/40 p-3 text-white backdrop-blur-md transition-all hover:bg-black/60 hover:border-white/40"
              aria-label="Previous images"
            >
              <ChevronLeft className="h-6 w-6" strokeWidth={1.5} />
            </button>

            <button
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 z-30 -translate-y-1/2 rounded-full border border-white/20 bg-black/40 p-3 text-white backdrop-blur-md transition-all hover:bg-black/60 hover:border-white/40"
              aria-label="Next images"
            >
              <ChevronRight className="h-6 w-6" strokeWidth={1.5} />
            </button>

            {/* Scrollable Carousel */}
            <div
              ref={carouselRef}
              className="scrollbar-hide flex gap-6 overflow-x-auto scroll-smooth px-12"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
              }}
            >
              {images.map((image, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index, duration: 0.5 }}
                  onMouseEnter={() => setHoveredImage(image)}
                  onMouseLeave={() => setHoveredImage(null)}
                  className="group relative flex-shrink-0 cursor-pointer"
                >
                  <div className="relative h-72 w-80 overflow-hidden rounded-xl border border-white/10 bg-black/20 backdrop-blur-sm transition-all duration-500 group-hover:scale-105 group-hover:border-white/30 group-hover:shadow-2xl">
                    <img
                      src={image.url}
                      alt={image.alt}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 transition-opacity group-hover:opacity-80" />

                    {/* Image title on hover */}
                    {image.title && (
                      <div className="absolute bottom-0 left-0 right-0 translate-y-full p-6 transition-transform duration-500 group-hover:translate-y-0">
                        <h4 className="font-Satoshi text-lg font-light text-white">
                          {image.title}
                        </h4>
                      </div>
                    )}

                    {/* Corner accent */}
                    <div className="pointer-events-none absolute right-4 top-4 h-8 w-8 border-r-2 border-t-2 border-white/40 opacity-0 transition-all duration-500 group-hover:h-12 group-hover:w-12 group-hover:opacity-100" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="mt-8 flex justify-center gap-2">
            {Array.from({ length: Math.ceil(images.length / 3) }).map((_, i) => (
              <div
                key={i}
                className="h-1 w-12 rounded-full bg-white/20 transition-all"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Hide scrollbar CSS */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
