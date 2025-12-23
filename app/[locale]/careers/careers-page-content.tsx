"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useInView } from "react-intersection-observer";
import Link from "next/link";
import {
  ArrowRight,
  Briefcase,
  Users,
  TrendingUp,
  Award,
  MapPin,
  Clock,
  ChevronRight,
} from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { LogoMarquee } from "@/components/logo-marquee";
import { jobPositions, type JobPosition } from "./jobs-data";

const benefits = [
  {
    icon: Award,
    title: "Award-Winning Projects",
    description:
      "Work on luxury projects recognized internationally for design excellence",
  },
  {
    icon: Users,
    title: "Collaborative Culture",
    description:
      "Join a talented team of architects and designers pushing creative boundaries",
  },
  {
    icon: TrendingUp,
    title: "Career Growth",
    description:
      "Clear progression paths with continuous learning and development opportunities",
  },
  {
    icon: Briefcase,
    title: "Premium Clients",
    description:
      "Collaborate with high-profile clients on prestigious residential and commercial projects",
  },
];

export default function CareersPageContent() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <>
      <Header />

      <div ref={containerRef} className="relative bg-white">
        {/* Hero Section */}
        <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-neutral-950">
          {/* Animated Grid Background */}
          <div className="absolute inset-0 opacity-20">
            <div
              className="h-full w-full"
              style={{
                backgroundImage: `
                `,
                backgroundSize: "100px 100px",
              }}
            />
          </div>

          <div className="relative z-10 mx-auto max-w-7xl px-6 py-32">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.6, 0.01, 0.05, 0.95] }}
              className="text-center"
            >
              {/* Subtitle */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="mb-6 flex items-center justify-center gap-4"
              >
                <div className="h-px w-12 bg-white/30" />
                <span className="text-xs font-light tracking-[0.3em] text-white/60">
                  JOIN OUR TEAM
                </span>
                <div className="h-px w-12 bg-white/30" />
              </motion.div>

              {/* Main Heading */}
              <motion.h1
                style={{ y, opacity }}
                className="mb-8 text-7xl font-light leading-[0.9] tracking-tighter text-white sm:text-8xl lg:text-9xl"
              >
                Build Your
                <br />
                <span className="text-white/40">Career</span> With Us
              </motion.h1>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="mx-auto mb-12 max-w-2xl text-lg font-light leading-relaxed text-white/70"
              >
                Join a team of passionate designers, architects, and innovators
                creating exceptional spaces across the UAE. We&apos;re looking
                for talented individuals who share our commitment to design
                excellence.
              </motion.p>

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <a
                  href="#positions"
                  className="group inline-flex items-center gap-3 border border-white px-8 py-4 text-sm font-light tracking-widest text-white transition-all hover:bg-white hover:text-neutral-950"
                >
                  VIEW OPEN POSITIONS
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>
              </motion.div>
            </motion.div>
          </div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex flex-col items-center gap-2"
            >
              <span className="text-xs font-light tracking-widest text-white/40">
                SCROLL
              </span>
              <div className="h-12 w-px bg-gradient-to-b from-white/40 to-transparent" />
            </motion.div>
          </motion.div>
        </section>

        {/* Why Join Us Section */}
        <section className="relative py-32">
          <div className="mx-auto max-w-7xl px-6">
            {/* Section Title */}
            <SectionTitle title="Why Work With Us" />

            {/* Benefits Grid */}
            <div className="mt-20 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {benefits.map((benefit, index) => (
                <BenefitCard key={index} benefit={benefit} index={index} />
              ))}
            </div>
          </div>
        </section>

        {/* Open Positions Section */}
        <section id="positions" className="relative bg-neutral-50 py-32">
          <div className="mx-auto max-w-7xl px-6">
            {/* Section Title */}
            <SectionTitle title="Open Positions" dark />

            {/* Jobs List */}
            <div className="mt-20 space-y-4">
              {jobPositions.map((job, index) => (
                <JobCard
                  key={job.id}
                  job={job}
                  index={index}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Culture Section */}
        <section className="relative py-32">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
              {/* Left Column */}
              <div>
                <SectionTitle title="Our Culture" align="left" />
                <div className="mt-12 space-y-6 text-lg font-light leading-relaxed text-neutral-600">
                  <p>
                    At Mouhajer Design, we believe exceptional spaces are
                    created by exceptional people. Our studio culture is built
                    on collaboration, creativity, and a relentless pursuit of
                    design excellence.
                  </p>
                  <p>
                    We foster an environment where ideas flourish, innovation
                    thrives, and every team member has the opportunity to make a
                    meaningful impact on projects that shape the urban landscape
                    of the UAE.
                  </p>
                  <p>
                    With over 150 projects completed, including partnerships
                    with Address Hotels and numerous award-winning developments,
                    our team works at the forefront of luxury architecture and
                    interior design.
                  </p>
                </div>
              </div>

              {/* Right Column - Stats */}
              <div className="flex items-center">
                <div className="grid w-full gap-8 sm:grid-cols-2">
                  <StatCard number="150+" label="Projects Delivered" />
                  <StatCard number="20+" label="Team Members" />
                  <StatCard number="10+" label="Years Experience" />
                  <StatCard number="5★" label="Client Rating" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Application CTA */}
        <section className="relative bg-neutral-950 py-32">
          <div className="mx-auto max-w-4xl px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="mb-6 text-5xl font-light tracking-tight text-white lg:text-6xl">
                Don&apos;t See a Fit?
              </h2>
              <p className="mb-12 text-lg font-light leading-relaxed text-white/70">
                We&apos;re always looking for talented individuals. Send us your
                portfolio and CV we&apos;d love to hear from you.
              </p>
              <a
                href="mailto:careers@mouhajerdesign.com"
                className="group inline-flex items-center gap-3 border border-white px-8 py-4 text-sm font-light tracking-widest text-white transition-all hover:bg-white hover:text-neutral-950"
              >
                SEND YOUR CV
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
            </motion.div>
          </div>
        </section>
      </div>

      <LogoMarquee />
      <Footer />
    </>
  );
}

// Section Title Component
function SectionTitle({
  title,
  dark = false,
  align = "center",
}: {
  title: string;
  dark?: boolean;
  align?: "left" | "center";
}) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8 }}
      className={align === "center" ? "text-center" : ""}
    >
      <h2
        className={`text-5xl font-light tracking-tight lg:text-6xl ${dark ? "text-neutral-950" : "text-neutral-950"}`}
      >
        {title}
      </h2>
    </motion.div>
  );
}

// Benefit Card Component
function BenefitCard({
  benefit,
  index,
}: {
  benefit: { icon: any; title: string; description: string };
  index: number;
}) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const Icon = benefit.icon;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group flex h-full flex-col"
    >
      <div className="mb-6 inline-flex h-16 w-16 items-center justify-center border border-neutral-200 transition-colors group-hover:border-neutral-950">
        <Icon className="h-8 w-8 text-neutral-950" strokeWidth={1} />
      </div>
      <h3 className="mb-3 text-xl font-light tracking-tight text-neutral-950">
        {benefit.title}
      </h3>
      <p className="flex-1 font-light leading-relaxed text-neutral-600">
        {benefit.description}
      </p>
    </motion.div>
  );
}

// Job Card Component
function JobCard({
  job,
  index,
}: {
  job: JobPosition;
  index: number;
}) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -30 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.05 }}
    >
      <Link
        href={`/careers/${job.slug}`}
        className="group block cursor-pointer border border-neutral-200 bg-white p-8 transition-all hover:border-neutral-950 hover:shadow-lg"
      >
        <div className="flex items-start justify-between gap-6">
          <div className="flex-1">
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <span className="text-xs font-light tracking-widest text-neutral-400">
                {job.department.toUpperCase()}
              </span>
              <span className="text-neutral-300">•</span>
              <div className="flex items-center gap-2 text-xs font-light text-neutral-500">
                <MapPin className="h-3 w-3" strokeWidth={1.5} />
                {job.location}
              </div>
              <span className="text-neutral-300">•</span>
              <div className="flex items-center gap-2 text-xs font-light text-neutral-500">
                <Clock className="h-3 w-3" strokeWidth={1.5} />
                {job.type}
              </div>
            </div>

            <h3 className="mb-2 text-2xl font-light tracking-tight text-neutral-950 transition-colors group-hover:text-neutral-700">
              {job.title}
            </h3>

            <p className="mb-4 font-light leading-relaxed text-neutral-600">
              {job.description}
            </p>

            <div className="flex items-center gap-4 text-sm font-light text-neutral-500">
              <span>Experience: {job.experience}</span>
              <span className="inline-flex items-center gap-1 text-[#c9a962] opacity-0 transition-opacity group-hover:opacity-100">
                View Details <ArrowRight size={14} />
              </span>
            </div>
          </div>

          <ChevronRight
            className="h-6 w-6 flex-shrink-0 text-neutral-400 transition-transform group-hover:translate-x-1 group-hover:text-neutral-950"
            strokeWidth={1}
          />
        </div>
      </Link>
    </motion.div>
  );
}

// Stat Card Component
function StatCard({ number, label }: { number: string; label: string }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.6 }}
      className="border border-neutral-200 p-8 text-center"
    >
      <div className="mb-3 text-5xl font-light tracking-tight text-neutral-950">
        {number}
      </div>
      <div className="text-sm font-light tracking-wider text-neutral-600">
        {label}
      </div>
    </motion.div>
  );
}

