import React from "react";
interface Props {
  white?: boolean;
  xl?: boolean;
}
function StarSVG({ white, xl }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={xl ? "47" : "22"}
      height={xl ? "47" : "22"}
      fill="none"
      viewBox="0 0 22 22"
    >
      <path
        fill={white ? "#FFFEF5" : "#202020"}
        d="M11 0l2.816 8.184L22 11l-8.184 2.816L11 22l-2.816-8.184L0 11l8.184-2.816L11 0z"
      ></path>
    </svg>
  );
}

export default StarSVG;
