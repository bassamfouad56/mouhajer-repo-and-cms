'use client';
import React from 'react';
import StarSVG from './SVG/StarSVG';
import PortfolioCarouselHomepage from './PortfolioCarouselHomepage';
import AnimatedHeadLine from './AnimatedHeadLine';
import PortfolioCarouselHomepageMobile from './PortfolioCarouselHomepageMobile';
import Link from 'next/link';
import DescriptionAbouitMouahjerHomePage from './DescriptionAbouitMouahjerHomePage';
import { useLocale } from 'next-intl';

type Props = {
  text: string;
  sectionTitle?: string;
  description?: string;
  showCta?: boolean;
  ctaText?: string;
  ctaLink?: string;
  projectCount?: string;
  projectsLinkText?: string;
  projectsLink?: string;
  projects?: any[];
  locale?: string;
};

const PortfolioHomePageDisplay = ({
  text,
  sectionTitle,
  description,
  showCta = true,
  ctaText,
  ctaLink = '/contact-us',
  projectCount,
  projectsLinkText,
  projectsLink = '/our-projects',
  projects = [],
  locale: localeProp,
}: Props) => {
  const local = useLocale();
  const projectData = projects.length > 0 ? projects : [];
  const displayProjectCount = projectCount || (local === 'en' ? '+400 Projects' : '+400 مشروع');
  const displayProjectsLinkText = projectsLinkText || (local === 'en' ? 'See All Projects' : 'اطلع على كافة المشاريع');

  return (
    <div className="bg-[#202020] pt-12 pb-12 2xl:pb-32 overflow-hidden">
      <div className="flex items-center justify-start   gap-x-52 mb-4 ">
        <AnimatedHeadLine text={text} />
        <AnimatedHeadLine text={text} />
        <AnimatedHeadLine text={text} />
      </div>

      <div className="px-4 2xl:px-16">
        {local === 'en' && (sectionTitle || description) ? (
          <>
            <div className="w-full h-0.5 bg-opacity-15 bg-[#FFFEF5] mb-8"></div>
            <DescriptionAbouitMouahjerHomePage
              title={sectionTitle}
              subtitle={description}
              showButton={showCta}
              buttonText={ctaText}
              buttonLink={ctaLink}
            />
          </>
        ) : local === 'en' ? (
          <>
            <div className="w-full h-0.5 bg-opacity-15 bg-[#FFFEF5] mb-8"></div>
            <DescriptionAbouitMouahjerHomePage />
          </>
        ) : (
          ''
        )}

        <div className="w-full h-0.5 bg-opacity-15 bg-[#FFFEF5] mb-8"></div>
        <div className="flex flex-col lg:flex-row items-center  justify-center lg:justify-between text-white text-xl font-normal font-Satoshi mb-16 2xl:pl-44">
          <div className="uppercase flex items-center gap-2">
            <p>{displayProjectCount}</p>
          </div>
          <div className="uppercase flex items-center gap-2">
            <StarSVG white />
            <Link href={projectsLink}>
              <p className="">{displayProjectsLinkText}</p>
            </Link>
          </div>
        </div>
        <div className="2xl:px-16">
          <PortfolioCarouselHomepage projectData={projectData} />
        </div>
      </div>
    </div>
  );
};

export default PortfolioHomePageDisplay;
