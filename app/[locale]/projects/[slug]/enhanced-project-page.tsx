'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Project } from '@/lib/wordpress';
import { ArrowLeft, MapPin, Calendar, Tag, Maximize2, Share2 } from 'lucide-react';
import { ImageGalleryModal } from '@/components/image-gallery-modal';

interface ProjectPageClientProps {
  project: Project;
}

export function EnhancedProjectPageClient({ project }: ProjectPageClientProps) {
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
    setGalleryOpen(true);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: project.title,
          text: project.acfFields?.projectDescription || project.excerpt,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <>
      <main className="relative bg-white">
        {/* Enhanced Hero Section */}
        <section className="relative min-h-[70vh] overflow-hidden bg-neutral-950">
          <div className="absolute inset-0">
            {project.featuredImage?.node?.sourceUrl && (
              <Image
                src={project.featuredImage.node.sourceUrl}
                alt={project.title}
                fill
                className="object-cover opacity-40"
                priority
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/50 via-neutral-950/70 to-neutral-950" />
          </div>

          {/* Decorative elements */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:80px_80px]" />

          <div className="relative z-10 mx-auto flex min-h-[70vh] max-w-[1400px] flex-col justify-end px-6 pb-16 lg:px-12 lg:pb-24">
            {/* Breadcrumb */}
            <div className="mb-8 flex items-center gap-3 text-sm font-light text-neutral-400">
              <Link
                href="/projects"
                className="group inline-flex items-center gap-2 transition-colors hover:text-white"
              >
                <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" />
                PROJECTS
              </Link>
              <span>/</span>
              <span className="text-neutral-500">{project.acfFields?.projectType || 'Project'}</span>
            </div>

            {/* Category Badge */}
            {project.acfFields?.projectType && (
              <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-light tracking-wider text-white backdrop-blur-sm">
                <Tag size={14} />
                {project.acfFields.projectType}
              </div>
            )}

            {/* Title */}
            <h1 className="mb-6 max-w-4xl text-5xl font-light tracking-tight text-white sm:text-6xl lg:text-7xl">
              {project.title}
            </h1>

            {/* Meta Information */}
            <div className="mb-8 flex flex-wrap gap-6 text-sm font-light text-neutral-300">
              {project.acfFields?.location && (
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-neutral-500" />
                  {project.acfFields.location}
                </div>
              )}
              {project.acfFields?.yearCompleted && (
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-neutral-500" />
                  {project.acfFields.yearCompleted}
                </div>
              )}
            </div>

            {/* Share Button */}
            <button
              onClick={handleShare}
              className="inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-light text-white backdrop-blur-sm transition-all hover:bg-white hover:text-neutral-950"
            >
              <Share2 size={16} />
              <span>SHARE PROJECT</span>
            </button>
          </div>
        </section>

        {/* Content Section */}
        <section className="px-6 py-20 lg:px-12 lg:py-32">
          <div className="mx-auto max-w-[1400px]">
            <div className="grid gap-16 lg:grid-cols-12 lg:gap-24">
              {/* Main Content */}
              <div className="lg:col-span-8">
                {/* Project Overview with better styling */}
                {project.acfFields?.projectDescription && (
                  <div className="mb-16">
                    <div className="mb-6 flex items-center gap-4">
                      <div className="h-px w-12 bg-neutral-300" />
                      <h2 className="text-sm font-light tracking-[0.3em] text-neutral-500">
                        PROJECT OVERVIEW
                      </h2>
                    </div>
                    <p className="text-xl font-light leading-relaxed text-neutral-700">
                      {project.acfFields.projectDescription}
                    </p>
                  </div>
                )}

                {/* Rich Content */}
                {project.content && (
                  <div className="mb-16">
                    <div
                      className="prose prose-lg prose-neutral max-w-none font-light
                        prose-headings:mb-4 prose-headings:mt-12 prose-headings:font-light prose-headings:tracking-tight prose-headings:text-neutral-950
                        prose-h2:text-3xl prose-h3:text-2xl
                        prose-p:mb-6 prose-p:leading-relaxed prose-p:text-neutral-700
                        prose-ul:my-6 prose-ul:space-y-2
                        prose-li:text-neutral-700
                        prose-a:font-normal prose-a:text-neutral-950 prose-a:underline prose-a:decoration-neutral-300 prose-a:transition-colors hover:prose-a:decoration-neutral-950"
                      dangerouslySetInnerHTML={{ __html: project.content }}
                    />
                  </div>
                )}

                {/* Interactive Gallery */}
                {project.acfFields?.gallery && project.acfFields.gallery.length > 0 && (
                  <div className="mt-20">
                    <div className="mb-12 flex items-center gap-4">
                      <div className="h-px w-12 bg-neutral-300" />
                      <h2 className="text-sm font-light tracking-[0.3em] text-neutral-500">
                        PROJECT GALLERY
                      </h2>
                      <div className="h-px flex-1 bg-neutral-300" />
                    </div>

                    {/* Gallery Grid */}
                    <div className="grid gap-8 md:grid-cols-2">
                      {project.acfFields.gallery.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => handleImageClick(index)}
                          className="group relative aspect-[4/3] overflow-hidden bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950"
                        >
                          <Image
                            src={image.sourceUrl}
                            alt={image.altText || `Gallery image ${index + 1}`}
                            fill
                            className="object-cover transition-all duration-700 group-hover:scale-110"
                          />

                          {/* Hover Overlay */}
                          <div className="absolute inset-0 bg-neutral-950/0 transition-all duration-500 group-hover:bg-neutral-950/40" />

                          {/* Expand Icon */}
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-all duration-500 group-hover:opacity-100">
                            <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-white bg-neutral-950/50 backdrop-blur-sm">
                              <Maximize2 className="text-white" size={24} />
                            </div>
                          </div>

                          {/* Image Caption on Hover */}
                          {image.altText && (
                            <div className="absolute bottom-0 left-0 right-0 translate-y-full bg-gradient-to-t from-neutral-950/90 to-transparent p-6 transition-all duration-500 group-hover:translate-y-0">
                              <p className="text-sm font-light text-white">
                                {image.altText}
                              </p>
                            </div>
                          )}

                          {/* Image Number Badge */}
                          <div className="absolute left-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-neutral-950/50 text-xs font-light text-white backdrop-blur-sm">
                            {index + 1}
                          </div>
                        </button>
                      ))}
                    </div>

                    {/* Gallery Note */}
                    <p className="mt-6 text-center text-sm font-light text-neutral-500">
                      Click on any image to view in fullscreen • Use arrow keys to navigate
                    </p>
                  </div>
                )}
              </div>

              {/* Enhanced Sidebar */}
              <div className="lg:col-span-4">
                <div className="sticky top-24 space-y-8">
                  {/* Project Details Card */}
                  <div className="rounded-sm border border-neutral-200 bg-neutral-50 p-8">
                    <h3 className="mb-6 text-sm font-light tracking-[0.3em] text-neutral-500">
                      PROJECT DETAILS
                    </h3>

                    <div className="space-y-6">
                      {project.acfFields?.projectType && (
                        <div>
                          <div className="mb-2 text-xs font-light tracking-wider text-neutral-500">
                            CATEGORY
                          </div>
                          <div className="text-lg font-light text-neutral-950">
                            {project.acfFields.projectType}
                          </div>
                        </div>
                      )}

                      {project.acfFields?.location && (
                        <div>
                          <div className="mb-2 text-xs font-light tracking-wider text-neutral-500">
                            LOCATION
                          </div>
                          <div className="text-lg font-light text-neutral-950">
                            {project.acfFields.location}
                          </div>
                        </div>
                      )}

                      {project.acfFields?.yearCompleted && (
                        <div>
                          <div className="mb-2 text-xs font-light tracking-wider text-neutral-500">
                            YEAR COMPLETED
                          </div>
                          <div className="text-lg font-light text-neutral-950">
                            {project.acfFields.yearCompleted}
                          </div>
                        </div>
                      )}

                      {project.acfFields?.gallery && (
                        <div>
                          <div className="mb-2 text-xs font-light tracking-wider text-neutral-500">
                            IMAGES
                          </div>
                          <div className="text-lg font-light text-neutral-950">
                            {project.acfFields.gallery.length} Photos
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* CTA Card */}
                  <div className="rounded-sm border border-neutral-200 bg-white p-8">
                    <h3 className="mb-4 text-xl font-light tracking-tight text-neutral-950">
                      Inspired by this project?
                    </h3>
                    <p className="mb-6 text-sm font-light leading-relaxed text-neutral-600">
                      Let&apos;s discuss how we can create something equally exceptional for your space.
                    </p>

                    <Link
                      href="/#contact"
                      className="group relative block overflow-hidden border-2 border-neutral-950 px-6 py-4 text-center text-sm font-light tracking-widest text-neutral-950 transition-all hover:text-white"
                    >
                      <span className="relative z-10">START YOUR PROJECT</span>
                      <div className="absolute inset-0 -translate-x-full bg-neutral-950 transition-transform duration-300 group-hover:translate-x-0" />
                    </Link>

                    <Link
                      href="/projects"
                      className="mt-4 block text-center text-sm font-light tracking-wider text-neutral-500 transition-colors hover:text-neutral-950"
                    >
                      VIEW MORE PROJECTS
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Image Gallery Modal */}
      {galleryOpen && project.acfFields?.gallery && (
        <ImageGalleryModal
          images={project.acfFields.gallery}
          initialIndex={selectedImageIndex}
          onClose={() => setGalleryOpen(false)}
        />
      )}
    </>
  );
}
