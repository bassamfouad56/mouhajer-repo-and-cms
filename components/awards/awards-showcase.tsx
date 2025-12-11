'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Trophy, Download, ExternalLink, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const awardsCollections = [
  {
    id: '2023-2024',
    year: '2023-2024',
    title: 'Regional Dominance',
    description: 'A landmark year for MIDC. We did not just win in Dubai; we were recognized as the best in the entire Arabian region for hospitality design.',
    organization: 'The International Property Awards (Arabian Region)',
    awards: [
      {
        trophy: '🏆',
        title: 'Best Hotel Suite Interior (Arabia)',
        project: 'Address Boulevard VIP Suite',
        level: 'Regional Winner',
        significance: 'This is one of the highest honors in the industry. It acknowledges that the VIP Suite we designed and built is the finest example of luxury hospitality across the entire Arabian Peninsula.',
        certificate: '/awards/APA - 2023-2024 Best Hotel Suite Interior Arabia - Address Boulevard VIP Suite.pdf',
        projectSlug: 'address-boulevard-vip-suite',
      },
      {
        trophy: '🏆',
        title: 'Best Hotel Suite Interior (Dubai)',
        project: 'Address Boulevard VIP Suite',
        level: '5-Star Winner',
        verdict: 'Recognized for its "Uncluttered Baroque" style, blending functional luxury with aesthetic grandeur.',
        certificate: '/awards/APA - 2023-2024 Best Hotel Suite Interior Dubai - Address Boulevard VIP Suite.pdf',
        projectSlug: 'address-boulevard-vip-suite',
      },
      {
        trophy: '🏆',
        title: 'Best Residential Interior Apartment (Dubai)',
        project: 'Boulevard Penthouse 70-71',
        level: '5-Star Winner',
        verdict: 'Awarded for the immaculate joinery and bespoke furniture that transformed this high-altitude penthouse into a Fendi-inspired sanctuary.',
        certificate: '/awards/APA - 2023-2024 Best Residential Interior Apartment Dubai - Address Boulevard Penthouse 70-71.pdf',
        projectSlug: 'boulevard-penthouse-70-71',
      },
    ],
  },
  {
    id: '2022-2023',
    year: '2022-2023',
    title: 'Revitalizing Heritage',
    description: 'Modernizing iconic landmarks while preserving their soul.',
    organization: 'The International Property Awards (Arabian Region)',
    awards: [
      {
        trophy: '🏆',
        title: 'Best Hotel Interior (Abu Dhabi)',
        project: 'Sheraton Abu Dhabi Hotel & Resort',
        level: '5-Star Winner',
        challenge: 'To modernize a heritage landmark without losing its soul.',
        result: 'A complete transformation of the Lobby, VIP Lounge, and Le Bistrot that honors the past while embracing the future.',
        certificate: '/awards/APA - 2022-2023 Best Hotel Interior Abu Dhabi - Sheraton Abu Dhabi (2).pdf',
        projectSlug: 'sheraton-abu-dhabi-hotel-resort',
      },
    ],
  },
  {
    id: '2021',
    year: '2021',
    title: 'The Triple Crown',
    description: 'In 2021, we proved our versatility by winning across three distinct categories, cementing our status as a holistic design firm.',
    organization: 'Luxury Lifestyle Awards',
    awards: [
      {
        trophy: '🏆',
        title: 'The Best Luxury Interior Design Studio (Dubai)',
        recipient: 'Mouhajer International Design',
        significance: 'An overall acknowledgement of our studio\'s capability, creativity, and professional reputation in the market.',
        certificate: '/awards/Luxury Lifestyle - 2021 Certificate of Recognition.pdf',
      },
      {
        trophy: '🏆',
        title: 'Best Luxury Hotel Interior Design',
        project: 'Sofitel Hotel Dubai JBR',
        scope: 'Recognized for the sophisticated upgrade of public areas, blending French elegance with local culture.',
        certificate: '/awards/Luxury Lifestyle - 2021 Certificate of Recognition.pdf',
        projectSlug: 'sofitel-hotel-dubai-jbr',
      },
      {
        trophy: '🏆',
        title: 'Best Luxury Residential Interior Design',
        project: 'Private Villa in Dubai',
        scope: 'A testament to our ability to deliver bespoke, turnkey luxury for private clients who demand absolute discretion and quality.',
        certificate: '/awards/Luxury Lifestyle - 2021 Certificate of Recognition.pdf',
      },
    ],
  },
];

export function AwardsShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-neutral-950 py-24 sm:py-32 lg:py-40"
    >
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-12">
        {/* Collections */}
        {awardsCollections.map((collection, collectionIndex) => (
          <div key={collection.id} className={collectionIndex > 0 ? 'mt-32 lg:mt-40' : ''}>
            {/* Collection Header */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="mb-16 lg:mb-24"
            >
              <div className="mb-6 flex items-center gap-4">
                <div className="h-px w-12 bg-gradient-to-r from-transparent to-white/30" />
                <span className="font-Satoshi text-xs font-light uppercase tracking-[0.3em] text-white/40">
                  {collection.year}
                </span>
              </div>

              <h2 className="mb-4 font-SchnyderS text-3xl font-light text-white sm:text-4xl lg:text-5xl">
                The {collection.year} Collection:{' '}
                <span className="text-[#d4af37]">{collection.title}</span>
              </h2>

              <p className="mb-3 max-w-3xl font-Satoshi text-base font-light text-white/60 lg:text-lg">
                {collection.description}
              </p>

              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4 text-[#d4af37]" strokeWidth={1.5} />
                <p className="font-Satoshi text-sm font-light italic text-[#d4af37]">
                  {collection.organization}
                </p>
              </div>
            </motion.div>

            {/* Awards Grid */}
            <div className="space-y-6 lg:space-y-8">
              {collection.awards.map((award, awardIndex) => (
                <motion.div
                  key={awardIndex}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: awardIndex * 0.1 }}
                  className="group relative overflow-hidden border border-white/5 bg-white/[0.02] p-8 backdrop-blur-sm transition-all duration-300 hover:border-[#d4af37]/20 hover:bg-white/[0.04] lg:p-10"
                >
                  <div className="grid gap-8 lg:grid-cols-12">
                    {/* Left - Title */}
                    <div className="lg:col-span-7">
                      <h3 className="mb-3 font-SchnyderS text-2xl font-light text-white transition-colors group-hover:text-[#d4af37] lg:text-3xl">
                        {award.title}
                      </h3>

                      {award.project && (
                        <div className="mb-4 flex items-center gap-2">
                          <span className="font-Satoshi text-sm font-light uppercase tracking-wider text-white/40">
                            Project:
                          </span>
                          <span className="font-Satoshi text-base font-light text-white/70">
                            {award.project}
                          </span>
                        </div>
                      )}

                      {award.recipient && (
                        <div className="mb-4 flex items-center gap-2">
                          <span className="font-Satoshi text-sm font-light uppercase tracking-wider text-white/40">
                            Recipient:
                          </span>
                          <span className="font-Satoshi text-base font-light text-white/70">
                            {award.recipient}
                          </span>
                        </div>
                      )}

                      {award.level && (
                        <div className="mb-6 inline-flex items-center gap-2 border border-[#d4af37]/30 bg-[#d4af37]/5 px-4 py-2">
                          <span className="font-Satoshi text-sm font-light uppercase tracking-wider text-[#d4af37]">
                            {award.level}
                          </span>
                        </div>
                      )}

                      {/* Details */}
                      <div className="space-y-4">
                        {award.significance && (
                          <div className="border-l-2 border-[#d4af37]/50 pl-4">
                            <div className="mb-1 font-Satoshi text-xs font-medium uppercase tracking-wider text-[#d4af37]">
                              Significance
                            </div>
                            <p className="font-Satoshi text-sm font-light leading-relaxed text-white/60">
                              {award.significance}
                            </p>
                          </div>
                        )}

                        {award.verdict && (
                          <div className="border-l-2 border-[#d4af37]/50 pl-4">
                            <div className="mb-1 font-Satoshi text-xs font-medium uppercase tracking-wider text-[#d4af37]">
                              Verdict
                            </div>
                            <p className="font-Satoshi text-sm font-light leading-relaxed text-white/60">
                              {award.verdict}
                            </p>
                          </div>
                        )}

                        {award.challenge && (
                          <div className="border-l-2 border-[#d4af37]/50 pl-4">
                            <div className="mb-1 font-Satoshi text-xs font-medium uppercase tracking-wider text-[#d4af37]">
                              The Challenge
                            </div>
                            <p className="font-Satoshi text-sm font-light leading-relaxed text-white/60">
                              {award.challenge}
                            </p>
                          </div>
                        )}

                        {award.result && (
                          <div className="border-l-2 border-[#d4af37]/50 pl-4">
                            <div className="mb-1 font-Satoshi text-xs font-medium uppercase tracking-wider text-[#d4af37]">
                              The Result
                            </div>
                            <p className="font-Satoshi text-sm font-light leading-relaxed text-white/60">
                              {award.result}
                            </p>
                          </div>
                        )}

                        {award.scope && (
                          <div className="border-l-2 border-[#d4af37]/50 pl-4">
                            <div className="mb-1 font-Satoshi text-xs font-medium uppercase tracking-wider text-[#d4af37]">
                              Scope
                            </div>
                            <p className="font-Satoshi text-sm font-light leading-relaxed text-white/60">
                              {award.scope}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right - Actions */}
                    <div className="flex flex-col justify-between lg:col-span-5">
                      <div className="space-y-4">
                        {/* Download Certificate */}
                        <a
                          href={award.certificate}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group/btn flex items-center justify-between border border-white/10 bg-white/[0.02] px-6 py-4 transition-all hover:border-[#d4af37]/30 hover:bg-white/[0.04]"
                        >
                          <div className="flex items-center gap-3">
                            <Download className="h-5 w-5 text-[#d4af37]" strokeWidth={1.5} />
                            <span className="font-Satoshi text-sm font-light text-white">
                              View Certificate
                            </span>
                          </div>
                          <ExternalLink className="h-4 w-4 text-white/40 transition-transform group-hover/btn:translate-x-1" strokeWidth={1.5} />
                        </a>

                        {/* View Project */}
                        {award.projectSlug && (
                          <Link
                            href={`/projects/${award.projectSlug}`}
                            className="group/btn flex items-center justify-between border border-[#d4af37]/30 bg-[#d4af37]/5 px-6 py-4 transition-all hover:border-[#d4af37]/50 hover:bg-[#d4af37]/10"
                          >
                            <span className="font-Satoshi text-sm font-light text-[#d4af37]">
                              View Project
                            </span>
                            <ArrowRight className="h-4 w-4 text-[#d4af37] transition-transform group-hover/btn:translate-x-1" strokeWidth={1.5} />
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Number */}
                  <div className="absolute right-6 top-6 font-SchnyderS text-6xl font-extralight text-white/[0.03] lg:text-7xl">
                    0{collectionIndex + 1}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}

        {/* Final CTA */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-32 border-t border-white/5 pt-16 text-center lg:mt-40"
        >
          <h3 className="mb-6 font-SchnyderS text-3xl font-light text-white lg:text-4xl">
            See the Work Behind the Wins
          </h3>
          <p className="mb-10 font-Satoshi text-base font-light text-white/60">
            Don&apos;t just look at the trophies. Explore the projects that earned them.
          </p>

          <Link
            href="/projects"
            className="group inline-flex items-center gap-3 border border-[#d4af37]/30 bg-[#d4af37]/5 px-10 py-5 font-Satoshi text-sm font-light uppercase tracking-wider text-white transition-all hover:border-[#d4af37]/50 hover:bg-[#d4af37]/10"
          >
            <span>View Our Portfolio</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" strokeWidth={1} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
