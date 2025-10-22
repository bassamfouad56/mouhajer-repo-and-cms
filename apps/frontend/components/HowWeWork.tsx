"use client";
import Image from "next/image";
import React from "react";
import RightArrowCircle from "./SVG/RightArrowCircle";
import HowWeWorkSwiperCard from "./HowWeWorkSwiperCard";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { useLocale } from "next-intl";

type Props = {
  small_image: string;
  big_image: string;
  arr:
    | [
        {
          index?: number;
          how_we_work: string;
          desc: string;
          project_discovery_arabic: string;
          desc_arabic: string;
        }
      ]
    | any;
};

const HowWeWork = ({ arr, big_image, small_image }: Props) => {
  const local = useLocale();
  return (
    <div className="bg-[#202020] relative mt-[40rem]">
      <div className="">
        <div className="pb-[3rem] lg:pt-12 2xl:pb-[10rem] mt-5 2xl:mt-0">
          <div className="px-5 lg:px-24 2xl:px-96 ">
            <div className="translate-y-[-50%]">
              <div className="w-full pt-[58.4615385%] relative">
                <Image
                  src={big_image}
                  alt=""
                  className="absolute w-full h-full object-cover"
                  fill
                />
                <div className="absolute h-[50%] w-full max-w-[25%] bottom-0 right-0 translate-y-[50%]">
                  <Image
                    src={small_image}
                    className="absolute w-full h-full"
                    fill
                    alt=""
                  />
                </div>
              </div>
            </div>
            <div className="text-white ">
              <div className="flex justify-between items-center mb-32">
                <div className="">
                  <h4 className="text-6xl font-SchnyderS uppercase mb-6">
                    {local === "en" ? `How we wrok` : "آلية عملنا"}
                  </h4>
                  <p className="max-w-xl text-[#FFFEF5] opacity-60">
                    {local === "en"
                      ? `We take a thorough and detailed approach to our design processes. It begins the first time we speak to our prospective clients about how they see their project taking shape. From this, we’ll form a solid plan. We'll use this to create the interior you want – at a time that’s right for you. Our interior design plans usually develop over four stages. Here’s a little bit about how each of these stages work…`
                      : `  كل مشروع تصميم داخلي نتبناه هو كيان فريد يتطلب تحليلًا دقيقًا وتفصيليًا، حتى نتمكن من فهم أساس احتياجات عملائنا بشكل كامل.`}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="rotate-[-180deg] prev-el-port relative">
                    <RightArrowCircle white />
                  </div>
                  <div className="work-next next-el-port relative">
                    <RightArrowCircle white />
                  </div>
                </div>
              </div>
              <Swiper
                navigation={{
                  nextEl: ".next-el-port",
                  prevEl: ".prev-el-port",
                }}
                speed={1000}
                slidesPerView={3}
                spaceBetween={48}
                pagination={{
                  clickable: true,
                }}
                className="mySwiper"
                onSwiper={(swiper) => {
                  swiper.on("click", (event) => {
                    swiper.slideTo(event.clickedIndex);
                  });
                }}
                modules={[Navigation]}
              >
                {arr.map((el: any, i: number) => (
                  <SwiperSlide key={el.how_we_work}>
                    <HowWeWorkSwiperCard index={i} {...el} />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowWeWork;
