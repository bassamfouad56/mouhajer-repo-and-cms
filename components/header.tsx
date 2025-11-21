'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Menu, X, ChevronDown } from 'lucide-react';
import { EnhancedMegaMenu } from './enhanced-mega-menu';
import { LanguageSwitcher } from './language-switcher';

const mobileNavItems = [
  {
    href: '/',
    label: 'Home',
    isPage: true
  },
  {
    href: '/projects',
    label: 'Projects',
    isPage: true,
    subLinks: [
      { href: '/projects?category=residential', label: 'Residential' },
      { href: '/projects?category=commercial', label: 'Commercial' },
      { href: '/projects?category=hospitality', label: 'Hospitality' },
      { href: '/projects?category=institutional', label: 'Institutional' },
    ],
  },
  {
    href: '/services',
    label: 'Services',
    isPage: true,
    subLinks: [
      { href: '/services#interior-design', label: 'Interior Design' },
      { href: '/services#architecture', label: 'Architecture' },
      { href: '/services#consultation', label: 'Consultation' },
      { href: '/services#project-management', label: 'Project Management' },
    ],
  },
  {
    href: '/industries',
    label: 'Industries',
    isPage: true,
    subLinks: [
      { href: '/industries/residential', label: 'Residential' },
      { href: '/industries/hospitality', label: 'Hospitality' },
      { href: '/industries/retail', label: 'Retail' },
      { href: '/industries/healthcare', label: 'Healthcare' },
    ],
  },
  {
    href: '/blog',
    label: 'Blog',
    isPage: true,
    subLinks: [
      { href: '/blog?category=trends', label: 'Design Trends' },
      { href: '/blog?category=tips', label: 'Design Tips' },
      { href: '/blog?category=case-studies', label: 'Case Studies' },
      { href: '/blog?category=news', label: 'News' },
    ],
  },
  { href: '/#about', label: 'About', isPage: false },
  { href: '/#contact', label: 'Contact', isPage: false },
];

export function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedMobileItem, setExpandedMobileItem] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Check if a nav item is active
  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    if (href.startsWith('/#')) return pathname === '/';
    return pathname?.startsWith(href);
  };

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        className={`fixed top-0 z-40 w-full transition-all duration-500 ${
          isScrolled
            ? 'bg-neutral-950/80 backdrop-blur-xl'
            : 'bg-transparent'
        }`}
      >
        <div className="mx-auto max-w-[1800px] px-6 lg:px-12">
          <div className="flex h-20 items-center justify-between lg:h-24">
            {/* Logo */}
            <Link href="/" className="group relative z-50">
              <div className="flex flex-col">
                <span className="text-xl font-light tracking-[0.2em] text-white transition-all duration-300 group-hover:tracking-[0.3em] lg:text-2xl">
                  MOUHAJER
                </span>
                <span className="text-[0.5rem] font-light tracking-[0.3em] text-neutral-400 lg:text-[0.6rem]">
                  INTERNATIONAL DESIGN
                </span>
              </div>
            </Link>

            {/* Desktop Navigation with Enhanced Mega Menu */}
            <div className="flex items-center gap-6">
              <EnhancedMegaMenu />
              <LanguageSwitcher />
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="relative z-50 text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950 lg:hidden"
              aria-label="Toggle menu"
            >
              <AnimatePresence mode="wait">
                {isMobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X size={24} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu size={24} />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-30 bg-neutral-950/95 backdrop-blur-xl lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.nav
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
              className="fixed right-0 top-0 z-30 flex h-full w-full flex-col justify-center bg-neutral-950 px-8 lg:hidden"
            >
              <ul className="flex flex-col gap-6">
                {mobileNavItems.map((item, index) => (
                  <motion.li
                    key={item.href}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                  >
                    {item.subLinks ? (
                      <div>
                        <button
                          onClick={() =>
                            setExpandedMobileItem(
                              expandedMobileItem === item.href ? null : item.href
                            )
                          }
                          className="flex w-full items-center justify-between text-left text-3xl font-light tracking-wider text-white transition-all hover:text-neutral-300"
                        >
                          {item.label}
                          <ChevronDown
                            size={24}
                            className={`transition-transform duration-300 ${
                              expandedMobileItem === item.href ? 'rotate-180' : ''
                            }`}
                          />
                        </button>
                        <AnimatePresence>
                          {expandedMobileItem === item.href && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                              className="mt-4 space-y-3 pl-6"
                            >
                              {item.subLinks.map((subLink) => (
                                <Link
                                  key={subLink.href}
                                  href={subLink.href}
                                  onClick={() => setIsMobileMenuOpen(false)}
                                  className="block text-lg font-light text-neutral-400 transition-all hover:translate-x-2 hover:text-white"
                                >
                                  {subLink.label}
                                </Link>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : (
                      <Link
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`block text-3xl font-light tracking-wider transition-all hover:translate-x-2 hover:text-neutral-300 focus-visible:translate-x-2 focus-visible:text-neutral-300 focus-visible:outline-none ${
                          isActive(item.href) ? 'text-neutral-300' : 'text-white'
                        }`}
                      >
                        {item.label}
                      </Link>
                    )}
                  </motion.li>
                ))}
              </ul>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
