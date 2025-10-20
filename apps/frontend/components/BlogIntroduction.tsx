"use client";
import React from "react";
import Image from "next/image";
import BlogCardTopAndDescription from "./BlogCardTopAndDescription";

type Props = {
  img: string;
  description: string;
  blog_content: {
    header: string;
    content: string;
  }[] | string; // Can be array or string from CMS
};

const BlogIntroduction = ({ img, description, blog_content }: Props) => {
  return (
    <div>
      <div className="py-5 text-[#202020]">
        <div className="flex flex-col justify-center items-center ">
          <div className="max-w-7xl space-y-8">
            <div className="flex items-center justify-center">
              <p>03/03/2023</p>
            </div>
            <div
              className="opacity-60 px-8 lg:px-0"
              dangerouslySetInnerHTML={{ __html: description }}
            />
          </div>
        </div>
      </div>
      <div className="container mx-auto">
        <div className="h-[53rem] w-full relative">
          <Image
            fill
            src={img}
            className=" h-full w-[full] lg:h-[42rem] object-cover"
            alt={""}
          />
        </div>
        <div className=" flex justify-center text-center py-4 ">
          <p className="opacity-60">
            Designed By Mouhajer International Design And Contracting
          </p>
        </div>
        <div className="space-y-12">
          {Array.isArray(blog_content) && blog_content?.map((el, i) => (
            <BlogCardTopAndDescription
              key={el.header + i}
              header={el.header}
              content={el.content}
            />
          ))}
          {typeof blog_content === 'string' && (
            <div className="opacity-60" dangerouslySetInnerHTML={{ __html: blog_content }} />
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogIntroduction;
