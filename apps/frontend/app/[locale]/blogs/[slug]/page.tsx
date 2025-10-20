import BlogIntroduction from '@/components/BlogIntroduction';
import BreadCrumbs from '@/components/BreadCrumbs';
import ProjectHeader from '@/components/ProjectHeader';
import CopyMAgnetURLSVG from '@/components/SVG/CopyMAgnetURLSVG';
import LinkedinSVG from '@/components/SVG/LinkedinSVG';
import TwitterSVG from '@/components/SVG/Twittersvg';
import SmallBanner from '@/components/SmallBanner';
import { dataFetcher } from '@/lib/data-fetcher';
import { cmsClient } from '@/lib/cms-client';
import { notFound } from 'next/navigation';
import { unstable_setRequestLocale } from 'next-intl/server';
import React from 'react';

// ISR: Revalidate blog detail page every 10 minutes (600 seconds)
export const revalidate = 600;

// Enable dynamic params (generate pages on-demand if not pre-rendered)
export const dynamicParams = true;

type Props = {
  params: {
    slug: string;
    locale: string;
  };
};

// Pre-generate top 20 most recent blog posts
export async function generateStaticParams() {
  try {
    const posts = await dataFetcher.getBlogPosts();
    const topPosts = posts.slice(0, 20);

    return topPosts.flatMap((post) => [
      { slug: post.slug.en, locale: 'en' },
      { slug: post.slug.ar, locale: 'ar' },
    ]);
  } catch (error) {
    console.error('Error generating static params for blog posts:', error);
    return [];
  }
}

const page = async (props: Props) => {
  const locale = (props.params.locale as 'en' | 'ar') || 'en';
  unstable_setRequestLocale(locale);
  const blogPost = await cmsClient.getBlogPostBySlug(props.params.slug, locale);

  if (!blogPost) {
    notFound();
  }

  // Map CMS data to legacy ACF-like structure for components
  const acf = {
    main_image: blogPost.featuredImage || '',
    ellaborative_image: blogPost.featuredImage || '', // Fallback to featured image
    elaborative_text: blogPost.excerpt[locale] || '',
    blog_content: blogPost.content[locale] || '',
  };

  const title = blogPost.title[locale] || blogPost.title.en;

  return (
    <div className="bg-[#FFFEF5] overflow-hidden px-4 lg:px-0">
      <div className="pt-24 lg:pt-52">
        <div className="w-full justify-center flex mb-24 items-center text-center lg:text-start">
          <BreadCrumbs />
        </div>
        <div className="2xl:px-[40px]">
          <div className="2xl:pb-20">
            {title && (
              <ProjectHeader type="" title={title} location="Dubai" />
            )}
          </div>
          <SmallBanner img={acf.main_image} />
        </div>
        <BlogIntroduction
          img={acf.ellaborative_image}
          description={acf.elaborative_text}
          blog_content={acf.blog_content}
        />
        <div className="container mx-auto pt-24 pb-20 space-y-6">
          <div className="w-full h-0.5 bg-black opacity-15 "></div>
          <div className="flex items-center gap-4 justify-center">
            <TwitterSVG />
            <LinkedinSVG />
            <CopyMAgnetURLSVG />
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
