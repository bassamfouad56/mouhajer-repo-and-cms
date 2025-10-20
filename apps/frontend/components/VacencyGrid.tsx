"use client";
import React, { useEffect, useRef } from "react";
import StarSVG from "./SVG/StarSVG";
import { PlusIcon } from "lucide-react";
import { useInView, motion, useAnimation } from "framer-motion";

type Props = {};

const VacencyGrid = (props: Props) => {
  const ref = useRef(null);
  const isInView = useInView(ref);
  const arr = [
    {
      id: 0,
      title: "Senior Information Technology Specialist",
      description:
        "Install and configure network servers, work directly with the organization's servers and network, performing setup, enhancement, and maintenance tasks.",
      date: "2024-03-30",
    },
    {
      id: 1,
      title: "Content Writer",
      description:
        "Responsible for creating and editing content for various platforms.",
      date: "2024-03-31",
    },
    {
      id: 2,
      title: "Marketing Executive",
      description:
        "Develop and implement marketing strategies to promote products or services.",
      date: "2024-04-01",
    },
    {
      id: 3,
      title: "SEO Specialist",
      description:
        "Optimize website content and improve search engine rankings.",
      date: "2024-04-02",
    },
  ];
  const mainControls = useAnimation();
  useEffect(() => {
    if (isInView) {
      mainControls.start("visble");
    }
  }, [isInView]);
  return (
    <div>
      <div className="px-4 2xl:px-40 py-24">
        <div className="flex justify-between items-center mb-32 flex-col  lg:flex-row">
          <h1 className="text-6xl font-SchnyderS uppercase">VACANCIES</h1>
          <div className="flex items-center gap-4 group">
            <div className=" group-hover:rotate-[180deg] transition duration-1000">
              <StarSVG />
            </div>
            <p className="uppercase">SEE ALL VACANCIES</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-16">
          {arr.map((el, i) => (
            <motion.div
              ref={ref}
              key={el.title + i}
              variants={{
                hidden: { opacity: 0, y: 75 },
                visble: { opacity: 1, y: 0 },
              }}
              initial="hidden"
              animate={mainControls}
              transition={{ duration: 1, delay: i * 1.1, ease: "easeInOut" }}
            >
              <Card {...el} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VacencyGrid;

interface CardProps {
  id: number;
  title: string;
  description: string;
  date: string;
}
const Card = ({ id, title, description, date }: CardProps) => {
  return (
    <div className="bg-[#F2F1E5] h-[22rem] shadow-md font-Satoshi group text-black hover:text-white transition cursor-pointer duration-1000 hover:bg-[#202020]">
      <div className="p-8 h-full">
        <div className="flex flex-col justify-between h-full">
          <div className=" flex items-center justify-between">
            <p className="text-sm">{date}</p>
            <PlusIcon />
          </div>
          <div className="mt-auto h-full   flex flex-col  justify-end">
            <p className="uppercase font-SchnyderS text-xl mb-4 line-clamp-1">
              {title}
            </p>
            <p className="text-sm line-clamp-1">{description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
