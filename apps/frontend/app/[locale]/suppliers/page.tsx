import AboutBanner from "@/components/AboutBanner";
import AboutDescription from "@/components/AboutDescription";
import AboutPageGAllery from "@/components/AboutPageGAllery";
import BenifitsSwiper from "@/components/BenifitsSwiper";
import ContactForm from "@/components/ContactForm";
import { cmsClient } from "@/lib/cms-client";
import React from "react";

type Props = {
  params: { locale: string };
};

const page = async ({ params }: Props) => {
  const locale = params.locale as 'en' | 'ar';

  // Fetch CMS page data for suppliers page
  let pageData;
  try {
    pageData = await cmsClient.getPageBySlug('suppliers', locale);
  } catch (error) {
    console.error('Error loading suppliers page:', error);
  }

  // Extract blocks from CMS
  const benefitsBlock = pageData?.blocks?.find((b: any) => b.type === 'benefits_swiper');
  const galleryBlock = pageData?.blocks?.find((b: any) => b.type === 'gallery_section');
  return (
    <div className="pt-52 overflow-hidden bg-[#FFFEF5] ">
      <AboutBanner title={"Are you a Supplier?"} />
      <AboutPageGAllery images={(galleryBlock?.data as any)?.images} />
      <AboutDescription
        title={"WORKING With MOUHAJER"}
        subtitle={
          "The learning experience is never ending! You will be working with a team of experienced engineers with more than 20 years of experience in multiple fields, all on the same mission of exchanging knowledge and adding value to the MID family. We believe in talent, creativity and art at Mouhajer International Design and Contracting, which is why, we unleash the unlimited imagination of our employees in an environment that does not limit skill and appreciate thinking outside the box. At MID, you learn, share, explore and grow!"
        }
      />
      <div className="xl:translate-y-[-10%]">
        <ContactForm supply />
        <BenifitsSwiper
          benefits={(benefitsBlock?.data as any)?.benefits}
          title={(benefitsBlock?.data as any)?.title}
        />
      </div>
      {/* <VacencyGrid /> */}
    </div>
  );
};

export default page;
