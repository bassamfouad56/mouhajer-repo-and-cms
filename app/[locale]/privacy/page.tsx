'use client';

import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { LogoMarquee } from '@/components/logo-marquee';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Shield, Lock, Eye, FileText, Globe, User, Mail, Phone, MapPin } from 'lucide-react';
import { useRef } from 'react';

// Animation variants
const textReveal = {
  hidden: { opacity: 0, y: 40 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      damping: 25,
      stiffness: 100,
      delay: delay * 0.1,
    },
  }),
};

const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      damping: 20,
      stiffness: 80,
    },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      damping: 15,
      stiffness: 100,
    },
  },
};

// Section Component with reveal animation
function Section({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.15,
  });

  return (
    <motion.section
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      custom={delay}
      variants={textReveal}
    >
      {children}
    </motion.section>
  );
}

// Magnetic Button Component
function MagneticIcon({ icon: Icon, label }: { icon: any; label: string }) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.5,
  });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={scaleIn}
      whileHover={{ scale: 1.05 }}
      className="group relative"
    >
      <div className="absolute -inset-4 bg-neutral-100 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100" />
      <div className="relative flex flex-col items-center gap-3 rounded-2xl border border-neutral-200 bg-white p-8 transition-all duration-500 group-hover:border-neutral-300 group-hover:shadow-2xl">
        <div className="rounded-full bg-neutral-950 p-4 transition-transform duration-500 group-hover:rotate-12">
          <Icon className="h-6 w-6 text-white" strokeWidth={1.5} />
        </div>
        <span className="text-xs font-light tracking-wider text-neutral-600">{label}</span>
      </div>
    </motion.div>
  );
}

export default function PrivacyPolicy() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const opacity = useTransform(smoothProgress, [0, 0.2], [1, 0.4]);
  const scale = useTransform(smoothProgress, [0, 0.3], [1, 0.95]);

  return (
    <>
      <Header />

      {/* Progress indicator */}
      <motion.div
        className="fixed left-0 top-0 z-50 h-1 bg-neutral-950 origin-left"
        style={{ scaleX: smoothProgress }}
      />

      <main ref={containerRef} className="relative min-h-screen bg-neutral-50">
        {/* Hero Section with parallax */}
        <motion.div
          style={{ opacity, scale }}
          className="relative overflow-hidden bg-neutral-950 px-6 pb-32 pt-32 lg:px-12 lg:pb-48 lg:pt-48"
        >
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-linear-to-br from-neutral-900 via-neutral-950 to-black opacity-90" />

          {/* Grid pattern */}

          <div className="relative mx-auto max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                type: 'spring',
                damping: 20,
                stiffness: 80,
                delay: 0.2,
              }}
              className="space-y-8"
            >
              {/* Eyebrow text */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="flex items-center gap-3"
              >
                <div className="h-px w-12 bg-white/40" />
                <span className="text-sm font-light tracking-[0.3em] text-white/60">
                  LEGAL
                </span>
              </motion.div>

              {/* Main title with text reveal */}
              <div className="overflow-hidden">
                <motion.h1
                  initial={{ y: 120 }}
                  animate={{ y: 0 }}
                  transition={{
                    type: 'spring',
                    damping: 20,
                    stiffness: 60,
                    delay: 0.4,
                  }}
                  className="font-light leading-[0.9] tracking-[-0.03em] text-white"
                  style={{ fontSize: 'clamp(3rem, 12vw, 9rem)' }}
                >
                  Privacy
                  <br />
                  <span className="text-neutral-400">Policy</span>
                </motion.h1>
              </div>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.8 }}
                className="max-w-2xl text-lg font-light leading-relaxed text-white/70 lg:text-xl"
              >
                Your trust is the foundation of our relationship. We are committed to protecting
                your privacy with transparency and integrity.
              </motion.p>

              {/* Last updated badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9, duration: 0.6 }}
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3 backdrop-blur-sm"
              >
                <FileText className="h-4 w-4 text-white/60" strokeWidth={1.5} />
                <span className="text-sm font-light text-white/80">
                  Effective Date: January 1, 2025
                </span>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* Key principles section */}
        <section className="relative -mt-20 px-6 lg:px-12">
          <div className="mx-auto max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ type: 'spring', damping: 20, stiffness: 80 }}
              className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:gap-6"
            >
              <MagneticIcon icon={Shield} label="SECURITY" />
              <MagneticIcon icon={Lock} label="PROTECTION" />
              <MagneticIcon icon={Eye} label="TRANSPARENCY" />
              <MagneticIcon icon={User} label="YOUR RIGHTS" />
            </motion.div>
          </div>
        </section>

        {/* Content sections */}
        <div className="px-6 py-32 lg:px-12 lg:py-48">
          <div className="mx-auto grid max-w-7xl gap-32 lg:grid-cols-12 lg:gap-16">
            {/* Sticky navigation */}
            <motion.aside
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', damping: 25, stiffness: 100 }}
              className="hidden lg:col-span-4 lg:block"
            >
              <div className="sticky top-32 space-y-6">
                <h3 className="text-sm font-light tracking-[0.2em] text-neutral-400">
                  CONTENTS
                </h3>
                <nav className="space-y-3">
                  {[
                    'Introduction',
                    'Information We Collect',
                    'How We Use Your Information',
                    'Information Sharing',
                    'Cookies & Tracking',
                    'Data Security',
                    'Your Rights',
                    'International Transfers',
                    'Children\'s Privacy',
                    'Policy Changes',
                    'Contact Us',
                  ].map((item, idx) => (
                    <motion.a
                      key={item}
                      href={`#section-${idx + 1}`}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.05 }}
                      whileHover={{ x: 8 }}
                      className="group block font-light text-neutral-500 transition-colors hover:text-neutral-950"
                    >
                      <span className="text-xs text-neutral-300 transition-colors group-hover:text-neutral-950">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <span className="ml-4">{item}</span>
                    </motion.a>
                  ))}
                </nav>
              </div>
            </motion.aside>

            {/* Main content */}
            <div className="space-y-24 lg:col-span-8">
              {/* Section 1 */}
              <Section delay={0}>
                <div id="section-1" className="scroll-mt-32 space-y-6">
                  <div className="flex items-baseline gap-6">
                    <span className="text-6xl font-light text-neutral-200">01</span>
                    <h2 className="text-4xl font-light tracking-tight text-neutral-950 lg:text-5xl">
                      Introduction
                    </h2>
                  </div>
                  <div className="max-w-3xl space-y-6 border-l border-neutral-200 pl-8 text-lg font-light leading-relaxed text-neutral-600">
                    <p>
                      Mouhajer International Design (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to
                      protecting your privacy. This Privacy Policy explains how we collect, use,
                      disclose, and safeguard your information when you visit our website or use our
                      services.
                    </p>
                  </div>
                </div>
              </Section>

              {/* Section 2 */}
              <Section delay={1}>
                <div id="section-2" className="scroll-mt-32 space-y-6">
                  <div className="flex items-baseline gap-6">
                    <span className="text-6xl font-light text-neutral-200">02</span>
                    <h2 className="text-4xl font-light tracking-tight text-neutral-950 lg:text-5xl">
                      Information We Collect
                    </h2>
                  </div>
                  <div className="max-w-3xl space-y-8 border-l border-neutral-200 pl-8">
                    <div className="space-y-4">
                      <h3 className="text-xl font-light text-neutral-950">
                        Personal Information
                      </h3>
                      <p className="text-lg font-light leading-relaxed text-neutral-600">
                        We collect information that you provide directly to us, including:
                      </p>
                      <ul className="grid gap-3">
                        {[
                          'Name and contact information (email, phone number)',
                          'Project details and design preferences',
                          'Communication preferences',
                          'Any other information you choose to provide',
                        ].map((item, idx) => (
                          <motion.li
                            key={idx}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="flex items-start gap-3 text-neutral-600"
                          >
                            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-neutral-400" />
                            <span className="font-light">{item}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-4 pt-4">
                      <h3 className="text-xl font-light text-neutral-950">
                        Automatically Collected Data
                      </h3>
                      <p className="text-lg font-light leading-relaxed text-neutral-600">
                        We automatically collect certain information about your device when you use
                        our website:
                      </p>
                      <ul className="grid gap-3">
                        {[
                          'IP address and browser type',
                          'Pages visited and time spent on pages',
                          'Referring website addresses',
                          'Analytics data through Google Analytics',
                        ].map((item, idx) => (
                          <motion.li
                            key={idx}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 + 0.4 }}
                            className="flex items-start gap-3 text-neutral-600"
                          >
                            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-neutral-400" />
                            <span className="font-light">{item}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </Section>

              {/* Section 3 */}
              <Section delay={2}>
                <div id="section-3" className="scroll-mt-32 space-y-6">
                  <div className="flex items-baseline gap-6">
                    <span className="text-6xl font-light text-neutral-200">03</span>
                    <h2 className="text-4xl font-light tracking-tight text-neutral-950 lg:text-5xl">
                      How We Use Your Information
                    </h2>
                  </div>
                  <div className="max-w-3xl space-y-6 border-l border-neutral-200 pl-8">
                    <p className="text-lg font-light leading-relaxed text-neutral-600">
                      We use the information we collect to:
                    </p>
                    <ul className="grid gap-3">
                      {[
                        'Respond to your inquiries and provide customer service',
                        'Send you updates about our projects and services (with your consent)',
                        'Improve our website and services',
                        'Analyze usage patterns and trends',
                        'Comply with legal obligations',
                      ].map((item, idx) => (
                        <motion.li
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: idx * 0.1 }}
                          className="flex items-start gap-3 text-neutral-600"
                        >
                          <span className="mt-2 h-1 w-1 flex-shrink-0 rounded-full bg-neutral-400" />
                          <span className="font-light">{item}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Section>

              {/* Section 4 */}
              <Section delay={3}>
                <div id="section-4" className="scroll-mt-32 space-y-6">
                  <div className="flex items-baseline gap-6">
                    <span className="text-6xl font-light text-neutral-200">04</span>
                    <h2 className="text-4xl font-light tracking-tight text-neutral-950 lg:text-5xl">
                      Information Sharing
                    </h2>
                  </div>
                  <div className="max-w-3xl space-y-6 border-l border-neutral-200 pl-8">
                    <p className="text-lg font-light leading-relaxed text-neutral-600">
                      We do not sell, trade, or rent your personal information to third parties. We
                      may share your information with:
                    </p>
                    <ul className="grid gap-3">
                      {[
                        'Service providers who assist in our business operations',
                        'Professional advisors (lawyers, accountants, etc.)',
                        'Law enforcement when required by law',
                      ].map((item, idx) => (
                        <motion.li
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: idx * 0.1 }}
                          className="flex items-start gap-3 text-neutral-600"
                        >
                          <span className="mt-2 h-1 w-1 flex-shrink-0 rounded-full bg-neutral-400" />
                          <span className="font-light">{item}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Section>

              {/* Section 5 */}
              <Section delay={4}>
                <div id="section-5" className="scroll-mt-32 space-y-6">
                  <div className="flex items-baseline gap-6">
                    <span className="text-6xl font-light text-neutral-200">05</span>
                    <h2 className="text-4xl font-light tracking-tight text-neutral-950 lg:text-5xl">
                      Cookies & Tracking
                    </h2>
                  </div>
                  <div className="max-w-3xl space-y-6 border-l border-neutral-200 pl-8 text-lg font-light leading-relaxed text-neutral-600">
                    <p>
                      We use cookies and similar tracking technologies to track activity on our
                      website and store certain information. You can instruct your browser to refuse
                      all cookies or indicate when a cookie is being sent. However, some parts of
                      our website may not function properly without cookies.
                    </p>
                  </div>
                </div>
              </Section>

              {/* Section 6 */}
              <Section delay={5}>
                <div id="section-6" className="scroll-mt-32 space-y-6">
                  <div className="flex items-baseline gap-6">
                    <span className="text-6xl font-light text-neutral-200">06</span>
                    <h2 className="text-4xl font-light tracking-tight text-neutral-950 lg:text-5xl">
                      Data Security
                    </h2>
                  </div>
                  <div className="max-w-3xl space-y-6 border-l border-neutral-200 pl-8 text-lg font-light leading-relaxed text-neutral-600">
                    <p>
                      We implement appropriate technical and organizational measures to protect your
                      personal information. However, no method of transmission over the internet or
                      electronic storage is 100% secure, and we cannot guarantee absolute security.
                    </p>
                  </div>
                </div>
              </Section>

              {/* Section 7 */}
              <Section delay={6}>
                <div id="section-7" className="scroll-mt-32 space-y-6">
                  <div className="flex items-baseline gap-6">
                    <span className="text-6xl font-light text-neutral-200">07</span>
                    <h2 className="text-4xl font-light tracking-tight text-neutral-950 lg:text-5xl">
                      Your Rights
                    </h2>
                  </div>
                  <div className="max-w-3xl space-y-6 border-l border-neutral-200 pl-8">
                    <p className="text-lg font-light leading-relaxed text-neutral-600">
                      You have the right to:
                    </p>
                    <ul className="grid gap-3">
                      {[
                        'Access the personal information we hold about you',
                        'Request correction of inaccurate information',
                        'Request deletion of your information',
                        'Opt-out of marketing communications',
                        'Lodge a complaint with a supervisory authority',
                      ].map((item, idx) => (
                        <motion.li
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: idx * 0.1 }}
                          className="flex items-start gap-3 text-neutral-600"
                        >
                          <span className="mt-2 h-1 w-1 flex-shrink-0 rounded-full bg-neutral-400" />
                          <span className="font-light">{item}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Section>

              {/* Section 8 */}
              <Section delay={7}>
                <div id="section-8" className="scroll-mt-32 space-y-6">
                  <div className="flex items-baseline gap-6">
                    <span className="text-6xl font-light text-neutral-200">08</span>
                    <h2 className="text-4xl font-light tracking-tight text-neutral-950 lg:text-5xl">
                      International Transfers
                    </h2>
                  </div>
                  <div className="max-w-3xl space-y-6 border-l border-neutral-200 pl-8 text-lg font-light leading-relaxed text-neutral-600">
                    <p>
                      Your information may be transferred to and maintained on computers located
                      outside of your state, province, country, or other governmental jurisdiction
                      where data protection laws may differ. By using our services, you consent to
                      this transfer.
                    </p>
                  </div>
                </div>
              </Section>

              {/* Section 9 */}
              <Section delay={8}>
                <div id="section-9" className="scroll-mt-32 space-y-6">
                  <div className="flex items-baseline gap-6">
                    <span className="text-6xl font-light text-neutral-200">09</span>
                    <h2 className="text-4xl font-light tracking-tight text-neutral-950 lg:text-5xl">
                      Children&apos;s Privacy
                    </h2>
                  </div>
                  <div className="max-w-3xl space-y-6 border-l border-neutral-200 pl-8 text-lg font-light leading-relaxed text-neutral-600">
                    <p>
                      Our services are not intended for individuals under the age of 18. We do not
                      knowingly collect personal information from children under 18.
                    </p>
                  </div>
                </div>
              </Section>

              {/* Section 10 */}
              <Section delay={9}>
                <div id="section-10" className="scroll-mt-32 space-y-6">
                  <div className="flex items-baseline gap-6">
                    <span className="text-6xl font-light text-neutral-200">10</span>
                    <h2 className="text-4xl font-light tracking-tight text-neutral-950 lg:text-5xl">
                      Policy Changes
                    </h2>
                  </div>
                  <div className="max-w-3xl space-y-6 border-l border-neutral-200 pl-8 text-lg font-light leading-relaxed text-neutral-600">
                    <p>
                      We may update this Privacy Policy from time to time. We will notify you of any
                      changes by posting the new Privacy Policy on this page and updating the
                      &quot;Last Updated&quot; date.
                    </p>
                  </div>
                </div>
              </Section>

              {/* Section 11 - Contact */}
              <Section delay={10}>
                <div id="section-11" className="scroll-mt-32 space-y-8">
                  <div className="flex items-baseline gap-6">
                    <span className="text-6xl font-light text-neutral-200">11</span>
                    <h2 className="text-4xl font-light tracking-tight text-neutral-950 lg:text-5xl">
                      Contact Us
                    </h2>
                  </div>
                  <div className="max-w-3xl space-y-8 border-l border-neutral-200 pl-8">
                    <p className="text-lg font-light leading-relaxed text-neutral-600">
                      If you have any questions about this Privacy Policy, please contact us:
                    </p>

                    <div className="grid gap-6 sm:grid-cols-2">
                      {[
                        {
                          icon: Mail,
                          label: 'Email',
                          value: process.env.NEXT_PUBLIC_EMAIL || 'info@mouhajerdesign.com',
                        },
                        {
                          icon: Phone,
                          label: 'Phone',
                          value: process.env.NEXT_PUBLIC_PHONE || '+971-4-323-4567',
                        },
                        {
                          icon: MapPin,
                          label: 'Location',
                          value: 'Dubai, UAE',
                        },
                        {
                          icon: Globe,
                          label: 'Company',
                          value: 'Mouhajer International Design',
                        },
                      ].map((item, idx) => (
                        <motion.div
                          key={item.label}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: idx * 0.1 }}
                          whileHover={{ y: -4 }}
                          className="group rounded-xl border border-neutral-200 bg-white p-6 transition-all hover:border-neutral-300 hover:shadow-lg"
                        >
                          <div className="mb-3 inline-flex rounded-full bg-neutral-100 p-2 transition-colors group-hover:bg-neutral-950">
                            <item.icon
                              className="h-4 w-4 text-neutral-600 transition-colors group-hover:text-white"
                              strokeWidth={1.5}
                            />
                          </div>
                          <div className="space-y-1">
                            <p className="text-xs font-light tracking-wider text-neutral-400">
                              {item.label.toUpperCase()}
                            </p>
                            <p className="font-light text-neutral-950">{item.value}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </Section>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="border-t border-neutral-200 bg-white px-6 py-24 lg:px-12"
        >
          <div className="mx-auto max-w-7xl text-center">
            <motion.h2
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', damping: 20, stiffness: 80 }}
              className="mb-8 text-4xl font-light tracking-tight text-neutral-950 lg:text-6xl"
            >
              Questions about your privacy?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="mx-auto mb-12 max-w-2xl text-lg font-light text-neutral-600"
            >
              We&apos;re here to help. Reach out to our team for any privacy-related concerns.
            </motion.p>
            <motion.a
              href="/contact"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="group inline-flex items-center gap-3 rounded-full border border-neutral-950 bg-neutral-950 px-8 py-4 font-light text-white transition-all hover:bg-white hover:text-neutral-950"
            >
              <span>Get in Touch</span>
              <motion.span
                className="transition-transform group-hover:translate-x-1"
              >
                →
              </motion.span>
            </motion.a>
          </div>
        </motion.section>
      </main>

      <LogoMarquee />
      <Footer />
    </>
  );
}
