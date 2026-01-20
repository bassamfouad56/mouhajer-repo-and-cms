"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { ArrowUpRight, History, Workflow, Award, Users } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { SafeImage } from "@/components/safe-image";

const ecosystemLinks = [
  {
    id: "legacy",
    icon: History,
    title: "MIDC Legacy",
    headline: "A Vision Built on Integrity",
    description:
      "Discover the journey of Mouhajer International from its inception to becoming one of the UAE's most respected contracting firms.",
    link: "/about/legacy",
    cta: "Explore Our Legacy",
    bgImage: "/team/MID9563.jpg",
  },
  {
    id: "workflow",
    icon: Workflow,
    title: "MIDC Workflow",
    headline: "Where Design Meets Engineering",
    description:
      "Explore our seamless design-and-build methodology, where in-house designers collaborate directly with civil engineers and factory technicians.",
    link: "/about/process",
    cta: "View Our Methodology",
    bgImage: "/team/MID9207.jpg",
  },
  {
    id: "awards",
    icon: Award,
    title: "Awards",
    headline: "Celebrated on the Global Stage",
    description:
      "Explore our gallery of achievements, including the Arabian Property Awards for Best Hotel Interior, Best Construction Company, and more.",
    link: "/about/awards",
    cta: "View Our Awards",
    bgImage: "/founder/CID_2106_00_COVER.jpg",
  },
  {
    id: "clients",
    icon: Users,
    title: "Clients",
    headline: "Trusted by Industry Giants",
    description:
      "Discover the prestigious brands that rely on MIDC for their most critical renovation and construction projects.",
    link: "/about/clients",
    cta: "Meet Our Partners",
    bgImage: "/team/MID8563.jpg",
  },
];

export function AboutEcosystem() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1.1, 1]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden py-28 sm:py-36 lg:py-44"
    >
      {/* Full-bleed background image with parallax */}
      <motion.div
        style={{ y: bgY, scale: bgScale }}
        className="absolute inset-0"
      >
        <Image
          src="/team/MID9207.jpg"
          alt="MIDC Team"
          fill
          className="object-cover"
          priority
        />
        {/* Elegant overlay */}
        <div className="absolute inset-0 bg-[#faf8f5]/95" />
      </motion.div>

      {/* Animated gradient accents */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(201,169,98,0.08)_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(201,169,98,0.06)_0%,transparent_50%)]" />
        <motion.div
          style={{ y: bgY }}
          className="absolute -left-1/3 top-1/4 h-[800px] w-[800px] rounded-full bg-[#c9a962]/[0.04] blur-[200px]"
        />
        <motion.div
          style={{ y: useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]) }}
          className="absolute -right-1/4 bottom-1/4 h-[600px] w-[600px] rounded-full bg-[#c9a962]/[0.03] blur-[150px]"
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
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#c9a962]/40" />
            <span className="font-Satoshi text-[10px] font-light uppercase tracking-[0.5em] text-neutral-500">
              Discover More
            </span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#c9a962]/40" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.1 }}
            className="font-SchnyderS text-4xl font-light tracking-tight text-neutral-900 sm:text-5xl lg:text-6xl"
          >
            Explore the MIDC Ecosystem
          </motion.h2>
        </div>

        {/* Cards Grid */}
        <div className="grid gap-5 md:grid-cols-2 lg:gap-6">
          {ecosystemLinks.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.2 + index * 0.1 }}
              >
                <Link href={item.link} className="group block">
                  <div className="relative overflow-hidden bg-white/70 transition-all duration-500 hover:bg-white/90">
                    {/* Background Image */}
                    <div className="absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100">
                      <SafeImage
                        src={item.bgImage}
                        alt=""
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-[#faf8f5]/85" />
                    </div>

                    {/* Card Content */}
                    <div className="relative z-10 p-8 lg:p-10">
                      {/* Top Row: Icon, Title, Arrow */}
                      <div className="mb-6 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex h-12 w-12 items-center justify-center border border-[#c9a962]/30 bg-[#c9a962]/10 transition-all duration-500 group-hover:border-[#c9a962]/50 group-hover:bg-[#c9a962]/20">
                            <Icon
                              className="h-5 w-5 text-[#c9a962]"
                              strokeWidth={1.5}
                            />
                          </div>
                          <span className="font-Satoshi text-xs font-medium uppercase tracking-[0.15em] text-neutral-500 transition-colors duration-300 group-hover:text-neutral-700">
                            {item.title}
                          </span>
                        </div>

                        {/* Arrow Button - Clear CTA */}
                        <div className="flex h-12 w-12 items-center justify-center border border-[#c9a962]/20 bg-[#c9a962]/5 transition-all duration-500 group-hover:border-[#c9a962] group-hover:bg-[#c9a962]">
                          <ArrowUpRight
                            className="h-5 w-5 text-[#c9a962]/60 transition-all duration-500 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                            strokeWidth={2}
                          />
                        </div>
                      </div>

                      {/* Headline */}
                      <h3 className="mb-3 font-SchnyderS text-2xl font-light text-neutral-900 transition-colors duration-300 group-hover:text-[#c9a962] lg:text-3xl">
                        {item.headline}
                      </h3>

                      {/* Description */}
                      <p className="mb-8 font-Satoshi text-sm font-light leading-relaxed text-neutral-500 transition-colors duration-300 group-hover:text-neutral-600">
                        {item.description}
                      </p>

                      {/* Bottom CTA Link */}
                      <div className="flex items-center justify-between border-t border-[#c9a962]/20 pt-6 transition-colors duration-300 group-hover:border-[#c9a962]/40">
                        <span className="font-Satoshi text-sm font-medium text-[#c9a962]/80 transition-colors duration-300 group-hover:text-[#c9a962]">
                          {item.cta}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="h-px w-8 bg-[#c9a962]/30 transition-all duration-500 group-hover:w-12 group-hover:bg-[#c9a962]" />
                          <ArrowUpRight
                            className="h-4 w-4 text-[#c9a962]/50 transition-all duration-300 group-hover:text-[#c9a962]"
                            strokeWidth={1.5}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Hover Border Effect */}
                    <div className="absolute inset-0 border border-[#c9a962]/10 transition-colors duration-500 group-hover:border-[#c9a962]/30" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-16 text-center lg:mt-20"
        >
          <p className="font-Satoshi text-sm font-light text-neutral-500">
            Click any card above to learn more about our story
          </p>
        </motion.div>
      </div>
    </section>
  );
}
