'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Quote, Building2, Hotel, Briefcase } from 'lucide-react';

const clientCategories = [
  {
    id: 'developers',
    icon: Building2,
    title: 'Developers',
    clients: ['Emaar', 'Nakheel', 'Meydan', 'Sobha', 'Wasl', 'DAMAC'],
  },
  {
    id: 'hospitality',
    icon: Hotel,
    title: 'Hospitality',
    clients: ['Marriott', 'Ritz-Carlton', 'Sofitel', 'Radisson', 'Grand Hyatt', 'Sheraton'],
  },
  {
    id: 'corporate',
    icon: Briefcase,
    title: 'Corporate',
    clients: ['DMCC', 'JLT', 'SBK Holding', 'ADNH'],
  },
];

const testimonials = [
  {
    quote: 'One of the standout qualities of MIDC is their dedication to meeting project timelines without compromising quality. MIDC has consistently demonstrated a strong commitment to meeting project timelines while maintaining high-quality standards. Their clear communication and attention to detail helped keep projects on track, even when handling complex requirements.',
    author: 'Ghaleb Al Najjar',
    title: 'Consultant – Projects and Infrastructure',
    company: 'Abu Dhabi National Hotels',
  },
  {
    quote: 'Throughout our collaboration, MIDC has consistently demonstrated exceptional skill, professionalism, and a strong commitment to delivering high-quality outcomes. They have been instrumental in the successful execution of our hotel refurbishment, design and built projects. Their work on Hyatt Hotels Dubai surpassed our expectations.',
    author: 'Sayed Mohammed Al Sayed',
    title: 'Director of Area Procurement',
    company: 'Grand Hyatt Hotels Dubai',
  },
];

export function AboutClients() {
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
        {/* Header */}
        <div className="mb-16 text-center lg:mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="mb-6 flex items-center justify-center gap-4"
          >
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#c9a962]/50" />
            <span className="font-Satoshi text-xs font-light uppercase tracking-[0.3em] text-white/40">
              Strategic Partners
            </span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#c9a962]/50" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mb-6 font-SchnyderS text-4xl font-light tracking-tight text-white sm:text-5xl lg:text-6xl"
          >
            Trusted by The Region&apos;s
            <br />
            <span className="text-white/30">Visionaries</span>
          </motion.h2>
        </div>

        {/* Client Categories */}
        <div className="mb-20 grid gap-8 md:grid-cols-3">
          {clientCategories.map((category, index) => {
            const Icon = category.icon;
            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                className="border border-white/5 bg-white/[0.02] p-8 backdrop-blur-sm"
              >
                <div className="mb-6 flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center border border-[#c9a962]/30 bg-[#c9a962]/5">
                    <Icon className="h-5 w-5 text-[#c9a962]" strokeWidth={1} />
                  </div>
                  <h3 className="font-SchnyderS text-xl font-light text-white">
                    {category.title}
                  </h3>
                </div>

                <div className="flex flex-wrap gap-2">
                  {category.clients.map((client) => (
                    <span
                      key={client}
                      className="border border-white/10 bg-white/[0.02] px-4 py-2 font-Satoshi text-sm font-light text-white/60"
                    >
                      {client}
                    </span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Testimonials */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-12 text-center"
          >
            <h3 className="font-SchnyderS text-2xl font-light text-white lg:text-3xl">
              Endorsements of Excellence
            </h3>
            <p className="mt-2 font-Satoshi text-sm font-light text-white/40">
              We are proud to be the trusted partner for the region&apos;s most ambitious hospitality brands and private visionaries.
            </p>
          </motion.div>

          <div className="grid gap-8 lg:grid-cols-2">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.author}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.5 + index * 0.15 }}
                className="relative border border-white/5 bg-white/[0.02] p-8 backdrop-blur-sm lg:p-10"
              >
                {/* Quote Icon */}
                <Quote className="mb-6 h-8 w-8 text-[#c9a962]/30" strokeWidth={1} />

                {/* Quote */}
                <p className="mb-8 font-Satoshi text-base font-light leading-relaxed text-white/70">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>

                {/* Author */}
                <div className="border-t border-white/5 pt-6">
                  <div className="font-SchnyderS text-lg font-light text-white">
                    {testimonial.author}
                  </div>
                  <div className="font-Satoshi text-sm font-light text-white/50">
                    {testimonial.title}
                  </div>
                  <div className="mt-1 font-Satoshi text-xs font-light text-[#c9a962]">
                    {testimonial.company}
                  </div>
                </div>

                {/* Corner accent */}
                <div className="absolute right-0 top-0 h-16 w-16 border-r border-t border-[#c9a962]/10" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
