"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import RightArrowCircle from "./SVG/RightArrowCircle";
import Image from "next/image";
import { Navigation } from "swiper/modules";
import { PORTFOLIO_CAROUSEL_IMAGES, PLACEHOLDER_IMAGE } from "@/lib/cms-images";

type Props = {
  carouselImages?: string[];
};

const PortfolioCarouselHomepageMobile = ({ carouselImages = [] }: Props) => {
  // Use CMS images as default
  const defaultImages = carouselImages.length >= 2
    ? carouselImages
    : (PORTFOLIO_CAROUSEL_IMAGES.length >= 2
        ? [PORTFOLIO_CAROUSEL_IMAGES[0], PORTFOLIO_CAROUSEL_IMAGES[1]]
        : [PLACEHOLDER_IMAGE, PLACEHOLDER_IMAGE]);
  const images = defaultImages;
  return (
    <div className="text-white 2xl:hidden">
      <div className="flex items-center justify-between mb-12">
        <p className="text-[#FFFEF5] font-Satoshi">+400 Projects</p>
        <div className=" flex items-center gap-4">
          <div className="rotate-[-180deg] prev-mobile-project">
            <RightArrowCircle white width="38" height="38" />
          </div>
          <div className="next-mobile-project">
            <RightArrowCircle white width="38" height="38" />
          </div>
        </div>
      </div>{" "}
      <Swiper
        loop
        navigation={{
          prevEl: ".prev-mobile-project",
          nextEl: ".next-mobile-project",
        }}
        modules={[Navigation]}
        spaceBetween={20}
        slidesPerView={1.2}
      >
        <SwiperSlide>
          <div className="h-[24rem] sm:h-[32rem] w-full bg-red-50 relative">
            <Image
              src={images[0] || ''}
              fill
              className="absolute w-full h-full object-cover"
              alt=""
            />
          </div>
        </SwiperSlide>{" "}
        <SwiperSlide>
          <div className="h-[24rem] sm:h-[32rem] w-full bg-red-50 relative">
            <Image
              src={images[1] || ''}
              fill
              className="absolute w-full h-full object-cover"
              alt=""
            />
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export default PortfolioCarouselHomepageMobile;
