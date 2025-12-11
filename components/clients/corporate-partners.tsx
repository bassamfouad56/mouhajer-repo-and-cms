'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Building2, Store, Briefcase, TrendingUp } from 'lucide-react';

interface SanityClient {
  _id: string;
  name: string;
  projectsText?: string;
  category?: string;
  icon?: string;
}

interface CorporatePartnersProps {
  clients?: SanityClient[];
}

const iconMap: Record<string, typeof Building2> = {
  building: Building2,
  building2: Building2,
  store: Store,
  briefcase: Briefcase,
  trendingup: TrendingUp,
  trending: TrendingUp,
};

const categoryLabels: Record<string, string> = {
  corporate: 'Corporate Office',
  retail: 'Commercial Retail',
  manufacturing: 'Luxury Manufacturing',
};

// Fallback partners if no Sanity data
const defaultCorporatePartners = [
  {
    name: 'Osoul',
    project: 'C1 Headquarters, Abu Dhabi',
    category: 'Corporate Office',
    icon: Building2,
  },
  {
    name: 'Dubai Golf',
    project: 'Villas & Resort Upgrades',
    category: 'Luxury Residential',
    icon: Briefcase,
  },
  {
    name: 'Emaar Malls',
    project: 'Retail Fit-outs',
    category: 'Commercial Retail',
    icon: Store,
  },
  {
    name: 'Louis Vuitton Manufactures',
    project: 'Specialized Projects',
    category: 'Luxury Manufacturing',
    icon: TrendingUp,
  },
];

export function CorporatePartners({ clients = [] }: CorporatePartnersProps) {
  // Transform Sanity clients or use defaults
  const corporatePartners = clients.length > 0
    ? clients.map((client, idx) => ({
        name: client.name,
        project: client.projectsText || '',
        category: client.category ? (categoryLabels[client.category] || client.category) : 'Corporate',
        icon: client.icon ? (iconMap[client.icon.toLowerCase()] || Building2) : [Building2, Briefcase, Store, TrendingUp][idx % 4],
      }))
    : defaultCorporatePartners;
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-white py-24 sm:py-32 lg:py-40"
    >
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute left-0 top-1/3 h-[600px] w-[600px] rounded-full bg-[#d4af37]/[0.03] blur-[150px]" />
        <div className="absolute right-0 bottom-1/3 h-[500px] w-[500px] rounded-full bg-neutral-900/[0.02] blur-[120px]" />
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
              Corporate
            </span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-neutral-300" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mb-6 font-SchnyderS text-4xl font-light tracking-tight text-neutral-950 sm:text-5xl lg:text-6xl"
          >
            Our Corporate & Commercial Partners
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-3xl font-Satoshi text-lg font-light leading-relaxed text-neutral-600 lg:text-xl"
          >
            <span className="font-SchnyderS text-2xl text-[#d4af37]">
              The Leaders of Business.
            </span>
            <br />
            <br />
            We create environments that empower commerce. From head offices to
            luxury retail, these organizations trust Eng. Maher to protect their
            brand identity.
          </motion.p>
        </div>

        {/* Partners Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:gap-12">
          {corporatePartners.map((partner, index) => {
            const Icon = partner.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.3 + index * 0.1 }}
                className="group relative overflow-hidden border border-neutral-200 bg-white p-8 shadow-sm transition-all duration-500 hover:border-[#d4af37]/30 hover:shadow-xl lg:p-12"
              >
                {/* Category Badge */}
                <div className="mb-6 inline-block border border-[#d4af37]/20 bg-[#d4af37]/5 px-4 py-2">
                  <span className="font-Satoshi text-xs font-light uppercase tracking-wider text-[#d4af37]">
                    {partner.category}
                  </span>
                </div>

                {/* Icon & Name */}
                <div className="mb-6 flex items-start gap-4">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center border border-[#d4af37]/30 bg-[#d4af37]/5 transition-all duration-300 group-hover:border-[#d4af37]/50 group-hover:bg-[#d4af37]/10">
                    <Icon className="h-8 w-8 text-[#d4af37]" strokeWidth={1} />
                  </div>
                  <div className="flex-1">
                    <h3 className="mb-2 font-SchnyderS text-2xl font-light text-neutral-950 transition-colors group-hover:text-[#d4af37] lg:text-3xl">
                      {partner.name}
                    </h3>
                    <p className="font-Satoshi text-base font-light text-neutral-600 lg:text-lg">
                      {partner.project}
                    </p>
                  </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-[#d4af37] to-transparent transition-all duration-500 group-hover:w-full" />

                {/* Corner Accents */}
                <div className="absolute right-0 top-0 h-20 w-20 border-r border-t border-neutral-200 transition-colors duration-300 group-hover:border-[#d4af37]/30" />
                <div className="absolute bottom-0 left-0 h-20 w-20 border-b border-l border-neutral-200 transition-colors duration-300 group-hover:border-[#d4af37]/30" />
              </motion.div>
            );
          })}
        </div>

        {/* Supporting Statement */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mt-16 border-l-2 border-[#d4af37]/30 bg-neutral-50 p-8 lg:mt-24 lg:p-12"
        >
          <p className="max-w-3xl font-Satoshi text-lg font-light italic leading-relaxed text-neutral-700 lg:text-xl">
            &quot;Each corporate partnership is built on a foundation of brand
            understanding. We do not just build spaces—we protect and enhance
            the visual identity our clients have spent decades cultivating.&quot;
          </p>
          <p className="mt-4 font-Satoshi text-sm font-light uppercase tracking-wider text-neutral-400">
            — Eng. Maher Mouhajer
          </p>
        </motion.div>
      </div>
    </section>
  );
}
