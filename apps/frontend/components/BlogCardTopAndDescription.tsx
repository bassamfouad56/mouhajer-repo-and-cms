import { MISC_IMAGES } from "@/lib/cms-images";
import React from "react";
import Image from "next/image";

type Props = {
  header: string;
  content: string;
  quoteIcon?: string;
};

const BlogCardTopAndDescription = ({ header, content, quoteIcon }: Props) => {
  const quoteImage = quoteIcon || MISC_IMAGES.quotes;

  return (
    <div className="max-w-5xl">
      <div className="h-14 w-1/4 2xl:h-24 2xl:w-24 relative">
        <Image
          src={quoteImage}
          alt="Quote icon"
          fill
          className="absolute w-full h-full object-contain"
        />
      </div>
      <h4 className="font-SchnyderS text-2xl mb-12">{header}</h4>
      <div className="font-Satoshi opacity-60">
        <p>{content}</p>
      </div>
    </div>
  );
};

export default BlogCardTopAndDescription;
