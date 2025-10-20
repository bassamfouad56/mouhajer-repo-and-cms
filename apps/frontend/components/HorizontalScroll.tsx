import { PLACEHOLDER_IMAGE } from "@/lib/image-utils";
"use client";
import { motion, useTransform, useScroll } from "framer-motion";
import { useRef } from "react";

import Image from "next/image";
import Link from "next/link";

interface ExampleProps {
  projects: any;
}

interface CardProps {
  card: {
    slug: string;
    id: string;
    title?: { en: string; ar: string };
    images?: string[];
    location?: string;
    category?: string;
    acf: {
      main_image: string;
      location: string;
      title: string;
      value: string;
    };
  };
}
const Example = ({ projects }: ExampleProps) => {
  return (
    <div className="bg-neutral-800 hidden lg:block">
      <div className="flex h-48 items-center justify-center">
        <span className="font-semibold uppercase text-neutral-500">
          Scroll down
        </span>
      </div>
      <HorizontalScrollCarousel projects={projects} />
      <div className="flex h-48 items-center justify-center">
        <span className="font-semibold uppercase text-neutral-500">
          Scroll up
        </span>
      </div>
    </div>
  );
};

const HorizontalScrollCarousel = ({ projects }: ExampleProps) => {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  const x = useTransform(scrollYProgress, [0, 1], ["1%", "-100%"]);

  return (
    <section ref={targetRef} className="relative h-[300vh] ">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <motion.div style={{ x }} className="flex gap-4">
          {projects.map((card: any) => {
            return <Card card={card} key={card.slug + card.id} />;
          })}
        </motion.div>
      </div>
    </section>
  );
};

const Card = ({ card }: CardProps) => {
  return (
    <Link href={`/our-projects/${card.slug}`}>
      <div
        key={card.slug + card.id}
        className="group relative h-[32rem] w-[24rem] 2xl:h-[45rem] 2xl:w-[45rem] overflow-hidden bg-neutral-200 cursor-pointer"
      >
        <Image
          alt={card.title?.en || ''}
          className="group-hover:scale-[1.1] transition duration-1000 cursor-pointer absolute w-full h-full object-cover"
          src={card.images?.[0] || PLACEHOLDER_IMAGE}
          fill
        />

        <div className="absolute bg-black w-full h-full opacity-0 group-hover:opacity-60 transition duration-1000 "></div>
        <div className="absolute bottom-[-15%]  left-[50%] translate-x-[-50%] group-hover:bottom-[50%]  w-full duration-1000 ">
          <div className="flex justify-center items-center text-center translate-y-[50%]">
            <div className="max-w-xl mx-auto">
              <p className="font-Satoshi mb-6 text-white uppercase ">
                {card.location || 'Dubai'}
              </p>
              <p className="font-SchnyderS text-white uppercase text-4xl mb-12">
                {card.title?.en || 'Project'}
              </p>
              <p className="font-SchnyderS text-white uppercase ">
                {card.category || ''}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default Example;
