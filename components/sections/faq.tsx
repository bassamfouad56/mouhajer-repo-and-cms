'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
import Link from 'next/link';

export interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  title?: string;
  subtitle?: string;
  faqs: FAQItem[];
  variant?: 'light' | 'dark';
}

export function FAQSection({
  title = 'Frequently Asked Questions',
  subtitle = 'Find answers to common questions about our services and process',
  faqs,
  variant = 'light',
}: FAQSectionProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const isDark = variant === 'dark';

  return (
    <section className={`px-6 py-20 lg:px-12 lg:py-32 ${isDark ? 'bg-neutral-950' : 'bg-white'}`}>
      <div className="mx-auto max-w-[1400px]">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <div className="mb-4 flex items-center justify-center gap-4">
            <div className={`h-px w-12 ${isDark ? 'bg-neutral-700' : 'bg-neutral-300'}`} />
            <h2
              className={`text-sm font-light tracking-[0.3em] ${
                isDark ? 'text-neutral-400' : 'text-neutral-500'
              }`}
            >
              FAQ
            </h2>
            <div className={`h-px w-12 ${isDark ? 'bg-neutral-700' : 'bg-neutral-300'}`} />
          </div>
          <h3
            className={`mb-4 text-4xl font-light tracking-tight lg:text-5xl ${
              isDark ? 'text-white' : 'text-neutral-950'
            }`}
          >
            {title}
          </h3>
          <p
            className={`mx-auto max-w-2xl text-lg font-light ${
              isDark ? 'text-neutral-400' : 'text-neutral-600'
            }`}
          >
            {subtitle}
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="mx-auto max-w-4xl space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`overflow-hidden rounded-sm border transition-all ${
                isDark
                  ? 'border-white/10 bg-neutral-900/50'
                  : 'border-neutral-200 bg-neutral-50'
              }`}
            >
              <button
                onClick={() => toggleFAQ(index)}
                className={`flex w-full items-center justify-between p-6 text-left transition-all hover:bg-opacity-70 ${
                  expandedIndex === index ? 'pb-4' : ''
                }`}
              >
                <span
                  className={`pr-8 text-lg font-light tracking-wide ${
                    isDark ? 'text-white' : 'text-neutral-950'
                  }`}
                >
                  {faq.question}
                </span>
                <div
                  className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full transition-all ${
                    isDark
                      ? 'bg-white/10 text-white'
                      : 'bg-neutral-200 text-neutral-950'
                  }`}
                >
                  <AnimatePresence mode="wait">
                    {expandedIndex === index ? (
                      <motion.div
                        key="minus"
                        initial={{ rotate: -90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: 90, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Minus size={16} />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="plus"
                        initial={{ rotate: 90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: -90, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Plus size={16} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </button>

              <AnimatePresence>
                {expandedIndex === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: [0.76, 0, 0.24, 1] }}
                  >
                    <div
                      className={`border-t px-6 pb-6 pt-4 ${
                        isDark ? 'border-white/10' : 'border-neutral-200'
                      }`}
                    >
                      <p
                        className={`font-light leading-relaxed ${
                          isDark ? 'text-neutral-300' : 'text-neutral-700'
                        }`}
                      >
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <p
            className={`mb-6 text-lg font-light ${
              isDark ? 'text-neutral-300' : 'text-neutral-700'
            }`}
          >
            Still have questions? We&apos;re here to help.
          </p>
          <Link
            href="/#contact"
            className={`group relative inline-flex items-center gap-2 overflow-hidden border-2 px-8 py-4 text-sm font-light tracking-widest transition-all ${
              isDark
                ? 'border-white text-white hover:text-neutral-950'
                : 'border-neutral-950 text-neutral-950 hover:text-white'
            }`}
          >
            <span className="relative z-10">GET IN TOUCH</span>
            <div
              className={`absolute inset-0 -translate-x-full transition-transform duration-300 group-hover:translate-x-0 ${
                isDark ? 'bg-white' : 'bg-neutral-950'
              }`}
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
