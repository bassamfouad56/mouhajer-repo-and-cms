"use client";
import React, { useRef } from "react";
import { useMotionValueEvent, useScroll } from "framer-motion";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const StickyScroll = ({
  content,
  contentClassName,
}: {
  content: {
    title: string;
    description: string;
    content?: React.ReactNode | any;
  }[];
  contentClassName?: string;
}) => {
  const [activeCard, setActiveCard] = React.useState(0);
  const ref = useRef<any>(null);
  const { scrollYProgress } = useScroll({
    // uncomment line 22 and comment line 23 if you DONT want the overflow container and want to have it change on the entire page scroll
    // target: ref
    container: ref,
    offset: ["start start", "end start"],
  });
  const cardLength = content.length;

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const cardsBreakpoints = content.map((_, index) => index / cardLength);
    const closestBreakpointIndex = cardsBreakpoints.reduce(
      (acc, breakpoint, index) => {
        const distance = Math.abs(latest - breakpoint);
        const accBreakpoint = cardsBreakpoints[acc];
        if (accBreakpoint !== undefined && distance < Math.abs(latest - accBreakpoint)) {
          return index;
        }
        return acc;
      },
      0
    );
    setActiveCard(closestBreakpointIndex);
  });

  const backgroundColors = [
    "var(--slate-900)",
    "var(--black)",
    "var(--neutral-900)",
  ];
  const linearGradients = [
    // "linear-gradient(to bottom right, var(--cyan-500), var(--emerald-500))",
    // "linear-gradient(to bottom right, var(--pink-500), var(--indigo-500))",
    // "linear-gradient(to bottom right, var(--orange-500), var(--yellow-500))",

    "",
  ];
  return (
    <motion.div
      className=" h-[35rem] mt-[12rem] overflow-y-auto flex justify-center relative  rounded-md hidebar "
      ref={ref}
    >
      <div className="div relative flex items-start px-4 w-full ">
        <div className="w-full ">
          {content.map((item, index) => (
            <div key={item.title + index} className="my-[16rem]">
              <motion.h2
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: activeCard === index ? 1 : 0.3,
                }}
                className="text-5xl  font-SchnyderS max-w-4xl font-bold"
              >
                {item.title}
              </motion.h2>
              <motion.p
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: activeCard === index ? 1 : 0.3,
                }}
                className="text-lg  max-w-xl mt-10 font-Satoshi"
              >
                {item.description}
              </motion.p>
            </div>
          ))}
          <div className="h-40" />
        </div>
      </div>
      <motion.div
        animate={{
          background: linearGradients[activeCard % linearGradients.length],
        }}
        className={cn(
          "hidden lg:block  max-w-4xl rounded-md bg-white sticky top-10 overflow-hidden",
          contentClassName
        )}
      >
        {content[activeCard]?.content ?? null}
      </motion.div>
    </motion.div>
  );
};
