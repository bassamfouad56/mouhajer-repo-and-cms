"use client";
import Image from "next/image";
import React, { useRef } from "react";

import { useScroll, motion, useTransform } from "framer-motion";
import AnimatedHeadLine from "./AnimatedHeadLine";
import { useLocale } from "next-intl";
type Props = {
  contactus?: boolean;
  second_small_image?: string;
  big_image?: string;
  third_small_image?: string;
  title: string;
  second_title_arabic?: string;
  animatedTitle: {
    rendered: string;
  };
  animatedTitleArabic?: string;
};

const ProjectInnerIntro = ({
  contactus,
  title,
  animatedTitle,
  big_image,
  third_small_image,
  second_small_image,
  second_title_arabic,
  animatedTitleArabic,
}: Props) => {
  const locale = useLocale();
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  const transfomrImage = useTransform(
    scrollYProgress,
    [0, 0.8],
    ["-30%", "0%"]
  );
  // $r!rWTJ9KFyAyjF
  const transfomrImage2 = useTransform(
    scrollYProgress,
    [0, 0.8],
    ["0%", "40%"]
  );
  return (
    <div ref={targetRef}>
      <div className="py-[2rem] lg:py-[6rem] px-12 lg:px-0">
        <div className="flex justify-center text-center items-center">
          <h1 className="text-2xl lg:text-6xl font-SchnyderS mb-24 lg:mb-[12rem] max-w-5xl">
            {locale === "en" ? title : second_title_arabic}
          </h1>
        </div>
        <div className="flex items-center justify-center relative">
          <div className="h-[32rem] w-full lg:h-[70rem] lg:w-[50rem] relative  ">
            <div className="absolute top-[50%] translate-y-[-50%]">
              <AnimatedHeadLine
                blackened
                text={
                  (locale === "en" ? animatedTitle.rendered : animatedTitleArabic) || ''
                }
              />
            </div>
            {!contactus && (
              <motion.div
                style={{
                  opacity: scrollYProgress,
                  bottom: transfomrImage,
                  transition: "ease-in-out",
                  transitionDuration: "1000ms",
                }}
                className="absolute h-[35rem] w-[30rem] left-0 translate-x-[-60%] z-[1]"
              >
                {third_small_image && (
                  <Image
                    src={third_small_image}
                    fill
                    alt=""
                    className="absolute w-full h-full object-cover"
                  />
                )}
              </motion.div>
            )}
            {big_image && (
              <Image
                src={big_image}
                fill
                alt=""
                className="absolute h-[32rem] w-full lg:h-full object-cover"
              />
            )}
            {!contactus && (
              <motion.div
                style={{
                  opacity: scrollYProgress,

                  bottom: transfomrImage2,
                  transition: "ease-in-out",
                  transitionDuration: "600ms",
                }}
                className="absolute h-[35rem] w-[30rem] right-0 translate-x-[60%] z-[1]"
              >
                {second_small_image && (
                  <Image
                    src={second_small_image}
                    fill
                    alt=""
                    className="absolute w-full h-full object-cover"
                  />
                )}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectInnerIntro;
