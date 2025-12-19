'use client';

import { useRef, useState, useMemo } from 'react';
import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ArrowRight, Hotel, Home, Building2, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { SafeImage } from '@/components/safe-image';
import { useTranslations } from 'next-intl';

interface SectorsExpertiseProps {
  images?: {
    hospitality: string;
    residential: string;
    commercial: string;
  };
}

export function SectorsExpertise({ images }: SectorsExpertiseProps) {
  const t = useTranslations('Sectors');
  const tCommon = useTranslations('Common');

  // Define sectors inside component to use translations
  const defaultSectors = [
    {
      id: 'hospitality',
      title: t('items.hospitality.title'),
      subtitle: t('items.hospitality.subtitle'),
      description: t('items.hospitality.description'),
      features: [
        t('items.hospitality.features.0'),
        t('items.hospitality.features.1'),
        t('items.hospitality.features.2'),
      ],
      link: '/industries/luxury-hospitality',
      icon: Hotel,
      stats: { projects: '50+', value: 'AED 500M+' },
    },
    {
      id: 'residential',
      title: t('items.residential.title'),
      subtitle: t('items.residential.subtitle'),
      description: t('items.residential.description'),
      features: [
        t('items.residential.features.0'),
        t('items.residential.features.1'),
        t('items.residential.features.2'),
      ],
      link: '/industries/high-end-residential',
      icon: Home,
      stats: { projects: '300+', value: 'AED 2B+' },
    },
    {
      id: 'commercial',
      title: t('items.commercial.title'),
      subtitle: t('items.commercial.subtitle'),
      description: t('items.commercial.description'),
      features: [
        t('items.commercial.features.0'),
        t('items.commercial.features.1'),
        t('items.commercial.features.2'),
      ],
      link: '/industries/commercial-corporate',
      icon: Building2,
      stats: { projects: '100+', value: 'AED 300M+' },
    },
  ];
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [isAnyHovered, setIsAnyHovered] = useState(false);

  // Default fallback images for each sector
  const fallbackImages: Record<string, string> = {
    hospitality: '/placeholder.jpg',
    residential: '/placeholder.jpg',
    commercial: '/placeholder.jpg',
  };

  // Merge default sectors with images
  const sectors = useMemo(() => {
    return defaultSectors.map((sector) => ({
      ...sector,
      image: images?.[sector.id as keyof typeof images] || fallbackImages[sector.id] || '/placeholder.jpg',
    }));
  }, [images]);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '10%']);

  const handleHover = (id: string | null) => {
    setHoveredId(id);
    setIsAnyHovered(id !== null);
  };

  return (
    <section
      ref={sectionRef}
      id="sectors"
      className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-[#faf8f5] py-24 sm:py-32 lg:py-40 scroll-mt-24"
    >
      {/* Animated Background */}
      <motion.div className="absolute inset-0" style={{ y: backgroundY }}>
        <div className="absolute inset-0 bg-gradient-to-b from-[#faf8f5] via-white to-[#faf8f5]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(201,169,98,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(201,169,98,0.03)_1px,transparent_1px)] bg-[size:80px_80px]" />

        {/* Floating gradient orbs */}
        <motion.div
          className="absolute left-1/4 top-1/4 h-[600px] w-[600px] rounded-full bg-[#c9a962]/[0.03] blur-[150px]"
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute right-1/4 bottom-1/4 h-[500px] w-[500px] rounded-full bg-white/[0.02] blur-[120px]"
          animate={{
            x: [0, -40, 0],
            y: [0, 40, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        />
      </motion.div>

      <div className="relative z-10 mx-auto max-w-[1600px] px-6 lg:px-12">
        {/* Section Header */}
        <div className="mb-16 text-center lg:mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="mb-6 flex items-center justify-center gap-4"
          >
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#c9a962]/50" />
            <Sparkles className="h-4 w-4 text-[#c9a962]" />
            <span className="font-Satoshi text-xs font-light uppercase tracking-[0.4em] text-neutral-500">
              {t('label')}
            </span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#c9a962]/50" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mb-6 font-SchnyderS text-5xl font-light tracking-tight text-neutral-900 sm:text-6xl lg:text-7xl"
          >
            {t('titleLine1')}
            <br />
            <span className="text-neutral-400">{t('titleLine2')}</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto max-w-2xl font-Satoshi text-base font-light text-neutral-600 lg:text-lg"
          >
            {t('description')}
          </motion.p>
        </div>

        {/* Industries Grid */}
        <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
          {sectors.map((sector, index) => {
            const Icon = sector.icon;
            const isHovered = hoveredId === sector.id;
            const isOtherHovered = isAnyHovered && !isHovered;

            return (
              <motion.div
                key={sector.id}
                initial={{ opacity: 0, y: 60 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.3 + index * 0.15 }}
                className="relative"
                onMouseEnter={() => handleHover(sector.id)}
                onMouseLeave={() => handleHover(null)}
              >
                <Link href={sector.link} className="block">
                  <motion.div
                    className="relative overflow-hidden"
                    animate={{
                      scale: isHovered ? 1.05 : isOtherHovered ? 0.95 : 1,
                      opacity: isOtherHovered ? 0.5 : 1,
                      zIndex: isHovered ? 20 : 1,
                    }}
                    transition={{
                      duration: 0.6,
                      ease: [0.25, 0.1, 0.25, 1],
                    }}
                    style={{
                      transformOrigin: 'center center',
                    }}
                  >
                    {/* Card Container */}
                    <motion.div
                      className="relative aspect-[3/4] overflow-hidden border border-[#c9a962]/10 bg-white/70"
                      animate={{
                        borderColor: isHovered ? 'rgba(201, 169, 98, 0.3)' : 'rgba(255, 255, 255, 0.05)',
                      }}
                      transition={{ duration: 0.4 }}
                    >
                      {/* Background Image */}
                      <motion.div
                        className="absolute inset-0"
                        animate={{
                          scale: isHovered ? 1.15 : 1,
                        }}
                        transition={{
                          duration: 1.2,
                          ease: [0.25, 0.1, 0.25, 1],
                        }}
                      >
                        <SafeImage
                          src={sector.image}
                          alt={sector.title}
                          fill
                          className="object-cover"
                        />
                      </motion.div>

                      {/* Gradient Overlays */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-t from-[#faf8f5] via-[#faf8f5]/60 to-[#faf8f5]/20"
                        animate={{
                          opacity: isHovered ? 0.85 : 0.9,
                        }}
                        transition={{ duration: 0.4 }}
                      />

                      {/* Golden Accent Glow on Hover */}
                      <AnimatePresence>
                        {isHovered && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.4 }}
                            className="absolute inset-0 bg-gradient-to-t from-[#c9a962]/20 via-transparent to-transparent"
                          />
                        )}
                      </AnimatePresence>

                      {/* Content */}
                      <div className="relative z-10 flex h-full flex-col justify-between p-6 lg:p-8">
                        {/* Top - Icon */}
                        <div className="flex items-start justify-end">
                          <motion.div
                            className="flex h-12 w-12 items-center justify-center border lg:h-14 lg:w-14"
                            animate={{
                              borderColor: isHovered ? 'rgba(201, 169, 98, 0.5)' : 'rgba(255, 255, 255, 0.1)',
                              backgroundColor: isHovered ? 'rgba(201, 169, 98, 0.1)' : 'transparent',
                            }}
                            transition={{ duration: 0.4 }}
                          >
                            <Icon
                              className="h-5 w-5 lg:h-6 lg:w-6"
                              strokeWidth={1}
                              style={{
                                color: isHovered ? '#c9a962' : 'rgba(255, 255, 255, 0.4)',
                              }}
                            />
                          </motion.div>
                        </div>

                        {/* Bottom - Title & Info */}
                        <div>
                          {/* Stats - Only visible on hover */}
                          <AnimatePresence>
                            {isHovered && (
                              <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                transition={{ duration: 0.4 }}
                                className="mb-6 flex gap-6"
                              >
                                <div>
                                  <div className="font-SchnyderS text-2xl font-light text-[#c9a962]">
                                    {sector.stats.projects}
                                  </div>
                                  <div className="font-Satoshi text-[10px] font-light uppercase tracking-wider text-white/40">
                                    {t('projectsLabel')}
                                  </div>
                                </div>
                                <div className="h-10 w-px bg-white/10" />
                                <div>
                                  <div className="font-SchnyderS text-2xl font-light text-[#c9a962]">
                                    {sector.stats.value}
                                  </div>
                                  <div className="font-Satoshi text-[10px] font-light uppercase tracking-wider text-white/40">
                                    {t('valueDelivered')}
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>

                          {/* Subtitle */}
                          <motion.div
                            className="mb-2 font-Satoshi text-xs font-light uppercase tracking-[0.2em]"
                            animate={{
                              color: isHovered ? 'rgba(201, 169, 98, 0.8)' : 'rgba(255, 255, 255, 0.4)',
                            }}
                            transition={{ duration: 0.4 }}
                          >
                            {sector.subtitle}
                          </motion.div>

                          {/* Title */}
                          <motion.h3
                            className="mb-4 font-SchnyderS text-3xl font-light tracking-tight text-white lg:text-4xl"
                            animate={{
                              y: isHovered ? -5 : 0,
                            }}
                            transition={{ duration: 0.4 }}
                          >
                            {sector.title}
                          </motion.h3>

                          {/* Description - Expands on hover */}
                          <motion.div
                            initial={false}
                            animate={{
                              height: isHovered ? 'auto' : 0,
                              opacity: isHovered ? 1 : 0,
                            }}
                            transition={{
                              duration: 0.5,
                              ease: [0.25, 0.1, 0.25, 1],
                            }}
                            className="overflow-hidden"
                          >
                            <p className="mb-4 font-Satoshi text-sm font-light leading-relaxed text-neutral-600">
                              {sector.description}
                            </p>

                            {/* Features */}
                            <div className="mb-6 flex flex-wrap gap-2">
                              {sector.features.map((feature, i) => (
                                <motion.span
                                  key={i}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ duration: 0.3, delay: i * 0.1 }}
                                  className="border border-[#c9a962]/30 bg-[#c9a962]/5 px-3 py-1.5 font-Satoshi text-[10px] font-light text-neutral-700"
                                >
                                  {feature}
                                </motion.span>
                              ))}
                            </div>
                          </motion.div>

                          {/* Divider */}
                          <motion.div
                            className="mb-4 h-px w-full"
                            animate={{
                              backgroundColor: isHovered ? 'rgba(201, 169, 98, 0.3)' : 'rgba(255, 255, 255, 0.1)',
                            }}
                            transition={{ duration: 0.4 }}
                          />

                          {/* CTA */}
                          <motion.div
                            className="flex items-center gap-2 font-Satoshi text-sm font-light"
                            animate={{
                              color: isHovered ? '#c9a962' : 'rgba(255, 255, 255, 0.5)',
                            }}
                            transition={{ duration: 0.4 }}
                          >
                            <span>{tCommon('explore')}</span>
                            <motion.div
                              animate={{
                                x: isHovered ? 8 : 0,
                              }}
                              transition={{ duration: 0.4 }}
                            >
                              <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
                            </motion.div>
                          </motion.div>
                        </div>
                      </div>

                      {/* Corner Accents */}
                      <motion.div
                        className="absolute right-0 top-0 h-20 w-20 border-r border-t"
                        animate={{
                          borderColor: isHovered ? 'rgba(201, 169, 98, 0.4)' : 'rgba(255, 255, 255, 0.05)',
                        }}
                        transition={{ duration: 0.4 }}
                      />
                      <motion.div
                        className="absolute bottom-0 left-0 h-20 w-20 border-b border-l"
                        animate={{
                          borderColor: isHovered ? 'rgba(201, 169, 98, 0.4)' : 'rgba(255, 255, 255, 0.05)',
                        }}
                        transition={{ duration: 0.4 }}
                      />

                      {/* Shimmer Effect on Hover */}
                      <AnimatePresence>
                        {isHovered && (
                          <motion.div
                            initial={{ x: '-100%', opacity: 0 }}
                            animate={{ x: '200%', opacity: 0.1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 1, ease: 'easeInOut' }}
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent"
                            style={{ transform: 'skewX(-20deg)' }}
                          />
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </motion.div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-20 text-center lg:mt-28"
        >
          <div className="mb-8 h-px w-full bg-gradient-to-r from-transparent via-[#c9a962]/20 to-transparent" />

          <p className="mb-6 font-Satoshi text-xs font-light uppercase tracking-[0.3em] text-neutral-500">
            {t('ctaQuestion')}
          </p>

          <Link
            href="#contact"
            className="group inline-flex items-center gap-4 border border-[#c9a962] bg-[#c9a962] px-10 py-5 font-Satoshi text-sm font-light uppercase tracking-[0.2em] text-neutral-950 transition-all duration-500 hover:bg-transparent hover:text-[#c9a962]"
          >
            <span>{t('ctaButton')}</span>
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={1.5} />
          </Link>
        </motion.div>
      </div>

      {/* Decorative Lines */}
      <div className="absolute left-0 top-0 h-full w-px bg-gradient-to-b from-transparent via-[#c9a962]/10 to-transparent" />
      <div className="absolute right-0 top-0 h-full w-px bg-gradient-to-b from-transparent via-[#c9a962]/10 to-transparent" />
    </section>
  );
}
