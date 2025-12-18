'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Service } from '@/lib/wordpress';
import { ArrowRight, Sparkles, Ruler, Home, Building2, Palette, Lightbulb } from 'lucide-react';

interface ServicesProps {
  services: Service[];
}

export function Services({ services }: ServicesProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  // Use placeholder services if none from WordPress
  const displayServices = services.length > 0 ? services : placeholderServices;

  return (
    <section
      ref={sectionRef}
      id="services"
      className="relative overflow-hidden bg-gradient-to-b from-[#faf8f5] via-[#f8f6f3] to-[#faf8f5] px-6 py-32 lg:px-12 lg:py-48"
    >
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(38,36,32,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(38,36,32,0.03)_1px,transparent_1px)] bg-[size:80px_80px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />

      {/* Gradient Orbs */}
      <div className="absolute left-0 top-1/4 h-[600px] w-[600px] rounded-full bg-[#c9a962]/5 blur-[120px]" />
      <div className="absolute bottom-1/4 right-0 h-[600px] w-[600px] rounded-full bg-[#c9a962]/5 blur-[120px]" />

      {/* Decorative Lines */}
      <div className="absolute left-0 top-0 h-px w-1/3 bg-gradient-to-r from-transparent via-[#c9a962]/30 to-transparent" />
      <div className="absolute bottom-0 right-0 h-px w-1/3 bg-gradient-to-l from-transparent via-[#c9a962]/30 to-transparent" />

      <div className="relative z-10 mx-auto max-w-[1600px]">
        {/* Section Header */}
        <div className="mb-24 text-center lg:mb-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="mb-6 flex items-center justify-center gap-4"
          >
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#c9a962]/50" />
            <span className="text-sm font-light tracking-[0.3em] text-[#c9a962]">
              WHAT WE OFFER
            </span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#c9a962]/50" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mb-6 font-SchnyderS text-5xl font-light tracking-tight text-[#262420] sm:text-6xl lg:text-7xl"
          >
            Our Services
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mx-auto max-w-2xl font-Satoshi text-lg font-light leading-relaxed text-[#3d3a36]/70"
          >
            From concept to completion, we offer comprehensive design services
            tailored to bring your vision to life with precision and elegance.
          </motion.p>
        </div>

        {/* Services Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-10">
          {displayServices.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-24 text-center"
        >
          <div className="mb-8 h-px w-full bg-gradient-to-r from-transparent via-[#c9a962]/30 to-transparent" />
          <p className="mb-6 font-Satoshi text-sm font-light tracking-wider text-[#3d3a36]/60">
            INTERESTED IN OUR SERVICES?
          </p>
          <a
            href="#contact"
            className="group inline-flex items-center gap-3 border border-[#c9a962] bg-[#c9a962] px-10 py-5 font-Satoshi text-sm font-light tracking-widest text-white transition-all hover:bg-transparent hover:text-[#c9a962] focus-visible:bg-transparent focus-visible:text-[#c9a962] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a962] focus-visible:ring-offset-2 focus-visible:ring-offset-[#faf8f5]"
          >
            <span>START YOUR PROJECT</span>
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-2 group-focus-visible:translate-x-2" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}

function ServiceCard({ service, index }: { service: Service; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: '-50px' });

  // Get icon component based on service title
  const getIcon = (title: string) => {
    type IconType = typeof Home;
    const iconMap: { [key: string]: IconType } = {
      'Interior Design': Home,
      'Space Planning': Ruler,
      'Custom Furniture': Palette,
      'Lighting Design': Lightbulb,
      'Commercial Design': Building2,
      'Consultation': Sparkles,
    };
    const IconComponent = iconMap[title] || Sparkles;
    return <IconComponent className="h-8 w-8" />;
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.1 }}
      className="group relative overflow-hidden bg-white/60 backdrop-blur-sm transition-all duration-500 hover:bg-white/90"
    >
      {/* Top Border Accent */}
      <div className="h-1 w-full bg-gradient-to-r from-transparent via-[#e8e6e3] to-transparent transition-all duration-500 group-hover:via-[#c9a962]" />

      <div className="p-10">
        {/* Icon */}
        <div className="mb-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#e8e6e3] text-[#3d3a36]/60 transition-all duration-500 group-hover:border-[#c9a962] group-hover:text-[#c9a962]">
            {getIcon(service.title)}
          </div>
        </div>

        {/* Title */}
        <h3 className="mb-5 font-SchnyderS text-2xl font-light tracking-tight text-[#262420] transition-all duration-500 group-hover:translate-x-1 lg:text-3xl">
          {service.title}
        </h3>

        {/* Description */}
        <div
          className="mb-8 font-Satoshi text-base font-light leading-relaxed text-[#3d3a36]/70"
          dangerouslySetInnerHTML={{
            __html: service.excerpt || service.content?.substring(0, 150) + '...' || ''
          }}
        />

        {/* Divider */}
        <div className="mb-6 h-px w-full bg-gradient-to-r from-transparent via-[#e8e6e3] to-transparent" />

        {/* Learn More Link */}
        <div className="flex items-center gap-3 font-Satoshi text-sm font-light tracking-wider text-[#3d3a36]/60 transition-all group-hover:gap-5 group-hover:text-[#c9a962]">
          <span>LEARN MORE</span>
          <ArrowRight size={18} className="transition-all group-hover:translate-x-2" />
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[#c9a962]/5 blur-3xl transition-all duration-500 group-hover:bg-[#c9a962]/10" />
      <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-[#c9a962]/5 blur-2xl transition-all duration-500 group-hover:bg-[#c9a962]/10" />

      {/* Corner Frame */}
      <div className="absolute bottom-0 right-0 h-20 w-20 border-b border-r border-[#e8e6e3] transition-all duration-500 group-hover:border-[#c9a962]/30" />
    </motion.div>
  );
}

// Placeholder services
const placeholderServices: Service[] = [
  {
    id: '1',
    databaseId: 1,
    slug: 'interior-design',
    title: 'Interior Design',
    excerpt: 'Complete interior design solutions for residential and commercial spaces, tailored to your unique vision and lifestyle.',
    content: '',
    date: new Date().toISOString(),
    modified: new Date().toISOString(),
    featuredImage: { node: { sourceUrl: '', altText: '' } },
  },
  {
    id: '2',
    databaseId: 2,
    slug: 'space-planning',
    title: 'Space Planning',
    excerpt: 'Optimize your space with intelligent layouts that enhance functionality while maintaining aesthetic excellence.',
    content: '',
    date: new Date().toISOString(),
    modified: new Date().toISOString(),
    featuredImage: { node: { sourceUrl: '', altText: '' } },
  },
  {
    id: '3',
    databaseId: 3,
    slug: 'custom-furniture',
    title: 'Custom Furniture',
    excerpt: 'Bespoke furniture pieces designed and crafted to perfectly complement your interior design scheme.',
    content: '',
    date: new Date().toISOString(),
    modified: new Date().toISOString(),
    featuredImage: { node: { sourceUrl: '', altText: '' } },
  },
  {
    id: '4',
    databaseId: 4,
    slug: 'lighting-design',
    title: 'Lighting Design',
    excerpt: 'Strategic lighting solutions that create ambiance, highlight architectural features, and enhance daily living.',
    content: '',
    date: new Date().toISOString(),
    modified: new Date().toISOString(),
    featuredImage: { node: { sourceUrl: '', altText: '' } },
  },
  {
    id: '5',
    databaseId: 5,
    slug: 'commercial-design',
    title: 'Commercial Design',
    excerpt: 'Professional workspace design that balances brand identity, employee wellbeing, and operational efficiency.',
    content: '',
    date: new Date().toISOString(),
    modified: new Date().toISOString(),
    featuredImage: { node: { sourceUrl: '', altText: '' } },
  },
  {
    id: '6',
    databaseId: 6,
    slug: 'consultation',
    title: 'Consultation',
    excerpt: 'Expert design consultation services to guide your project from concept through to successful completion.',
    content: '',
    date: new Date().toISOString(),
    modified: new Date().toISOString(),
    featuredImage: { node: { sourceUrl: '', altText: '' } },
  },
];
