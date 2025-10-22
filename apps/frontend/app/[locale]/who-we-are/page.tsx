import WhoWeAreComps from "@/components/WhoWeAreComps";
import { cmsClient } from "@/lib/cms-client";
import { Metadata } from "next";

type Props = {
  params: { locale: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const settings = await cmsClient.getSettings();
  const locale = params.locale as 'en' | 'ar';

  return {
    title: `Who We Are | ${settings.siteName[locale]}`,
    description: settings.siteDescription[locale],
    keywords: [
      "about Mouhajer",
      "interior design company Dubai",
      "luxury design firm",
      "award-winning interior designers",
      "Dubai interior design history",
    ],
    openGraph: {
      title: `Who We Are - ${settings.siteName[locale]}`,
      description: settings.siteDescription[locale],
      type: "website",
      locale: locale === 'ar' ? 'ar_AE' : 'en_US',
    },
  };
}

const page = async ({ params }: Props) => {
  const locale = params.locale as 'en' | 'ar';

  try {
    const aboutPage = await cmsClient.getPageBySlug('who-we-are', locale);

    return <WhoWeAreComps locale={locale} pageData={aboutPage} />;
  } catch (error) {
    console.error('Error loading who-we-are page:', error);
    return <WhoWeAreComps locale={locale} />;
  }
};

export default page;
