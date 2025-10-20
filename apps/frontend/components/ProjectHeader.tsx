"use client";
import { useLocale } from "next-intl";
import React from "react";

type Props = {
  title?: string;
  type: string;
  location: string;
  titleArabic?: string;
};

const ProjectHeader = ({ title, type, location, titleArabic }: Props) => {
  const locale = useLocale();
  const handleLocation = (location: string) => {
    if (location === "DUBAI") {
      return "الموقع : دبي ";
    }
    return "";
  };

  const handleProjectType = (type: string) => {
    if (type === "Resturants") {
      return "مطاعم";
    }
    return "";
  };
  return (
    <div className="w-full relative px-4 2xl:px-0 text-center 2xl:text-start mb-6 2xl:mb-0">
      <div className="flex flex-col  w-full justify-between items-center 2xl:items-end uppercase text-[#202020] gap-4 2xl:gap-0 lg:flex-row">
        <p className="font-Satoshi ">
          {locale === "en" ? type : handleProjectType(type)}
        </p>
        <div className="2xl:absolute right-[50%] 2xl:translate-x-[50%]">
          <h4 className="text-4xl 2xl:text-5xl font-SchnyderS text-center">
            {locale === "en" ? title : titleArabic}
          </h4>
        </div>

        <p className="font-Satoshi ">
          {locale === "en"
            ? `location ${location}`
            : `${handleLocation(location)} `}
        </p>
      </div>
    </div>
  );
};

export default ProjectHeader;
