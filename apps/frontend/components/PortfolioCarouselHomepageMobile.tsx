'use client';
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import Link from 'next/link';

// Import Swiper styles
import 'swiper/css';
import RightArrowCircle from './SVG/RightArrowCircle';
import Image from 'next/image';
import { Navigation } from 'swiper/modules';
import { PORTFOLIO_CAROUSEL_IMAGES, PLACEHOLDER_IMAGE } from '@/lib/cms-images';
import { useLocale } from 'next-intl';

type Props = {
  projectData?: any[];
  projectCount?: string;
};

const PortfolioCarouselHomepageMobile = ({ projectData = [], projectCount }: Props) => {
  const locale = useLocale();

  // Extract images and data from projects
  const projects = projectData.length > 0
    ? projectData.map(p => ({
        image: p.images?.[0] || PLACEHOLDER_IMAGE,
        title: p.title,
        category: p.category,
        slug: p.slug,
        id: p.id,
      }))
    : [
        { image: PORTFOLIO_CAROUSEL_IMAGES[0] || PLACEHOLDER_IMAGE, title: null, category: null, slug: null, id: null },
        { image: PORTFOLIO_CAROUSEL_IMAGES[1] || PLACEHOLDER_IMAGE, title: null, category: null, slug: null, id: null },
      ];
  return (
    <div className="text-white 2xl:hidden">
      <div className="flex items-center justify-between mb-12">
        <p className="text-[#FFFEF5] font-Satoshi">{projectCount || (locale === 'en' ? '+400 Projects' : '+400 مشروع')}</p>
        <div className=" flex items-center gap-4">
          <div className="rotate-[-180deg] prev-mobile-project">
            <RightArrowCircle white width="38" height="38" />
          </div>
          <div className="next-mobile-project">
            <RightArrowCircle white width="38" height="38" />
          </div>
        </div>
      </div>{' '}
      <Swiper
        loop
        navigation={{
          prevEl: '.prev-mobile-project',
          nextEl: '.next-mobile-project',
        }}
        modules={[Navigation]}
        spaceBetween={20}
        slidesPerView={1.2}
      >
        {projects.map((project, index) => {
          const projectUrl = project.slug?.[locale] ? `/our-projects/${project.slug[locale]}` : '#';
          const hasLink = project.slug?.[locale];

          return (
            <SwiperSlide key={project.id || index}>
              {hasLink ? (
                <Link href={projectUrl}>
                  <div className="h-96 sm:h-128 w-full bg-gray-900 relative cursor-pointer hover:opacity-90 transition-opacity">
                    <Image
                      src={project.image || PLACEHOLDER_IMAGE}
                      fill
                      className="absolute w-full h-full object-cover"
                      alt={project.title?.[locale] || ''}
                    />
                  </div>
                  {project.title && (
                    <div className="mt-4">
                      <h4 className="text-lg font-SchnyderS text-[#FFFEF5] uppercase">{project.title[locale]}</h4>
                      {project.category && (
                        <p className="text-sm font-Satoshi text-[#FFFEF5] opacity-70 uppercase">{project.category}</p>
                      )}
                    </div>
                  )}
                </Link>
              ) : (
                <div className="h-96 sm:h-128 w-full bg-gray-900 relative">
                  <Image
                    src={project.image || PLACEHOLDER_IMAGE}
                    fill
                    className="absolute w-full h-full object-cover"
                    alt=""
                  />
                </div>
              )}
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default PortfolioCarouselHomepageMobile;
