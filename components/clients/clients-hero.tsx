'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import { getAllPartners } from '@/lib/partner-logos';

interface ClientsHeroProps {
  heroImage?: string;
}

export function ClientsHero({ heroImage }: ClientsHeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true });
  const partners = getAllPartners();

  // Create floating logo rows for background animation
  const row1 = partners.slice(0, 8);
  const row2 = partners.slice(8, 16);
  const row3 = partners.slice(16, 24);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[90vh] w-full overflow-hidden bg-neutral-950"
    >
      {/* Background Image (subtle) */}
      {heroImage && (
        <div className="absolute inset-0 opacity-20">
          <img
            src={heroImage}
            alt="Background"
            className="h-full w-full object-cover"
          />
        </div>
      )}

      {/* Animated Logo Wall Background */}
      <div className="absolute inset-0 overflow-hidden opacity-[0.06]">
        {/* Row 1 - Moving Right */}
        <div className="absolute top-[10%] left-0 flex animate-marquee-slow whitespace-nowrap">
          {[...row1, ...row1, ...row1].map((partner, idx) => (
            <div key={`r1-${idx}`} className="mx-12 flex-shrink-0">
              <Image
                src={partner.logo}
                alt={partner.name}
                width={120}
                height={60}
                className="h-16 w-auto object-contain brightness-0 invert"
                unoptimized
              />
            </div>
          ))}
        </div>

        {/* Row 2 - Moving Left */}
        <div className="absolute top-[35%] left-0 flex animate-marquee-reverse-slow whitespace-nowrap">
          {[...row2, ...row2, ...row2].map((partner, idx) => (
            <div key={`r2-${idx}`} className="mx-12 flex-shrink-0">
              <Image
                src={partner.logo}
                alt={partner.name}
                width={120}
                height={60}
                className="h-16 w-auto object-contain brightness-0 invert"
                unoptimized
              />
            </div>
          ))}
        </div>

        {/* Row 3 - Moving Right (slower) */}
        <div className="absolute top-[60%] left-0 flex animate-marquee-slower whitespace-nowrap">
          {[...row3, ...row1, ...row3].map((partner, idx) => (
            <div key={`r3-${idx}`} className="mx-12 flex-shrink-0">
              <Image
                src={partner.logo}
                alt={partner.name}
                width={120}
                height={60}
                className="h-16 w-auto object-contain brightness-0 invert"
                unoptimized
              />
            </div>
          ))}
        </div>

        {/* Row 4 - Moving Left (slowest) */}
        <div className="absolute top-[85%] left-0 flex animate-marquee-reverse-slower whitespace-nowrap">
          {[...row2, ...row3, ...row2].map((partner, idx) => (
            <div key={`r4-${idx}`} className="mx-12 flex-shrink-0">
              <Image
                src={partner.logo}
                alt={partner.name}
                width={120}
                height={60}
                className="h-16 w-auto object-contain brightness-0 invert"
                unoptimized
              />
            </div>
          ))}
        </div>
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:80px_80px]" />
      </div>

      {/* Radial gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/90 via-neutral-950/70 to-neutral-950" />

      {/* Content */}
      <div className="relative z-10 mx-auto flex h-full min-h-[90vh] max-w-7xl flex-col items-center justify-center px-6 py-32 text-center lg:px-12">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-8 flex items-center gap-4"
        >
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#c9a962]/50" />
          <span className="font-Satoshi text-xs font-light uppercase tracking-[0.3em] text-[#c9a962]">
            Our Clients & Partners
          </span>
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#c9a962]/50" />
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="mb-6 font-SchnyderS text-5xl font-light tracking-tight text-white sm:text-6xl lg:text-7xl xl:text-8xl"
        >
          Trusted by the Visionaries.
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto mb-12 max-w-3xl font-Satoshi text-lg font-light leading-relaxed text-white/60 sm:text-xl lg:text-2xl"
        >
          We do not just have customers. We have enduring partnerships with the
          leaders shaping the UAE skyline.
        </motion.p>

        {/* Gold Divider */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={isInView ? { opacity: 1, scaleX: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="h-px w-32 bg-gradient-to-r from-transparent via-[#c9a962] to-transparent"
        />

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 grid grid-cols-3 gap-8 lg:gap-16"
        >
          <div className="text-center">
            <div className="font-SchnyderS text-4xl text-[#c9a962] lg:text-5xl">25+</div>
            <div className="mt-2 font-Satoshi text-xs uppercase tracking-widest text-white/40">
              Years Partnership
            </div>
          </div>
          <div className="text-center">
            <div className="font-SchnyderS text-4xl text-[#c9a962] lg:text-5xl">150+</div>
            <div className="mt-2 font-Satoshi text-xs uppercase tracking-widest text-white/40">
              Joint Projects
            </div>
          </div>
          <div className="text-center">
            <div className="font-SchnyderS text-4xl text-[#c9a962] lg:text-5xl">50+</div>
            <div className="mt-2 font-Satoshi text-xs uppercase tracking-widest text-white/40">
              Trusted Partners
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-neutral-950 to-transparent" />
    </section>
  );
}
