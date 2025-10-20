import React from "react";

type Props = {};

const LinkedinSVG = (props: Props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="48"
      height="48"
      fill="none"
      viewBox="0 0 48 48"
      className="cursor-pointer transition hover:scale-[1.1]"
    >
      <path
        fill="#2C2B2B"
        d="M31.993 32h.004V26.13c0-2.87-.618-5.082-3.974-5.082-1.613 0-2.696.886-3.138 1.725h-.047v-1.457h-3.182V32h3.314V26.71c0-1.393.264-2.74 1.988-2.74 1.7 0 1.725 1.59 1.725 2.83V32h3.31zM16.262 21.318h3.317V32h-3.317V21.318zM17.921 16c-1.06 0-1.921.86-1.921 1.921s.86 1.94 1.921 1.94 1.922-.879 1.922-1.94C19.842 16.861 18.98 16 17.92 16z"
      ></path>
      <circle cx="24" cy="24" r="23.5" stroke="#2C2B2B" opacity="0.2"></circle>
    </svg>
  );
};

export default LinkedinSVG;
