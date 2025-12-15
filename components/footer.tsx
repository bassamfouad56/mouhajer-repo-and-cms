'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Instagram, Facebook, Linkedin, Mail, Phone, MapPin, ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { FadeIn, StaggerContainer, StaggerItem, AnimatedLine, HoverLift } from './animations';

export function Footer() {
  const t = useTranslations('Footer');
  const tHeader = useTranslations('Header');
  const tServices = useTranslations('Services');
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: t('newsletter.success') });
        setEmail('');
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to subscribe' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const footerLinks = {
    company: [
      { label: tHeader('home'), href: '/' },
      { label: tHeader('about'), href: '/#about' },
      { label: tHeader('projects'), href: '/projects' },
      { label: tHeader('services'), href: '/services' },
      { label: tHeader('blog'), href: '/journal' },
      { label: tHeader('careers'), href: '/careers' },
      { label: tHeader('contact'), href: '/contact' },
    ],
    services: [
      { label: tServices('interiorDesign.title'), href: '/services#services' },
      { label: tServices('fitoutSolutions.title'), href: '/services#services' },
      { label: tServices('manufacturingJoinery.title'), href: '/services#services' },
      { label: tServices('mepEngineering.title'), href: '/services#services' },
    ],
    social: [
      { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
      { icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
      { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
    ],
  };

  return (
    <footer className="relative overflow-hidden bg-neutral-950 px-6 py-20 lg:px-12">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:100px_100px]" />

      <div className="relative z-10 mx-auto max-w-[1800px]">
        {/* Animated top divider */}
        <AnimatedLine className="mb-16" color="rgba(255,255,255,0.1)" fromCenter />

        {/* Top Section */}
        <div className="mb-16 grid gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Brand */}
          <FadeIn direction="up" className="lg:col-span-4">
            <Link href="/" className="group inline-block">
              <HoverLift lift={4} scale={1.02} shadow={false}>
                <div className="relative mb-4 h-12 w-40">
                  <Image
                    src="/logo.svg"
                    alt="Mouhajer International Design"
                    fill
                    className="object-contain brightness-0 invert"
                  />
                </div>
              </HoverLift>
            </Link>
            <p className="mb-6 max-w-sm text-sm font-light leading-relaxed text-neutral-400">
              Creating timeless, elegant spaces that reflect the unique personality
              and lifestyle of our clients since 2009.
            </p>

            {/* Contact Info with staggered animation */}
            <StaggerContainer staggerDelay={0.1} className="space-y-3 text-sm font-light text-neutral-400">
              <StaggerItem>
                <a
                  href={`mailto:${process.env.NEXT_PUBLIC_EMAIL}`}
                  className="group flex items-center gap-3 transition-colors hover:text-white"
                >
                  <motion.span
                    className="transition-transform group-hover:scale-110"
                    whileHover={{ rotate: 5 }}
                  >
                    <Mail size={16} />
                  </motion.span>
                  <span className="relative">
                    {process.env.NEXT_PUBLIC_EMAIL || 'info@mouhajerdesign.com'}
                    <span className="absolute bottom-0 left-0 h-px w-0 bg-white transition-all duration-300 group-hover:w-full" />
                  </span>
                </a>
              </StaggerItem>
              <StaggerItem>
                <a
                  href={`tel:${process.env.NEXT_PUBLIC_PHONE}`}
                  className="group flex items-center gap-3 transition-colors hover:text-white"
                >
                  <motion.span
                    className="transition-transform group-hover:scale-110"
                    whileHover={{ rotate: 15 }}
                  >
                    <Phone size={16} />
                  </motion.span>
                  <span className="relative">
                    {process.env.NEXT_PUBLIC_PHONE || '+971-4-323-4567'}
                    <span className="absolute bottom-0 left-0 h-px w-0 bg-white transition-all duration-300 group-hover:w-full" />
                  </span>
                </a>
              </StaggerItem>
              <StaggerItem>
                <div className="flex items-center gap-3">
                  <MapPin size={16} />
                  Dubai, UAE
                </div>
              </StaggerItem>
            </StaggerContainer>
          </FadeIn>

          {/* Company Links */}
          <FadeIn direction="up" delay={0.1} className="lg:col-span-2">
            <h3 className="mb-6 text-sm font-light tracking-widest text-white">
              {t('quickLinks').toUpperCase()}
            </h3>
            <StaggerContainer staggerDelay={0.05}>
              <ul className="space-y-3">
                {footerLinks.company.map((link) => (
                  <StaggerItem key={link.label}>
                    <li>
                      <Link
                        href={link.href}
                        className="group relative inline-block text-sm font-light text-neutral-400 transition-colors hover:text-white focus-visible:text-white focus-visible:outline-none"
                      >
                        <span className="relative">
                          {link.label}
                          <span className="absolute bottom-0 left-0 h-px w-0 bg-white transition-all duration-300 ease-out group-hover:w-full" />
                        </span>
                      </Link>
                    </li>
                  </StaggerItem>
                ))}
              </ul>
            </StaggerContainer>
          </FadeIn>

          {/* Services Links */}
          <FadeIn direction="up" delay={0.2} className="lg:col-span-2">
            <h3 className="mb-6 text-sm font-light tracking-widest text-white">
              {t('services').toUpperCase()}
            </h3>
            <StaggerContainer staggerDelay={0.05}>
              <ul className="space-y-3">
                {footerLinks.services.map((link) => (
                  <StaggerItem key={link.label}>
                    <li>
                      <Link
                        href={link.href}
                        className="group relative inline-block text-sm font-light text-neutral-400 transition-colors hover:text-white focus-visible:text-white focus-visible:outline-none"
                      >
                        <span className="relative">
                          {link.label}
                          <span className="absolute bottom-0 left-0 h-px w-0 bg-white transition-all duration-300 ease-out group-hover:w-full" />
                        </span>
                      </Link>
                    </li>
                  </StaggerItem>
                ))}
              </ul>
            </StaggerContainer>
          </FadeIn>

          {/* Newsletter */}
          <FadeIn direction="up" delay={0.3} className="lg:col-span-4">
            <h3 className="mb-6 text-sm font-light tracking-widest text-white">
              {t('newsletter.title').toUpperCase()}
            </h3>
            <p className="mb-4 text-sm font-light text-neutral-400">
              {t('newsletter.description')}
            </p>
            <form className="flex gap-2" onSubmit={handleNewsletterSubmit}>
              <input
                type="email"
                placeholder={t('newsletter.placeholder')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
                required
                className="flex-1 border border-neutral-800 bg-transparent px-4 py-3 text-sm font-light text-white placeholder:text-neutral-600 transition-all duration-300 focus:border-white focus:outline-none disabled:opacity-50"
              />
              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                className="group relative overflow-hidden border border-white px-6 py-3 text-sm font-light tracking-wider text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <span className="relative z-10 flex items-center gap-2">
                  {isSubmitting ? '...' : t('newsletter.subscribe').toUpperCase()}
                  <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                </span>
                <motion.span
                  className="absolute inset-0 bg-white"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                />
                <span className="absolute inset-0 z-10 flex items-center justify-center gap-2 text-neutral-950 opacity-0 transition-opacity group-hover:opacity-100">
                  {isSubmitting ? '...' : t('newsletter.subscribe').toUpperCase()}
                  <ArrowRight size={14} />
                </span>
              </motion.button>
            </form>
            {message && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-3 text-sm ${message.type === 'success' ? 'text-green-400' : 'text-red-400'}`}
              >
                {message.text}
              </motion.p>
            )}

            {/* Social Links */}
            <div className="mt-6 flex gap-4">
              {footerLinks.social.map((social, index) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  whileHover={{ y: -4, borderColor: 'white', color: 'white' }}
                  className="flex h-10 w-10 items-center justify-center border border-neutral-800 text-neutral-400 transition-colors focus-visible:border-white focus-visible:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950"
                  aria-label={social.label}
                >
                  <social.icon size={18} />
                </motion.a>
              ))}
            </div>
          </FadeIn>
        </div>

        {/* Bottom Section with animated divider */}
        <AnimatedLine className="mb-8" color="rgba(255,255,255,0.1)" />
        <FadeIn direction="up" delay={0.4}>
          <div className="flex flex-col items-center justify-between gap-6 text-sm font-light text-neutral-500 lg:flex-row">
            <div>
              {t('copyright').replace('2025', String(currentYear))}
            </div>
            <div className="flex gap-6">
              <Link href="/privacy" className="group relative transition-colors hover:text-white">
                <span>{t('privacy')}</span>
                <span className="absolute bottom-0 left-0 h-px w-0 bg-white transition-all duration-300 group-hover:w-full" />
              </Link>
              <Link href="/terms" className="group relative transition-colors hover:text-white">
                <span>{t('terms')}</span>
                <span className="absolute bottom-0 left-0 h-px w-0 bg-white transition-all duration-300 group-hover:w-full" />
              </Link>
            </div>
          </div>
        </FadeIn>
      </div>
    </footer>
  );
}
