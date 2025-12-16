'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';

// Partner logos with their actual file names from public/partners/
const partnerLogos = [
  { name: 'Sofitel', filename: 'Sofitel-JBR-Logo-2019-01_white.png', alt: 'Sofitel Luxury Hotels' },
  { name: 'Marriott', filename: 'Marriott_International.png', alt: 'Marriott International' },
  { name: 'Ritz-Carlton', filename: '1200px-RitzCarlton.svg.png', alt: 'The Ritz-Carlton' },
  { name: 'DoubleTree', filename: '1200px-DoubletreeLogo.svg.png', alt: 'DoubleTree by Hilton' },
  { name: 'Radisson Blu', filename: '2880px-Radisson_Blu_logo.svg.png', alt: 'Radisson Blu Hotels' },
  { name: 'Meydan', filename: 'meydan-logo.png', alt: 'Meydan Dubai' },
  { name: 'DMCC', filename: 'DMCC-logo.png', alt: 'DMCC Free Zone' },
  { name: 'UCC', filename: 'UCCLogo.png', alt: 'Union Trading & Contracting' },
  { name: 'The Residences', filename: 'The Residences.png', alt: 'The Residences' },
  { name: 'Partner 1', filename: 'Layer 817.png', alt: 'Partner Logo' },
  { name: 'Partner 2', filename: 'Layer 816.png', alt: 'Partner Logo' },
  { name: 'Partner 3', filename: 'Layer 811.png', alt: 'Partner Logo' },
  { name: 'Partner 4', filename: 'Layer 810.png', alt: 'Partner Logo' },
  { name: 'Partner 5', filename: 'Layer 806.png', alt: 'Partner Logo' },
  { name: 'Partner 6', filename: 'Layer 803.png', alt: 'Partner Logo' },
  { name: 'Partner 7', filename: 'Layer 801.png', alt: 'Partner Logo' },
  { name: 'Partner 8', filename: 'Layer 799.png', alt: 'Partner Logo' },
  { name: 'Partner 9', filename: 'Layer 798.png', alt: 'Partner Logo' },
  { name: 'Partner 10', filename: 'Layer 796.png', alt: 'Partner Logo' },
  { name: 'Partner 11', filename: 'Layer 793.png', alt: 'Partner Logo' },
  { name: 'Partner 12', filename: 'Layer 792.png', alt: 'Partner Logo' },
  { name: 'Partner 13', filename: 'Layer 788.png', alt: 'Partner Logo' },
  { name: 'Partner 14', filename: '4a47a0db6e60853dedfcfdf08a5ca2491574848189.png', alt: 'Partner Logo' },
  { name: 'Partner 15', filename: '8d7a350d024ed4990466536d651d4897.png', alt: 'Partner Logo' },
  { name: 'Partner 16', filename: 'unnamed (2).png', alt: 'Partner Logo' },
];

export function LogoMarquee() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  // Double the logos for seamless loop
  const doubledLogos = [...partnerLogos, ...partnerLogos];

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
                <Image
                  src={`/partners/${logo.filename}`}
                  alt={logo.alt}
                  width={160}
                  height={80}
                  className="h-full w-full object-contain brightness-0 invert opacity-50 transition-all duration-300 hover:opacity-80 hover:scale-105"
                  onError={(e) => {
                    // Fallback to text if image fails to load
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      const span = document.createElement('span');
                      span.className = 'whitespace-nowrap font-SchnyderS text-xl font-light text-white/40 transition-colors duration-300 hover:text-white/70 sm:text-2xl';
                      span.textContent = logo.name;
                      parent.appendChild(span);
                    }
                  }}
                />
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
                <Image
                  src={`/partners/${logo.filename}`}
                  alt={logo.alt}
                  width={160}
                  height={80}
                  className="h-full w-full object-contain brightness-0 invert opacity-30 transition-all duration-300 hover:opacity-60 hover:scale-105"
                  onError={(e) => {
                    // Fallback to text if image fails to load
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      const span = document.createElement('span');
                      span.className = 'whitespace-nowrap font-SchnyderS text-xl font-light text-white/30 transition-colors duration-300 hover:text-white/50 sm:text-2xl';
                      span.textContent = logo.name;
                      parent.appendChild(span);
                    }
                  }}
                />
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
