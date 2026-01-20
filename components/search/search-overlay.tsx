"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Command, Loader2 } from "lucide-react";
import { useSearch } from "@/lib/algolia/search-context";
import { searchClient, ALGOLIA_INDEX_NAME } from "@/lib/algolia/client";
import { ProjectHitComponent } from "./hits/project-hit";
import { PostHitComponent } from "./hits/post-hit";
import { ServiceHitComponent } from "./hits/service-hit";
import { IndustryHitComponent } from "./hits/industry-hit";
import type {
  SearchHit,
  isProjectHit,
  isPostHit,
  isServiceHit,
  isIndustryHit,
} from "@/lib/algolia/types";
import { useParams } from "next/navigation";

interface SearchResult {
  hits: SearchHit[];
  nbHits: number;
}

export function SearchOverlay() {
  const { isOpen, closeSearch } = useSearch();
  const params = useParams();
  const locale = (params?.locale as string) || "en";

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Reset state when closed
  useEffect(() => {
    if (!isOpen) {
      setQuery("");
      setResults(null);
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Search function
  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults(null);
      return;
    }

    setIsLoading(true);
    try {
      const response = await searchClient.searchSingleIndex({
        indexName: ALGOLIA_INDEX_NAME,
        searchParams: {
          query: searchQuery,
          hitsPerPage: 10,
          attributesToRetrieve: [
            "objectID",
            "type",
            "title",
            "slug",
            "mainImage",
            "location",
            "industry",
            "year",
            "excerpt",
            "category",
            "readTime",
            "publishedAt",
            "description",
            "projectCount",
          ],
        },
      });

      setResults({
        hits: response.hits as unknown as SearchHit[],
        nbHits: response.nbHits || 0,
      });
    } catch (error) {
      console.error("Search error:", error);
      setResults(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      performSearch(query);
    }, 200);
    return () => clearTimeout(timer);
  }, [query, performSearch]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen || !results?.hits.length) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev < results.hits.length - 1 ? prev + 1 : 0
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev > 0 ? prev - 1 : results.hits.length - 1
          );
          break;
        case "Enter":
          e.preventDefault();
          const selectedHit = results.hits[selectedIndex];
          if (selectedHit) {
            navigateToHit(selectedHit);
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, results, selectedIndex]);

  // Scroll selected item into view
  useEffect(() => {
    if (resultsRef.current && results?.hits.length) {
      const selectedElement = resultsRef.current.children[
        selectedIndex
      ] as HTMLElement;
      if (selectedElement) {
        selectedElement.scrollIntoView({
          block: "nearest",
          behavior: "smooth",
        });
      }
    }
  }, [selectedIndex, results]);

  const navigateToHit = (hit: SearchHit) => {
    closeSearch();
    // Navigation is handled by the Link component in hit components
  };

  const groupedHits = results?.hits.reduce(
    (acc, hit) => {
      if (!acc[hit.type]) {
        acc[hit.type] = [];
      }
      acc[hit.type].push(hit);
      return acc;
    },
    {} as Record<string, SearchHit[]>
  );

  const typeLabels: Record<string, { en: string; ar: string }> = {
    project: { en: "Projects", ar: "المشاريع" },
    post: { en: "Articles", ar: "المقالات" },
    service: { en: "Services", ar: "الخدمات" },
    industry: { en: "Industries", ar: "القطاعات" },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-start justify-center bg-black/80 backdrop-blur-xl pt-[10vh]"
          onClick={closeSearch}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-2xl mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Container */}
            <div className="overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-950 shadow-2xl">
              {/* Search Input */}
              <div className="relative flex items-center border-b border-neutral-800">
                <Search className="absolute left-4 h-5 w-5 text-neutral-500" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={
                    locale === "ar" ? "ابحث في الموقع..." : "Search the site..."
                  }
                  className="w-full bg-transparent py-4 pl-12 pr-12 text-lg text-white placeholder-neutral-500 outline-none"
                  dir={locale === "ar" ? "rtl" : "ltr"}
                />
                {isLoading ? (
                  <Loader2 className="absolute right-4 h-5 w-5 animate-spin text-neutral-500" />
                ) : query ? (
                  <button
                    onClick={() => setQuery("")}
                    className="absolute right-4 text-neutral-500 hover:text-white transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                ) : (
                  <div className="absolute right-4 flex items-center gap-1 text-xs text-neutral-600">
                    <Command className="h-3 w-3" />
                    <span>K</span>
                  </div>
                )}
              </div>

              {/* Results */}
              <div
                ref={resultsRef}
                className="max-h-[60vh] overflow-y-auto overscroll-contain"
              >
                {/* Empty state */}
                {!query && (
                  <div className="p-8 text-center">
                    <p className="text-neutral-500">
                      {locale === "ar"
                        ? "ابحث عن المشاريع والمقالات والخدمات..."
                        : "Search for projects, articles, services..."}
                    </p>
                    <div className="mt-4 flex flex-wrap justify-center gap-2">
                      {["Projects", "Interior", "Luxury", "Villa"].map(
                        (term) => (
                          <button
                            key={term}
                            onClick={() => setQuery(term)}
                            className="rounded-full border border-neutral-800 px-3 py-1 text-sm text-neutral-400 transition-colors hover:border-[#c9a962] hover:text-[#c9a962]"
                          >
                            {term}
                          </button>
                        )
                      )}
                    </div>
                  </div>
                )}

                {/* No results */}
                {query && results?.nbHits === 0 && !isLoading && (
                  <div className="p-8 text-center">
                    <p className="text-neutral-400">
                      {locale === "ar"
                        ? `لم يتم العثور على نتائج لـ "${query}"`
                        : `No results found for "${query}"`}
                    </p>
                  </div>
                )}

                {/* Results grouped by type */}
                {groupedHits && Object.keys(groupedHits).length > 0 && (
                  <div className="p-2 space-y-4">
                    {Object.entries(groupedHits).map(([type, hits]) => (
                      <div key={type}>
                        <h3 className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-neutral-500">
                          {typeLabels[type]?.[locale as "en" | "ar"] || type}
                        </h3>
                        <div className="space-y-1">
                          {hits.map((hit, index) => {
                            const globalIndex = results!.hits.indexOf(hit);
                            const isSelected = globalIndex === selectedIndex;

                            return (
                              <div
                                key={hit.objectID}
                                className={
                                  isSelected
                                    ? "ring-2 ring-[#c9a962] ring-inset rounded-lg"
                                    : ""
                                }
                              >
                                {hit.type === "project" && (
                                  <ProjectHitComponent
                                    hit={hit}
                                    locale={locale}
                                    onClick={closeSearch}
                                  />
                                )}
                                {hit.type === "post" && (
                                  <PostHitComponent
                                    hit={hit}
                                    locale={locale}
                                    onClick={closeSearch}
                                  />
                                )}
                                {hit.type === "service" && (
                                  <ServiceHitComponent
                                    hit={hit}
                                    locale={locale}
                                    onClick={closeSearch}
                                  />
                                )}
                                {hit.type === "industry" && (
                                  <IndustryHitComponent
                                    hit={hit}
                                    locale={locale}
                                    onClick={closeSearch}
                                  />
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between border-t border-neutral-800 px-4 py-3 text-xs text-neutral-600">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <kbd className="rounded bg-neutral-800 px-1.5 py-0.5">
                      ↑
                    </kbd>
                    <kbd className="rounded bg-neutral-800 px-1.5 py-0.5">
                      ↓
                    </kbd>
                    <span className="ml-1">
                      {locale === "ar" ? "تنقل" : "Navigate"}
                    </span>
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="rounded bg-neutral-800 px-1.5 py-0.5">
                      ↵
                    </kbd>
                    <span className="ml-1">
                      {locale === "ar" ? "فتح" : "Open"}
                    </span>
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="rounded bg-neutral-800 px-1.5 py-0.5">
                      esc
                    </kbd>
                    <span className="ml-1">
                      {locale === "ar" ? "إغلاق" : "Close"}
                    </span>
                  </span>
                </div>
                <span className="text-[#c9a962]">
                  {results?.nbHits
                    ? `${results.nbHits} ${locale === "ar" ? "نتيجة" : "results"}`
                    : ""}
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
