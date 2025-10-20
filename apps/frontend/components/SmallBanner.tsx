import Image from "next/image";
import React from "react";
type Props = {
  img: any;
  alt?: string;
};

const SmallBanner = ({ img, alt }: Props) => {
  return (
    <div className="w-full  relative pt-[40.5384615%]">
      <Image
        className="absolute top-0 w-full h-full object-cover"
        src={img}
        fill
        alt={alt || "Luxury interior design project showcase"}
        loading="lazy"
        sizes="100vw"
      />
    </div>
  );
};

export default SmallBanner;
