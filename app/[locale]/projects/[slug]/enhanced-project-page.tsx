'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Project } from '@/lib/wordpress';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  ArrowLeft,
  ArrowRight,
  MapPin,
  Calendar,
  Tag,
  Maximize2,
  Share2,
  Ruler,
  User,
  Building,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Home,
  Briefcase,
  Layers,
  FileText
} from 'lucide-react';
import { ImageGalleryModal } from '@/components/image-gallery-modal';

interface ProjectPageClientProps {
  project: Project;
  relatedProjects?: Project[];
  allProjects?: Project[];
}

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      damping: 20,
      stiffness: 80,
    },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      damping: 15,
      stiffness: 100,
    },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// Section component with reveal
function Section({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.15,
  });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={fadeInUp}
      transition={{ delay: delay * 0.1 }}
    >
      {children}
    </motion.div>
  );
}

export function EnhancedProjectPageClient({
  project,
  relatedProjects = [],
  allProjects = []
}: ProjectPageClientProps) {
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const heroOpacity = useTransform(smoothProgress, [0, 0.3], [1, 0]);
  const heroScale = useTransform(smoothProgress, [0, 0.3], [1, 1.1]);

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
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  // Find next/previous projects
  const currentIndex = allProjects.findIndex(p => p.id === project.id);
  const previousProject = currentIndex > 0 ? allProjects[currentIndex - 1] : null;
  const nextProject = currentIndex < allProjects.length - 1 ? allProjects[currentIndex + 1] : null;

  const galleryImages = project.acfFields?.gallery || [];

  return (
    <>
      {/* Progress indicator */}
      <motion.div
        className="fixed left-0 top-0 z-50 h-1 bg-neutral-950 origin-left"
        style={{ scaleX: smoothProgress }}
      />

      <main ref={containerRef} className="relative bg-neutral-50">
        {/* Immersive Hero with Parallax */}
        <section className="relative h-screen overflow-hidden bg-neutral-950">
          <motion.div
            className="absolute inset-0"
            style={{ opacity: heroOpacity, scale: heroScale }}
          >
            {project.featuredImage?.node?.sourceUrl && (
              <Image
                src={project.featuredImage.node.sourceUrl}
                alt={project.title}
                fill
                className="object-cover"
                priority
                quality={90}
              />
            )}
            <div className="absolute inset-0 bg-linear-to-br from-neutral-950/60 via-neutral-950/40 to-neutral-950/80" />
          </motion.div>

          {/* Grid overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-size-[80px_80px]" />

          <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-between px-6 py-12 lg:px-12">
            {/* Top Navigation */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center justify-between"
            >
              <Link
                href="/projects"
                className="group inline-flex items-center gap-2 text-sm font-light text-white/80 transition-colors hover:text-white"
              >
                <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
                <span className="tracking-wider">BACK TO PROJECTS</span>
              </Link>

              <motion.button
                onClick={handleShare}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-light text-white backdrop-blur-sm transition-all hover:bg-white/20"
              >
                <Share2 size={14} />
                <span>Share</span>
              </motion.button>
            </motion.div>

            {/* Hero Content */}
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                {project.acfFields?.projectType && (
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-light tracking-[0.2em] text-white backdrop-blur-sm">
                    <Tag size={12} />
                    {project.acfFields.projectType.toUpperCase()}
                  </div>
                )}

                <div className="overflow-hidden">
                  <motion.h1
                    initial={{ y: 100 }}
                    animate={{ y: 0 }}
                    transition={{ delay: 0.5, type: 'spring', damping: 20 }}
                    className="font-light leading-[0.95] tracking-tight text-white"
                    style={{ fontSize: 'clamp(2.5rem, 8vw, 6rem)' }}
                  >
                    {project.title}
                  </motion.h1>
                </div>
              </motion.div>

              {/* Meta Grid */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:gap-6"
              >
                {project.acfFields?.location && (
                  <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                    <MapPin className="mb-2 h-4 w-4 text-white/60" />
                    <div className="text-xs font-light tracking-wider text-white/40">LOCATION</div>
                    <div className="mt-1 font-light text-white">{project.acfFields.location}</div>
                  </div>
                )}

                {project.acfFields?.yearCompleted && (
                  <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                    <Calendar className="mb-2 h-4 w-4 text-white/60" />
                    <div className="text-xs font-light tracking-wider text-white/40">YEAR</div>
                    <div className="mt-1 font-light text-white">{project.acfFields.yearCompleted}</div>
                  </div>
                )}

                {project.acfFields?.area && (
                  <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                    <Ruler className="mb-2 h-4 w-4 text-white/60" />
                    <div className="text-xs font-light tracking-wider text-white/40">AREA</div>
                    <div className="mt-1 font-light text-white">{project.acfFields.area} m²</div>
                  </div>
                )}

                {project.acfFields?.client && (
                  <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                    <User className="mb-2 h-4 w-4 text-white/60" />
                    <div className="text-xs font-light tracking-wider text-white/40">CLIENT</div>
                    <div className="mt-1 font-light text-white">{project.acfFields.client}</div>
                  </div>
                )}
              </motion.div>

              {/* Scroll indicator */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
                className="flex items-center gap-3 text-sm font-light text-white/60"
              >
                <div className="h-px w-12 bg-white/20" />
                <span className="tracking-wider">SCROLL TO EXPLORE</span>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Project Description Section */}
        <Section delay={0}>
          <div className="mx-auto max-w-7xl px-6 py-24 lg:px-12 lg:py-32">
            <div className="grid gap-12 lg:grid-cols-12 lg:gap-24">
              <div className="lg:col-span-5">
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="mb-4 text-sm font-light tracking-[0.3em] text-neutral-400"
                >
                  OVERVIEW
                </motion.h2>
                <motion.h3
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="text-4xl font-light tracking-tight text-neutral-950 lg:text-5xl"
                >
                  Project Vision
                </motion.h3>
              </div>

              <div className="lg:col-span-7">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="space-y-6 border-l border-neutral-200 pl-8 text-lg font-light leading-relaxed text-neutral-600"
                >
                  <p>{project.acfFields?.projectDescription || project.excerpt}</p>
                </motion.div>
              </div>
            </div>
          </div>
        </Section>

        {/* Full-Width Gallery Section */}
        {galleryImages.length > 0 && (
          <Section delay={1}>
            <div className="relative bg-neutral-950 py-24 lg:py-32">
              <div className="mx-auto max-w-7xl px-6 lg:px-12">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="mb-12 text-center"
                >
                  <h2 className="mb-4 text-sm font-light tracking-[0.3em] text-white/60">
                    GALLERY
                  </h2>
                  <h3 className="text-4xl font-light tracking-tight text-white lg:text-5xl">
                    Project Showcase
                  </h3>
                </motion.div>

                {/* Gallery Grid */}
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={staggerContainer}
                  className="grid gap-4 md:grid-cols-2 lg:gap-6"
                >
                  {galleryImages.slice(0, 4).map((image, index) => (
                    <motion.div
                      key={index}
                      variants={fadeInUp}
                      className={`group relative cursor-pointer overflow-hidden rounded-2xl ${
                        index === 0 ? 'md:col-span-2' : ''
                      } ${index === 0 ? 'aspect-[21/9]' : 'aspect-[4/3]'}`}
                      onClick={() => handleImageClick(index)}
                    >
                      <Image
                        src={image.sourceUrl}
                        alt={image.altText || `Gallery image ${index + 1}`}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-neutral-950/0 transition-colors duration-500 group-hover:bg-neutral-950/40" />
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileHover={{ opacity: 1, scale: 1 }}
                        className="absolute inset-0 flex items-center justify-center"
                      >
                        <div className="rounded-full bg-white/20 p-4 backdrop-blur-sm">
                          <Maximize2 className="h-6 w-6 text-white" />
                        </div>
                      </motion.div>
                    </motion.div>
                  ))}
                </motion.div>

                {galleryImages.length > 4 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-8 text-center"
                  >
                    <button
                      onClick={() => handleImageClick(0)}
                      className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-8 py-4 font-light text-white backdrop-blur-sm transition-all hover:bg-white/20"
                    >
                      <span>View All {galleryImages.length} Images</span>
                      <Maximize2 size={16} />
                    </button>
                  </motion.div>
                )}
              </div>
            </div>
          </Section>
        )}

        {/* Content Section */}
        {project.content && (
          <Section delay={2}>
            <div className="mx-auto max-w-4xl px-6 py-24 lg:px-12 lg:py-32">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="prose prose-lg prose-neutral max-w-none font-light"
                dangerouslySetInnerHTML={{ __html: project.content }}
              />
            </div>
          </Section>
        )}

        {/* Navigation Hub Section */}
        <Section delay={3}>
          <div className="border-t border-neutral-200 bg-white px-6 py-24 lg:px-12 lg:py-32">
            <div className="mx-auto max-w-7xl">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-12 text-center text-4xl font-light tracking-tight text-neutral-950 lg:text-5xl"
              >
                Explore More
              </motion.h2>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {/* Services */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                >
                  <Link
                    href="/services"
                    className="group block h-full rounded-2xl border border-neutral-200 bg-neutral-50 p-8 transition-all hover:border-neutral-300 hover:shadow-xl"
                  >
                    <div className="mb-4 inline-flex rounded-full bg-neutral-950 p-3">
                      <Briefcase className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="mb-2 text-xl font-light text-neutral-950">Our Services</h3>
                    <p className="mb-4 font-light text-neutral-600">
                      Discover our comprehensive design solutions
                    </p>
                    <div className="inline-flex items-center gap-2 text-sm font-light text-neutral-950 transition-transform group-hover:translate-x-2">
                      <span>Explore</span>
                      <ArrowRight size={14} />
                    </div>
                  </Link>
                </motion.div>

                {/* Industries */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                >
                  <Link
                    href="/industries"
                    className="group block h-full rounded-2xl border border-neutral-200 bg-neutral-50 p-8 transition-all hover:border-neutral-300 hover:shadow-xl"
                  >
                    <div className="mb-4 inline-flex rounded-full bg-neutral-950 p-3">
                      <Layers className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="mb-2 text-xl font-light text-neutral-950">Industries</h3>
                    <p className="mb-4 font-light text-neutral-600">
                      Explore our expertise across sectors
                    </p>
                    <div className="inline-flex items-center gap-2 text-sm font-light text-neutral-950 transition-transform group-hover:translate-x-2">
                      <span>Explore</span>
                      <ArrowRight size={14} />
                    </div>
                  </Link>
                </motion.div>

                {/* Blog */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                >
                  <Link
                    href="/blog"
                    className="group block h-full rounded-2xl border border-neutral-200 bg-neutral-50 p-8 transition-all hover:border-neutral-300 hover:shadow-xl"
                  >
                    <div className="mb-4 inline-flex rounded-full bg-neutral-950 p-3">
                      <FileText className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="mb-2 text-xl font-light text-neutral-950">Insights</h3>
                    <p className="mb-4 font-light text-neutral-600">
                      Read our latest design thoughts
                    </p>
                    <div className="inline-flex items-center gap-2 text-sm font-light text-neutral-950 transition-transform group-hover:translate-x-2">
                      <span>Read</span>
                      <ArrowRight size={14} />
                    </div>
                  </Link>
                </motion.div>

                {/* All Projects */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                >
                  <Link
                    href="/projects"
                    className="group block h-full rounded-2xl border border-neutral-200 bg-neutral-50 p-8 transition-all hover:border-neutral-300 hover:shadow-xl"
                  >
                    <div className="mb-4 inline-flex rounded-full bg-neutral-950 p-3">
                      <Building className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="mb-2 text-xl font-light text-neutral-950">All Projects</h3>
                    <p className="mb-4 font-light text-neutral-600">
                      View our complete portfolio
                    </p>
                    <div className="inline-flex items-center gap-2 text-sm font-light text-neutral-950 transition-transform group-hover:translate-x-2">
                      <span>Browse</span>
                      <ArrowRight size={14} />
                    </div>
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>
        </Section>

        {/* Related Projects */}
        {relatedProjects.length > 0 && (
          <Section delay={4}>
            <div className="bg-neutral-50 px-6 py-24 lg:px-12 lg:py-32">
              <div className="mx-auto max-w-7xl">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="mb-12"
                >
                  <h2 className="mb-4 text-sm font-light tracking-[0.3em] text-neutral-400">
                    RELATED WORK
                  </h2>
                  <h3 className="text-4xl font-light tracking-tight text-neutral-950 lg:text-5xl">
                    Similar Projects
                  </h3>
                </motion.div>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {relatedProjects.slice(0, 3).map((relatedProject, index) => (
                    <motion.div
                      key={relatedProject.id}
                      initial={{ opacity: 0, y: 40 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        href={`/projects/${relatedProject.slug}`}
                        className="group block"
                      >
                        <div className="mb-4 aspect-[4/3] overflow-hidden rounded-2xl bg-neutral-200">
                          {relatedProject.featuredImage?.node?.sourceUrl && (
                            <Image
                              src={relatedProject.featuredImage.node.sourceUrl}
                              alt={relatedProject.title}
                              width={600}
                              height={450}
                              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                          )}
                        </div>
                        <div className="space-y-2">
                          {relatedProject.acfFields?.projectType && (
                            <div className="text-xs font-light tracking-wider text-neutral-400">
                              {relatedProject.acfFields.projectType.toUpperCase()}
                            </div>
                          )}
                          <h4 className="text-xl font-light text-neutral-950 transition-colors group-hover:text-neutral-600">
                            {relatedProject.title}
                          </h4>
                          {relatedProject.acfFields?.location && (
                            <div className="flex items-center gap-2 text-sm font-light text-neutral-600">
                              <MapPin size={14} />
                              {relatedProject.acfFields.location}
                            </div>
                          )}
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </Section>
        )}

        {/* Next/Previous Navigation */}
        <div className="border-t border-neutral-200 bg-white">
          <div className="mx-auto max-w-7xl">
            <div className="grid md:grid-cols-2">
              {/* Previous Project */}
              {previousProject && (
                <Link
                  href={`/projects/${previousProject.slug}`}
                  className="group relative overflow-hidden border-b border-neutral-200 p-12 transition-colors hover:bg-neutral-50 md:border-b-0 md:border-r"
                >
                  <div className="relative z-10">
                    <div className="mb-4 inline-flex items-center gap-2 text-sm font-light text-neutral-400">
                      <ChevronLeft size={16} />
                      <span className="tracking-wider">PREVIOUS PROJECT</span>
                    </div>
                    <h3 className="mb-2 text-2xl font-light text-neutral-950 transition-colors group-hover:text-neutral-600">
                      {previousProject.title}
                    </h3>
                    {previousProject.acfFields?.projectType && (
                      <div className="text-sm font-light text-neutral-500">
                        {previousProject.acfFields.projectType}
                      </div>
                    )}
                  </div>
                </Link>
              )}

              {/* Next Project */}
              {nextProject && (
                <Link
                  href={`/projects/${nextProject.slug}`}
                  className="group relative overflow-hidden p-12 transition-colors hover:bg-neutral-50"
                >
                  <div className="relative z-10 text-right">
                    <div className="mb-4 inline-flex items-center gap-2 text-sm font-light text-neutral-400">
                      <span className="tracking-wider">NEXT PROJECT</span>
                      <ChevronRight size={16} />
                    </div>
                    <h3 className="mb-2 text-2xl font-light text-neutral-950 transition-colors group-hover:text-neutral-600">
                      {nextProject.title}
                    </h3>
                    {nextProject.acfFields?.projectType && (
                      <div className="text-sm font-light text-neutral-500">
                        {nextProject.acfFields.projectType}
                      </div>
                    )}
                  </div>
                </Link>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Gallery Modal */}
      <ImageGalleryModal
        images={galleryImages}
        isOpen={galleryOpen}
        onClose={() => setGalleryOpen(false)}
        initialIndex={selectedImageIndex}
      />
    </>
  );
}
