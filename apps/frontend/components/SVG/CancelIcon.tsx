import React from "react";

type Props = {};

const CancelIcon = (props: Props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="64"
      height="64"
      fill="none"
      viewBox="0 0 64 64"
    >
      <circle
        cx="32"
        cy="32"
        r="31.5"
        stroke="#202020"
        opacity="0.3"
        transform="matrix(-1 0 0 1 64 0)"
      ></circle>
      <path stroke="#202020" d="M40.809 23.869L23.838 40.84"></path>
      <path stroke="#202020" d="M40.734 40.205L23.764 23.235"></path>
    </svg>
  );
};

export default CancelIcon;
