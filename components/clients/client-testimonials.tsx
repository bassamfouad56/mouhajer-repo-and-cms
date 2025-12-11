'use client';

import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Quote, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { urlForImage } from '@/sanity/lib/image';

interface SanityTestimonial {
  _id: string;
  author: string;
  position?: string;
  company?: string;
  quote: string;
  avatar?: any;
  rating?: number;
  isConfidential?: boolean;
  client?: {
    name: string;
    logo?: any;
  };
  project?: {
    title: string;
    slug: { current: string };
  };
}

interface ClientTestimonialsProps {
  testimonials?: SanityTestimonial[];
}

// Fallback testimonials if no Sanity data
const defaultTestimonials = [
  {
    id: 1,
    quote:
      'One of the standout qualities of MIDC is their dedication to meeting project timelines without compromising quality. MIDC has consistently demonstrated a strong commitment to meeting project timelines while maintaining high-quality standards. Their clear communication and attention to detail helped keep projects on track, even when handling complex requirements.',
    author: 'Ghaleb Al Najjar',
    position: 'Consultant – Projects and Infrastructure',
    company: 'Abu Dhabi National Hotels',
    image: '',
    rating: 5,
  },
  {
    id: 2,
    quote:
      'Throughout our collaboration, MIDC has consistently demonstrated exceptional skill, professionalism, and a strong commitment to delivering high-quality outcomes. They have been instrumental in the successful execution of our hotel refurbishment, design and built projects (Royal Suites, Prince Suites, Business Lounge, Luxury Villas valued up to 70M+). Their work on Hyatt Hotels Dubai surpassed our expectations, not only in terms of quality but also in their ability to manage the project within tight timelines. Their efficiency and proactive problem-solving approach were key factors in the project\'s success.',
    author: 'Sayed Mohammed Al Sayed',
    position: 'Director of Area Procurement',
    company: 'Grand Hyatt Hotels Dubai',
    image: '',
    rating: 5,
  },
  {
    id: 3,
    quote:
      'I did not want a house that felt like a hotel. I wanted a home that felt like art. Eng. Maher took my vague ideas and translated them into a reality that was sharper and more elegant than I could have imagined. His presence on-site gave me total peace of mind.',
    author: 'Private Client',
    position: 'Villa Owner',
    company: 'Confidential',
    image: '',
    rating: 5,
  },
];

export function ClientTestimonials({ testimonials: sanityTestimonials = [] }: ClientTestimonialsProps) {
  // Transform Sanity testimonials or use defaults
  const testimonials = sanityTestimonials.length > 0
    ? sanityTestimonials.map((t, idx) => ({
        id: idx + 1,
        quote: t.quote,
        author: t.isConfidential ? 'Private Client' : t.author,
        position: t.position || '',
        company: t.isConfidential ? 'Confidential' : (t.company || t.client?.name || ''),
        image: t.avatar ? urlForImage(t.avatar)?.width(200).height(200).url() || '' : '',
        rating: t.rating || 5,
      }))
    : defaultTestimonials;

  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const [activeIndex, setActiveIndex] = useState(0);

  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const activeTestimonial = testimonials[activeIndex];

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-white py-24 sm:py-32 lg:py-40"
    >
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#d4af37]/[0.03] blur-[150px]" />
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
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-neutral-300" />
            <span className="font-Satoshi text-xs font-light uppercase tracking-[0.3em] text-neutral-400">
              Client Testimonials
            </span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-neutral-300" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mb-6 font-SchnyderS text-4xl font-light tracking-tight text-neutral-950 sm:text-5xl lg:text-6xl"
          >
            Words from Our Partners
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto max-w-2xl font-Satoshi text-base font-light text-neutral-600"
          >
            Trust is earned through action. Here&apos;s what our clients say
            about working with MIDC.
          </motion.p>
        </div>

        {/* Testimonial Carousel */}
        <div className="relative mx-auto max-w-5xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTestimonial.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              {/* Quote Icon */}
              <div className="mb-8 flex justify-center">
                <div className="flex h-20 w-20 items-center justify-center border border-[#d4af37]/30 bg-[#d4af37]/5">
                  <Quote className="h-10 w-10 text-[#d4af37]" strokeWidth={1} />
                </div>
              </div>

              {/* Rating */}
              <div className="mb-8 flex justify-center gap-1">
                {Array.from({ length: activeTestimonial.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-5 w-5 fill-[#d4af37] text-[#d4af37]"
                  />
                ))}
              </div>

              {/* Quote Text */}
              <blockquote className="mb-12 text-center">
                <p className="mx-auto max-w-4xl font-Satoshi text-xl font-light leading-relaxed text-neutral-700 lg:text-2xl">
                  &quot;{activeTestimonial.quote}&quot;
                </p>
              </blockquote>

              {/* Author Info */}
              <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-center">
                {/* Avatar */}
                <div className="relative h-20 w-20 overflow-hidden rounded-full border-2 border-[#d4af37]/30">
                  <img
                    src={activeTestimonial.image}
                    alt={activeTestimonial.author}
                    className="h-full w-full object-cover"
                  />
                </div>

                {/* Text Info */}
                <div className="text-center sm:text-left">
                  <div className="mb-1 font-SchnyderS text-2xl font-light text-neutral-950">
                    {activeTestimonial.author}
                  </div>
                  <div className="mb-1 font-Satoshi text-sm font-light text-neutral-600">
                    {activeTestimonial.position}
                  </div>
                  <div className="font-Satoshi text-sm font-light uppercase tracking-wider text-[#d4af37]">
                    {activeTestimonial.company}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Arrows */}
          <div className="mt-12 flex items-center justify-center gap-4">
            <button
              onClick={prevTestimonial}
              className="group flex h-14 w-14 items-center justify-center border border-neutral-200 bg-white transition-all duration-300 hover:border-[#d4af37]/50 hover:bg-[#d4af37]/5"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-6 w-6 text-neutral-400 transition-colors group-hover:text-[#d4af37]" />
            </button>

            {/* Dots Indicator */}
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`h-2 w-2 rounded-full transition-all duration-300 ${
                    index === activeIndex
                      ? 'w-8 bg-[#d4af37]'
                      : 'bg-neutral-300 hover:bg-neutral-400'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={nextTestimonial}
              className="group flex h-14 w-14 items-center justify-center border border-neutral-200 bg-white transition-all duration-300 hover:border-[#d4af37]/50 hover:bg-[#d4af37]/5"
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-6 w-6 text-neutral-400 transition-colors group-hover:text-[#d4af37]" />
            </button>
          </div>

          {/* Counter */}
          <div className="mt-8 text-center font-Satoshi text-sm font-light text-neutral-400">
            {activeIndex + 1} / {testimonials.length}
          </div>
        </div>

        {/* Bottom Statement */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-20 border-t border-neutral-200 pt-12 text-center lg:mt-32"
        >
          <p className="mx-auto max-w-2xl font-Satoshi text-lg font-light leading-relaxed text-neutral-600">
            Our reputation is not built on marketing. It is built on the
            hundreds of projects we have delivered—on time, on budget, and
            beyond expectation.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
