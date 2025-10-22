import React, { useRef } from "react";
import { useScroll, motion, useTransform } from "framer-motion";
import { PlusIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useLocale } from "next-intl";
import { BlogPost } from "@/lib/cms-types";

type Props = {
  blog: BlogPost;
  i: number;
};

const BlogCard = ({ blog, i }: Props) => {
  const locale = useLocale() as 'en' | 'ar';
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
  });
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale === 'ar' ? 'ar-AE' : 'en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const opacityStyle = useTransform(scrollYProgress, [0, 1], [1, 0.5]);
  const transformStyle = useTransform(scrollYProgress, [0, 1], ["0%", "20px"]);
  
  // Get localized values
  const title = blog.title?.[locale] || blog.title?.en || 'Untitled';
  const slug = blog.slug?.[locale] || blog.slug?.en || blog.id;
  const displayDate = blog.publishedAt || blog.createdAt;
  
  return (
    <Link href={`blogs/${slug}`}>
      <motion.div
        key={blog.id}
        className={` cursor-pointer ${i % 2 !== 0 && "lg:mt-24"}`}
        ref={ref}
        style={{ opacity: opacityStyle, translateY: transformStyle }}
      >
        <div className="w-full h-0.5 bg-black opacity-20 mb-4"></div>
        <div className="flex items-center justify-between mb-6">
          <p>{formatDate(displayDate)}</p>
          <PlusIcon />
        </div>
        <p className="text-3xl font-SchnyderS max-w-lg mb-8">{title}</p>
        {blog.featuredImage && (
          <div
            className={`relative ${
              i % 2 !== 0 ? "h-[32rem] lg:h-[50rem]" : "h-[32rem]"
            } w-full`}
          >
            <Image
              className="absolute w-full h-full object-cover"
              alt={title}
              fill
              sizes="(min-width: 1024px) 50vw, 90vw"
              src={blog.featuredImage}
            />
          </div>
        )}
      </motion.div>
    </Link>
  );
};

export default BlogCard;
