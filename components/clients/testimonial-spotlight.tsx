"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  Quote,
  ChevronLeft,
  ChevronRight,
  Star,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { urlForImage } from "@/sanity/lib/image";

interface SanityTestimonial {
  _id: string;
  name?: string;
  author?: string; // Legacy field
  role?: string;
  position?: string; // Legacy field
  company?: string;
  quote: string;
  image?: any;
  avatar?: any; // Legacy field
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

interface TestimonialSpotlightProps {
  testimonials?: SanityTestimonial[];
}

// Fallback testimonials if no Sanity data
const defaultTestimonials = [
  {
    id: 1,
    quote:
      "One of the standout qualities of MIDC is their dedication to meeting project timelines without compromising quality. Their clear communication and attention to detail helped keep projects on track, even when handling complex requirements.",
    author: "Ghaleb Al Najjar",
    position: "Consultant – Projects and Infrastructure",
    company: "Abu Dhabi National Hotels",
    image: "",
    rating: 5,
  },
  {
    id: 2,
    quote:
      "MIDC has consistently demonstrated exceptional skill, professionalism, and a strong commitment to delivering high-quality outcomes. Their work on Hyatt Hotels Dubai surpassed our expectations.",
    author: "Sayed Mohammed Al Sayed",
    position: "Director of Area Procurement",
    company: "Grand Hyatt Hotels Dubai",
    image: "",
    rating: 5,
  },
  {
    id: 3,
    quote:
      "I did not want a house that felt like a hotel. I wanted a home that felt like art. Eng. Maher took my vague ideas and translated them into a reality that was sharper and more elegant than I could have imagined.",
    author: "Private Client",
    position: "Villa Owner",
    company: "Confidential",
    image: "",
    rating: 5,
  },
];

export function TestimonialSpotlight({
  testimonials: sanityTestimonials,
}: TestimonialSpotlightProps) {
  // Transform Sanity testimonials or use defaults
  // Sanity returns: name, role, image (not author, position, avatar)
  // Handle null/undefined safely (default value only works for undefined, not null)
  const safeTestimonials = Array.isArray(sanityTestimonials)
    ? sanityTestimonials
    : [];

  const testimonials =
    safeTestimonials.length > 0
      ? safeTestimonials.map((t, idx) => ({
          id: idx + 1,
          quote: t.quote || "",
          author: t.isConfidential
            ? "Private Client"
            : t.name || t.author || "Anonymous",
          position: t.role || t.position || "",
          company: t.isConfidential
            ? "Confidential"
            : t.company || t.client?.name || "",
          image:
            t.image || t.avatar
              ? urlForImage(t.image || t.avatar)
                  ?.width(200)
                  .height(200)
                  .url() || ""
              : "",
          rating: t.rating || 5,
        }))
      : defaultTestimonials;

  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [activeIndex, setActiveIndex] = useState(0);

  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  const activeTestimonial = testimonials[activeIndex];

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-neutral-950 py-24 lg:py-32"
    >
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#c9a962]/5 blur-[180px]" />
      </div>

      {/* Grid pattern */}

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-12">
        {/* Header */}
        <div className="mb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="mb-4 flex items-center justify-center gap-4"
          >
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#c9a962]/50" />
            <span className="font-Satoshi text-xs font-light uppercase tracking-[0.3em] text-[#c9a962]">
              Testimonials
            </span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#c9a962]/50" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-SchnyderS text-4xl font-light text-white lg:text-5xl"
          >
            Words from Our Partners
          </motion.h2>
        </div>

        {/* Testimonial Card */}
        <div className="relative mx-auto max-w-4xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTestimonial.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.4 }}
              className="relative rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.05] to-transparent p-8 backdrop-blur-sm lg:p-12"
            >
              {/* Quote Icon */}
              <div className="absolute -top-6 left-8 lg:left-12">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#c9a962]">
                  <Quote className="h-5 w-5 text-neutral-950" strokeWidth={2} />
                </div>
              </div>

              {/* Rating */}
              <div className="mb-6 flex gap-1 pt-4">
                {Array.from({ length: activeTestimonial.rating }).map(
                  (_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-[#c9a962] text-[#c9a962]"
                    />
                  )
                )}
              </div>

              {/* Quote Text */}
              <blockquote className="mb-8">
                <p className="font-Satoshi text-lg font-light leading-relaxed text-white/80 lg:text-xl">
                  &quot;{activeTestimonial.quote}&quot;
                </p>
              </blockquote>

              {/* Author Info */}
              <div className="flex items-center gap-4">
                {/* Avatar placeholder */}
                <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[#c9a962]/30 bg-[#c9a962]/10">
                  <span className="font-SchnyderS text-xl text-[#c9a962]">
                    {activeTestimonial.author?.charAt(0) || "A"}
                  </span>
                </div>

                {/* Text Info */}
                <div>
                  <div className="font-SchnyderS text-lg text-white">
                    {activeTestimonial.author}
                  </div>
                  <div className="font-Satoshi text-sm text-white/50">
                    {activeTestimonial.position}
                    {activeTestimonial.company && (
                      <span className="text-[#c9a962]">
                        {" "}
                        — {activeTestimonial.company}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="mt-8 flex items-center justify-center gap-6">
            <button
              onClick={prevTestimonial}
              className="group flex h-12 w-12 items-center justify-center rounded-full border border-white/10 transition-all duration-300 hover:border-[#c9a962]/50 hover:bg-[#c9a962]/10"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-5 w-5 text-white/50 transition-colors group-hover:text-[#c9a962]" />
            </button>

            {/* Dots Indicator */}
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === activeIndex
                      ? "w-8 bg-[#c9a962]"
                      : "w-2 bg-white/20 hover:bg-white/40"
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={nextTestimonial}
              className="group flex h-12 w-12 items-center justify-center rounded-full border border-white/10 transition-all duration-300 hover:border-[#c9a962]/50 hover:bg-[#c9a962]/10"
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-5 w-5 text-white/50 transition-colors group-hover:text-[#c9a962]" />
            </button>
          </div>
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-20 border-t border-white/5 pt-16 text-center"
        >
          <h3 className="mb-4 font-SchnyderS text-3xl text-white lg:text-4xl">
            Ready to Partner with Excellence?
          </h3>
          <p className="mx-auto mb-8 max-w-xl font-Satoshi text-white/50">
            Join the UAE&apos;s most prestigious brands and hospitality leaders.
            Let&apos;s discuss your next project.
          </p>

          <Link
            href="/contact"
            className="group inline-flex items-center gap-3 rounded-full bg-[#c9a962] px-8 py-4 font-Satoshi text-sm font-medium text-neutral-950 transition-all duration-300 hover:bg-[#e5c349]"
          >
            Become a Partner
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
