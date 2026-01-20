"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import Image from "next/image";
import { SafeImage } from "@/components/safe-image";

const pressLogos = [
  { name: "Arabian Business", logo: "/press/arabian-business.svg" },
  { name: "Gulf News", logo: "/press/gulf-news.svg" },
  { name: "Construction Week", logo: "/press/construction-week.svg" },
  { name: "Hotelier Middle East", logo: "/press/hotelier-me.svg" },
  { name: "Architectural Digest ME", logo: "/press/architectural-digest.svg" },
  { name: "Forbes Middle East", logo: "/press/forbes-me.svg" },
];

export function TrustedRecognized() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);

  const bgScale = useTransform(scrollYProgress, [0, 1], [1.05, 1]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden py-24 sm:py-28 lg:py-32"
    >
      {/* Full-bleed background image with parallax */}
      <motion.div
        style={{ y: bgY, scale: bgScale }}
        className="absolute inset-0"
      >
        <SafeImage
          src="/team/MID8563.jpg"
          alt="MIDC Team"
          fill
          className="object-cover"
        />
        {/* Elegant light overlay */}
        <div className="absolute inset-0 bg-[#faf8f5]/92" />
      </motion.div>

      {/* Background gradient elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(201,169,98,0.06)_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(201,169,98,0.04)_0%,transparent_50%)]" />
        <motion.div
          style={{ y: bgY }}
          className="absolute -left-1/4 top-1/3 h-[500px] w-[500px] rounded-full bg-[#c9a962]/[0.03] blur-[150px]"
        />
        <motion.div
          style={{ y: useTransform(scrollYProgress, [0, 1], ["5%", "-10%"]) }}
          className="absolute -right-1/4 bottom-1/3 h-[400px] w-[400px] rounded-full bg-neutral-300/30 blur-[120px]"
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-12">
        {/* Header */}
        <div className="mb-16 text-center lg:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="mb-6 flex items-center justify-center gap-6"
          >
            <motion.div
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : {}}
              transition={{ duration: 1, delay: 0.2 }}
              className="h-px w-12 origin-right bg-neutral-300"
            />
            <span className="font-Satoshi text-[10px] font-light uppercase tracking-[0.4em] text-neutral-400">
              As Seen In
            </span>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : {}}
              transition={{ duration: 1, delay: 0.2 }}
              className="h-px w-12 origin-left bg-neutral-300"
            />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.1 }}
            className="font-SchnyderS text-4xl font-light tracking-tight text-neutral-950 sm:text-5xl lg:text-6xl"
          >
            Trusted & Recognized
          </motion.h2>
        </div>

        {/* Press Logos Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.2 }}
          className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6 lg:gap-8"
        >
          {pressLogos.map((press, index) => (
            <motion.div
              key={press.name}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.08 }}
              whileHover={{ y: -5 }}
              className="group relative"
            >
              <div className="flex h-24 items-center justify-center border border-neutral-200/50 bg-white/50 px-6 backdrop-blur-sm transition-all duration-500 hover:border-[#c9a962]/30 hover:bg-white hover:shadow-lg hover:shadow-[#c9a962]/5">
                {/* Press logo */}
                <Image
                  src={press.logo}
                  alt={press.name}
                  width={140}
                  height={50}
                  className="h-10 w-auto object-contain opacity-50 grayscale transition-all duration-500 group-hover:opacity-100 group-hover:grayscale-0"
                />

                {/* Hover tooltip */}
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <span className="font-Satoshi text-[10px] font-light text-neutral-400">
                    {press.name}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom accent with animation */}
        <div className="mt-16 flex items-center justify-center gap-4 lg:mt-20">
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 1.5, delay: 0.8 }}
            className="h-px w-16 origin-right bg-gradient-to-r from-transparent to-[#c9a962]/30"
          />
          <motion.div
            initial={{ scale: 0, rotate: 0 }}
            animate={isInView ? { scale: 1, rotate: 45 } : {}}
            transition={{ duration: 0.6, delay: 1 }}
            className="h-2 w-2 bg-[#c9a962]/40"
          />
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 1.5, delay: 0.8 }}
            className="h-px w-16 origin-left bg-gradient-to-l from-transparent to-[#c9a962]/30"
          />
        </div>
      </div>
    </section>
  );
}
