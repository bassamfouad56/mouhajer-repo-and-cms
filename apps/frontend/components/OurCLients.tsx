"use client";
import React from "react";
import RightArrowCircle from "./SVG/RightArrowCircle";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import Image from "next/image";
import { useLocale } from "next-intl";

type Client = {
  id: string;
  url: string;
  alt: string;
  name: string;
};

type Props = {
  locale?: string;
  clients?: Client[];
};

const OurClients = ({ locale: localeProp, clients = [] }: Props) => {
  const local = useLocale();

  return (
    <div className="bg-[#202020] text-[#F2F1E5]">
      <div className="py-16 2xl:pt-[15rem] 2xl:pb-[22rem]">
        <div className="container mx-auto mb-12 2xl:mb-40 px-4 2xl:px-0">
          <div className="flex items-center justify-between">
            <h1 className="font-SchnyderS text-2xl 2xl:text-6xl font-light">
              {local === "en" ? "Our Clients" : "عملاؤنا"}
            </h1>
            <div className="flex items-center gap-4">
              <div className="rotate-[180deg] prev-client">
                <RightArrowCircle white />
              </div>
              <div className="next-client">
                <RightArrowCircle white />
              </div>
            </div>
          </div>
        </div>
        <div className="p-6 2xl:p-0">
          {clients.length > 0 ? (
            <Swiper
              navigation={{
                prevEl: ".prev-client",
                nextEl: ".next-client",
              }}
              loop={true}
              speed={1200}
              autoplay={{ delay: 3000 }}
              spaceBetween={35}
              slidesPerView={1}
              modules={[Autoplay, Navigation]}
              breakpoints={{
                759: { slidesPerView: 3 },
              }}
            >
              {clients.map((client, i) => (
                <SwiperSlide key={client.id || i} className="w-full">
                  <div className="w-full 2xl:h-[24rem] bg-[#2C2B2B] flex justify-center items-center shadow-2xl hover:bg-[#FFFEF5] cursor-pointer transition-colors rounded group">
                    <div className="relative h-[15rem] w-[15rem] cursor-pointer">
                      <Image
                        src={client.url}
                        alt={client.alt || `Client logo ${i + 1}`}
                        fill
                        className="absolute w-full h-full object-contain group-hover:filter group-hover:invert"
                      />
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <div className="text-center py-12">
              <p className="text-white/60">
                {local === "en" ? "No clients to display" : "لا يوجد عملاء لعرضهم"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OurClients;
