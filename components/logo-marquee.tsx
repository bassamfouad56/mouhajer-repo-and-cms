"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { SafeImage } from "@/components/safe-image";
import { urlForImage } from "@/sanity/lib/image";

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
function getLogoUrl(logo: SanityClient["logo"]): string {
  if (!logo?.asset) return "";
  try {
    return urlForImage(logo).width(200).height(100).url();
  } catch {
    return "";
  }
}

export function LogoMarquee({ clients = [] }: LogoMarqueeProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  // Filter out confidential clients and those without logos
  const visibleClients = clients.filter(
    (c) => !c.isConfidential && c.logo?.asset,
  );

  // Transform Sanity clients to logo format
  const clientLogos = visibleClients.map((client) => ({
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
      className="relative overflow-hidden bg-[#f8f6f3] py-16 sm:py-20"
    >
      {/* Subtle grid background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundSize: "60px 60px",
        }}
      />

      {/* Border lines with gold accent */}
      <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-[#8f7852]/30 to-transparent" />
      <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-[#8f7852]/30 to-transparent" />

      {/* Label */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="mb-10 flex items-center justify-center gap-4 sm:mb-12"
      >
        <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#8f7852]/60" />
        <span className="font-Satoshi text-xs font-light uppercase tracking-[0.3em] text-[#3d3a36]/60">
          Trusted By Industry Leaders
        </span>
        <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#8f7852]/60" />
      </motion.div>

      {/* Marquee container */}
      <div className="relative">
        {/* Fade edges */}
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-32 bg-gradient-to-r from-[#f8f6f3] to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-32 bg-gradient-to-l from-[#f8f6f3] to-transparent" />

        {/* Scrolling logos - Row 1 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex"
        >
          <motion.div
            className="flex items-center gap-16 sm:gap-20"
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              x: {
                duration: 40,
                repeat: Infinity,
                ease: "linear",
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
                    className="h-full w-full object-contain opacity-60 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0 hover:scale-105"
                  />
                ) : (
                  <span className="whitespace-nowrap font-SchnyderS text-xl font-light text-[#3d3a36]/40 transition-colors duration-300 hover:text-[#3d3a36]/70 sm:text-2xl">
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
            animate={{ x: ["-50%", "0%"] }}
            transition={{
              x: {
                duration: 35,
                repeat: Infinity,
                ease: "linear",
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
                    className="h-full w-full object-contain opacity-40 grayscale transition-all duration-300 hover:opacity-80 hover:grayscale-0 hover:scale-105"
                  />
                ) : (
                  <span className="whitespace-nowrap font-SchnyderS text-xl font-light text-[#3d3a36]/30 transition-colors duration-300 hover:text-[#3d3a36]/50 sm:text-2xl">
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
