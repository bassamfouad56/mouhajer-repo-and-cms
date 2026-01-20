"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
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
    number: "01",
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
        label: "Site Analysis",
        text: "We analyze the physical space to understand its light, flow, and structural limitations.",
      },
      {
        label: "Feasibility Study",
        text: "We assess timeline, budget, and regulatory requirements upfront.",
      },
    ],
    duration: "2-3 weeks",
    image: "/placeholder.jpg",
  },
  {
    id: "phase-02",
    number: "02",
    title: "Design Development",
    headline: "Where Imagination Meets Precision",
    icon: Palette,
    description:
      "This is where Eng. Maher's vision takes shape. Unlike other firms that show you a mood board and hope for the best, we build the entire project digitally first.",
    points: [
      {
        label: 'The "Uncluttered Baroque"',
        text: "Our design team creates detailed concepts that merge the grandeur of Arabic heritage with modern restraint.",
      },
      {
        label: "Photorealistic 3D Renders",
        text: "We provide high-fidelity visualizations that show you exactly how the light will hit the marble.",
      },
      {
        label: "Client Approval",
        text: "You see the final reality before we lay a single brick. We don't move forward until you're 100% in love.",
      },
    ],
    duration: "4-6 weeks",
    image: "/placeholder.jpg",
  },
  {
    id: "phase-03",
    number: "03",
    title: "Technical Engineering",
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
        text: "We calculate power and cooling loads to ensure the building runs efficiently for decades.",
      },
      {
        label: "Code Compliance",
        text: "All systems meet Dubai Municipality, Civil Defence, and DEWA requirements.",
      },
    ],
    duration: "3-4 weeks",
    image: "/placeholder.jpg",
  },
  {
    id: "phase-04",
    number: "04",
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
    duration: "2-4 weeks",
    image: "/placeholder.jpg",
  },
  {
    id: "phase-05",
    number: "05",
    title: "Execution & Safety",
    headline: "The Art of Construction",
    icon: Hammer,
    description:
      'This is where Eng. Maher\'s "On-Site Leadership" comes alive. Every detail is executed with military precision.',
    points: [
      {
        label: "HSE Standards",
        text: "We maintain a zero-tolerance policy for unsafe practices. A clean site is a safe site.",
      },
      {
        label: "Skilled Artisans",
        text: "We use our own teams for critical finishes: stone cladding, gypsum work, and painting.",
      },
      {
        label: "Quality Assurance",
        text: "We inspect every layer. If a wall isn't perfectly straight, we take it down before the paint goes on.",
      },
    ],
    duration: "12-20 weeks",
    image: "/placeholder.jpg",
  },
  {
    id: "phase-06",
    number: "06",
    title: "Handover & Legacy",
    headline: "The White-Glove Handover",
    icon: Key,
    description:
      "We do not just hand over a set of keys. We hand over a functioning reality that will stand the test of time.",
    points: [
      {
        label: "The Snag List",
        text: "We are our own harshest critics. We perform a detailed snagging process to catch even the smallest imperfections.",
      },
      {
        label: "Deep Cleaning",
        text: "We deliver the project immaculate and ready for immediate occupation.",
      },
      {
        label: "Training",
        text: "We train your team on how to operate the new systems we installed.",
      },
    ],
    duration: "1-2 weeks",
    image: "/placeholder.jpg",
  },
];

export function PhasesSectionCinematic() {
  return (
    <section className="relative bg-[#faf8f5]">
      {/* Section Header */}
      <div className="relative overflow-hidden bg-[#faf8f5] py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="mb-6 flex items-center justify-center gap-4">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#c9a962]/50" />
              <span className="font-Satoshi text-xs font-light uppercase tracking-[0.3em] text-neutral-500">
                The MIDC Protocol
              </span>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#c9a962]/50" />
            </div>

            <h2 className="mb-6 font-SchnyderS text-5xl font-light tracking-tight text-neutral-900 md:text-6xl lg:text-7xl">
              From Vision to
              <br />
              <span className="text-[#c9a962]">Reality</span>
            </h2>

            <p className="mx-auto max-w-2xl font-Satoshi text-lg font-light leading-relaxed text-neutral-600">
              Six integrated phases. One seamless execution. A methodology
              refined over 25 years.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Phase Cards - Alternating Full-Width Sections */}
      {phases.map((phase, index) => (
        <PhaseSection key={phase.id} phase={phase} index={index} />
      ))}

      {/* CTA Section */}
      <CTASection />
    </section>
  );
}

function PhaseSection({
  phase,
  index,
}: {
  phase: (typeof phases)[0];
  index: number;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const isEven = index % 2 === 0;
  const Icon = phase.icon;

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.1, 1, 1.05]);

  return (
    <section
      ref={sectionRef}
      className={`relative overflow-hidden py-24 lg:py-32 ${
        isEven ? "bg-[#faf8f5]" : "bg-white"
      }`}
    >
      {/* Subtle background gradient */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className={`absolute ${isEven ? "right-0" : "left-0"} top-0 h-full w-1/2 bg-gradient-to-${isEven ? "l" : "r"} from-[#c9a962]/[0.02] to-transparent`}
        />
      </div>

      <div className="relative mx-auto max-w-[1600px] px-6 lg:px-12">
        <div
          className={`grid items-center gap-12 lg:grid-cols-2 lg:gap-20 ${!isEven ? "lg:grid-flow-dense" : ""}`}
        >
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: isEven ? -40 : 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className={!isEven ? "lg:col-start-2" : ""}
          >
            {/* Phase Number & Icon */}
            <div className="mb-8 flex items-center gap-6">
              <div className="relative flex h-20 w-20 items-center justify-center">
                <div className="absolute inset-0 rounded-2xl border border-[#c9a962]/20 bg-gradient-to-br from-[#c9a962]/10 to-transparent" />
                <Icon
                  className="relative h-8 w-8 text-[#c9a962]"
                  strokeWidth={1.5}
                />
              </div>
              <div>
                <div className="font-Satoshi text-xs font-light uppercase tracking-[0.3em] text-[#c9a962]">
                  Phase {phase.number}
                </div>
                <div className="mt-1 flex items-center gap-2 text-neutral-400">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="font-Satoshi text-sm font-light">
                    {phase.duration}
                  </span>
                </div>
              </div>
            </div>

            {/* Title & Headline */}
            <h3 className="mb-3 font-SchnyderS text-4xl font-light leading-tight tracking-tight text-neutral-900 lg:text-5xl">
              {phase.title}
            </h3>
            <p className="mb-6 font-Satoshi text-lg font-light italic text-[#c9a962]">
              {phase.headline}
            </p>

            {/* Description */}
            <p className="mb-10 font-Satoshi text-base font-light leading-relaxed text-neutral-600 lg:text-lg">
              {phase.description}
            </p>

            {/* Key Points */}
            <div className="space-y-6">
              {phase.points.map((point, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                  className="group relative pl-6"
                >
                  {/* Vertical line */}
                  <div className="absolute left-0 top-0 h-full w-px bg-gradient-to-b from-[#c9a962] to-[#c9a962]/20" />

                  {/* Dot */}
                  <div className="absolute -left-[3px] top-1.5 h-[7px] w-[7px] rounded-full bg-[#c9a962]" />

                  <h4 className="mb-1 font-Satoshi text-sm font-medium uppercase tracking-wider text-neutral-900">
                    {point.label}
                  </h4>
                  <p className="font-Satoshi text-sm font-light leading-relaxed text-neutral-600">
                    {point.text}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: isEven ? 40 : -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className={`relative ${!isEven ? "lg:col-start-1 lg:row-start-1" : ""}`}
          >
            <div className="relative aspect-[4/5] overflow-hidden lg:aspect-[3/4]">
              <motion.div
                style={{ y: imageY, scale: imageScale }}
                className="absolute inset-0"
              >
                <SafeImage
                  src={phase.image}
                  alt={phase.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </motion.div>

              {/* Overlay gradients */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#faf8f5]/60 via-transparent to-transparent" />
              <div
                className={`absolute inset-0 bg-gradient-to-${isEven ? "l" : "r"} from-[#faf8f5]/40 via-transparent to-transparent`}
              />

              {/* Decorative corners */}
              <div className="absolute left-6 top-6 h-16 w-16 border-l-2 border-t-2 border-[#c9a962]/30" />
              <div className="absolute bottom-6 right-6 h-16 w-16 border-b-2 border-r-2 border-[#c9a962]/30" />

              {/* Phase number overlay */}
              <div className="absolute bottom-8 right-8">
                <span className="font-SchnyderS text-8xl font-light text-white/20 lg:text-9xl">
                  {phase.number}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Section divider */}
      <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-[#c9a962]/20 to-transparent" />
    </section>
  );
}

function CTASection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true });

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-neutral-950 py-32 lg:py-40"
    >
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute left-1/4 top-1/4 h-[500px] w-[500px] rounded-full bg-[#c9a962]/10 blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 h-[400px] w-[400px] rounded-full bg-[#c9a962]/5 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <div className="mb-8 flex items-center justify-center gap-4">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-white/30" />
            <span className="font-Satoshi text-xs font-light uppercase tracking-[0.3em] text-white/50">
              Start Your Project
            </span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-white/30" />
          </div>

          <h2 className="mb-6 font-SchnyderS text-5xl font-light tracking-tight text-white md:text-6xl lg:text-7xl">
            Ready to Begin
            <br />
            <span className="text-[#c9a962]">Your Journey?</span>
          </h2>

          <p className="mx-auto mb-12 max-w-2xl font-Satoshi text-lg font-light leading-relaxed text-white/60">
            Let&apos;s discuss how our integrated process can bring your vision
            to life with zero compromise.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/contact"
              className="group inline-flex items-center gap-3 bg-[#c9a962] px-10 py-5 font-Satoshi text-sm font-light tracking-widest text-neutral-950 transition-all hover:bg-[#c9a962]/90"
            >
              <span>DISCUSS YOUR PROJECT</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              href="/projects"
              className="inline-flex items-center gap-3 border border-white/20 px-10 py-5 font-Satoshi text-sm font-light tracking-widest text-white transition-all hover:border-white/40 hover:bg-white/5"
            >
              <span>VIEW OUR WORK</span>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
