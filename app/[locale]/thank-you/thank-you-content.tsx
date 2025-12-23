'use client';

import { useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import {
  CheckCircle2,
  FileSearch,
  UserCheck,
  Phone,
  ArrowRight,
  Mail,
  MessageCircle,
  Home
} from 'lucide-react';

export default function ThankYouContent() {
  const heroRef = useRef<HTMLDivElement>(null);
  const isHeroInView = useInView(heroRef, { once: true });
  const stepsRef = useRef<HTMLDivElement>(null);
  const isStepsInView = useInView(stepsRef, { once: true, margin: '-100px' });
  const contactRef = useRef<HTMLDivElement>(null);
  const isContactInView = useInView(contactRef, { once: true, margin: '-100px' });

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const steps = [
    {
      icon: FileSearch,
      title: 'Review',
      description: 'Your project details are currently being reviewed by our Senior Project Manager to assess scope and feasibility.',
    },
    {
      icon: UserCheck,
      title: 'Assignment',
      description: 'Based on your project type (Residential/Commercial/Hospitality), we are assigning the most relevant Technical Lead to your file.',
    },
    {
      icon: Phone,
      title: 'Contact',
      description: 'You will receive a call or WhatsApp message from our team within 48 hours to schedule your discovery meeting.',
    },
  ];

  return (
    <main className="relative bg-white">
      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative min-h-[60vh] overflow-hidden bg-neutral-950 px-6 py-32 lg:px-12 lg:py-40"
      >
        {/* Background Effects */}
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/10 blur-[150px]" />

        <div className="relative z-10 mx-auto max-w-4xl text-center">
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={isHeroInView ? { scale: 1, opacity: 1 } : {}}
            transition={{ duration: 0.6, type: 'spring', stiffness: 200 }}
            className="mb-8 inline-flex"
          >
            <div className="flex h-24 w-24 items-center justify-center rounded-full border-2 border-emerald-500/30 bg-emerald-500/10 backdrop-blur-sm">
              <CheckCircle2 className="h-12 w-12 text-emerald-400" strokeWidth={1.5} />
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-6 text-4xl font-light tracking-tight text-white sm:text-5xl lg:text-6xl"
          >
            Your Project is Now in Our Queue.
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mb-8 text-lg font-light leading-relaxed text-neutral-300 sm:text-xl"
          >
            We have successfully received your consultation brief. A confirmation email has been sent to the address you provided.
          </motion.p>

          {/* Confirmation Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-6 py-3 text-sm font-light text-emerald-300"
          >
            <CheckCircle2 className="h-4 w-4" />
            <span>Submission Confirmed</span>
          </motion.div>
        </div>
      </section>

      {/* What Happens Next Section */}
      <section
        ref={stepsRef}
        className="relative bg-neutral-50 px-6 py-24 lg:px-12 lg:py-32"
      >
        <div className="mx-auto max-w-5xl">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isStepsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="mb-16 text-center"
          >
            <div className="mb-4 flex items-center justify-center gap-4">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-neutral-400" />
              <span className="text-xs font-light uppercase tracking-[0.3em] text-neutral-500">
                Next Steps
              </span>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-neutral-400" />
            </div>
            <h2 className="text-3xl font-light tracking-tight text-neutral-950 sm:text-4xl lg:text-5xl">
              What Happens Next?
            </h2>
          </motion.div>

          {/* Steps Grid */}
          <div className="grid gap-8 md:grid-cols-3">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                animate={isStepsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.15 }}
                className="group relative"
              >
                {/* Connector Line (hidden on mobile, visible on desktop) */}
                {index < steps.length - 1 && (
                  <div className="absolute left-full top-12 hidden h-px w-full bg-neutral-200 md:block" />
                )}

                <div className="relative border border-neutral-200 bg-white p-8 transition-all hover:border-neutral-300 hover:shadow-lg">
                  {/* Step Number */}
                  <div className="absolute -top-4 left-8 flex h-8 w-8 items-center justify-center bg-neutral-950 text-sm font-light text-white">
                    {String(index + 1).padStart(2, '0')}
                  </div>

                  {/* Icon */}
                  <div className="mb-6 mt-4 flex h-14 w-14 items-center justify-center rounded-full border border-neutral-200 bg-neutral-50 transition-colors group-hover:border-neutral-950 group-hover:bg-neutral-950">
                    <step.icon className="h-7 w-7 text-neutral-600 transition-colors group-hover:text-white" strokeWidth={1.5} />
                  </div>

                  {/* Content */}
                  <h3 className="mb-3 text-xl font-light tracking-tight text-neutral-950">
                    {step.title}
                  </h3>
                  <p className="text-sm font-light leading-relaxed text-neutral-600">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Timeline Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isStepsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mt-12 text-center"
          >
            <div className="inline-flex items-center gap-3 rounded-full border border-neutral-200 bg-white px-6 py-3 text-sm font-light text-neutral-600">
              <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
              <span>Expected response time: <strong className="font-medium text-neutral-950">Within 48 hours</strong></span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Urgent Contact Section */}
      <section
        ref={contactRef}
        className="relative bg-neutral-950 px-6 py-24 lg:px-12 lg:py-32"
      >
        {/* Background Pattern */}

        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isContactInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            {/* Icon */}
            <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full border border-white/20 bg-white/5">
              <MessageCircle className="h-8 w-8 text-white" strokeWidth={1.5} />
            </div>

            <h2 className="mb-4 text-3xl font-light tracking-tight text-white sm:text-4xl">
              Need to Speak Now?
            </h2>
            <p className="mb-10 text-lg font-light leading-relaxed text-neutral-400">
              If your inquiry is time-sensitive or involves an active tender deadline, please contact our Executive Office directly.
            </p>

            {/* Contact Info Cards */}
            <div className="mb-10 grid gap-4 sm:grid-cols-2">
              <motion.a
                href={`tel:${process.env.NEXT_PUBLIC_PHONE || '+971-4-323-4567'}`}
                initial={{ opacity: 0, x: -20 }}
                animate={isContactInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="group flex items-center gap-4 border border-white/10 bg-white/5 p-6 transition-all hover:border-white/20 hover:bg-white/10"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/10">
                  <Phone className="h-5 w-5 text-white" strokeWidth={1.5} />
                </div>
                <div className="text-left">
                  <div className="mb-1 text-xs font-light uppercase tracking-wider text-white/50">
                    Direct Line
                  </div>
                  <div className="text-lg font-light text-white group-hover:text-emerald-400">
                    {process.env.NEXT_PUBLIC_PHONE || '+971-4-323-4567'}
                  </div>
                </div>
              </motion.a>

              <motion.a
                href={`mailto:${process.env.NEXT_PUBLIC_EMAIL || 'info@mouhajerdesign.com'}`}
                initial={{ opacity: 0, x: 20 }}
                animate={isContactInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="group flex items-center gap-4 border border-white/10 bg-white/5 p-6 transition-all hover:border-white/20 hover:bg-white/10"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/10">
                  <Mail className="h-5 w-5 text-white" strokeWidth={1.5} />
                </div>
                <div className="text-left">
                  <div className="mb-1 text-xs font-light uppercase tracking-wider text-white/50">
                    Email
                  </div>
                  <div className="text-lg font-light text-white group-hover:text-emerald-400">
                    {process.env.NEXT_PUBLIC_EMAIL || 'info@mouhajerdesign.com'}
                  </div>
                </div>
              </motion.a>
            </div>

            {/* Reference Note */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={isContactInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mb-10 text-sm font-light text-neutral-500"
            >
              (Please reference your Name or Organization when calling)
            </motion.p>

            {/* Return Home Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isContactInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Link
                href="/"
                className="group inline-flex items-center gap-3 border border-white bg-transparent px-10 py-5 text-xs font-light uppercase tracking-[0.2em] text-white transition-all hover:bg-white hover:text-neutral-950"
              >
                <Home className="h-4 w-4" strokeWidth={1.5} />
                <span>Return to Homepage</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" strokeWidth={1.5} />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
