"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { useScroll, motion, useTransform } from "framer-motion";

interface GalleryImages {
  bigImage: string;
  smallImage: string;
  bigImageAlt?: string;
  smallImageAlt?: string;
}

type Props = {
  images?: GalleryImages;
};

const ServicesTwoImageGallery = ({ images }: Props) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["0 1", "1.33 1"],
  });
  const newY = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    ["100%", "0%", "-50%"]
  );

  // If no images provided, don't render
  if (!images?.bigImage || !images?.smallImage) {
    return null;
  }

  return (
    <div>
      <div className="pb-6 px-16 2xl:px-0 lg:pb-[10rem]">
        <div className="mt-5 2xl:mt-0 flex items-end justify-end relative">
          <div className=" relative w-[60%] h-[8rem] sm:h-[12rem] lg:h-[32rem] 2xl:w-[70%] 2xl:h-[65rem]">
            <Image
              className="absolute w-full h-full object-cover"
              fill
              src={images.bigImage}
              alt={images.bigImageAlt || "Service image"}
            />
          </div>
          <div className="lg:hidden absolute left-6 top-5 w-[45%] h-[6rem] sm:h-[8rem]    2xl:w-[40rem]  bg-black overflow-hidden">
            <Image
              className="w-full h-full object-cover"
              fill
              src={images.smallImage}
              alt={images.smallImageAlt || "Service detail"}
            />
          </div>
          <motion.div
            ref={ref}
            className="absolute hidden lg:block left-[20%]    w-[50%] lg:w-[30rem] h-[6rem] lg:h-[25rem] 2xl:w-[40rem] 2xl:h-[50rem] bg-black overflow-hidden "
            transition={{ ease: "easeInOut", duration: "1000ms" }}
            style={{
              translateY: newY,
            }}
          >
            <Image
              className="w-full h-full object-cover"
              fill
              src={images.smallImage}
              alt={images.smallImageAlt || "Service detail"}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ServicesTwoImageGallery;
