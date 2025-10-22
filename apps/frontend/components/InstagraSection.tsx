"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
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
};

const InstagraSection = ({ locale: localeProp, media = [] }: Props) => {
  const local = useLocale();

  return (
    <div className="bg-[#F2F1E5]">
      <div className="py-[4rem] 2xl:spt-[12rem]  2xl:pb-[11rem]">
        <div className="flex flex-col items-center justify-center mb-10 2xl:mb-[109px]">
          <h1 className="font-SchnyderS text-4xl 2xl:text-6xl font-light uppercase text-[#202020]">
            {local === "en" ? `Instagram` : "إنستغرام "}
          </h1>
          <p className="text-sm 2xl:text-4xl">
            {local === "en" ? "FOLLOW US @ MOUHAJER" : "تابعونا على @MOUHAJER"}
          </p>
        </div>
        {media.length > 0 ? (
          <Swiper
            speed={1200}
            autoplay={{ delay: 3000 }}
            spaceBetween={0}
            slidesPerView={1}
            modules={[Autoplay]}
            breakpoints={{
              759: {
                slidesPerView: 3,
              },
            }}
          >
            {media.map((item, index) => (
              <SwiperSlide key={item.id || index} className="w-full h-full border bg-black">
                <div className="w-full h-[30rem] 2xl:h-[40rem] relative">
                  <Image
                    src={item.url}
                    fill
                    alt={item.alt || `Instagram post ${index + 1}`}
                    className="absolute w-full h-full object-cover"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="w-full text-center py-12">
            <p className="text-gray-500">
              {local === "en" ? "No Instagram posts to display" : "لا توجد منشورات على إنستغرام لعرضها"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InstagraSection;
