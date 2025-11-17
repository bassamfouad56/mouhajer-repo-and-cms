'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ArrowRight } from 'lucide-react';
import { usePathname } from 'next/navigation';

interface SubLink {
  href: string;
  label: string;
  description?: string;
}

interface MegaMenuItem {
  href: string;
  label: string;
  isPage: boolean;
  subLinks?: SubLink[];
}

const megaMenuItems: MegaMenuItem[] = [
  { href: '/', label: 'Home', isPage: true },
  {
    href: '/projects',
    label: 'Projects',
    isPage: true,
    subLinks: [
      { href: '/projects?category=residential', label: 'Residential', description: 'Luxury homes & apartments' },
      { href: '/projects?category=commercial', label: 'Commercial', description: 'Offices & retail spaces' },
      { href: '/projects?category=hospitality', label: 'Hospitality', description: 'Hotels & restaurants' },
      { href: '/projects?category=institutional', label: 'Institutional', description: 'Educational & healthcare' },
    ],
  },
  {
    href: '/services',
    label: 'Services',
    isPage: true,
    subLinks: [
      { href: '/services#interior-design', label: 'Interior Design', description: 'Complete interior solutions' },
      { href: '/services#architecture', label: 'Architecture', description: 'Architectural design & planning' },
      { href: '/services#consultation', label: 'Consultation', description: 'Expert design advice' },
      { href: '/services#project-management', label: 'Project Management', description: 'End-to-end execution' },
    ],
  },
  {
    href: '/blog',
    label: 'Blog',
    isPage: true,
    subLinks: [
      { href: '/blog?category=trends', label: 'Design Trends', description: 'Latest in design' },
      { href: '/blog?category=tips', label: 'Design Tips', description: 'Expert advice & guides' },
      { href: '/blog?category=case-studies', label: 'Case Studies', description: 'Project deep dives' },
      { href: '/blog?category=news', label: 'News', description: 'Company updates' },
    ],
  },
  { href: '/#about', label: 'About', isPage: false },
  { href: '/#contact', label: 'Contact', isPage: false },
];

export function MegaMenu() {
  const pathname = usePathname();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

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
            onMouseLeave={() => setActiveMenu(null)}
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

                {/* Mega Menu Dropdown */}
                <AnimatePresence>
                  {activeMenu === item.href && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute left-1/2 top-full mt-6 -translate-x-1/2 pt-4"
                    >
                      <div className="rounded-sm border border-white/10 bg-neutral-950/95 p-2 backdrop-blur-xl">
                        <div className="grid gap-1">
                          {item.subLinks.map((subLink) => (
                            <Link
                              key={subLink.href}
                              href={subLink.href}
                              className="group/item flex items-start gap-3 rounded-sm px-4 py-3 transition-all hover:bg-white/5"
                            >
                              <ArrowRight
                                size={16}
                                className="mt-1 flex-shrink-0 text-neutral-500 transition-all group-hover/item:translate-x-1 group-hover/item:text-white"
                              />
                              <div className="min-w-[200px]">
                                <div className="mb-1 text-sm font-light tracking-wide text-white">
                                  {subLink.label}
                                </div>
                                {subLink.description && (
                                  <div className="text-xs font-light text-neutral-400">
                                    {subLink.description}
                                  </div>
                                )}
                              </div>
                            </Link>
                          ))}
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
