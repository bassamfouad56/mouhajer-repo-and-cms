"use client";

import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { SafeImage } from "@/components/safe-image";
import { ArrowRight, BookOpen, Users, Target } from "lucide-react";

const principles = [
  {
    id: "discipline",
    icon: BookOpen,
    title: "London Discipline",
    subtitle: "The Mind",
    description:
      'European precision. Clean lines. Functional intelligence. Every design must answer "why" before "how."',
    color: "from-blue-500/10 to-blue-600/5",
    accent: "border-blue-500/30",
  },
  {
    id: "warmth",
    icon: Users,
    title: "Arabian Warmth",
    subtitle: "The Heart",
    description:
      "Cultural richness. Hospitality embedded in every detail. Spaces that welcome, embrace, and elevate.",
    color: "from-amber-500/10 to-amber-600/5",
    accent: "border-amber-500/30",
  },
  {
    id: "excellence",
    icon: Target,
    title: "Uncompromising Standard",
    subtitle: "The Result",
    description:
      'Where discipline meets warmth, excellence is born. We don\'t do "good enough." We do legendary.',
    color: "from-[#c9a962]/10 to-[#c9a962]/5",
    accent: "border-[#c9a962]/30",
  },
];

const testimonials = [
  {
    quote:
      "Working with MIDC isn't just hiring a contractor. It's partnering with perfectionists who care as much about your project as you do.",
    author: "Senior Executive",
    company: "ADNH - Abu Dhabi National Hotels",
  },
  {
    quote:
      "Eng. Maher's attention to detail is legendary. He sees things most designers would miss, and he won't rest until it's perfect.",
    author: "Project Director",
    company: "Emaar Properties",
  },
];

export function TestFounderPhilosophy() {
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
      className="relative overflow-hidden bg-[#faf8f5] py-32 sm:py-40 lg:py-48"
    >
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#faf8f5] via-white/50 to-[#faf8f5]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(201,169,98,0.06),transparent_50%),radial-gradient(circle_at_70%_50%,rgba(201,169,98,0.03),transparent_50%)]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9 }}
          className="mb-24 text-center"
        >
          <div className="mb-6 flex items-center justify-center gap-4">
            <div className="h-px w-16 bg-[#c9a962]/30" />
            <span className="font-Satoshi text-xs font-medium uppercase tracking-[0.3em] text-neutral-500">
              Design Philosophy
            </span>
            <div className="h-px w-16 bg-[#c9a962]/30" />
          </div>

          <h2 className="mb-8 font-SchnyderS text-5xl font-light leading-[1.05] text-neutral-900 sm:text-6xl lg:text-7xl">
            Three Principles.
            <br />
            <span className="text-[#c9a962]">One Vision.</span>
          </h2>

          <p className="mx-auto max-w-3xl font-Satoshi text-lg font-light leading-relaxed text-neutral-600">
            Eng. Maher Mouhajer doesn't choose between opposites. He harmonizes
            them. This is the MIDC philosophy—a design language spoken in three
            dialects.
          </p>
        </motion.div>

        {/* Principles Grid */}
        <div className="mb-32 grid gap-8 md:grid-cols-3 lg:gap-12">
          {principles.map((principle, index) => {
            const Icon = principle.icon;
            return (
              <motion.div
                key={principle.id}
                initial={{ opacity: 0, y: 60 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.8,
                  delay: 0.2 + index * 0.15,
                }}
                className="group relative"
              >
                {/* Card */}
                <div
                  className={`relative h-full border ${principle.accent} bg-white/70 p-8 backdrop-blur-sm transition-all duration-500 hover:scale-[1.02] hover:bg-white/90 lg:p-10`}
                >
                  {/* Icon */}
                  <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#c9a962]/20 bg-[#c9a962]/10">
                    <Icon
                      className="h-8 w-8 text-[#c9a962]"
                      strokeWidth={1.5}
                    />
                  </div>

                  {/* Subtitle */}
                  <div className="mb-2 font-Satoshi text-xs font-medium uppercase tracking-[0.25em] text-neutral-500">
                    {principle.subtitle}
                  </div>

                  {/* Title */}
                  <h3 className="mb-6 font-SchnyderS text-3xl font-light text-neutral-900 transition-colors duration-300 group-hover:text-[#c9a962] lg:text-4xl">
                    {principle.title}
                  </h3>

                  {/* Description */}
                  <p className="font-Satoshi text-base font-light leading-relaxed text-neutral-600">
                    {principle.description}
                  </p>

                  {/* Bottom accent */}
                  <div className="mt-8 h-px w-0 bg-[#c9a962] transition-all duration-500 group-hover:w-full" />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Large Feature: Philosophy in Action */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1 }}
          className="mb-32"
        >
          <div className="relative grid gap-12 overflow-hidden lg:grid-cols-2 lg:gap-16">
            {/* Left: Image */}
            <motion.div
              style={{ y: parallaxY }}
              className="relative aspect-[4/5] overflow-hidden bg-[#faf8f5] lg:aspect-auto"
            >
              <SafeImage
                src="/founder/CEO Arabia.jpg"
                alt="Eng. Maher Mouhajer reviewing designs"
                fill
                className="object-cover"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#faf8f5]/60 via-transparent to-transparent" />

              {/* Gold accent */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#c9a962]" />
            </motion.div>

            {/* Right: Content */}
            <div className="flex flex-col justify-center">
              <div className="mb-6 h-px w-16 bg-[#c9a962]" />

              <h3 className="mb-8 font-SchnyderS text-4xl font-light text-neutral-900 lg:text-5xl">
                From Philosophy
                <br />
                <span className="text-[#c9a962]">to Reality</span>
              </h3>

              <div className="mb-12 space-y-6 font-Satoshi text-lg font-light leading-relaxed text-neutral-600">
                <p>
                  Eng. Maher Mouhajer is obsessed with one question:{" "}
                  <span className="font-normal text-neutral-900">
                    "Does this serve the client's life?"
                  </span>
                </p>
                <p>
                  Not "Is it trendy?" Not "Will it photograph well?" But "Will
                  it improve how they live, work, and feel?"
                </p>
                <p className="text-neutral-500">
                  This is why MIDC projects stand the test of time. They're
                  designed for people, not portfolios.
                </p>
              </div>

              {/* Quote */}
              <div className="border-l-2 border-[#c9a962] pl-6">
                <p className="mb-4 font-SchnyderS text-2xl font-light italic text-neutral-900 lg:text-3xl">
                  "Every line, every material, every light fixture must earn its
                  place by serving both beauty and purpose."
                </p>
                <div className="font-Satoshi text-sm font-light text-neutral-500">
                  — Eng. Maher Mouhajer
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Testimonials Section */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-32"
        >
          <div className="mb-16 text-center">
            <h3 className="mb-4 font-SchnyderS text-4xl font-light text-neutral-900 lg:text-5xl">
              What Clients Say
            </h3>
            <p className="mx-auto max-w-2xl font-Satoshi text-base font-light text-neutral-600">
              The true measure of a founder's vision is what others experience
              when working with him.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:gap-12">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="border border-[#c9a962]/20 bg-white/70 p-8 backdrop-blur-sm lg:p-10"
              >
                <p className="mb-8 font-Satoshi text-lg font-light leading-relaxed text-neutral-700">
                  "{testimonial.quote}"
                </p>

                <div className="border-t border-[#c9a962]/20 pt-6">
                  <div className="font-Satoshi text-sm font-light text-neutral-900">
                    {testimonial.author}
                  </div>
                  <div className="font-Satoshi text-xs font-light text-neutral-500">
                    {testimonial.company}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Final CTA */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="border-t border-[#c9a962]/20 pt-20 text-center"
        >
          <h3 className="mb-6 font-SchnyderS text-4xl font-light text-neutral-900 lg:text-5xl">
            Experience the MIDC Difference
          </h3>
          <p className="mx-auto mb-12 max-w-2xl font-Satoshi text-lg font-light text-neutral-600">
            From international awards to the trust of the region's most
            prestigious brands, our work speaks for itself.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6">
            <Link
              href="/about/awards"
              className="group inline-flex items-center gap-4 border border-[#c9a962] bg-[#c9a962] px-10 py-5 font-Satoshi text-sm font-light uppercase tracking-[0.2em] text-neutral-950 transition-all duration-300 hover:bg-[#c9a962]/90"
            >
              <span>View Our Awards</span>
              <ArrowRight
                className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-2"
                strokeWidth={1.5}
              />
            </Link>

            <Link
              href="/projects"
              className="group inline-flex items-center gap-4 border border-[#c9a962]/30 bg-white/60 px-10 py-5 font-Satoshi text-sm font-light uppercase tracking-[0.2em] text-neutral-900 backdrop-blur-sm transition-all duration-300 hover:border-[#c9a962]/50 hover:bg-white/80"
            >
              <span>Explore Our Work</span>
              <ArrowRight
                className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-2"
                strokeWidth={1.5}
              />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
