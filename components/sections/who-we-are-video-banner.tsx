'use client';

import { useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface CarouselImage {
  url: string;
  alt: string;
  title?: string;
}

interface WhoWeAreVideoBannerProps {
  images?: CarouselImage[];
}

export function WhoWeAreVideoBanner({ images = [] }: WhoWeAreVideoBannerProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const contentY = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const imageY = useTransform(scrollYProgress, [0, 1], [-30, 30]);

  // Use provided Sanity images or fallback to local project images
  const displayImages = images.length >= 3
    ? images.slice(0, 4)
    : [
        { url: '/placeholder.jpg', alt: 'Commercial Interior' },
        { url: '/placeholder.jpg', alt: 'Residential Interior' },
        { url: '/placeholder.jpg', alt: 'Design & Fitout' },
        { url: '/placeholder.jpg', alt: 'Custom Joinery' },
      ];

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-white"
    >
      {/* Main Content */}
      <div className="mx-auto max-w-[1800px] px-6 py-24 lg:px-12 lg:py-32">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Left Column - Content */}
          <motion.div style={{ y: contentY }} className="relative z-10">
            {/* Section Label */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="mb-6 flex items-center gap-4"
            >
              <div className="h-px w-12 bg-[#c9a962]" />
              <span className="font-Satoshi text-xs font-light uppercase tracking-[0.3em] text-neutral-500">
                Who We Are
              </span>
            </motion.div>

            {/* Main Headline */}
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="mb-6 font-SchnyderS text-4xl font-light tracking-tight text-neutral-950 sm:text-5xl lg:text-6xl"
            >
              Architects of
              <br />
              <span className="text-[#c9a962]">Experience</span>
            </motion.h2>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-10 space-y-4"
            >
              <p className="font-Satoshi text-lg font-light leading-relaxed text-neutral-600">
                Mouhajer International Design & Contracting (MIDC) is a premier
                turnkey solution provider based in Dubai and Abu Dhabi, transforming
                ambitious concepts into award-winning realities.
              </p>
              <p className="font-Satoshi text-base font-light leading-relaxed text-neutral-500">
                From luxury hospitality to private residences, our reputation is
                built on a seamless fusion of aesthetic mastery and engineering rigor.
              </p>
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Link
                href="/about"
                className="group inline-flex items-center gap-3 border border-neutral-950 bg-neutral-950 px-8 py-4 font-Satoshi text-xs font-light uppercase tracking-[0.15em] text-white transition-all duration-500 hover:bg-transparent hover:text-neutral-950"
              >
                Explore Our Story
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={1.5} />
              </Link>
            </motion.div>
          </motion.div>

          {/* Right Column - Image Grid */}
          <motion.div style={{ y: imageY }} className="relative">
            {/* Asymmetric Image Grid */}
            <div className="grid grid-cols-12 gap-4">
              {/* Large Image - Top Left */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="col-span-7 row-span-2"
              >
                <div className="group relative aspect-[3/4] overflow-hidden bg-neutral-100">
                  {displayImages[0]?.url && (
                    <Image
                      src={displayImages[0].url}
                      alt={displayImages[0].alt}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/40 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                </div>
              </motion.div>

              {/* Top Right Image */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="col-span-5"
              >
                <div className="group relative aspect-square overflow-hidden bg-neutral-100">
                  {displayImages[1]?.url && (
                    <Image
                      src={displayImages[1].url}
                      alt={displayImages[1].alt}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/40 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                </div>
              </motion.div>

              {/* Bottom Right Image */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="col-span-5"
              >
                <div className="group relative aspect-square overflow-hidden bg-neutral-100">
                  {displayImages[2]?.url && (
                    <Image
                      src={displayImages[2].url}
                      alt={displayImages[2].alt}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/40 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                </div>
              </motion.div>
            </div>

            {/* Decorative Element */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="absolute -bottom-6 -left-6 h-24 w-24 border border-[#c9a962]/20"
            />
          </motion.div>
        </div>
      </div>

      {/* Background Subtle Pattern */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
    </section>
  );
}
