'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { List, ChevronDown, ChevronUp } from 'lucide-react';

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  content: any[];
}

export default function TableOfContents({ content }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const isManualScrolling = useRef(false);

  // Extract headings from PortableText content
  useEffect(() => {
    if (!content) return;

    const extractedHeadings: TOCItem[] = [];
    let headingIndex = 0;

    content.forEach((block) => {
      if (block._type === 'block' && ['h2', 'h3'].includes(block.style)) {
        const text = block.children
          ?.map((child: any) => child.text)
          .join('') || '';

        if (text) {
          const id = `heading-${headingIndex}-${text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')}`;
          extractedHeadings.push({
            id,
            text,
            level: block.style === 'h2' ? 2 : 3,
          });
          headingIndex++;
        }
      }
    });

    setHeadings(extractedHeadings);
  }, [content]);

  // Scroll-based active heading detection
  useEffect(() => {
    if (headings.length === 0) return;

    const handleScroll = () => {
      // Don't update during manual scroll (click navigation)
      if (isManualScrolling.current) return;

      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const headerOffset = 150; // Account for sticky header

      // Find which heading is currently in view
      let currentHeading = headings[0]?.id || '';

      for (let i = 0; i < headings.length; i++) {
        const element = document.getElementById(headings[i].id);
        if (element) {
          const rect = element.getBoundingClientRect();
          const elementTop = rect.top;

          // If the heading is in the top portion of the viewport, it's active
          if (elementTop <= headerOffset + 50) {
            currentHeading = headings[i].id;
          } else {
            // Once we find a heading below the threshold, stop
            break;
          }
        }
      }

      setActiveId(currentHeading);
    };

    // Throttle scroll handler
    let rafId: number;
    const throttledScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        handleScroll();
        rafId = 0;
      });
    };

    window.addEventListener('scroll', throttledScroll, { passive: true });

    // Initial check after DOM is ready
    setTimeout(handleScroll, 100);

    return () => {
      window.removeEventListener('scroll', throttledScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [headings]);

  const scrollToHeading = useCallback((id: string) => {
    const element = document.getElementById(id);
    if (element) {
      // Set flag to prevent scroll handler from overriding
      isManualScrolling.current = true;
      setActiveId(id);

      const offset = 120;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });

      // Reset flag after scroll completes
      setTimeout(() => {
        isManualScrolling.current = false;
      }, 1000);
    }
  }, []);

  if (headings.length === 0) return null;

  return (
    <div className="rounded-lg border border-neutral-200 bg-white">
      {/* Header */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="flex w-full items-center justify-between p-4 lg:cursor-default"
      >
        <h3 className="flex items-center gap-2 font-Satoshi text-sm font-medium uppercase tracking-wider text-neutral-700">
          <List size={16} />
          On This Page
        </h3>
        <span className="lg:hidden">
          {isCollapsed ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
        </span>
      </button>

      {/* TOC List */}
      <AnimatePresence initial={false}>
        {!isCollapsed && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden border-t border-neutral-100"
            aria-label="Table of contents"
          >
            <ul className="space-y-0.5 p-4 pt-2">
              {headings.map((heading) => {
                const isActive = activeId === heading.id;
                return (
                  <li key={heading.id}>
                    <button
                      onClick={() => scrollToHeading(heading.id)}
                      className={`group flex w-full items-start gap-2 rounded-md px-2 py-1.5 text-left font-Satoshi text-sm transition-all duration-200 ${
                        heading.level === 3 ? 'pl-6' : ''
                      } ${
                        isActive
                          ? 'bg-[#c9a962]/10 font-medium text-[#c9a962]'
                          : 'font-light text-neutral-600 hover:bg-neutral-50 hover:text-neutral-950'
                      }`}
                    >
                      {/* Active indicator */}
                      <span
                        className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full transition-all duration-200 ${
                          isActive
                            ? 'bg-[#c9a962]'
                            : 'bg-neutral-300 group-hover:bg-neutral-400'
                        }`}
                      />
                      <span className="leading-tight">{heading.text}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </div>
  );
}
