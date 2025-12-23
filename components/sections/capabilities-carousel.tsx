'use client';

import { useRef, useState } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { SafeImage } from '@/components/safe-image';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { getProjectPlaceholder } from '@/lib/image-utils';
import { useTranslations } from 'next-intl';

interface CapabilitiesCarouselProps {
  images?: Array<{ url: string; alt: string }>;
}

export function CapabilitiesCarousel({ images = [] }: CapabilitiesCarouselProps) {
  const t = useTranslations('Capabilities');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const capabilities = [
    {
      id: 1,
      stage: '01',
      badge: t('items.build.badge'),
      title: t('items.build.title'),
      shortTitle: t('items.build.shortTitle'),
      description: t('items.build.description'),
      link: '/services/civil-construction',
      image: images[0]?.url || '/placeholder.jpg',
    },
    {
      id: 2,
      stage: '02',
      badge: t('items.design.badge'),
      title: t('items.design.title'),
      shortTitle: t('items.design.shortTitle'),
      description: t('items.design.description'),
      link: '/services/interior-architecture',
      image: images[1]?.url || '/placeholder.jpg',
    },
    {
      id: 3,
      stage: '03',
      badge: t('items.power.badge'),
      title: t('items.power.title'),
      shortTitle: t('items.power.shortTitle'),
      description: t('items.power.description'),
      link: '/services/mep-engineering',
      image: images[2]?.url || '/placeholder.jpg',
    },
    {
      id: 4,
      stage: '04',
      badge: t('items.make.badge'),
      title: t('items.make.title'),
      shortTitle: t('items.make.shortTitle'),
      description: t('items.make.description'),
      link: '/services/manufacturing-joinery',
      image: images[3]?.url || '/placeholder.jpg',
    },
    {
      id: 5,
      stage: '05',
      badge: t('items.install.badge'),
      title: t('items.install.title'),
      shortTitle: t('items.install.shortTitle'),
      description: t('items.install.description'),
      link: '/services/fit-out-execution',
      image: images[4]?.url || '/placeholder.jpg',
    },
    {
      id: 6,
      stage: '06',
      badge: t('items.care.badge'),
      title: t('items.care.title'),
      shortTitle: t('items.care.shortTitle'),
      description: t('items.care.description'),
      link: '/services/handover-maintenance',
      image: images[5]?.url || '/placeholder.jpg',
    },
  ];

  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '15%']);
  const backgroundScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.1, 1, 1.1]);

  return (
    <section
      ref={sectionRef}
      id="capabilities"
      className="relative min-h-screen overflow-hidden bg-[#0a0a0a]"
    >
      {/* Full-screen background images - all preloaded, opacity controlled */}
      <div className="absolute inset-0">
        {/* All background images rendered, visibility controlled by opacity */}
        {capabilities.map((capability, index) => (
          <motion.div
            key={capability.id}
            className="absolute inset-0"
            initial={false}
            animate={{
              opacity: hoveredIndex === index ? 1 : 0,
              scale: hoveredIndex === index ? 1 : 1.05,
            }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              className="absolute inset-0"
              style={{ y: backgroundY, scale: backgroundScale }}
            >
              <SafeImage
                src={capability.image}
                alt={capability.title}
                fallbackSrc={getProjectPlaceholder(capability.title, 'commercial')}
                fill
                className="object-cover"
                sizes="100vw"
              />
            </motion.div>
            {/* Gradient overlays for readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/80 to-[#0a0a0a]/60" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-[#0a0a0a]/80" />
            {/* Gold tint overlay */}
            <div className="absolute inset-0 bg-[#c9a962]/5 mix-blend-overlay" />
          </motion.div>
        ))}

        {/* Default state - subtle gradient */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{ opacity: hoveredIndex === null ? 1 : 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(201,169,98,0.08),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(201,169,98,0.05),transparent_50%)]" />
        </motion.div>
      </div>

      <div className="relative z-10 mx-auto max-w-[1600px] px-6 py-32 lg:px-16 lg:py-44">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 1 }}
          className="mb-24 lg:mb-32"
        >
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-end">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="mb-8"
              >
                <span className="inline-flex items-center gap-4 font-Satoshi text-[11px] font-semibold uppercase tracking-[0.5em] text-[#c9a962]">
                  <span className="h-px w-12 bg-[#c9a962]" />
                  {t('heading')}
                </span>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 1, delay: 0.3 }}
                className="font-SchnyderS text-6xl font-light tracking-tight text-white sm:text-7xl lg:text-[5.5rem] leading-[0.9]"
              >
                {t('titleLine1')}
                <br />
                <span className="text-[#c9a962]">{t('titleLine2')}</span>
              </motion.h2>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="lg:pb-4"
            >
              <p className="font-Satoshi text-lg font-light leading-relaxed text-neutral-400">
                {t('description')}
                <span className="text-white font-normal"> {t('descriptionHighlight')}</span>
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Capabilities - Accordion Style */}
        <div className="relative">
          {capabilities.map((capability, index) => (
            <motion.div
              key={capability.id}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 + index * 0.1 }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="group relative"
            >
              <Link href={capability.link} className="block">
                <div
                  className={`relative border-t transition-all duration-500 ${
                    hoveredIndex === index
                      ? 'border-[#c9a962]/50 bg-[#c9a962]/5'
                      : 'border-white/10'
                  }`}
                >
                  {/* Content Row */}
                  <div className="relative z-10 grid grid-cols-12 items-center gap-4 py-6 lg:gap-6 lg:py-10">
                    {/* Title */}
                    <div className="col-span-12 lg:col-span-5">
                      <motion.h3
                        className="font-SchnyderS text-2xl font-light text-white lg:text-4xl"
                        animate={{
                          color: hoveredIndex === index ? '#ffffff' : 'rgba(255,255,255,0.8)',
                        }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      >
                        {capability.title}
                      </motion.h3>
                    </div>

                    {/* Description - Reveals on hover */}
                    <div className="col-span-12 lg:col-span-5 lg:pl-8">
                      <motion.div
                        className="overflow-hidden"
                        initial={false}
                        animate={{
                          height: hoveredIndex === index ? 'auto' : 0,
                          opacity: hoveredIndex === index ? 1 : 0,
                        }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <p className="font-Satoshi text-sm font-light leading-relaxed text-white/70 lg:text-base">
                          {capability.description}
                        </p>
                      </motion.div>

                      {/* Badge - Shows when not hovered */}
                      <motion.span
                        className="font-Satoshi text-xs font-medium uppercase tracking-[0.3em] text-[#c9a962]/50"
                        animate={{
                          opacity: hoveredIndex === index ? 0 : 1,
                          height: hoveredIndex === index ? 0 : 'auto',
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        {capability.badge}
                      </motion.span>
                    </div>

                    {/* Arrow */}
                    <div className="col-span-12 lg:col-span-2 flex justify-end">
                      <motion.div
                        className="flex h-12 w-12 items-center justify-center rounded-full border transition-all duration-500 lg:h-14 lg:w-14"
                        animate={{
                          borderColor: hoveredIndex === index ? '#c9a962' : 'rgba(255,255,255,0.2)',
                          backgroundColor: hoveredIndex === index ? '#c9a962' : 'transparent',
                          scale: hoveredIndex === index ? 1.1 : 1,
                        }}
                        transition={{ duration: 0.4 }}
                      >
                        <motion.div
                          animate={{
                            x: hoveredIndex === index ? 4 : 0,
                            color: hoveredIndex === index ? '#0a0a0a' : 'rgba(255,255,255,0.6)',
                          }}
                          transition={{ duration: 0.3 }}
                        >
                          <ArrowRight className="h-5 w-5" strokeWidth={1.5} />
                        </motion.div>
                      </motion.div>
                    </div>
                  </div>

                  {/* Bottom accent line */}
                  <motion.div
                    className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-[#c9a962] via-[#e8d5a3] to-transparent"
                    initial={{ width: '0%' }}
                    animate={{
                      width: hoveredIndex === index ? '100%' : '0%',
                    }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>
              </Link>
            </motion.div>
          ))}

          {/* Last border */}
          <div className="border-t border-white/10" />
        </div>

        {/* Process visualization */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 1 }}
          className="mt-20 lg:mt-28"
        >
          <div className="flex items-center justify-center gap-3 lg:gap-6">
            {capabilities.map((cap, index) => (
              <div key={index} className="flex items-center gap-3 lg:gap-6">
                <motion.button
                  className="relative flex flex-col items-center gap-3"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  whileHover={{ scale: 1.1 }}
                >
                  <motion.div
                    className="h-3 w-3 rounded-full border transition-all duration-300"
                    animate={{
                      borderColor: hoveredIndex === index ? '#c9a962' : 'rgba(255,255,255,0.3)',
                      backgroundColor: hoveredIndex === index ? '#c9a962' : 'transparent',
                      scale: hoveredIndex === index ? 1.3 : 1,
                    }}
                  />
                  <span
                    className={`hidden font-Satoshi text-[10px] font-medium uppercase tracking-wider transition-colors duration-300 lg:block ${
                      hoveredIndex === index ? 'text-[#c9a962]' : 'text-neutral-500'
                    }`}
                  >
                    {cap.shortTitle}
                  </span>
                </motion.button>
                {index < capabilities.length - 1 && (
                  <motion.div
                    className="h-px w-6 lg:w-12"
                    animate={{
                      backgroundColor:
                        hoveredIndex !== null && index < hoveredIndex
                          ? 'rgba(201,169,98,0.5)'
                          : 'rgba(255,255,255,0.15)',
                    }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="mt-16 flex flex-col items-center gap-6 sm:flex-row sm:justify-center sm:gap-8"
        >
          <span className="font-Satoshi text-sm font-light text-neutral-500">
            {t('ctaPrompt')}
          </span>
          <Link
            href="/services"
            className="group relative inline-flex items-center gap-4 overflow-hidden rounded-full bg-[#c9a962] px-10 py-5 font-Satoshi text-sm font-semibold uppercase tracking-[0.2em] text-[#0a0a0a] transition-all duration-500 hover:bg-white"
          >
            <span>{t('ctaButton')}</span>
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={2} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
