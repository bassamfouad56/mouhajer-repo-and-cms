import React from "react";
import BackgroundRays from "./SVG/BackgroundRays";
import { useLocale } from "next-intl";
type Props = {
  index: number;
  how_we_work: string;
  desc: string;
  project_discovery_arabic: string;
  desc_arabic: string;
};

const HowWeWorkSwiperCard = ({
  index,
  how_we_work,
  desc,
  project_discovery_arabic,
  desc_arabic,
}: Props) => {
  const local = useLocale();
  return (
    <div className="bg-[#2C2B2B] shadow-md relative overflow-hidden">
      <div
        className={`absolute w-full translate-x-[-50%] top-0 rotate-[15deg] translate-y-[-50%]`}
      >
        {index === 0 && <BackgroundRays />}
        {index !== 0 && <BackgroundRays />}
      </div>
      <div className="px-6 pb-8 pt-96">
        <h4 className="text-3xl font-SchnyderS mb-6">
          {local === "en" ? how_we_work : project_discovery_arabic}
        </h4>
        <p className="text-[#F2F1E5] opacity-60 text-base">
          {local === "en" ? desc : desc_arabic}
        </p>
      </div>
    </div>
  );
};

export default HowWeWorkSwiperCard;
