"use client";

import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import {
  Ear,
  Palette,
  Cpu,
  Package,
  Hammer,
  Key,
  ArrowRight,
} from "lucide-react";
import { SafeImage } from "@/components/safe-image";
import Link from "next/link";

const phases = [
  {
    id: "phase-01",
    title: "Discovery & Conceptualization",
    headline: "It Starts With Listening",
    icon: Ear,
    description:
      'Before we draw a single line, we listen. Whether you are ADNH planning a hotel renovation or a private client building a villa in District One, we need to understand the "soul" of the project.',
    points: [
      {
        label: "The Brief",
        text: "We define the functional needs and the aesthetic aspirations.",
      },
      {
        label: "The Site Analysis",
        text: "We analyze the physical space to understand its light, flow, and structural limitations.",
      },
    ],
    image: "",
    bgColor: "bg-neutral-100",
    textColor: "text-neutral-950",
    accentColor: "text-[#c9a962]",
  },
  {
    id: "phase-02",
    title: "Design Development & Visualization",
    headline: "Where Imagination Meets Precision",
    icon: Palette,
    description:
      "This is where Eng. Maher's vision takes shape. Unlike other firms that show you a mood board and hope for the best, we build the entire project digitally first.",
    points: [
      {
        label: 'The "Uncluttered Baroque"',
        text: "Our design team creates detailed concepts that merge the grandeur of Arabic heritage with modern restraint. We refine the ornamentation until it is sophisticated, not chaotic.",
      },
      {
        label: "Photorealistic 3D Renders",
        text: "We provide high-fidelity 3D visualizations that show you exactly how the light will hit the marble and how the velvet will look on the chairs.",
      },
      {
        label: "Client Approval",
        text: "You don't have to guess. You see the final reality before we lay a single brick. We do not move forward until you are 100% in love with the design.",
      },
    ],
    image: "",
    bgColor: "bg-neutral-950",
    textColor: "text-white",
    accentColor: "text-[#c9a962]",
  },
  {
    id: "phase-03",
    title: "Technical Engineering (The MEP Core)",
    headline: "The Heartbeat of the Building",
    icon: Cpu,
    description:
      "Once the design is approved, our in-house MEP Division (Mechanical, Electrical, Plumbing) takes over. This is our biggest differentiator.",
    points: [
      {
        label: "Seamless Integration",
        text: "We design the AC ducts to fit perfectly within the decorative ceilings, so they are invisible.",
      },
      {
        label: "Efficiency",
        text: "We calculate power and cooling loads to ensure the building runs efficiently for decades, as we did for the Park Hyatt villas.",
      },
    ],
    image: "",
    bgColor: "bg-neutral-100",
    textColor: "text-neutral-950",
    accentColor: "text-[#c9a962]",
  },
  {
    id: "phase-04",
    title: "Planning & Material Control",
    headline: "Precision Logistics",
    icon: Package,
    description:
      "A luxury project lives or dies by its materials. Based on our Material Control Procedures, we leave nothing to chance.",
    points: [
      {
        label: "Global Sourcing",
        text: "We source bespoke joinery, rare stones, and fabrics from around the world.",
      },
      {
        label: "Verification",
        text: "Every material sample is inspected and matched to the 3D render before ordering.",
      },
      {
        label: "Scheduling",
        text: 'We create a master timeline to prevent "site clutter" and ensure materials arrive exactly when needed.',
      },
    ],
    image: "",
    bgColor: "bg-neutral-950",
    textColor: "text-white",
    accentColor: "text-[#c9a962]",
  },
  {
    id: "phase-05",
    title: "Execution & Safety",
    headline: "The Art of Construction",
    icon: Hammer,
    description:
      'This is where Eng. Maher\'s "On-Site Leadership" comes alive.',
    points: [
      {
        label: "HSE Standards",
        text: "We maintain a zero-tolerance policy for unsafe practices. A clean site is a safe site.",
      },
      {
        label: "Skilled Artisans",
        text: 'We use our own teams for critical finishes: stone cladding, gypsum work, and painting, to ensure the "immaculate" finish we are famous for.',
      },
      {
        label: "Quality Assurance",
        text: "We inspect every layer. If a wall isn't perfectly straight, we take it down before the paint goes on.",
      },
    ],
    image: "",
    bgColor: "bg-neutral-100",
    textColor: "text-neutral-950",
    accentColor: "text-[#c9a962]",
  },
  {
    id: "phase-06",
    title: "Handover & Legacy",
    headline: "The White-Glove Handover",
    icon: Key,
    description:
      "We do not just hand over a set of keys. We hand over a functioning reality.",
    points: [
      {
        label: "The Snag List",
        text: "We are our own harshest critics. We perform a detailed snagging process to catch even the smallest imperfections.",
      },
      {
        label: "Deep Cleaning",
        text: "We deliver the project immaculately and are ready for immediate occupation.",
      },
      {
        label: "Training",
        text: "We train your team on how to operate the new systems we installed.",
      },
    ],
    image: "",
    bgColor: "bg-neutral-950",
    textColor: "text-white",
    accentColor: "text-[#c9a962]",
  },
];

export function PhasesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-200px" });

  return (
    <section ref={sectionRef} className="relative">
      {phases.map((phase, index) => {
        const Icon = phase.icon;
        const isEven = index % 2 === 0;

        return (
          <PhaseBlock
            key={phase.id}
            phase={phase}
            Icon={Icon}
            isEven={isEven}
            index={index}
          />
        );
      })}

      {/* Final CTA Section */}
      <div className="relative overflow-hidden bg-neutral-950 py-24 sm:py-32 lg:py-40">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative z-10 mx-auto max-w-4xl px-6 text-center lg:px-12"
        >
          <h3 className="mb-6 font-SchnyderS text-3xl font-light text-white lg:text-4xl">
            Experience the calm of a fully integrated process.
          </h3>
          <p className="mb-10 font-Satoshi text-base font-light text-white/70">
            From first sketch to final polish, we orchestrate every detail with
            precision.
          </p>

          <Link
            href="/#contact"
            className="group inline-flex items-center gap-3 border border-[#c9a962]/30 bg-[#c9a962]/5 px-10 py-5 font-Satoshi text-sm font-light uppercase tracking-wider text-white transition-all hover:border-[#c9a962]/50 hover:bg-[#c9a962]/10"
          >
            <span>Start Your Project</span>
            <ArrowRight
              className="h-4 w-4 transition-transform group-hover:translate-x-1"
              strokeWidth={1}
            />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

function PhaseBlock({
  phase,
  Icon,
  isEven,
  index,
}: {
  phase: (typeof phases)[0];
  Icon: any;
  isEven: boolean;
  index: number;
}) {
  const blockRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(blockRef, { once: true, margin: "-100px" });

  const { scrollYProgress } = useScroll({
    target: blockRef,
    offset: ["start end", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ["10%", "-10%"]);

  return (
    <div
      ref={blockRef}
      className={`relative overflow-hidden ${phase.bgColor} py-24 sm:py-32 lg:py-40`}
    >
      {/* Background Pattern */}
      {phase.bgColor === "bg-neutral-100" ? (
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(201,169,98,0.03),transparent_50%)]" />
      ) : (
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(201,169,98,0.05),transparent_50%)]" />
      )}

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-12">
        <div
          className={`grid gap-16 lg:grid-cols-2 lg:gap-20 ${!isEven ? "lg:flex-row-reverse" : ""}`}
        >
          {/* Content - Left on even, Right on odd */}
          <motion.div
            initial={{ opacity: 0, x: isEven ? -40 : 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className={`flex flex-col justify-center ${!isEven ? "lg:order-2" : ""}`}
          >
            {/* Phase Number Badge */}
            <div className="mb-6 inline-flex items-center gap-4">
              <div
                className={`flex h-16 w-16 items-center justify-center border ${phase.bgColor === "bg-neutral-100" ? "border-[#c9a962]/30 bg-[#c9a962]/5" : "border-[#c9a962]/30 bg-[#c9a962]/10"}`}
              >
                <Icon className="h-7 w-7 text-[#c9a962]" strokeWidth={1} />
              </div>
              <div>
                <div
                  className={`font-SchnyderS text-xl font-light ${phase.textColor}`}
                >
                  {phase.title}
                </div>
              </div>
            </div>

            <h3
              className={`mb-6 font-SchnyderS text-3xl font-light ${phase.textColor} sm:text-4xl lg:text-5xl`}
            >
              {phase.headline}
            </h3>

            <p
              className={`mb-8 font-Satoshi text-base font-light leading-relaxed ${phase.bgColor === "bg-neutral-100" ? "text-neutral-600" : "text-white/70"} lg:text-lg`}
            >
              {phase.description}
            </p>

            {/* Points */}
            <div className="space-y-6">
              {phase.points.map((point, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                  className={`border-l-2 ${phase.bgColor === "bg-neutral-100" ? "border-[#c9a962]/50" : "border-[#c9a962]/30"} pl-6`}
                >
                  <div
                    className={`mb-2 font-Satoshi text-sm font-medium uppercase tracking-wider ${phase.accentColor}`}
                  >
                    {point.label}
                  </div>
                  <p
                    className={`font-Satoshi text-sm font-light leading-relaxed ${phase.bgColor === "bg-neutral-100" ? "text-neutral-600" : "text-white/60"}`}
                  >
                    {point.text}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Image - Right on even, Left on odd */}
          <motion.div
            initial={{ opacity: 0, x: isEven ? 40 : -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className={`relative ${!isEven ? "lg:order-1" : ""}`}
          >
            <motion.div
              style={{ y: imageY }}
              className="relative aspect-[4/5] overflow-hidden"
            >
              <SafeImage
                src={phase.image}
                alt={phase.title}
                fill
                className="object-cover"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/40 via-transparent to-transparent" />

              {/* Corner Frame */}
              <div className="absolute left-4 top-4 h-20 w-20 border-l-2 border-t-2 border-[#c9a962]/50" />
              <div className="absolute bottom-4 right-4 h-20 w-20 border-b-2 border-r-2 border-[#c9a962]/50" />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
