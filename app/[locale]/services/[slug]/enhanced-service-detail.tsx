'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useInView, useScroll, useTransform, useSpring } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Service, Industry, Project } from '@/lib/wordpress';
import { ImageGalleryModal } from '@/components/image-gallery-modal';
import {
  Building2,
  Home,
  Hotel,
  Store,
  Hospital,
  GraduationCap,
  Utensils,
  Briefcase,
  ArrowRight,
  ChevronRight,
  Award,
  TrendingUp,
  Users,
  MapPin,
  Calendar,
  ArrowUpRight,
  CheckCircle2,
  Lightbulb,
  Palette,
  Ruler,
  Package,
  Sparkles,
  Settings,
  ZoomIn,
  Heart,
  Box,
  ShoppingBag,
  Sofa,
} from 'lucide-react';

interface ServiceDetailProps {
  service: Service;
  relatedIndustries: Industry[];
  relatedProjects: Project[];
  allServices: Service[];
}

// Animated Counter Component
function AnimatedCounter({ end, suffix = '', duration = 2 }: { end: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const counterRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(counterRef, { once: true });

  useEffect(() => {
    if (isInView) {
      let startTime: number;
      let animationFrame: number;

      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);

        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        setCount(Math.floor(easeOutQuart * end));

        if (progress < 1) {
          animationFrame = requestAnimationFrame(animate);
        }
      };

      animationFrame = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(animationFrame);
    }
  }, [isInView, end, duration]);

  return (
    <div ref={counterRef} className="mb-2 text-5xl font-light text-white">
      {count}{suffix}
    </div>
  );
}

export default function EnhancedServiceDetail({
  service,
  relatedIndustries,
  relatedProjects,
  allServices,
}: ServiceDetailProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const isHeroInView = useInView(heroRef, { once: true });
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);

  // Parallax scrolling effect
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.5, 0]);

  // Get icon component based on service slug
  const getServiceIcon = (slug: string) => {
    const iconMap: { [key: string]: typeof Lightbulb } = {
      'fb-restaurants': Utensils,
      'healthcare-wellness-2': Heart,
      'retail-showrooms-2': ShoppingBag,
      'commercial-office-2': Building2,
      'residential-luxury-2': Home,
      'hospitality-hotels-2': Hotel,
      '3d-visualization': Box,
      'turnkey-solutions': Package,
      'project-management': Briefcase,
      'custom-furniture': Sofa,
      'architecture': Building2,
      'interior-design': Palette,
    };
    return iconMap[slug] || Palette;
  };

  const icon = getServiceIcon(service.slug);
  const projectCount = service.acfFields?.stats?.projectsCompleted || relatedProjects.length || 0;
  const yearsExperience = service.acfFields?.stats?.yearsExperience || 15;
  const clientsSatisfied = service.acfFields?.stats?.clientsSatisfied || 98;

  // Other services (excluding current one)
  const otherServices = allServices.filter(s => s.id !== service.id).slice(0, 3);

  // Service features
  const features = service.acfFields?.serviceFeatures || [];
  const processSteps = service.acfFields?.processSteps || [];

  // Gallery images - Use related projects images or default
  const galleryImages = relatedProjects
    .slice(0, 6)
    .map((project) => ({
      sourceUrl: project.featuredImage?.node?.sourceUrl || '/images/placeholder.jpg',
      altText: project.title,
    }));

  const openGallery = (index: number) => {
    setGalleryIndex(index);
    setGalleryOpen(true);
  };

  return (
    <main className="relative bg-white">
      {/* Hero Section with Parallax */}
      <section
        ref={heroRef}
        className="relative overflow-hidden bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950 px-6 py-32 lg:px-12 lg:py-48"
      >
        {/* Background Effects with Parallax */}
        <motion.div
          style={{ y }}
          className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:80px_80px]"
        />
        <div className="absolute left-0 top-0 h-[600px] w-[600px] rounded-full bg-blue-500/10 blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-[600px] w-[600px] rounded-full bg-purple-500/10 blur-[120px]" />

        <motion.div style={{ opacity }} className="relative z-10 mx-auto max-w-[1400px]">
          {/* Breadcrumbs */}
          <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="mb-8 flex items-center gap-2 text-sm font-light text-neutral-400"
          >
            <Link href="/" className="transition-colors hover:text-white">
              Home
            </Link>
            <ChevronRight size={16} />
            <Link href="/services" className="transition-colors hover:text-white">
              Services
            </Link>
            <ChevronRight size={16} />
            <span className="text-white">{service.title}</span>
          </motion.nav>

          {/* Icon */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isHeroInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-8 inline-flex h-20 w-20 items-center justify-center rounded-full border-2 border-white/20 bg-white/5 backdrop-blur-sm"
          >
            {icon && typeof icon === 'function' ? icon({ className: "h-10 w-10 text-white" }) : null}
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-8 max-w-4xl text-6xl font-light tracking-tight text-white lg:text-8xl"
          >
            {service.title}
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mb-12 max-w-3xl text-xl font-light leading-relaxed text-neutral-300"
          >
            {(service.excerpt || service.acfFields?.description || '').replace(/<[^>]*>/g, '')}
          </motion.p>

          {/* Animated Stats */}
          {(projectCount > 0 || yearsExperience > 0 || clientsSatisfied > 0) && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="grid gap-8 sm:grid-cols-3"
            >
              {projectCount > 0 && (
                <div className="border-l-2 border-white pl-6">
                  <AnimatedCounter end={projectCount} suffix="+" />
                  <div className="text-sm font-light tracking-wider text-neutral-400">
                    PROJECTS COMPLETED
                  </div>
                </div>
              )}
              {yearsExperience > 0 && (
                <div className="border-l-2 border-neutral-700 pl-6">
                  <AnimatedCounter end={yearsExperience} suffix="+" />
                  <div className="text-sm font-light tracking-wider text-neutral-400">
                    YEARS EXPERIENCE
                  </div>
                </div>
              )}
              {clientsSatisfied > 0 && (
                <div className="border-l-2 border-neutral-700 pl-6">
                  <AnimatedCounter end={clientsSatisfied} suffix="%" />
                  <div className="text-sm font-light tracking-wider text-neutral-400">
                    CLIENT SATISFACTION
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </motion.div>
      </section>

      {/* Gallery Section */}
      {galleryImages.length > 0 && (
        <section className="relative bg-neutral-950 px-6 py-24 lg:px-12 lg:py-32">
          <div className="mx-auto max-w-[1600px]">
            <div className="mb-16 text-center">
              <div className="mb-4 flex items-center justify-center gap-4">
                <div className="h-px w-12 bg-gradient-to-r from-transparent to-white/30" />
                <span className="text-sm font-light tracking-[0.3em] text-white/60">
                  PORTFOLIO GALLERY
                </span>
                <div className="h-px w-12 bg-gradient-to-l from-transparent to-white/30" />
              </div>
              <h2 className="mb-6 text-4xl font-light tracking-tight text-white lg:text-5xl">
                Our Work in Action
              </h2>
              <p className="mx-auto max-w-2xl text-lg font-light leading-relaxed text-neutral-400">
                Explore stunning examples of our {service.title.toLowerCase()} projects
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {galleryImages.map((image, index) => (
                <GalleryImage
                  key={index}
                  image={image}
                  index={index}
                  onClick={() => openGallery(index)}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Service Features */}
      {features.length > 0 && (
        <section className="relative bg-white px-6 py-24 lg:px-12 lg:py-32">
          <div className="mx-auto max-w-[1400px]">
            <div className="mb-16">
              <div className="mb-4 flex items-center gap-4">
                <div className="h-px w-12 bg-gradient-to-r from-transparent to-neutral-300" />
                <span className="text-sm font-light tracking-[0.3em] text-neutral-500">
                  KEY FEATURES
                </span>
              </div>
              <h2 className="mb-6 text-4xl font-light tracking-tight text-neutral-950 lg:text-5xl">
                What We Offer
              </h2>
              <p className="max-w-2xl text-lg font-light leading-relaxed text-neutral-600">
                Comprehensive solutions designed to meet your unique needs
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, index) => (
                <FeatureCard key={index} feature={feature} index={index} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Process Steps */}
      {processSteps.length > 0 && (
        <section className="relative bg-neutral-50 px-6 py-24 lg:px-12 lg:py-32">
          <div className="mx-auto max-w-[1400px]">
            <div className="mb-16">
              <div className="mb-4 flex items-center gap-4">
                <div className="h-px w-12 bg-gradient-to-r from-transparent to-neutral-300" />
                <span className="text-sm font-light tracking-[0.3em] text-neutral-500">
                  OUR PROCESS
                </span>
              </div>
              <h2 className="mb-6 text-4xl font-light tracking-tight text-neutral-950 lg:text-5xl">
                How We Work
              </h2>
              <p className="max-w-2xl text-lg font-light leading-relaxed text-neutral-600">
                A structured approach to delivering exceptional results
              </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
              {processSteps.map((step, index) => (
                <ProcessStepCard key={index} step={step} index={index} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Service Content */}
      {service.content && (
        <section className="relative bg-white px-6 py-24 lg:px-12 lg:py-32">
          <div className="mx-auto max-w-4xl">
            <div
              className="prose prose-lg prose-neutral max-w-none"
              dangerouslySetInnerHTML={{ __html: service.content }}
            />
          </div>
        </section>
      )}

      {/* Related Industries */}
      {relatedIndustries.length > 0 && (
        <section className="relative bg-neutral-50 px-6 py-24 lg:px-12 lg:py-32">
          <div className="mx-auto max-w-[1400px]">
            <div className="mb-16">
              <div className="mb-4 flex items-center gap-4">
                <div className="h-px w-12 bg-gradient-to-r from-transparent to-neutral-300" />
                <span className="text-sm font-light tracking-[0.3em] text-neutral-500">
                  INDUSTRIES WE SERVE
                </span>
              </div>
              <h2 className="mb-6 text-4xl font-light tracking-tight text-neutral-950 lg:text-5xl">
                Industry Expertise
              </h2>
              <p className="max-w-2xl text-lg font-light leading-relaxed text-neutral-600">
                Specialized experience across diverse sectors
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {relatedIndustries.map((industry, index) => (
                <IndustryCard key={industry.id} industry={industry} index={index} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related Projects */}
      {relatedProjects.length > 0 && (
        <section className="relative bg-white px-6 py-24 lg:px-12 lg:py-32">
          <div className="mx-auto max-w-[1600px]">
            <div className="mb-16">
              <div className="mb-4 flex items-center gap-4">
                <div className="h-px w-12 bg-gradient-to-r from-transparent to-neutral-300" />
                <span className="text-sm font-light tracking-[0.3em] text-neutral-500">
                  FEATURED WORK
                </span>
              </div>
              <h2 className="mb-6 text-4xl font-light tracking-tight text-neutral-950 lg:text-5xl">
                Recent Projects
              </h2>
              <p className="max-w-2xl text-lg font-light leading-relaxed text-neutral-600">
                Explore our portfolio of exceptional design projects
              </p>
            </div>

            <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
              {relatedProjects.slice(0, 6).map((project, index) => (
                <ProjectCard key={project.id} project={project} index={index} />
              ))}
            </div>

            {relatedProjects.length > 6 && (
              <div className="mt-16 text-center">
                <Link
                  href="/projects"
                  className="group inline-flex items-center gap-3 border-b-2 border-neutral-950 pb-1 text-sm font-light tracking-widest text-neutral-950 transition-all hover:gap-5"
                >
                  <span>VIEW ALL PROJECTS</span>
                  <ArrowRight size={18} className="transition-transform group-hover:translate-x-2" />
                </Link>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Other Services */}
      {otherServices.length > 0 && (
        <section className="relative bg-neutral-50 px-6 py-24 lg:px-12 lg:py-32">
          <div className="mx-auto max-w-[1400px]">
            <div className="mb-16 text-center">
              <h2 className="mb-6 text-4xl font-light tracking-tight text-neutral-950 lg:text-5xl">
                Explore Other Services
              </h2>
              <p className="mx-auto max-w-2xl text-lg font-light leading-relaxed text-neutral-600">
                Discover our full range of design services
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {otherServices.map((otherService, index) => (
                <OtherServiceCard key={otherService.id} service={otherService} index={index} />
              ))}
            </div>

            <div className="mt-16 text-center">
              <Link
                href="/services"
                className="group inline-flex items-center gap-3 border-b-2 border-neutral-950 pb-1 text-sm font-light tracking-widest text-neutral-950 transition-all hover:gap-5"
              >
                <span>VIEW ALL SERVICES</span>
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-2" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="relative bg-neutral-950 px-6 py-32 lg:px-12">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-6 text-4xl font-light tracking-tight text-white lg:text-5xl">
            Ready to Get Started?
          </h2>
          <p className="mb-10 text-lg font-light text-neutral-400">
            Let&apos;s discuss how our {service.title.toLowerCase()} services can transform your space.
          </p>
          <Link
            href="/#contact"
            className="group inline-flex items-center gap-3 border border-white px-10 py-5 text-sm font-light tracking-widest text-white transition-all hover:bg-white hover:text-neutral-950"
          >
            <span>GET IN TOUCH</span>
            <ArrowUpRight size={18} className="transition-transform group-hover:rotate-45" />
          </Link>
        </div>
      </section>

      {/* Gallery Modal */}
      {galleryOpen && (
        <ImageGalleryModal
          images={galleryImages}
          initialIndex={galleryIndex}
          onClose={() => setGalleryOpen(false)}
        />
      )}
    </main>
  );
}

// Gallery Image Component
function GalleryImage({ image, index, onClick }: { image: { sourceUrl: string; altText: string }; index: number; onClick: () => void }) {
  const imageRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(imageRef, { once: true, margin: '-100px' });
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      ref={imageRef}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group relative aspect-[4/3] cursor-pointer overflow-hidden bg-neutral-100"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <motion.div
        className="relative h-full w-full"
        animate={{
          scale: isHovered ? 1.1 : 1,
        }}
        transition={{ duration: 0.6 }}
      >
        <Image
          src={image.sourceUrl}
          alt={image.altText}
          fill
          className="object-cover"
        />
      </motion.div>

      {/* Overlay */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center bg-neutral-950/0"
        animate={{
          backgroundColor: isHovered ? 'rgba(10, 10, 10, 0.7)' : 'rgba(10, 10, 10, 0)',
        }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          initial={{ scale: 0, rotate: -45 }}
          animate={{
            scale: isHovered ? 1 : 0,
            rotate: isHovered ? 0 : -45,
            opacity: isHovered ? 1 : 0,
          }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-white bg-white/10 backdrop-blur-sm"
        >
          <ZoomIn className="text-white" size={28} />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

// Feature Card Component
function FeatureCard({ feature, index }: { feature: string; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: '-100px' });
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group relative overflow-hidden border border-neutral-200 p-8 transition-all hover:border-neutral-950 hover:shadow-xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Hover Background Effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-neutral-950 to-neutral-800"
        initial={{ scale: 0, opacity: 0 }}
        animate={{
          scale: isHovered ? 2 : 0,
          opacity: isHovered ? 0.05 : 0,
        }}
        transition={{ duration: 0.6 }}
        style={{ transformOrigin: 'bottom left' }}
      />

      <div className="relative z-10">
        <motion.div
          className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-neutral-200 transition-all"
          animate={{
            borderColor: isHovered ? '#0a0a0a' : '#e5e5e5',
            backgroundColor: isHovered ? '#0a0a0a' : 'transparent',
            rotate: isHovered ? 360 : 0,
          }}
          transition={{ duration: 0.6 }}
        >
          <CheckCircle2
            className="h-6 w-6 transition-colors"
            style={{ color: isHovered ? '#ffffff' : '#737373' }}
          />
        </motion.div>
        <p className="text-lg font-light text-neutral-950">{feature}</p>
      </div>
    </motion.div>
  );
}

// Process Step Card Component
function ProcessStepCard({ step, index }: { step: { title: string; description: string }; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: '-100px' });
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, x: index % 2 === 0 ? -40 : 40 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="relative border-l-2 border-neutral-300 pl-8 transition-all"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        className="absolute -left-[9px] top-0 h-4 w-4 rounded-full border-2 bg-white"
        animate={{
          borderColor: isHovered ? '#0a0a0a' : '#d4d4d4',
          backgroundColor: isHovered ? '#0a0a0a' : '#ffffff',
          scale: isHovered ? 1.3 : 1,
        }}
        transition={{ duration: 0.3 }}
      />
      <div className="mb-2 text-sm font-light tracking-wider text-neutral-500">
        STEP {String(index + 1).padStart(2, '0')}
      </div>
      <motion.h3
        className="mb-4 text-2xl font-light tracking-tight text-neutral-950"
        animate={{
          x: isHovered ? 8 : 0,
        }}
        transition={{ duration: 0.3 }}
      >
        {step.title}
      </motion.h3>
      <p className="font-light leading-relaxed text-neutral-600">
        {step.description}
      </p>
    </motion.div>
  );
}

// Industry Card Component
function IndustryCard({ industry, index }: { industry: Industry; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: '-100px' });
  const [isHovered, setIsHovered] = useState(false);

  const getIcon = (title: string) => {
    const iconMap: { [key: string]: typeof Home } = {
      'Residential': Home,
      'Commercial': Building2,
      'Hospitality': Hotel,
      'Retail': Store,
      'Healthcare': Hospital,
      'Education': GraduationCap,
      'Restaurant & F&B': Utensils,
      'Corporate': Briefcase,
    };
    return iconMap[title] || Building2;
  };

  const icon = getIcon(industry.title);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link
        href={`/industries/${industry.slug}`}
        className="block border border-neutral-200 p-8 transition-all hover:border-neutral-950 hover:shadow-xl"
      >
        <div className="mb-6 flex items-center justify-between">
          <motion.div
            className="flex h-14 w-14 items-center justify-center rounded-full border border-neutral-200 transition-all"
            animate={{
              borderColor: isHovered ? '#0a0a0a' : '#e5e5e5',
              backgroundColor: isHovered ? '#0a0a0a' : 'transparent',
              rotate: isHovered ? [0, -10, 10, -10, 0] : 0,
            }}
            transition={{ duration: 0.6 }}
          >
            {icon && typeof icon === 'function' ? (
              <motion.div
                animate={{
                  scale: isHovered ? 1.1 : 1,
                }}
                transition={{ duration: 0.3 }}
              >
                {icon({ className: `h-6 w-6 transition-colors ${isHovered ? 'text-white' : 'text-neutral-600'}` })}
              </motion.div>
            ) : null}
          </motion.div>
          <motion.div
            animate={{
              x: isHovered ? [0, 4, 0] : 0,
              y: isHovered ? [0, -4, 0] : 0,
            }}
            transition={{
              duration: 1,
              repeat: isHovered ? Infinity : 0,
              ease: "easeInOut",
            }}
          >
            <ArrowUpRight className="h-5 w-5 text-neutral-400 transition-colors group-hover:text-neutral-950" />
          </motion.div>
        </div>

        <h3 className="mb-4 text-2xl font-light tracking-tight text-neutral-950">
          {industry.title}
        </h3>

        <p className="text-sm font-light leading-relaxed text-neutral-600">
          {(industry.excerpt || '').replace(/<[^>]*>/g, '').substring(0, 120)}...
        </p>
      </Link>
    </motion.div>
  );
}

// Project Card Component
function ProjectCard({ project, index }: { project: Project; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: '-100px' });
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.1 }}
      className="group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link
        href={`/projects/${project.slug}`}
        className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950"
      >
        <div className="relative mb-6 aspect-[4/3] overflow-hidden bg-neutral-100">
          <motion.div
            className="relative h-full"
            animate={{
              scale: isHovered ? 1.05 : 1,
            }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <Image
              src={project.featuredImage?.node?.sourceUrl || '/placeholder-project.jpg'}
              alt={project.title}
              fill
              className="object-cover"
            />
          </motion.div>

          {/* Gradient overlay */}
          <motion.div
            className="absolute inset-0"
            animate={{
              background: isHovered
                ? 'linear-gradient(180deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.6) 100%)'
                : 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.2) 100%)',
            }}
            transition={{ duration: 0.5 }}
          />

          {/* Project type badge */}
          {project.acfFields?.projectType && (
            <div className="absolute left-4 top-4 bg-white/90 px-3 py-1.5 text-xs font-light tracking-wider text-neutral-950 backdrop-blur-sm">
              {project.acfFields.projectType}
            </div>
          )}

          {/* View icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              initial={{ scale: 0, rotate: -45 }}
              animate={{
                scale: isHovered ? 1 : 0,
                rotate: isHovered ? 0 : -45,
                opacity: isHovered ? 1 : 0,
              }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-white bg-white/10 backdrop-blur-sm"
            >
              <ArrowUpRight className="text-white" size={28} />
            </motion.div>
          </div>
        </div>

        <div>
          <motion.h3
            className="mb-2 text-2xl font-light tracking-tight text-neutral-950 lg:text-3xl"
            animate={{
              color: isHovered ? '#525252' : '#0a0a0a',
            }}
            transition={{ duration: 0.3 }}
          >
            {project.title}
          </motion.h3>

          {project.acfFields?.location && (
            <div className="mb-2 flex items-center gap-2 text-sm font-light text-neutral-500">
              <MapPin size={14} />
              <span>{project.acfFields.location}</span>
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}

// Other Service Card Component
function OtherServiceCard({ service, index }: { service: Service; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: '-50px' });
  const [isHovered, setIsHovered] = useState(false);

  const getServiceIcon = (slug: string) => {
    const iconMap: { [key: string]: typeof Lightbulb } = {
      'fb-restaurants': Utensils,
      'healthcare-wellness-2': Heart,
      'retail-showrooms-2': ShoppingBag,
      'commercial-office-2': Building2,
      'residential-luxury-2': Home,
      'hospitality-hotels-2': Hotel,
      '3d-visualization': Box,
      'turnkey-solutions': Package,
      'project-management': Briefcase,
      'custom-furniture': Sofa,
      'architecture': Building2,
      'interior-design': Palette,
    };
    const IconComponent = iconMap[slug] || Palette;
    return <IconComponent className="h-6 w-6" />;
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link
        href={`/services/${service.slug}`}
        className="group block border border-neutral-200 p-8 transition-all hover:border-neutral-950 hover:bg-neutral-950"
      >
        <div className="mb-6 flex items-center justify-between">
          <motion.div
            className="flex h-12 w-12 items-center justify-center rounded-full border border-neutral-300 text-neutral-600 transition-all group-hover:border-white group-hover:bg-white group-hover:text-neutral-950"
            animate={{
              rotate: isHovered ? 360 : 0,
            }}
            transition={{ duration: 0.6 }}
          >
            {getServiceIcon(service.slug)}
          </motion.div>
          <ArrowRight className="text-neutral-400 transition-all group-hover:translate-x-2 group-hover:text-white" size={20} />
        </div>

        <h3 className="mb-3 text-xl font-light tracking-tight text-neutral-950 transition-colors group-hover:text-white">
          {service.title}
        </h3>

        <p className="text-sm font-light leading-relaxed text-neutral-600 transition-colors group-hover:text-neutral-300">
          {(service.excerpt || '').replace(/<[^>]*>/g, '').substring(0, 100)}...
        </p>
      </Link>
    </motion.div>
  );
}
