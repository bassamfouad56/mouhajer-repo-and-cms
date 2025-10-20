import Image, { StaticImageData } from 'next/image';
import React, { Dispatch, MutableRefObject, SetStateAction, useEffect, useState } from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, EffectCreative } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-creative';

// import required modules

type Props = {
  img: StaticImageData[];
  width: string;
  height: string;
  index: number;
  setToggleSecondImage: Dispatch<SetStateAction<number>>;
  previousSlide: MutableRefObject<null>;
  nextSlide: MutableRefObject<null>;
};

const TwoImagesCarousel = ({
  width,
  img,
  height,
  index,
  setToggleSecondImage,
  previousSlide,
  nextSlide,
}: Props) => {
  const [animatePresence, setAnimatePresence] = useState(index);

  useEffect(() => {
    if (index >= img.length || index < 0) {
      setToggleSecondImage(0);
    }
  }, [index, img.length, setToggleSecondImage]);

  return (
    <Swiper
      navigation={{
        nextEl: '.next-el',
        prevEl: '.prev-el',
      }}
      hashNavigation={{
        watchState: true,
      }}
      pagination={{
        clickable: true,
      }}
      grabCursor={true}
      effect={'creative'}
      creativeEffect={{
        prev: {
          shadow: true,
          translate: [0, 0, -400],
        },
        next: {
          translate: ['100%', 0, 0],
        },
      }}
      modules={[EffectCreative, Navigation]}
      className={`${width} ${height} mySwiper`}
    >
      {img?.map((el, i) => {
        const nextImage = img[i + 1] ?? img[0] ?? el;
        return (
          <SwiperSlide key={el.src + i}>
            <div className={`${width}   ${height} relative  transition-all overflow-hidden`}>
              <div className="absolute w-full h-full flex">
                <Image fill alt="" src={el} className="absolute w-full h-full object-cover" />
                <Image
                  fill
                  alt=""
                  src={nextImage}
                  className={`${
                    animatePresence ? 'translate-x-[0]' : 'translate-x-[100%]'
                  }   transition-all duration-700 absolute w-full h-full object-cover`}
                />
              </div>
            </div>
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
};

export default TwoImagesCarousel;
