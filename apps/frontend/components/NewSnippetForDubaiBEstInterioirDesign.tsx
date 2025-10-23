import { SERVICE_IMAGES } from "@/lib/cms-images";
import Image from "next/image";
import React from "react";
import { useLocale } from "next-intl";

type Props = {
  EnTitle: string;
  arTitle: string;
  enSubtitle: string;
  arSubtitle: string;
  enDescription: string;
  arDescription: string;
  image?: string; // CMS founder/engineer image
};

const NewSnippetForDubaiBEstInterioirDesign = ({
  EnTitle,
  arTitle,
  enSubtitle,
  arSubtitle,
  enDescription,
  arDescription,
  image,
}: Props) => {
  // Use CMS image or fallback to structural engineering image
  const engineerImage = image || SERVICE_IMAGES.structuralEn;
  const local = useLocale();

  // Don't render if no valid image
  if (!engineerImage || engineerImage === '') {
    console.warn('[NewSnippetForDubaiBEstInterioirDesign] No valid image provided, skipping render');
    return null;
  }
  return (
    <div className="">
      <div className="  2xl:pr-[19.5rem]  pb-14 ">
        <div className="2xl:pl-[13.5rem] mx-auto">
          <div className="grid lg:grid-cols-12 2xl:min-h-[60rem] lg:translate-x-[15%] ">
            <div
              className={`min-h-[24rem] sm:min-h-[55rem] lg:min-h-0 w-screen lg:w-full  lg:col-span-5 relative ${
                local === "en" ? "" : "order-2"
              }`}
            >
              <Image
                className="absolute w-full h-full object-contain "
                src={engineerImage}
                alt="Engineer Maher Mouhajer"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
            </div>
            <div className="hidden lg:col-span-1"></div>
            <div
              className={`col-span-5 text-[#2C2B2B] relative px-12 mt-12 ${
                local === "en" ? "text-left" : "text-right"
              }`}
            >
              <p
                className={`uppercase font-Satoshi mb-[3rem] 2xl:mb-[6rem] ${
                  local === "en" ? "" : "text-lg"
                }`}
              >
                {local === "en" ? EnTitle : arTitle}
              </p>
              <h4 className="font-SchnyderS text-3xl font-light mb-[3.2rem] max-w-2xl">
                {local === "en" ? enSubtitle : arSubtitle}
                {`
                `}
              </h4>
              <p
                className={`font-Satoshi   max-w-xl line-clamp-[14] ${
                  local === "en"
                    ? "text-base leading-6"
                    : "text-lg font-sans leading-normal"
                }`}
              >
                {local === "en" ? enDescription : arDescription}
              </p>
              <div
                className={`mt-4 2xl:absolute bottom-10 ${
                  local === "en" ? "" : "text-right"
                }`}
              >
                <div
                  className={`${
                    local === "en" ? "text-sm" : "text-lg 2xl:pr-12"
                  }`}
                >
                  <p className="font-Satoshi font-semibold mb-[10px]">
                    {local === "en"
                      ? `
                  Eng Maher Mouhajer
                  `
                      : " المهندس ماهر مهاجر"}
                  </p>
                  <p className={`opacity-50  `}>
                    {local === "en"
                      ? `Main Interior Design Engineer / Owner / CEO mouhajer
                    international design`
                      : `
                    المهندس الرئيسي لتصميم الديكور الداخلي / المالك / الرئيس التنفيذي لشركة مهاجر الدولية`}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewSnippetForDubaiBEstInterioirDesign;
