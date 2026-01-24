"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Shield, Award, HardHat, Lightbulb, Users } from "lucide-react";

export function CoreValuesGrid() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  // 100% VERBATIM from content.md lines 465-469
  const values = [
    {
      icon: Shield,
      title: "Integrity",
      description:
        'We operate with absolute transparency. Our "handshake is the contract."',
    },
    {
      icon: Award,
      title: "Excellence",
      description:
        'We do not accept "good enough." We aim for the exceptional.',
    },
    {
      icon: HardHat,
      title: "Safety",
      description:
        "We value human life above all. A safe site is a productive site.",
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      description: "We blend traditional craftsmanship with modern technology.",
    },
    {
      icon: Users,
      title: "Collaboration",
      description:
        "We work as one unit – Design, Build, and Engineering together.",
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-[#faf8f5] py-24 sm:py-32 lg:py-40"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0"></div>

      {/* Radial Gradient Overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 0%, rgba(201,169,98,0.02) 100%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-12">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center lg:mb-24"
        >
          <div className="mb-8 flex items-center justify-center gap-4">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#8f7852]/50" />
            <span className="font-Satoshi text-xs font-light uppercase tracking-[0.3em] text-neutral-500">
              The Pillars of Our Culture
            </span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#8f7852]/50" />
          </div>

          <h2 className="font-SchnyderS text-4xl font-light leading-[1.1] tracking-tight text-neutral-900 sm:text-5xl lg:text-6xl">
            Our
            <br />
            <span className="text-[#8f7852]">Core Values</span>
          </h2>
        </motion.div>

        {/* Values Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="group relative"
              >
                <div className="relative h-full overflow-hidden rounded-sm border border-[#8f7852]/10 bg-white/70 p-8 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:border-[#8f7852]/30 hover:bg-white/90 hover:shadow-2xl">
                  {/* Icon */}
                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-sm bg-[#8f7852]/10 transition-colors duration-300 group-hover:bg-[#8f7852]/20">
                    <Icon className="h-8 w-8 text-[#8f7852] transition-transform duration-300 group-hover:scale-110" />
                  </div>

                  {/* Title - 100% VERBATIM */}
                  <h3 className="mb-4 font-SchnyderS text-2xl font-light text-neutral-900">
                    {value.title}
                  </h3>

                  {/* Description - 100% VERBATIM */}
                  <p className="font-Satoshi text-sm font-light leading-relaxed text-neutral-600">
                    {value.description}
                  </p>

                  {/* Decorative Corner */}
                  <div className="absolute right-4 top-4 h-8 w-8 border-r border-t border-[#8f7852]/20 transition-colors duration-300 group-hover:border-[#8f7852]/50" />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 text-center lg:mt-24"
        >
          <p className="mb-8 font-Satoshi text-lg font-light italic text-neutral-600">
            These values guide every project we undertake and every relationship
            we build.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 border border-[#8f7852] bg-[#8f7852] px-8 py-4 font-Satoshi text-sm font-medium uppercase tracking-wider text-white transition-all duration-300 hover:bg-[#8f7852]/90 hover:shadow-lg hover:shadow-[#8f7852]/20"
          >
            Work With Us
            <svg
              className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
