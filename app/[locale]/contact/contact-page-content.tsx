'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';
import { MagneticButton } from '@/components/magnetic-button';
import { SafeImage } from '@/components/safe-image';

// Contact information
const PHONE = '+971 52 304 1482';
const PHONE_LINK = '971523041482';
const EMAIL = 'info@mouhajerdesign.com';
const EMAIL_CAREERS = 'career@mouhajerdesign.com';
const WHATSAPP_LINK = `https://wa.me/${PHONE_LINK}?text=${encodeURIComponent("Hello! I'm interested in scheduling a consultation.")}`;

// Form validation schema
const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormData = z.infer<typeof contactSchema>;

// FAQ data
const faqs = [
  {
    question: 'Do I need an appointment to visit the HQ?',
    answer: 'Yes. To ensure that the appropriate Senior Project Manager or Designer is available to discuss your specific needs, we recommend scheduling an appointment 24 hours in advance.',
  },
  {
    question: 'Can Eng. Maher attend the initial meeting?',
    answer: 'Eng. Maher is deeply involved in all major projects. For significant commissions (Palaces, Hotels, HQs), he makes every effort to attend the initial briefing personally.',
  },
  {
    question: 'Do you charge for the initial consultation?',
    answer: 'Our initial discovery meeting at our HQ is complimentary. This allows us to understand your vision and determine if MIDC is the right partner for your ambition.',
  },
];

// Minimalist SVG Icons (professional, thin strokes)
const IconLocation = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
    <circle cx="12" cy="9" r="2.5" />
  </svg>
);

const IconPhone = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
  </svg>
);

const IconMail = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="M22 6L12 13 2 6" />
  </svg>
);

const IconClock = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v6l4 2" />
  </svg>
);

const IconArrowRight = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

const IconPlus = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 5v14M5 12h14" />
  </svg>
);

const IconMinus = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14" />
  </svg>
);

const IconCheck = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

interface ContactPageContentProps {
  bannerImage?: string;
  ctaImage?: string;
}

export default function ContactPageContent({
  bannerImage = '/founder/CID_2106_00_COVER.jpg',
  ctaImage = '/founder/CID_2106_00_COVER.jpg'
}: ContactPageContentProps) {
  const heroRef = useRef<HTMLElement>(null);
  const locationRef = useRef<HTMLElement>(null);
  const servicesRef = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLElement>(null);
  const faqRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLElement>(null);

  const heroInView = useInView(heroRef, { once: true });
  const locationInView = useInView(locationRef, { once: true, margin: '-100px' });
  const servicesInView = useInView(servicesRef, { once: true, margin: '-100px' });
  const formInView = useInView(formRef, { once: true, margin: '-100px' });
  const faqInView = useInView(faqRef, { once: true, margin: '-100px' });
  const ctaInView = useInView(ctaRef, { once: true, margin: '-100px' });

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const heroY = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.5], [0.6, 0.9]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Track mouse for subtle glow effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log('Form submitted:', data);
      setSubmitSuccess(true);
      reset();
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="relative bg-neutral-950">
      {/* Hero Section - Cinematic Full Screen */}
      <section
        ref={heroRef}
        className="relative h-screen min-h-[700px] overflow-hidden"
      >
        {/* Background Image with Parallax - Now using Sanity image */}
        <motion.div
          className="absolute inset-0"
          style={{ y: heroY, scale: heroScale }}
        >
          <SafeImage
            src={bannerImage}
            alt="Downtown Dubai skyline"
            fill
            className="object-cover"
            priority
          />
        </motion.div>

        {/* Cinematic Overlays */}
        <motion.div
          className="absolute inset-0 bg-neutral-950"
          style={{ opacity: overlayOpacity }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/40 via-transparent to-neutral-950" />
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/60 via-transparent to-neutral-950/60" />

        {/* Film Grain Overlay */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.015]">
          <div className="h-full w-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iMC44IiBudW1PY3RhdmVzPSI0IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsdGVyPSJ1cmwoI2EpIi8+PC9zdmc+')] bg-repeat" />
        </div>

        {/* Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />

        {/* Content */}
        <motion.div
          className="relative z-10 flex h-full flex-col items-center justify-center px-6"
          style={{ opacity: heroOpacity }}
        >
          {/* Decorative Line */}
          <motion.div
            initial={{ scaleY: 0 }}
            animate={heroInView ? { scaleY: 1 } : {}}
            transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="mb-12 h-24 w-px origin-top bg-gradient-to-b from-transparent via-[#d4af37]/60 to-transparent"
          />

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.4 }}
            className="mb-8 text-center"
          >
            <span className="font-Satoshi text-[11px] font-light uppercase tracking-[0.4em] text-[#d4af37]">
              Contact Us
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.6 }}
            className="mb-8 text-center font-SchnyderS text-5xl font-light leading-[1.1] tracking-tight text-white md:text-7xl lg:text-8xl"
          >
            Start the<br />
            <span className="italic text-white/90">Conversation.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.8 }}
            className="max-w-md text-center font-Satoshi text-base font-light leading-relaxed text-white/50 md:text-lg"
          >
            Your legacy begins with a single meeting.
          </motion.p>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={heroInView ? { opacity: 1 } : {}}
            transition={{ duration: 1, delay: 1.2 }}
            className="absolute bottom-16"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              className="flex flex-col items-center gap-4"
            >
              <div className="h-12 w-px bg-gradient-to-b from-white/20 to-transparent" />
              <span className="font-Satoshi text-[9px] uppercase tracking-[0.3em] text-white/30">
                Scroll
              </span>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Corner Frames */}
        <div className="absolute left-8 top-32 hidden h-24 w-24 border-l border-t border-white/[0.08] lg:block" />
        <div className="absolute bottom-32 right-8 hidden h-24 w-24 border-b border-r border-white/[0.08] lg:block" />
      </section>

      {/* Section 1: The Center of Operations */}
      <section
        ref={locationRef}
        className="relative overflow-hidden bg-white py-32 lg:py-40"
      >
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div className="h-full w-full bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] bg-[size:80px_80px]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={locationInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="mb-20 max-w-2xl"
          >
            <div className="mb-6 flex items-center gap-4">
              <div className="h-px w-12 bg-[#d4af37]" />
              <span className="font-Satoshi text-[11px] font-light uppercase tracking-[0.3em] text-neutral-400">
                Our Headquarters
              </span>
            </div>
            <h2 className="mb-6 font-Playfair text-4xl font-light leading-[1.15] text-neutral-950 md:text-5xl lg:text-6xl">
              The Center of<br />
              <span className="italic">Operations.</span>
            </h2>
            <p className="font-Satoshi text-base font-light leading-relaxed text-neutral-500 md:text-lg">
              Located in the heart of Downtown Dubai, our headquarters reflects the standards we deliver.
              We invite you to visit our design studio to view material samples, discuss blueprints,
              and meet the team behind the region&apos;s most iconic projects.
            </p>
          </motion.div>

          <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
            {/* Contact Details - Elegant Layout */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={locationInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-0"
            >
              {/* Address */}
              <div className="group border-b border-neutral-100 py-8 transition-colors hover:border-neutral-200">
                <div className="flex items-start gap-6">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center text-neutral-300 transition-colors group-hover:text-[#d4af37]">
                    <IconLocation />
                  </div>
                  <div className="flex-1">
                    <h4 className="mb-3 font-Satoshi text-xs font-medium uppercase tracking-[0.15em] text-neutral-400">
                      HQ Address
                    </h4>
                    <p className="font-Satoshi text-base font-light leading-relaxed text-neutral-700">
                      Mouhajer International Design & Contracting<br />
                      Burj Vista, Tower 1<br />
                      Downtown Dubai, Opposite Burj Khalifa<br />
                      Dubai, United Arab Emirates
                    </p>
                  </div>
                </div>
              </div>

              {/* Phone */}
              <div className="group border-b border-neutral-100 py-8 transition-colors hover:border-neutral-200">
                <div className="flex items-start gap-6">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center text-neutral-300 transition-colors group-hover:text-[#d4af37]">
                    <IconPhone />
                  </div>
                  <div className="flex-1">
                    <h4 className="mb-3 font-Satoshi text-xs font-medium uppercase tracking-[0.15em] text-neutral-400">
                      Direct Line
                    </h4>
                    <a
                      href={`tel:${PHONE_LINK}`}
                      className="font-Satoshi text-base font-light text-neutral-700 transition-colors hover:text-neutral-950"
                    >
                      {PHONE}
                    </a>
                  </div>
                </div>
              </div>

              {/* Emails */}
              <div className="group border-b border-neutral-100 py-8 transition-colors hover:border-neutral-200">
                <div className="flex items-start gap-6">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center text-neutral-300 transition-colors group-hover:text-[#d4af37]">
                    <IconMail />
                  </div>
                  <div className="flex-1 space-y-4">
                    <div>
                      <h4 className="mb-2 font-Satoshi text-xs font-medium uppercase tracking-[0.15em] text-neutral-400">
                        General Inquiries
                      </h4>
                      <a
                        href={`mailto:${EMAIL}`}
                        className="font-Satoshi text-base font-light text-neutral-700 transition-colors hover:text-neutral-950"
                      >
                        {EMAIL}
                      </a>
                    </div>
                    <div>
                      <h4 className="mb-2 font-Satoshi text-xs font-medium uppercase tracking-[0.15em] text-neutral-400">
                        Careers
                      </h4>
                      <a
                        href={`mailto:${EMAIL_CAREERS}`}
                        className="font-Satoshi text-base font-light text-neutral-700 transition-colors hover:text-neutral-950"
                      >
                        {EMAIL_CAREERS}
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Hours */}
              <div className="group py-8">
                <div className="flex items-start gap-6">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center text-neutral-300 transition-colors group-hover:text-[#d4af37]">
                    <IconClock />
                  </div>
                  <div className="flex-1">
                    <h4 className="mb-3 font-Satoshi text-xs font-medium uppercase tracking-[0.15em] text-neutral-400">
                      Office Hours
                    </h4>
                    <p className="font-Satoshi text-base font-light text-neutral-700">
                      Sunday — Thursday: 9:00 AM – 6:00 PM
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Map with Premium Styling */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={locationInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-neutral-100">
                {/* Map */}
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3610.1787674796247!2d55.2697!3d25.1972!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f682829c85c07%3A0x5c3e5e1a2f00e0c0!2sBurj%20Vista%20Tower%201!5e0!3m2!1sen!2sae!4v1699999999999!5m2!1sen!2sae"
                  width="100%"
                  height="100%"
                  style={{ border: 0, filter: 'grayscale(100%) contrast(1.1)' }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0"
                />

                {/* Subtle overlay */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-neutral-950/10 via-transparent to-transparent" />

                {/* Border frame */}
                <div className="pointer-events-none absolute inset-4 border border-white/20" />
              </div>

              {/* Floating Label */}
              <div className="absolute -bottom-6 left-8 right-8 bg-neutral-950 p-6 md:left-auto md:right-8 md:w-72">
                <div className="flex items-center gap-4">
                  <div className="h-px flex-1 bg-[#d4af37]/30" />
                  <span className="font-Satoshi text-[10px] uppercase tracking-[0.2em] text-[#d4af37]">Location</span>
                </div>
                <p className="mt-4 font-Playfair text-xl font-light text-white">Burj Vista</p>
                <p className="mt-1 font-Satoshi text-sm font-light text-white/50">Downtown Dubai</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section 2: How Can We Serve You? */}
      <section
        ref={servicesRef}
        className="relative overflow-hidden bg-neutral-950 py-32 lg:py-40"
      >
        {/* Subtle grid */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="h-full w-full bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:100px_100px]" />
        </div>

        {/* Ambient glow */}
        <div
          className="pointer-events-none absolute h-[600px] w-[600px] rounded-full bg-[#d4af37]/[0.03] blur-[120px]"
          style={{
            left: mousePosition.x - 300,
            top: mousePosition.y - 300 - 400,
          }}
        />

        <div className="relative mx-auto max-w-7xl px-6">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={servicesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="mb-20 text-center"
          >
            <div className="mb-6 flex items-center justify-center gap-4">
              <div className="h-px w-12 bg-[#d4af37]/40" />
              <span className="font-Satoshi text-[11px] font-light uppercase tracking-[0.3em] text-[#d4af37]">
                Get Started
              </span>
              <div className="h-px w-12 bg-[#d4af37]/40" />
            </div>
            <h2 className="font-Playfair text-4xl font-light leading-[1.15] text-white md:text-5xl lg:text-6xl">
              How Can We<br />
              <span className="italic text-white/80">Serve You?</span>
            </h2>
          </motion.div>

          <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
            {/* New Project Inquiry */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={servicesInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="group relative"
            >
              <div className="relative overflow-hidden border border-white/[0.08] bg-white/[0.02] p-10 backdrop-blur-sm transition-all duration-700 hover:border-[#d4af37]/20 hover:bg-white/[0.04] lg:p-12">
                <div className="relative">
                  <span className="mb-6 inline-block font-Satoshi text-[10px] uppercase tracking-[0.3em] text-[#d4af37]">
                    New Project
                  </span>

                  <h3 className="mb-6 font-Playfair text-2xl font-light text-white md:text-3xl">
                    Project Inquiry
                  </h3>

                  <p className="mb-10 max-w-md font-Satoshi text-base font-light leading-relaxed text-white/40">
                    Are you ready to commission a design, renovate a hotel, or build a private residence?
                    Connect directly with our executive team to discuss your vision.
                  </p>

                  <Link
                    href="/contact/book-consultation"
                    className="group/btn inline-flex items-center gap-4 border-b border-[#d4af37]/30 pb-2 transition-all hover:border-[#d4af37]"
                  >
                    <span className="font-Satoshi text-sm font-light tracking-wide text-[#d4af37]">
                      Book a Consultation
                    </span>
                    <span className="text-[#d4af37] transition-transform group-hover/btn:translate-x-1">
                      <IconArrowRight />
                    </span>
                  </Link>
                </div>

                {/* Hover glow */}
                <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-[#d4af37]/0 blur-3xl transition-all duration-700 group-hover:bg-[#d4af37]/10" />
              </div>
            </motion.div>

            {/* Supplier Registration */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={servicesInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="group relative"
            >
              <div className="relative overflow-hidden border border-white/[0.08] bg-white/[0.02] p-10 backdrop-blur-sm transition-all duration-700 hover:border-white/10 hover:bg-white/[0.04] lg:p-12">
                <div className="relative">
                  <span className="mb-6 inline-block font-Satoshi text-[10px] uppercase tracking-[0.3em] text-white/40">
                    Partnerships
                  </span>

                  <h3 className="mb-6 font-Playfair text-2xl font-light text-white md:text-3xl">
                    Supplier Registration
                  </h3>

                  <p className="mb-10 max-w-md font-Satoshi text-base font-light leading-relaxed text-white/40">
                    We are always looking for partners who meet the &quot;MIDC Standard.&quot;
                    If you supply high-grade materials, register with our procurement division.
                  </p>

                  <a
                    href={`mailto:${EMAIL}?subject=Supplier Registration`}
                    className="group/btn inline-flex items-center gap-4 border-b border-white/20 pb-2 transition-all hover:border-white/40"
                  >
                    <span className="font-Satoshi text-sm font-light tracking-wide text-white/70">
                      Join Our Vendor List
                    </span>
                    <span className="text-white/70 transition-transform group-hover/btn:translate-x-1">
                      <IconArrowRight />
                    </span>
                  </a>
                </div>

                {/* Hover glow */}
                <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-white/0 blur-3xl transition-all duration-700 group-hover:bg-white/5" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section 3: General Correspondence - Form */}
      <section
        ref={formRef}
        className="relative overflow-hidden bg-neutral-50 py-32 lg:py-40"
      >
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-20 lg:grid-cols-2 lg:gap-24">
            {/* Content */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={formInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
            >
              <div className="mb-6 flex items-center gap-4">
                <div className="h-px w-12 bg-neutral-300" />
                <span className="font-Satoshi text-[11px] font-light uppercase tracking-[0.3em] text-neutral-400">
                  Get in Touch
                </span>
              </div>

              <h2 className="mb-6 font-SchnyderS text-4xl font-light leading-[1.15] text-neutral-950 md:text-5xl">
                General<br />
                <span className="italic">Correspondence</span>
              </h2>

              <p className="mb-12 max-w-md font-Satoshi text-base font-light leading-relaxed text-neutral-500">
                For general questions, media requests, or corporate information.
                Our team responds within 24 hours.
              </p>

              {/* Quick contact */}
              <div className="space-y-4">
                <a
                  href={WHATSAPP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 border border-neutral-200 bg-white p-4 transition-all hover:border-neutral-300 hover:shadow-sm"
                >
                  <div className="flex h-10 w-10 items-center justify-center bg-[#25D366] text-white">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <span className="block font-Satoshi text-sm font-medium text-neutral-900">WhatsApp</span>
                    <span className="font-Satoshi text-xs text-neutral-500">Quick response</span>
                  </div>
                  <span className="text-neutral-400 transition-transform group-hover:translate-x-1">
                    <IconArrowRight />
                  </span>
                </a>

                <a
                  href={`mailto:${EMAIL}`}
                  className="group flex items-center gap-4 border border-neutral-200 bg-white p-4 transition-all hover:border-neutral-300 hover:shadow-sm"
                >
                  <div className="flex h-10 w-10 items-center justify-center bg-neutral-900 text-white">
                    <IconMail />
                  </div>
                  <div className="flex-1">
                    <span className="block font-Satoshi text-sm font-medium text-neutral-900">Email</span>
                    <span className="font-Satoshi text-xs text-neutral-500">{EMAIL}</span>
                  </div>
                  <span className="text-neutral-400 transition-transform group-hover:translate-x-1">
                    <IconArrowRight />
                  </span>
                </a>
              </div>
            </motion.div>

            {/* Form */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={formInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                {/* Name */}
                <div>
                  <label className="mb-3 block font-Satoshi text-[10px] uppercase tracking-[0.2em] text-neutral-400">
                    Full Name <span className="text-[#d4af37]">*</span>
                  </label>
                  <input
                    {...register('name')}
                    type="text"
                    placeholder="Your full name"
                    className={`w-full border-b-2 ${errors.name ? 'border-red-400' : 'border-neutral-200'} bg-transparent pb-3 font-Satoshi text-base font-light text-neutral-900 placeholder:text-neutral-300 transition-colors focus:border-neutral-900 focus:outline-none`}
                  />
                  {errors.name && (
                    <p className="mt-2 font-Satoshi text-xs text-red-500">{errors.name.message}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="mb-3 block font-Satoshi text-[10px] uppercase tracking-[0.2em] text-neutral-400">
                    Email Address <span className="text-[#d4af37]">*</span>
                  </label>
                  <input
                    {...register('email')}
                    type="email"
                    placeholder="your@email.com"
                    className={`w-full border-b-2 ${errors.email ? 'border-red-400' : 'border-neutral-200'} bg-transparent pb-3 font-Satoshi text-base font-light text-neutral-900 placeholder:text-neutral-300 transition-colors focus:border-neutral-900 focus:outline-none`}
                  />
                  {errors.email && (
                    <p className="mt-2 font-Satoshi text-xs text-red-500">{errors.email.message}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="mb-3 block font-Satoshi text-[10px] uppercase tracking-[0.2em] text-neutral-400">
                    Phone / WhatsApp
                  </label>
                  <input
                    {...register('phone')}
                    type="tel"
                    placeholder="+971 XX XXX XXXX"
                    className="w-full border-b-2 border-neutral-200 bg-transparent pb-3 font-Satoshi text-base font-light text-neutral-900 placeholder:text-neutral-300 transition-colors focus:border-neutral-900 focus:outline-none"
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="mb-3 block font-Satoshi text-[10px] uppercase tracking-[0.2em] text-neutral-400">
                    Message <span className="text-[#d4af37]">*</span>
                  </label>
                  <textarea
                    {...register('message')}
                    rows={4}
                    placeholder="How can we help you today?"
                    className={`w-full resize-none border-b-2 ${errors.message ? 'border-red-400' : 'border-neutral-200'} bg-transparent pb-3 font-Satoshi text-base font-light leading-relaxed text-neutral-900 placeholder:text-neutral-300 transition-colors focus:border-neutral-900 focus:outline-none`}
                  />
                  {errors.message && (
                    <p className="mt-2 font-Satoshi text-xs text-red-500">{errors.message.message}</p>
                  )}
                </div>

                {/* Submit */}
                <div className="pt-6">
                  <MagneticButton>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="group flex w-full items-center justify-center gap-3 bg-neutral-950 px-10 py-5 transition-all hover:bg-neutral-800 disabled:opacity-50 sm:w-auto"
                    >
                      {isSubmitting ? (
                        <span className="font-Satoshi text-sm font-light tracking-wide text-white">
                          Sending...
                        </span>
                      ) : submitSuccess ? (
                        <>
                          <span className="text-[#d4af37]"><IconCheck /></span>
                          <span className="font-Satoshi text-sm font-light tracking-wide text-white">
                            Message Sent!
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="font-Satoshi text-sm font-light tracking-wide text-white">
                            Submit Inquiry
                          </span>
                          <span className="text-white transition-transform group-hover:translate-x-1">
                            <IconArrowRight />
                          </span>
                        </>
                      )}
                    </button>
                  </MagneticButton>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section 4: Expert Insights / FAQ */}
      <section
        ref={faqRef}
        className="relative overflow-hidden bg-white py-32 lg:py-40"
      >
        <div className="mx-auto max-w-4xl px-6">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={faqInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="mb-16 text-center"
          >
            <div className="mb-6 flex items-center justify-center gap-4">
              <div className="h-px w-12 bg-neutral-200" />
              <span className="font-Satoshi text-[11px] font-light uppercase tracking-[0.3em] text-neutral-400">
                FAQ
              </span>
              <div className="h-px w-12 bg-neutral-200" />
            </div>
            <h2 className="mb-4 font-Playfair text-4xl font-light leading-[1.15] text-neutral-950 md:text-5xl">
              Expert <span className="italic">Insights.</span>
            </h2>
            <p className="font-Satoshi text-base font-light text-neutral-500">
              What to expect when you contact us.
            </p>
          </motion.div>

          <div className="space-y-0">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={faqInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="border-b border-neutral-100"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="flex w-full items-center justify-between py-8 text-left transition-colors"
                >
                  <span className="pr-8 font-Satoshi text-base font-light text-neutral-900 md:text-lg">
                    {faq.question}
                  </span>
                  <span className={`shrink-0 text-neutral-400 transition-transform duration-300 ${openFaq === index ? 'rotate-0' : ''}`}>
                    {openFaq === index ? <IconMinus /> : <IconPlus />}
                  </span>
                </button>
                <AnimatePresence>
                  {openFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="pb-8">
                        <p className="max-w-2xl font-Satoshi text-base font-light leading-relaxed text-neutral-500">
                          {faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 5: Make the Call - Cinematic CTA */}
      <section
        ref={ctaRef}
        className="relative h-[80vh] min-h-[600px] overflow-hidden"
      >
        {/* Background - Now using Sanity image */}
        <div className="absolute inset-0">
          <SafeImage
            src={ctaImage}
            alt="Luxury interior"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-neutral-950/70" />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/50 to-transparent" />
        </div>

        {/* Film grain */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.02]">
          <div className="h-full w-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iMC44IiBudW1PY3RhdmVzPSI0IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsdGVyPSJ1cmwoI2EpIi8+PC9zdmc+')] bg-repeat" />
        </div>

        {/* Content */}
        <div className="relative flex h-full flex-col items-center justify-center px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1 }}
          >
            {/* Decorative line */}
            <div className="mx-auto mb-12 h-16 w-px bg-gradient-to-b from-transparent via-[#d4af37]/50 to-transparent" />

            <h2 className="mb-8 font-Playfair text-4xl font-light leading-[1.1] text-white md:text-6xl lg:text-7xl">
              Make the <span className="italic">Call.</span>
            </h2>

            <p className="mb-12 font-Satoshi text-base font-light text-white/50 md:text-lg">
              The difference between a dream and a landmark is action.
            </p>

            <MagneticButton>
              <Link
                href="/contact/book-consultation"
                className="group inline-flex items-center gap-4 border border-[#d4af37] bg-[#d4af37] px-12 py-5 transition-all duration-500 hover:bg-transparent"
              >
                <span className="font-Satoshi text-sm font-light tracking-wide text-neutral-950 transition-colors group-hover:text-[#d4af37]">
                  Book Consultation
                </span>
                <span className="text-neutral-950 transition-all group-hover:translate-x-1 group-hover:text-[#d4af37]">
                  <IconArrowRight />
                </span>
              </Link>
            </MagneticButton>
          </motion.div>
        </div>

        {/* Corner frames */}
        <div className="absolute left-8 top-24 hidden h-24 w-24 border-l border-t border-white/[0.06] lg:block" />
        <div className="absolute bottom-24 right-8 hidden h-24 w-24 border-b border-r border-white/[0.06] lg:block" />
      </section>
    </main>
  );
}
