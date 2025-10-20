"use client";
import React from "react";
import Image from "next/image";
import StarSVG from "@/components/SVG/StarSVG";
import Link from "next/link";
import { ERROR_IMAGES, PLACEHOLDER_IMAGE } from "@/lib/cms-images";

type Props = {
  errorImages?: string[];
};

const PAgeNotFoundBAnner = ({ errorImages = [] }: Props) => {
  // Use CMS error images as default
  const images = errorImages.length >= 3 ? errorImages : ERROR_IMAGES.length >= 3 ? ERROR_IMAGES : [PLACEHOLDER_IMAGE, PLACEHOLDER_IMAGE, PLACEHOLDER_IMAGE];
  return (
    <div className="flex justify-center relative lg:min-h-[65rem] h-full items-center">
      <div className="flex justify-center gap-6 space-x-4 relative">
        <div className="absolute top-0 right-[50%] translate-x-[50%] text-white z-[2]">
          <h4 className="text-[5rem] lg:text-[12rem] uppercase font-SchnyderS">
            404
          </h4>
          <p className="uppercase text-2xl">This page does not exist</p>
          <Link href="/">
            <div className="mt-12 flex items-center gap-4 group">
              <div className="transition-all group-hover:rotate-[180deg] cursor-pointer duration-1000">
                <StarSVG white />
              </div>
              <p className="text-lg font-Satoshi uppercase">
                go back to home page
              </p>
            </div>
          </Link>
        </div>
        <div className="h-[32rem] w-60 relative">
          <div className="absolute w-full h-full bg-black opacity-50 z-[1]"></div>
          <Image
            className="absolute w-full h-full object-cover"
            fill
            alt=""
            src={images[0] || ''}
          />
        </div>
        <div className="h-[32rem] w-60 relative mt-12">
          <div className="absolute w-full h-full bg-black opacity-50 z-[1]"></div>
          <Image
            className="absolute w-full h-full object-cover"
            fill
            alt=""
            src={images[1] || ''}
          />
        </div>
        <div className="h-[32rem] w-60 relative mt-24">
          <div className="absolute w-full h-full bg-black opacity-50 z-[1]"></div>
          <Image
            className="absolute w-full h-full object-cover"
            fill
            alt=""
            src={images[2] || ''}
          />
        </div>
      </div>
    </div>
  );
};

export default PAgeNotFoundBAnner;
