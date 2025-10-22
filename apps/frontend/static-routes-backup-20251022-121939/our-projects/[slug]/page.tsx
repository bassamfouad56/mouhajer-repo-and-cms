import AboutDescription from "@/components/AboutDescription";
import AccordionSwiper from "@/components/AccordionSwiper";
import BreadCrumbs from "@/components/BreadCrumbs";
import ContactForm from "@/components/ContactForm";
import KeyFacts from "@/components/KeyFacts";
import NextStudyCase from "@/components/NextStudyCase";
import ProductCardWithQuotation from "@/components/ProductCardWithQuotation";
import ProjectGalleryCarousel from "@/components/ProjectGalleryCarousel";
import ProjectHeader from "@/components/ProjectHeader";
import SmallBanner from "@/components/SmallBanner";
import { ProjectsResData } from "@/components/json/ProjectsResData";
import ProjectInnerIntro from "@/components/projectInnerIntro";
import { dataFetcher } from "@/lib/data-fetcher";
import { cmsClient } from "@/lib/cms-client";
import { Metadata } from "next";
import React from "react";

// ISR: Revalidate project detail page every 30 minutes (1800 seconds)
// Note: Currently using hardcoded ProjectsResData - CMS migration pending
export const revalidate = 1800;

type Props = {
  params: {
    slug: string;
  };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const projects = await dataFetcher.getProjects();
    const project = projects.find(p => p.id === params.slug);
    
    if (!project) {
      return { title: "Project Not Found | Mouhajer" };
    }

    return {
      title: `${project.title.en} | Mouhajer Interior Design`,
      description: project.description.en,
      keywords: ["luxury interior design", "Dubai", project.category],
      openGraph: {
        title: project.title.en,
        description: project.description.en,
        type: "website",
        images: project.images.slice(0, 1),
      },
    };
  } catch (error) {
    return { title: "Project | Mouhajer" };
  }
}

const page = async (props: Props) => {
  try {
    // Try to get project from CMS first
    let project: any = null;
    let useCMS = false;
    
    try {
      const cmsProject = await cmsClient.getProject(props.params.slug);
      if (cmsProject) {
        project = cmsProject;
        useCMS = true;
      }
    } catch (error) {
      console.warn('CMS project not found, using hardcoded data:', error);
    }
    
    // Fallback to hardcoded data
    if (!project) {
      project = ProjectsResData?.find(
        (el) => el.slug.toLocaleLowerCase() === props.params.slug.toLocaleLowerCase()
      );
    }
    const { acf } = project as any;
    const projects = ProjectsResData;
    const filteredProjects = projects?.filter(
      (el: any) => el.acf.title !== acf.title && el
    );
    const mappedProject = filteredProjects?.map(
      (el: any, i: number) => filteredProjects[i + 1]
    );
    const bannerNavigation = mappedProject?.[0]?.acf;
    if (!project) {
      return (
        <main className="bg-[#FFFEF5] overflow-hidden min-h-screen">
          <div className="lg:pt-52 pt-32">
            <div className="container mx-auto px-4 text-center py-24">
              <h1 className="text-4xl lg:text-6xl font-SchnyderS font-light text-gray-900 mb-4">
                Project Not Found
              </h1>
              <p className="text-gray-600 text-lg mb-8">
                We couldn&apos;t find the project you&apos;re looking for.
              </p>
              <a
                href="/our-projects"
                className="inline-block px-8 py-3 bg-amber-500 text-white rounded-full hover:bg-amber-600 transition-colors"
              >
                View All Projects
              </a>
            </div>
          </div>
        </main>
      );
    }

    return (
      <main className="bg-[#FFFEF5] overflow-hidden">
        <div className="lg:pt-52">
          <div className="w-full justify-center flex mb-24">
            <BreadCrumbs />
          </div>
          <div className="2xl:px-[40px]">
            <div className="2xl:pb-20">
              <ProjectHeader
                title={acf.title}
                type={acf.type.value}
                location={acf.location}
                titleArabic={acf.title_arabic}
              />
            </div>
            <SmallBanner img={acf.main_image} />
          </div>
          <div className="z-[0]">
            {project?.title && (
              <ProjectInnerIntro
                second_title_arabic={acf.second_title_arabic}
                second_small_image={acf.second_small_image.url}
                title={acf.second_title}
                animatedTitle={project.title}
                animatedTitleArabic={acf.title_arabic}
                big_image={acf.big_image}
                third_small_image={acf.third_small_image}
              />
            )}
          </div>
          <div className="bg-[#FFFEF5] z-[2] relative  mx-auto">
            <AboutDescription
              title={acf.descriptive_title_left}
              subtitle={acf.description_right}
              about_arabic={acf.about_arabic}
              description_arabic={acf.description_arabic}
            />
          </div>
          <ProductCardWithQuotation
            quote_title={acf.quote_title}
            big_image_quote={acf.big_image_quote}
            small_image_quote={acf.small_image_quote.url}
            quote_bottmo_description={acf.quote_bottmo_description}
            quote_title_arabic={acf.quote_title_arabic}
            quote_bottmo_description_arabic={
              acf.quote_bottmo_description_arabic
            }
          />
          <KeyFacts
            facts={acf.key_facts}
            title={acf.key_facts_title}
          />
          <ProjectGalleryCarousel arr={acf.projects_gallery} />
          <AccordionSwiper
            items={acf.services_provided}
            backgroundImage={acf.accordion_background_image}
            sectionTitle={acf.services_section_title}
          />
          <ContactForm />
          {mappedProject?.[0] && (
            <NextStudyCase project={mappedProject[0] as any} slug={mappedProject[0].slug} />
          )}
        </div>
      </main>
    );
  } catch (error) {
    console.error("Error loading project:", error);
    return (
      <main className="bg-[#FFFEF5] overflow-hidden min-h-screen">
        <div className="lg:pt-52 pt-32">
          <div className="container mx-auto px-4 text-center py-24">
            <h1 className="text-4xl lg:text-6xl font-SchnyderS font-light text-gray-900 mb-4">
              Error Loading Project
            </h1>
            <p className="text-gray-600 text-lg mb-8">
              We encountered an error while loading this project. Please try again later.
            </p>
            <a
              href="/our-projects"
              className="inline-block px-8 py-3 bg-amber-500 text-white rounded-full hover:bg-amber-600 transition-colors"
            >
              View All Projects
            </a>
          </div>
        </div>
      </main>
    );
  }
};

export default page;
