'use client';

import { useRef, useState, useMemo } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { ArrowRight, Hotel, Home, Building2 } from 'lucide-react';
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
      accent: '#c9a962',
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
      accent: '#a8a29e',
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
      accent: '#78716c',
    },
  ];

  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const [hoveredId, setHoveredId] = useState<string | null>(null);

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

  const handleHover = (id: string | null) => {
    setHoveredId(id);
  };

  return (
    <section
      ref={sectionRef}
      id="sectors"
      className="relative overflow-hidden bg-[#faf8f5] py-24 sm:py-32 lg:py-40 scroll-mt-24"
    >
      {/* Background Pattern */}

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-12">
        {/* Section Header */}
        <div className="mb-16 lg:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="mb-4 flex items-center gap-4"
          >
            <span className="font-Satoshi text-xs font-medium uppercase tracking-[0.3em] text-[#c9a962]">
              {t('label')}
            </span>
            <div className="h-px w-12 bg-[#c9a962]" />
          </motion.div>

          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="font-SchnyderS text-4xl font-light tracking-tight text-neutral-900 sm:text-5xl lg:text-6xl"
            >
              {t('titleLine1')}
              <br />
              <span className="text-neutral-400">{t('titleLine2')}</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="max-w-md font-Satoshi text-base font-light leading-relaxed text-neutral-600 lg:text-right lg:text-lg"
            >
              {t('description')}
            </motion.p>
          </div>
        </div>

        {/* Industries Grid */}
        <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
          {sectors.map((sector, index) => {
            const Icon = sector.icon;
            const isHovered = hoveredId === sector.id;

            return (
              <motion.div
                key={sector.id}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.3 + index * 0.15 }}
                className="group relative h-full"
                onMouseEnter={() => handleHover(sector.id)}
                onMouseLeave={() => handleHover(null)}
              >
                <Link href={sector.link} className="block h-full">
                  <div className="relative flex h-full flex-col overflow-hidden border border-neutral-200 bg-white transition-all duration-500 hover:border-[#c9a962]/30 hover:shadow-xl">
                    {/* Image Container */}
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <motion.div
                        className="absolute inset-0"
                        animate={{
                          scale: isHovered ? 1.08 : 1,
                        }}
                        transition={{
                          duration: 0.8,
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

                      {/* Light overlay for better contrast */}
                      <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/60 via-neutral-900/20 to-transparent" />

                      {/* Icon Badge */}
                      <div className="absolute right-4 top-4 flex h-12 w-12 items-center justify-center border border-white/20 bg-white/10 backdrop-blur-sm">
                        <Icon className="h-5 w-5 text-white" strokeWidth={1.5} />
                      </div>

                      {/* Stats Overlay - Bottom of image */}
                      <div className="absolute bottom-4 left-4 flex gap-4">
                        <div>
                          <div className="font-SchnyderS text-2xl font-light text-white">
                            {sector.stats.projects}
                          </div>
                          <div className="font-Satoshi text-[10px] font-light uppercase tracking-wider text-white/70">
                            {t('projectsLabel')}
                          </div>
                        </div>
                        <div className="h-10 w-px bg-white/20" />
                        <div>
                          <div className="font-SchnyderS text-2xl font-light text-white">
                            {sector.stats.value}
                          </div>
                          <div className="font-Satoshi text-[10px] font-light uppercase tracking-wider text-white/70">
                            {t('valueDelivered')}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex flex-1 flex-col p-6 lg:p-8">
                      {/* Subtitle */}
                      <div
                        className="mb-2 font-Satoshi text-xs font-medium uppercase tracking-[0.2em]"
                        style={{ color: sector.accent }}
                      >
                        {sector.subtitle}
                      </div>

                      {/* Title */}
                      <h3 className="mb-3 font-SchnyderS text-2xl font-light tracking-tight text-neutral-900 lg:text-3xl">
                        {sector.title}
                      </h3>

                      {/* Description */}
                      <p className="mb-6 flex-1 font-Satoshi text-sm font-light leading-relaxed text-neutral-600">
                        {sector.description}
                      </p>

                      {/* Features Tags */}
                      <div className="mb-6 flex flex-wrap gap-2">
                        {sector.features.map((feature, i) => (
                          <span
                            key={i}
                            className="border border-neutral-200 bg-neutral-50 px-3 py-1.5 font-Satoshi text-[10px] font-light uppercase tracking-wider text-neutral-600"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>

                      {/* CTA */}
                      <div className="flex items-center gap-2 font-Satoshi text-sm font-light text-neutral-900 transition-colors group-hover:text-[#c9a962]">
                        <span>{tCommon('explore')}</span>
                        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={1.5} />
                      </div>
                    </div>

                    {/* Accent Line */}
                    <motion.div
                      className="absolute bottom-0 left-0 h-1 bg-[#c9a962]"
                      initial={{ width: '0%' }}
                      animate={{ width: isHovered ? '100%' : '0%' }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
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
          className="mt-16 text-center lg:mt-20"
        >
          <p className="mb-6 font-Satoshi text-sm font-light text-neutral-500">
            {t('ctaQuestion')}
          </p>

          <Link
            href="#contact"
            className="group relative inline-flex items-center gap-3 overflow-hidden border border-[#c9a962] bg-[#c9a962] px-8 py-4 font-Satoshi text-sm font-light uppercase tracking-[0.2em] text-white transition-all duration-500 hover:bg-transparent hover:text-[#c9a962]"
          >
            <span>{t('ctaButton')}</span>
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={1.5} />
          </Link>
        </motion.div>
      </div>

      {/* Corner Decorations */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 1, delay: 0.5 }}
        className="absolute left-8 top-24 hidden h-16 w-16 border-l border-t border-[#c9a962]/20 lg:block"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 1, delay: 0.6 }}
        className="absolute bottom-24 right-8 hidden h-16 w-16 border-b border-r border-[#c9a962]/20 lg:block"
      />
    </section>
  );
}
