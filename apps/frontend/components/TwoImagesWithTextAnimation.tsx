"use client";
import React, { useRef } from "react";
import AnimatedHeadLine from "./AnimatedHeadLine";
import Image from "next/image";
import { useScroll, useTransform, motion } from "framer-motion";
import { TWO_IMAGES_SMALL, TWO_IMAGES_BIG } from "@/lib/cms-images";

type Props = {
  imageSmall?: string;
  imageBig?: string;
};

const TwoImagesWithTextAnimation = ({ imageSmall = TWO_IMAGES_SMALL, imageBig = TWO_IMAGES_BIG }: Props) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["0 1", "1.33 1"],
  });
  const newY = useTransform(scrollYProgress, [0, 1], ["150%", "-180%"]);
  const yScaleMobile = useTransform(scrollYProgress, [0, 0.5], ["0", "-40%"]);
  return (
    <div className="border-red-500    relative w-full min-h-[18rem] overflow-hidden ">
      <div className="pt-[6rem] pb-[10rem]">
        <div className="flex  2xl:mb-[7rem] w-screen relative overflow-hidden">
          <AnimatedHeadLine text="Why Mohajer" blackened />
          <AnimatedHeadLine text="Why Mohajer" blackened />
          <AnimatedHeadLine text="Why Mohajer" blackened />
        </div>

        <div className="absolute lg:hidden top-0 w-screen ">
          <div className="w-full flex justify-between">
            <div className="flex justify-between">
              <div className="left-0 top-[18rem] translate-y-[-100%] absolute w-[45%] h-[7rem] 2xl:w-[40rem] 2xl:h-[45rem] bg-black  z-[0]">
                <Image
                  fill
                  className="absolute w-full h-full object-cover"
                  alt=""
                  src={imageSmall}
                />
              </div>
              <motion.div
                className="right-0  absolute w-[45%] h-[10rem] 2xl:w-[50rem] 2xl:h-[65rem] bg-black "
                transition={{ duration: "1000ms", ease: "easeInOut" }}
                style={{
                  translateY: yScaleMobile,
                }}
              >
                <Image
                  fill
                  className="absolute w-full h-full object-cover"
                  alt=""
                  src={imageBig}
                />
              </motion.div>
            </div>
          </div>
        </div>

        <div className="hidden lg:block">
          <motion.div
            className=""
            transition={{ ease: "easeInOut", duration: "1000ms" }}
            style={{
              y: newY,
            }}
          >
            <div className="lg:px-40 2xl:px-80">
              <div className="flex justify-between">
                <div className="left w-24 h-24 lg:w-[24rem] lg:h-[32rem]   2xl:w-[40rem] 2xl:h-[45rem] bg-black relative z-[0]">
                  <Image
                    fill
                    className="absolute w-full h-full object-cover"
                    alt=""
                    src={imageSmall}
                  />
                </div>
                <div className="right w-24 h-24 lg:w-[40rem] lg:h-[40rem] 2xl:w-[50rem] 2xl:h-[65rem] bg-black relative">
                  <Image
                    fill
                    className="absolute w-full h-full object-cover"
                    alt=""
                    src={imageBig}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default TwoImagesWithTextAnimation;
