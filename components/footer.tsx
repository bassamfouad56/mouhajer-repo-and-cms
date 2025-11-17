'use client';

import Link from 'next/link';
import { Instagram, Facebook, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { label: 'Home', href: '/' },
      { label: 'About', href: '/#about' },
      { label: 'Projects', href: '/projects' },
      { label: 'Services', href: '/services' },
      { label: 'Blog', href: '/blog' },
      { label: 'Contact', href: '/#contact' },
    ],
    services: [
      { label: 'Interior Design', href: '/services#services' },
      { label: 'Space Planning', href: '/services#services' },
      { label: 'Custom Furniture', href: '/services#services' },
      { label: 'Commercial Design', href: '/services#services' },
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
        {/* Top Section */}
        <div className="mb-16 grid gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Brand */}
          <div className="lg:col-span-4">
            <Link href="/" className="group inline-block">
              <div className="mb-4 flex flex-col">
                <span className="text-2xl font-light tracking-[0.2em] text-white transition-all duration-300 group-hover:tracking-[0.3em]">
                  MOUHAJER
                </span>
                <span className="text-[0.6rem] font-light tracking-[0.3em] text-neutral-500">
                  INTERNATIONAL DESIGN
                </span>
              </div>
            </Link>
            <p className="mb-6 max-w-sm text-sm font-light leading-relaxed text-neutral-400">
              Creating timeless, elegant spaces that reflect the unique personality
              and lifestyle of our clients since 2009.
            </p>

            {/* Contact Info */}
            <div className="space-y-3 text-sm font-light text-neutral-400">
              <a
                href={`mailto:${process.env.NEXT_PUBLIC_EMAIL}`}
                className="flex items-center gap-3 transition-colors hover:text-white"
              >
                <Mail size={16} />
                {process.env.NEXT_PUBLIC_EMAIL || 'info@mouhajerdesign.com'}
              </a>
              <a
                href={`tel:${process.env.NEXT_PUBLIC_PHONE}`}
                className="flex items-center gap-3 transition-colors hover:text-white"
              >
                <Phone size={16} />
                {process.env.NEXT_PUBLIC_PHONE || '+971-4-323-4567'}
              </a>
              <div className="flex items-center gap-3">
                <MapPin size={16} />
                Dubai, UAE
              </div>
            </div>
          </div>

          {/* Company Links */}
          <div className="lg:col-span-2">
            <h3 className="mb-6 text-sm font-light tracking-widest text-white">
              COMPANY
            </h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm font-light text-neutral-400 transition-colors hover:text-white focus-visible:text-white focus-visible:outline-none focus-visible:underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Links */}
          <div className="lg:col-span-2">
            <h3 className="mb-6 text-sm font-light tracking-widest text-white">
              SERVICES
            </h3>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm font-light text-neutral-400 transition-colors hover:text-white focus-visible:text-white focus-visible:outline-none focus-visible:underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-4">
            <h3 className="mb-6 text-sm font-light tracking-widest text-white">
              STAY UPDATED
            </h3>
            <p className="mb-4 text-sm font-light text-neutral-400">
              Subscribe to our newsletter for design inspiration and updates.
            </p>
            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 border border-neutral-800 bg-transparent px-4 py-3 text-sm font-light text-white placeholder:text-neutral-600 focus:border-white focus:outline-none"
              />
              <button
                type="submit"
                className="border border-white px-6 py-3 text-sm font-light tracking-wider text-white transition-all hover:bg-white hover:text-neutral-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950"
              >
                SUBSCRIBE
              </button>
            </form>

            {/* Social Links */}
            <div className="mt-6 flex gap-4">
              {footerLinks.social.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center border border-neutral-800 text-neutral-400 transition-all hover:border-white hover:text-white focus-visible:border-white focus-visible:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950"
                  aria-label={social.label}
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col items-center justify-between gap-6 border-t border-neutral-800 pt-8 text-sm font-light text-neutral-500 lg:flex-row">
          <div>
            © {currentYear} Mouhajer International Design. All rights reserved.
          </div>
          <div className="flex gap-6">
            <Link href="/privacy" className="transition-colors hover:text-white">
              Privacy Policy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-white">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
