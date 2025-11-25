'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { SafeImage } from '@/components/safe-image';
import { Quote, Star } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Sarah Al Mansoori',
    role: 'CEO, Emirates Properties',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80',
    content:
      'Mouhajer transformed our office into a space that truly reflects our brand. Their attention to detail and understanding of luxury design is unmatched in the region.',
    rating: 5,
    project: 'Executive Office, DIFC',
  },
  {
    id: 2,
    name: 'Ahmed Hassan',
    role: 'Property Developer',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80',
    content:
      'Working with Mouhajer was an absolute pleasure. They delivered a stunning villa design that exceeded all our expectations. Every detail was meticulously crafted.',
    rating: 5,
    project: 'Luxury Villa, Dubai Hills',
  },
  {
    id: 3,
    name: 'Layla Rahman',
    role: 'Boutique Hotel Owner',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80',
    content:
      'The team at Mouhajer brought our vision to life with elegance and sophistication. Our hotel lobby is now a masterpiece that leaves every guest in awe.',
    rating: 5,
    project: 'Hotel Lobby, Downtown Dubai',
  },
];

export function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section
      ref={sectionRef}
      id="testimonials"
      className="relative overflow-hidden bg-neutral-950 px-6 py-32 lg:px-12 lg:py-48"
    >
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px] opacity-20" />
        <div className="absolute left-0 top-1/4 h-96 w-96 rounded-full bg-purple-500/10 blur-[150px]" />
        <div className="absolute bottom-1/4 right-0 h-96 w-96 rounded-full bg-blue-500/10 blur-[150px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1800px]">
        {/* Section Header */}
        <div className="mb-24 text-center lg:mb-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="mb-6 flex items-center justify-center gap-4"
          >
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-white/40" />
            <span className="text-sm font-light tracking-[0.3em] text-white/60">
              CLIENT TESTIMONIALS
            </span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-white/40" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl font-light tracking-tight text-white sm:text-6xl lg:text-7xl"
          >
            What Our Clients Say
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mx-auto mt-6 max-w-2xl text-lg font-light leading-relaxed text-white/70"
          >
            Trusted by leading property developers, business owners, and individuals
            across the UAE
          </motion.p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-12">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={testimonial.id}
              testimonial={testimonial}
              index={index}
            />
          ))}
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-24 lg:mt-32"
        >
          <div className="mb-16 h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          <div className="grid grid-cols-2 gap-12 md:grid-cols-4">
            {[
              { value: '98%', label: 'Client Satisfaction' },
              { value: '200+', label: 'Happy Clients' },
              { value: '15+', label: 'Years Experience' },
              { value: '50+', label: 'Industry Awards' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.7 + index * 0.1 }}
                className="group text-center"
              >
                <div className="mb-3 text-4xl font-light text-white transition-all duration-300 group-hover:scale-110 lg:text-5xl">
                  {stat.value}
                </div>
                <div className="text-sm font-light tracking-wider text-white/60">
                  {stat.label}
                </div>
                <div className="mx-auto mt-4 h-px w-0 bg-white transition-all duration-300 group-hover:w-16" />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function TestimonialCard({
  testimonial,
  index,
}: {
  testimonial: (typeof testimonials)[0];
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: '-100px' });

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.1 }}
      className="group relative"
    >
      <div className="relative h-full overflow-hidden border border-white/10 bg-neutral-900/50 p-8 backdrop-blur-sm transition-all duration-500 hover:border-white/30 hover:bg-neutral-900/70 lg:p-10">
        {/* Quote Icon */}
        <div className="mb-6">
          <Quote
            size={40}
            className="text-white/20 transition-all duration-500 group-hover:scale-110 group-hover:text-white/40"
            strokeWidth={1.5}
          />
        </div>

        {/* Rating */}
        <div className="mb-6 flex gap-1">
          {[...Array(testimonial.rating)].map((_, i) => (
            <Star
              key={i}
              size={16}
              className="fill-white text-white"
              strokeWidth={0}
            />
          ))}
        </div>

        {/* Content */}
        <p className="mb-8 text-base font-light leading-relaxed text-white/80 lg:text-lg">
          &ldquo;{testimonial.content}&rdquo;
        </p>

        {/* Author */}
        <div className="flex items-center gap-4">
          <div className="relative h-14 w-14 overflow-hidden rounded-full">
            <SafeImage
              src={testimonial.image}
              alt={testimonial.name}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <div className="mb-1 font-light text-white">{testimonial.name}</div>
            <div className="mb-1 text-sm font-light text-white/60">
              {testimonial.role}
            </div>
            <div className="text-xs font-light text-white/40">
              {testimonial.project}
            </div>
          </div>
        </div>

        {/* Decorative corner */}
        <div className="absolute right-0 top-0 h-20 w-20 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
          <div className="absolute right-0 top-0 h-px w-full bg-gradient-to-l from-white/40 to-transparent" />
          <div className="absolute right-0 top-0 h-full w-px bg-gradient-to-b from-white/40 to-transparent" />
        </div>
      </div>
    </motion.div>
  );
}
