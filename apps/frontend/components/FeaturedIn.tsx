"use client";
import React from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import { useLocale } from "next-intl";

type Media = {
  id: string;
  url: string;
  alt: string;
  name: string;
};

type Props = {
  locale?: string;
  media?: Media[];
  title?: string;
};

const FeaturedIn = ({ locale: localeProp, media = [], title }: Props) => {
  const logos = media;
  const local = useLocale();

  return (
    <>
      <div className="hidden 2xl:block bg-[#FFFEF5]">
        <div className="flex w-full justify-center py-16">
          <h1 className="text-[#202020] font-Satoshi font-normal uppercase text-xl">
            {title || (local === "en" ? "Featured in" : "مميز في")}
          </h1>
        </div>
        <div className="bg-[#F2F1E5]">
          <div className="container mx-auto">
            <div className="flex items-center justify-between gap-20">
              {logos.length > 0 ? (
                logos.slice(0, 4).map((item, index) => (
                  <div key={item.id || index} className="w-full h-[10rem] relative">
                    <Image
                      alt={item.alt || `Featured in ${index + 1}`}
                      src={item.url}
                      fill
                      className="absolute w-full h-full object-contain"
                    />
                  </div>
                ))
              ) : (
                <div className="w-full text-center py-12">
                  <p className="text-gray-500">
                    {local === "en" ? "No media to display" : "لا توجد وسائط لعرضها"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="2xl:hidden py-12 bg-[#F2F1E5]">
        <div className="flex w-full justify-center ">
          <h1 className="text-[#202020] font-Satoshi font-normal uppercase text-xl">
            {title || (local === "en" ? "Featured in" : "مميز في")}
          </h1>
        </div>
        {logos.length > 0 ? (
          <Swiper spaceBetween={28} slidesPerView={3.2}>
            {logos.map((item, index) => (
              <SwiperSlide key={item.id || index}>
                <div className="w-full h-[12rem] relative">
                  <Image
                    alt={item.alt || `Featured in ${index + 1}`}
                    src={item.url}
                    fill
                    className="absolute w-full h-full object-contain"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="w-full text-center py-12">
            <p className="text-gray-500">
              {local === "en" ? "No media to display" : "لا توجد وسائط لعرضها"}
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default FeaturedIn;
