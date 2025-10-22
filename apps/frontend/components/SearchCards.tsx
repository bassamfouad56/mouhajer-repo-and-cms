"use client";
import React from "react";
import StarSVG from "./SVG/StarSVG";
import { useLocale } from "next-intl";
import { Service, BlogPost, Project } from "@/lib/cms-types";

type SearchItem = Service | BlogPost | Project;

type Props = {
  arr: SearchItem[];
};

const SearchCards = ({ arr }: Props) => {
  const locale = useLocale() as 'en' | 'ar';

  return (
    <div className="grid grid-cols-3 gap-12">
      {arr?.map((item) => {
        const title = item.title[locale];
        const subtitle =
          'shortDescription' in item
            ? item.shortDescription[locale]
            : 'excerpt' in item
            ? item.excerpt[locale]
            : 'description' in item
            ? item.description[locale]
            : '';

        return (
          <div
            key={item.id}
            className="shadow pt-4 pb-16 px-6 bg-[#f2f1e5] cursor-pointer hover:bg-black hover:text-white transition-all"
          >
            <div className="">
              <p className="mb-4 text-xl font-semibold leading-tight">
                {title}
              </p>
              <p className="mb-12 line-clamp-2 opacity-40">
                {subtitle}
              </p>
              <div className="flex items-center gap-8">
                <StarSVG />
                <p className="text-base">{locale === 'en' ? 'Learn More' : 'اعرف المزيد'}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SearchCards;
