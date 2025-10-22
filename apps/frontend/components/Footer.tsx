import React from "react";
import AnimatedHeadLine from "./AnimatedHeadLine";
import LogoSvg from "./SVG/LogoSvg";
import StarSVG from "./SVG/StarSVG";
import SocialMediaICons from "./SocialMediaICons";
import Link from "next/link";
import { useLocale } from "next-intl";
import { NavItem as NavItemType } from "@/lib/navigation-fetcher";

type Props = {
  navigationItems?: NavItemType[];
};

const Footer = ({ navigationItems = [] }: Props) => {
  const local = useLocale();
  return (
    <div className="bg-[#202020] relative z-[99]">
      <div className="py-[6rem]">
        <div className="flex gap-32 mb-[7rem] overflow-hidden">
          <AnimatedHeadLine
            text={local === "en" ? "contact" : "اطلع على كافة المشاريع"}
          />
          <AnimatedHeadLine
            text={local === "en" ? "contact" : "اطلع على كافة المشاريع"}
          />
          <AnimatedHeadLine
            text={local === "en" ? "contact" : "اطلع على كافة المشاريع"}
          />
        </div>
        <div className="lg:px-24">
          <div className="bg-[#FFFEF5] w-full h-0.5"></div>
          <div className="flex flex-col lg:flex-row justify-between my-[3.2rem]">
            <div className="flex items-center justify-center lg:justify-start     ">
              <div className="pt-[55px] pb-[27px]">
                <LogoSvg />
              </div>
            </div>
            <div className="flex flex-col lg:items-end gap-10 pt-[55px] pb-[27px] text-white ">
              <div className="flex flex-col lg:flex-row items-center gap-10 text-xl font-Satoshi">
                {navigationItems.length > 0 ? (
                  // Use CMS navigation items
                  navigationItems
                    .filter((item) => item.type === "link")
                    .map((item) => (
                      <Link key={item.id} href={item.url || "#"}>
                        <p>{item.label[local as "en" | "ar"]}</p>
                      </Link>
                    ))
                ) : (
                  // Fallback to hardcoded links
                  <>
                    <Link href={"/who-we-are"}>
                      <p>{local === "en" ? "Who we are" : "مَن نحن؟"}</p>
                    </Link>
                    <Link href="/our-projects">
                      <p>{local === "en" ? "Our Projects" : "المشاريع"}</p>
                    </Link>
                    <Link href="/services">
                      <p>{local === "en" ? "Services" : "الخدمات"}</p>
                    </Link>
                    <Link href={"/blogs"}>
                      <p>{local === "en" ? "Blog" : "مقالات"}</p>
                    </Link>
                    <Link href={"/careers"}>
                      <p>{local === "en" ? `Careerss` : "المهن المتاحة"}</p>
                    </Link>
                    <Link href={"/contact-us"}>
                      <p>{local === "en" ? "Contact US" : "تواصل معنا"}</p>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>{" "}
          <div className="bg-[#FFFEF5] w-full h-0.5 mb-[3rem]"></div>
          <div className="flex flex-col lg:flex-row items-center justify-between uppercase text-white font-Satoshi mb-[4rem]">
            {local === "en" ? (
              <div className="flex flex-col gap-2 items-center lg:items-start">
                <p>Phone : +97144318426</p>
                <p>Phone : +971523041482</p>

                <p>Email: INFO@MOUHAJERDESIGN.COM</p>
              </div>
            ) : (
              <div className="flex flex-col gap-2 items-center lg:items-start">
                <p>+97144318426 : هاتف</p>
                <p>+971523041482 : هاتف</p>

                <p>INFO@MOUHAJERDESIGN.COM : البريد</p>
              </div>
            )}
            <div className="flex flex-col lg:flex-row items-center gap-6 mt-12 lg:mt-0">
              <SocialMediaICons />
              <div className="flex items-center gap-2">
                <StarSVG white />
                <p className=" ">
                  {local === "en" ? " Find us" : "تواصل معنا"}
                </p>
              </div>
            </div>
          </div>
          <div
            className="w-full items-center px-4 text-center lg:text-start
          grid lg:flex lg:justify-between text-white text-base font-Satoshi"
          >
            <p className="col-span-12 lg:col-span-1">
              © 2024 Mouhajer. All Rights Reserved.
            </p>
            <div className="flex items-center gap-4">
              {/* <p className="col-span-12 lg:col-span-1">Terms & Conditions</p> */}
              <Link href="/privacy-policy">
                <p className="col-span-12 lg:col-span-1">Privacy Policy</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
