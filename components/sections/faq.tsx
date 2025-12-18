'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import Link from 'next/link';

export interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  label?: string;
  title?: string;
  titleHighlight?: string;
  subtitle?: string;
  faqs: FAQItem[];
  variant?: 'light' | 'dark';
  showCTA?: boolean;
  ctaText?: string;
  ctaLink?: string;
  defaultOpen?: number | null;
}

/**
 * Unified FAQ Section Component
 *
 * Clean, minimal design with:
 * - Label (small uppercase tracking)
 * - Two-part title (main + gold highlight)
 * - Minimal accordion with divider lines
 * - Plus/X icon that rotates
 */
export function FAQSection({
  label = 'Expert Insights',
  title = 'Questions',
  titleHighlight = '& Answers',
  subtitle,
  faqs,
  variant = 'light',
  showCTA = true,
  ctaText = 'Get In Touch',
  ctaLink = '/contact',
  defaultOpen = 0,
}: FAQSectionProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(defaultOpen);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  const isDark = variant === 'dark';

  return (
    <section
      ref={sectionRef}
      className={`relative overflow-hidden px-6 py-24 sm:py-32 lg:px-12 lg:py-40 ${
        isDark ? 'bg-neutral-950' : 'bg-white'
      }`}
    >
      {/* Background pattern */}
      <div className="absolute inset-0">
        <div
          className={`absolute inset-0 bg-[linear-gradient(${
            isDark ? 'rgba(255,255,255,0.015)' : 'rgba(0,0,0,0.02)'
          }_1px,transparent_1px),linear-gradient(90deg,${
            isDark ? 'rgba(255,255,255,0.015)' : 'rgba(0,0,0,0.02)'
          }_1px,transparent_1px)] bg-[size:60px_60px]`}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-[1200px]">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1 }}
          className="mb-16 lg:mb-24"
        >
          {/* Label */}
          <div className="mb-4">
            <span
              className={`font-Satoshi text-[10px] font-light uppercase tracking-[0.4em] ${
                isDark ? 'text-white/40' : 'text-neutral-400'
              }`}
            >
              {label}
            </span>
          </div>

          {/* Title */}
          <h2
            className={`font-SchnyderS text-4xl font-light leading-tight tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl ${
              isDark ? 'text-white' : 'text-neutral-950'
            }`}
          >
            {title}
            <br />
            <span className="text-[#c9a962]">{titleHighlight}</span>
          </h2>

          {/* Subtitle */}
          {subtitle && (
            <p
              className={`mt-6 max-w-xl font-Satoshi text-base font-light leading-relaxed sm:text-lg ${
                isDark ? 'text-white/50' : 'text-neutral-500'
              }`}
            >
              {subtitle}
            </p>
          )}
        </motion.div>

        {/* Minimal Accordion */}
        <div className="space-y-px">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.08 }}
              className={`border-t last:border-b ${
                isDark ? 'border-white/10' : 'border-neutral-200'
              }`}
            >
              <button
                onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                className="group flex w-full items-start justify-between py-6 text-left transition-opacity hover:opacity-70 sm:py-8"
              >
                <h3
                  className={`max-w-3xl pr-6 font-SchnyderS text-xl font-light sm:pr-8 sm:text-2xl lg:text-3xl ${
                    isDark ? 'text-white' : 'text-neutral-950'
                  }`}
                >
                  {faq.question}
                </h3>
                <motion.div
                  animate={{ rotate: activeIndex === index ? 45 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-1 flex-shrink-0"
                >
                  <div className="relative flex h-6 w-6 items-center justify-center">
                    <div
                      className={`h-px w-4 ${isDark ? 'bg-white/40' : 'bg-neutral-400'}`}
                    />
                    <div
                      className={`absolute h-4 w-px ${isDark ? 'bg-white/40' : 'bg-neutral-400'}`}
                    />
                  </div>
                </motion.div>
              </button>

              <AnimatePresence initial={false}>
                {activeIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="pb-6 pr-12 sm:pb-8 sm:pr-16">
                      <p
                        className={`max-w-3xl font-Satoshi text-base font-light leading-relaxed sm:text-lg ${
                          isDark ? 'text-white/60' : 'text-neutral-600'
                        }`}
                      >
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        {showCTA && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-16 text-center lg:mt-24"
          >
            <p
              className={`mb-6 font-Satoshi text-sm font-light sm:text-base ${
                isDark ? 'text-white/50' : 'text-neutral-500'
              }`}
            >
              Still have questions? We&apos;re here to help.
            </p>
            <Link
              href={ctaLink}
              className={`group inline-flex items-center gap-3 border px-8 py-4 font-Satoshi text-xs font-light uppercase tracking-[0.2em] transition-all ${
                isDark
                  ? 'border-white/30 text-white hover:bg-white hover:text-neutral-950'
                  : 'border-neutral-950 text-neutral-950 hover:bg-neutral-950 hover:text-white'
              }`}
            >
              {ctaText}
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
}

/**
 * Standalone Accordion Component
 * Use this when you need just the accordion without the section wrapper
 */
interface AccordionProps {
  items: FAQItem[];
  variant?: 'light' | 'dark';
  defaultOpen?: number | null;
  className?: string;
}

export function Accordion({
  items,
  variant = 'light',
  defaultOpen = null,
  className = '',
}: AccordionProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(defaultOpen);
  const isDark = variant === 'dark';

  return (
    <div className={`space-y-px ${className}`}>
      {items.map((item, index) => (
        <div
          key={index}
          className={`border-t last:border-b ${
            isDark ? 'border-white/10' : 'border-neutral-200'
          }`}
        >
          <button
            onClick={() => setActiveIndex(activeIndex === index ? null : index)}
            className="group flex w-full items-start justify-between py-6 text-left transition-opacity hover:opacity-70 sm:py-8"
          >
            <h3
              className={`max-w-3xl pr-6 font-SchnyderS text-xl font-light sm:pr-8 sm:text-2xl lg:text-3xl ${
                isDark ? 'text-white' : 'text-neutral-950'
              }`}
            >
              {item.question}
            </h3>
            <motion.div
              animate={{ rotate: activeIndex === index ? 45 : 0 }}
              transition={{ duration: 0.3 }}
              className="mt-1 flex-shrink-0"
            >
              <div className="relative flex h-6 w-6 items-center justify-center">
                <div
                  className={`h-px w-4 ${isDark ? 'bg-white/40' : 'bg-neutral-400'}`}
                />
                <div
                  className={`absolute h-4 w-px ${isDark ? 'bg-white/40' : 'bg-neutral-400'}`}
                />
              </div>
            </motion.div>
          </button>

          <AnimatePresence initial={false}>
            {activeIndex === index && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
              >
                <div className="pb-6 pr-12 sm:pb-8 sm:pr-16">
                  <p
                    className={`max-w-3xl font-Satoshi text-base font-light leading-relaxed sm:text-lg ${
                      isDark ? 'text-white/60' : 'text-neutral-600'
                    }`}
                  >
                    {item.answer}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}

/**
 * FAQ Section Header Component
 * Use this when you want to add a header above a custom accordion
 */
interface FAQHeaderProps {
  label?: string;
  title?: string;
  titleHighlight?: string;
  subtitle?: string;
  variant?: 'light' | 'dark';
  className?: string;
}

export function FAQHeader({
  label = 'Expert Insights',
  title = 'Questions',
  titleHighlight = '& Answers',
  subtitle,
  variant = 'light',
  className = '',
}: FAQHeaderProps) {
  const isDark = variant === 'dark';

  return (
    <div className={className}>
      {/* Label */}
      <div className="mb-4">
        <span
          className={`font-Satoshi text-[10px] font-light uppercase tracking-[0.4em] ${
            isDark ? 'text-white/40' : 'text-neutral-400'
          }`}
        >
          {label}
        </span>
      </div>

      {/* Title */}
      <h2
        className={`font-SchnyderS text-4xl font-light leading-tight tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl ${
          isDark ? 'text-white' : 'text-neutral-950'
        }`}
      >
        {title}
        <br />
        <span className="text-[#c9a962]">{titleHighlight}</span>
      </h2>

      {/* Subtitle */}
      {subtitle && (
        <p
          className={`mt-6 max-w-xl font-Satoshi text-base font-light leading-relaxed sm:text-lg ${
            isDark ? 'text-white/50' : 'text-neutral-500'
          }`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
