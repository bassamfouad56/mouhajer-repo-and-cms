'use client';
import React, { useRef, useState } from 'react';
import { ABOUT_IMAGES } from '@/lib/cms-images';
import RightArrowCircle from './SVG/RightArrowCircle';
import TwoImagesCarousel from './TwoImagesCarousel';
import { useLocale } from 'next-intl';
import Image from 'next/image';

type Props = {
  gallery?: any[];
  stats?: {
    years?: string;
    label?: string;
  };
  locale?: string;
};

const AboutSectionHomePageCarousel = ({ gallery = [], stats, locale: localeProp }: Props) => {
  const localeFromHook = useLocale();
  const local = localeProp || localeFromHook;

  // Use CMS gallery images or fallback to default images
  // All carousels use the SAME image pool - they cycle through all images
  const carouselImages = gallery.length > 0 ? gallery : ABOUT_IMAGES;

  // Use CMS stats or fallback to defaults
  const yearsOfExperience = stats?.years || '22';
  const experienceLabel =
    stats?.label || (local === 'en' ? 'Years of experience' : 'عاماً من الخبرة');
  const [toggleSecondImage, setToggleSecondImage] = useState(0);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const nextSlide = useRef(null);
  const previousSlide = useRef(null);

  const openLightbox = (imageUrl: string) => {
    setLightboxImage(imageUrl);
  };

  const closeLightbox = () => {
    setLightboxImage(null);
  };

  return (
    <>
      <div className="w-screen 2xl:min-h-[70rem] relative overflow-hidden  hidden 2xl:block">
        <div className="flex">
          <div className="absolute top-[170px] left-0 z-[1] translate-x-[-20%] hidden 2xl:block">
            <TwoImagesCarousel
              previousSlide={previousSlide}
              nextSlide={nextSlide}
              height="h-[50rem] "
              width={'w-[36rem]'}
              img={carouselImages}
              index={toggleSecondImage}
              setToggleSecondImage={setToggleSecondImage}
              onImageClick={openLightbox}
            />
          </div>
          <div className="absolute right-[50%] translate-x-[50%] hidden 2xl:block">
            <TwoImagesCarousel
              previousSlide={previousSlide}
              nextSlide={nextSlide}
              height="h-[50rem]"
              width={'w-[50rem]'}
              img={carouselImages}
              index={toggleSecondImage}
              setToggleSecondImage={setToggleSecondImage}
              onImageClick={openLightbox}
            />
          </div>
          <div className="2xl:absolute 2xl:right-[45%] 2xl:translate-x-[100%] 2xl:top-[50rem] translate-y-[-65%] hidden 2xl:block">
            <TwoImagesCarousel
              previousSlide={previousSlide}
              nextSlide={nextSlide}
              height="h-[38rem]"
              width={'w-[40rem]'}
              img={carouselImages}
              index={toggleSecondImage}
              setToggleSecondImage={setToggleSecondImage}
              onImageClick={openLightbox}
            />
          </div>
          <div className="absolute right-0 bottom-0 hidden 2xl:block">
            <TwoImagesCarousel
              previousSlide={previousSlide}
              nextSlide={nextSlide}
              height="h-[20rem]"
              width={'w-[24rem]'}
              img={carouselImages}
              index={toggleSecondImage}
              setToggleSecondImage={setToggleSecondImage}
              onImageClick={openLightbox}
            />
          </div>
        </div>
        <div className="absolute right-[50%] translate-x-[38rem] top-[25%]">
          <div className="flex items-center gap-4">
            <div
              className="rotate-[-180deg] prev-el"
              onClick={() => {
                setToggleSecondImage(toggleSecondImage - 1);
              }}
            >
              <RightArrowCircle />
            </div>
            <div
              ref={nextSlide}
              className="next-el"
              onClick={() => setToggleSecondImage(toggleSecondImage + 1)}
            >
              <RightArrowCircle />
            </div>
          </div>
        </div>
        <div className="absolute right-[50%] translate-x-[-100%] top-[59rem] ">
          <div
            className={`w-full flex items-center gap-5 ${local === 'en' ? '' : 'flex-row-reverse'}`}
          >
            <p className="font-SchnyderS font-light text-7xl text-black">{yearsOfExperience}</p>
            <p className="font-Satoshi text-base font-normal max-w-[94px] text-start uppercase">
              {experienceLabel}
            </p>
          </div>
        </div>
      </div>
      <div className="2xl:hidden relative min-h-[45rem] sm:min-h-[55rem] w-full">
        <div className="absolute w-[6rem] h-[8rem] sm:w-[12rem] sm:h-[12rem] lg:w-[25rem] lg:h-[80%]   left-7 z-1 lg:bottom-0">
          <TwoImagesCarousel
            previousSlide={previousSlide}
            nextSlide={nextSlide}
            height="h-full"
            width={'w-full'}
            img={carouselImages}
            index={toggleSecondImage}
            setToggleSecondImage={setToggleSecondImage}
            onImageClick={openLightbox}
          />
        </div>
        <div className="absolute w-[15rem] h-[15rem] sm:w-[23rem] sm:h-[23rem] lg:w-[32rem] lg:h-[32rem]  left-[50%] translate-x-[-50%] z-[0] top-20">
          <TwoImagesCarousel
            previousSlide={previousSlide}
            nextSlide={nextSlide}
            height="h-full"
            width={'w-full'}
            img={carouselImages}
            index={toggleSecondImage}
            setToggleSecondImage={setToggleSecondImage}
            onImageClick={openLightbox}
          />
          <div className="absolute w-[12rem] h-[12rem] sm:w-[15rem] sm:h-[15rem] lg:w-[26rem] lg:h-[26rem] right-0  z-[1]  bottom-0 translate-y-[80%] translate-x-[50%]">
            <TwoImagesCarousel
              previousSlide={previousSlide}
              nextSlide={nextSlide}
              height="h-full"
              width={'w-full'}
              img={carouselImages}
              index={toggleSecondImage}
              setToggleSecondImage={setToggleSecondImage}
              onImageClick={openLightbox}
            />
          </div>
        </div>
        <div className="absolute w-[10rem] h-[12rem] sm:w-[15rem] sm:h-[15rem]  left-0  lg:left-auto lg:right-0 z-[1]  bottom-14 ">
          <TwoImagesCarousel
            previousSlide={previousSlide}
            nextSlide={nextSlide}
            height="h-full"
            width={'w-full'}
            img={carouselImages}
            index={toggleSecondImage}
            setToggleSecondImage={setToggleSecondImage}
            onImageClick={openLightbox}
          />
        </div>
        <div className="absolute right-10 bottom-14   left-[56%] lg:translate-x-[-50%]">
          <div className="flex items-center mb-4 gap-4 text-start">
            <p className="font-SchnyderS text-4xl ">{yearsOfExperience}</p>
            <p className="font-Satoshi uppercase">{experienceLabel}</p>
          </div>
          <div className="flex items-center w-full  justify-start">
            <div
              className="rotate-[-180deg] prev-el"
              onClick={() => {
                setToggleSecondImage(toggleSecondImage - 1);
              }}
            >
              <RightArrowCircle width={'38'} height={'28.39'} />
            </div>
            <div
              ref={nextSlide}
              className="next-el"
              onClick={() => setToggleSecondImage(toggleSecondImage + 1)}
            >
              <RightArrowCircle width={'38'} height={'28.39'} />
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-[9999] bg-black bg-opacity-90 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <button
            className="absolute top-4 right-4 text-white text-4xl font-bold hover:text-gray-300 transition-colors z-[10000]"
            onClick={closeLightbox}
            aria-label="Close"
          >
            ×
          </button>
          <div className="relative w-full h-full max-w-7xl max-h-[90vh] flex items-center justify-center">
            <Image
              src={lightboxImage}
              alt="Enlarged view"
              fill
              className="object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default AboutSectionHomePageCarousel;
