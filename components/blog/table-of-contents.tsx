"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { List, X, ChevronRight } from "lucide-react";

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  content: any[];
}

function extractHeadings(content: any[]): TOCItem[] {
  const headings: TOCItem[] = [];

  content.forEach((block, index) => {
    if (block._type === "block" && ["h2", "h3"].includes(block.style)) {
      const text =
        block.children?.map((child: any) => child.text || "").join("") || "";

      if (text.trim()) {
        const id = `heading-${index}-${text
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .slice(0, 50)}`;
        headings.push({
          id,
          text: text.trim(),
          level: block.style === "h2" ? 2 : 3,
        });
      }
    }
  });

  return headings;
}

export default function TableOfContents({ content }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const headings = useMemo(() => extractHeadings(content), [content]);

  // Track scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const winScroll = document.documentElement.scrollTop;
      const height =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      setScrollProgress(scrolled);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Intersection Observer for active section
  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: 0 }
    );

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [headings]);

  // Add IDs to headings in DOM
  useEffect(() => {
    if (headings.length === 0) return;
    const articleHeadings = document.querySelectorAll("article h2, article h3");
    let headingIndex = 0;
    articleHeadings.forEach((element) => {
      if (headingIndex < headings.length) {
        element.id = headings[headingIndex].id;
        headingIndex++;
      }
    });
  }, [headings]);

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
      setIsOpen(false);
    }
  };

  if (headings.length < 3) return null;

  const activeIndex = headings.findIndex((h) => h.id === activeId);

  return (
    <>
      {/* Floating TOC Button */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1 }}
        className="fixed left-6 top-1/2 z-40 -translate-y-1/2 hidden lg:block"
      >
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-3 rounded-full border border-neutral-200 bg-white/90 px-4 py-3 shadow-lg backdrop-blur-sm transition-all hover:border-[#c9a962] hover:shadow-xl"
        >
          {/* Progress Ring */}
          <div className="relative">
            <svg className="h-8 w-8 -rotate-90" viewBox="0 0 36 36">
              <circle
                cx="18"
                cy="18"
                r="14"
                fill="none"
                stroke="#e5e5e5"
                strokeWidth="3"
              />
              <circle
                cx="18"
                cy="18"
                r="14"
                fill="none"
                stroke="#c9a962"
                strokeWidth="3"
                strokeDasharray="87.96"
                strokeDashoffset={`${87.96 - (scrollProgress / 100) * 87.96}`}
                strokeLinecap="round"
              />
            </svg>
            <List
              size={14}
              className="absolute inset-0 m-auto text-neutral-600"
            />
          </div>
          <span className="font-Satoshi text-xs font-medium text-neutral-600 opacity-0 transition-opacity group-hover:opacity-100">
            Contents
          </span>
        </button>
      </motion.div>

      {/* TOC Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/10 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ x: -320, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -320, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 z-50 h-full w-80 overflow-hidden border-r border-neutral-200 bg-white shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-neutral-100 px-6 py-5">
                <div>
                  <h3 className="font-SchnyderS text-lg font-light text-neutral-900">
                    Table of Contents
                  </h3>
                  <p className="font-Satoshi text-xs text-neutral-400">
                    {activeIndex + 1} of {headings.length} sections
                  </p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="rounded-full p-2 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Progress Bar */}
              <div className="h-0.5 bg-neutral-100">
                <motion.div
                  className="h-full bg-[#c9a962]"
                  animate={{ width: `${scrollProgress}%` }}
                />
              </div>

              {/* Headings List */}
              <nav className="h-full overflow-y-auto px-4 py-6">
                <ul className="space-y-1">
                  {headings.map((heading, index) => (
                    <li key={heading.id}>
                      <button
                        onClick={() => scrollToHeading(heading.id)}
                        className={`group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-all ${
                          heading.level === 3 ? "ml-4" : ""
                        } ${
                          activeId === heading.id
                            ? "bg-[#c9a962]/10"
                            : "hover:bg-neutral-50"
                        }`}
                      >
                        {/* Number */}
                        <span
                          className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full font-Satoshi text-[10px] font-medium transition-colors ${
                            activeId === heading.id
                              ? "bg-[#c9a962] text-white"
                              : "bg-neutral-100 text-neutral-400 group-hover:bg-neutral-200"
                          }`}
                        >
                          {index + 1}
                        </span>
                        {/* Text */}
                        <span
                          className={`flex-1 font-Satoshi text-sm leading-snug transition-colors ${
                            activeId === heading.id
                              ? "font-medium text-neutral-900"
                              : "text-neutral-600 group-hover:text-neutral-900"
                          }`}
                        >
                          {heading.text}
                        </span>
                        {/* Arrow */}
                        <ChevronRight
                          size={14}
                          className={`flex-shrink-0 transition-all ${
                            activeId === heading.id
                              ? "text-[#c9a962]"
                              : "text-neutral-300 group-hover:text-neutral-400"
                          }`}
                        />
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
