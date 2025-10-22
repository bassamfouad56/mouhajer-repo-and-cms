"use client";
import React, { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";

// import required modules
import { FreeMode, Navigation, Pagination, A11y } from "swiper/modules";
import Image from "next/image";
import RightArrowCircle from "./SVG/RightArrowCircle";
import { useLocale } from "next-intl";
type Props = {
  arr: [
    {
      img: string;
    }
  ];
  projectTitle?: string;
};

const ProjectGalleryCarousel = ({ arr, projectTitle }: Props) => {
  const locale = useLocale();
  const ref = useRef(null);
  const [selcted, setSelected] = useState(null);
  const swiperRef = useRef(null);
  const progressBarRef = useRef(null);
  const [progressWidth, setProgressWidth] = useState("25%");

  return (
    <section className="bg-[#202020]" aria-labelledby="gallery-heading">
      <div className="py-[4rem] 2xl:py-[12rem] relative">
        <div className="flex justify-center items-center">
          <h2 id="gallery-heading" className="text-[#FFFEF5] font-SchnyderS text-3xl mb-[8rem]">
            {locale === "en" ? "Projects Gallery" : "معرض صور المشروع"}
          </h2>
        </div>
        <Swiper
          loop
          speed={1000}
          ref={ref}
          navigation={{
            prevEl: ".projectG-prev",
            nextEl: ".projectG-next",
          }}
          initialSlide={1}
          slidesPerView={1.2}
          spaceBetween={20}
          freeMode={true}
          centeredSlides={true}
          modules={[FreeMode, Pagination, Navigation, A11y]}
          className=" "
          onSlideChange={(e) => {
            const progress = (e.realIndex + 1) / arr.length;
            setProgressWidth(`${progress * 100}%`);
          }}
          breakpoints={{
            1220: {
              spaceBetween: 192,
              slidesPerView: 2.3,
            },
          }}
          a11y={{
            enabled: true,
            prevSlideMessage: locale === "en" ? "Previous slide" : "الشريحة السابقة",
            nextSlideMessage: locale === "en" ? "Next slide" : "الشريحة التالية",
          }}
        >
          {!!arr.length &&
            arr?.map((el, i) => (
              <SwiperSlide key={el.img + i} className="cursor-pointer">
                <div className="relative h-[19rem] 2xl:h-[35rem] w-full bg-white">
                  <Image
                    src={el.img}
                    fill
                    className="absolute w-full h-full object-cover"
                    alt={`${projectTitle || "Project"} interior design gallery image ${i + 1} of ${arr.length}`}
                    loading="lazy"
                    sizes="(max-width: 1220px) 100vw, 45vw"
                  />
                </div>
              </SwiperSlide>
            ))}
        </Swiper>
        <div className="max-w-[1400px] translate-x-[50%] absolute translate-y-[50%] top-[50%] right-[50%] z-[1] w-full">
          <div className="flex w-full justify-between ">
            <button
              className="rotate-[-180deg] projectG-prev focus:outline-none focus:ring-2 focus:ring-amber-500 rounded-full"
              aria-label={locale === "en" ? "Previous image" : "الصورة السابقة"}
            >
              <RightArrowCircle white />
            </button>
            <button
              className="projectG-next focus:outline-none focus:ring-2 focus:ring-amber-500 rounded-full"
              aria-label={locale === "en" ? "Next image" : "الصورة التالية"}
            >
              <RightArrowCircle white />
            </button>
          </div>
        </div>
        <div className="flex justify-center mt-24 2xl:px-80">
          <div className="w-full h-1 bg-[#FFFEF5] bg-opacity-20 relative rounded-full overflow-hidden">
            <div
              ref={progressBarRef}
              className="absolute h-full top-0 bg-[#FFFEF5] z-[1] transition-all duration-1000"
              style={{ width: progressWidth }}
            ></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectGalleryCarousel;
