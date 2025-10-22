'use client';
import React from 'react';
import StarSVG from './SVG/StarSVG';
import { Swiper, SwiperSlide } from 'swiper/react';

import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import FeaturedProjectItem from './FeaturedProjectItem';
import FeaturedBlogItemCard from './FeaturedBlogItemCard';
import { useLocale } from 'next-intl';
import { BlogPost, Service } from '@/lib/cms-types';

type Props = {
  title?: string;
  service?: boolean;
  blogs?: BlogPost[] | Service[];
};

const FeaturedBlogsHomepage = ({ title, blogs, service }: Props) => {
  const local = useLocale();
  const titleCustom = () => {
    if (title === 'PROJECTS') {
      if (local === 'en') {
        return 'PROJECTS';
      }
      return 'مشاريع';
    }
    return title;
  };
  if (!!blogs?.length) {
    return (
      <div
        className={`bg-[#FFFEF5] min-h-[62vh]  overflow-hidden ${local === 'en' ? '' : 'hidden'}`}
      >
        <div className="py-[4rem] 2xl:spt-[12rem]  2xl:pb-[11rem]">
          <div className="2xl:pl-40 px-4">
            {title && (
              <div className="pr-[135px]">
                <div className="flex items-center justify-between uppercase text-[#202020] mb-20">
                  <h1 className="font-SchnyderS text-4xl 2xl:text-6xl font-light">
                    {titleCustom()}
                  </h1>
                  <div className="hidden items-center gap-2 2xl:flex ">
                    <StarSVG />
                    {local === 'en' ? (
                      <p className="text-xl font-Satoshi ">See All {title}</p>
                    ) : (
                      <p className="text-xl font-Satoshi ">اقرأ المزيد عنا</p>
                    )}
                  </div>
                </div>
              </div>
            )}
            <Swiper
              speed={1200}
              autoplay={{ delay: 3000 }} // Adjust the delay here (in milliseconds)
              spaceBetween={60}
              slidesPerView={1}
              modules={[Autoplay]}
              breakpoints={{
                759: {
                  slidesPerView: 3.1,
                  spaceBetween: 24,
                },
              }}
            >
              {blogs?.map((item: any, i: number) => (
                <SwiperSlide
                  key={item.slug?.en || item.id || i}
                  className="w-full h-full "
                >
                  {service ? <FeaturedProjectItem project={item} /> : <FeaturedBlogItemCard blog={item as BlogPost} />}
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    );
  } else return null;
};

export default FeaturedBlogsHomepage;
