"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ChevronDown, ShoppingBag, Search } from "lucide-react";
import { EnhancedMegaMenu } from "./enhanced-mega-menu";
import { LanguageSwitcher } from "./language-switcher";
import { useCart } from "@/lib/cart-context";
import { useSearch } from "@/lib/algolia/search-context";
import { useTranslations } from "next-intl";
import type { MegaMenuImages } from "./server-header";

interface HeaderProps {
  megaMenuImages?: MegaMenuImages | null;
}

export function Header({ megaMenuImages }: HeaderProps) {
  const t = useTranslations("Header");
  const tProjects = useTranslations("Projects.categories");
  const tServices = useTranslations("Services");
  const tBlog = useTranslations("Blog.filterCategories");

  const mobileNavItems = [
    {
      href: "/",
      label: t("home"),
      isPage: true,
    },
    {
      href: "/projects",
      label: t("projects"),
      isPage: true,
      subLinks: [
        {
          href: "/projects?filter=residential",
          label: tProjects("residential"),
        },
        { href: "/projects?filter=commercial", label: tProjects("commercial") },
        {
          href: "/projects?filter=hospitality",
          label: tProjects("hospitality"),
        },
        {
          href: "/projects?filter=institutional",
          label: tProjects("institutional"),
        },
      ],
    },
    {
      href: "/services",
      label: t("services"),
      isPage: true,
      subLinks: [
        {
          href: "/services#interior-design",
          label: tServices("interiorDesign.title"),
        },
        { href: "/services#fitout", label: tServices("fitoutSolutions.title") },
        {
          href: "/services#construction",
          label: tServices("constructionManagement.title"),
        },
        { href: "/services#mep", label: tServices("mepEngineering.title") },
      ],
    },
    {
      href: "/industries",
      label: t("industries"),
      isPage: true,
      subLinks: [
        {
          href: "/industries/high-end-residential",
          label: tProjects("residential"),
        },
        {
          href: "/industries/luxury-hospitality",
          label: tProjects("hospitality"),
        },
        {
          href: "/industries/commercial-corporate",
          label: tProjects("commercial"),
        },
      ],
    },
    {
      href: "/journal",
      label: t("blog"),
      isPage: true,
      subLinks: [
        { href: "/journal/design-trends", label: "Design Trends" },
        { href: "/journal/project-stories", label: "Project Stories" },
        { href: "/journal/behind-the-scenes", label: "Behind the Scenes" },
        { href: "/journal/materials-craft", label: "Materials & Craft" },
        { href: "/journal/engineering", label: "Engineering" },
        { href: "/journal/founders-insights", label: "Founder's Insights" },
      ],
    },
    {
      href: "/showroom",
      label: t("showroom"),
      isPage: true,
    },
    {
      href: "/about",
      label: t("about"),
      isPage: true,
    },
    {
      href: "/contact",
      label: t("contact"),
      isPage: true,
    },
  ];
  const pathname = usePathname();
  const { totalItems, openCart } = useCart();
  const { openSearch } = useSearch();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedMobileItem, setExpandedMobileItem] = useState<string | null>(
    null,
  );

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Update background style
      setIsScrolled(currentScrollY > 50);

      // Determine scroll direction
      if (currentScrollY < 100) {
        // Always show header near top of page
        setIsVisible(true);
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up - show header
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down & past threshold - hide header
        setIsVisible(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // Check if a nav item is active
  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    if (href.startsWith("/#")) return pathname === "/";
    return pathname?.startsWith(href);
  };

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: isVisible || isMobileMenuOpen ? 0 : -100 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 z-50 w-full transition-colors duration-500 ${
          isScrolled ? "bg-neutral-950/80 backdrop-blur-xl" : "bg-transparent"
        }`}
      >
        <div className="mx-auto max-w-[1800px] px-6 lg:px-12">
          <div className="flex h-20 items-center justify-between lg:h-24">
            {/* Logo */}
            <Link href="/" className="group relative z-50">
              <motion.div
                className="relative h-12 w-40 lg:h-14 lg:w-48"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <Image
                  src="/logo.svg"
                  alt="Mouhajer International Design"
                  fill
                  className="object-contain brightness-0 invert"
                  priority
                />
              </motion.div>
            </Link>

            {/* Desktop Navigation with Enhanced Mega Menu */}
            <div className="flex items-center gap-6">
              <EnhancedMegaMenu megaMenuImages={megaMenuImages} />

              {/* Search Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={openSearch}
                className="group relative hidden items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm text-white/80 backdrop-blur-sm transition-all hover:border-[#8f7852]/50 hover:bg-white/10 hover:text-white lg:flex"
                aria-label="Search"
              >
                <Search
                  size={16}
                  className="text-white/60 transition-colors group-hover:text-[#8f7852]"
                />
                <span className="font-light">Search</span>
                <kbd className="ml-2 hidden rounded bg-white/10 px-1.5 py-0.5 text-xs text-white/40 xl:inline-block">
                  ⌘K
                </kbd>
              </motion.button>

              {/* Cart Button - Only show on showroom pages */}
              {pathname?.includes("/showroom") && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  onClick={openCart}
                  className="relative hidden text-white transition-colors hover:text-neutral-300 lg:block"
                  aria-label="Shopping cart"
                >
                  <ShoppingBag size={20} />
                  {totalItems > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs font-medium text-neutral-950"
                    >
                      {totalItems}
                    </motion.span>
                  )}
                </motion.button>
              )}

              <LanguageSwitcher />
            </div>

            {/* Mobile Search & Menu Buttons */}
            <div className="flex items-center gap-3 lg:hidden">
              {/* Mobile Search Button */}
              <button
                onClick={openSearch}
                className="relative z-50 text-white/80 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950"
                aria-label="Search"
              >
                <Search size={22} />
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="relative z-50 text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950"
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
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
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
                              expandedMobileItem === item.href
                                ? null
                                : item.href,
                            )
                          }
                          className="flex w-full items-center justify-between text-left text-3xl font-light tracking-wider text-white transition-all hover:text-neutral-300"
                        >
                          {item.label}
                          <ChevronDown
                            size={24}
                            className={`transition-transform duration-300 ${
                              expandedMobileItem === item.href
                                ? "rotate-180"
                                : ""
                            }`}
                          />
                        </button>
                        <AnimatePresence>
                          {expandedMobileItem === item.href && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
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
                          isActive(item.href)
                            ? "text-neutral-300"
                            : "text-white"
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
