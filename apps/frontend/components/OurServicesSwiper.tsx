"use client";
import React from "react";
import RightArrowCircle from "./SVG/RightArrowCircle";

import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import { FreeMode, Navigation } from "swiper/modules";
import SwiperCardServicesInnerPAge from "./SwiperCardServicesInnerPAge";

interface Service {
  id?: string | number;
  banner: string;
  title: string;
  description: string;
}

type Props = {
  services?: Service[];
  title?: string;
};

const OurServicesSwiper = ({ services = [], title = "Services" }: Props) => {
  const arr = services;
  return (
    <div className="bg-[#202020] ">
      <div className=" px-4 2xl:px-0 py-8 2xl:py-12 text-white">
        <div className=" 2xl:px-80 mx-auto">
          <div className="flex items-center justify-between mb-6 2xl:mb-20">
            <h1 className="font-SchnyderS text-3xl 2xl:text-6xl uppercase">
              {title}
            </h1>
            <div className="flex items-center gap-4">
              <div className="rotate-[-180deg] service-prev">
                <div className="md:hidden">
                  <RightArrowCircle white height="32" width="32" />
                </div>

                <div className="hidden md:block">
                  <RightArrowCircle white />
                </div>
              </div>
              <div className="service-next">
                <div className="md:hidden">
                  <RightArrowCircle white height="32" width="32" />
                </div>
                <div className="hidden md:block">
                  <RightArrowCircle white />
                </div>{" "}
              </div>
            </div>
          </div>
        </div>
        <Swiper
          loop
          navigation={{
            prevEl: ".service-prev",
            nextEl: ".service-next",
          }}
          spaceBetween={50}
          slidesPerView={1.1}
          centeredSlides={true}
          modules={[FreeMode, Navigation]}
          breakpoints={{
            1219: {
              slidesPerView: 3.2,
            },
          }}
        >
          {arr?.map((el, i) => (
            <SwiperSlide key={el.id || el.title + i}>
              <SwiperCardServicesInnerPAge {...el} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default OurServicesSwiper;
