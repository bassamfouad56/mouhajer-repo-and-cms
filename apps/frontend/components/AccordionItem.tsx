"use client";
import React, { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { AnimatePresence, motion } from "framer-motion";
import { useLocale } from "next-intl";

type Props = {
  index: number;
  tite: string;
  description: string;
  title_arabic: string;
  description_arabic: string;
};

const AccordionItemCustom = ({
  description,
  index,
  tite,
  title_arabic,
  description_arabic,
}: Props) => {
  const local = useLocale();
  const [showDescription, setShowDescription] = useState(false);
  return (
    <div className="grid lg:grid-cols-12 items-start ">
      <div className="col-span-6">
        <AnimatePresence mode="wait">
          {showDescription && (
            <motion.div
              key={index + tite}
              className="font-SchnyderS font-light leading-[110%] uppercase text-Nero "
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ ease: "easeInOut", duration: 1 }}
            >
              <div className="font-SchnyderS text-[4rem] 2xl:text-[6rem]  font-light leading-[110%] uppercase text-Nero relative">
                <p className="relative z-[1]">0 {index + 1}</p>
                <span className="absolute top-[-0px] left-[-4px] z-[0] font-SchnyderS text-[4rem] 2xl:text-[6rem]  font-light leading-[110%] uppercase text-Nero text-white drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">
                  0 {index + 1}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="col-span-1"></div>
      <div className="col-span-5 clear-start font-Satoshi 2xl:text-lg font-normal  overflow-hidden">
        <Accordion
          type="single"
          collapsible
          className="w-full transition-all duration-1000 "
          onClick={() => setShowDescription(!showDescription)}
        >
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-2xl font-SchnyderS font-semibold text-start">
              {local === "en" ? tite : title_arabic}
            </AccordionTrigger>
            <AccordionContent className="font-Satoshi text-lg">
              {local === "en" ? description : description_arabic}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

export default AccordionItemCustom;
