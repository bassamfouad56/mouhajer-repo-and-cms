"use client";

import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { SafeImage } from "@/components/safe-image";

const teams = [
  {
    id: "design",
    title: "The Design Team",
    description: "knows their concepts are buildable.",
  },
  {
    id: "construction",
    title: "The Construction Team",
    description: "respects the artistic intent.",
  },
  {
    id: "mep",
    title: "The MEP Team",
    description: "ensures the systems support the beauty.",
  },
];

export function UnitySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const parallaxY = useTransform(scrollYProgress, [0, 1], ["10%", "-10%"]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-neutral-950 py-32 sm:py-40 lg:py-48"
    >
      {/* Sophisticated dark background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(201,169,98,0.03),transparent_50%),radial-gradient(circle_at_70%_50%,rgba(255,255,255,0.02),transparent_50%)]" />

      <div className="relative z-10 mx-auto max-w-[1600px] px-6 lg:px-12 xl:px-16">
        {/* Header */}
        <div className="mb-32">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="mb-8">
              <div className="mb-2 h-px w-16 bg-white/20" />
              <span className="font-Satoshi text-[10px] font-medium uppercase tracking-[0.3em] text-white/40">
                Leadership Philosophy
              </span>
            </div>

            <h2 className="mb-12 font-SchnyderS text-5xl font-light leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl xl:text-8xl">
              Unity is
              <br />
              <span className="text-[#c9a962]">Strength</span>
            </h2>

            <div className="max-w-3xl space-y-6 font-Satoshi text-lg font-light leading-relaxed text-white/60 lg:text-xl">
              <p>
                Many CEOs outsource their problems.{" "}
                <span className="font-normal text-white">
                  Eng. Maher brings them in-house.
                </span>
              </p>
              <p>
                He built MIDC as a turnkey powerhouse because he wanted his
                designers to sit next to his engineers. He wanted the person
                drawing the joinery to know the person building it.
              </p>
              <p className="text-white/40">
                This unity creates a culture of mutual respect and efficiency.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Split Layout: Founder Image + Team Grid */}
        <div className="mb-32 grid gap-16 lg:grid-cols-2 lg:gap-20 xl:gap-24">
          {/* Left: Large Founder Leadership Image */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            className="relative"
          >
            <motion.div
              style={{ y: parallaxY }}
              className="relative aspect-[3/4] overflow-hidden bg-neutral-900"
            >
              <SafeImage
                src="/founder/CEO Arabia.jpg"
                alt="Eng. Maher Mouhajer leading his unified team"
                fill
                className="object-cover"
              />

              {/* Subtle gradient overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-neutral-950/60 via-transparent to-transparent" />

              {/* Gold accent line */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#c9a962]" />
            </motion.div>

            {/* Caption */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="mt-6 font-Satoshi text-sm font-light text-white/50"
            >
              Leading by example: Eng. Maher orchestrates collaboration across
              all disciplines
            </motion.div>
          </motion.div>

          {/* Right: Team Philosophy Cards */}
          <div className="flex flex-col justify-center">
            <div className="space-y-8">
              {teams.map((team, index) => (
                <motion.div
                  key={team.id}
                  initial={{ opacity: 0, x: 40 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{
                    duration: 0.8,
                    delay: 0.3 + index * 0.15,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="group relative border-l border-white/10 pl-8 transition-all duration-500 hover:border-[#c9a962]"
                >
                  <h3 className="mb-3 font-SchnyderS text-2xl font-light text-white transition-colors duration-300 group-hover:text-[#c9a962] lg:text-3xl">
                    {team.title}
                  </h3>
                  <p className="font-Satoshi text-base font-light text-white/60 lg:text-lg">
                    {team.description}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Quote */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="mt-16 border-t border-white/10 pt-12"
            >
              <p className="font-SchnyderS text-2xl font-light italic leading-tight text-white/80 lg:text-3xl">
                "The magic happens when everyone understands they are building
                something bigger than themselves."
              </p>
              <div className="mt-6 h-px w-16 bg-[#c9a962]" />
            </motion.div>
          </div>
        </div>

        {/* Full-Width Collaboration Image */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="relative mb-32 aspect-21/9 overflow-hidden bg-neutral-900"
        >
          <img
            src="/placeholder.jpg"
            alt="Eng. Maher Mouhajer with his design and engineering team"
            className="h-full w-full object-cover"
          />

          {/* Gradient overlay for text readability */}
          <div className="absolute inset-0 bg-linear-to-r from-neutral-950/90 via-neutral-950/50 to-transparent" />

          {/* Overlay content */}
          <div className="absolute inset-y-0 left-0 flex items-center px-12 lg:px-20 xl:px-28">
            <div className="max-w-2xl">
              <div className="mb-4 h-px w-12 bg-[#c9a962]" />
              <p className="font-SchnyderS text-3xl font-light leading-tight text-white lg:text-4xl xl:text-5xl">
                Eng. Maher sits at the head of this table, not to dictate, but
                to orchestrate this collaboration.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <Link
            href="/about/process"
            className="group inline-flex items-center gap-4 border border-white/20 bg-white/5 px-10 py-5 font-Satoshi text-sm font-light uppercase tracking-[0.2em] text-white backdrop-blur-sm transition-all duration-300 hover:border-[#c9a962]/50 hover:bg-[#c9a962]/10"
          >
            <span>See Our Integrated Process</span>
            <svg
              className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
