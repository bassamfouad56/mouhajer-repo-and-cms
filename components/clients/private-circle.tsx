"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Crown, Lock, MapPin, Shield } from "lucide-react";

interface SanityClient {
  _id: string;
  name: string;
  projectsText?: string;
  icon?: string;
}

interface PrivateCircleProps {
  clients?: SanityClient[];
}

// Fallback exclusive locations if no Sanity data
const defaultExclusiveLocations = [
  {
    name: "Jumeirah Bay",
    subtitle: "Bulgari Island",
    icon: Crown,
  },
  {
    name: "District One",
    subtitle: "MBR City",
    icon: Crown,
  },
  {
    name: "Palm Jumeirah",
    subtitle: "The Fronds",
    icon: Crown,
  },
  {
    name: "Emirates Hills",
    subtitle: "The Beverly Hills of Dubai",
    icon: Crown,
  },
];

const vipFeatures = [
  {
    icon: Lock,
    title: "Absolute Discretion",
    description:
      "NDAs signed. No names disclosed. Your privacy is our priority.",
  },
  {
    icon: Shield,
    title: "White-Glove Service",
    description:
      "Personal oversight by Eng. Maher on every high-net-worth project.",
  },
  {
    icon: MapPin,
    title: "Elite Addresses",
    description:
      "We build in the most exclusive residential developments in the UAE.",
  },
];

export function PrivateCircle({ clients = [] }: PrivateCircleProps) {
  // Transform Sanity clients or use defaults
  const exclusiveLocations =
    clients.length > 0
      ? clients.map((client) => ({
          name: client.name,
          subtitle: client.projectsText || "",
          icon: Crown,
        }))
      : defaultExclusiveLocations;
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-neutral-950 py-24 sm:py-32 lg:py-40"
    >
      {/* Background */}
      <div className="absolute inset-0">
        {/* Subtle Grid */}
        {/* Glow Effect */}
        <div className="absolute right-1/4 top-1/2 h-[800px] w-[800px] -translate-y-1/2 rounded-full bg-[#8f7852]/[0.02] blur-[150px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-12">
        {/* Header */}
        <div className="mb-16 lg:mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="mb-6 flex items-center gap-4"
          >
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-white/30" />
            <span className="font-Satoshi text-xs font-light uppercase tracking-[0.3em] text-white/40">
              Confidential
            </span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-white/30" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mb-6 font-SchnyderS text-4xl font-light tracking-tight text-white sm:text-5xl lg:text-6xl"
          >
            The Private Circle
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-3xl font-Satoshi text-lg font-light leading-relaxed text-white/60 lg:text-xl"
          >
            <span className="font-SchnyderS text-2xl text-[#8f7852]">
              The Unnamed Elite.
            </span>
            <br />
            <br />A significant portion of Eng. Maher&apos;s work is for
            high-net-worth individuals who value their privacy above all else.
            While we cannot list their names, we can list where they live.
          </motion.p>
        </div>

        {/* VIP Features */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mb-16 grid gap-6 sm:grid-cols-3 lg:mb-24 lg:gap-8"
        >
          {vipFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group relative overflow-hidden border border-white/5 bg-white/[0.02] p-8 backdrop-blur-sm transition-all duration-500 hover:border-[#8f7852]/30 hover:bg-white/[0.05]"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center border border-[#8f7852]/30 bg-[#8f7852]/5">
                  <Icon className="h-6 w-6 text-[#8f7852]" strokeWidth={1.5} />
                </div>
                <h3 className="mb-3 font-Satoshi text-base font-medium text-white lg:text-lg">
                  {feature.title}
                </h3>
                <p className="font-Satoshi text-sm font-light leading-relaxed text-white/50">
                  {feature.description}
                </p>
                {/* Accent Line */}
                <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-[#8f7852] to-transparent transition-all duration-500 group-hover:w-full" />
              </div>
            );
          })}
        </motion.div>

        {/* Statement Box */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-16 border border-[#8f7852]/20 bg-gradient-to-br from-[#8f7852]/5 to-transparent p-8 backdrop-blur-sm lg:mb-24 lg:p-12"
        >
          <p className="mb-6 font-Satoshi text-lg font-light leading-relaxed text-white/80 lg:text-xl">
            We are the contractor of choice for private palaces and villas in
            the UAE&apos;s most exclusive addresses:
          </p>
        </motion.div>

        {/* Exclusive Locations Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {exclusiveLocations.map((location, index) => {
            const Icon = location.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.5 + index * 0.1 }}
                className="group relative overflow-hidden border border-white/10 bg-white/[0.03] p-8 backdrop-blur-sm transition-all duration-500 hover:border-[#8f7852]/40 hover:bg-white/[0.06]"
              >
                {/* Icon */}
                <div className="mb-6 flex h-14 w-14 items-center justify-center border border-[#8f7852]/30 bg-[#8f7852]/5 transition-all duration-300 group-hover:border-[#8f7852]/50 group-hover:bg-[#8f7852]/10">
                  <Icon className="h-7 w-7 text-[#8f7852]" strokeWidth={1} />
                </div>

                {/* Location Name */}
                <h3 className="mb-2 font-SchnyderS text-xl font-light text-white transition-colors group-hover:text-[#8f7852] lg:text-2xl">
                  {location.name}
                </h3>

                {/* Subtitle */}
                <p className="font-Satoshi text-sm font-light text-white/40">
                  {location.subtitle}
                </p>

                {/* Corner Accents */}
                <div className="absolute right-0 top-0 h-12 w-12 border-r border-t border-white/5 transition-colors duration-300 group-hover:border-[#8f7852]/20" />
                <div className="absolute bottom-0 left-0 h-12 w-12 border-b border-l border-white/5 transition-colors duration-300 group-hover:border-[#8f7852]/20" />
              </motion.div>
            );
          })}
        </div>

        {/* Closing Statement */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="mt-16 text-center lg:mt-24"
        >
          <div className="mx-auto max-w-2xl border-t border-white/10 pt-8">
            <p className="font-Satoshi text-base font-light italic leading-relaxed text-white/50 lg:text-lg">
              &quot;Our most discerning clients choose us not for what we say,
              but for what we never will say.&quot;
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
