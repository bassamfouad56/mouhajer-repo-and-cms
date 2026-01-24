import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { LogoMarquee } from "@/components/logo-marquee";
import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import EnhancedProjectsPageContent from "../../enhanced-projects-page-content";
import { getLocalizedValue } from "@/lib/error-handling";

export const revalidate = 3600;

interface PageProps {
  params: Promise<{
    locale: string;
    location: string;
  }>;
}

// Query to get location by slug
const locationBySlugQuery = groq`
  *[_type == "location" && slug.current == $slug][0] {
    _id,
    name,
    slug,
    type,
    description,
    mainImage,
    seo,
    "parent": parent->{
      _id,
      name,
      slug
    }
  }
`;

// Query to get projects filtered by location
const projectsByLocationQuery = groq`
  *[_type == "project" && references(*[_type == "location" && slug.current == $locationSlug]._id)] | order(year desc) {
    _id,
    title,
    slug,
    excerpt,
    mainImage,
    year,
    area,
    status,
    featured,
    "sector": sector->{
      _id,
      title,
      slug
    },
    "projectType": projectType->{
      _id,
      title,
      slug
    },
    "location": location->{
      _id,
      name,
      slug,
      type
    },
    "services": services[]->{
      _id,
      title,
      slug
    }
  }
`;

// Query to get all locations for navigation
const locationsQuery = groq`
  *[_type == "location" && type in ["city", "country"] && featured == true] | order(order asc) {
    _id,
    name,
    slug,
    type,
    mainImage
  }
`;

// Query to get industries for filters
const industriesQuery = groq`
  *[_type == "industry"] | order(order asc) {
    _id,
    title,
    slug,
    mainImage
  }
`;

async function getLocation(slug: string) {
  try {
    const location = await client.fetch(locationBySlugQuery, { slug });
    return location;
  } catch (error) {
    console.error("Error fetching location:", error);
    return null;
  }
}

async function getProjectsByLocation(locationSlug: string) {
  try {
    const projects = await client.fetch(projectsByLocationQuery, {
      locationSlug,
    });
    return projects || [];
  } catch (error) {
    console.error("Error fetching projects by location:", error);
    return [];
  }
}

async function getLocations() {
  try {
    const locations = await client.fetch(locationsQuery);
    return locations || [];
  } catch (error) {
    console.error("Error fetching locations:", error);
    return [];
  }
}

async function getIndustries() {
  try {
    const industries = await client.fetch(industriesQuery);
    return industries || [];
  } catch (error) {
    console.error("Error fetching industries:", error);
    return [];
  }
}

// Generate static params for all locations
export async function generateStaticParams() {
  try {
    const locations = await client.fetch(groq`
      *[_type == "location" && defined(slug.current)] {
        "location": slug.current
      }
    `);
    return locations || [];
  } catch {
    return [];
  }
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale, location } = await params;
  const locationData = await getLocation(location);

  if (!locationData) {
    return {
      title: "Projects | MIDC",
    };
  }

  const name = getLocalizedValue(locationData.name, locale, location);
  const description = getLocalizedValue(locationData.description, locale, "");
  const seoTitle =
    getLocalizedValue(locationData.seo?.metaTitle, locale) ||
    `Interior Design Projects in ${name} | MIDC`;
  const seoDescription =
    getLocalizedValue(locationData.seo?.metaDescription, locale) ||
    `Explore our luxury interior design, fit-out, and construction projects in ${name}. Award-winning commercial and residential projects.`;

  return {
    title: seoTitle,
    description: seoDescription,
    openGraph: {
      title: seoTitle,
      description: seoDescription,
    },
    alternates: {
      canonical: `/${locale}/projects/location/${location}`,
    },
  };
}

export default async function LocationProjectsPage({ params }: PageProps) {
  const { locale, location } = await params;
  const locationData = await getLocation(location);

  if (!locationData) {
    notFound();
  }

  const [projects, locations, industries] = await Promise.all([
    getProjectsByLocation(location),
    getLocations(),
    getIndustries(),
  ]);

  const locationName = getLocalizedValue(locationData.name, locale, location);

  // Transform projects to match the expected format
  const transformedProjects = projects.map((project: any) => ({
    id: project._id,
    databaseId: 0,
    title: getLocalizedValue(project.title, locale, "Project"),
    slug: project.slug?.current,
    excerpt: getLocalizedValue(project.excerpt, locale, ""),
    date: project.publishedAt,
    featuredImage: {
      node: {
        sourceUrl: project.mainImage
          ? `/api/sanity/image/${project.mainImage.asset._ref}`
          : "",
        altText:
          getLocalizedValue(project.mainImage?.alt, locale) ||
          getLocalizedValue(project.title, locale, ""),
      },
    },
    acfFields: {
      location: getLocalizedValue(project.location?.name, locale, locationName),
      projectType:
        getLocalizedValue(project.projectType?.title, locale) ||
        getLocalizedValue(project.sector?.title, locale, ""),
      yearCompleted: project.year ? String(project.year) : "",
      area: project.area ? String(project.area) : "",
    },
    _sanityData: project,
  }));

  return (
    <>
      <Header />
      <div className="bg-neutral-950 pt-32 pb-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          {/* Breadcrumb */}
          <nav className="mb-8 flex items-center gap-2 text-sm">
            <a
              href={`/${locale}/projects`}
              className="text-white/50 hover:text-white transition-colors"
            >
              Projects
            </a>
            <span className="text-white/30">/</span>
            <span className="text-white/50">Location</span>
            <span className="text-white/30">/</span>
            <span className="text-[#8f7852]">{locationName}</span>
          </nav>

          {/* Page Header */}
          <h1 className="font-SchnyderS text-5xl font-light text-white lg:text-7xl">
            Projects in <span className="text-[#8f7852]">{locationName}</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg font-light text-white/70">
            {getLocalizedValue(
              locationData.description,
              locale,
              `Explore our interior design and fit-out projects in ${locationName}.`,
            )}
          </p>

          {/* Location Navigation */}
          <div className="mt-10 flex flex-wrap gap-3">
            <a
              href={`/${locale}/projects`}
              className="rounded-full border border-white/20 bg-white/5 px-5 py-2 text-sm font-light text-white/70 transition-all hover:border-[#8f7852]/50 hover:bg-[#8f7852]/10 hover:text-white"
            >
              All Locations
            </a>
            {locations.map((loc: any) => (
              <a
                key={loc._id}
                href={`/${locale}/projects/location/${loc.slug?.current}`}
                className={`rounded-full border px-5 py-2 text-sm font-light transition-all ${
                  loc.slug?.current === location
                    ? "border-[#8f7852] bg-[#8f7852] text-neutral-950"
                    : "border-white/20 bg-white/5 text-white/70 hover:border-[#8f7852]/50 hover:bg-[#8f7852]/10 hover:text-white"
                }`}
              >
                {getLocalizedValue(loc.name, locale, "")}
              </a>
            ))}
          </div>
        </div>
      </div>

      <EnhancedProjectsPageContent
        projects={transformedProjects}
        industries={industries}
        locale={locale}
        hideFilters={true}
      />
      <LogoMarquee />
      <Footer />
    </>
  );
}
