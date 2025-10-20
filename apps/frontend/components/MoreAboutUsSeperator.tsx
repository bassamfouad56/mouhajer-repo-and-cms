import React from "react";
import ArrowDown from "./SVG/ArrowDownSVG";
import StarSVG from "./SVG/StarSVG";
import { useLocale } from "next-intl";

type Props = {
  white?: boolean;
};

const MoreAboutUsSeperator = ({ white }: Props) => {
  const local = useLocale();
  return (
    <div className="pb-10 2xl:py-32 overflow-hidden relative">
      <div className="px-4 2xl:px-16 mx-auto">
        <div className="flex flex-col gap-5 overflow-hidden">
          <div className="flex justify-between items-center">
            <div className="items-center gap-1 hidden 2xl:flex ">
              <ArrowDown />
              <ArrowDown />
              <ArrowDown />
            </div>
            <div className="flex items-center justify-start gap-4 2xl:gap-0">
              <StarSVG />
              <p className="font-Satoshi text-xl uppercase">
                {local === "en" ? "More About US" : "اقرأ المزيد عنا"}
              </p>
            </div>
          </div>
        </div>
      </div>
      <span className="w-full h-0.5 bg-black bg-opacity-[10%] hidden 2xl:block absolute left-0"></span>
    </div>
  );
};

export default MoreAboutUsSeperator;
