"use client";
import Image from "next/image";
import React from "react";
import StarSVG from "./SVG/StarSVG";
import Link from "next/link";
import { useLocale } from "next-intl";
import { Service } from "@/lib/cms-types";

type Props = {
  service: Service;
  slug?: string;
  index?: boolean;
};

const VerticalSwiprCard = ({ service, index, slug }: Props) => {
  const local = useLocale() as 'en' | 'ar';

  const title = service.title[local];
  const subtitle = service.shortDescription[local];
  const icon = service.icon;
  const features = service.features[local] || [];
  const serviceSlug = slug || service.id;

  // Check if icon is a valid image URL or just an emoji/text
  const isValidImageUrl = icon && (icon.startsWith('/') || icon.startsWith('http'));

  return (
    <div className="bg-[#F2F1E5] 2xl:min-h-[60rem] px-6 pb-10 2xl:0">
      <div className="grid lg:grid-cols-12 ">
        <div
          className={`mb-4 2xl:mb-0 col-span-6 relative min-h-[24rem] w-full 2xl:min-h-0 flex items-center justify-center ${
            index && "lg:order-2"
          }`}
        >
          {isValidImageUrl ? (
            <Image
              fill
              className="absolute w-full h-full object-cover"
              src={icon}
              alt={title}
            />
          ) : (
            <div className="text-9xl">{icon || '🏢'}</div>
          )}
        </div>
        <div className="col-span-6 lg:py-[4rem] 2xl:py-[12rem]">
          <div className="">
            <div className="flex flex-col items-center justify-center">
              <h1 className="text-3xl mb-2 2xl:text-6xl  font-SchnyderS uppercase  2xl:mb-4 text-center">
                {title}
              </h1>
              <p className="font-Satoshi text-base max-w-2xl mx-auto text-center mb-5 2xl:mb-20 text-gray-600">
                {subtitle}
              </p>
              {features.length > 0 && (
                <div className="text-sm mb-5 text-center 2xl:mb-20">
                  {features.map((feature, idx) => (
                    <div key={idx} className="group w-full text-center justify-center flex items-center gap-2">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
                        <StarSVG />
                      </div>
                      <p className="font-Satoshi uppercase py-2 2xl:py-4 text-gray-400 group-hover:text-black duration-1000 transition-colors">
                        {feature}
                      </p>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
                        <StarSVG />
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div
                className={`flex items-center gap-4 group ${
                  index ? "translate-x-[-20px]" : "translate-x-[-20px]"
                }`}
              >
                <div className="opacity-0 group-hover:opacity-100 group-hover:rotate-[180deg] transition duration-1000 cursor-pointer">
                  <StarSVG />
                </div>
                <Link href={`/services/${serviceSlug}`}>
                  <p className="text-lg 2xl:text-2xl font-Satoshi uppercase">
                    {local === 'ar' ? "اعرف المزيد" : "Explore More"}
                  </p>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerticalSwiprCard;
