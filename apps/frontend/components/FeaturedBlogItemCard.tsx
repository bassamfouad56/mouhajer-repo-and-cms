"use client";

import Image from "next/image";
import PlusIcon from "./SVG/PlusIcon";
import Link from "next/link";
import { useLocale } from "next-intl";
import { BlogPost } from "@/lib/cms-types";

type Props = {
  blog: BlogPost;
};

const FeaturedBlogItemCard = ({ blog }: Props) => {
  const locale = useLocale() as 'en' | 'ar';
  
  // Get localized values
  const title = blog.title?.[locale] || blog.title?.en || 'Untitled';
  const excerpt = blog.excerpt?.[locale] || blog.excerpt?.en || '';
  const slug = blog.slug?.[locale] || blog.slug?.en || blog.id;
  const publishedDate = blog.publishedAt 
    ? new Date(blog.publishedAt).toLocaleDateString(locale === 'ar' ? 'ar-AE' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : null;

  return (
    <Link href={`/blogs/${slug}`}>
      <div className="text-black group ease-linear group cursor-view">
        <div className="w-full h-0.5 bg-black opacity-10 mb-5"></div>
        {publishedDate && (
          <div className="flex items-center justify-between mb-5">
            <p className="font-Satoshi text-sm">{publishedDate}</p>
            <div className="">
              <PlusIcon black small />
            </div>
          </div>
        )}
        {title && (
          <h4 className="font-SchnyderS text-3xl font-light max-w-lg">
            {title}
          </h4>
        )}
        {excerpt && (
          <div
            className={`my-5 overflow-hidden -mt-5 group-hover:mt-5 transition-all hover:delay-100`}
          >
            <div className="line-clamp-1 font-Satoshi text-sm group-hover:translate-y-[0] transition-all opacity-0 group-hover:opacity-100 duration-1000">
              <div
                dangerouslySetInnerHTML={{
                  __html: excerpt,
                }}
              />
            </div>
          </div>
        )}
        {blog.featuredImage && (
          <div className="h-[35rem] w-full relative">
            <Image
              src={blog.featuredImage}
              fill
              sizes="(min-width: 1024px) 50vw, 90vw"
              className="w-full h-full absolute object-cover"
              alt={title}
            />
          </div>
        )}
      </div>
    </Link>
  );
};

export default FeaturedBlogItemCard;
