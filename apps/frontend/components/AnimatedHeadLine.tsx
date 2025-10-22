import React from "react";
import StarSVG from "./SVG/StarSVG";

type Props = {
  text?: string;
  blackened?: boolean;
  light?: boolean;
};

const AnimatedHeadLine = ({ text, blackened, light }: Props) => {
  return (
    <div className="flex items-center gap-8 animate-slideInfinite ">
      <StarSVG white xl />
      <h1
        className={`uppercase w-max ${
          blackened ? "text-[#202020]" : "text-[#FFFEF5]"
        } text-[4rem]    ${
          light ? "2xl:text-[5rem]" : "2xl:text-[13rem]"
        }  font-SchnyderS`}
      >
        {text}
      </h1>
      <StarSVG white={!blackened} xl />
    </div>
  );
};

export default AnimatedHeadLine;
