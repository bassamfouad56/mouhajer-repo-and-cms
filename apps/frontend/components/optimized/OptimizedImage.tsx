'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
// import { getImageProps, IMAGE_CONFIGS, type ImageConfig } from '@/lib/sanity/image'
import { cn } from '@/lib/utils'

// type ImageConfig = string;

interface OptimizedImageProps {
  image: any
  alt: string
  config?: string // ImageConfig
  className?: string
  priority?: boolean
  sizes?: string
  quality?: number
  onLoad?: () => void
  onError?: () => void
  fallback?: string
  lazy?: boolean
  aspectRatio?: 'square' | '16/9' | '4/3' | '3/2' | 'auto'
}

export default function OptimizedImage({
  image,
  alt,
  config = 'card',
  className,
  priority = false,
  sizes,
  quality,
  onLoad,
  onError,
  fallback = '/images/placeholder.jpg',
  lazy = true,
  aspectRatio = 'auto',
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)
  const [isInView, setIsInView] = useState(!lazy || priority)
  const imgRef = useRef<HTMLImageElement>(null)

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!lazy || priority || isInView) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      {
        rootMargin: '50px',
        threshold: 0.1,
      }
    )

    if (imgRef.current) {
      observer.observe(imgRef.current)
    }

    return () => observer.disconnect()
  }, [lazy, priority, isInView])

  if (!image && !fallback) {
    return null
  }

  // const imageConfig = IMAGE_CONFIGS[config]
  // const imageProps = getImageProps(image, {
  //   width: imageConfig.width,
  //   height: imageConfig.height,
  //   quality: quality || imageConfig.quality,
  // })

  // Temporary fallback
  const imageProps = { src: image || fallback, blurDataURL: undefined };
  const imageConfig = { sizes: sizes || '100vw', quality: quality || 75 };

  const aspectRatioClass = {
    square: 'aspect-square',
    '16/9': 'aspect-video',
    '4/3': 'aspect-[4/3]',
    '3/2': 'aspect-[3/2]',
    auto: '',
  }[aspectRatio]

  const handleLoad = () => {
    setIsLoading(false)
    onLoad?.()
  }

  const handleError = () => {
    setIsError(true)
    setIsLoading(false)
    onError?.()
  }

  return (
    <div
      ref={imgRef}
      className={cn(
        'relative overflow-hidden bg-gray-100',
        aspectRatioClass,
        className
      )}
    >
      {/* Loading skeleton */}
      {isLoading && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%]" />
      )}

      {/* Image */}
      {isInView && !isError && imageProps && (
        <Image
          src={imageProps.src}
          alt={alt}
          fill
          sizes={sizes || imageConfig.sizes}
          quality={quality || imageConfig.quality}
          priority={priority}
          className={cn(
            'object-cover transition-opacity duration-300',
            isLoading ? 'opacity-0' : 'opacity-100'
          )}
          placeholder="blur"
          blurDataURL={imageProps.blurDataURL}
          onLoad={handleLoad}
          onError={handleError}
        />
      )}

      {/* Fallback image */}
      {(isError || (!image && fallback)) && (
        <Image
          src={fallback}
          alt={alt}
          fill
          sizes={sizes || imageConfig.sizes}
          className="object-cover opacity-50"
          onLoad={handleLoad}
        />
      )}

      {/* Error state */}
      {isError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-400">
          <svg
            className="h-8 w-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
      )}
    </div>
  )
}

// Optimized gallery component
export function OptimizedImageGallery({
  images,
  className,
}: {
  images: Array<{ image: any; alt: string; caption?: string }>
  className?: string
}) {
  return (
    <div className={cn('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4', className)}>
      {images.map((item, index) => (
        <div key={index} className="group relative">
          <OptimizedImage
            image={item.image}
            alt={item.alt}
            config="gallery"
            className="transition-transform duration-300 group-hover:scale-105"
            priority={index < 6} // Prioritize first 6 images
          />
          {item.caption && (
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4">
              <p className="text-sm text-white">{item.caption}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}