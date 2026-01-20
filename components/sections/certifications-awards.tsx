'use client';

import { useRef, useState } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// ISO Certifications
const certifications = [
  {
    name: 'ISO 9001:2015',
    description: 'Quality Management System',
    detail: 'Ensuring consistent quality in every project delivery',
    image: '/certifications/iso-9001.svg',
    color: '#c9a962',
  },
  {
    name: 'ISO 14001:2015',
    description: 'Environmental Management',
    detail: 'Committed to sustainable construction practices',
    image: '/certifications/iso-14001.svg',
    color: '#4ade80',
  },
  {
    name: 'ISO 45001:2018',
    description: 'Occupational Health & Safety',
    detail: 'Zero-compromise approach to workplace safety',
    image: '/certifications/iso-45001.svg',
    color: '#60a5fa',
  },
];

// Actual certificate files with their details
const certificates = [
  {
    id: 1,
    title: 'Best Hotel Suite Interior',
    subtitle: 'Arabia Region',
    organization: 'International Property Awards',
    year: '2023-2024',
    project: 'Address Boulevard VIP Suite',
    level: '5-Star Winner',
    file: '/awards/APA - 2023-2024 Best Hotel Suite Interior Arabia - Address Boulevard VIP Suite.pdf',
  },
  {
    id: 2,
    title: 'Best Hotel Suite Interior',
    subtitle: 'Dubai',
    organization: 'International Property Awards',
    year: '2023-2024',
    project: 'Address Boulevard VIP Suite',
    level: '5-Star Winner',
    file: '/awards/APA - 2023-2024 Best Hotel Suite Interior Dubai - Address Boulevard VIP Suite.pdf',
  },
  {
    id: 3,
    title: 'Best Residential Interior Apartment',
    subtitle: 'Dubai',
    organization: 'International Property Awards',
    year: '2023-2024',
    project: 'Address Boulevard Penthouse 70-71',
    level: '5-Star Winner',
    file: '/awards/APA - 2023-2024 Best Residential Interior Apartment Dubai - Address Boulevard Penthouse 70-71.pdf',
  },
  {
    id: 4,
    title: 'Best Hotel Interior',
    subtitle: 'Abu Dhabi',
    organization: 'International Property Awards',
    year: '2022-2023',
    project: 'Sheraton Abu Dhabi Hotel & Resort',
    level: '5-Star Winner',
    file: '/awards/APA - 2022-2023 Best Hotel Interior Abu Dhabi - Sheraton Abu Dhabi (2).pdf',
  },
  {
    id: 5,
    title: 'Certificate of Recognition',
    subtitle: 'Best Luxury Interior Design',
    organization: 'Luxury Lifestyle Awards',
    year: '2021',
    project: 'Mouhajer International Design',
    level: 'Winner',
    file: '/awards/Luxury Lifestyle - 2021 Certificate of Recognition.pdf',
  },
];

export function CertificationsAwards() {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const [activeIndex, setActiveIndex] = useState(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.6, 1, 1, 0.6]);

  const scrollToIndex = (index: number) => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const cardWidth = container.scrollWidth / certificates.length;
      container.scrollTo({
        left: cardWidth * index,
        behavior: 'smooth',
      });
      setActiveIndex(index);
    }
  };

  const handlePrev = () => {
    const newIndex = activeIndex > 0 ? activeIndex - 1 : certificates.length - 1;
    scrollToIndex(newIndex);
  };

  const handleNext = () => {
    const newIndex = activeIndex < certificates.length - 1 ? activeIndex + 1 : 0;
    scrollToIndex(newIndex);
  };

  return (
    <section
      ref={sectionRef}
      id="certifications"
      className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-neutral-950 py-24 sm:py-32 lg:py-40 scroll-mt-24"
    >
      {/* Background Elements */}
      <motion.div
        className="absolute inset-0"
        style={{ y: backgroundY }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950" />
        <div className="absolute left-1/2 top-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#c9a962]/[0.03] blur-[120px]" />
        <motion.div
          className="absolute left-[10%] top-[20%] h-32 w-32 rounded-full bg-[#c9a962]/[0.02] blur-3xl"
          animate={{ y: [0, -30, 0], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute right-[15%] bottom-[30%] h-48 w-48 rounded-full bg-white/[0.02] blur-3xl"
          animate={{ y: [0, 20, 0], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        />
      </motion.div>

      {/* Content Container */}
      <motion.div
        className="relative z-10 mx-auto max-w-7xl px-6 lg:px-12"
        style={{ opacity }}
      >
        {/* Section Header */}
        <div className="mb-16 text-center lg:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="mb-6 flex items-center justify-center gap-4"
          >
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#c9a962]/50" />
            <span className="font-Satoshi text-xs font-light uppercase tracking-[0.3em] text-white/40">
              Industry Validation
            </span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#c9a962]/50" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mb-6 font-SchnyderS text-4xl font-light tracking-tight text-white sm:text-5xl lg:text-6xl xl:text-7xl"
          >
            Certified for
            <br />
            <span className="text-white/30">High-Value Execution</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto max-w-2xl font-Satoshi text-base font-light text-white/50 sm:text-lg"
          >
            Triple ISO certified and internationally recognized. Our official certificates
            and awards from the International Property Awards and Luxury Lifestyle Awards.
          </motion.p>
        </div>

        {/* ISO Certifications Row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mb-16"
        >
          <div className="mb-8">
            <h3 className="font-SchnyderS text-xl font-light text-white">International Standards</h3>
            <p className="font-Satoshi text-xs font-light text-white/40">Triple ISO Certification</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {certifications.map((cert, index) => (
              <motion.div
                key={cert.name}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                className="group relative h-full overflow-hidden p-6 transition-all duration-500"
              >
                <div className="flex h-full flex-col items-center text-center">
                  {/* ISO Badge Image */}
                  <div className="relative mb-4 h-24 w-24">
                    <img
                      src={cert.image}
                      alt={cert.name}
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="mb-1 font-SchnyderS text-xl font-light text-white">{cert.name}</div>
                    <div className="mb-2 font-Satoshi text-sm font-light text-white/60">{cert.description}</div>
                    <div className="font-Satoshi text-xs font-light text-white/40">{cert.detail}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Award Certificates - Embedded PDF Display */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h3 className="font-SchnyderS text-xl font-light text-white">Award Certificates</h3>
              <p className="font-Satoshi text-xs font-light text-white/40">Official certificates displayed below</p>
            </div>

            {/* Navigation Arrows */}
            <div className="hidden items-center gap-2 sm:flex">
              <button
                onClick={handlePrev}
                className="flex h-10 w-10 items-center justify-center border border-white/10 bg-white/[0.02] transition-all hover:border-[#c9a962]/40 hover:bg-white/[0.05]"
              >
                <ChevronLeft className="h-5 w-5 text-white/60" strokeWidth={1} />
              </button>
              <button
                onClick={handleNext}
                className="flex h-10 w-10 items-center justify-center border border-white/10 bg-white/[0.02] transition-all hover:border-[#c9a962]/40 hover:bg-white/[0.05]"
              >
                <ChevronRight className="h-5 w-5 text-white/60" strokeWidth={1} />
              </button>
            </div>
          </div>

          {/* Certificate Carousel with Embedded PDFs */}
          <div
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {certificates.map((cert, index) => (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                className="group relative flex-shrink-0 snap-center"
              >
                {/* Certificate Card with Embedded PDF */}
                <div className="relative w-[340px] overflow-hidden transition-all duration-500 sm:w-[400px]">
                  {/* Level Badge */}
                  {cert.level === '5-Star Winner' && (
                    <div className="absolute left-4 top-4 z-10 flex items-center gap-1 rounded-full bg-[#c9a962] px-3 py-1 shadow-lg">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-950">5-Star</span>
                    </div>
                  )}

                  {/* Embedded PDF Viewer */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-900">
                    <object
                      data={`${cert.file}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
                      type="application/pdf"
                      className="h-full w-full"
                    >
                      {/* Fallback for browsers that don't support embedded PDFs */}
                      <iframe
                        src={`${cert.file}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
                        className="h-full w-full"
                        title={cert.title}
                      />
                    </object>

                    {/* Gradient overlay at bottom */}
                    <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-neutral-950 to-transparent pointer-events-none" />
                  </div>

                  {/* Certificate Info */}
                  <div className="p-5">
                    {/* Year Badge */}
                    <div className="mb-3 inline-block px-2 py-1">
                      <span className="font-Satoshi text-[10px] font-medium uppercase tracking-wider text-[#c9a962]">
                        {cert.year}
                      </span>
                    </div>

                    {/* Title */}
                    <h4 className="mb-1 font-SchnyderS text-lg font-light text-white">
                      {cert.title}
                    </h4>
                    <p className="mb-2 font-Satoshi text-sm font-light text-white/60">
                      {cert.subtitle}
                    </p>

                    {/* Organization */}
                    <p className="mb-4 font-Satoshi text-xs font-light text-white/40">
                      {cert.organization}
                    </p>

                    {/* Project & Download */}
                    <div className="flex items-center justify-between pt-4">
                      <div>
                        <p className="font-Satoshi text-[10px] font-light uppercase tracking-wider text-white/30">
                          Project
                        </p>
                        <p className="font-Satoshi text-xs font-light text-white/50">
                          {cert.project}
                        </p>
                      </div>

                      <a
                        href={cert.file}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group/btn flex items-center gap-2 px-3 py-2 transition-all hover:opacity-80"
                      >
                        <span className="font-Satoshi text-[10px] font-medium uppercase tracking-wider text-[#c9a962]">
                          View Certificate
                        </span>
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Pagination Dots */}
          <div className="mt-6 flex items-center justify-center gap-2">
            {certificates.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollToIndex(index)}
                className={`h-2 transition-all duration-300 ${
                  activeIndex === index
                    ? 'w-8 bg-[#c9a962]'
                    : 'w-2 bg-white/20 hover:bg-white/40'
                }`}
              />
            ))}
          </div>
        </motion.div>

        {/* Bottom Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-20 border-t border-white/5 pt-12"
        >
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {[
              { value: '3', label: 'ISO Certifications' },
              { value: '10+', label: 'International Awards' },
              { value: '100%', label: 'Project Success Rate' },
              { value: '0', label: 'Safety Incidents' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.9 + index * 0.1 }}
                className="text-center"
              >
                <div className="mb-2 font-SchnyderS text-4xl font-light text-[#c9a962] lg:text-5xl">
                  {stat.value}
                </div>
                <div className="font-Satoshi text-xs font-light uppercase tracking-[0.15em] text-white/40">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Decorative corner elements */}
      <div className="absolute left-8 top-24 hidden h-32 w-32 border-l border-t border-white/5 lg:block" />
      <div className="absolute bottom-24 right-8 hidden h-32 w-32 border-b border-r border-white/5 lg:block" />
    </section>
  );
}
