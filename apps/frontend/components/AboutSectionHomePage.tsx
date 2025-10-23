import React from "react";
import Link from "next/link";
import AboutSectionHomePageCarousel from "./AboutSectionHomePageCarousel";

type Props = {
  locale?: string;
  content?: {
    title?: string;
    subtitle?: string;
    description?: string;
    image?: string;
    features?: any[];
    gallery?: any[];
    stats?: {
      years?: string;
      label?: string;
    };
    showCta?: boolean;
    ctaText?: string;
    ctaLink?: string;
  };
};

const AboutSectionHomePage = ({ locale: localeProp, content }: Props) => {
  // Content should always be provided from CMS via parent page
  if (!content?.title || !content?.description) {
    console.warn('AboutSectionHomePage: Missing required content from CMS');
    return null;
  }

  return (
    <div className="">
      <div className="pt-10 2xl:pt-36  2xl:pb-16">
        <div className="text-center">
          <h1 className="font-SchnyderS text-2xl lg:text-6xl font-light 2xl:leading-[66px] max-w-6xl mx-auto mb-8">
            {content.title}
          </h1>
          <p className="font-Satoshi text-base font-normal leading-[25px] max-w-4xl mx-auto mb-12 px-4 2xl:px-0">
            {content.description}
          </p>
          {content.showCta && content.ctaText && content.ctaLink && (
            <div className="mb-20">
              <Link
                href={content.ctaLink}
                className="inline-block px-8 py-4 bg-black text-white font-Satoshi text-base font-medium uppercase transition-all duration-300 hover:bg-gray-800 hover:scale-105"
              >
                {content.ctaText}
              </Link>
            </div>
          )}
          <AboutSectionHomePageCarousel
          gallery={content.gallery || []}
          {...(content.stats && { stats: content.stats })}
          {...(localeProp && { locale: localeProp })}
        />
        </div>
      </div>
    </div>
  );
};

export default AboutSectionHomePage;
