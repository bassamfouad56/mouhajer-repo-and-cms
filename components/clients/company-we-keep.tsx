"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { CheckCircle2, TrendingUp, Shield } from "lucide-react";
import { urlForImage } from "@/sanity/lib/image";

interface SanityClient {
  _id: string;
  name: string;
  slug?: { current: string };
  logo?: any;
  category?: string;
  projects?: string[];
  projectsText?: string;
  description?: string;
  isFrameworkContract?: boolean;
  isConfidential?: boolean;
  featured?: boolean;
  icon?: string;
}

interface CompanyWeKeepProps {
  clients?: SanityClient[];
}

const highlights = [
  {
    icon: CheckCircle2,
    text: "Framework contracts with government-backed developers",
  },
  {
    icon: TrendingUp,
    text: "Consistent repeat business from hospitality leaders",
  },
  {
    icon: Shield,
    text: "Preferred partner for projects that cannot afford mistakes",
  },
];

// Fallback case studies if no Sanity data
const defaultCaseStudies = [
  {
    client: "Abu Dhabi National Hotels (ADNH)",
    projects: ["Sheraton Renovation", "Radisson Blu Upgrade"],
    description:
      "When ADNH needed to renovate the Sheraton, they called us. When they needed to upgrade the Radisson Blu, they called us again.",
  },
  {
    client: "Wasl Asset Management",
    projects: ["Park Hyatt Villas", "Emirates Golf Club"],
    description:
      "When Wasl needed a partner for the Park Hyatt villas, they chose MIDC. Trust earned through flawless execution.",
  },
];

export function CompanyWeKeep({ clients = [] }: CompanyWeKeepProps) {
  // Transform Sanity clients into case studies format
  const caseStudies =
    clients.length > 0
      ? clients.slice(0, 4).map((client) => ({
          client: client.name,
          projects:
            client.projects ||
            (client.projectsText ? client.projectsText.split(", ") : []),
          description:
            client.description ||
            `Trusted partner for ${client.name}'s premium projects.`,
          logo: client.logo,
        }))
      : defaultCaseStudies;
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-white py-24 sm:py-32 lg:py-40"
    >
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute right-0 top-1/4 h-[600px] w-[600px] rounded-full bg-[#8f7852]/[0.03] blur-[150px]" />
        <div className="absolute left-0 bottom-1/4 h-[500px] w-[500px] rounded-full bg-neutral-900/[0.02] blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-12">
        {/* Header */}
        <div className="mb-16 lg:mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="mb-6 flex items-center gap-4"
          >
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-neutral-300" />
            <span className="font-Satoshi text-xs font-light uppercase tracking-[0.3em] text-neutral-400">
              Our Partners
            </span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-neutral-300" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mb-8 font-SchnyderS text-4xl font-light tracking-tight text-neutral-950 sm:text-5xl lg:text-6xl"
          >
            The Company We Keep.
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-3xl"
          >
            <p className="mb-6 font-Satoshi text-lg font-light leading-relaxed text-neutral-600 lg:text-xl">
              In the construction industry, trust is hard to earn and easy to
              lose. That is why Eng. Maher Mouhajer is proudest not of the
              projects we have won, but of the clients who keep coming back.
            </p>
            <p className="font-Satoshi text-lg font-light leading-relaxed text-neutral-600 lg:text-xl">
              Our portfolio is defined by framework contracts and repeat
              business. We are the preferred partner for clients who cannot
              afford a mistake.
            </p>
          </motion.div>
        </div>

        {/* Highlights Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mb-20 grid gap-6 sm:grid-cols-3 lg:gap-8"
        >
          {highlights.map((highlight, index) => {
            const Icon = highlight.icon;
            return (
              <div
                key={index}
                className="group relative overflow-hidden border border-neutral-200 bg-white p-6 shadow-sm transition-all duration-500 hover:border-[#8f7852]/30 hover:shadow-lg lg:p-8"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center border border-[#8f7852]/20 bg-[#8f7852]/5">
                  <Icon className="h-6 w-6 text-[#8f7852]" strokeWidth={1.5} />
                </div>
                <p className="font-Satoshi text-sm font-light leading-relaxed text-neutral-700 lg:text-base">
                  {highlight.text}
                </p>
                {/* Accent Line */}
                <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-[#8f7852] to-transparent transition-all duration-500 group-hover:w-full" />
              </div>
            );
          })}
        </motion.div>

        {/* Case Studies */}
        <div className="space-y-8 lg:space-y-12">
          {caseStudies.map((study, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 + index * 0.1 }}
              className="group relative overflow-hidden border-l-2 border-[#8f7852]/30 bg-neutral-50 p-8 transition-all duration-500 hover:border-[#8f7852] hover:bg-white hover:shadow-lg lg:p-12"
            >
              {/* Client Name */}
              <h3 className="mb-4 font-SchnyderS text-2xl font-light text-neutral-950 lg:text-3xl">
                {study.client}
              </h3>

              {/* Projects */}
              <div className="mb-6 flex flex-wrap gap-3">
                {study.projects.map((project, pIndex) => (
                  <span
                    key={pIndex}
                    className="border border-[#8f7852]/20 bg-[#8f7852]/5 px-4 py-2 font-Satoshi text-xs font-light uppercase tracking-wider text-[#8f7852]"
                  >
                    {project}
                  </span>
                ))}
              </div>

              {/* Description */}
              <p className="max-w-2xl font-Satoshi text-base font-light leading-relaxed text-neutral-600 lg:text-lg">
                {study.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
