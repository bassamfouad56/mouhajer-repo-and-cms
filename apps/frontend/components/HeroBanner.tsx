'use client';
import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import { PROJECT_IMAGES } from '@/lib/cms-images';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import ProjectsSvg from './SVG/ProjectsSvg';
type Props = {
  HomeBannerIamge?: any;
  maskLayer?: boolean;
  title?: any;
  showBreadCrumbs?: boolean;
  title_arabic?: string;
  welcomText?: string;
  welcomeSubText?: string;
  videoSrc?: string;
  heroImage?: string;
};

const HeroBanner = ({
  HomeBannerIamge,
  maskLayer,
  title,
  welcomText,
  welcomeSubText,
  title_arabic,
  videoSrc,
  heroImage,
}: Props) => {
  const local = useLocale();
  const path = usePathname();
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (videoSrc && videoRef.current) {
      const v = videoRef.current;
      const tryPlay = () => {
        v.play().catch(() => {});
      };
      if (v.readyState >= 2) {
        tryPlay();
      }
    }
  }, [videoSrc]);

  const pathCustom = path?.split('').map((el, i) => {
    if (i > 3) {
      if (el === '-') {
        return ' ';
      }
      return el;
    }
  });
  return (
    <>
      <div className="   h-screen w-screen text-white relative  ">
        {maskLayer ? (
          <div className="absolute w-full h-full bg-black z-[1] opacity-50"></div>
        ) : (
          <div className="absolute z-[1] w-full h-full bg-gradient-to-b from-black via-transparent to-transparent opacity-30"></div>
        )}
        {maskLayer && (
          <div className="absolute top-[25%] left-[50%] translate-x-[-50%] z-[1] text-center px-2">
            <p className="uppercase font-Satoshi text-lg ">
              {local === 'en' ? 'Home' : 'الرئيسية'} / {pathCustom}
            </p>
          </div>
        )}
        {videoSrc ? (
          <video
            className="absolute w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            ref={videoRef}
            poster={typeof HomeBannerIamge === 'string' ? HomeBannerIamge : HomeBannerIamge?.src}
            onLoadedData={() => {
              if (videoRef.current) {
                videoRef.current.play().catch(() => {});
              }
            }}
            onCanPlayThrough={() => {
              if (videoRef.current) {
                videoRef.current.play().catch(() => {});
              }
            }}
            onError={() => {
              // If video fails, clear src so the poster (image) remains visible
              if (videoRef.current) {
                videoRef.current.removeAttribute('src');
              }
            }}
          >
            <source src={videoSrc} type="video/mp4" />
          </video>
        ) : (
          <Image
            src={heroImage || HomeBannerIamge || PROJECT_IMAGES.arumaila}
            alt={title || 'Mouhajer International Design - Luxury Interior Design in Dubai'}
            fill
            className="absolute w-full h-full object-cover"
            priority
            quality={90}
          />
        )}
        {title ? (
          <div className="w-full h-full flex justify-center items-center">
            <div className="relative z-[1] text-center flex flex-col gap-5">
              <p className="text-base font-normal font-Satoshi">
                {/* WELCOME TO MOUHAJER INTERNATIONAL DESIGN AND CONTRACTING */}
              </p>
              <div className=" p-4 uppercase">
                <h1
                  className={`font-light text-3xl ${
                    maskLayer ? 'lg:text-8xl' : '2xl:text-7xl'
                  }  font-SchnyderS max-w-4xl`}
                >
                  {local === 'en' ? title : title_arabic}
                </h1>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full h-full flex justify-center items-center">
            <div className="relative z-[1] text-center flex flex-col gap-5 items-center">
              <h1 className="text-base lg:text-2xl font-normal font-Satoshi">{welcomText}</h1>
              <div className=" p-4">
                <h1 className="font-light text-3xl lg:text-7xl  font-SchnyderS max-w-3xl">
                  {welcomeSubText}
                </h1>
              </div>
            </div>
          </div>
        )}

        <div className="absolute right-16 bottom-20 z-[1]">
          <div className="flex flex-col items-center justify-center gap-3 font-Satoshi text-sm font-normal uppercase">
            <p className="text-lg font-extralight">{local === 'en' ? ' Projects' : 'الأعمال'}</p>
            <Link href="/our-projects">
              <ProjectsSvg />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};
export default HeroBanner;
