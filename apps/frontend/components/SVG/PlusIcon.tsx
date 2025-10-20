import React from "react";

interface Props {
  black?: boolean;
  small?: boolean;
}
function PlusIcon({ black, small }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={small ? "24" : "36"}
      height={small ? "24" : "35"}
      fill="none"
      viewBox="0 0 36 35"
    >
      <path
        stroke={black ? "black" : "#FFFEF5"}
        strokeLinejoin="round"
        d="M.813 17.188h34.374M18 0v34.375"
      ></path>
    </svg>
  );
}

export default PlusIcon;
