"use client";

import { useState } from "react";
import Image, { ImageProps } from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * OptimizedImage Component
 *
 * Enhanced Next.js Image with:
 * - Skeleton loading placeholder
 * - Blur-up animation on load
 * - Error state handling
 * - Optional hover zoom effect
 */

interface OptimizedImageProps extends Omit<ImageProps, "onLoad" | "onError"> {
  containerClassName?: string;
  skeleton?: boolean;
  hoverZoom?: boolean;
  aspectRatio?: "square" | "video" | "portrait" | "landscape" | "auto";
}

const aspectRatioClasses = {
  square: "aspect-square",
  video: "aspect-video",
  portrait: "aspect-[3/4]",
  landscape: "aspect-[4/3]",
  auto: "",
};

export function OptimizedImage({
  src,
  alt,
  className,
  containerClassName,
  skeleton = true,
  hoverZoom = false,
  aspectRatio = "auto",
  fill,
  ...props
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden",
        aspectRatioClasses[aspectRatio],
        containerClassName
      )}
    >
      {/* Skeleton Placeholder */}
      <AnimatePresence>
        {isLoading && skeleton && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 z-10"
          >
            <div className="h-full w-full animate-pulse bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 bg-[length:200%_100%]" />
            {/* Shimmer effect */}
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error State */}
      {hasError ? (
        <div className="flex h-full w-full items-center justify-center bg-neutral-100">
          <div className="text-center">
            <svg
              className="mx-auto h-10 w-10 text-neutral-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="mt-2 text-xs text-neutral-400">Image unavailable</p>
          </div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{
            opacity: isLoading ? 0 : 1,
            scale: isLoading ? 1.05 : 1,
          }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className={cn("h-full w-full", hoverZoom && "group")}
        >
          <Image
            src={src}
            alt={alt}
            fill={fill}
            className={cn(
              className,
              hoverZoom &&
                "transition-transform duration-700 ease-out group-hover:scale-110"
            )}
            onLoad={handleLoad}
            onError={handleError}
            {...props}
          />
        </motion.div>
      )}
    </div>
  );
}

/**
 * ImageSkeleton - Standalone skeleton for custom layouts
 */
export function ImageSkeleton({
  className,
  aspectRatio = "auto",
}: {
  className?: string;
  aspectRatio?: "square" | "video" | "portrait" | "landscape" | "auto";
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg",
        aspectRatioClasses[aspectRatio],
        className
      )}
    >
      <div className="h-full w-full animate-pulse bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200" />
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    </div>
  );
}

export default OptimizedImage;
