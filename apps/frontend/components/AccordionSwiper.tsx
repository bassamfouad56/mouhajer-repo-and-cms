"use client";
import React from "react";
import StarSVG from "./SVG/StarSVG";
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import Image from "next/image";
import { useLocale } from "next-intl";

interface AccordionItem {
  title: string;
  subtitle: string;
  description: string;
}

type Props = {
  items?: AccordionItem[];
  backgroundImage?: string;
  sectionTitle?: string;
};

const AccordionSwiper = ({ items = [], backgroundImage, sectionTitle }: Props) => {
  const locale = useLocale();

  // Use provided items or empty array
  const arr = items;
  const defaultTitle = locale === "en"
    ? "Services provided for this project"
    : "الخدمات التي تم تقديمها خلال هذا المشروع";

  return (
    <div className="relative">
      <div className="absolute w-full h-full z-[1] bg-black opacity-30 "></div>
      {backgroundImage && (
        <Image
          src={backgroundImage}
          className="absolute w-full h-full object-cover z-[0]"
          fill
          alt=""
        />
      )}
      <div className="pt-20 relative z-[1] pb-52">
        <div className="flex w-full justify-center">
          <h4 className="text-3xl uppercase font-SchnyderS mb-24 max-w-sm text-center leading-snug text-white">
            {sectionTitle || defaultTitle}
          </h4>
        </div>
        <Swiper
          spaceBetween={"auto"}
          slidesPerView={1}
          breakpoints={{
            1220: {
              spaceBetween: 25,
              slidesPerView: 4,
            },
          }}
        >
          {arr?.map((el, i) => (
            <SwiperSlide key={el.title + i}>
              <div className={`${i % 2 !== 0 && "2xl:mt-52"}`}>
                <div className="w-full justify-center flex 2xl:flex-none">
                  <Card {...el} locale={locale} />
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default AccordionSwiper;
interface CardProps {
  title: string;
  subtitle: string;
  description: String;
  locale: string;
}
const Card = ({ title, subtitle, description, locale }: CardProps) => {
  return (
    <div className="group  transition-all duration-1000 relative overflow-hidden z-[1] max-w-lg">
      <div className="absolute w-full h-full transition-all duration-1000 bg-[#F2F1E5] 2xl:translate-y-[-100%] 2xl:group-hover:translate-y-0 "></div>
      <div className="p-9 relative z-[1] ">
        <div className="flex flex-col 2xl:group-hover:text-[#202020] 2xl:text-white transition-all font-Satoshi">
          <div className="relative min-h-[10rem]  ">
            <p className="text-8xl mt-6 font-SchnyderS 2xl:absolute 2xl:left-[50%] 2xl:translate-x-[-50%] 2xl:group-hover:left-0 2xl:group-hover:translate-x-0 transition-all duration-1000">
              {title}
            </p>
            <p className="text-xl mb-8 uppercase">{subtitle}</p>
          </div>
          <div className="2xl:opacity-0 2xl:group-hover:opacity-100 duration-500 delay-200">
            <p className="text-[#000] opacity-60 font-normal text-base mb-8 ">
              {description}
            </p>
            <div className="text-xl flex items-center gap-4">
              <StarSVG />
              {locale === "en" ? <p>اعرف المزيد</p> : <p>Explore More</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
