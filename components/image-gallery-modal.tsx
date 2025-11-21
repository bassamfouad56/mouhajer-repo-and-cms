'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';

interface ImageGalleryModalProps {
  images: Array<{
    sourceUrl: string;
    altText: string;
  }>;
  initialIndex: number;
  onClose: () => void;
}

export function ImageGalleryModal({ images, initialIndex, onClose }: ImageGalleryModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isZoomed, setIsZoomed] = useState(false);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
    setIsZoomed(false);
  };

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    setIsZoomed(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handlePrevious();
      if (e.key === 'ArrowRight') handleNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [handleNext, handlePrevious, onClose]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] flex items-center justify-center bg-neutral-950/95 backdrop-blur-sm"
        onClick={onClose}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-6 top-6 z-10 flex h-12 w-12 items-center justify-center rounded-full border border-white/20 text-white transition-all hover:border-white hover:bg-white hover:text-neutral-950"
          aria-label="Close gallery"
        >
          <X size={24} />
        </button>

        {/* Image Counter */}
        <div className="absolute left-6 top-6 z-10 rounded-full border border-white/20 bg-neutral-950/50 px-6 py-3 font-light text-white backdrop-blur-sm">
          {currentIndex + 1} / {images.length}
        </div>

        {/* Zoom Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsZoomed(!isZoomed);
          }}
          className="absolute right-24 top-6 z-10 flex h-12 w-12 items-center justify-center rounded-full border border-white/20 text-white transition-all hover:border-white hover:bg-white hover:text-neutral-950"
          aria-label="Toggle zoom"
        >
          <ZoomIn size={20} />
        </button>

        {/* Navigation Buttons */}
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrevious();
              }}
              className="absolute left-6 top-1/2 z-10 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 text-white transition-all hover:border-white hover:bg-white hover:text-neutral-950"
              aria-label="Previous image"
            >
              <ChevronLeft size={28} />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className="absolute right-6 top-1/2 z-10 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 text-white transition-all hover:border-white hover:bg-white hover:text-neutral-950"
              aria-label="Next image"
            >
              <ChevronRight size={28} />
            </button>
          </>
        )}

        {/* Main Image */}
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: isZoomed ? 1.5 : 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3 }}
          className="relative mx-auto h-[80vh] w-[90vw] cursor-pointer overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <Image
            src={images[currentIndex].sourceUrl}
            alt={images[currentIndex].altText}
            fill
            className="object-contain"
            priority
            quality={100}
          />
        </motion.div>

        {/* Image Caption */}
        {images[currentIndex].altText && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full border border-white/20 bg-neutral-950/50 px-8 py-4 font-light text-white backdrop-blur-sm"
          >
            {images[currentIndex].altText}
          </motion.div>
        )}

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="absolute bottom-24 left-1/2 flex -translate-x-1/2 gap-2 overflow-x-auto rounded-full border border-white/20 bg-neutral-950/50 p-2 backdrop-blur-sm">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(index);
                  setIsZoomed(false);
                }}
                className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-lg transition-all ${
                  index === currentIndex
                    ? 'ring-2 ring-white'
                    : 'opacity-50 hover:opacity-100'
                }`}
              >
                <Image
                  src={image.sourceUrl}
                  alt={image.altText}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
