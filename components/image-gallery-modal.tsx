'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight, ZoomIn, AlertCircle } from 'lucide-react';

interface GalleryImage {
  sourceUrl?: string | null;
  altText?: string | null;
}

interface ImageGalleryModalProps {
  images: GalleryImage[];
  initialIndex?: number;
  onClose: () => void;
  isOpen?: boolean;
}

// Default fallback image
const FALLBACK_IMAGE = 'https://placehold.co/1200x800/e5e5e5/737373?text=Image+Not+Available';

// Helper function to safely get image URL
function getSafeImageUrl(image: GalleryImage | undefined): string {
  if (!image) return FALLBACK_IMAGE;
  return image.sourceUrl || FALLBACK_IMAGE;
}

// Helper function to safely get alt text
function getSafeAltText(image: GalleryImage | undefined): string {
  if (!image) return 'Gallery image';
  return image.altText || 'Gallery image';
}

// Filter out invalid images
function getValidImages(images: GalleryImage[]): GalleryImage[] {
  if (!Array.isArray(images)) return [];
  return images.filter(img => img && (img.sourceUrl || img.altText));
}

export function ImageGalleryModal({
  images = [],
  initialIndex = 0,
  onClose,
  isOpen = true
}: ImageGalleryModalProps) {
  // Early return if modal shouldn't be open
  if (!isOpen) return null;

  // Validate and filter images
  const validImages = getValidImages(images);

  // If no valid images, show error state
  if (validImages.length === 0) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-neutral-950/95 backdrop-blur-sm"
          onClick={onClose}
        >
          <div className="text-center">
            <AlertCircle className="mx-auto mb-4 h-16 w-16 text-white/60" />
            <p className="text-lg font-light text-white">No images available</p>
            <button
              onClick={onClose}
              className="mt-6 rounded-full border border-white/20 bg-white/10 px-8 py-3 font-light text-white transition-all hover:bg-white/20"
            >
              Close
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }

  // Ensure initial index is within bounds
  const safeInitialIndex = Math.max(0, Math.min(initialIndex, validImages.length - 1));

  return <ImageGalleryModalContent
    images={validImages}
    initialIndex={safeInitialIndex}
    onClose={onClose}
  />;
}

// Separate component for the actual modal content
function ImageGalleryModalContent({
  images,
  initialIndex,
  onClose
}: Required<Omit<ImageGalleryModalProps, 'isOpen'>>) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isZoomed, setIsZoomed] = useState(false);
  const [imageError, setImageError] = useState<Record<number, boolean>>({});

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
    setIsZoomed(false);
  };

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    setIsZoomed(false);
  };

  const handleImageError = (index: number) => {
    setImageError(prev => ({ ...prev, [index]: true }));
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
  }, []);

  // Get current image safely
  const currentImage = images[currentIndex];
  const currentImageUrl = getSafeImageUrl(currentImage);
  const currentAltText = getSafeAltText(currentImage);

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
          {imageError[currentIndex] ? (
            <div className="flex h-full w-full items-center justify-center bg-neutral-900">
              <div className="text-center">
                <AlertCircle className="mx-auto mb-4 h-12 w-12 text-white/40" />
                <p className="font-light text-white/60">Failed to load image</p>
              </div>
            </div>
          ) : (
            <Image
              src={currentImageUrl}
              alt={currentAltText}
              fill
              className="object-contain"
              priority
              quality={100}
              onError={() => handleImageError(currentIndex)}
            />
          )}
        </motion.div>

        {/* Image Caption */}
        {currentAltText && currentAltText !== 'Gallery image' && (
          <motion.div
            key={`caption-${currentIndex}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-6 left-1/2 max-w-2xl -translate-x-1/2 rounded-full border border-white/20 bg-neutral-950/50 px-8 py-4 font-light text-white backdrop-blur-sm"
          >
            {currentAltText}
          </motion.div>
        )}

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="absolute bottom-24 left-1/2 flex max-w-3xl -translate-x-1/2 gap-2 overflow-x-auto rounded-full border border-white/20 bg-neutral-950/50 p-2 backdrop-blur-sm">
            {images.map((image, index) => {
              const thumbnailUrl = getSafeImageUrl(image);
              const thumbnailAlt = getSafeAltText(image);

              return (
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
                  {imageError[index] ? (
                    <div className="flex h-full w-full items-center justify-center bg-neutral-800">
                      <AlertCircle className="h-6 w-6 text-white/40" />
                    </div>
                  ) : (
                    <Image
                      src={thumbnailUrl}
                      alt={thumbnailAlt}
                      fill
                      className="object-cover"
                      onError={() => handleImageError(index)}
                    />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
