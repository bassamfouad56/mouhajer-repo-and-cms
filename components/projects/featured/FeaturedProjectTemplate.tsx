"use client";

import { useRef } from "react";
import { motion, useScroll } from "framer-motion";

// Section imports - organized by template structure
import { CinematicHero } from "./sections/CinematicHero";
import { OverviewSection } from "./sections/OverviewSection";
import { ChallengeSection } from "./sections/ChallengeSection";
import { DesignApproachSection } from "./sections/DesignApproachSection";
import { ScopeJourney } from "./sections/ScopeJourney";
import { OutcomeSection } from "./sections/OutcomeSection";
import { ProjectInfoGrid } from "./sections/ProjectInfoGrid";
import { OutcomeResultsSection } from "./sections/OutcomeResultsSection";
import { AssetsRequestSection } from "./sections/AssetsRequestSection";
import { FeaturedNavigation } from "./sections/FeaturedNavigation";

// Optional enhanced sections
import { ImmersiveGallery } from "./sections/ImmersiveGallery";

// Types for the featured project data
export interface FeaturedProjectData {
  id: string;
  title: { en?: string; ar?: string };
  slug: string;
  excerpt: { en?: string; ar?: string };
  mainImage: string | null;
  videoUrl?: string;
  gallery: GalleryImage[];
  year?: number;
  area?: number;
  status?: string;
  client?: { en?: string; ar?: string };
  duration?: {
    startDate?: string;
    endDate?: string;
    months?: number;
  };
  budget?: {
    amount?: number;
    currency?: string;
    range?: string;
  };
  units?: {
    count?: number;
    label?: string;
  };
  challenge?: { en?: string; ar?: string };
  approach?: { en?: string; ar?: string };
  scope?: Array<{
    title?: { en?: string; ar?: string };
    description?: { en?: string; ar?: string };
  }>;
  outcome?: { en?: string; ar?: string };
  testimonial?: {
    quote?: { en?: string; ar?: string };
    author?: string;
    role?: string;
  };
  featuredContent?: {
    heroVideo?: string;
    visionStatement?: { en?: string; ar?: string };
    highlightStats?: Array<{
      value?: string;
      label?: { en?: string; ar?: string };
      suffix?: string;
    }>;
    transformationTitle?: { en?: string; ar?: string };
    assetLinks?: Array<{
      type: "images" | "video" | "document" | "folder";
      label: string;
      url?: string;
    }>;
  };
  sector?: {
    title?: { en?: string; ar?: string };
    slug?: string;
  };
  projectType?: {
    title?: { en?: string; ar?: string };
    slug?: string;
  };
  location?: {
    name?: { en?: string; ar?: string };
    slug?: string;
  };
  services?: Array<{
    title?: { en?: string; ar?: string };
    slug?: string | { current?: string };
  }>;
  tags?: Array<{
    name?: { en?: string; ar?: string };
    slug?: string;
    category?: string;
  }>;
  relatedFeaturedProjects?: Array<{
    id: string;
    title?: { en?: string; ar?: string };
    slug?: string;
    mainImage?: string;
  }>;
  allFeaturedProjects?: Array<{
    id: string;
    slug?: string;
    title?: { en?: string; ar?: string };
    mainImage?: string;
  }>;
}

export interface GalleryImage {
  url: string;
  alt?: string;
  caption?: string;
  category?:
    | "exterior"
    | "interior"
    | "detail"
    | "before"
    | "after"
    | "process";
}

interface FeaturedProjectTemplateProps {
  project: FeaturedProjectData;
  locale: string;
}

export function FeaturedProjectTemplate({
  project,
  locale,
}: FeaturedProjectTemplateProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Helper to get localized text
  const t = (obj: { en?: string; ar?: string } | undefined, fallback = "") => {
    if (!obj) return fallback;
    return locale === "ar" ? obj.ar || obj.en || fallback : obj.en || fallback;
  };

  // Categorize gallery images
  const beforeImages = project.gallery.filter(
    (img) => img.category === "before"
  );
  const afterImages = project.gallery.filter((img) => img.category === "after");
  const processImages = project.gallery.filter(
    (img) => img.category === "process"
  );
  const showcaseImages = project.gallery.filter(
    (img) =>
      img.category !== "before" &&
      img.category !== "after" &&
      img.category !== "process"
  );

  // Distribute images across sections for visual richness
  // Challenge section: 1 background + 3 floating images
  const challengeImages = showcaseImages.slice(0, 4);
  // Design approach section: 1 hero + 4 grid images
  const designImages = showcaseImages.slice(4, 9);
  // Scope section: images for each scope card
  const scopeImages = showcaseImages.slice(9, 9 + (project.scope?.length || 0));
  // Outcome section: 3 images
  const outcomeImages = showcaseImages.slice(
    9 + (project.scope?.length || 0),
    12 + (project.scope?.length || 0)
  );
  // Remaining for gallery
  const galleryImages = showcaseImages.slice(12 + (project.scope?.length || 0));

  // Determine hero video source
  const heroVideo = project.featuredContent?.heroVideo || project.videoUrl;

  // Find current project index for navigation
  const currentIndex =
    project.allFeaturedProjects?.findIndex((p) => p.slug === project.slug) ??
    -1;
  const prevProject =
    currentIndex > 0 ? project.allFeaturedProjects?.[currentIndex - 1] : null;
  const nextProject =
    currentIndex < (project.allFeaturedProjects?.length ?? 0) - 1
      ? project.allFeaturedProjects?.[currentIndex + 1]
      : null;

  return (
    <div ref={containerRef} className="relative">
      {/* Global Scroll Progress Indicator */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-[#c9a962] origin-left z-50"
        style={{ scaleX: scrollYProgress }}
      />

      {/* 1. PROJECT NAME - Cinematic Hero */}
      <CinematicHero
        title={t(project.title)}
        subtitle={t(project.excerpt)}
        backgroundImage={project.mainImage}
        videoUrl={heroVideo}
        location={t(project.location?.name)}
        year={project.year}
        tags={project.tags}
        locale={locale}
      />

      {/* 2. OVERVIEW */}
      <OverviewSection overview={t(project.excerpt)} locale={locale} />

      {/* 3. THE CHALLENGE */}
      <ChallengeSection
        challenge={t(project.challenge)}
        images={challengeImages}
        locale={locale}
      />

      {/* 4. DESIGN APPROACH */}
      <DesignApproachSection
        approach={t(project.approach)}
        images={designImages}
        locale={locale}
      />

      {/* 5. SCOPE OF WORK */}
      {project.scope && project.scope.length > 0 && (
        <ScopeJourney
          scope={project.scope.map((s) => ({
            title: t(s.title),
            description: t(s.description),
          }))}
          services={project.services?.map((s) => t(s.title)) || []}
          backgroundImages={showcaseImages.slice(0, 2)}
          scopeImages={scopeImages}
          locale={locale}
        />
      )}

      {/* 6. THE OUTCOME */}
      <OutcomeSection
        outcome={t(project.outcome)}
        images={outcomeImages}
        locale={locale}
      />

      {/* 7. PROJECT INFO - Location, Client, Status, Type, Service Tags, Dates */}
      <ProjectInfoGrid
        location={t(project.location?.name)}
        client={t(project.client)}
        status={project.status}
        projectType={t(project.projectType?.title)}
        sector={t(project.sector?.title)}
        services={
          project.services?.map((s) => ({
            title: t(s.title),
            slug: typeof s.slug === "string" ? s.slug : s.slug?.current,
          })) || []
        }
        duration={project.duration}
        locale={locale}
      />

      {/* 8. OUTCOME & RESULTS - Before/After, BTS, Videos, Testimonial */}
      <OutcomeResultsSection
        beforeImages={beforeImages}
        afterImages={afterImages}
        btsImages={processImages}
        videoUrl={project.videoUrl}
        testimonial={
          project.testimonial
            ? {
                quote: t(project.testimonial.quote),
                author: project.testimonial.author,
                role: project.testimonial.role,
              }
            : undefined
        }
        locale={locale}
      />

      {/* Gallery (optional - if there are remaining gallery images) */}
      {galleryImages.length >= 3 && (
        <ImmersiveGallery
          images={galleryImages}
          projectTitle={t(project.title)}
          locale={locale}
        />
      )}

      {/* 9. ASSETS REQUEST - Please provide assets link */}
      <AssetsRequestSection
        assets={project.featuredContent?.assetLinks || []}
        projectTitle={t(project.title)}
        locale={locale}
      />

      {/* 10. NAVIGATION */}
      <FeaturedNavigation
        prevProject={
          prevProject
            ? {
                slug: prevProject.slug || "",
                title: t(prevProject.title),
                mainImage: prevProject.mainImage,
              }
            : null
        }
        nextProject={
          nextProject
            ? {
                slug: nextProject.slug || "",
                title: t(nextProject.title),
                mainImage: nextProject.mainImage,
              }
            : null
        }
        relatedProjects={
          project.relatedFeaturedProjects?.map((p) => ({
            id: p.id,
            title: t(p.title as { en?: string; ar?: string }),
            slug: p.slug || "",
            mainImage: p.mainImage,
          })) || []
        }
        locale={locale}
      />
    </div>
  );
}

export default FeaturedProjectTemplate;
