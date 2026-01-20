"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Building2,
  Home,
  Sparkles,
  Check,
} from "lucide-react";
import Link from "next/link";
import { SafeImage } from "@/components/safe-image";

interface MouhajerPromiseProps {
  images?: {
    landOwners: string;
    propertyOwners: string;
  };
}

export function MouhajerPromise({ images }: MouhajerPromiseProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const headerInView = useInView(headerRef, { once: true, margin: "-50px" });
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  // Scroll-based parallax
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);

  const DEFAULT_FALLBACK = "/placeholder.jpg";

  const cards = [
    {
      id: "land-owners",
      icon: Building2,
      label: "From Ground Zero",
      title: "Land Owners",
      subtitle: "Build Your Vision",
      description:
        "You see potential in the sand. We have the engineering license to turn that empty plot into a structural masterpiece — from foundation to finishing.",
      features: [
        "Complete site analysis & feasibility",
        "Structural engineering & permits",
        "Full construction execution",
        "Premium finishing & handover",
      ],
      image: images?.landOwners || DEFAULT_FALLBACK,
      cta: "Explore Construction Services",
      href: "/services/civil-construction",
      stats: { label: "Projects Built", value: "200+" },
    },
    {
      id: "property-owners",
      icon: Home,
      label: "Renaissance & Rebirth",
      title: "Property Owners",
      subtitle: "Transform Your Space",
      description:
        "You own a villa or hotel that needs a rebirth. We transform dated structures into modern assets that command attention and deliver returns.",
      features: [
        "Comprehensive property assessment",
        "Bespoke interior design",
        "Complete renovation execution",
        "Value-adding transformation",
      ],
      image: images?.propertyOwners || DEFAULT_FALLBACK,
      cta: "Explore Renovation Services",
      href: "/services/interior-architecture",
      stats: { label: "Spaces Transformed", value: "500+" },
    },
  ];

  return (
    <section
      ref={sectionRef}
      id="promise"
      className="relative overflow-hidden bg-[#faf8f5]"
    >
      {/* Hero Header Section */}
      <div ref={headerRef} className="relative py-24 lg:py-32">
        {/* Background Pattern */}
        <motion.div
          className="pointer-events-none absolute inset-0"
          style={{ y: backgroundY }}
        >
          <div className="absolute inset-0 opacity-[0.02]">
            <div
              className="h-full w-full"
              style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, #c9a962 1px, transparent 0)`,
                backgroundSize: "40px 40px",
              }}
            />
          </div>
        </motion.div>

        <div className="relative mx-auto max-w-7xl px-6 lg:px-12">
          {/* Section Header - Cinematic */}
          <div className="mb-20 lg:mb-28">
            {/* Animated Label */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={headerInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="mb-8 flex items-center justify-center gap-4"
            >
              <motion.div
                className="h-px w-16 bg-gradient-to-r from-transparent to-[#c9a962]"
                initial={{ scaleX: 0, originX: 0 }}
                animate={headerInView ? { scaleX: 1 } : {}}
                transition={{ duration: 1, delay: 0.3 }}
              />
              <div className="flex items-center gap-2">
                <Sparkles
                  className="h-3.5 w-3.5 text-[#c9a962]"
                  strokeWidth={1.5}
                />
                <span className="font-Satoshi text-[10px] font-medium uppercase tracking-[0.4em] text-[#c9a962]">
                  The Mouhajer Promise
                </span>
              </div>
              <motion.div
                className="h-px w-16 bg-gradient-to-l from-transparent to-[#c9a962]"
                initial={{ scaleX: 0, originX: 1 }}
                animate={headerInView ? { scaleX: 1 } : {}}
                transition={{ duration: 1, delay: 0.3 }}
              />
            </motion.div>

            {/* Main Title with staggered reveal */}
            <div className="text-center">
              <motion.h2
                initial={{ opacity: 0, y: 50 }}
                animate={headerInView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 1,
                  delay: 0.2,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="mb-6 font-SchnyderS text-4xl font-light tracking-tight text-neutral-900 sm:text-5xl md:text-6xl lg:text-7xl"
              >
                The Architect of
                <br />
                <motion.span
                  className="text-[#c9a962]"
                  initial={{ opacity: 0 }}
                  animate={headerInView ? { opacity: 1 } : {}}
                  transition={{ duration: 1, delay: 0.5 }}
                >
                  Assets & Sanctuaries
                </motion.span>
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={headerInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="mx-auto max-w-2xl font-Satoshi text-lg font-light leading-relaxed text-neutral-500 lg:text-xl"
              >
                Two categories of clients.{" "}
                <span className="font-medium text-neutral-800">
                  One unwavering demand: Perfection.
                </span>
              </motion.p>
            </div>
          </div>
        </div>
      </div>

      {/* Cards Section - Full Width Side by Side */}
      <div className="relative mt-12 lg:mt-20">
        {/* Desktop: Side by Side Full Height Cards */}
        <div className="hidden lg:block">
          <div className="flex min-h-[700px]">
            {cards.map((card, index) => {
              const isHovered = hoveredCard === card.id;
              const Icon = card.icon;

              return (
                <motion.div
                  key={card.id}
                  className="relative flex-1"
                  initial={{ opacity: 0, x: index === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: index * 0.2 }}
                  onMouseEnter={() => setHoveredCard(card.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <Link href={card.href} className="group block h-full">
                    <div className="relative h-full overflow-hidden">
                      {/* Background Image */}
                      <motion.div
                        className="absolute inset-0"
                        animate={{
                          scale: isHovered ? 1.08 : 1,
                        }}
                        transition={{
                          duration: 1.2,
                          ease: [0.25, 0.1, 0.25, 1],
                        }}
                      >
                        <SafeImage
                          src={card.image}
                          alt={card.title}
                          fill
                          className="object-cover"
                        />
                      </motion.div>

                      {/* Gradient Overlays */}
                      <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-neutral-950/50 to-neutral-950/30" />
                      <motion.div
                        className="absolute inset-0 bg-neutral-950/20"
                        animate={{ opacity: isHovered ? 0 : 1 }}
                        transition={{ duration: 0.5 }}
                      />

                      {/* Animated Light Sweep */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
                        initial={{ x: "-100%" }}
                        animate={isHovered ? { x: "100%" } : { x: "-100%" }}
                        transition={{ duration: 0.8, ease: "easeInOut" }}
                      />

                      {/* Content */}
                      <div className="relative flex h-full flex-col justify-between p-10 xl:p-14">
                        {/* Top Section */}
                        <div>
                          {/* Icon */}
                          <motion.div
                            className="mb-6 inline-flex h-16 w-16 items-center justify-center border border-white/20 bg-white/10 backdrop-blur-sm"
                            whileHover={{
                              scale: 1.05,
                              borderColor: "rgba(201, 169, 98, 0.5)",
                            }}
                            transition={{ duration: 0.3 }}
                          >
                            <Icon
                              className="h-7 w-7 text-white"
                              strokeWidth={1}
                            />
                          </motion.div>

                          {/* Label */}
                          <motion.span
                            className="mb-3 block font-Satoshi text-[10px] font-medium uppercase tracking-[0.3em] text-[#c9a962]"
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{
                              duration: 0.6,
                              delay: 0.3 + index * 0.1,
                            }}
                          >
                            {card.label}
                          </motion.span>

                          {/* Title */}
                          <motion.h3
                            className="mb-2 font-SchnyderS text-4xl font-light text-white xl:text-5xl"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{
                              duration: 0.8,
                              delay: 0.4 + index * 0.1,
                            }}
                          >
                            {card.title}
                          </motion.h3>

                          {/* Subtitle */}
                          <motion.p
                            className="font-Satoshi text-lg font-light text-white/60"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{
                              duration: 0.6,
                              delay: 0.5 + index * 0.1,
                            }}
                          >
                            {card.subtitle}
                          </motion.p>
                        </div>

                        {/* Bottom Section */}
                        <div>
                          {/* Description */}
                          <motion.p
                            className="mb-8 max-w-md font-Satoshi text-base font-light leading-relaxed text-white/70"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{
                              duration: 0.6,
                              delay: 0.5 + index * 0.1,
                            }}
                          >
                            {card.description}
                          </motion.p>

                          {/* Features List */}
                          <motion.div
                            className="mb-10 space-y-3"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{
                              duration: 0.6,
                              delay: 0.6 + index * 0.1,
                            }}
                          >
                            {card.features.map((feature, i) => (
                              <motion.div
                                key={feature}
                                className="flex items-center gap-3"
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{
                                  duration: 0.4,
                                  delay: 0.6 + i * 0.1,
                                }}
                              >
                                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#c9a962]/20">
                                  <Check
                                    className="h-3 w-3 text-[#c9a962]"
                                    strokeWidth={2}
                                  />
                                </div>
                                <span className="font-Satoshi text-sm font-light text-white/60">
                                  {feature}
                                </span>
                              </motion.div>
                            ))}
                          </motion.div>

                          {/* CTA Row */}
                          <div className="flex items-center justify-between">
                            {/* Stats */}
                            <div>
                              <div className="font-SchnyderS text-3xl font-light text-white">
                                {card.stats.value}
                              </div>
                              <div className="font-Satoshi text-[10px] uppercase tracking-[0.2em] text-white/40">
                                {card.stats.label}
                              </div>
                            </div>

                            {/* CTA Button */}
                            <motion.div
                              className="flex items-center gap-3"
                              whileHover={{ x: 5 }}
                              transition={{ duration: 0.3 }}
                            >
                              <span className="font-Satoshi text-sm font-light tracking-wide text-white/80 transition-colors group-hover:text-[#c9a962]">
                                {card.cta}
                              </span>
                              <motion.div
                                className="flex h-11 w-11 items-center justify-center border border-white/20 transition-all duration-300 group-hover:border-[#c9a962] group-hover:bg-[#c9a962]"
                                whileHover={{ scale: 1.1 }}
                              >
                                <ArrowUpRight
                                  className="h-4 w-4 text-white transition-colors group-hover:text-neutral-950"
                                  strokeWidth={1.5}
                                />
                              </motion.div>
                            </motion.div>
                          </div>
                        </div>
                      </div>

                      {/* Accent Line at Bottom */}
                      <motion.div
                        className="absolute bottom-0 left-0 h-1 bg-[#c9a962]"
                        initial={{ width: 0 }}
                        animate={{ width: isHovered ? "100%" : "0%" }}
                        transition={{ duration: 0.5 }}
                      />

                      {/* Corner Frame */}
                      <div className="absolute right-8 top-8 h-16 w-16">
                        <div className="absolute right-0 top-0 h-8 w-px bg-white/20" />
                        <div className="absolute right-0 top-0 h-px w-8 bg-white/20" />
                      </div>
                    </div>
                  </Link>

                  {/* Divider between cards */}
                  {index === 0 && (
                    <div className="absolute right-0 top-1/2 z-10 h-2/3 w-px -translate-y-1/2 bg-white/10" />
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Mobile: Stacked Cards */}
        <div className="space-y-6 px-4 pb-16 lg:hidden">
          {cards.map((card, index) => {
            const Icon = card.icon;

            return (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8, delay: index * 0.15 }}
              >
                <Link href={card.href} className="group block">
                  <div className="relative overflow-hidden border border-neutral-200 bg-white">
                    {/* Image */}
                    <div className="relative h-56 overflow-hidden sm:h-64">
                      <SafeImage
                        src={card.image}
                        alt={card.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-neutral-950/40 to-transparent" />

                      {/* Icon Badge */}
                      <div className="absolute left-5 top-5">
                        <div className="flex h-12 w-12 items-center justify-center border border-white/20 bg-white/10 backdrop-blur-sm">
                          <Icon
                            className="h-5 w-5 text-white"
                            strokeWidth={1.5}
                          />
                        </div>
                      </div>

                      {/* Title on Image */}
                      <div className="absolute bottom-5 left-5 right-5">
                        <span className="mb-2 block font-Satoshi text-[9px] font-medium uppercase tracking-[0.3em] text-[#c9a962]">
                          {card.label}
                        </span>
                        <h3 className="font-SchnyderS text-2xl font-light text-white sm:text-3xl">
                          {card.title}
                        </h3>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 sm:p-6">
                      <p className="mb-5 font-Satoshi text-sm font-light leading-relaxed text-neutral-600">
                        {card.description}
                      </p>

                      {/* Features - Compact */}
                      <div className="mb-6 grid grid-cols-2 gap-2">
                        {card.features.slice(0, 4).map((feature) => (
                          <div
                            key={feature}
                            className="flex items-center gap-2"
                          >
                            <div className="h-1 w-1 rounded-full bg-[#c9a962]" />
                            <span className="font-Satoshi text-xs text-neutral-500">
                              {feature.split(" ").slice(0, 2).join(" ")}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* CTA */}
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-SchnyderS text-xl font-light text-neutral-900">
                            {card.stats.value}
                          </div>
                          <div className="font-Satoshi text-[9px] uppercase tracking-[0.15em] text-neutral-400">
                            {card.stats.label}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="font-Satoshi text-xs font-medium text-neutral-700 transition-colors group-hover:text-[#c9a962]">
                            Explore
                          </span>
                          <div className="flex h-8 w-8 items-center justify-center border border-neutral-200 transition-all group-hover:border-[#c9a962] group-hover:bg-[#c9a962]">
                            <ArrowRight
                              className="h-3.5 w-3.5 text-neutral-600 transition-colors group-hover:text-white"
                              strokeWidth={1.5}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Gold accent line */}
                    <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-[#c9a962] transition-all duration-500 group-hover:w-full" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Bottom Badge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="bg-[#faf8f5] py-12 text-center lg:py-16"
      >
        <div className="inline-flex items-center gap-3 border border-neutral-200 bg-white px-6 py-3 shadow-sm">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#c9a962]/10">
            <Sparkles className="h-4 w-4 text-[#c9a962]" strokeWidth={1.5} />
          </div>
          <span className="font-Satoshi text-sm text-neutral-600">
            We are a{" "}
            <span className="font-medium text-[#c9a962]">
              Grade-A Licensed Construction Company
            </span>
          </span>
        </div>
      </motion.div>

      {/* Bottom Border */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-[#c9a962]/20 to-transparent" />
    </section>
  );
}
