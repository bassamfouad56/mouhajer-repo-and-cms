import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { getProjectBySlug, getProjects } from '@/lib/wordpress';
import { ArrowLeft, MapPin, Calendar, Tag } from 'lucide-react';

export async function generateStaticParams() {
  const projects = await getProjects();

  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export default async function ProjectPage({ params }: { params: { slug: string } }) {
  const project = await getProjectBySlug(params.slug);

  if (!project) {
    notFound();
  }

  return (
    <>
      <Header />

      <main className="relative bg-white">
        {/* Hero Section */}
        <section className="relative min-h-[60vh] overflow-hidden bg-neutral-950">
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

          <div className="relative z-10 mx-auto flex min-h-[60vh] max-w-[1400px] flex-col justify-end px-6 pb-16 lg:px-12 lg:pb-24">
            <Link
              href="/#projects"
              className="group mb-8 inline-flex w-fit items-center gap-2 text-sm font-light tracking-wider text-neutral-400 transition-colors hover:text-white focus-visible:text-white focus-visible:outline-none"
            >
              <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
              BACK TO PROJECTS
            </Link>

            <h1 className="mb-6 text-5xl font-light tracking-tight text-white sm:text-6xl lg:text-7xl">
              {project.title}
            </h1>

            <div className="flex flex-wrap gap-6 text-sm font-light text-neutral-300">
              {project.acfFields?.category && (
                <div className="flex items-center gap-2">
                  <Tag size={16} className="text-neutral-500" />
                  {project.acfFields.category}
                </div>
              )}
              {project.acfFields?.location && (
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-neutral-500" />
                  {project.acfFields.location}
                </div>
              )}
              {project.acfFields?.year && (
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-neutral-500" />
                  {project.acfFields.year}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="px-6 py-20 lg:px-12 lg:py-32">
          <div className="mx-auto max-w-[1400px]">
            <div className="grid gap-16 lg:grid-cols-12 lg:gap-24">
              {/* Main Content */}
              <div className="lg:col-span-8">
                {project.acfFields?.description && (
                  <div className="mb-12">
                    <h2 className="mb-6 text-2xl font-light tracking-tight text-neutral-950 lg:text-3xl">
                      Project Overview
                    </h2>
                    <p className="text-lg font-light leading-relaxed text-neutral-600">
                      {project.acfFields.description}
                    </p>
                  </div>
                )}

                <div
                  className="prose prose-neutral max-w-none font-light prose-headings:font-light prose-headings:tracking-tight prose-p:leading-relaxed prose-a:text-neutral-950 prose-a:underline prose-a:decoration-neutral-300 prose-a:transition-colors hover:prose-a:decoration-neutral-950"
                  dangerouslySetInnerHTML={{ __html: project.content || '' }}
                />

                {/* Gallery */}
                {project.acfFields?.gallery && project.acfFields.gallery.length > 0 && (
                  <div className="mt-16">
                    <h2 className="mb-8 text-2xl font-light tracking-tight text-neutral-950 lg:text-3xl">
                      Project Gallery
                    </h2>
                    <div className="grid gap-6 md:grid-cols-2">
                      {project.acfFields.gallery.map((image, index) => (
                        <div key={index} className="relative aspect-[4/3] overflow-hidden bg-neutral-200">
                          <Image
                            src={image.sourceUrl}
                            alt={image.altText || `Gallery image ${index + 1}`}
                            fill
                            className="object-cover transition-transform duration-500 hover:scale-105"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-4">
                <div className="sticky top-24 rounded-sm bg-neutral-50 p-8">
                  <h3 className="mb-6 text-sm font-light tracking-widest text-neutral-500">
                    PROJECT DETAILS
                  </h3>

                  <div className="space-y-6">
                    {project.acfFields?.category && (
                      <div>
                        <div className="mb-2 text-xs font-light tracking-wider text-neutral-500">
                          CATEGORY
                        </div>
                        <div className="text-base font-light text-neutral-950">
                          {project.acfFields.category}
                        </div>
                      </div>
                    )}

                    {project.acfFields?.location && (
                      <div>
                        <div className="mb-2 text-xs font-light tracking-wider text-neutral-500">
                          LOCATION
                        </div>
                        <div className="text-base font-light text-neutral-950">
                          {project.acfFields.location}
                        </div>
                      </div>
                    )}

                    {project.acfFields?.year && (
                      <div>
                        <div className="mb-2 text-xs font-light tracking-wider text-neutral-500">
                          YEAR
                        </div>
                        <div className="text-base font-light text-neutral-950">
                          {project.acfFields.year}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-10 h-px w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent" />

                  <div className="mt-10">
                    <Link
                      href="/#contact"
                      className="group relative block overflow-hidden border border-neutral-950 px-8 py-4 text-center text-sm font-light tracking-widest text-neutral-950 transition-all hover:text-white focus-visible:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2"
                    >
                      <span className="relative z-10">START YOUR PROJECT</span>
                      <div className="absolute inset-0 -translate-x-full bg-neutral-950 transition-transform duration-300 group-hover:translate-x-0" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
