'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  MapPin,
  Clock,
  Briefcase,
  Calendar,
  DollarSign,
  Upload,
  FileText,
  CheckCircle,
  Share2,
  Linkedin,
  Mail,
  Copy,
} from 'lucide-react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { LogoMarquee } from '@/components/logo-marquee';
import type { JobPosition } from '../jobs-data';

interface JobDetailContentProps {
  job: JobPosition;
}

export default function JobDetailContent({ job }: JobDetailContentProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleShare = (platform: 'linkedin' | 'email' | 'copy') => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    const title = `${job.title} at MIDC`;
    const text = `Check out this job opportunity: ${job.title} at Mouhajer International Design & Contracting`;

    switch (platform) {
      case 'linkedin':
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
          '_blank'
        );
        break;
      case 'email':
        window.location.href = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(text + '\n\n' + url)}`;
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        break;
    }
    setShowShareMenu(false);
  };

  // Format posted date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <>
      <Header />

      <div ref={containerRef} className="relative bg-white">
        {/* Hero Section */}
        <section className="relative flex min-h-[60vh] items-end overflow-hidden bg-neutral-950 pb-20 pt-40">
          {/* Background Grid */}
          <div className="absolute inset-0 opacity-20">
            <div
              className="h-full w-full"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
                `,
                backgroundSize: '80px 80px',
              }}
            />
          </div>

          {/* Decorative Elements */}
          <motion.div
            className="absolute right-[15%] top-[30%] h-px w-32 bg-gradient-to-r from-transparent via-[#d4af37]/30 to-transparent"
            animate={{ x: [0, 30, 0], opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          />

          <div className="relative z-10 mx-auto w-full max-w-7xl px-6">
            <motion.div style={{ y, opacity }}>
              {/* Back Link */}
              <Link
                href="/careers"
                className="mb-8 inline-flex items-center gap-2 font-Satoshi text-sm text-white/60 transition-colors hover:text-white"
              >
                <ArrowLeft size={16} />
                Back to All Positions
              </Link>

              {/* Department Badge */}
              <div className="mb-6 inline-flex items-center gap-2 border border-[#d4af37]/30 bg-[#d4af37]/10 px-4 py-2">
                <span className="font-Satoshi text-xs uppercase tracking-widest text-[#d4af37]">
                  {job.department}
                </span>
              </div>

              {/* Title */}
              <h1 className="mb-8 font-SchnyderS text-5xl font-light tracking-tight text-white sm:text-6xl lg:text-7xl">
                {job.title}
              </h1>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-6 text-white/60">
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-[#d4af37]" />
                  <span className="font-Satoshi text-sm">{job.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-[#d4af37]" />
                  <span className="font-Satoshi text-sm">{job.type}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Briefcase size={16} className="text-[#d4af37]" />
                  <span className="font-Satoshi text-sm">{job.experience}</span>
                </div>
                {job.salary && (
                  <div className="flex items-center gap-2">
                    <DollarSign size={16} className="text-[#d4af37]" />
                    <span className="font-Satoshi text-sm">{job.salary}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-[#d4af37]" />
                  <span className="font-Satoshi text-sm">Posted {formatDate(job.postedDate)}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-20 lg:py-32">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid gap-16 lg:grid-cols-3">
              {/* Main Content */}
              <div className="lg:col-span-2">
                {/* Description */}
                <div className="mb-16">
                  <h2 className="mb-6 font-SchnyderS text-3xl font-light tracking-tight text-neutral-950">
                    About This Role
                  </h2>
                  <p className="font-Satoshi text-lg font-light leading-relaxed text-neutral-600">
                    {job.description}
                  </p>
                </div>

                {/* Responsibilities */}
                <div className="mb-16">
                  <h2 className="mb-6 font-SchnyderS text-3xl font-light tracking-tight text-neutral-950">
                    Key Responsibilities
                  </h2>
                  <ul className="space-y-4">
                    {job.responsibilities.map((item, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-start gap-4"
                      >
                        <div className="mt-2 h-1.5 w-1.5 flex-shrink-0 bg-[#d4af37]" />
                        <span className="font-Satoshi text-base font-light leading-relaxed text-neutral-600">
                          {item}
                        </span>
                      </motion.li>
                    ))}
                  </ul>
                </div>

                {/* Requirements */}
                <div className="mb-16">
                  <h2 className="mb-6 font-SchnyderS text-3xl font-light tracking-tight text-neutral-950">
                    Requirements
                  </h2>
                  <ul className="space-y-4">
                    {job.requirements.map((item, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-start gap-4"
                      >
                        <CheckCircle size={18} className="mt-0.5 flex-shrink-0 text-[#d4af37]" />
                        <span className="font-Satoshi text-base font-light leading-relaxed text-neutral-600">
                          {item}
                        </span>
                      </motion.li>
                    ))}
                  </ul>
                </div>

                {/* Benefits */}
                <div className="mb-16">
                  <h2 className="mb-6 font-SchnyderS text-3xl font-light tracking-tight text-neutral-950">
                    What We Offer
                  </h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {job.benefits.map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-center gap-3 border border-neutral-200 p-4"
                      >
                        <div className="flex h-8 w-8 items-center justify-center bg-[#d4af37]/10">
                          <CheckCircle size={16} className="text-[#d4af37]" />
                        </div>
                        <span className="font-Satoshi text-sm font-light text-neutral-700">
                          {item}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="sticky top-32">
                  {/* Apply Card */}
                  <div className="mb-8 border border-neutral-200 bg-neutral-50 p-8">
                    <h3 className="mb-4 font-SchnyderS text-2xl font-light tracking-tight text-neutral-950">
                      Apply for This Position
                    </h3>
                    <p className="mb-6 font-Satoshi text-sm font-light text-neutral-600">
                      Ready to join our team? Submit your application below.
                    </p>
                    <a
                      href="#apply"
                      className="inline-flex w-full items-center justify-center gap-3 border border-neutral-950 bg-neutral-950 px-6 py-4 font-Satoshi text-xs uppercase tracking-widest text-white transition-all hover:bg-transparent hover:text-neutral-950"
                    >
                      Apply Now
                      <ArrowRight size={14} />
                    </a>
                  </div>

                  {/* Share */}
                  <div className="relative border border-neutral-200 p-6">
                    <h3 className="mb-4 font-Satoshi text-sm uppercase tracking-widest text-neutral-500">
                      Share This Position
                    </h3>
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleShare('linkedin')}
                        className="flex h-10 w-10 items-center justify-center border border-neutral-200 text-neutral-600 transition-all hover:border-[#0077b5] hover:bg-[#0077b5] hover:text-white"
                      >
                        <Linkedin size={18} />
                      </button>
                      <button
                        onClick={() => handleShare('email')}
                        className="flex h-10 w-10 items-center justify-center border border-neutral-200 text-neutral-600 transition-all hover:border-neutral-950 hover:bg-neutral-950 hover:text-white"
                      >
                        <Mail size={18} />
                      </button>
                      <button
                        onClick={() => handleShare('copy')}
                        className="flex h-10 w-10 items-center justify-center border border-neutral-200 text-neutral-600 transition-all hover:border-neutral-950 hover:bg-neutral-950 hover:text-white"
                      >
                        {copied ? <CheckCircle size={18} className="text-green-500" /> : <Copy size={18} />}
                      </button>
                    </div>
                    {copied && (
                      <p className="mt-2 font-Satoshi text-xs text-green-600">Link copied!</p>
                    )}
                  </div>

                  {/* Contact */}
                  <div className="mt-8 border border-neutral-200 p-6">
                    <h3 className="mb-2 font-Satoshi text-sm uppercase tracking-widest text-neutral-500">
                      Questions?
                    </h3>
                    <p className="mb-4 font-Satoshi text-sm font-light text-neutral-600">
                      Contact our HR team for more information.
                    </p>
                    <a
                      href="mailto:careers@midcuae.com"
                      className="font-Satoshi text-sm text-[#d4af37] underline transition-colors hover:text-neutral-950"
                    >
                      careers@midcuae.com
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Application Form Section */}
        <ApplicationFormSection job={job} />

        {/* Other Positions */}
        <section className="border-t border-neutral-200 bg-neutral-50 py-20 lg:py-32">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-12 text-center">
              <h2 className="mb-4 font-SchnyderS text-4xl font-light tracking-tight text-neutral-950">
                Explore Other Positions
              </h2>
              <p className="font-Satoshi text-lg font-light text-neutral-600">
                Discover more opportunities to join our team.
              </p>
            </div>
            <div className="text-center">
              <Link
                href="/careers#positions"
                className="inline-flex items-center gap-3 border border-neutral-950 px-8 py-4 font-Satoshi text-xs uppercase tracking-widest text-neutral-950 transition-all hover:bg-neutral-950 hover:text-white"
              >
                View All Positions
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>
      </div>

      <LogoMarquee />
      <Footer />
    </>
  );
}

// Application Form Section
function ApplicationFormSection({ job }: { job: JobPosition }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    linkedIn: '',
    coverLetter: '',
  });
  const [resume, setResume] = useState<File | null>(null);
  const [portfolio, setPortfolio] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('email', formData.email);
      data.append('phone', formData.phone);
      data.append('linkedIn', formData.linkedIn);
      data.append('position', job.title);
      data.append('positionId', job.id);
      data.append('department', job.department);
      data.append('coverLetter', formData.coverLetter);
      if (resume) data.append('resume', resume);
      if (portfolio) data.append('portfolio', portfolio);

      const response = await fetch('/api/apply', {
        method: 'POST',
        body: data,
      });

      const result = await response.json();

      if (result.success) {
        setMessage({
          type: 'success',
          text: 'Your application has been submitted successfully! We will review it and get back to you soon.',
        });
        // Reset form
        setFormData({ name: '', email: '', phone: '', linkedIn: '', coverLetter: '' });
        setResume(null);
        setPortfolio(null);
      } else {
        setMessage({
          type: 'error',
          text: result.message || 'Failed to submit application. Please try again.',
        });
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'An error occurred. Please try again later.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="apply" className="bg-neutral-950 py-20 lg:py-32">
      <div className="mx-auto max-w-3xl px-6">
        <div className="mb-12 text-center">
          <span className="mb-4 inline-block font-Satoshi text-xs uppercase tracking-widest text-[#d4af37]">
            Apply Now
          </span>
          <h2 className="mb-4 font-SchnyderS text-4xl font-light tracking-tight text-white lg:text-5xl">
            Submit Your Application
          </h2>
          <p className="font-Satoshi text-lg font-light text-white/60">
            Applying for: <span className="text-white">{job.title}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name & Email Row */}
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className="mb-2 block font-Satoshi text-sm text-white/80">
                Full Name <span className="text-[#d4af37]">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full border border-white/20 bg-white/5 px-4 py-3 font-Satoshi text-sm text-white outline-none transition-colors placeholder:text-white/40 focus:border-[#d4af37]"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="mb-2 block font-Satoshi text-sm text-white/80">
                Email Address <span className="text-[#d4af37]">*</span>
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full border border-white/20 bg-white/5 px-4 py-3 font-Satoshi text-sm text-white outline-none transition-colors placeholder:text-white/40 focus:border-[#d4af37]"
                placeholder="john@example.com"
              />
            </div>
          </div>

          {/* Phone & LinkedIn Row */}
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className="mb-2 block font-Satoshi text-sm text-white/80">
                Phone Number <span className="text-[#d4af37]">*</span>
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full border border-white/20 bg-white/5 px-4 py-3 font-Satoshi text-sm text-white outline-none transition-colors placeholder:text-white/40 focus:border-[#d4af37]"
                placeholder="+971 50 123 4567"
              />
            </div>
            <div>
              <label className="mb-2 block font-Satoshi text-sm text-white/80">
                LinkedIn Profile
              </label>
              <input
                type="url"
                value={formData.linkedIn}
                onChange={(e) => setFormData({ ...formData, linkedIn: e.target.value })}
                className="w-full border border-white/20 bg-white/5 px-4 py-3 font-Satoshi text-sm text-white outline-none transition-colors placeholder:text-white/40 focus:border-[#d4af37]"
                placeholder="https://linkedin.com/in/yourprofile"
              />
            </div>
          </div>

          {/* Resume Upload */}
          <div>
            <label className="mb-2 block font-Satoshi text-sm text-white/80">
              Resume/CV <span className="text-[#d4af37]">*</span>
            </label>
            <div className="relative">
              <input
                type="file"
                required
                accept=".pdf,.doc,.docx"
                onChange={(e) => setResume(e.target.files?.[0] || null)}
                className="hidden"
                id="resume-upload"
              />
              <label
                htmlFor="resume-upload"
                className="flex cursor-pointer items-center justify-center gap-3 border-2 border-dashed border-white/20 px-4 py-8 transition-colors hover:border-[#d4af37]/50"
              >
                <Upload className="h-5 w-5 text-white/40" />
                <span className="font-Satoshi text-sm text-white/60">
                  {resume ? (
                    <span className="text-[#d4af37]">{resume.name}</span>
                  ) : (
                    'Click to upload (PDF, DOC, DOCX - Max 10MB)'
                  )}
                </span>
              </label>
            </div>
          </div>

          {/* Portfolio Upload */}
          <div>
            <label className="mb-2 block font-Satoshi text-sm text-white/80">
              Portfolio (Optional)
            </label>
            <div className="relative">
              <input
                type="file"
                accept=".pdf,.zip"
                onChange={(e) => setPortfolio(e.target.files?.[0] || null)}
                className="hidden"
                id="portfolio-upload"
              />
              <label
                htmlFor="portfolio-upload"
                className="flex cursor-pointer items-center justify-center gap-3 border-2 border-dashed border-white/20 px-4 py-8 transition-colors hover:border-[#d4af37]/50"
              >
                <FileText className="h-5 w-5 text-white/40" />
                <span className="font-Satoshi text-sm text-white/60">
                  {portfolio ? (
                    <span className="text-[#d4af37]">{portfolio.name}</span>
                  ) : (
                    'Click to upload portfolio (PDF, ZIP - Max 25MB)'
                  )}
                </span>
              </label>
            </div>
          </div>

          {/* Cover Letter */}
          <div>
            <label className="mb-2 block font-Satoshi text-sm text-white/80">
              Cover Letter
            </label>
            <textarea
              rows={6}
              value={formData.coverLetter}
              onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })}
              placeholder="Tell us why you're a great fit for this position and what excites you about joining MIDC..."
              className="w-full border border-white/20 bg-white/5 px-4 py-3 font-Satoshi text-sm text-white outline-none transition-colors placeholder:text-white/40 focus:border-[#d4af37]"
            />
          </div>

          {/* Message */}
          {message && (
            <div
              className={`rounded px-4 py-3 font-Satoshi text-sm ${
                message.type === 'success'
                  ? 'bg-green-500/20 text-green-400'
                  : 'bg-red-500/20 text-red-400'
              }`}
            >
              {message.text}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full border border-[#d4af37] bg-[#d4af37] px-8 py-4 font-Satoshi text-xs uppercase tracking-widest text-neutral-950 transition-all hover:bg-transparent hover:text-[#d4af37] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Application'}
          </button>

          {/* Privacy Note */}
          <p className="text-center font-Satoshi text-xs text-white/40">
            By submitting this form, you agree to our{' '}
            <Link href="/privacy" className="text-[#d4af37] underline">
              Privacy Policy
            </Link>
            . Your information will only be used for recruitment purposes.
          </p>
        </form>
      </div>
    </section>
  );
}
