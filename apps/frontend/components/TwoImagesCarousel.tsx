import Image, { StaticImageData } from 'next/image';
import React, { Dispatch, MutableRefObject, SetStateAction, useEffect } from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, EffectFade, Autoplay, Parallax } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/parallax';

// import required modules

type Props = {
  img: (StaticImageData | string)[];
  width: string;
  height: string;
  index: number;
  setToggleSecondImage: Dispatch<SetStateAction<number>>;
  previousSlide: MutableRefObject<null>;
  nextSlide: MutableRefObject<null>;
  onImageClick?: (imageUrl: string) => void;
};

const TwoImagesCarousel = ({
  width,
  img,
  height,
  index,
  setToggleSecondImage,
  previousSlide,
  nextSlide,
  onImageClick,
}: Props) => {
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
      effect="fade"
      fadeEffect={{
        crossFade: true,
      }}
      autoplay={{
        delay: 4500,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      }}
      speed={800}
      loop={true}
      parallax={true}
      modules={[EffectFade, Autoplay, Parallax, Navigation]}
      className={`${width} ${height} mySwiper`}
    >
      {img?.map((el, i) => {
        // Handle both StaticImageData and string URLs
        const imageKey = typeof el === 'string' ? el : el.src;
        const handleClick = () => {
          if (onImageClick) {
            const imageUrl = typeof el === 'string' ? el : el.src;
            onImageClick(imageUrl);
          }
        };

        return (
          <SwiperSlide key={`${imageKey}-${i}`}>
            <div
              className={`${width} ${height} relative overflow-hidden ${onImageClick ? 'cursor-pointer' : ''}`}
              onClick={handleClick}
              data-swiper-parallax="-100"
            >
              <Image
                fill
                alt=""
                src={el}
                className="w-full h-full object-cover"
                priority={i === 0}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
};

export default TwoImagesCarousel;
