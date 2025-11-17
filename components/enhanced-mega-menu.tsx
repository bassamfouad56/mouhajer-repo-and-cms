'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ArrowRight, Sparkles } from 'lucide-react';
import { usePathname } from 'next/navigation';

interface SubLink {
  href: string;
  label: string;
  description: string;
  image: string;
  icon?: React.ReactNode;
}

interface MegaMenuItem {
  href: string;
  label: string;
  isPage: boolean;
  subLinks?: SubLink[];
  featured?: {
    title: string;
    description: string;
    image: string;
    href: string;
  };
}

const megaMenuItems: MegaMenuItem[] = [
  { href: '/', label: 'Home', isPage: true },
  {
    href: '/projects',
    label: 'Projects',
    isPage: true,
    subLinks: [
      {
        href: '/projects?category=residential',
        label: 'Residential',
        description: 'Luxury homes & private residences',
        image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=300&fit=crop',
      },
      {
        href: '/projects?category=commercial',
        label: 'Commercial',
        description: 'Modern offices & retail spaces',
        image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop',
      },
      {
        href: '/projects?category=hospitality',
        label: 'Hospitality',
        description: 'Hotels, resorts & restaurants',
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop',
      },
      {
        href: '/projects?category=institutional',
        label: 'Institutional',
        description: 'Educational & healthcare facilities',
        image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=400&h=300&fit=crop',
      },
    ],
    featured: {
      title: 'Featured Project',
      description: 'Sheraton Abu Dhabi Hotel & Resort - A masterpiece of contemporary hospitality design',
      image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=400&fit=crop',
      href: '/projects/sheraton-abu-dhabi-hotel-resort',
    },
  },
  {
    href: '/services',
    label: 'Services',
    isPage: true,
    subLinks: [
      {
        href: '/services#interior-design',
        label: 'Interior Design',
        description: 'Complete interior design solutions',
        image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=400&h=300&fit=crop',
      },
      {
        href: '/services#architecture',
        label: 'Architecture',
        description: 'Architectural design & planning',
        image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=400&h=300&fit=crop',
      },
      {
        href: '/services#consultation',
        label: 'Consultation',
        description: 'Expert design consultation services',
        image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop',
      },
      {
        href: '/services#project-management',
        label: 'Project Management',
        description: 'End-to-end project execution',
        image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=300&fit=crop',
      },
    ],
    featured: {
      title: 'Why Choose Us',
      description: '20+ years of design excellence with award-winning projects across the Middle East',
      image: 'https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=600&h=400&fit=crop',
      href: '/#about',
    },
  },
  {
    href: '/blog',
    label: 'Blog',
    isPage: true,
    subLinks: [
      {
        href: '/blog?category=trends',
        label: 'Design Trends',
        description: 'Latest trends in interior design',
        image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
      },
      {
        href: '/blog?category=tips',
        label: 'Design Tips',
        description: 'Expert advice & practical guides',
        image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=400&h=300&fit=crop',
      },
      {
        href: '/blog?category=case-studies',
        label: 'Case Studies',
        description: 'In-depth project analyses',
        image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=400&h=300&fit=crop',
      },
      {
        href: '/blog?category=news',
        label: 'News & Updates',
        description: 'Company news & announcements',
        image: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&h=300&fit=crop',
      },
    ],
    featured: {
      title: 'Latest Article',
      description: 'The Evolution of Modern Interior Design - Trends shaping the future of luxury spaces',
      image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600&h=400&fit=crop',
      href: '/blog/evolution-modern-interior-design',
    },
  },
  { href: '/#about', label: 'About', isPage: false },
  { href: '/#contact', label: 'Contact', isPage: false },
];

export function EnhancedMegaMenu() {
  const pathname = usePathname();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [hoveredSubLink, setHoveredSubLink] = useState<string | null>(null);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    if (href.startsWith('/#')) return pathname === '/';
    return pathname?.startsWith(href);
  };

  return (
    <nav className="hidden lg:block">
      <ul className="flex items-center gap-8">
        {megaMenuItems.map((item) => (
          <li
            key={item.href}
            className="relative"
            onMouseEnter={() => item.subLinks && setActiveMenu(item.href)}
            onMouseLeave={() => {
              setActiveMenu(null);
              setHoveredSubLink(null);
            }}
          >
            {item.subLinks ? (
              <div className="group">
                <Link
                  href={item.href}
                  className={`flex items-center gap-1 text-sm font-light tracking-widest transition-colors hover:text-white focus-visible:outline-none focus-visible:text-white ${
                    isActive(item.href) ? 'text-white' : 'text-neutral-300'
                  }`}
                >
                  {item.label}
                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-300 ${
                      activeMenu === item.href ? 'rotate-180' : ''
                    }`}
                  />
                </Link>

                {/* Enhanced Mega Menu Dropdown */}
                <AnimatePresence>
                  {activeMenu === item.href && (
                    <motion.div
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 20, scale: 0.95 }}
                      transition={{ duration: 0.3, ease: [0.76, 0, 0.24, 1] }}
                      className="absolute left-1/2 top-full mt-6 -translate-x-1/2 pt-4"
                    >
                      <div className="w-[900px] overflow-hidden rounded-sm border border-white/10 bg-neutral-950/98 backdrop-blur-xl">
                        <div className="grid grid-cols-12 gap-0">
                          {/* Left Side - SubLinks Grid */}
                          <div className="col-span-7 border-r border-white/10 p-8">
                            <div className="mb-6 flex items-center gap-2">
                              <Sparkles size={16} className="text-neutral-400" />
                              <span className="text-xs font-light tracking-[0.2em] text-neutral-400">
                                EXPLORE {item.label.toUpperCase()}
                              </span>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              {item.subLinks.map((subLink, index) => (
                                <Link
                                  key={subLink.href}
                                  href={subLink.href}
                                  onMouseEnter={() => setHoveredSubLink(subLink.href)}
                                  className="group/card relative overflow-hidden rounded-sm"
                                >
                                  <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05, duration: 0.3 }}
                                    className="relative"
                                  >
                                    {/* Image */}
                                    <div className="relative h-32 overflow-hidden bg-neutral-900">
                                      <Image
                                        src={subLink.image}
                                        alt={subLink.label}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover/card:scale-110"
                                      />
                                      <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/50 to-transparent opacity-60" />
                                    </div>

                                    {/* Content */}
                                    <div className="absolute inset-0 flex flex-col justify-end p-4">
                                      <div className="mb-2 flex items-center gap-2">
                                        <h4 className="text-sm font-light tracking-wide text-white">
                                          {subLink.label}
                                        </h4>
                                        <ArrowRight
                                          size={14}
                                          className="text-neutral-400 transition-all group-hover/card:translate-x-1 group-hover/card:text-white"
                                        />
                                      </div>
                                      <p className="text-xs font-light text-neutral-400">
                                        {subLink.description}
                                      </p>
                                    </div>

                                    {/* Hover Border Effect */}
                                    <div className="absolute inset-0 border-2 border-transparent transition-colors group-hover/card:border-white/20" />
                                  </motion.div>
                                </Link>
                              ))}
                            </div>
                          </div>

                          {/* Right Side - Featured Content */}
                          {item.featured && (
                            <div className="col-span-5 p-8">
                              <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1, duration: 0.4 }}
                              >
                                <div className="mb-4 flex items-center gap-2">
                                  <div className="h-px w-8 bg-neutral-700" />
                                  <span className="text-xs font-light tracking-[0.2em] text-neutral-500">
                                    FEATURED
                                  </span>
                                </div>

                                <Link
                                  href={item.featured.href}
                                  className="group/featured block"
                                >
                                  {/* Featured Image */}
                                  <div className="relative mb-4 h-48 overflow-hidden rounded-sm bg-neutral-900">
                                    <Image
                                      src={item.featured.image}
                                      alt={item.featured.title}
                                      fill
                                      className="object-cover transition-transform duration-700 group-hover/featured:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/30 to-transparent" />
                                  </div>

                                  {/* Featured Content */}
                                  <h4 className="mb-2 text-lg font-light tracking-wide text-white transition-colors group-hover/featured:text-neutral-300">
                                    {item.featured.title}
                                  </h4>
                                  <p className="mb-4 text-sm font-light leading-relaxed text-neutral-400">
                                    {item.featured.description}
                                  </p>

                                  <div className="inline-flex items-center gap-2 text-xs font-light tracking-wider text-neutral-500 transition-colors group-hover/featured:text-white">
                                    <span>LEARN MORE</span>
                                    <ArrowRight
                                      size={14}
                                      className="transition-transform group-hover/featured:translate-x-1"
                                    />
                                  </div>
                                </Link>
                              </motion.div>
                            </div>
                          )}
                        </div>

                        {/* Bottom CTA Bar */}
                        <div className="border-t border-white/10 bg-neutral-900/50 px-8 py-4">
                          <div className="flex items-center justify-between">
                            <Link
                              href={item.href}
                              className="text-sm font-light tracking-wide text-neutral-400 transition-colors hover:text-white"
                            >
                              View All {item.label} →
                            </Link>
                            <Link
                              href="/#contact"
                              className="rounded-full border border-white/20 px-4 py-2 text-xs font-light tracking-wider text-white transition-all hover:border-white hover:bg-white hover:text-neutral-950"
                            >
                              GET IN TOUCH
                            </Link>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                href={item.href}
                className={`group relative text-sm font-light tracking-widest transition-colors hover:text-white focus-visible:outline-none focus-visible:text-white ${
                  isActive(item.href) ? 'text-white' : 'text-neutral-300'
                }`}
              >
                {item.label}
                <span
                  className={`absolute -bottom-1 left-0 h-px bg-white transition-all duration-300 group-hover:w-full group-focus-visible:w-full ${
                    isActive(item.href) ? 'w-full' : 'w-0'
                  }`}
                />
              </Link>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
