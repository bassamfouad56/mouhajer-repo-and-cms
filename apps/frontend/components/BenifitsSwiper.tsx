"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/pagination";

interface Benefit {
  id: string;
  title: string;
  bigImage: string;
  smallImage?: string;
  description: string[];
}

type Props = {
  benefits?: Benefit[];
  title?: string;
};

const BenifitsSwiper = ({ benefits, title = "our benifits" }: Props) => {
  const [activeIndex, setActiveIndex] = useState(0);

  // Use provided benefits or empty array
  const arr = benefits || [];
  useEffect(() => {}, [activeIndex]);
  return (
    <div className="bg-[#202020] text-white px-40">
      <div className="py-40   relative">
        <div className="grid grid-cols-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              className="col-span-5 relative"
              initial={{ opacity: 0 }}
              animate={{
                opacity: 100,
                transition: { duration: 2, ease: "easeInOut" },
              }}
              exit={{
                y: -100,
                opacity: 0,
                transition: { duration: 0.5, ease: "easeInOut", delay: 0.3 },
              }}
            >
              <Image
                src={arr[activeIndex]?.bigImage || ''}
                className="absolute w-full h-full object-cover"
                alt=""
              />
              <div className="absolute right-0 bottom-0 h-72 w-52 translate-x-[50%] translate-y-[50%]">
                <Image
                  src={arr[activeIndex]?.smallImage || ''}
                  className="absolute w-full h-full object-cover"
                  alt=""
                />
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="col-span-2"></div>
          <div className="col-span-4  ">
            <Swiper
              speed={1000}
              slidesPerView={"auto"}
              pagination={{
                clickable: true,
              }}
              className="mySwiper"
              onSlideChange={(e) => setActiveIndex(e.activeIndex)}
              onSwiper={(swiper) => {
                swiper.on("click", (event) => {
                  swiper.slideTo(event.clickedIndex);
                  setActiveIndex(event.clickedIndex);
                });
              }}
            >
              {arr.map((el, i) => (
                <SwiperSlide key={el.id}>
                  <p className="text-lg mb-24 uppercase ">{title}</p>
                  <div className="relative mb-12 text-6xl font-SchnyderS ">
                    <p className="">{el.id}</p>
                    <p className="hollow absolute top-0 -left-1">{el.id}</p>
                  </div>
                  <p className=" uppercase text-5xl mb-10 font-SchnyderS">
                    {el.title}
                  </p>
                  <div className="mb-32 ">
                    {el.description?.map((str, i) => (
                      <p key={str + i} className="opacity-60 max-w-2xl mb-2">
                        {str}
                      </p>
                    ))}
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            <div className="absolute bottom-10">
              <div className="flex items-center gap-2">
                {arr?.map((el, i) => (
                  <div
                    key={el.title + el.id}
                    className={` flex items-center justify-center cursor-pointer ${
                      i === activeIndex
                        ? "transition duration-1000 min-w-4 min-h-4 border border-white rounded-full relative "
                        : "w-2 h-2 bg-gray-600 rounded-full"
                    } `}
                    onClick={() => setActiveIndex(i)}
                  >
                    <div
                      className={`w-0.5 h-0.5 bg-white  duration-1000 ${
                        activeIndex === i
                          ? "opacity-100 transition-all"
                          : "opacity-0"
                      }`}
                    ></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BenifitsSwiper;
