"use client";
import React from "react";
import AccordionItemCustom from "./AccordionItem";

type Props = {
  arr:
    | [
        {
          tite: string;
          description: string;
          title_arabic: string;
          description_arabic: string;
        }
      ]
    | any;
};

const NumberWithAccordian = ({ arr }: Props) => {
  return (
    <div className="pb-[3rem] lg:pt-12 2xl:pb-[10rem] mt-5 2xl:mt-0">
      <div className="px-5 lg:px-24 2xl:px-96 ">
        {arr?.map((el: any, i: number) => (
          <AccordionItemCustom key={el.tite + i} index={i} {...el} />
        ))}
      </div>
    </div>
  );
};

export default NumberWithAccordian;
