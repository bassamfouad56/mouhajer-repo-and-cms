'use client'

import { memo } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useLocale } from 'next-intl'
import OptimizedImage from '@/components/optimized/OptimizedImage'
import { getLocalizedText, cn } from '@/lib/utils'

interface HeroSectionProps {
  data: {
    headline: { en: string; ar: string }
    subheadline?: { en: string; ar: string }
    backgroundMedia: {
      mediaType: 'image' | 'video'
      image?: any
      video?: any
      videoUrl?: string
    }
    overlay: {
      enabled: boolean
      opacity: number
      color: 'black' | 'white' | 'primary' | 'gradient'
    }
    ctaButtons?: Array<{
      _id: string
      headline: { en: string; ar: string }
      primaryButton: {
        text: { en: string; ar: string }
        action: string
        style: string
      }
    }>
    showBreadcrumbs?: boolean
    height: 'screen' | '50vh' | 'auto'
  }
  className?: string
}

const HeroSection = memo(({ data, className }: HeroSectionProps) => {
  const locale = useLocale() as 'en' | 'ar'

  const heightClass = {
    screen: 'h-screen',
    '50vh': 'h-[50vh]',
    auto: 'min-h-[60vh]',
  }[data.height]

  const overlayClasses = {
    black: 'bg-black',
    white: 'bg-white',
    primary: 'bg-primary',
    gradient: 'bg-gradient-to-b from-black/70 via-black/30 to-transparent',
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  }

  return (
    <section
      className={cn(
        'relative w-full overflow-hidden',
        heightClass,
        className
      )}
    >
      {/* Background Media */}
      <div className="absolute inset-0">
        {data.backgroundMedia.mediaType === 'image' && data.backgroundMedia.image ? (
          <OptimizedImage
            image={data.backgroundMedia.image}
            alt={getLocalizedText(data.headline, locale)}
            config="hero"
            className="w-full h-full"
            priority
          />
        ) : data.backgroundMedia.mediaType === 'video' ? (
          <div className="relative w-full h-full">
            {data.backgroundMedia.videoUrl ? (
              <video
                className="w-full h-full object-cover"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
              >
                <source src={data.backgroundMedia.videoUrl} type="video/mp4" />
              </video>
            ) : data.backgroundMedia.video ? (
              <video
                className="w-full h-full object-cover"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
              >
                <source src={data.backgroundMedia.video.asset.url} type="video/mp4" />
              </video>
            ) : null}
          </div>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-900 to-gray-600" />
        )}
      </div>

      {/* Overlay */}
      {data.overlay.enabled && (
        <div
          className={cn(
            'absolute inset-0',
            overlayClasses[data.overlay.color]
          )}
          style={{ opacity: data.overlay.opacity }}
        />
      )}

      {/* Content */}
      <div className="relative z-10 flex h-full items-center justify-center">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center text-white"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Breadcrumbs */}
            {data.showBreadcrumbs && (
              <motion.nav
                variants={itemVariants}
                className="mb-8 text-sm opacity-80"
              >
                <Link href={`/${locale}`} className="hover:opacity-100 transition-opacity">
                  {locale === 'en' ? 'Home' : 'الرئيسية'}
                </Link>
                <span className="mx-2">/</span>
                <span className="opacity-60">
                  {getLocalizedText(data.headline, locale)}
                </span>
              </motion.nav>
            )}

            {/* Headline */}
            <motion.h1
              variants={itemVariants}
              className="font-SchnyderS text-4xl lg:text-7xl xl:text-8xl font-light uppercase leading-[0.9] mb-6 max-w-6xl mx-auto"
            >
              {getLocalizedText(data.headline, locale)}
            </motion.h1>

            {/* Subheadline */}
            {data.subheadline && (
              <motion.p
                variants={itemVariants}
                className="font-Satoshi text-lg lg:text-2xl font-normal leading-relaxed mb-12 max-w-4xl mx-auto opacity-90"
              >
                {getLocalizedText(data.subheadline, locale)}
              </motion.p>
            )}

            {/* CTA Buttons */}
            {data.ctaButtons && data.ctaButtons.length > 0 && (
              <motion.div
                variants={itemVariants}
                className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              >
                {data.ctaButtons.map((cta, index) => (
                  <CTAButton
                    key={cta._id}
                    button={cta.primaryButton}
                    locale={locale}
                    variant={index === 0 ? 'primary' : 'secondary'}
                  />
                ))}
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.6 }}
      >
        <div className="flex flex-col items-center space-y-2">
          <span className="text-sm font-Satoshi uppercase tracking-wide opacity-70">
            {locale === 'en' ? 'Scroll Down' : 'اسحب للأسفل'}
          </span>
          <motion.div
            className="w-px h-8 bg-white opacity-50"
            animate={{ scaleY: [1, 1.5, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </section>
  )
})

HeroSection.displayName = 'HeroSection'

// CTA Button Component
interface CTAButtonProps {
  button: {
    text: { en: string; ar: string }
    action: string
    style: string
  }
  locale: 'en' | 'ar'
  variant: 'primary' | 'secondary'
}

const CTAButton = memo(({ button, locale, variant }: CTAButtonProps) => {
  const baseClasses = "px-8 py-4 font-Satoshi font-medium uppercase tracking-wide transition-all duration-300 transform hover:scale-105"

  const variants = {
    primary: "bg-white text-black hover:bg-opacity-90",
    secondary: "border-2 border-white text-white hover:bg-white hover:text-black"
  }

  return (
    <motion.button
      className={cn(baseClasses, variants[variant])}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {getLocalizedText(button.text, locale)}
    </motion.button>
  )
})

CTAButton.displayName = 'CTAButton'

export default HeroSection