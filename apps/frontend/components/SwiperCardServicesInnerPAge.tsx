"use client";
import Image from "next/image";
import React, { useState } from "react";
import StarSVG from "./SVG/StarSVG";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";

type Props = {
  banner: string;
  title: string;
  description: string;
};

const SwiperCardServicesInnerPAge = ({ banner, title, description }: Props) => {
  const local = useLocale();
  const [isWhite, setIsWhite] = useState(true);
  const pathName = usePathname();
  const parsedLink = title.replace(/ /g, "-").toLocaleLowerCase();

  // Validate banner URL before rendering
  const isValidBanner = banner &&
    (banner.startsWith('/') ||
     banner.startsWith('http://') ||
     banner.startsWith('https://'));

  return (
    <Link href={`${pathName}/${parsedLink}`}>
      <div
        className="cursor-pointer group"
        onMouseLeave={() => setIsWhite(true)}
        onMouseEnter={() => setIsWhite(false)}
      >
        <div className="bg-[#2C2B2B] pt-4 px-4 2xl:pt-10 2xl:px-10 pb-14 group-hover:bg-[#F2F1E5] transition-colors duration-1000">
          {isValidBanner && (
            <div className="pt-[66.9856459%] w-full relative mb-8 shadow-sm">
              <Image
                src={banner}
                alt={title || ''}
                className="absolute min-w-full h-full object-cover"
                fill
              />
            </div>
          )}
          <h4 className="uppercase font-SchnyderS text-3xl  mb-4 text-[#F2F1E5] group-hover:text-[#202020] transition-colors duration-1000">
            {title}
          </h4>
          <p className="font-Satoshi text-[#F2F1E5] opacity-60 mb-12 group-hover:text-[#000] transition-colors duration-1000 line-clamp-3">
            {description
              ? description
              : "Lorem ipsum dolor sit amet consectetur adipisicing elit. Corporis, explicabo et! Aperiam, unde laboriosam totam fugit necessitatibus dolore commodi beatae adipisci consequuntur nam! Voluptatibus sed ipsa ipsum a maiores alias."}
          </p>
          <div className="flex items-center gap-4 group-hover:text-[#000] transition-colors duration-1000">
            <StarSVG white={isWhite} />
            <p className="font-Satoshi uppercase">
              {local !== "en" ? "اعرف المزيد" : "Explore More"}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default SwiperCardServicesInnerPAge;
