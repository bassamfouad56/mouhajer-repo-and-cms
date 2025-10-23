'use client';
import React, { useRef, useState, useMemo } from 'react';
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

// Fisher-Yates shuffle algorithm for better randomization
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const AboutSectionHomePageCarousel = ({ gallery = [], stats, locale: localeProp }: Props) => {
  const localeFromHook = useLocale();
  const local = localeProp || localeFromHook;

  // Use CMS gallery images or fallback to default images
  // BlockRenderer already passes clean URL strings, no need to map
  console.log('[AboutSectionHomePageCarousel] Gallery received:', gallery);
  console.log('[AboutSectionHomePageCarousel] Gallery length:', gallery.length);
  console.log('[AboutSectionHomePageCarousel] ABOUT_IMAGES fallback:', ABOUT_IMAGES);

  const baseImages = gallery.length > 0 ? gallery : ABOUT_IMAGES;

  // Create 4 unique image sets for each carousel position
  // Each carousel will get a different subset of images to ensure variety
  const imageSets = useMemo(() => {
    if (baseImages.length < 4) {
      // If we have fewer than 4 images, duplicate them to ensure we have enough
      const extended = [...baseImages];
      while (extended.length < 4) {
        extended.push(...baseImages);
      }
      return [
        [extended[0]],
        [extended[1]],
        [extended[2]],
        [extended[3]]
      ];
    }

    // Shuffle and split images into 4 unique sets
    const shuffled = shuffleArray(baseImages);
    const chunkSize = Math.ceil(shuffled.length / 4);

    return [
      shuffled.slice(0, chunkSize),
      shuffled.slice(chunkSize, chunkSize * 2),
      shuffled.slice(chunkSize * 2, chunkSize * 3),
      shuffled.slice(chunkSize * 3)
    ];
  }, [baseImages]);

  console.log('[AboutSectionHomePageCarousel] Image sets created:', {
    set1: imageSets[0]?.length,
    set2: imageSets[1]?.length,
    set3: imageSets[2]?.length,
    set4: imageSets[3]?.length,
    firstImages: imageSets.map(set => set[0])
  });

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
              img={imageSets[0]}
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
              img={imageSets[1]}
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
              img={imageSets[2]}
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
              img={imageSets[3]}
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
            img={imageSets[0]}
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
            img={imageSets[1]}
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
              img={imageSets[2]}
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
            img={imageSets[3]}
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
