"use client";

import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { SafeImage } from "@/components/safe-image";
import { MapPin, GraduationCap, Briefcase, Award } from "lucide-react";

const timeline = [
  {
    id: "education",
    icon: GraduationCap,
    year: "1990s",
    location: "London, United Kingdom",
    title: "The Foundation",
    description:
      "Studied architecture and engineering in London, absorbing the discipline, precision, and minimalist elegance of European design thinking.",
    image: "",
  },
  {
    id: "founding",
    icon: Briefcase,
    year: "2000",
    location: "Dubai, UAE",
    title: "The Bold Decision",
    description:
      "Founded MIDC with a vision to merge European discipline with Arabian warmth. Started with a small team and one conviction: never compromise on quality.",
    image: "",
  },
  {
    id: "integration",
    icon: MapPin,
    year: "2010",
    location: "Across the Middle East",
    title: "The Integration",
    description:
      "Built the first truly integrated design-build firm in the region. United architects, engineers, and craftsmen under one roof—one vision.",
    image: "",
  },
  {
    id: "recognition",
    icon: Award,
    year: "2021-2024",
    location: "International Stage",
    title: "The Vindication",
    description:
      "MIDC receives 12 international awards, including Best Hotel Suite Interior (Arabia) and recognition from the Luxury Lifestyle Awards. The vision has become the standard.",
    image: "",
  },
];

export function TestFounderJourney() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-white py-32 sm:py-40 lg:py-48"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-neutral-50/50 via-white to-neutral-50/30" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-12">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9 }}
          className="mb-24 text-center"
        >
          <div className="mb-6 flex items-center justify-center gap-4">
            <div className="h-px w-16 bg-neutral-300" />
            <span className="font-Satoshi text-xs font-medium uppercase tracking-[0.3em] text-neutral-400">
              The Journey
            </span>
            <div className="h-px w-16 bg-neutral-300" />
          </div>

          <h2 className="mb-8 font-SchnyderS text-5xl font-light leading-[1.05] text-neutral-950 sm:text-6xl lg:text-7xl">
            From Vision to
            <br />
            <span className="text-neutral-300">Reality</span>
          </h2>

          <p className="mx-auto max-w-2xl font-Satoshi text-lg font-light leading-relaxed text-neutral-600">
            Every great legacy has a story. This is how one engineer's belief in
            bridging cultures became the Middle East's most trusted luxury
            design firm.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-neutral-200 lg:block">
            <motion.div
              style={{ height: lineHeight }}
              className="w-full bg-[#c9a962] origin-top"
            />
          </div>

          {/* Timeline Items */}
          <div className="space-y-32">
            {timeline.map((item, index) => {
              const Icon = item.icon;
              const isEven = index % 2 === 0;

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 60 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="relative grid gap-12 lg:grid-cols-2 lg:gap-20"
                >
                  {/* Content - switches sides on desktop */}
                  <div
                    className={`flex flex-col justify-center ${isEven ? "lg:order-1 lg:text-right" : "lg:order-2"}`}
                  >
                    {/* Icon & Year */}
                    <div
                      className={`mb-6 flex items-center gap-4 ${isEven ? "lg:justify-end" : ""}`}
                    >
                      <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#c9a962]/30 bg-[#c9a962]/5">
                        <Icon
                          className="h-7 w-7 text-[#c9a962]"
                          strokeWidth={1.5}
                        />
                      </div>
                      <div>
                        <div className="font-SchnyderS text-3xl font-light text-[#c9a962]">
                          {item.year}
                        </div>
                        <div className="flex items-center gap-2 font-Satoshi text-xs font-light uppercase tracking-wider text-neutral-400">
                          <MapPin className="h-3 w-3" />
                          {item.location}
                        </div>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="mb-4 font-SchnyderS text-4xl font-light text-neutral-950 lg:text-5xl">
                      {item.title}
                    </h3>

                    {/* Description */}
                    <p className="font-Satoshi text-lg font-light leading-relaxed text-neutral-600">
                      {item.description}
                    </p>

                    {/* Decorative line */}
                    <div
                      className={`mt-6 h-px w-24 bg-[#c9a962] ${isEven ? "lg:ml-auto" : ""}`}
                    />
                  </div>

                  {/* Image */}
                  <div
                    className={`relative ${isEven ? "lg:order-2" : "lg:order-1"}`}
                  >
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.4 }}
                      className="relative aspect-[4/5] overflow-hidden bg-neutral-100"
                    >
                      <SafeImage
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />

                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/40 via-transparent to-transparent" />
                    </motion.div>
                  </div>

                  {/* Center dot for timeline */}
                  <div className="absolute left-1/2 top-1/2 hidden h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-white bg-[#c9a962] shadow-lg lg:block" />
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Closing Statement */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-32 border-t border-neutral-200 pt-20 text-center"
        >
          <p className="mx-auto max-w-4xl font-SchnyderS text-3xl font-light leading-relaxed text-neutral-950 lg:text-4xl">
            Today, MIDC stands as proof that great design transcends borders. It
            speaks the language of excellence—universally understood.
          </p>
          <div className="mx-auto mt-12 h-px w-32 bg-[#c9a962]" />
        </motion.div>
      </div>
    </section>
  );
}
