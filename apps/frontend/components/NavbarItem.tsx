"use client";
import React, { useState } from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";
type Props = {
  text: string;
  megamenu?: boolean;
  link?: string;
  isBlacked: boolean;
  arr?: { id: string; img: string; title: string }[];
};

const NavbarItem = ({ text, link, isBlacked, arr }: Props) => {
  const [hovered, setHovered] = useState(false);
  const pathName = usePathname();
  return (
    <div className="relative  group   z-[0] ">
      <Link
        className="z-[9] relative"
        href={`${link}`}
        onMouseLeave={() => setHovered(false)}
      >
        <p
          onMouseEnter={() => setHovered(true)}
          className="cursor-pointer z-[9] "
          onMouseDown={() => setHovered(false)}
        >
          {text}
        </p>
      </Link>
      <div
        className={`absolute w-full h-1 transition   ${
          isBlacked ? "bg-black" : " bg-[#fff]"
        }  rounded-full   bottom-0   shadow transition-transform translate-x-[-20px]  opacity-0 group-hover:translate-x-0  group-hover:opacity-100 duration-500`}
      ></div>
      {pathName.includes(`${link}`) && (
        <div
          className={`absolute w-full h-1 transition   ${
            isBlacked ? "bg-black" : " bg-[#fff]"
          }  rounded-full   bottom-0   shadow   `}
        ></div>
      )}
      <div
        onMouseLeave={() => setHovered(false)}
        className={`fixed   left-0 top-40   overflow-hidden bg-opacity-[15%] transition-all duration-1000  w-screen z-[9] ${
          hovered
            ? "translate-y-0 "
            : "translate-y-[-20px] opacity-0  h-0  left-0 "
        }`}
      ></div>
    </div>
  );
};

export default NavbarItem;
