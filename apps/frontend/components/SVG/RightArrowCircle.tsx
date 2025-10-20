"use client";
import React from "react";

interface Props {
  white?: boolean;
  width?: string;
  height?: string;
}
function RightArrowCircle({ white, width, height }: Props) {
  return (
    <svg
      className={
        white
          ? "group fill-[#202020] hover:fill-white transition-all cursor-pointer"
          : " group hover:fill-black cursor-pointer transition-all"
      }
      xmlns="http://www.w3.org/2000/svg"
      width={width ? width : "63"}
      height={height ? height : "63"}
      fill="none"
      viewBox="0 0 63 63"
    >
      <circle
        cx="31.5"
        cy="31.5"
        r="31"
        stroke={white ? "white" : "#202020"}
      ></circle>
      <path
        className={
          white
            ? "fill-white  group-hover:fill-[#202020] transition-all"
            : " fill-[#202020]  group-hover:fill-white transition-all"
        }
        d="M39.124 31.593l-4.958 4.959a.33.33 0 11-.468-.468l4.395-4.394h-14.41a.33.33 0 110-.662h14.41l-4.395-4.394a.33.33 0 11.468-.467l4.959 4.958a.33.33 0 010 .468z"
      ></path>
    </svg>
  );
}

export default RightArrowCircle;
