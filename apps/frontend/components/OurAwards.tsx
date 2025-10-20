import Image from "next/image";
import React from "react";
import { useLocale } from "next-intl";

type Award = {
  id: string;
  url: string;
  alt: string;
  name: string;
};

type Props = {
  locale?: string;
  awards?: Award[];
};

const OurAwards = ({ locale: localeProp, awards = [] }: Props) => {
  const local = useLocale();

  return (
    <div className="bg-[#FFFEF5] pt-[100px] pb-[100px]">
      <div className="px-4 2xl:px-80 mx-auto ">
        <div className="flex w-full justify-center items-center mb-4 2xl:mb-[96px] font-Satoshi  flex-col  ">
          <h1 className=" uppercase text-3xl mb-4">
            {local !== "en" ? `جوائزنا` : `Our Awards`}
          </h1>
          <p className="text-sm">
            {local === "en"
              ? `Arabian property awards`
              : "جوائز العقارات العربية"}
          </p>
        </div>
        <div className="grid grid-cols-2 lg:flex gap-x-14  2xl:gap-32 w-full items-center justify-between px-4">
          {awards.length > 0 ? (
            awards.slice(0, 4).map((award, index) => (
              <div
                key={award.id || index}
                className="w-full pt-[100%] lg:pt-0  lg:h-[12rem]  2xl:pt-[7%] relative"
              >
                <Image
                  alt={award.alt || `Award ${index + 1}`}
                  fill
                  src={award.url}
                  className="absolute w-full inset-0 h-full object-contain 2x:object-cover"
                />
              </div>
            ))
          ) : (
            <div className="w-full text-center py-12">
              <p className="text-gray-500">
                {local === "en" ? "No awards to display" : "لا توجد جوائز لعرضها"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OurAwards;
