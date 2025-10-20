import React from "react";
import AboutBanner from "./AboutBanner";
import Image from "next/image";

interface GalleryImage {
  id: string | number;
  title: string;
  location: string;
  projectType?: string;
  url: string;
  link?: string;
  alt?: string;
}

type Props = {
  images?: GalleryImage[];
};

const ProjectGallery = ({ images = [] }: Props) => {
  const cards = images;

  return (
    <div className="2xl:hidden mb-12">
      <div className="text-white uppercase">
        <AboutBanner />
        <div className="px-6">
          <div className="grid gap-10">
            {cards?.map((card, i) => {
              return (
                <div key={card.title + i} className="">
                  <div className="h-[16rem] w-full relative mb-4">
                    <Image
                      className="top-0 absolute w-full h-full object-cover"
                      alt={card.alt || card.title}
                      fill
                      src={card.url}
                    />
                  </div>
                  <div className="max-w-xs uppercase">
                    <p className="text-lg mb-4">{card.location}</p>
                    <p className="text-2xl font-SchnyderS">{card.title}</p>
                    <p className="text-sm ">{card.location}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectGallery;
