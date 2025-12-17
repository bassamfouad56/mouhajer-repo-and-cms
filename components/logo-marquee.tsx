'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { SafeImage } from '@/components/safe-image';
import { urlForImage } from '@/sanity/lib/image';

// Types for Sanity client data
interface SanityClient {
  _id: string;
  name: string;
  logo?: {
    asset?: {
      _ref?: string;
    };
  };
  category?: string;
  featured?: boolean;
  isConfidential?: boolean;
}

interface LogoMarqueeProps {
  clients?: SanityClient[];
}

// Helper to get logo URL from Sanity
function getLogoUrl(logo: SanityClient['logo']): string {
  if (!logo?.asset) return '';
  try {
    return urlForImage(logo).width(200).height(100).url();
  } catch {
    return '';
  }
}

export function LogoMarquee({ clients = [] }: LogoMarqueeProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  // Filter out confidential clients and those without logos
  const visibleClients = clients.filter(c => !c.isConfidential && c.logo?.asset);

  // Transform Sanity clients to logo format
  const clientLogos = visibleClients.map(client => ({
    name: client.name,
    logoUrl: getLogoUrl(client.logo),
    alt: client.name,
  }));

  // Double the logos for seamless loop
  const doubledLogos = [...clientLogos, ...clientLogos];

  // If no clients from Sanity, don't render
  if (clientLogos.length === 0) {
    return null;
  }

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-neutral-950 py-16 sm:py-20"
    >
      {/* Subtle grid background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Border lines with gold accent */}
      <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-[#d4af37]/20 to-transparent" />
      <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-[#d4af37]/20 to-transparent" />

      {/* Label */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="mb-10 flex items-center justify-center gap-4 sm:mb-12"
      >
        <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#d4af37]/50" />
        <span className="font-Satoshi text-xs font-light uppercase tracking-[0.3em] text-white/40">
          Trusted By Industry Leaders
        </span>
        <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#d4af37]/50" />
      </motion.div>

      {/* Marquee container */}
      <div className="relative">
        {/* Fade edges */}
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-32 bg-gradient-to-r from-neutral-950 to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-32 bg-gradient-to-l from-neutral-950 to-transparent" />

        {/* Scrolling logos - Row 1 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex"
        >
          <motion.div
            className="flex items-center gap-16 sm:gap-20"
            animate={{ x: ['0%', '-50%'] }}
            transition={{
              x: {
                duration: 40,
                repeat: Infinity,
                ease: 'linear',
              },
            }}
          >
            {doubledLogos.map((logo, index) => (
              <div
                key={`${logo.name}-${index}`}
                className="relative flex h-16 w-32 shrink-0 items-center justify-center sm:h-20 sm:w-40"
              >
                {logo.logoUrl ? (
                  <SafeImage
                    src={logo.logoUrl}
                    alt={logo.alt}
                    width={160}
                    height={80}
                    className="h-full w-full object-contain brightness-0 invert opacity-50 transition-all duration-300 hover:opacity-80 hover:scale-105"
                  />
                ) : (
                  <span className="whitespace-nowrap font-SchnyderS text-xl font-light text-white/40 transition-colors duration-300 hover:text-white/70 sm:text-2xl">
                    {logo.name}
                  </span>
                )}
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scrolling logos - Row 2 (opposite direction) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8 flex"
        >
          <motion.div
            className="flex items-center gap-16 sm:gap-20"
            animate={{ x: ['-50%', '0%'] }}
            transition={{
              x: {
                duration: 35,
                repeat: Infinity,
                ease: 'linear',
              },
            }}
          >
            {[...doubledLogos].reverse().map((logo, index) => (
              <div
                key={`${logo.name}-reverse-${index}`}
                className="relative flex h-16 w-32 shrink-0 items-center justify-center sm:h-20 sm:w-40"
              >
                {logo.logoUrl ? (
                  <SafeImage
                    src={logo.logoUrl}
                    alt={logo.alt}
                    width={160}
                    height={80}
                    className="h-full w-full object-contain brightness-0 invert opacity-30 transition-all duration-300 hover:opacity-60 hover:scale-105"
                  />
                ) : (
                  <span className="whitespace-nowrap font-SchnyderS text-xl font-light text-white/30 transition-colors duration-300 hover:text-white/50 sm:text-2xl">
                    {logo.name}
                  </span>
                )}
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
