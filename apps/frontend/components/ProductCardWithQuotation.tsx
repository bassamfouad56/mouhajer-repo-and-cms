"use client";
import Image from "next/image";
import React, { useRef } from "react";
import { useScroll, useTransform, motion } from "framer-motion";
import { useLocale } from "next-intl";
import quotes from "@/public/images/quotes.png";
type Props = {
  quote_title: string;
  big_image_quote: string;
  small_image_quote: string;
  quote_bottmo_description: { text: string }[];
  quote_title_arabic?: string;
  quote_bottmo_description_arabic: { text: string }[];
};
const ProductCardWithQuotation = ({
  big_image_quote,
  quote_title,
  small_image_quote,
  quote_bottmo_description,
  quote_title_arabic,
  quote_bottmo_description_arabic,
}: Props) => {
  const locale = useLocale();
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  const transfomrImage = useTransform(
    scrollYProgress,
    [0, 1],
    ["-30%", "-10%"]
  );

  const opacityAnimation = useTransform(
    scrollYProgress,
    [0, 1],
    ["0%", "100%"]
  );
  return (
    <div className="" ref={targetRef}>
      <div className="flex items-center justify-center">
        <div className="flex flex-col items-start justify-start">
          <div className="w-full h-[25rem] lg:w-[50vw] lg:h-[70rem] relative">
            <Image
              src={big_image_quote}
              fill
              className="w-full h-full object-cover"
              alt={`${quote_title || quote_title_arabic} - Featured interior design detail`}
              loading="lazy"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <motion.div
              style={{
                // opacity: opacityAnimation,
                bottom: transfomrImage,
                transition: "linear",
                transitionDuration: "1000ms",
              }}
              className="hidden 2xl:block absolute w-[35%] 2xl:w-[25%] h-[40%] z-[1] right-0 2xl:translate-x-[20%] "
            >
              <Image
                src={small_image_quote}
                fill
                className=" object-cover"
                alt="Interior design detail close-up"
                loading="lazy"
                sizes="(max-width: 1536px) 25vw, 25vw"
              />
            </motion.div>
            <div className="2xl:hidden absolute w-[35%] 2xl:w-[25%] h-[40%] z-[1] right-0 bottom-0 translate-y-[50%]">
              <Image
                src={small_image_quote}
                fill
                className=" object-cover"
                alt="Interior design detail close-up"
                loading="lazy"
                sizes="35vw"
              />
            </div>
          </div>
          <motion.div
            className="mt-4 p-4 2xl:mt-0 2xl:p-0  2xl:translate-x-[-35px]"
            style={{
              // opacity: opacityAnimation,
              transition: "ease-in-out",
              transitionDuration: "1000ms",
            }}
          >
            <div className="max-w-5xl">
              <div className="h-14 w-1/4 2xl:h-24 2xl:w-24 relative" aria-hidden="true">
                <Image
                  src={quotes}
                  alt=""
                  fill
                  className="absolute w-full h-full object-contain"
                />
              </div>
              <h4 className="font-SchnyderS text-2xl mb-12">
                {locale === "en" ? quote_title : quote_title_arabic}
              </h4>
              <div className="font-Satoshi opacity-60">
                {locale === "en"
                  ? !!quote_bottmo_description.length &&
                    quote_bottmo_description?.map((el, i) => (
                      <p key={i + el.text} className="mb-4">
                        {el.text}
                      </p>
                    ))
                  : !!quote_bottmo_description_arabic.length &&
                    quote_bottmo_description_arabic?.map((el, i) => (
                      <p key={i + el.text} className="mb-4">
                        {el.text}
                      </p>
                    ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProductCardWithQuotation;
