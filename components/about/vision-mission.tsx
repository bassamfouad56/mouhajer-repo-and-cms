"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Eye, Target, Heart, Sparkles } from "lucide-react";

const pillars = [
  {
    id: "vision",
    icon: Eye,
    title: "Vision",
    content:
      "At Mouhajer International Design and Contracting, we are committed to building a better future for our clients, our community and our planet. We believe that construction is not only a technical process, but also a creative one, where we can transform ideas into reality. Our vision is to be the leading construction company in the region, delivering innovative, sustainable and high-quality solutions for every project.",
  },
  {
    id: "mission",
    icon: Target,
    title: "Mission",
    content:
      "Our mission at MIDC is to provide high-quality construction services that meet the needs and expectations of our clients. We are committed to delivering projects on time, within budget, and with the highest standards of safety and quality. We believe that our mission is not only to build structures, but also to build trust and long-term partnerships.",
  },
  {
    id: "commitment",
    icon: Heart,
    title: "Commitment",
    content:
      "Our Commitment is a leading provider of high-quality and cost-effective building solutions in the MENA region. We have over two decades of experience in delivering projects across various sectors. We are committed to meeting the needs and expectations of our clients and partners, while adhering to the highest standards of safety, quality, and sustainability.",
  },
];

export function VisionMission() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-[#faf8f5] py-24 sm:py-32 lg:py-40"
    >
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#faf8f5] via-white to-[#faf8f5]" />

        {/* Radial glows */}
        <div className="absolute left-0 top-1/4 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-[#8f7852]/[0.02] blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-[500px] w-[500px] translate-x-1/3 rounded-full bg-white/[0.02] blur-[100px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-12">
        {/* Section Header */}
        <div className="mb-20 text-center lg:mb-28">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="mb-6 flex items-center justify-center gap-4"
          >
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#8f7852]/50" />
            <Sparkles className="h-4 w-4 text-[#8f7852]/60" />
            <span className="font-Satoshi text-xs font-light uppercase tracking-[0.3em] text-neutral-500">
              Our Foundation
            </span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#8f7852]/50" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mb-6 font-SchnyderS text-4xl font-light tracking-tight text-neutral-900 sm:text-5xl lg:text-6xl"
          >
            The MIDC Legacy
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto max-w-2xl font-Satoshi text-base font-light text-neutral-600 lg:text-lg"
          >
            Founded in 1999, Mouhajer International Design & Contracting
            didn&apos;t just appear on the landscape; we grew with the UAE.
          </motion.p>
        </div>

        {/* Pillars Grid */}
        <div className="grid gap-8 lg:grid-cols-3">
          {pillars.map((pillar, index) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={pillar.id}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.3 + index * 0.15 }}
                className="group relative"
              >
                <div className="relative overflow-hidden border border-[#8f7852]/10 bg-white/70 p-8 backdrop-blur-sm transition-all duration-500 hover:border-[#8f7852]/30 hover:bg-white/90 lg:p-10">
                  {/* Icon */}
                  <div className="mb-8">
                    <div className="inline-flex h-16 w-16 items-center justify-center border border-[#8f7852]/30 bg-[#8f7852]/5 transition-all duration-300 group-hover:border-[#8f7852]/50 group-hover:bg-[#8f7852]/10">
                      <Icon
                        className="h-7 w-7 text-[#8f7852]"
                        strokeWidth={1}
                      />
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="mb-6 font-SchnyderS text-3xl font-light text-neutral-900 transition-colors group-hover:text-[#8f7852]">
                    {pillar.title}
                  </h3>

                  {/* Content */}
                  <p className="font-Satoshi text-sm font-light leading-relaxed text-neutral-600 lg:text-base">
                    {pillar.content}
                  </p>

                  {/* Corner accents */}
                  <div className="absolute bottom-0 left-0 h-16 w-16 border-b border-l border-[#8f7852]/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="absolute right-0 top-0 h-16 w-16 border-r border-t border-[#8f7852]/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Quote */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-20 text-center lg:mt-28"
        >
          <div className="mx-auto max-w-3xl border-t border-[#8f7852]/20 pt-12">
            <p className="font-SchnyderS text-xl font-light italic text-neutral-600 lg:text-2xl">
              &ldquo;We spent our first two decades mastering the art of the
              private luxury villa and corporate fit-outs, building a quiet but
              powerful reputation among the UAE&apos;s elite. By the time we
              expanded into major hospitality renovations in 2020, we
              weren&apos;t just new entrants; we were veterans ready to
              scale.&rdquo;
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
