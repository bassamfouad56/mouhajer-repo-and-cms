'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ArrowRight, Sparkles, Award } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';

interface SubLink {
  href: string;
  label: string;
  description: string;
  image: string;
  icon?: React.ReactNode;
  animation?: 'opacity' | 'scale';
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

export function EnhancedMegaMenu() {
  const pathname = usePathname();
  const t = useTranslations('MegaMenu');
  const tHeader = useTranslations('Header');

  const megaMenuItems: MegaMenuItem[] = [
    { href: '/', label: tHeader('home'), isPage: true },
    {
      href: '/projects',
      label: tHeader('projects'),
      isPage: true,
      subLinks: [
        {
          href: '/projects?category=residential',
          label: t('projects.residential.label'),
          description: t('projects.residential.description'),
          image: '/projects/bedroom-interior/1.jpg',
        },
        {
          href: '/projects?category=commercial',
          label: t('projects.commercial.label'),
          description: t('projects.commercial.description'),
          image: '/projects/commercial-interior/11.jpg',
        },
        {
          href: '/projects?category=hospitality',
          label: t('projects.hospitality.label'),
          description: t('projects.hospitality.description'),
          image: '/projects/commercial-interior/16.jpg',
        },
        {
          href: '/projects?category=ongoing',
          label: t('projects.ongoing.label'),
          description: t('projects.ongoing.description'),
          image: '/projects/commercial-interior/17.jpg',
        },
      ],
      featured: {
        title: t('projects.featured.title'),
        description: t('projects.featured.description'),
        image: '/projects/commercial-interior/11.jpg',
        href: '/projects',
      },
    },
    {
      href: '/services',
      label: tHeader('services'),
      isPage: true,
      subLinks: [
        {
          href: '/services/civil-construction',
          label: t('services.civilConstruction.label'),
          description: t('services.civilConstruction.description'),
          image: '/projects/turnkey-design-fitout/_MID2543-HDR.jpg',
        },
        {
          href: '/services/interior-architecture',
          label: t('services.interiorArchitecture.label'),
          description: t('services.interiorArchitecture.description'),
          image: '/projects/bedroom-interior/1.jpg',
        },
        {
          href: '/services/mep-engineering',
          label: t('services.mepEngineering.label'),
          description: t('services.mepEngineering.description'),
          image: '/projects/commercial-interior/18.jpg',
        },
        {
          href: '/services/manufacturing-joinery',
          label: t('services.manufacturingJoinery.label'),
          description: t('services.manufacturingJoinery.description'),
          image: '/projects/turnkey-design-fitout/_MID2583-HDR.jpg',
        },
        {
          href: '/services/fit-out-execution',
          label: t('services.fitOutExecution.label'),
          description: t('services.fitOutExecution.description'),
          image: '/projects/bathroom/_MID0061-HDR.jpg',
        },
        {
          href: '/services/handover-maintenance',
          label: t('services.handoverMaintenance.label'),
          description: t('services.handoverMaintenance.description'),
          image: '/projects/commercial-interior/19.jpg',
        },
      ],
      featured: {
        title: t('services.featured.title'),
        description: t('services.featured.description'),
        image: '/projects/turnkey-design-fitout/_MID2543-HDR.jpg',
        href: '/services',
      },
    },
    {
      href: '/industries',
      label: tHeader('industries'),
      isPage: true,
      subLinks: [
        {
          href: '/industries/luxury-hospitality',
          label: t('industries.luxuryHospitality.label'),
          description: t('industries.luxuryHospitality.description'),
          image: '/projects/commercial-interior/23.jpg',
        },
        {
          href: '/industries/high-end-residential',
          label: t('industries.highEndResidential.label'),
          description: t('industries.highEndResidential.description'),
          image: '/projects/bedroom-interior/5.jpg',
        },
        {
          href: '/industries/commercial-corporate',
          label: t('industries.commercialCorporate.label'),
          description: t('industries.commercialCorporate.description'),
          image: '/projects/commercial-interior/27.jpg',
        },
      ],
      featured: {
        title: t('industries.featured.title'),
        description: t('industries.featured.description'),
        image: '/projects/bedroom-interior/1.jpg',
        href: '/industries',
      },
    },
    {
      href: '/blog',
      label: tHeader('blog'),
      isPage: true,
      subLinks: [
        {
          href: '/blog?category=trends',
          label: t('blog.trends.label'),
          description: t('blog.trends.description'),
          image: '/projects/turnkey-design-fitout/_MID0003-HDR.jpg',
        },
        {
          href: '/blog?category=tips',
          label: t('blog.tips.label'),
          description: t('blog.tips.description'),
          image: '/projects/bedroom-interior/6.jpg',
        },
        {
          href: '/blog?category=case-studies',
          label: t('blog.caseStudies.label'),
          description: t('blog.caseStudies.description'),
          image: '/projects/commercial-interior/30.jpg',
        },
        {
          href: '/blog?category=news',
          label: t('blog.news.label'),
          description: t('blog.news.description'),
          image: '/projects/commercial-interior/37.jpg',
        },
      ],
      featured: {
        title: t('blog.featured.title'),
        description: t('blog.featured.description'),
        image: '/projects/commercial-interior/16.jpg',
        href: '/blog',
      },
    },
    {
      href: '/about',
      label: tHeader('about'),
      isPage: true,
      subLinks: [
        {
          href: '/about',
          label: t('about.aboutMidc.label'),
          description: t('about.aboutMidc.description'),
          image: '/logo.svg',
          animation: 'opacity' as const,
        },
        {
          href: '/about/founder',
          label: t('about.founder.label'),
          description: t('about.founder.description'),
          image: '/founder/CEO Arabia.jpg',
          animation: 'scale' as const,
        },
        {
          href: '/about/process',
          label: t('about.process.label'),
          description: t('about.process.description'),
          image: '/projects/turnkey-design-fitout/_MID2653-HDR.jpg',
        },
        {
          href: '/about/awards',
          label: t('about.awards.label'),
          description: t('about.awards.description'),
          image: '/projects/commercial-interior/39.jpg',
        },
      ],
      featured: {
        title: t('about.featured.title'),
        description: t('about.featured.description'),
        image: '/projects/turnkey-design-fitout/_MID0003-HDR.jpg',
        href: '/about',
      },
    },
    {
      href: '/contact',
      label: tHeader('contact'),
      isPage: true,
      subLinks: [
        {
          href: '/contact',
          label: t('contact.contactUs.label'),
          description: t('contact.contactUs.description'),
          image: '/projects/commercial-interior/40.jpg',
        },
        {
          href: '/contact/book-consultation',
          label: t('contact.bookConsultation.label'),
          description: t('contact.bookConsultation.description'),
          image: '/projects/turnkey-design-fitout/_MID0058-HDR.jpg',
        },
      ],
      // No featured section = simple dropdown
    },
  ];
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    if (href.startsWith('/#')) return pathname === '/';
    return pathname?.startsWith(href);
  };

  // Outside click handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        activeMenu &&
        menuRef.current &&
        navRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !navRef.current.contains(event.target as Node)
      ) {
        setActiveMenu(null);
      }
    };

    if (activeMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeMenu]);

  return (
    <nav ref={navRef} className="hidden lg:block" aria-label="Main navigation">
      <ul className="flex items-center gap-10" role="menubar">
        {megaMenuItems.map((item) => (
          <li
            key={item.href}
            className="relative"
            role="none"
            onMouseEnter={() => item.subLinks && setActiveMenu(item.href)}
            onMouseLeave={() => setActiveMenu(null)}
          >
            {item.subLinks ? (
              <>
                <Link
                  href={item.href}
                  role="menuitem"
                  aria-haspopup="true"
                  aria-expanded={activeMenu === item.href}
                  className={`group relative z-50 flex items-center gap-1.5 text-[13px] font-light tracking-[0.1em] transition-all duration-300 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:text-white rounded ${
                    isActive(item.href) ? 'text-white' : 'text-neutral-300'
                  }`}
                >
                  {item.label}
                  <ChevronDown
                    size={13}
                    aria-hidden="true"
                    className={`transition-all duration-500 ${
                      activeMenu === item.href ? 'rotate-180 text-white' : 'text-neutral-400'
                    }`}
                  />
                </Link>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {activeMenu === item.href && (
                    <>
                      {/* Invisible backdrop for smooth close - lower z-index */}
                      <div className="fixed inset-0 z-30" onClick={() => setActiveMenu(null)} />

                      {/* Simple Dropdown for items without featured section */}
                      {!item.featured && item.subLinks && item.subLinks.length <= 4 ? (
                        <motion.div
                          ref={menuRef}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.2, ease: 'easeOut' }}
                          className="absolute left-0 top-full z-40 mt-3 w-64"
                        >
                          <div className="overflow-hidden rounded-xl border border-white/10 bg-neutral-950/98 shadow-2xl shadow-black/50 backdrop-blur-xl">
                            {/* Top accent */}
                            <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-[#d4af37]/40 to-transparent" />

                            <div className="p-2">
                              {item.subLinks.map((subLink, index) => (
                                <Link
                                  key={subLink.href}
                                  href={subLink.href}
                                  className="group/item flex items-center gap-3 rounded-lg px-4 py-3 transition-all hover:bg-white/5"
                                  onClick={() => setActiveMenu(null)}
                                >
                                  <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="flex flex-1 items-center justify-between"
                                  >
                                    <div>
                                      <span className="block text-[13px] font-light text-white group-hover/item:text-[#d4af37]">
                                        {subLink.label}
                                      </span>
                                      <span className="mt-0.5 block text-[11px] text-neutral-500">
                                        {subLink.description}
                                      </span>
                                    </div>
                                    <ArrowRight size={14} className="text-neutral-600 transition-all group-hover/item:translate-x-1 group-hover/item:text-[#d4af37]" />
                                  </motion.div>
                                </Link>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      ) : (
                      /* Luxurious Mega Menu Dropdown for items with featured section */
                      <motion.div
                        ref={menuRef}
                        initial={{ opacity: 0, y: 30, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.96 }}
                        transition={{
                          duration: 0.4,
                          ease: [0.19, 1, 0.22, 1],
                          opacity: { duration: 0.25 }
                        }}
                        className="fixed left-1/2 top-[88px] z-40 -translate-x-1/2"
                      >
                        {/* Premium container with subtle shadow */}
                        <div className={`relative w-[95vw] overflow-hidden rounded-lg border border-white/8 bg-linear-to-br from-neutral-900/98 via-neutral-950/98 to-black/98 shadow-2xl shadow-black/40 backdrop-blur-2xl ${
                          item.subLinks && item.subLinks.length > 4 ? 'max-w-[1200px]' : 'max-w-[1000px]'
                        }`}>
                        {/* Subtle noise texture overlay */}
                        <div className="pointer-events-none absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDMiLz48L3N2Zz4=')] opacity-40" />

                        {/* Top accent line */}
                        <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                        <div className="relative grid grid-cols-12 gap-0">
                          {/* Left Side - SubLinks Grid with enhanced spacing */}
                          <div className={`${(item.subLinks?.length ?? 0) > 4 ? 'col-span-8' : 'col-span-7'} border-r border-white/6 p-10`}>
                            {/* Premium header */}
                            <div className="mb-8 flex items-center gap-3">
                              <div className="rounded-full bg-white/5 p-2 backdrop-blur-sm">
                                <Sparkles size={14} className="text-neutral-400" />
                              </div>
                              <span className="text-[11px] font-light tracking-[0.25em] text-neutral-400">
                                {t('explore')} {item.label.toUpperCase()}
                              </span>
                            </div>

                            {/* Cards grid - 3 columns for 6+ items, 2 columns for less */}
                            <div className={`grid gap-4 ${
                              (item.subLinks?.length ?? 0) > 4
                                ? 'grid-cols-3'
                                : 'grid-cols-2 gap-5'
                            }`}>
                              {item.subLinks?.map((subLink, index) => (
                                <Link
                                  key={subLink.href}
                                  href={subLink.href}
                                  className={`group/card relative overflow-hidden rounded-lg bg-neutral-900/40 backdrop-blur-sm transition-all duration-500 hover:bg-neutral-800/60 hover:shadow-xl hover:shadow-black/20 ${
                                    (item.subLinks?.length ?? 0) > 4 && !subLink.image ? '' : ''
                                  }`}
                                >
                                  <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{
                                      delay: index * 0.05,
                                      duration: 0.5,
                                      ease: [0.19, 1, 0.22, 1]
                                    }}
                                    className="relative"
                                  >
                                    {/* Show image only if it exists and has content */}
                                    {subLink.image && (
                                      <div className="relative h-36 overflow-hidden bg-neutral-900/60">
                                        <Image
                                          src={subLink.image}
                                          alt={subLink.label}
                                          fill
                                          className={`transition-all duration-700 ${
                                            subLink.animation === 'opacity'
                                              ? 'object-contain p-6 opacity-60 group-hover/card:opacity-100'
                                              : subLink.animation === 'scale'
                                              ? 'object-cover scale-110 group-hover/card:scale-100'
                                              : 'object-cover group-hover/card:scale-110 group-hover/card:brightness-110'
                                          }`}
                                        />
                                        <div className={`absolute inset-0 bg-linear-to-t from-neutral-950 via-neutral-950/40 to-transparent transition-opacity duration-500 ${
                                          subLink.animation === 'opacity' ? 'opacity-0' : 'opacity-70 group-hover/card:opacity-50'
                                        }`} />

                                        {/* Shimmer effect on hover */}
                                        <div className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000 group-hover/card:translate-x-full" />
                                      </div>
                                    )}

                                    {/* Content - compact for 6+ items without images */}
                                    <div className={`${(item.subLinks?.length ?? 0) > 4 && !subLink.image ? 'p-4' : 'p-5'}`}>
                                      {/* Number indicator for services */}
                                      {(item.subLinks?.length ?? 0) > 4 && !subLink.image && (
                                        <div className="mb-2 text-[10px] font-light tracking-[0.2em] text-[#d4af37]/60">
                                          0{index + 1}
                                        </div>
                                      )}
                                      <div className="mb-2 flex items-center justify-between">
                                        <h4 className={`font-light tracking-wide text-white transition-colors duration-300 ${
                                          (item.subLinks?.length ?? 0) > 4 && !subLink.image ? 'text-[13px]' : 'text-[15px]'
                                        }`}>
                                          {subLink.label}
                                        </h4>
                                        <div className="rounded-full bg-white/5 p-1.5 backdrop-blur-sm transition-all duration-300 group-hover/card:bg-white/10">
                                          <ArrowRight
                                            size={12}
                                            className="text-neutral-400 transition-all duration-300 group-hover/card:translate-x-0.5 group-hover/card:text-white"
                                          />
                                        </div>
                                      </div>
                                      <p className={`font-light leading-relaxed text-neutral-400 transition-colors duration-300 group-hover/card:text-neutral-300 ${
                                        (item.subLinks?.length ?? 0) > 4 && !subLink.image ? 'text-[11px]' : 'text-[12px]'
                                      }`}>
                                        {subLink.description}
                                      </p>
                                    </div>

                                    {/* Subtle border glow on hover */}
                                    <div className="absolute inset-0 rounded-lg border border-white/0 transition-all duration-500 group-hover/card:border-white/10" />
                                  </motion.div>
                                </Link>
                              ))}
                            </div>
                          </div>

                          {/* Right Side - Featured Content with premium styling */}
                          {item.featured && (
                            <div className={`${(item.subLinks?.length ?? 0) > 4 ? 'col-span-4' : 'col-span-5'} p-10`}>
                              <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{
                                  delay: 0.15,
                                  duration: 0.5,
                                  ease: [0.19, 1, 0.22, 1]
                                }}
                                className="h-full"
                              >
                                {/* Premium featured badge */}
                                <div className="mb-6 flex items-center gap-3">
                                  <div className="h-px flex-1 bg-gradient-to-r from-neutral-700 to-transparent" />
                                  <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 backdrop-blur-sm">
                                    <Award size={12} className="text-neutral-400" />
                                    <span className="text-[10px] font-light tracking-[0.2em] text-neutral-400">
                                      {t('featured')}
                                    </span>
                                  </div>
                                </div>

                                <Link
                                  href={item.featured.href}
                                  className="group/featured block"
                                >
                                  {/* Premium featured image */}
                                  <div className="relative mb-6 h-56 overflow-hidden rounded-lg bg-neutral-900/60 shadow-lg shadow-black/20">
                                    <Image
                                      src={item.featured.image}
                                      alt={item.featured.title}
                                      fill
                                      className="object-cover transition-all duration-1000 group-hover/featured:scale-110 group-hover/featured:brightness-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-neutral-950/20 to-transparent" />

                                    {/* Premium overlay badge */}
                                    <div className="absolute right-4 top-4 rounded-full border border-white/20 bg-black/40 px-3 py-1.5 backdrop-blur-md">
                                      <span className="text-[10px] font-light tracking-wider text-white">{t('new')}</span>
                                    </div>
                                  </div>

                                  {/* Premium content */}
                                  <h4 className="mb-3 text-[17px] font-light leading-snug tracking-wide text-white transition-all duration-300 group-hover/featured:text-neutral-200">
                                    {item.featured.title}
                                  </h4>
                                  <p className="mb-6 text-[13px] font-light leading-relaxed text-neutral-400 transition-colors duration-300 group-hover/featured:text-neutral-300">
                                    {item.featured.description}
                                  </p>

                                  {/* Premium CTA button */}
                                  <div className="inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/5 px-5 py-2.5 backdrop-blur-sm transition-all duration-300 group-hover/featured:border-white/20 group-hover/featured:bg-white/10 group-hover/featured:shadow-lg group-hover/featured:shadow-white/5">
                                    <span className="text-[11px] font-light tracking-[0.15em] text-neutral-300 transition-colors duration-300 group-hover/featured:text-white">
                                      {t('learnMore')}
                                    </span>
                                    <ArrowRight
                                      size={13}
                                      className="text-neutral-400 transition-all duration-300 group-hover/featured:translate-x-1 group-hover/featured:text-white"
                                    />
                                  </div>
                                </Link>
                              </motion.div>
                            </div>
                          )}
                        </div>

                        {/* Premium footer with better spacing */}
                        <div className="border-t border-white/[0.06] bg-gradient-to-r from-neutral-900/60 via-neutral-950/60 to-black/60 px-10 py-5 backdrop-blur-sm">
                          <div className="flex items-center justify-between">
                            <Link
                              href={item.href}
                              className="group/footer flex items-center gap-2 text-[13px] font-light tracking-wide text-neutral-400 transition-colors duration-300 hover:text-white"
                            >
                              <span>{t('viewAll')} {item.label}</span>
                              <ArrowRight size={14} className="transition-transform duration-300 group-hover/footer:translate-x-1" />
                            </Link>
                            <Link
                              href="/contact"
                              className="group/cta relative overflow-hidden rounded-full border border-white/15 bg-white/5 px-6 py-2.5 text-[11px] font-light tracking-[0.15em] text-white backdrop-blur-sm transition-all duration-300 hover:border-white/30 hover:bg-white hover:text-neutral-950 hover:shadow-lg hover:shadow-white/20"
                            >
                              <span className="relative z-10">{t('getInTouch')}</span>
                              <div className="absolute inset-0 -translate-x-full bg-white transition-transform duration-300 group-hover/cta:translate-x-0" />
                            </Link>
                          </div>
                        </div>

                        {/* Bottom accent line */}
                        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                      </div>
                      </motion.div>
                      )}
                    </>
                  )}
                </AnimatePresence>
              </>
            ) : (
              <Link
                href={item.href}
                role="menuitem"
                className={`group relative text-[13px] font-light tracking-[0.1em] transition-all duration-300 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:text-white rounded ${
                  isActive(item.href) ? 'text-white' : 'text-neutral-300'
                }`}
              >
                {item.label}
                <span
                  className={`absolute -bottom-1.5 left-0 h-[1.5px] rounded-full bg-white transition-all duration-500 ease-out group-hover:w-full group-focus-visible:w-full ${
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
