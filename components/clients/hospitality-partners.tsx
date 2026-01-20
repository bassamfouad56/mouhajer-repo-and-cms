"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Hotel, Coffee, Sparkles, Clock } from "lucide-react";

interface SanityClient {
  _id: string;
  name: string;
  projectsText?: string;
  icon?: string;
}

interface HospitalityPartnersProps {
  clients?: SanityClient[];
}

// Fallback partners if no Sanity data
const defaultPartners = [
  {
    name: "Abu Dhabi National Hotels (ADNH)",
    projects: "Sheraton, Radisson Blu",
    icon: Hotel,
  },
  {
    name: "Wasl Asset Management",
    projects: "Park Hyatt, Emirates Golf Club",
    icon: Sparkles,
  },
  {
    name: "Emaar Hospitality",
    projects: "Address Boulevard, Address Dubai Marina",
    icon: Hotel,
  },
  {
    name: "Hyatt Hotels Corporation",
    projects: "Grand Hyatt Royal Suites",
    icon: Coffee,
  },
  {
    name: "The Ritz-Carlton",
    projects: "Abu Dhabi Grand Canal Villas",
    icon: Sparkles,
  },
  {
    name: "Dusit Thani",
    projects: "Dubai Renovation",
    icon: Hotel,
  },
];

const iconMap: Record<string, typeof Hotel> = {
  hotel: Hotel,
  coffee: Coffee,
  sparkles: Sparkles,
  clock: Clock,
};

const capabilities = [
  {
    icon: Clock,
    title: "Live Environment Expertise",
    description:
      "We work within operational hotels without disrupting guest experience",
  },
  {
    icon: Sparkles,
    title: "Absolute Perfection",
    description:
      "Zero tolerance for imperfections in high-visibility hospitality spaces",
  },
  {
    icon: Hotel,
    title: "Speed & Silence",
    description: "Fast-track delivery with minimal noise and disruption",
  },
];

export function HospitalityPartners({
  clients = [],
}: HospitalityPartnersProps) {
  // Transform Sanity clients or use defaults
  const partners =
    clients.length > 0
      ? clients.map((client, idx) => ({
          name: client.name,
          projects: client.projectsText || "",
          icon: client.icon
            ? iconMap[client.icon.toLowerCase()] || Hotel
            : [Hotel, Sparkles, Coffee][idx % 3],
        }))
      : defaultPartners;
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-neutral-950 py-24 sm:py-32 lg:py-40"
    >
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute left-1/3 top-1/4 h-[700px] w-[700px] rounded-full bg-[#c9a962]/[0.02] blur-[150px]" />
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
              Hospitality
            </span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-white/30" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mb-6 font-SchnyderS text-4xl font-light tracking-tight text-white sm:text-5xl lg:text-6xl"
          >
            Our Hospitality Partners
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-3xl font-Satoshi text-lg font-light leading-relaxed text-white/60 lg:text-xl"
          >
            <span className="font-SchnyderS text-2xl text-[#c9a962]">
              The Giants of Tourism.
            </span>
            <br />
            <br />
            We work within live environments for the world&apos;s most
            prestigious hotel operators. We understand the need for silence,
            speed, and absolute perfection.
          </motion.p>
        </div>

        {/* Capabilities Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mb-16 grid gap-6 sm:grid-cols-3 lg:mb-24 lg:gap-8"
        >
          {capabilities.map((capability, index) => {
            const Icon = capability.icon;
            return (
              <div
                key={index}
                className="group relative overflow-hidden border border-white/5 bg-white/[0.02] p-6 backdrop-blur-sm transition-all duration-500 hover:border-[#c9a962]/30 hover:bg-white/[0.05] lg:p-8"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center border border-[#c9a962]/30 bg-[#c9a962]/5">
                  <Icon className="h-6 w-6 text-[#c9a962]" strokeWidth={1.5} />
                </div>
                <h3 className="mb-3 font-Satoshi text-base font-medium text-white lg:text-lg">
                  {capability.title}
                </h3>
                <p className="font-Satoshi text-sm font-light leading-relaxed text-white/50">
                  {capability.description}
                </p>
                {/* Accent */}
                <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-[#c9a962] to-transparent transition-all duration-500 group-hover:w-full" />
              </div>
            );
          })}
        </motion.div>

        {/* Partners Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {partners.map((partner, index) => {
            const Icon = partner.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.4 + index * 0.1 }}
                className="group relative overflow-hidden border border-white/10 bg-white/[0.03] p-8 backdrop-blur-sm transition-all duration-500 hover:border-[#c9a962]/40 hover:bg-white/[0.06]"
              >
                {/* Icon */}
                <div className="mb-6 flex h-14 w-14 items-center justify-center border border-[#c9a962]/30 bg-[#c9a962]/5 transition-all duration-300 group-hover:border-[#c9a962]/50 group-hover:bg-[#c9a962]/10">
                  <Icon className="h-7 w-7 text-[#c9a962]" strokeWidth={1} />
                </div>

                {/* Partner Name */}
                <h3 className="mb-3 font-SchnyderS text-xl font-light text-white transition-colors group-hover:text-[#c9a962] lg:text-2xl">
                  {partner.name}
                </h3>

                {/* Projects */}
                <p className="font-Satoshi text-sm font-light text-white/40">
                  {partner.projects}
                </p>

                {/* Corner Accents */}
                <div className="absolute right-0 top-0 h-12 w-12 border-r border-t border-white/5 transition-colors duration-300 group-hover:border-[#c9a962]/20" />
                <div className="absolute bottom-0 left-0 h-12 w-12 border-b border-l border-white/5 transition-colors duration-300 group-hover:border-[#c9a962]/20" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
