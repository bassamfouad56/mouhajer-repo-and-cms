"use client";
import React, { useRef } from "react";
import Image from "next/image";
import { useScroll, useTransform, motion } from "framer-motion";
import { useLocale } from "next-intl";
import { PROJECT_GALLERY_IMAGES, PLACEHOLDER_IMAGE } from "@/lib/cms-images";

type Props = {
  galleryImages?: string[];
};

const ProjectsGaller = ({ galleryImages = [] }: Props) => {
  const locale = useLocale();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const scale4 = useTransform(scrollYProgress, [0, 1], [1, 4]);
  const scale5 = useTransform(scrollYProgress, [0, 1], [1, 5]);
  const scale6 = useTransform(scrollYProgress, [0, 1], [1, 6]);
  const scale7 = useTransform(scrollYProgress, [0, 1], [1, 7]);
  const scale8 = useTransform(scrollYProgress, [0, 1], [1, 8]);
  const scale9 = useTransform(scrollYProgress, [0, 1], [1, 9]);

  const opacity1 = useTransform(scrollYProgress, [0, 0.5, 1], [0, 0, 1]);
  const opacity2 = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0, 0]);

  // Use CMS gallery images as default, fallback to placeholder
  const defaultImages = galleryImages.length > 0 ? galleryImages : PROJECT_GALLERY_IMAGES;
  const paddedDefaults = Array(7).fill(PLACEHOLDER_IMAGE);
  const images = defaultImages.length >= 7 ? defaultImages : [...defaultImages, ...paddedDefaults].slice(0, 7);

  const arr = [
    {
      src: images[0],
      scale: scale4,
    },
    {
      src: images[1],
      scale: scale5,
    },
    {
      src: images[2],
      scale: scale6,
    },
    {
      src: images[3],
      scale: scale7,
    },
    {
      src: images[4],
      scale: scale8,
    },
    {
      src: images[5],
      scale: scale9,
    },
    {
      src: images[6],
      scale: scale4,
    },
  ];
  return (
    <div ref={ref} className="mt-[10vh]  containerImage hidden lg:block">
      <motion.div style={{ opacity: opacity2 }} className="">
        <div className="fixed top-64 w-full flex items-center justify-center">
          <h4 className="lg:text-7xl uppercase font-SchnyderS text-white">
            {locale === "en" ? "Our Projects" : "محفظة الأعمال"}
          </h4>
        </div>
      </motion.div>
      <motion.div
        style={{ opacity: opacity1 }}
        className="sticky top-52 2xl:pl-80 text-white z-[9] mb-12"
      ></motion.div>
      <div className="hidden lg:block h-[300vh] relative">
        <motion.div className="sticky top-0 h-[100vh]  stickyImage overflow-hidden">
          {arr.map(({ src, scale }, i) => (
            <motion.div
              key={src + i}
              className="el w-full h-full absolute top-0 flex justify-center items-center overflow-hidden "
              style={{ scale: scale }}
            >
              <div className="imageContainer relative overflow-hidden">
                <Image
                  src={src}
                  fill
                  alt=""
                  className="object-cover"
                />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default ProjectsGaller;
