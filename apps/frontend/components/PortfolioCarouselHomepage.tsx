'use client';
import { PLACEHOLDER_IMAGE } from '@/lib/cms-images';
import React, { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import RightArrowCircle from './SVG/RightArrowCircle';
import PlusIcon from './SVG/PlusIcon';

import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCreative, Navigation } from 'swiper/modules';
import { useLocale } from 'next-intl';

type Props = {
  projectData: any;
};

// Fisher-Yates shuffle algorithm for better randomization
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const PortfolioCarouselHomepage = ({ projectData }: Props) => {
  const locale = useLocale();
  const [imageDisplayed, setImageDisplayed] = useState(0);

  // Create two separate shuffled sets for left and right carousels
  const { leftCarouselProjects, rightCarouselProjects } = useMemo(() => {
    const projects = projectData?.map((el: any) => ({
      image: el.images?.[0] || PLACEHOLDER_IMAGE,
      englishTitle: el.title?.en || 'Untitled Project',
      arabicTitle: el.title?.ar || 'مشروع بدون عنوان',
      type: el.category || 'Project',
      arabicType: el.category || 'مشروع',
      slug: el.slug,
      id: el.id,
    })) ?? [];

    // Shuffle projects and split into two sets for variety
    const shuffled = shuffleArray(projects);
    const midPoint = Math.ceil(shuffled.length / 2);

    return {
      leftCarouselProjects: shuffled.slice(0, midPoint),
      rightCarouselProjects: shuffled.slice(midPoint).concat(shuffled.slice(0, Math.max(0, midPoint - shuffled.slice(midPoint).length)))
    };
  }, [projectData]);

  const img = leftCarouselProjects;
  return (
    <div className="relative lg:min-h-[50rem] 2xl:min-h-[66rem]    border-white">
      {/* <CursorComponenet /> */}

      <div className="absolute left-44 top-16">
        <span className="text-3xl font-light font-SchnyderS text-[#FFFEF5]">
          01 / {projectData.length}
        </span>
      </div>

      <div className="absolute left-44 bottom-10">
        <div className="flex flex-col gap-4">
          <div className="rotate-[-180deg] next-el-port">
            <RightArrowCircle white />
          </div>
          <div className="prev-el-port">
            <RightArrowCircle white />
          </div>
        </div>
      </div>

      <div className="absolute right-80 2xl:right-[55%] 2xl:translate-x-[50%] flex flex-col flex-wrap text-wrap max-w-[55rem] text-[#FFFEF5] bg-[#202020]">
        <Swiper
          onSlideChange={(e) => {
            if (e.activeIndex + 1 < img.length) setImageDisplayed(e.activeIndex + 1);
          }}
          navigation={{
            nextEl: '.next-el-port',
            prevEl: '.prev-el-port',
          }}
          hashNavigation={{
            watchState: true,
          }}
          pagination={{
            clickable: true,
          }}
          grabCursor={true}
          effect={'creative'}
          creativeEffect={{
            prev: {
              translate: [-20, 0, 0],
              opacity: 0,
            },
            next: {
              translate: ['100%', 0, 0],
            },
          }}
          modules={[EffectCreative, Navigation]}
          className=" h-full w-full bg-[#202020]  "
        >
          {img?.map((el: any, i: number) => {
            const projectUrl = el.slug?.[locale] ? `/our-projects/${el.slug[locale]}` : '#';
            return (
              <SwiperSlide key={`${el.image}-${i}`} className=" ">
                <Link href={projectUrl} className="block">
                  <div className="lg:h-[40rem] max-w-[30vw]  2xl:h-[58rem] bg-[#202020] 2xl:w-full relative mb-8 cursor-pointer transition-all duration-700 overflow-hidden hover:opacity-90">
                    <Image
                      src={el.image}
                      alt={locale === 'en' ? el.englishTitle : el.arabicTitle}
                      fill
                      sizes="(min-width: 1536px) 30vw, (min-width: 1024px) 40vw, 90vw"
                      className="w-full absolute h-full object-cover"
                    />
                  </div>
                </Link>
                <Link href={projectUrl} className="block">
                  <div
                    className={`w-full h-full bg-[#202020] max-w-[30vw] ${
                      locale === 'en' ? '' : 'text-right'
                    }`}
                  >
                    <div
                      className={`flex justify-between items-start ${
                        locale === 'en' ? '' : 'flex-row-reverse'
                      }`}
                    >
                      <h4 className="font-SchnyderS text-3xl font-light mb-4 uppercase max-w-xs hover:opacity-80 transition-opacity">
                        {locale === 'en' ? el.englishTitle : el.arabicTitle}
                      </h4>
                      <PlusIcon />
                    </div>
                    <p className="font-Satoshi text-base font-normal bg-[#202020] uppercase line-clamp-2">
                      {locale === 'en' ? el.type : el.arabicType}
                    </p>
                  </div>
                </Link>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>

      <div className=" top-0   absolute right-24 text-[#FFFEF5] z-[99]">
        <Swiper
          className=" w-[35rem] h-[40rem] 2xl:w-[40rem] 2xl:h-[60rem] "
          navigation={{
            nextEl: '.next-el-port',
            prevEl: '.prev-el-port',
          }}
          hashNavigation={{
            watchState: true,
          }}
          pagination={{
            clickable: true,
          }}
          grabCursor={true}
          effect={'creative'}
          creativeEffect={{
            prev: {
              translate: [-20, 0, 0],
              opacity: 0,
            },
            next: {
              translate: ['100%', 0, 0],
            },
          }}
          modules={[EffectCreative, Navigation]}
        >
          {rightCarouselProjects?.map((el: any, i: number) => {
            const projectUrl = el.slug?.[locale] ? `/our-projects/${el.slug[locale]}` : '#';
            return (
              <SwiperSlide key={`detail-${el.id}-${i}`} className="w-full h-full flex flex-col">
                <Link href={projectUrl} className="block cursor-pointer relative mb-8 w-full h-[70%] hover:opacity-90 transition-opacity">
                  <Image
                    src={el.image}
                    alt={locale === 'en' ? el.englishTitle : el.arabicTitle}
                    fill
                    sizes="(min-width: 1536px) 40rem, (min-width: 1024px) 35rem, 90vw"
                    className="w-full absolute h-full object-cover"
                  />
                </Link>
                <Link href={projectUrl} className="block">
                  <div className={`w-full h-full ${locale === 'en' ? '' : 'text-right'}`}>
                    <div
                      className={`flex justify-between items-start ${
                        locale === 'en' ? '' : 'flex-row-reverse'
                      }`}
                    >
                      <h4 className="font-SchnyderS text-3xl font-light mb-4 uppercase max-w-xs hover:opacity-80 transition-opacity">
                        {locale === 'en'
                          ? el.englishTitle
                          : el.arabicTitle}
                      </h4>
                      <PlusIcon />
                    </div>
                    <p className="font-Satoshi text-base font-normal">
                      {locale === 'en'
                        ? el.type
                        : el.arabicType}
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
