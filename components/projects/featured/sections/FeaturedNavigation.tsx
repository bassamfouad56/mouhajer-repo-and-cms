"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

interface NavigationProject {
  slug: string;
  title: string;
  mainImage?: string | null;
}

interface RelatedProject {
  id: string;
  title: string;
  slug: string;
  mainImage?: string | null;
}

interface FeaturedNavigationProps {
  prevProject: NavigationProject | null;
  nextProject: NavigationProject | null;
  relatedProjects: RelatedProject[];
  locale: string;
}

export function FeaturedNavigation({
  prevProject,
  nextProject,
  relatedProjects,
  locale,
}: FeaturedNavigationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isRTL = locale === "ar";

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 0.3], [50, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);

  const labels = {
    en: {
      prev: "Previous Project",
      next: "Next Project",
      related: "More Featured Projects",
      viewAll: "View All Projects",
    },
    ar: {
      prev: "المشروع السابق",
      next: "المشروع التالي",
      related: "مشاريع مميزة أخرى",
      viewAll: "عرض جميع المشاريع",
    },
  };

  const t = isRTL ? labels.ar : labels.en;

  return (
    <section
      ref={containerRef}
      className="relative py-24 md:py-32 bg-[#111] overflow-hidden"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <motion.div
        className="relative z-10 max-w-7xl mx-auto px-6 md:px-16"
        style={{ y, opacity }}
      >
        {/* Prev/Next Navigation */}
        {(prevProject || nextProject) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-20">
            {/* Previous Project */}
            <div className={prevProject ? "" : "md:col-start-2"}>
              {prevProject && (
                <Link href={`/${locale}/projects/featured/${prevProject.slug}`}>
                  <motion.div
                    className="group relative h-56 md:h-64 bg-white/5 border border-white/10 hover:border-[#c9a962]/30 transition-colors overflow-hidden"
                    whileHover={{ x: isRTL ? 10 : -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Background Image */}
                    {prevProject.mainImage && (
                      <Image
                        src={prevProject.mainImage}
                        alt={prevProject.title || "Previous project"}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    )}

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />

                    <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-between">
                      {/* Direction Label */}
                      <div className="flex items-center gap-2 text-white/60">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          className={isRTL ? "rotate-180" : ""}
                        >
                          <path
                            d="M19 12H5M5 12L12 19M5 12L12 5"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <span className="text-xs tracking-[0.2em] uppercase">
                          {t.prev}
                        </span>
                      </div>

                      {/* Project Title */}
                      <div>
                        <h3 className="text-xl md:text-2xl text-white font-light group-hover:text-[#c9a962] transition-colors line-clamp-2">
                          {prevProject.title ||
                            prevProject.slug.replace(/-/g, " ")}
                        </h3>
                        <motion.div className="mt-3 flex items-center gap-2 text-[#c9a962] text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                          <span>{isRTL ? "عرض المشروع" : "View Project"}</span>
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <path
                              d="M5 12H19M19 12L12 5M19 12L12 19"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className={isRTL ? "rotate-180" : ""}
                            />
                          </svg>
                        </motion.div>
                      </div>
                    </div>

                    {/* Hover Line */}
                    <motion.div
                      className="absolute bottom-0 left-0 h-1 bg-[#c9a962]"
                      initial={{ width: 0 }}
                      whileHover={{ width: "100%" }}
                      transition={{ duration: 0.4 }}
                    />

                    {/* Corner Frame */}
                    <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-white/0 group-hover:border-[#c9a962]/70 transition-colors duration-500" />
                  </motion.div>
                </Link>
              )}
            </div>

            {/* Next Project */}
            {nextProject && (
              <Link href={`/${locale}/projects/featured/${nextProject.slug}`}>
                <motion.div
                  className="group relative h-56 md:h-64 bg-white/5 border border-white/10 hover:border-[#c9a962]/30 transition-colors overflow-hidden"
                  whileHover={{ x: isRTL ? -10 : 10 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Background Image */}
                  {nextProject.mainImage && (
                    <Image
                      src={nextProject.mainImage}
                      alt={nextProject.title || "Next project"}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  )}

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-l from-black/80 via-black/60 to-black/40" />

                  <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-between items-end text-right">
                    {/* Direction Label */}
                    <div className="flex items-center gap-2 text-white/60">
                      <span className="text-xs tracking-[0.2em] uppercase">
                        {t.next}
                      </span>
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        className={isRTL ? "rotate-180" : ""}
                      >
                        <path
                          d="M5 12H19M19 12L12 5M19 12L12 19"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>

                    {/* Project Title */}
                    <div>
                      <h3 className="text-xl md:text-2xl text-white font-light group-hover:text-[#c9a962] transition-colors line-clamp-2">
                        {nextProject.title ||
                          nextProject.slug.replace(/-/g, " ")}
                      </h3>
                      <motion.div className="mt-3 flex items-center justify-end gap-2 text-[#c9a962] text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                        <span>{isRTL ? "عرض المشروع" : "View Project"}</span>
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M5 12H19M19 12L12 5M19 12L12 19"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className={isRTL ? "rotate-180" : ""}
                          />
                        </svg>
                      </motion.div>
                    </div>
                  </div>

                  {/* Hover Line */}
                  <motion.div
                    className="absolute bottom-0 right-0 h-1 bg-[#c9a962]"
                    initial={{ width: 0 }}
                    whileHover={{ width: "100%" }}
                    transition={{ duration: 0.4 }}
                  />

                  {/* Corner Frame */}
                  <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-white/0 group-hover:border-[#c9a962]/70 transition-colors duration-500" />
                </motion.div>
              </Link>
            )}
          </div>
        )}

        {/* Related Featured Projects */}
        {relatedProjects.length > 0 && (
          <div>
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-[#c9a962] text-sm tracking-[0.3em] uppercase block mb-4">
                {isRTL ? "استكشف المزيد" : "Explore More"}
              </span>
              <h2 className="text-2xl md:text-3xl text-white font-light">
                {t.related}
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProjects.slice(0, 3).map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                >
                  <Link href={`/${locale}/projects/featured/${project.slug}`}>
                    <div className="group relative aspect-[4/3] overflow-hidden bg-white/5">
                      {project.mainImage ? (
                        <Image
                          src={project.mainImage}
                          alt={project.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5" />
                      )}

                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                      {/* Content */}
                      <div className="absolute inset-0 p-6 flex flex-col justify-end">
                        <h3 className="text-lg md:text-xl text-white font-light group-hover:text-[#c9a962] transition-colors">
                          {project.title}
                        </h3>
                      </div>

                      {/* Hover Border */}
                      <div className="absolute inset-0 border-2 border-[#c9a962]/0 group-hover:border-[#c9a962]/50 transition-colors duration-300" />

                      {/* View Arrow */}
                      <motion.div
                        className="absolute bottom-6 right-6 w-10 h-10 bg-[#c9a962] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        whileHover={{ scale: 1.1 }}
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          className="text-black"
                        >
                          <path
                            d="M7 17L17 7M17 7H7M17 7V17"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </motion.div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* View All Link */}
            <motion.div
              className="text-center mt-12"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <Link
                href={`/${locale}/projects`}
                className="inline-flex items-center gap-3 px-8 py-4 border border-[#c9a962] text-[#c9a962] hover:bg-[#c9a962] hover:text-black transition-all duration-300 tracking-wider uppercase text-sm"
              >
                {t.viewAll}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M5 12H19M19 12L12 5M19 12L12 19"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            </motion.div>
          </div>
        )}
      </motion.div>

      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#111] via-[#0a0a0a] to-[#111]" />
    </section>
  );
}
