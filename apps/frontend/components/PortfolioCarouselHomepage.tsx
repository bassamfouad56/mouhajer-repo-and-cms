'use client';

import { PLACEHOLDER_IMAGE } from '@/lib/cms-images';
import React, { useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import RightArrowCircle from './SVG/RightArrowCircle';
import PlusIcon from './SVG/PlusIcon';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCreative, Navigation } from 'swiper/modules';
import { useLocale } from 'next-intl';

// Theme colors
const COLORS = {
  background: '#202020',
  text: '#FFFEF5',
} as const;

// Type definitions matching actual CMS Project schema
interface CMSProject {
  id: string;
  titleEn: string;
  titleAr: string;
  descriptionEn?: string;
  descriptionAr?: string;
  images: string[];
  category: string;
  featured?: boolean;
  status?: string;
}

interface TransformedProject {
  id: string;
  image: string;
  titleEn: string;
  titleAr: string;
  category: string;
}

interface Props {
  projectData: CMSProject[];
}

// Fisher-Yates shuffle algorithm
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Generate slug from title for project URLs
const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

const PortfolioCarouselHomepage = ({ projectData }: Props) => {
  const locale = useLocale();

  // Transform and shuffle projects
  const { mainCarouselProjects, sideCarouselProjects } = useMemo(() => {
    if (!projectData || projectData.length === 0) {
      return { mainCarouselProjects: [], sideCarouselProjects: [] };
    }

    const transformedProjects: TransformedProject[] = projectData.map((project) => ({
      id: project.id,
      image: project.images?.[0] || PLACEHOLDER_IMAGE,
      titleEn: project.titleEn,
      titleAr: project.titleAr,
      category: project.category,
    }));

    // Shuffle and split into two sets for variety
    const shuffled = shuffleArray(transformedProjects);
    const midPoint = Math.ceil(shuffled.length / 2);

    return {
      mainCarouselProjects: shuffled.slice(0, midPoint),
      sideCarouselProjects: shuffled.slice(midPoint).concat(
        shuffled.slice(0, Math.max(0, midPoint - shuffled.slice(midPoint).length))
      ),
    };
  }, [projectData]);

  // Swiper configuration
  const swiperConfig = {
    navigation: {
      nextEl: '.next-el-port',
      prevEl: '.prev-el-port',
    },
    hashNavigation: {
      watchState: true,
    },
    pagination: {
      clickable: true,
    },
    grabCursor: true,
    effect: 'creative' as const,
    creativeEffect: {
      prev: {
        translate: [-20, 0, 0],
        opacity: 0,
      },
      next: {
        translate: ['100%', 0, 0],
      },
    },
    modules: [EffectCreative, Navigation],
  };

  if (!projectData || projectData.length === 0) {
    return null;
  }

  return (
    <div className="relative lg:min-h-[50rem] 2xl:min-h-[66rem]">
      {/* Project Counter */}
      <div className="absolute left-44 top-16 z-10" role="status" aria-label="Project counter">
        <span className="text-3xl font-light font-SchnyderS" style={{ color: COLORS.text }}>
          01 / {projectData.length}
        </span>
      </div>

      {/* Navigation Controls */}
      <div className="absolute left-44 bottom-10 z-10">
        <div className="flex flex-col gap-4">
          <button
            className="-rotate-180 next-el-port transition-transform hover:scale-110"
            aria-label="Next project"
            type="button"
          >
            <RightArrowCircle white />
          </button>
          <button
            className="prev-el-port transition-transform hover:scale-110"
            aria-label="Previous project"
            type="button"
          >
            <RightArrowCircle white />
          </button>
        </div>
      </div>

      {/* Main Carousel (Center-Left) */}
      <div
        className="absolute right-80 2xl:right-[55%] 2xl:translate-x-[50%] flex flex-col max-w-[55rem]"
        style={{ color: COLORS.text, backgroundColor: COLORS.background }}
      >
        <Swiper {...swiperConfig} className="h-full w-full">
          {mainCarouselProjects.map((project, index) => {
            const title = locale === 'en' ? project.titleEn : project.titleAr;
            const slug = generateSlug(locale === 'en' ? project.titleEn : project.titleAr);
            const projectUrl = `/our-projects/${slug}`;

            return (
              <SwiperSlide key={`main-${project.id}`}>
                <Link href={projectUrl} className="block group">
                  {/* Project Image */}
                  <div className="lg:h-[40rem] max-w-[30vw] 2xl:h-[58rem] 2xl:w-full relative mb-8 overflow-hidden transition-all duration-700 group-hover:scale-[1.02]">
                    <Image
                      src={project.image}
                      alt={title}
                      fill
                      sizes="(min-width: 1536px) 30vw, (min-width: 1024px) 40vw, 90vw"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      priority={index === 0}
                    />
                  </div>

                  {/* Project Details */}
                  <div className={`w-full max-w-[30vw] ${locale === 'ar' ? 'text-right' : ''}`}>
                    <div
                      className={`flex justify-between items-start gap-4 ${
                        locale === 'ar' ? 'flex-row-reverse' : ''
                      }`}
                    >
                      <h4 className="font-SchnyderS text-3xl font-light mb-4 uppercase max-w-xs group-hover:opacity-80 transition-opacity">
                        {title}
                      </h4>
                      <div className="transition-transform group-hover:rotate-45 duration-300">
                        <PlusIcon />
                      </div>
                    </div>
                    <p className="font-Satoshi text-base font-normal uppercase line-clamp-2 opacity-80">
                      {project.category}
                    </p>
                  </div>
                </Link>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>

      {/* Side Carousel (Right) */}
      <div
        className="top-0 absolute right-24 z-10"
        style={{ color: COLORS.text }}
        aria-label="Featured projects showcase"
      >
        <Swiper {...swiperConfig} className="w-140 h-160 2xl:w-160 2xl:h-240">
          {sideCarouselProjects.slice(0, 4).map((project) => {
            const title = locale === 'en' ? project.titleEn : project.titleAr;
            const slug = generateSlug(locale === 'en' ? project.titleEn : project.titleAr);
            const projectUrl = `/our-projects/${slug}`;

            return (
              <SwiperSlide key={`side-${project.id}`} className="relative">
                <Link href={projectUrl} className="block group h-full">
                  {/* Image Container */}
                  <div className="relative w-full h-[70%] mb-6 overflow-hidden">
                    <Image
                      src={project.image}
                      alt={title}
                      fill
                      sizes="(min-width: 1536px) 40rem, (min-width: 1024px) 35rem, 15vw"
                      className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105 group-hover:brightness-110"
                      priority={false}
                    />
                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                  </div>

                  {/* Project Details */}
                  <div className={`w-full px-2 ${locale === 'ar' ? 'text-right' : ''}`}>
                    <div
                      className={`flex justify-between items-start gap-2 mb-3 ${
                        locale === 'ar' ? 'flex-row-reverse' : ''
                      }`}
                    >
                      <h4 className="font-SchnyderS text-xl 2xl:text-2xl font-light uppercase max-w-[85%] group-hover:opacity-80 transition-opacity line-clamp-2">
                        {title}
                      </h4>
                      <div className="transition-transform group-hover:rotate-45 duration-300 flex-shrink-0">
                        <PlusIcon />
                      </div>
                    </div>
                    <p className="font-Satoshi text-sm 2xl:text-base font-normal uppercase line-clamp-1 opacity-70">
                      {project.category}
                    </p>
                  </div>
                </Link>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </div>
  );
};

export default PortfolioCarouselHomepage;
