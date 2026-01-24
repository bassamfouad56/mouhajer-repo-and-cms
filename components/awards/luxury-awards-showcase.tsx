"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  Trophy,
  ArrowUpRight,
  X,
  Download,
  Award as AwardIcon,
  Sparkles,
} from "lucide-react";
import { SafeImage } from "@/components/safe-image";
import Link from "next/link";

interface Award {
  id: string;
  title: string;
  project: string;
  projectSlug?: string;
  projectImage?: string;
  year: number;
  organization: string;
  level: string;
  certificate: string;
  description?: string;
}

interface LuxuryAwardsShowcaseProps {
  awards: Award[];
}

export function LuxuryAwardsShowcase({ awards }: LuxuryAwardsShowcaseProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [selectedAward, setSelectedAward] = useState<Award | null>(null);

  return (
    <>
      <section ref={sectionRef} className="relative bg-[#faf8f5] py-40">
        {/* Subtle background pattern */}

        <div className="container relative z-10 mx-auto px-6 lg:px-16 xl:px-24">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
            className="mb-32 text-center"
          >
            <div className="mb-8 flex items-center justify-center gap-6">
              <div className="h-px w-20 bg-linear-to-r from-transparent to-[#8f7852]" />
              <div className="flex items-center gap-3">
                <Sparkles
                  className="h-4 w-4 text-[#8f7852]"
                  strokeWidth={1.5}
                />
                <span className="font-Satoshi text-xs font-light uppercase tracking-[0.35em] text-neutral-500">
                  Gallery of Excellence
                </span>
                <Sparkles
                  className="h-4 w-4 text-[#8f7852]"
                  strokeWidth={1.5}
                />
              </div>
              <div className="h-px w-20 bg-linear-to-l from-transparent to-[#8f7852]" />
            </div>

            <h2 className="mb-8 font-SchnyderS text-6xl font-light tracking-tight text-neutral-900 md:text-7xl lg:text-8xl">
              Recognition &<br />
              <span className="text-[#8f7852]">Achievement</span>
            </h2>

            <p className="mx-auto max-w-3xl font-Satoshi text-lg font-light leading-relaxed text-neutral-600 md:text-xl">
              Each award represents a project where we transcended expectations,
              <br className="hidden md:block" />
              pushing the boundaries of design, craftsmanship, and execution
              excellence.
            </p>
          </motion.div>

          {/* Awards Grid */}
          <div className="space-y-40">
            {awards.map((award, index) => (
              <AwardShowcaseItem
                key={award.id}
                award={award}
                index={index}
                isInView={isInView}
                onViewCertificate={() => setSelectedAward(award)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Fullscreen Certificate Modal */}
      <AnimatePresence>
        {selectedAward && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/98 p-4 backdrop-blur-md"
            onClick={() => setSelectedAward(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative h-[90vh] w-full container"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedAward(null)}
                className="absolute -right-6 -top-6 z-10 flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-neutral-900/80 text-white backdrop-blur-xl transition-all hover:border-[#8f7852]/50 hover:bg-neutral-900"
              >
                <X className="h-5 w-5" strokeWidth={1.5} />
              </button>

              {/* Certificate */}
              <div className="h-full w-full overflow-hidden rounded-2xl border border-white/10 bg-white shadow-[0_0_80px_rgba(201,169,98,0.15)]">
                <iframe
                  src={selectedAward.certificate}
                  className="h-full w-full"
                  title={`${selectedAward.title} Certificate - Full View`}
                />
              </div>

              {/* Download Button */}
              <a
                href={selectedAward.certificate}
                download
                className="absolute -bottom-20 left-1/2 flex -translate-x-1/2 items-center gap-3 rounded-full border border-white/20 bg-neutral-900/80 px-8 py-4 font-Satoshi text-sm font-light text-white backdrop-blur-xl transition-all hover:border-[#8f7852]/50 hover:bg-neutral-900"
              >
                <Download className="h-4 w-4" strokeWidth={1.5} />
                Download Certificate
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function AwardShowcaseItem({
  award,
  index,
  isInView,
  onViewCertificate,
}: {
  award: Award;
  index: number;
  isInView: boolean;
  onViewCertificate: () => void;
}) {
  const itemRef = useRef<HTMLDivElement>(null);
  const itemInView = useInView(itemRef, {
    once: true,
    margin: "-150px",
    amount: 0.3,
  });
  const isEven = index % 2 === 0;

  return (
    <div ref={itemRef} className="relative">
      <div
        className={`grid gap-16 lg:grid-cols-2 lg:gap-20 ${
          isEven ? "" : "lg:grid-flow-dense"
        }`}
      >
        {/* Certificate Section */}
        <motion.div
          initial={{ opacity: 0, x: isEven ? -60 : 60 }}
          animate={itemInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          className={`relative ${isEven ? "" : "lg:col-start-2"}`}
        >
          <div className="sticky top-32">
            {/* Award Level Badge */}
            {/* <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={itemInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mb-6 inline-flex items-center gap-3 rounded-full border border-[#8f7852]/20 bg-[#8f7852]/5 px-5 py-2.5 backdrop-blur-sm hidden"
            >
              <Trophy className="h-4 w-4 text-[#8f7852]" strokeWidth={1.5} />
              <span className="font-Satoshi text-sm font-medium text-[#8f7852]">
                {award.level}
              </span>
            </motion.div> */}

            {/* Certificate Preview */}
            <div className="group/cert relative overflow-hidden rounded-2xl border border-[#8f7852]/20 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all duration-500 hover:shadow-[0_20px_60px_rgba(201,169,98,0.15)]">
              <div className="aspect-[8.5/11] w-full">
                <iframe
                  src={`${award.certificate}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
                  className="h-full w-full"
                  title={`${award.title} Certificate`}
                />
              </div>

              {/* Hover Overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-[#faf8f5]/95 opacity-0 backdrop-blur-sm transition-all duration-500 group-hover/cert:opacity-100">
                <div className="flex gap-4">
                  <button
                    onClick={onViewCertificate}
                    className="flex items-center gap-2 rounded-full border border-[#8f7852]/30 bg-[#8f7852]/10 px-7 py-3.5 font-Satoshi text-sm font-light text-neutral-900 backdrop-blur-sm transition-all hover:border-[#8f7852] hover:bg-[#8f7852]/20"
                  >
                    <ArrowUpRight className="h-4 w-4" strokeWidth={1.5} />
                    View Full Size
                  </button>
                  <a
                    href={award.certificate}
                    download
                    className="flex items-center gap-2 rounded-full border border-[#8f7852]/30 bg-[#8f7852]/10 px-7 py-3.5 font-Satoshi text-sm font-light text-neutral-900 backdrop-blur-sm transition-all hover:border-[#8f7852] hover:bg-[#8f7852]/20"
                  >
                    <Download className="h-4 w-4" strokeWidth={1.5} />
                    Download
                  </a>
                </div>
              </div>

              {/* Decorative corner accents */}
              <div className="pointer-events-none absolute left-8 top-8 h-12 w-12 border-l-2 border-t-2 border-[#8f7852]/30 transition-all duration-500 group-hover/cert:h-16 group-hover/cert:w-16 group-hover/cert:border-[#8f7852]/60" />
              <div className="pointer-events-none absolute bottom-8 right-8 h-12 w-12 border-b-2 border-r-2 border-[#8f7852]/30 transition-all duration-500 group-hover/cert:h-16 group-hover/cert:w-16 group-hover/cert:border-[#8f7852]/60" />
            </div>
          </div>
        </motion.div>

        {/* Award Details & Project Section */}
        <motion.div
          initial={{ opacity: 0, x: isEven ? 60 : -60 }}
          animate={itemInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          className={`flex flex-col justify-center ${
            isEven ? "" : "lg:col-start-1 lg:row-start-1"
          }`}
        >
          {/* Award Metadata */}
          <div className="mb-8 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-3 font-Satoshi text-sm font-light text-neutral-500">
              <AwardIcon className="h-4 w-4 text-[#8f7852]" strokeWidth={1.5} />
              <span>{award.year}</span>
            </div>
            <div className="h-1 w-1 rounded-full bg-neutral-300" />
            <span className="font-Satoshi text-sm font-light text-neutral-500">
              {award.organization}
            </span>
          </div>

          {/* Award Title */}
          <h3 className="mb-6 font-SchnyderS text-5xl font-light leading-[1.1] tracking-tight text-neutral-900 md:text-6xl lg:text-7xl">
            {award.title}
          </h3>

          {/* Award Description */}
          {award.description && (
            <p className="mb-10 font-Satoshi text-lg font-light leading-relaxed text-neutral-600">
              {award.description}
            </p>
          )}

          {/* Decorative divider */}
          <div className="mb-10 h-px w-24 bg-linear-to-r from-[#8f7852] to-transparent" />

          {/* Winning Project */}
          {award.projectSlug && (
            <div>
              <div className="mb-6">
                <span className="mb-2 block font-Satoshi text-xs font-light uppercase tracking-[0.3em] text-neutral-500">
                  Winning Project
                </span>
                <h4 className="font-SchnyderS text-3xl font-light text-neutral-900 md:text-4xl">
                  {award.project}
                </h4>
              </div>

              {award.projectImage && (
                <Link
                  href={`/en/projects/${award.projectSlug}`}
                  className="group/project block"
                >
                  <div className="relative overflow-hidden rounded-xl">
                    <div className="aspect-16/10 w-full">
                      <SafeImage
                        src={award.projectImage}
                        alt={award.project}
                        fill
                        className="object-cover transition-transform duration-700 group-hover/project:scale-105"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                      />
                    </div>

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-linear-to-t from-neutral-950/80 via-neutral-950/20 to-transparent opacity-60 transition-opacity duration-500 group-hover/project:opacity-80" />

                    {/* View project button */}
                    <div className="absolute bottom-0 left-0 right-0 translate-y-full p-8 transition-transform duration-500 group-hover/project:translate-y-0">
                      <div className="flex items-center gap-3 font-Satoshi text-sm font-light text-white">
                        <span>View Project Details</span>
                        <ArrowUpRight
                          className="h-4 w-4 transition-transform group-hover/project:translate-x-1 group-hover/project:-translate-y-1"
                          strokeWidth={1.5}
                        />
                      </div>
                    </div>

                    {/* Corner accent */}
                    <div className="pointer-events-none absolute right-8 top-8 h-12 w-12 border-r-2 border-t-2 border-white/40 transition-all duration-500 group-hover/project:h-16 group-hover/project:w-16 group-hover/project:border-[#8f7852]" />
                  </div>
                </Link>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
