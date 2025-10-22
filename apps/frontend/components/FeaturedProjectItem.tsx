"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";
import { useLocale } from "next-intl";
import { Project } from "@/lib/cms-types";
import { PLACEHOLDER_IMAGE } from "@/lib/image-utils";

type Props = {
  project: Project;
  slug?: string;
};

const FeaturedProjectItem = ({ project, slug }: Props) => {
  const locale = useLocale() as 'en' | 'ar';
  const title = project.title[locale];
  const mainImage = project.images?.[0] || PLACEHOLDER_IMAGE;
  const location = project.location || '';
  const projectSlug = slug || project.id;
  return (
    <Link href={`/our-projects/${projectSlug}`}>
      <div className="text-black group ease-linear group cursor-view">
        <div className="w-full h-0.5 bg-black opacity-10 mb-5"></div>

        {mainImage && (
          <div className="h-[35rem] w-full relative mb-4">
            <Image
              src={mainImage}
              fill
              sizes="(min-width: 1024px) 33vw, 90vw"
              className="w-full h-full absolute object-cover"
              alt={title || "Project"}
            />
          </div>
        )}
        {title && (
          <div className="flex flex-col">
            <div className="flex items-center justify-between ">
              <h4 className="font-SchnyderS text-xl font-light max-w-lg">
                {title}
              </h4>
              <Plus className="w-10 h-10 stroke-1 opacity-60" />
            </div>
            <p className="font-Satoshi text-sm opacity-60">{location}</p>
          </div>
        )}
      </div>
    </Link>
  );
};

export default FeaturedProjectItem;
