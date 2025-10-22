import React from "react";
import Image from "next/image";

interface GalleryImage {
  id: string | number;
  url: string;
  alt?: string;
}

type Props = {
  images?: GalleryImage[];
};

const AboutPageGAllery = ({ images = [] }: Props) => {
  // Default to first 3 images or empty if not provided
  const [imageOne, imageTwo, imageThree] = images;

  // If no images provided, don't render
  if (!imageOne && !imageTwo && !imageThree) {
    return null;
  }

  return (
    <div>
      <div className="py-[18rem]  sm:py-[20rem] lg:pt-[32rem]   2xl:pt-[60rem] 2xl:pb-[24rem] relative">
        <div className="absolute top-0  w-full">
          {imageOne && (
            <div className="absolute left-5 2xl:right-[40%] 2xl:translate-x-[50%]">
              <div className="w-[6rem] h-[6rem] sm:w-[12rem] sm:h-[12rem] lg:w-[24rem] lg:h-[24rem] 2xl:w-[51rem] 2xl:h-[57rem] relative  z-[1]">
                <Image
                  className="absolute w-full h-fulls object-cover"
                  fill
                  alt={imageOne.alt || "Gallery image 1"}
                  src={imageOne.url}
                />
              </div>
            </div>
          )}
          {imageTwo && (
            <div className="absolute left-5 translate-x-[2.5rem] sm:left-[10rem] sm:translate-x-0     lg:left-[50%] lg:translate-x-[-50%]  2xl:left-0 2xl:translate-x-0 top-[4rem] z-[0]">
              <div className="w-[16rem] h-[21rem] sm:w-[32rem] sm:h-[30rem] lg:w-[50rem] lg:h-[40rem] 2xl:w-[42rem] 2xl:h-[57rem] relative ">
                <Image
                  className="absolute w-full h-fulls object-cover"
                  fill
                  alt={imageTwo.alt || "Gallery image 2"}
                  src={imageTwo.url}
                />
              </div>
            </div>
          )}
          {imageThree && (
            <div className="absolute  right-5 top-[21rem]  sm:top-[28rem] lg:top-[26rem]  2xl:right-[20%] 2xl:translate-x-[40%] 2xl:top-[27rem]">
              <div className="w-[8rem] h-[10rem] lg:w-[23rem] lg:h-[22rem] 2xl:w-[40rem] 2xl:h-[60rem] relative ">
                <Image
                  className="absolute w-full h-fulls object-cover "
                  fill
                  alt={imageThree.alt || "Gallery image 3"}
                  src={imageThree.url}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AboutPageGAllery;
