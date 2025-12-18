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
      className="relative overflow-hidden bg-[#faf8f5] py-24 sm:py-32 lg:py-40"
    >
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#faf8f5] via-white/50 to-[#faf8f5]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(201,169,98,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(201,169,98,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
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
                <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#c9a962]/40" />
                <span className="font-Satoshi text-xs font-light uppercase tracking-[0.3em] text-neutral-500">
                  {collection.year}
                </span>
              </div>

              <h2 className="mb-4 font-SchnyderS text-3xl font-light text-neutral-900 sm:text-4xl lg:text-5xl">
                The {collection.year} Collection:{' '}
                <span className="text-[#c9a962]">{collection.title}</span>
              </h2>

              <p className="mb-3 max-w-3xl font-Satoshi text-base font-light text-neutral-600 lg:text-lg">
                {collection.description}
              </p>

              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4 text-[#c9a962]" strokeWidth={1.5} />
                <p className="font-Satoshi text-sm font-light italic text-[#c9a962]">
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
                  className="group relative overflow-hidden border border-[#c9a962]/20 bg-white/70 p-8 backdrop-blur-sm transition-all duration-300 hover:border-[#c9a962]/40 hover:bg-white/90 lg:p-10"
                >
                  <div className="grid gap-8 lg:grid-cols-12">
                    {/* Left - Title */}
                    <div className="lg:col-span-7">
                      <h3 className="mb-3 font-SchnyderS text-2xl font-light text-neutral-900 transition-colors group-hover:text-[#c9a962] lg:text-3xl">
                        {award.title}
                      </h3>

                      {award.project && (
                        <div className="mb-4 flex items-center gap-2">
                          <span className="font-Satoshi text-sm font-light uppercase tracking-wider text-neutral-500">
                            Project:
                          </span>
                          <span className="font-Satoshi text-base font-light text-neutral-700">
                            {award.project}
                          </span>
                        </div>
                      )}

                      {award.recipient && (
                        <div className="mb-4 flex items-center gap-2">
                          <span className="font-Satoshi text-sm font-light uppercase tracking-wider text-neutral-500">
                            Recipient:
                          </span>
                          <span className="font-Satoshi text-base font-light text-neutral-700">
                            {award.recipient}
                          </span>
                        </div>
                      )}

                      {award.level && (
                        <div className="mb-6 inline-flex items-center gap-2 border border-[#c9a962]/30 bg-[#c9a962]/5 px-4 py-2">
                          <span className="font-Satoshi text-sm font-light uppercase tracking-wider text-[#c9a962]">
                            {award.level}
                          </span>
                        </div>
                      )}

                      {/* Details */}
                      <div className="space-y-4">
                        {award.significance && (
                          <div className="border-l-2 border-[#c9a962]/50 pl-4">
                            <div className="mb-1 font-Satoshi text-xs font-medium uppercase tracking-wider text-[#c9a962]">
                              Significance
                            </div>
                            <p className="font-Satoshi text-sm font-light leading-relaxed text-neutral-600">
                              {award.significance}
                            </p>
                          </div>
                        )}

                        {award.verdict && (
                          <div className="border-l-2 border-[#c9a962]/50 pl-4">
                            <div className="mb-1 font-Satoshi text-xs font-medium uppercase tracking-wider text-[#c9a962]">
                              Verdict
                            </div>
                            <p className="font-Satoshi text-sm font-light leading-relaxed text-neutral-600">
                              {award.verdict}
                            </p>
                          </div>
                        )}

                        {award.challenge && (
                          <div className="border-l-2 border-[#c9a962]/50 pl-4">
                            <div className="mb-1 font-Satoshi text-xs font-medium uppercase tracking-wider text-[#c9a962]">
                              The Challenge
                            </div>
                            <p className="font-Satoshi text-sm font-light leading-relaxed text-neutral-600">
                              {award.challenge}
                            </p>
                          </div>
                        )}

                        {award.result && (
                          <div className="border-l-2 border-[#c9a962]/50 pl-4">
                            <div className="mb-1 font-Satoshi text-xs font-medium uppercase tracking-wider text-[#c9a962]">
                              The Result
                            </div>
                            <p className="font-Satoshi text-sm font-light leading-relaxed text-neutral-600">
                              {award.result}
                            </p>
                          </div>
                        )}

                        {award.scope && (
                          <div className="border-l-2 border-[#c9a962]/50 pl-4">
                            <div className="mb-1 font-Satoshi text-xs font-medium uppercase tracking-wider text-[#c9a962]">
                              Scope
                            </div>
                            <p className="font-Satoshi text-sm font-light leading-relaxed text-neutral-600">
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
                          className="group/btn flex items-center justify-between border border-[#c9a962]/20 bg-white/60 px-6 py-4 transition-all hover:border-[#c9a962]/40 hover:bg-white/80"
                        >
                          <div className="flex items-center gap-3">
                            <Download className="h-5 w-5 text-[#c9a962]" strokeWidth={1.5} />
                            <span className="font-Satoshi text-sm font-light text-neutral-900">
                              View Certificate
                            </span>
                          </div>
                          <ExternalLink className="h-4 w-4 text-neutral-500 transition-transform group-hover/btn:translate-x-1" strokeWidth={1.5} />
                        </a>

                        {/* View Project */}
                        {award.projectSlug && (
                          <Link
                            href={`/projects/${award.projectSlug}`}
                            className="group/btn flex items-center justify-between border border-[#c9a962]/30 bg-[#c9a962]/5 px-6 py-4 transition-all hover:border-[#c9a962]/50 hover:bg-[#c9a962]/10"
                          >
                            <span className="font-Satoshi text-sm font-light text-[#c9a962]">
                              View Project
                            </span>
                            <ArrowRight className="h-4 w-4 text-[#c9a962] transition-transform group-hover/btn:translate-x-1" strokeWidth={1.5} />
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Number */}
                  <div className="absolute right-6 top-6 font-SchnyderS text-6xl font-extralight text-[#c9a962]/10 lg:text-7xl">
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
          className="mt-32 border-t border-[#c9a962]/20 pt-16 text-center lg:mt-40"
        >
          <h3 className="mb-6 font-SchnyderS text-3xl font-light text-neutral-900 lg:text-4xl">
            See the Work Behind the Wins
          </h3>
          <p className="mb-10 font-Satoshi text-base font-light text-neutral-600">
            Don&apos;t just look at the trophies. Explore the projects that earned them.
          </p>

          <Link
            href="/projects"
            className="group inline-flex items-center gap-3 border border-[#c9a962] bg-[#c9a962] px-10 py-5 font-Satoshi text-sm font-light uppercase tracking-wider text-neutral-950 transition-all hover:bg-[#c9a962]/90"
          >
            <span>View Our Portfolio</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" strokeWidth={1} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
