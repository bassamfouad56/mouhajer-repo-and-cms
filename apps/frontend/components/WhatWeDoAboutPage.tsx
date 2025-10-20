import React from "react";
import VerticalSwiperAboutUs from "./VerticalSwiperAboutUs";
import { useLocale } from "next-intl";

type Props = {
  hideTitle?: boolean;
  arr: any;
};

const WhatWeDoAboutPage = ({ hideTitle, arr }: Props) => {
  const local = useLocale();
  return (
    <div className="relative" dir={local !== "en" ? "rtl" : "ltr"}>
      <div className="">
        {!hideTitle && (
          <div className="grid sm:grid-cols-12 py-[12rem] items-center px-6 2xl:px-80 gap-6">
            <h1 className="col-span-6">
              <div className="flex justify-start items-start text-start sm:text-center sm:justify-center sm:items-center">
                <h4 className="font-SchnyderS text-6xl font-light">
                  {local === "en" ? "What We Do" : "ماذا نقدم؟"}
                </h4>
              </div>
            </h1>
            <p
              className={`col-span-6 font-Satoshi  ${
                local === "en" ? "text-base leading-[25px]" : "text-2xl"
              }`}
            >
              {local === "en"
                ? `Luxury project excellence goes beyond aesthetics. Understanding
              the architecture and engineering of space on both structural and
              interior design levels is crucial. We merge artistry with
              artisanal skill and craftsmanship, getting to the heart of every
              project, whether it’s a home, commercial, or hospitality venue.
              With the rise of newly built properties and luxury villas in the
              region, there is a growing demand for exceptional luxury interior
              design. We bridge that gap, creating comfortable surroundings with
              an air of magnificence.`
                : "لا يتوقف عملنا المتميّز على الجانب الجمالي للمشاريع الفاخرة، بل نعمل بالبداية على فهم التصميم المعماري وهندسة المساحة على صعيدي التصميم الداخلي والإنشائي، ودمج الفن مع المهارات الحرفية والجودة، بحيث نمنح كل مشروع نعمل على تنفيذه روحاً، سواءً كان لمنزل أو لفندق أو لعلامة تجارية. وفي ظل تزايد عمليات التطوير في العقارات الجديدة والفلل الفاخرة بجميع أنحاء المنطقة، يزداد الطلب على التصميم الداخلي الفاخر والمتميّز، والذي نفتخر بتقديمه بلمسات رائعة."}
            </p>
          </div>
        )}
        <VerticalSwiperAboutUs arr={arr} id={0} />
      </div>
    </div>
  );
};

export default WhatWeDoAboutPage;
