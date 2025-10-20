import BreadCrumbs from "@/components/BreadCrumbs";
import ContactForm from "@/components/ContactForm";
import ProjectInnerIntro from "@/components/projectInnerIntro";
import { cmsClient } from "@/lib/cms-client";
import React from "react";
import { Metadata } from "next";

type Props = {
  params: { locale: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const settings = await cmsClient.getSettings();
  const locale = params.locale as 'en' | 'ar';

  return {
    title: `Contact Us | ${settings.siteName[locale]}`,
    description: `Get in touch with ${settings.siteName[locale]} for luxury interior design services in Dubai`,
    keywords: [
      "contact Mouhajer",
      "interior design Dubai contact",
      "luxury design consultation",
      "Dubai interior designers",
    ],
    openGraph: {
      title: `Contact Us - ${settings.siteName[locale]}`,
      description: `Get in touch with ${settings.siteName[locale]}`,
      type: "website",
      locale: locale === 'ar' ? 'ar_AE' : 'en_US',
    },
  };
}

const page = async ({ params }: Props) => {
  const locale = params.locale as 'en' | 'ar';

  try {
    const settings = await cmsClient.getSettings();
    return (
      <div className=" pt-24 lg:pt-52 overflow-hidden">
        <div className="flex items-center justify-center">
          <BreadCrumbs />
        </div>
        <div className="relative  w-full lg:flex justify-center overflow-hidden py-4 lg:py-0">
          <ProjectInnerIntro
            second_small_image={settings.contactImages?.[0] || "/images/2024/03/333333.jpg"}
            big_image={settings.contactImages?.[1] || "/images/2024/03/333333.jpg"}
            third_small_image={settings.contactImages?.[2] || "/images/2024/03/333333.jpg"}
            title={locale === 'en' ? "Contact" : "اتصل بنا"}
            animatedTitle={{ rendered: locale === 'en' ? "CONTACT US" : "اتصل بنا" }}
            contactus
          />
          <div className="lg:absolute  bottom-[6rem] right-0  px-8 lg:px-20 2xl:px-40 w-screen lg:flex lg:justify- lg:translate-x-[4%] ">
            <div className="flex flex-col lg:items-end justify-between w-full text-[#202020] opacity-60 lg:flex-row">
              <div className="max-w-48 2xl:max-w-[100%] ">
                <p className="">PHONE: {settings.contactPhone || "+971 443 18426"}</p>
                <p className="mb-4">MOBILE: {settings.contactMobile || "+971 52 304 1482"}</p>
                <p>EMAIL: {settings.contactEmail?.toUpperCase() || "INFO@MOUHAJERDESIGN.COM"}</p>
              </div>
              <div className="2xl:max-w-xl">
                <p className="mb-4 font-bold text-black">
                  {locale === 'en' ? 'HEADQUARTERS OFFICE:' : 'المكتب الرئيسي:'}
                </p>
                <p className="max-w-xs pr-6">
                  {settings.addresses?.headquarters || "BURJ VISTA TOWER 1, LEVEL 2, MOHAMMED BIN RASHID BOULEVARD, DUBAI - UAE"}
                </p>
                <div className="max-w-xs">
                  <p className="mb-4">{locale === 'en' ? 'VIEW ON MAPS' : 'عرض على الخريطة'}</p>
                  <p className="font-bold text-black">
                    {locale === 'en' ? 'BUSINESS BAY OFFICE:' : 'مكتب الخليج التجاري:'}
                  </p>
                  <p>{settings.addresses?.businessBay || "OFFICE 1807, WESTBURRY TOWER 1, DUBAI - UAE"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <ContactForm />
      </div>
    );
  } catch (error) {
    console.error('Error loading contact page:', error);
    return (
      <div className=" pt-24 lg:pt-52 overflow-hidden">
        <div className="flex items-center justify-center">
          <BreadCrumbs />
        </div>
        <div className="text-center py-24">
          <h1 className="text-4xl font-SchnyderS mb-4">Contact Us</h1>
          <p className="text-gray-600">Unable to load contact information. Please try again later.</p>
        </div>
        <ContactForm />
      </div>
    );
  }
};

export default page;
