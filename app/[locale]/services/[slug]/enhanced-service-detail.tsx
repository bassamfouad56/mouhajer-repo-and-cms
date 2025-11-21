'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Service, Industry, Project } from '@/lib/wordpress';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  ArrowLeft,
  ArrowRight,
  Share2,
  CheckCircle2,
  Lightbulb,
  Package,
  Users,
  TrendingUp,
  ChevronRight,
  MapPin,
  Building,
  Briefcase,
  Layers,
  FileText,
  Palette,
  Home,
  Hotel,
  ShoppingBag,
  Heart,
  Utensils,
  Building2,
  Sofa
} from 'lucide-react';
import { ImageGalleryModal } from '@/components/image-gallery-modal';

interface ServiceDetailProps {
  service: Service;
  relatedIndustries: Industry[];
  relatedProjects: Project[];
  allServices: Service[];
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

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

// Section component
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

// Get icon for service
function getServiceIcon(slug: string) {
  const iconMap: { [key: string]: any } = {
    'architecture': Building2,
    'interior-design': Palette,
    'residential': Home,
    'commercial': Building2,
    'hospitality': Hotel,
    'retail': ShoppingBag,
    'healthcare': Heart,
    'restaurants': Utensils,
    'furniture': Sofa,
  };

  // Match partial slug
  for (const [key, icon] of Object.entries(iconMap)) {
    if (slug.toLowerCase().includes(key)) {
      return icon;
    }
  }

  return Briefcase;
}

export default function EnhancedServiceDetail({
  service,
  relatedIndustries,
  relatedProjects,
  allServices,
}: ServiceDetailProps) {
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

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: service.title,
          text: service.excerpt || `Explore our ${service.title} services`,
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

  // Get icon component
  const IconComponent = getServiceIcon(service.slug);

  // Find next/previous services
  const currentIndex = allServices.findIndex(s => s.id === service.id);
  const previousService = currentIndex > 0 ? allServices[currentIndex - 1] : null;
  const nextService = currentIndex < allServices.length - 1 ? allServices[currentIndex + 1] : null;

  // Features and process
  const features = service.acfFields?.serviceFeatures || service.acfFields?.features || [
    { title: 'Expert Design', description: 'Professional design solutions tailored to your needs' },
    { title: 'Quality Materials', description: 'Premium materials and finishes' },
    { title: 'Timely Delivery', description: 'Projects completed on schedule' },
  ];

  const processSteps = service.acfFields?.processSteps || service.acfFields?.process || [
    { step: 1, title: 'Consultation', description: 'Understanding your vision and requirements' },
    { step: 2, title: 'Design', description: 'Creating detailed plans and visualizations' },
    { step: 3, title: 'Execution', description: 'Bringing the design to life with precision' },
    { step: 4, title: 'Delivery', description: 'Final touches and handover' },
  ];

  const galleryImages = relatedProjects.slice(0, 6).map(p => ({
    sourceUrl: p.featuredImage?.node?.sourceUrl || '',
    altText: p.title,
  })).filter(img => img.sourceUrl);

  return (
    <>
      {/* Progress indicator */}
      <motion.div
        className="fixed left-0 top-0 z-50 h-1 bg-neutral-950 origin-left"
        style={{ scaleX: smoothProgress }}
      />

      <main ref={containerRef} className="relative bg-neutral-50">
        {/* Hero Section */}
        <section className="relative h-screen overflow-hidden bg-neutral-950">
          <motion.div
            className="absolute inset-0"
            style={{ opacity: heroOpacity, scale: heroScale }}
          >
            {service.featuredImage?.node?.sourceUrl && (
              <Image
                src={service.featuredImage.node.sourceUrl}
                alt={service.title}
                fill
                className="object-cover"
                priority
                quality={90}
              />
            )}
            <div className="absolute inset-0 bg-linear-to-br from-neutral-950/70 via-neutral-950/50 to-neutral-950/80" />
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
                href="/services"
                className="group inline-flex items-center gap-2 text-sm font-light text-white/80 transition-colors hover:text-white"
              >
                <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
                <span className="tracking-wider">ALL SERVICES</span>
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
                {/* Icon */}
                <div className="mb-6 inline-flex rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
                  <IconComponent className="h-12 w-12 text-white" strokeWidth={1.5} />
                </div>

                {/* Title */}
                <div className="overflow-hidden">
                  <motion.h1
                    initial={{ y: 100 }}
                    animate={{ y: 0 }}
                    transition={{ delay: 0.5, type: 'spring', damping: 20 }}
                    className="font-light leading-[0.95] tracking-tight text-white"
                    style={{ fontSize: 'clamp(2.5rem, 8vw, 6rem)' }}
                  >
                    {service.title}
                  </motion.h1>
                </div>

                {/* Description */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="mt-6 max-w-3xl text-xl font-light leading-relaxed text-white/80"
                >
                  {service.excerpt || 'Discover our comprehensive design solutions'}
                </motion.p>
              </motion.div>

              {/* Scroll indicator */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
                className="flex items-center gap-3 text-sm font-light text-white/60"
              >
                <div className="h-px w-12 bg-white/20" />
                <span className="tracking-wider">EXPLORE OUR PROCESS</span>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Overview Section */}
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
                  WHAT WE OFFER
                </motion.h2>
                <motion.h3
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="text-4xl font-light tracking-tight text-neutral-950 lg:text-5xl"
                >
                  Service Overview
                </motion.h3>
              </div>

              <div className="lg:col-span-7">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="space-y-6 border-l border-neutral-200 pl-8 text-lg font-light leading-relaxed text-neutral-600"
                  dangerouslySetInnerHTML={{
                    __html: service.content || service.excerpt || '<p>Comprehensive design solutions tailored to your unique needs.</p>'
                  }}
                />
              </div>
            </div>
          </div>
        </Section>

        {/* Features Section */}
        {features.length > 0 && (
          <Section delay={1}>
            <div className="bg-white px-6 py-24 lg:px-12 lg:py-32">
              <div className="mx-auto max-w-7xl">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="mb-16 text-center"
                >
                  <h2 className="mb-4 text-sm font-light tracking-[0.3em] text-neutral-400">
                    KEY FEATURES
                  </h2>
                  <h3 className="text-4xl font-light tracking-tight text-neutral-950 lg:text-5xl">
                    What Sets Us Apart
                  </h3>
                </motion.div>

                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={staggerContainer}
                  className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
                >
                  {features.map((feature: any, index: number) => (
                    <motion.div
                      key={index}
                      variants={fadeInUp}
                      className="group rounded-2xl border border-neutral-200 bg-neutral-50 p-8 transition-all hover:border-neutral-300 hover:shadow-xl"
                    >
                      <div className="mb-4 inline-flex rounded-full bg-neutral-950 p-3">
                        <CheckCircle2 className="h-6 w-6 text-white" strokeWidth={1.5} />
                      </div>
                      <h4 className="mb-3 text-xl font-light text-neutral-950">
                        {feature.title}
                      </h4>
                      <p className="font-light leading-relaxed text-neutral-600">
                        {feature.description}
                      </p>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </div>
          </Section>
        )}

        {/* Process Section */}
        {processSteps.length > 0 && (
          <Section delay={2}>
            <div className="relative bg-neutral-950 px-6 py-24 lg:px-12 lg:py-32">
              {/* Grid pattern */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-size-[80px_80px]" />

              <div className="relative mx-auto max-w-7xl">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="mb-16 text-center"
                >
                  <h2 className="mb-4 text-sm font-light tracking-[0.3em] text-white/60">
                    OUR APPROACH
                  </h2>
                  <h3 className="text-4xl font-light tracking-tight text-white lg:text-5xl">
                    Design Process
                  </h3>
                </motion.div>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                  {processSteps.map((step: any, index: number) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 40 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="relative"
                    >
                      {/* Connection line */}
                      {index < processSteps.length - 1 && (
                        <div className="absolute left-full top-12 hidden h-px w-full bg-white/10 lg:block" />
                      )}

                      <div className="relative rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
                        <div className="mb-4 text-6xl font-light text-white/20">
                          {String(step.step || index + 1).padStart(2, '0')}
                        </div>
                        <h4 className="mb-3 text-xl font-light text-white">
                          {step.title}
                        </h4>
                        <p className="font-light leading-relaxed text-white/70">
                          {step.description}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </Section>
        )}

        {/* Related Projects Gallery */}
        {relatedProjects.length > 0 && (
          <Section delay={3}>
            <div className="bg-neutral-50 px-6 py-24 lg:px-12 lg:py-32">
              <div className="mx-auto max-w-7xl">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="mb-12"
                >
                  <h2 className="mb-4 text-sm font-light tracking-[0.3em] text-neutral-400">
                    PORTFOLIO
                  </h2>
                  <h3 className="text-4xl font-light tracking-tight text-neutral-950 lg:text-5xl">
                    Recent Projects
                  </h3>
                </motion.div>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {relatedProjects.slice(0, 6).map((project, index) => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, y: 40 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link href={`/projects/${project.slug}`} className="group block">
                        <div className="mb-4 aspect-[4/3] overflow-hidden rounded-2xl bg-neutral-200">
                          {project.featuredImage?.node?.sourceUrl && (
                            <Image
                              src={project.featuredImage.node.sourceUrl}
                              alt={project.title}
                              width={600}
                              height={450}
                              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                          )}
                        </div>
                        <div className="space-y-2">
                          {project.acfFields?.projectType && (
                            <div className="text-xs font-light tracking-wider text-neutral-400">
                              {project.acfFields.projectType.toUpperCase()}
                            </div>
                          )}
                          <h4 className="text-xl font-light text-neutral-950 transition-colors group-hover:text-neutral-600">
                            {project.title}
                          </h4>
                          {project.acfFields?.location && (
                            <div className="flex items-center gap-2 text-sm font-light text-neutral-600">
                              <MapPin size={14} />
                              {project.acfFields.location}
                            </div>
                          )}
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="mt-12 text-center"
                >
                  <Link
                    href="/projects"
                    className="inline-flex items-center gap-2 rounded-full border border-neutral-950 bg-neutral-950 px-8 py-4 font-light text-white transition-all hover:bg-white hover:text-neutral-950"
                  >
                    <span>View All Projects</span>
                    <ArrowRight size={16} />
                  </Link>
                </motion.div>
              </div>
            </div>
          </Section>
        )}

        {/* Related Industries */}
        {relatedIndustries.length > 0 && (
          <Section delay={4}>
            <div className="border-t border-neutral-200 bg-white px-6 py-24 lg:px-12 lg:py-32">
              <div className="mx-auto max-w-7xl">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="mb-12"
                >
                  <h2 className="mb-4 text-sm font-light tracking-[0.3em] text-neutral-400">
                    INDUSTRIES WE SERVE
                  </h2>
                  <h3 className="text-4xl font-light tracking-tight text-neutral-950 lg:text-5xl">
                    Related Sectors
                  </h3>
                </motion.div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {relatedIndustries.map((industry, index) => (
                    <motion.div
                      key={industry.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        href={`/industries/${industry.slug}`}
                        className="group block h-full rounded-2xl border border-neutral-200 bg-neutral-50 p-8 transition-all hover:border-neutral-300 hover:shadow-xl"
                      >
                        <h4 className="mb-2 text-xl font-light text-neutral-950">
                          {industry.title}
                        </h4>
                        <p className="mb-4 font-light text-neutral-600">
                          {industry.excerpt || 'Specialized design solutions'}
                        </p>
                        <div className="inline-flex items-center gap-2 text-sm font-light text-neutral-950 transition-transform group-hover:translate-x-2">
                          <span>Learn More</span>
                          <ArrowRight size={14} />
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </Section>
        )}

        {/* Navigation Hub */}
        <Section delay={5}>
          <div className="border-t border-neutral-200 bg-neutral-50 px-6 py-24 lg:px-12 lg:py-32">
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
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                >
                  <Link
                    href="/projects"
                    className="group block h-full rounded-2xl border border-neutral-200 bg-white p-8 transition-all hover:border-neutral-300 hover:shadow-xl"
                  >
                    <div className="mb-4 inline-flex rounded-full bg-neutral-950 p-3">
                      <Building className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="mb-2 text-xl font-light text-neutral-950">Projects</h3>
                    <p className="mb-4 font-light text-neutral-600">
                      Explore our portfolio
                    </p>
                    <div className="inline-flex items-center gap-2 text-sm font-light text-neutral-950 transition-transform group-hover:translate-x-2">
                      <span>Browse</span>
                      <ArrowRight size={14} />
                    </div>
                  </Link>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                >
                  <Link
                    href="/services"
                    className="group block h-full rounded-2xl border border-neutral-200 bg-white p-8 transition-all hover:border-neutral-300 hover:shadow-xl"
                  >
                    <div className="mb-4 inline-flex rounded-full bg-neutral-950 p-3">
                      <Briefcase className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="mb-2 text-xl font-light text-neutral-950">All Services</h3>
                    <p className="mb-4 font-light text-neutral-600">
                      View all our services
                    </p>
                    <div className="inline-flex items-center gap-2 text-sm font-light text-neutral-950 transition-transform group-hover:translate-x-2">
                      <span>Explore</span>
                      <ArrowRight size={14} />
                    </div>
                  </Link>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                >
                  <Link
                    href="/industries"
                    className="group block h-full rounded-2xl border border-neutral-200 bg-white p-8 transition-all hover:border-neutral-300 hover:shadow-xl"
                  >
                    <div className="mb-4 inline-flex rounded-full bg-neutral-950 p-3">
                      <Layers className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="mb-2 text-xl font-light text-neutral-950">Industries</h3>
                    <p className="mb-4 font-light text-neutral-600">
                      Sectors we serve
                    </p>
                    <div className="inline-flex items-center gap-2 text-sm font-light text-neutral-950 transition-transform group-hover:translate-x-2">
                      <span>Discover</span>
                      <ArrowRight size={14} />
                    </div>
                  </Link>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                >
                  <Link
                    href="/blog"
                    className="group block h-full rounded-2xl border border-neutral-200 bg-white p-8 transition-all hover:border-neutral-300 hover:shadow-xl"
                  >
                    <div className="mb-4 inline-flex rounded-full bg-neutral-950 p-3">
                      <FileText className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="mb-2 text-xl font-light text-neutral-950">Insights</h3>
                    <p className="mb-4 font-light text-neutral-600">
                      Design knowledge
                    </p>
                    <div className="inline-flex items-center gap-2 text-sm font-light text-neutral-950 transition-transform group-hover:translate-x-2">
                      <span>Read</span>
                      <ArrowRight size={14} />
                    </div>
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>
        </Section>

        {/* Next/Previous Navigation */}
        <div className="border-t border-neutral-200 bg-white">
          <div className="mx-auto max-w-7xl">
            <div className="grid md:grid-cols-2">
              {previousService && (
                <Link
                  href={`/services/${previousService.slug}`}
                  className="group relative overflow-hidden border-b border-neutral-200 p-12 transition-colors hover:bg-neutral-50 md:border-b-0 md:border-r"
                >
                  <div className="relative z-10">
                    <div className="mb-4 inline-flex items-center gap-2 text-sm font-light text-neutral-400">
                      <ChevronRight size={16} className="rotate-180" />
                      <span className="tracking-wider">PREVIOUS SERVICE</span>
                    </div>
                    <h3 className="mb-2 text-2xl font-light text-neutral-950 transition-colors group-hover:text-neutral-600">
                      {previousService.title}
                    </h3>
                  </div>
                </Link>
              )}

              {nextService && (
                <Link
                  href={`/services/${nextService.slug}`}
                  className="group relative overflow-hidden p-12 transition-colors hover:bg-neutral-50"
                >
                  <div className="relative z-10 text-right">
                    <div className="mb-4 inline-flex items-center gap-2 text-sm font-light text-neutral-400">
                      <span className="tracking-wider">NEXT SERVICE</span>
                      <ChevronRight size={16} />
                    </div>
                    <h3 className="mb-2 text-2xl font-light text-neutral-950 transition-colors group-hover:text-neutral-600">
                      {nextService.title}
                    </h3>
                  </div>
                </Link>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Gallery Modal */}
      {galleryImages.length > 0 && (
        <ImageGalleryModal
          images={galleryImages}
          isOpen={galleryOpen}
          onClose={() => setGalleryOpen(false)}
          initialIndex={selectedImageIndex}
        />
      )}
    </>
  );
}
