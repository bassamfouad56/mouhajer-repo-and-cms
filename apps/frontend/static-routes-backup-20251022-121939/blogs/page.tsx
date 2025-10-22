import BlogList from "@/components/BlogList";
import BreadCrumbs from "@/components/BreadCrumbs";
import NewsPressFilter from "@/components/NewsPressFilter";
import SearchFilterComponeents from "@/components/SearchFilterComponeents";
import SearchInputField from "@/components/SearchInputField";
import { dataFetcher } from "@/lib/data-fetcher";
import { unstable_setRequestLocale } from 'next-intl/server';
import React from "react";
import { Metadata } from "next";

// ISR: Revalidate blog listing every 10 minutes (600 seconds)
export const revalidate = 600;

type Props = {
  params: { locale: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const settings = await dataFetcher.getSettings();
  const locale = params.locale as 'en' | 'ar';

  return {
    title: `Blogs | ${settings.siteName[locale]}`,
    description: settings.siteDescription[locale],
    keywords: [
      "interior design blog",
      "design inspiration",
      "luxury design trends",
      "Dubai interior design",
    ],
    openGraph: {
      title: `Blogs - ${settings.siteName[locale]}`,
      description: settings.siteDescription[locale],
      type: "website",
      locale: locale === 'ar' ? 'ar_AE' : 'en_US',
    },
  };
}

const page = async ({ params }: Props) => {
  const locale = params.locale as 'en' | 'ar';
  unstable_setRequestLocale(locale);
  try {
    const blogs = await dataFetcher.getBlogPosts();
    return (
      <div className="pt-24 lg:pt-52 bg-[#FFFEF5] pb-52 px-4 lg:px-0">
        <div className="flex justify-center flex-col items-center gap-12 mb-32">
          <BreadCrumbs />
          <h1 className="uppercase text-7xl font-SchnyderS">
            {locale === 'en' ? 'Blogs' : 'المدونات'}
          </h1>
        </div>
        <div className="mb-6">
          <NewsPressFilter />
        </div>
        <div className="max-w-[1280px] mx-auto flex flex-col lg:flex-row w-full justify-between gap-6 lg:gap-0">
          <SearchInputField />
          <SearchFilterComponeents />
        </div>
        <BlogList blogs={blogs} />
      </div>
    );
  } catch (error) {
    console.error('Error loading blogs page:', error);
    return (
      <div className="pt-24 lg:pt-52 bg-[#FFFEF5] pb-52 px-4 lg:px-0">
        <div className="flex justify-center flex-col items-center gap-12 mb-32">
          <h1 className="uppercase text-7xl font-SchnyderS">Blogs</h1>
          <p className="text-gray-600">Unable to load blogs at this time. Please try again later.</p>
        </div>
      </div>
    );
  }
};

export default page;
