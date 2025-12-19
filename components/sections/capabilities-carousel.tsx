'use client';

import { useRef, useState, useMemo } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { SafeImage } from '@/components/safe-image';
import { ArrowRight, Plus } from 'lucide-react';
import Link from 'next/link';
import { getProjectPlaceholder } from '@/lib/image-utils';
import { useTranslations } from 'next-intl';

interface CapabilitiesCarouselProps {
  images?: Array<{ url: string; alt: string }>;
}

export function CapabilitiesCarousel({ images = [] }: CapabilitiesCarouselProps) {
  const t = useTranslations('Capabilities');
  const tCommon = useTranslations('Common');

  const defaultCapabilities = [
    {
      id: 1,
      badge: t('items.build.badge'),
      title: t('items.build.title'),
      shortTitle: t('items.build.shortTitle'),
      description: t('items.build.description'),
      link: '/services/civil-construction',
      imageAlt: 'Construction site with modern building',
      color: '#BA9051',
    },
    {
      id: 2,
      badge: t('items.design.badge'),
      title: t('items.design.title'),
      shortTitle: t('items.design.shortTitle'),
      description: t('items.design.description'),
      link: '/services/interior-architecture',
      imageAlt: 'Luxury interior design concept',
      color: '#C9A961',
    },
    {
      id: 3,
      badge: t('items.power.badge'),
      title: t('items.power.title'),
      shortTitle: t('items.power.shortTitle'),
      description: t('items.power.description'),
      link: '/services/mep-engineering',
      imageAlt: 'MEP engineering systems',
      color: '#D4B872',
    },
    {
      id: 4,
      badge: t('items.make.badge'),
      title: t('items.make.title'),
      shortTitle: t('items.make.shortTitle'),
      description: t('items.make.description'),
      link: '/services/manufacturing-joinery',
      imageAlt: 'Custom millwork and furniture',
      color: '#BA9051',
    },
    {
      id: 5,
      badge: t('items.install.badge'),
      title: t('items.install.title'),
      shortTitle: t('items.install.shortTitle'),
      description: t('items.install.description'),
      link: '/services/fit-out-execution',
      imageAlt: 'Luxury interior finishing details',
      color: '#C9A961',
    },
    {
      id: 6,
      badge: t('items.care.badge'),
      title: t('items.care.title'),
      shortTitle: t('items.care.shortTitle'),
      description: t('items.care.description'),
      link: '/services/handover-maintenance',
      imageAlt: 'Completed luxury property handover',
      color: '#D4B872',
    },
  ];
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Default fallback images for each capability
  const fallbackImages = [
    '/placeholder.jpg',
    '/placeholder.jpg',
    '/placeholder.jpg',
    '/placeholder.jpg',
    '/placeholder.jpg',
    '/placeholder.jpg',
  ];

  // Merge default capabilities with images
  const capabilities = useMemo(() => {
    return defaultCapabilities.map((cap, index) => ({
      ...cap,
      image: images[index]?.url || fallbackImages[index] || '/placeholder.jpg',
    }));
  }, [images]);

  return (
    <section
      ref={sectionRef}
      id="capabilities"
      className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-[#faf8f5] py-24 lg:py-32 scroll-mt-24"
    >
      {/* Background */}
      <div className="absolute inset-0">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#faf8f5] via-[#f8f6f3] to-[#faf8f5]" />

        {/* Subtle grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(38,36,32,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(38,36,32,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />

        {/* Animated accent lines */}
        <motion.div
          className="absolute left-0 top-1/4 h-px w-full bg-gradient-to-r from-transparent via-[#c9a962]/20 to-transparent"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div
          className="absolute left-0 top-3/4 h-px w-full bg-gradient-to-r from-transparent via-[#262420]/10 to-transparent"
          animate={{ opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 5, repeat: Infinity, delay: 2 }}
        />

        {/* Corner gradients */}
        <div className="absolute left-0 top-0 h-[500px] w-[500px] bg-[radial-gradient(ellipse_at_top_left,rgba(201,169,98,0.08)_0%,transparent_70%)]" />
        <div className="absolute bottom-0 right-0 h-[500px] w-[500px] bg-[radial-gradient(ellipse_at_bottom_right,rgba(201,169,98,0.05)_0%,transparent_70%)]" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 mx-auto max-w-[1800px] px-6 lg:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-16 lg:mb-20"
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-4 flex items-center gap-4">
                <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#c9a962]/50" />
                <span className="font-Satoshi text-xs font-light uppercase tracking-[0.3em] text-[#c9a962]">
                  {t('heading')}
                </span>
              </div>
              <h2 className="font-SchnyderS text-4xl font-light tracking-tight text-[#262420] sm:text-5xl lg:text-6xl xl:text-7xl">
                {t('titleLine1')}
                <br />
                <span className="text-[#3d3a36]/40">{t('titleLine2')}</span>
              </h2>
            </div>
            <p className="max-w-md font-Satoshi text-base font-light text-[#3d3a36]/60 lg:text-right lg:text-lg">
              {t('description')}
              <span className="text-[#262420]/80"> {t('descriptionHighlight')}</span>
            </p>
          </div>
        </motion.div>

        {/* Horizontal Accordion Cards */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-16"
        >
          {/* Desktop: Horizontal expanding cards */}
          <div className="hidden lg:flex lg:h-[500px] lg:gap-2">
            {capabilities.map((cap, index) => {
              const isActive = activeIndex === index;
              const isHovered = hoveredIndex === index;

              return (
                <motion.div
                  key={cap.id}
                  className="relative cursor-pointer overflow-hidden"
                  initial={false}
                  animate={{
                    flex: isActive ? 4 : 1,
                  }}
                  transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
                  onMouseEnter={() => {
                    setActiveIndex(index);
                    setHoveredIndex(index);
                  }}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {/* Background Image */}
                  <div className="absolute inset-0">
                    <SafeImage
                      src={cap.image}
                      alt={cap.imageAlt}
                      fallbackSrc={getProjectPlaceholder(cap.title, 'commercial')}
                      fill
                      className="object-cover transition-transform duration-700"
                      style={{ transform: isHovered ? 'scale(1.05)' : 'scale(1)' }}
                      sizes="(max-width: 1024px) 100vw, 33vw"
                    />
                    {/* Overlay */}
                    <div className={`absolute inset-0 transition-all duration-500 ${
                      isActive
                        ? 'bg-gradient-to-t from-[#262420]/90 via-[#262420]/60 to-[#262420]/20'
                        : 'bg-[#262420]/75'
                    }`} />
                  </div>

                  {/* Collapsed State - Vertical Label */}
                  <AnimatePresence>
                    {!isActive && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="absolute inset-0 flex flex-col items-center justify-center"
                      >
                        <span
                          className="font-Satoshi text-sm font-light uppercase tracking-[0.2em] text-white/60"
                          style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
                        >
                          {cap.shortTitle}
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Expanded State - Full Content */}
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="absolute inset-0 flex flex-col justify-end p-8 lg:p-10"
                      >
                        {/* Badge */}
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: 0.3 }}
                          className="mb-4 inline-flex w-fit items-center gap-2 border border-[#c9a962]/30 bg-[#262420]/50 px-4 py-2 backdrop-blur-sm"
                        >
                          <span className="font-Satoshi text-xs font-light uppercase tracking-wider text-[#c9a962]">
                            {cap.badge}
                          </span>
                        </motion.div>

                        {/* Title */}
                        <motion.h3
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.4 }}
                          className="mb-4 font-SchnyderS text-3xl font-light text-white lg:text-4xl xl:text-5xl"
                        >
                          {cap.title}
                        </motion.h3>

                        {/* Description */}
                        <motion.p
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.5 }}
                          className="mb-6 max-w-lg font-Satoshi text-base font-light leading-relaxed text-white/60"
                        >
                          {cap.description}
                        </motion.p>

                        {/* Link */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.6 }}
                        >
                          <Link
                            href={cap.link}
                            className="group inline-flex items-center gap-3 border border-[#c9a962]/30 bg-[#c9a962]/10 px-6 py-3 font-Satoshi text-xs font-light uppercase tracking-wider text-[#c9a962] backdrop-blur-sm transition-all hover:bg-[#c9a962]/20 hover:gap-4"
                          >
                            {tCommon('learnMore')}
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" strokeWidth={1.5} />
                          </Link>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Hover indicator line */}
                  <motion.div
                    className="absolute bottom-0 left-0 h-1 bg-[#c9a962]"
                    initial={{ width: '0%' }}
                    animate={{ width: isActive ? '100%' : isHovered ? '100%' : '0%' }}
                    transition={{ duration: 0.5 }}
                  />

                  {/* Side border accent */}
                  <div className="absolute right-0 top-0 h-full w-px bg-[#262420]/10" />
                </motion.div>
              );
            })}
          </div>

          {/* Mobile: Stacked accordion */}
          <div className="space-y-3 lg:hidden">
            {capabilities.map((cap, index) => {
              const isActive = activeIndex === index;

              return (
                <motion.div
                  key={cap.id}
                  className="relative overflow-hidden border border-[#262420]/10 bg-white/50"
                  initial={false}
                  animate={{
                    height: isActive ? 'auto' : 80,
                  }}
                  transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                >
                  {/* Header - Always visible */}
                  <button
                    onClick={() => setActiveIndex(index)}
                    className="flex w-full items-center justify-between p-5"
                  >
                    <div className="text-left">
                      <span className="block font-Satoshi text-xs font-light uppercase tracking-wider text-[#c9a962]">
                        {cap.badge}
                      </span>
                      <span className="font-SchnyderS text-lg font-light text-[#262420]">
                        {cap.title}
                      </span>
                    </div>
                    <motion.div
                      animate={{ rotate: isActive ? 45 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Plus className="h-5 w-5 text-[#c9a962]" strokeWidth={1.5} />
                    </motion.div>
                  </button>

                  {/* Expanded Content */}
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="px-5 pb-5"
                      >
                        {/* Image */}
                        <div className="relative mb-4 aspect-video overflow-hidden">
                          <SafeImage
                            src={cap.image}
                            alt={cap.imageAlt}
                            fallbackSrc={getProjectPlaceholder(cap.title, 'commercial')}
                            fill
                            className="object-cover"
                            sizes="100vw"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#262420]/60 to-transparent" />
                        </div>

                        {/* Description */}
                        <p className="mb-4 font-Satoshi text-sm font-light leading-relaxed text-[#3d3a36]/70">
                          {cap.description}
                        </p>

                        {/* Link */}
                        <Link
                          href={cap.link}
                          className="inline-flex items-center gap-2 font-Satoshi text-xs font-light text-[#c9a962] transition-all hover:gap-3"
                        >
                          {tCommon('learnMore')}
                          <ArrowRight className="h-3 w-3" strokeWidth={1.5} />
                        </Link>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Progress Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-16 flex items-center justify-center"
        >
          <div className="flex items-center gap-2">
            {capabilities.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`h-1 transition-all duration-300 ${
                  index === activeIndex
                    ? 'w-12 bg-[#c9a962]'
                    : 'w-4 bg-[#262420]/20 hover:bg-[#262420]/40'
                }`}
              />
            ))}
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="inline-flex flex-col items-center gap-6 sm:flex-row sm:gap-8">
            <span className="font-Satoshi text-sm font-light text-[#3d3a36]/60">
              {t('ctaPrompt')}
            </span>
            <Link
              href="/services"
              className="group inline-flex items-center gap-3 border border-[#c9a962] bg-[#c9a962] px-8 py-4 font-Satoshi text-sm font-light uppercase tracking-wider text-white transition-all hover:bg-transparent hover:text-[#c9a962] hover:gap-4"
            >
              {t('ctaButton')}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" strokeWidth={1.5} />
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Corner decorations */}
      <div className="pointer-events-none absolute left-8 top-24 hidden h-32 w-32 border-l border-t border-[#c9a962]/10 lg:block" />
      <div className="pointer-events-none absolute bottom-24 right-8 hidden h-32 w-32 border-b border-r border-[#c9a962]/10 lg:block" />
    </section>
  );
}
