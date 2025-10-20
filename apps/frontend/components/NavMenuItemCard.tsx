import React, { useState } from "react";
import Image from "next/image";

interface Props {
  title: string;
  id: string;
  img: string;
  setHoveredParent: any;
  index: number;
}

const NavMenuItemCard = ({ title, index, img, setHoveredParent }: Props) => {
  const [hovered, setHovered] = useState(false);

  // Check if img is a valid image URL or just an emoji/text
  const isValidImageUrl = img && (img.startsWith('/') || img.startsWith('http'));

  return (
    <div
      className=" z-[9] relative "
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="pt-[5rem] 2xl:pt-[9rem] relative w-full text-black border cursor-pointer  bg-[#FFFEF5] transition-all duration-1000 "
        // onMouseLeave={() => setHoveredParent(false)}
      >
        <div className="flex items-center justify-center text-center flex-col z-[99]">
          <p className="mb-[10rem] font-Satoshi ">{index}</p>
          <h4
            className={`mb-[13rem] 2xl:mb-[16rem]  text-3xl font-SchnyderS font-light relative z-[2] transition-all duration-1000 max-w-xl line-clamp-1 ${
              hovered ? "translate-y-[-10rem] text-white" : "translate-y-[0]"
            }`}
          >
            {title}
          </h4>
          <div
            className={`absolute bottom-32 transition-all duration-500 ${
              hovered ? "h-full w-full translate-y-32" : "h-44 w-24"
            } ${hovered && "duration-1000 "} `}
          >
            <div
              className={`absolute w-full h-full transition-all duration-1000 ${
                hovered && " bg-black bg-opacity-[80%]"
              } top-0 z-[1]`}
            >
              <div className="absolute bottom-[12rem] left-[50%] translate-x-[-50%]">
                <ul
                  className={`flex flex-col space-y-8 text-white font-Satoshi opacity-0 transition duration-1000 ${
                    hovered && "opacity-100"
                  }`}
                >
                  <li>Interior Design</li>
                  <li>Structural Engineering</li>
                  <li>Design & Build</li>
                  <li>Construction & Fitout</li>
                  <li>Customized Furniture</li>
                </ul>
              </div>
            </div>
            {isValidImageUrl ? (
              <Image
                src={img}
                className="absolute w-full h-full object-cover"
                fill
                alt={title}
              />
            ) : (
              <div className="absolute w-full h-full flex items-center justify-center text-8xl bg-[#F2F1E5]">
                {img || '🏢'}
              </div>
            )}
          </div>
          <div className="w-0.5 h-32 bg-black"></div>
        </div>
      </div>
    </div>
  );
};

export default NavMenuItemCard;
