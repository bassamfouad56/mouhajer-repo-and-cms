import HeroBanner from "@/components/HeroBanner";
import React from "react";
import AboutDescription from "@/components/AboutDescription";

import ContactForm from "@/components/ContactForm";
import NumberWithAccordian from "@/components/NumberWithAccordian";
import HowWeWork from "@/components/HowWeWork";
import FeaturedBlogsHomepage from "@/components/FeaturedBlogsHomepage";
import { ProjectsResData } from "@/components/json/ProjectsResData";
import { serviceResData } from "@/components/json/ServicesRes";

type Props = {
  params: { service: string; slug: string };
};

const page = async (props: Props) => {
  try {
    const fetchProjectData = async (slug: string) => {
      // Make the GET request
      const response = serviceResData.find(
        (el) => el.slug.toLocaleLowerCase() === slug.toLocaleLowerCase()
      );
      // The data is in response.data
      const projectData = response;

      // Do something with the data

      return projectData;
    };
    const removeSpecialCharacters = (
      text: string | undefined
    ): string | undefined => {
      if (text) {
        return text.replace(/-/g, " ").replace(/\//g, "");
      }
    };

    const services = await fetchProjectData(props.params.slug);
    const data = services?.acf?.services_array;
    const service = data?.find(
      (service: { title?: string | null }) =>
        service.title?.toLocaleLowerCase() ===
          removeSpecialCharacters(props.params.service.toLocaleLowerCase()) &&
        service
    );

    const projects = await ProjectsResData;
    return (
      <div className="bg-[#FFFEF5] overflow-hidden ">
        {service?.title && service?.banner && (
          <HeroBanner
            HomeBannerIamge={service.banner}
            maskLayer
            title={service.title}
            showBreadCrumbs
            title_arabic={service.title_arabic}
          />
        )}
        {service?.about && service.description && (
          <div className="pt-5 2xl:pt-[10rem]">
            <AboutDescription
              button="READY TO BE INSPIRED?"
              title={service.about}
              subtitle={service.description}
              about_arabic={service.about_arabic}
              description_arabic={service.description_arabic}
            />
          </div>
        )}
        {!!service?.keys?.length && <NumberWithAccordian arr={service.keys} />}
        {!!service?.how_we_work?.length && (
          <HowWeWork
            arr={service?.how_we_work}
            small_image={service.small_image}
            big_image={service.big_image.url}
          />
        )}
        {!!projects?.length && (
          <FeaturedBlogsHomepage title="PROJECTS" blogs={projects as any} service />
        )}
        <ContactForm />
      </div>
    );
  } catch (error) {}
};

export default page;
