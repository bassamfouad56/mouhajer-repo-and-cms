import React from "react";
import { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import ProjectsNewCompAwwwards from "@/components/ProjectsNewCompAwwwards";
import { dataFetcher } from "@/lib/data-fetcher";
import { Project } from "@/lib/cms-types";

// ISR: Revalidate project listing every 30 minutes (1800 seconds)
export const revalidate = 1800;

type Props = {
  searchParams: Record<string, string | undefined>;
  params: { locale: string };
};

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const settings = await dataFetcher.getSettings();
  const locale = params.locale as 'en' | 'ar';

  return {
    title: `Our Projects | ${settings.siteName[locale]}`,
    description: settings.siteDescription[locale],
    keywords: [
      "interior design projects Dubai",
      "luxury design portfolio",
      "restaurant interior design",
      "hotel design Dubai",
      "residential interior design",
      "commercial interior design",
      "Mouhajer projects",
    ],
    openGraph: {
      title: `Our Projects - ${settings.siteName[locale]}`,
      description: settings.siteDescription[locale],
      type: "website",
      locale: locale === 'ar' ? 'ar_AE' : 'en_US',
    },
  };
}

const page = async ({ searchParams, params }: Props) => {
  try {
    // Fetch projects from CMS
    const projects: Project[] = await dataFetcher.getProjects();

    if (!projects || projects.length === 0) {
      return (
        <main className="pt-52 bg-[#202020] relative pb-12">
          <div className="container mx-auto px-4 text-center py-24">
            <h1 className="text-4xl lg:text-6xl font-SchnyderS font-light text-white mb-4">
              Our Projects
            </h1>
            <p className="text-white/60 text-lg">
              No projects available at the moment.
            </p>
          </div>
          <ContactForm />
        </main>
      );
    }

    return (
      <main className="pt-52 bg-[#202020] relative pb-12">
        <h1 className="sr-only">Our Luxury Interior Design Projects</h1>
        <ProjectsNewCompAwwwards
          projects={projects}
          searchParams={searchParams['search'] || ''}
          filteredParams={searchParams['filter'] || ''}
        />

        <ContactForm />
      </main>
    );
  } catch (error) {
    console.error("Error loading projects page:", error);
    return (
      <main className="pt-52 bg-[#202020] relative pb-12">
        <div className="container mx-auto px-4 text-center py-24">
          <h1 className="text-4xl lg:text-6xl font-SchnyderS font-light text-white mb-4">
            Our Projects
          </h1>
          <p className="text-white/60 text-lg mb-8">
            We&apos;re having trouble loading our projects. Please try again later.
          </p>
          <a
            href="/"
            className="inline-block px-8 py-3 bg-amber-500 text-white rounded-full hover:bg-amber-600 transition-colors"
          >
            Return Home
          </a>
        </div>
        <ContactForm />
      </main>
    );
  }
};

export default page;
