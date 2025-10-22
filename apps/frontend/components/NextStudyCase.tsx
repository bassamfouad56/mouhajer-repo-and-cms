"use client";
import { PLACEHOLDER_IMAGE } from "@/lib/image-utils";
import Image from "next/image";
import React from "react";
import Link from "next/link";
import { useLocale } from "next-intl";
import { Project } from "@/lib/cms-types";

type Props = {
  project: Project;
  slug?: string;
};

const NextStudyCase = ({ project, slug }: Props) => {
  const locale = useLocale() as 'en' | 'ar';
  const projectSlug = slug || project.id;
  const title = project.title[locale];
  const mainImage = project.images?.[0] || PLACEHOLDER_IMAGE;

  if (project) {
    return (
      <div className="relative">
        <div className="absolute bg-black w-full h-full opacity-30 z-[1]"></div>
        {mainImage && (
          <Image
            className="w-full h-full object-cover"
            fill
            alt={`Next project: ${title} - Interior design case study`}
            src={mainImage}
            loading="lazy"
            sizes="100vw"
          />
        )}
        <div className="pb-6 2xl:pt-[12rem] 2xl:pb-[15rem] relative z-[1]">
          <div className="hidden 2xl:flex w-full justify-between items-center">
            <div className="2xl:translate-x-[-15%]     cursor-pointer flex items-center justify-center w-[20rem] h-[20rem] rounded-full border border-[#FFFEF5] uppercase font-SchnyderS text-xl text-[#FFFEF5] hover:bg-white hover:text-black transition-colors duration-1000">
              {locale === "en" ? (
                <p className="">
                  Go To All
                  <br /> Projects
                </p>
              ) : (
                <p className="">المزيد</p>
              )}
            </div>
            <div className="flex justify-center text-center items-center flex-col ">
              <div className="text-[#FFFEF5]">
                <Link href={`/our-projects/${projectSlug}`}>
                  <p className="uppercase font-Satoshi mb-8">
                    {locale === "en" ? "next study case" : "المشروع القادم"}
                  </p>
                </Link>
                <div className="max-w-2xl overflow-hidden">
                  <h4 className="text-6xl font-SchnyderS ">
                    {title}
                  </h4>
                </div>
              </div>
            </div>
            <Link href={`/our-projects/${projectSlug}`}>
              <div className="2xl:translate-x-[15%]     cursor-pointer flex items-center justify-center w-[20rem] h-[20rem] rounded-full border border-[#FFFEF5] uppercase font-SchnyderS text-xl text-[#FFFEF5] hover:bg-white hover:text-black transition-colors duration-1000">
                <p className="">{locale === "en" ? "Next" : "التالي"}</p>
              </div>
            </Link>
          </div>
          <div className="2xl:hidden relative min-h-[20rem]">
            <div className="absolute w-full bottom-0">
              <div className="2xl:hidden w-full flex flex-col">
                <div className="col-span-12">
                  <div className="flex justify-center text-center items-center flex-col">
                    <div className="text-[#FFFEF5]">
                      <Link href={`/our-projects/${projectSlug}`}>
                        <p className="">
                          {locale === "en"
                            ? `Next Study Case`
                            : `المشروع القادم`}
                        </p>
                      </Link>
                      <h4 className="text-6xl font-SchnyderS max-w-xl">
                        {title}
                      </h4>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between">
                  <div className="col-span-6 self-end cursor-pointer flex items-center justify-center w-[10rem] h-[10rem] rounded-full border border-[#FFFEF5] uppercase font-SchnyderS text-xl text-[#FFFEF5] hover:bg-white hover:text-black transition-colors duration-1000">
                    <p className="">Next</p>
                  </div>
                  <div className="col-span-6 cursor-pointer self-end flex items-center justify-center w-[10rem] h-[10rem] rounded-full border border-[#FFFEF5] uppercase font-SchnyderS text-xl text-[#FFFEF5] hover:bg-white hover:text-black transition-colors duration-1000">
                    <p className="">
                      Go To All
                      <br /> Projects
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return null;
  }
};

export default NextStudyCase;
