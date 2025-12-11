'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Eye, Target, Heart } from 'lucide-react';

export function VisionMissionSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  const blocks = [
    {
      icon: Eye,
      title: 'VISION',
      // 100% VERBATIM from content.md lines 453-454
      content: 'At Mouhajer International Design and Contracting, we are committed to building a better future for our clients, our community and our planet. We believe that construction is not only a technical process, but also a creative one, where we can transform ideas into reality. Our vision is to be the leading construction company in the region, delivering innovative, sustainable and high-quality solutions for every project. We strive to exceed expectations, foster long-term relationships, and create value for all clients. We are proud of our diverse and talented team, our ethical and responsible practices, and our dedication to excellence and safety. We are MIDC, and we are building tomorrow today.',
    },
    {
      icon: Target,
      title: 'MISSION',
      // 100% VERBATIM from content.md lines 456-457
      content: 'Our mission at MIDC is to provide high-quality construction services that meet the needs and expectations of our clients. We are committed to delivering projects on time, within budget, and with the highest standards of safety and quality. We are proud of our reputation as a reliable and trustworthy partner in the construction industry. We value our relationships with our clients, suppliers, subcontractors, and employees, and we strive to maintain a culture of integrity, professionalism, and excellence. We believe that our mission is not only to build structures, but also to build trust and long-term partnerships.',
    },
    {
      icon: Heart,
      title: 'COMMITMENT',
      // 100% VERBATIM from content.md lines 459-460
      content: 'Our Commitment is a leading provider of high-quality and cost-effective building solutions in the MENA region. We have over two decades of experience in delivering projects across various sectors, such as residential, commercial, industrial, and institutional. We are committed to meeting the needs and expectations of our clients and partners, while adhering to the highest standards of safety, quality, and sustainability. Our team of skilled and experienced professionals is dedicated to delivering excellence in every aspect of our work, from planning and design to execution and maintenance. Whether you need a new home, office, factory, or school, we have the expertise and resources to make your vision a reality.',
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-white py-24 sm:py-32 lg:py-40"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.05)_1px,transparent_1px)] bg-[size:80px_80px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-12">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center lg:mb-24"
        >
          <div className="mb-8 flex items-center justify-center gap-4">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#d4af37]/50" />
            <span className="font-Satoshi text-xs font-light uppercase tracking-[0.3em] text-neutral-500">
              Our Guiding Principles
            </span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#d4af37]/50" />
          </div>

          <h2 className="font-SchnyderS text-4xl font-light leading-[1.1] tracking-tight text-neutral-950 sm:text-5xl lg:text-6xl">
            Vision, Mission &
            <br />
            <span className="text-[#d4af37]">Commitment</span>
          </h2>
        </motion.div>

        {/* Three Blocks */}
        <div className="space-y-12 lg:space-y-16">
          {blocks.map((block, index) => {
            const Icon = block.icon;
            return (
              <motion.div
                key={block.title}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className="relative border-l-2 border-[#d4af37] pl-8 sm:pl-12 lg:pl-16"
              >
                {/* Icon */}
                <div className="absolute -left-[17px] top-0 flex h-8 w-8 items-center justify-center rounded-full bg-[#d4af37]">
                  <Icon className="h-4 w-4 text-white" />
                </div>

                {/* Title */}
                <h3 className="mb-4 font-Satoshi text-sm font-medium uppercase tracking-[0.3em] text-[#d4af37]">
                  {block.title}
                </h3>

                {/* Content - 100% VERBATIM */}
                <p className="font-Satoshi text-base font-light leading-relaxed text-neutral-700 sm:text-lg lg:text-xl">
                  {block.content}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Decorative Element */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={isInView ? { opacity: 1, scaleX: 1 } : {}}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-16 h-px w-full bg-gradient-to-r from-transparent via-[#d4af37]/30 to-transparent lg:mt-24"
        />
      </div>
    </section>
  );
}
