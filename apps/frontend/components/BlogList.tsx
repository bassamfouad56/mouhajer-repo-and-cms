"use client";
import React from "react";

import BlogCard from "./BlogCard";
import { BlogPost } from "@/lib/cms-types";

type Props = {
  blogs: BlogPost[];
};

const BlogList = ({ blogs }: Props) => {
  return (
    <div>
      <div className="lg:py-[12rem]  overflow-y-auto mt-32">
        <div className="max-w-[1928px] mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-x-96">
            {blogs?.map((blog, i: number) => (
              <BlogCard
                i={i}
                blog={blog}
                key={blog.id}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogList;
