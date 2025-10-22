import AboutBanner from "@/components/AboutBanner";
import WhatWeDoAboutPage from "@/components/WhatWeDoAboutPage";
import { dataFetcher } from "@/lib/data-fetcher";
import React from "react";
import { Metadata } from "next";

// ISR: Revalidate service listing every 30 minutes (1800 seconds)
export const revalidate = 1800;

type Props = {
  params: { locale: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const settings = await dataFetcher.getSettings();
  const locale = params.locale as 'en' | 'ar';

  return {
    title: `Services | ${settings.siteName[locale]}`,
    description: settings.siteDescription[locale],
    keywords: [
      "interior design services Dubai",
      "luxury design services",
      "residential interior design",
      "commercial interior design",
      "hospitality design",
    ],
    openGraph: {
      title: `Services - ${settings.siteName[locale]}`,
      description: settings.siteDescription[locale],
      type: "website",
      locale: locale === 'ar' ? 'ar_AE' : 'en_US',
    },
  };
}

const page = async ({ params }: Props) => {
  try {
    const services = await dataFetcher.getServices();
    const locale = params.locale as 'en' | 'ar';
    return (
      <div className="pt-24 lg:pt-52 bg-[#fffef5]">
        <AboutBanner hideScroll />
        {!!services?.length && <WhatWeDoAboutPage hideTitle arr={services} />}
      </div>
    );
  } catch (error) {
    console.error('Error loading services page:', error);
    return (
      <div className="pt-24 lg:pt-52 bg-[#fffef5] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-SchnyderS mb-4">Services</h1>
          <p className="text-gray-600">Unable to load services at this time. Please try again later.</p>
        </div>
      </div>
    );
  }
};

export default page;
