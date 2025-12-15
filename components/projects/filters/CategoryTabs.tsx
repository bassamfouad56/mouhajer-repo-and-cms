'use client';

import { motion } from 'framer-motion';
import { MainCategory, CATEGORY_METADATA, CategoryCount, getCategoryLabel } from '@/types/filters';

interface CategoryTabsProps {
  selected: MainCategory;
  onChange: (category: MainCategory) => void;
  counts?: Partial<CategoryCount>;
}

export function CategoryTabs({ selected, onChange, counts }: CategoryTabsProps) {
  const categories: Exclude<MainCategory, 'all'>[] = ['residential', 'commercial', 'hospitality', 'ongoing'];

  return (
    <section className="sticky top-0 z-40 border-b border-neutral-200 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto max-w-[1800px] px-6 lg:px-12">
        <div className="hide-scrollbar flex items-center gap-1 overflow-x-auto">
          {categories.map((category) => {
            const isActive = selected === category;
            const metadata = CATEGORY_METADATA[category];
            const count = counts?.[category];

            return (
              <button
                key={category}
                type="button"
                onClick={() => onChange(category)}
                className={`group relative flex items-center gap-2 whitespace-nowrap px-6 py-4 font-Satoshi text-sm uppercase tracking-[0.2em] transition-all duration-300 ${
                  isActive
                    ? 'text-neutral-950'
                    : 'text-neutral-500 hover:text-neutral-700'
                }`}
              >
                {/* Category Label */}
                <span>{metadata.label}</span>

                {/* Count Badge */}
                {count !== undefined && (
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] transition-colors ${
                      isActive
                        ? 'bg-[#d4af37]/20 text-[#d4af37]'
                        : 'bg-neutral-100 text-neutral-400 group-hover:bg-neutral-200'
                    }`}
                  >
                    {count}
                  </span>
                )}

                {/* Active Indicator */}
                {isActive && (
                  <motion.div
                    layoutId="activeCategory"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#d4af37]"
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Hide scrollbar CSS */}
      <style jsx>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
