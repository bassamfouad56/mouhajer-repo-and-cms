'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Project {
  id: string;
  titleEn: string;
  titleAr: string;
  descriptionEn: string;
  category: string;
  images: string[];
  featured: boolean;
}

interface PortfolioShowcaseProps {
  projects: Project[];
  locale?: 'en' | 'ar';
  totalProjectsCount?: number;
}

export default function PortfolioShowcase({
  projects,
  locale = 'en',
  totalProjectsCount = 400,
}: PortfolioShowcaseProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Group projects into slides (2 projects per slide)
  const slidesCount = Math.ceil(projects.length / 2);

  const nextSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev + 1) % slidesCount);
    setTimeout(() => setIsAnimating(false), 600);
  };

  const prevSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev - 1 + slidesCount) % slidesCount);
    setTimeout(() => setIsAnimating(false), 600);
  };

  const getCurrentProjects = () => {
    const startIdx = currentSlide * 2;
    return projects.slice(startIdx, startIdx + 2);
  };

  const currentProjects = getCurrentProjects();
  const mainProject = currentProjects[0];
  const secondaryProject = currentProjects[1];

  return (
    <section className="bg-black text-white py-20 px-6 md:px-12 lg:px-20 overflow-hidden">
      {/* Header */}
      <div className="max-w-[1600px] mx-auto mb-16">
        <h2 className="text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-serif tracking-wider mb-8">
          <span className="inline-block">PORTFOLIO</span>
          <span className="inline-block mx-8 text-4xl md:text-5xl">✦</span>
          <span className="inline-block">PORTFOLIO</span>
        </h2>

        {/* Counter and Link */}
        <div className="flex items-center justify-between">
          <div className="text-sm md:text-base font-light tracking-widest">
            +{totalProjectsCount} PROJECTS
          </div>
          <Link
            href={`/${locale}/projects`}
            className="text-sm md:text-base font-light tracking-widest hover:opacity-70 transition-opacity flex items-center gap-2"
          >
            <span>✦</span>
            <span>SEE ALL PROJECTS</span>
          </Link>
        </div>
      </div>

      {/* Carousel */}
      <div className="max-w-[1600px] mx-auto">
        <div className="flex items-center gap-8">
          {/* Navigation and Counter */}
          <div className="flex flex-col items-center gap-6 w-24 flex-shrink-0">
            {/* Counter */}
            <div className="text-2xl font-light">
              {String(currentSlide + 1).padStart(2, '0')}/
              {String(slidesCount).padStart(2, '0')}
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={prevSlide}
              disabled={isAnimating}
              className="w-12 h-12 rounded-full border border-white/30 flex items-center justify-center hover:bg-white hover:text-black transition-all disabled:opacity-50"
              aria-label="Previous slide"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 4L6 10L12 16" />
              </svg>
            </button>

            <button
              onClick={nextSlide}
              disabled={isAnimating}
              className="w-12 h-12 rounded-full border border-white/30 flex items-center justify-center hover:bg-white hover:text-black transition-all disabled:opacity-50"
              aria-label="Next slide"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M8 4L14 10L8 16" />
              </svg>
            </button>
          </div>

          {/* Projects Grid */}
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Main Project */}
            {mainProject && (
              <div
                className={`relative group transition-all duration-600 ${
                  isAnimating ? 'opacity-0 translate-x-10' : 'opacity-100 translate-x-0'
                }`}
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={mainProject.images[0] || '/placeholder.jpg'}
                    alt={locale === 'en' ? mainProject.titleEn : mainProject.titleAr}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />

                  {/* View Button Overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Link
                      href={`/${locale}/projects/${mainProject.id}`}
                      className="w-24 h-24 rounded-full bg-white text-black flex items-center justify-center text-sm font-light tracking-wider hover:scale-110 transition-transform"
                    >
                      VIEW
                    </Link>
                  </div>
                </div>

                {/* Project Info */}
                <div className="mt-6 flex items-start justify-between">
                  <div>
                    <h3 className="text-2xl md:text-3xl font-serif mb-2">
                      {locale === 'en' ? mainProject.titleEn : mainProject.titleAr}
                    </h3>
                    <p className="text-sm font-light tracking-widest opacity-70 uppercase">
                      {mainProject.category}
                    </p>
                  </div>

                  <button
                    className="w-12 h-12 rounded-full border border-white/30 flex items-center justify-center hover:bg-white hover:text-black transition-all text-2xl"
                    aria-label="Add to favorites"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            {/* Secondary Project */}
            {secondaryProject && (
              <div
                className={`relative group transition-all duration-600 delay-100 ${
                  isAnimating ? 'opacity-0 translate-x-10' : 'opacity-100 translate-x-0'
                }`}
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={secondaryProject.images[0] || '/placeholder.jpg'}
                    alt={locale === 'en' ? secondaryProject.titleEn : secondaryProject.titleAr}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />

                  {/* View Button Overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Link
                      href={`/${locale}/projects/${secondaryProject.id}`}
                      className="w-24 h-24 rounded-full bg-white text-black flex items-center justify-center text-sm font-light tracking-wider hover:scale-110 transition-transform"
                    >
                      VIEW
                    </Link>
                  </div>
                </div>

                {/* Project Info */}
                <div className="mt-6 flex items-start justify-between">
                  <div>
                    <h3 className="text-2xl md:text-3xl font-serif mb-2">
                      {locale === 'en' ? secondaryProject.titleEn : secondaryProject.titleAr}
                    </h3>
                    <p className="text-sm font-light tracking-widest opacity-70 uppercase">
                      {secondaryProject.category}
                    </p>
                  </div>

                  <button
                    className="w-12 h-12 rounded-full border border-white/30 flex items-center justify-center hover:bg-white hover:text-black transition-all text-2xl"
                    aria-label="Add to favorites"
                  >
                    +
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Progress Dots (Optional) */}
        <div className="flex justify-center gap-2 mt-12">
          {Array.from({ length: slidesCount }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                if (!isAnimating) {
                  setIsAnimating(true);
                  setCurrentSlide(idx);
                  setTimeout(() => setIsAnimating(false), 600);
                }
              }}
              className={`h-1 rounded-full transition-all ${
                idx === currentSlide ? 'w-12 bg-white' : 'w-8 bg-white/30'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
