"use client";
import { usePathname } from "next/navigation";
import React from "react";
import PlaineArrow from "./SVG/PlaineArrow";
import Link from "next/link";
import { useLocale } from "next-intl";

type Props = {
  hideScroll?: boolean;
  title?: string;
};

const AboutBanner = ({ hideScroll, title }: Props) => {
  const local = useLocale();

  const path = usePathname();
  const pathCustom = path?.split("").map((el, i) => {
    if (i > 3) {
      if (el === "-") {
        return " ";
      }
      return el;
    }
  });
  const adjustTitle = (str: string) => {
    if (local === "en") {
      return str;
    }
    if (str.toLocaleLowerCase() === "/ar/who-we-are") return "مَن نحن";
  };

  const adjustStaticTitle = (title: string) => {
    if (local === "en") return title;
    if (title?.toLowerCase() === "Are you a Supplier?".toLowerCase())
      return "هل أنت مورد؟";
    return title;
  };
  return (
    <div className="lg:min-h-[24rem] 2xl:min-h-0 ">
      <div className=" mx-auto 2xl:px-80">
        <div className="pb-[4rem] lg:   2xl:pt-[5rem]  2xl:pb-[14rem]   relative">
          <div className="flex items-center justify-center flex-col">
            <p className="mb-[7rem] uppercase">
              <Link href={"/"}>Home /</Link> {pathCustom}
            </p>
            {local === "en" ? (
              <h1 className="uppercase text-4xl lg:text-8xl font-SchnyderS">
                {title ? title : pathCustom}
              </h1>
            ) : (
              <h1 className="uppercase text-4xl lg:text-8xl font-SchnyderS">
                {title ? adjustStaticTitle(title) : adjustTitle(path)}
              </h1>
            )}
            {!hideScroll && (
              <div className="hidden lg:block absolute left-0 bottom-0 ">
                <div className="flex items-center  relative gap-4 rotate-[90deg]">
                  <p className=" font-Satoshi uppercase ">
                    {local === "en" ? "Scroll down" : "اسحب للأسفل"}
                  </p>
                  <div className=" rotate-[-90deg]">
                    <PlaineArrow />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutBanner;
