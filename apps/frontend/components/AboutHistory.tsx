"use client";
import Image from "next/image";
import React, { useState } from "react";
import { PROJECT_IMAGES } from "@/lib/cms-images";

import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import StarSVG from "./SVG/StarSVG";
import { AnimatePresence, motion } from "framer-motion";
import { useLocale } from "next-intl";

interface TimelineItem {
  id: string | number;
  desc: string;
  title: string;
  img: string;
  dateLeft: string;
  dateRight: string;
}

type Props = {
  timelineItems?: TimelineItem[];
  sectionTitle?: string;
};

const AboutHistory = ({ timelineItems = [], sectionTitle }: Props) => {
  const local = useLocale();
  const [activeIndex, setActiveIndex] = useState(0);

  // Default fallback data with CMS images
  const defaultItems: TimelineItem[] = local === "en"
    ? [
        {
          id: "1",
          desc: "Established as Mouhajer International Design and Contracting LLC.",
          title: "1999",
          img: PROJECT_IMAGES.reception1,
          dateLeft: "19",
          dateRight: "99",
        },
        {
          id: "2",
          desc: "Formed an alliance with Italy's largest furniture Brand, Industria Divani ePoltrone (IDP).",
          title: "2006",
          img: PROJECT_IMAGES.reception2,
          dateLeft: "20",
          dateRight: "06",
        },
        {
          id: "3",
          desc: "Completed a renovation on the Radisson Blu Sheikh on Zayed Road, Dubai, UAE.",
          title: "2009",
          img: PROJECT_IMAGES.reception3,
          dateLeft: "20",
          dateRight: "09",
        },
        {
          id: "4",
          desc: "Expanded operations across the Middle East region.",
          title: "2015",
          img: PROJECT_IMAGES.reception4,
          dateLeft: "20",
          dateRight: "15",
        },
        {
          id: "5",
          desc: "Recognized as one of Dubai's leading interior design firms.",
          title: "2020",
          img: PROJECT_IMAGES.reception5,
          dateLeft: "20",
          dateRight: "20",
        },
      ]
    : [
        {
          id: "1",
          desc: "تأسيس الشركة باسم مهاجر الدولية للتصميم والمقاولات ذ.م.م.",
          title: "1999",
          img: PROJECT_IMAGES.reception1,
          dateLeft: "19",
          dateRight: "99",
        },
        {
          id: "2",
          desc: "عقد اتفاقية مع أكبر علامة تجارية للأثاث في إيطاليا، Industria Divani ePoltrone (IDP)",
          title: "2006",
          img: PROJECT_IMAGES.reception2,
          dateLeft: "20",
          dateRight: "06",
        },
        {
          id: "3",
          desc: "إنجاز تجديد فندق راديسون بلو الشيخ على طريق الشيخ زايد، دبي",
          title: "2009",
          img: PROJECT_IMAGES.reception3,
          dateLeft: "20",
          dateRight: "09",
        },
        {
          id: "4",
          desc: "توسيع العمليات في جميع أنحاء منطقة الشرق الأوسط",
          title: "2015",
          img: PROJECT_IMAGES.reception4,
          dateLeft: "20",
          dateRight: "15",
        },
        {
          id: "5",
          desc: "التقدير كواحدة من شركات التصميم الداخلي الرائدة في دبي",
          title: "2020",
          img: PROJECT_IMAGES.reception5,
          dateLeft: "20",
          dateRight: "20",
        },
      ];

  const arr = timelineItems.length > 0 ? timelineItems : defaultItems;
  return (
    <div>
      <div className="pt-[4rem] pb-[6rem]">
        <div className="2xl:px-40">
          <div className="w-full h-0.5 bg-black mb-12"></div>
          <div className="flex items-center w-full justify-center gap-4 2xl:gap-[3.9rem]">
            <div className="relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, translateY: 60 }}
                  animate={{ opacity: 1, translateY: 0 }}
                  transition={{ duration: 1 }}
                  exit={{ opacity: 0, translateY: 20 }}
                  className="relative"
                >
                  {arr[activeIndex] && (
                    <div className="font-SchnyderS font-light leading-[110%] uppercase text-Nero">
                      <div className=" text-[4rem] 2xl:text-[10rem] font-light leading-[110%] uppercase text-Nero relative">
                        <p className="relative z-[1]">
                          {arr[activeIndex]?.dateLeft}
                        </p>
                        <span className="absolute top-[-8px] left-[-8px] z-[0] font-SchnyderS text-[4rem] 2xl:text-[10rem]  font-light leading-[110%] uppercase text-Nero text-white drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">
                          {arr[activeIndex]?.dateLeft}
                        </span>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }} // Set the duration of the animation
                className="h-[30rem] w-[24rem] relative"
              >
                <span className="absolute top-[50%] translate-y-[-50%] opacity-20 bg-black w-[120%] h-0.5 z-[0] left-[50%] translate-x-[-50%]"></span>
                {arr[activeIndex] && arr[activeIndex]?.img && activeIndex ? (
                  <Image
                    fill
                    className="absolute w-full h-full"
                    src={arr[activeIndex]?.img || ''}
                    alt=""
                  />
                ) : (
                  <Image
                    fill
                    className="absolute w-full h-full"
                    src={arr[0]?.img || ''}
                    alt=""
                  />
                )}
              </motion.div>
            </AnimatePresence>
            <div className="relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, translateY: 60 }}
                  animate={{ opacity: 1, translateY: 0 }}
                  transition={{ duration: 1.2 }}
                  exit={{ opacity: 0, translateY: 20 }}
                  className="relative"
                >
                  {arr[activeIndex] && (
                    <div className="font-SchnyderS font-light leading-[110%] uppercase text-Nero">
                      <div className="font-SchnyderS text-[4rem] 2xl:text-[10rem]  font-light leading-[110%] uppercase text-Nero relative">
                        <p className="relative z-[1]">
                          {arr[activeIndex]?.dateRight}
                        </p>
                        <span className="absolute top-[-8px] left-[-8px] z-[0] font-SchnyderS text-[4rem] 2xl:text-[10rem]  font-light leading-[110%] uppercase text-Nero text-white drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">
                          {arr[activeIndex]?.dateRight}
                        </span>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
          <div
            dir={local === "en" ? "ltr" : "rtl"}
            className={`max-w-md mx-auto text-center mt-[3rem] ${
              local === "en" && "font-SchnyderS"
            } `}
          >
            <p>{arr[activeIndex]?.desc}</p>
          </div>
          <div className="mt-[4em]">
            <Swiper
              speed={1000}
              slidesPerView={1}
              spaceBetween={80}
              centeredSlides={true}
              pagination={{
                clickable: true,
              }}
              className="mySwiper"
              onSwiper={(swiper) => {
                swiper.on("click", (event) => {
                  swiper.slideTo(event.clickedIndex);
                  setActiveIndex(event.clickedIndex);
                });
              }}
              breakpoints={{
                759: {
                  slidesPerView: 3,
                },
              }}
            >
              {arr?.map((el, i) => (
                <SwiperSlide
                  key={el.title + el.id}
                  className="text-black w-full flex items-center text-center justify-center cursor-pointer"
                >
                  <div className="flex flex-col gap-2 items-center">
                    <div
                      className={`text-[#202020] transition duration-1000 ${
                        activeIndex === i ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      <StarSVG />
                    </div>
                    <p
                      className={`text-[#202020] font-SchnyderS ${
                        activeIndex === i ? "opacity-100" : "opacity-50"
                      }`}
                    >
                      {el.title}
                    </p>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutHistory;
