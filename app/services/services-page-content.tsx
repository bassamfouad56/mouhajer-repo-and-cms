'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import { Service, Industry } from '@/lib/wordpress';
import {
  Home,
  Ruler,
  Palette,
  Lightbulb,
  Building2,
  Sparkles,
  ArrowRight,
  Check,
  ArrowUpRight,
} from 'lucide-react';

interface ServicesPageContentProps {
  services: Service[];
  industries: Industry[];
}

export default function ServicesPageContent({ services, industries }: ServicesPageContentProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const isHeroInView = useInView(heroRef, { once: true });

  const displayServices = services.length > 0 ? services : placeholderServices;

  return (
    <main className="relative bg-white">
      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative overflow-hidden bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950 px-6 py-32 lg:px-12 lg:py-48"
      >
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:80px_80px]" />
        <div className="absolute left-0 top-0 h-[600px] w-[600px] rounded-full bg-purple-500/10 blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-[600px] w-[600px] rounded-full bg-blue-500/10 blur-[120px]" />

        <div className="relative z-10 mx-auto max-w-[1400px]">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="mb-8 flex items-center gap-4"
          >
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-neutral-600" />
            <span className="text-sm font-light tracking-[0.3em] text-neutral-400">
              WHAT WE OFFER
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mb-8 max-w-4xl text-6xl font-light tracking-tight text-white lg:text-8xl"
          >
            Comprehensive Design Services
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-12 max-w-2xl text-xl font-light leading-relaxed text-neutral-400"
          >
            From initial concept to final installation, we offer end-to-end design
            solutions tailored to transform your vision into extraordinary spaces
            that inspire, function, and endure.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-wrap gap-4"
          >
            <a
              href="#services"
              className="group inline-flex items-center gap-3 border border-white bg-white px-8 py-4 text-sm font-light tracking-widest text-neutral-950 transition-all hover:bg-transparent hover:text-white"
            >
              <span>EXPLORE SERVICES</span>
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-2" />
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-3 border border-neutral-600 px-8 py-4 text-sm font-light tracking-widest text-neutral-400 transition-all hover:border-white hover:text-white"
            >
              <span>GET STARTED</span>
            </a>
          </motion.div>
        </div>
      </section>

      {/* Services Grid Section */}
      <section id="services" className="relative bg-white px-6 py-32 lg:px-12 lg:py-48">
        <div className="mx-auto max-w-[1600px]">
          {/* Grid with alternating layouts */}
          <div className="space-y-24 lg:space-y-32">
            {displayServices.map((service, index) => (
              <ServiceCard
                key={service.id}
                service={service}
                index={index}
                industries={industries}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Process Overview */}
      <section className="relative bg-neutral-50 px-6 py-32 lg:px-12 lg:py-48">
        <div className="mx-auto max-w-[1400px]">
          <div className="mb-16 text-center">
            <h2 className="mb-6 text-5xl font-light tracking-tight text-neutral-950 lg:text-6xl">
              Our Service Process
            </h2>
            <p className="mx-auto max-w-2xl text-lg font-light leading-relaxed text-neutral-600">
              A proven methodology that ensures excellence at every stage
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {processSteps.map((step, index) => (
              <ProcessStep key={index} step={step} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative bg-neutral-950 px-6 py-32 lg:px-12">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-6 text-4xl font-light tracking-tight text-white lg:text-5xl">
            Ready to Start Your Project?
          </h2>
          <p className="mb-10 text-lg font-light text-neutral-400">
            Let's discuss how our services can bring your vision to life
          </p>
          <a
            href="#contact"
            className="group inline-flex items-center gap-3 border border-white px-10 py-5 text-sm font-light tracking-widest text-white transition-all hover:bg-white hover:text-neutral-950"
          >
            <span>SCHEDULE A CONSULTATION</span>
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-2" />
          </a>
        </div>
      </section>
    </main>
  );
}

function ServiceCard({
  service,
  index,
  industries,
}: {
  service: Service;
  index: number;
  industries: Industry[];
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: '-100px' });
  const isEven = index % 2 === 0;

  const getIcon = (title: string) => {
    const iconMap: { [key: string]: typeof Home } = {
      'Interior Design': Home,
      'Space Planning': Ruler,
      'Custom Furniture': Palette,
      'Lighting Design': Lightbulb,
      'Commercial Design': Building2,
      'Consultation': Sparkles,
    };
    const IconComponent = iconMap[title] || Sparkles;
    return IconComponent;
  };

  const Icon = getIcon(service.title);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.1 }}
      className={`grid gap-12 lg:grid-cols-2 lg:gap-16 ${isEven ? '' : 'lg:grid-flow-dense'}`}
    >
      {/* Content Column */}
      <div className={`flex flex-col justify-center ${isEven ? 'lg:pr-8' : 'lg:col-start-2 lg:pl-8'}`}>
        {/* Number Badge */}
        <div className="mb-6 flex items-center gap-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-neutral-950">
            <Icon className="h-8 w-8 text-neutral-950" />
          </div>
          <span className="text-7xl font-light text-neutral-200">
            {String(index + 1).padStart(2, '0')}
          </span>
        </div>

        {/* Service Title */}
        <h3 className="mb-6 text-4xl font-light tracking-tight text-neutral-950 lg:text-5xl">
          {service.title}
        </h3>

        {/* Description */}
        <div
          className="mb-8 text-lg font-light leading-relaxed text-neutral-600"
          dangerouslySetInnerHTML={{
            __html: service.content?.substring(0, 400) || service.excerpt || '',
          }}
        />

        {/* Features List */}
        <div className="mb-8 space-y-3">
          {serviceFeatures[service.title]?.map((feature, i) => (
            <div key={i} className="flex items-start gap-3">
              <Check className="mt-1 h-5 w-5 shrink-0 text-neutral-950" />
              <span className="font-light text-neutral-700">{feature}</span>
            </div>
          ))}
        </div>

        {/* Related Industries */}
        <div className="mb-8">
          <div className="mb-3 text-sm font-light tracking-wider text-neutral-500">
            INDUSTRIES SERVED
          </div>
          <div className="flex flex-wrap gap-2">
            {industries.slice(0, 4).map((industry) => (
              <Link
                key={industry.id}
                href={`#industries`}
                className="rounded-full border border-neutral-300 px-4 py-2 text-sm font-light text-neutral-700 transition-all hover:border-neutral-950 hover:bg-neutral-950 hover:text-white"
              >
                {industry.title}
              </Link>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div>
          <a
            href="#contact"
            className="group inline-flex items-center gap-3 border-b-2 border-neutral-950 pb-1 text-sm font-light tracking-widest text-neutral-950 transition-all hover:gap-5"
          >
            <span>REQUEST THIS SERVICE</span>
            <ArrowUpRight size={18} className="transition-transform group-hover:rotate-45" />
          </a>
        </div>
      </div>

      {/* Visual Column */}
      <div className={`${isEven ? 'lg:col-start-2' : 'lg:col-start-1 lg:row-start-1'}`}>
        <div className="relative aspect-[4/5] overflow-hidden bg-neutral-100">
          {/* Placeholder for service image */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Icon className="h-32 w-32 text-neutral-300" />
          </div>

          {/* Decorative overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-neutral-950/10 to-transparent p-8">
            <div className="text-sm font-light tracking-wider text-neutral-700">
              {service.title}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-3 gap-6 border-t border-neutral-200 pt-6">
          <div>
            <div className="mb-1 text-2xl font-light text-neutral-950">50+</div>
            <div className="text-xs font-light tracking-wider text-neutral-500">
              PROJECTS
            </div>
          </div>
          <div>
            <div className="mb-1 text-2xl font-light text-neutral-950">10+</div>
            <div className="text-xs font-light tracking-wider text-neutral-500">
              YEARS EXP.
            </div>
          </div>
          <div>
            <div className="mb-1 text-2xl font-light text-neutral-950">100%</div>
            <div className="text-xs font-light tracking-wider text-neutral-500">
              SATISFIED
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ProcessStep({ step, index }: { step: typeof processSteps[0]; index: number }) {
  const stepRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(stepRef, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={stepRef}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="relative"
    >
      <div className="mb-6 text-6xl font-light text-neutral-200">
        {String(index + 1).padStart(2, '0')}
      </div>
      <h3 className="mb-4 text-2xl font-light tracking-tight text-neutral-950">
        {step.title}
      </h3>
      <p className="font-light leading-relaxed text-neutral-600">
        {step.description}
      </p>
    </motion.div>
  );
}

// Placeholder data
const placeholderServices = [
  {
    id: '1',
    title: 'Interior Design',
    excerpt: 'Complete interior design solutions for residential and commercial spaces',
    content: 'Our interior design service transforms spaces into stunning environments that reflect your unique style and vision. We handle everything from concept development to final installation, ensuring every detail is perfectly executed.',
    featuredImage: { node: { sourceUrl: '', altText: '' } },
  },
  {
    id: '2',
    title: 'Space Planning',
    excerpt: 'Intelligent layouts that optimize functionality',
    content: 'Strategic space planning that maximizes the potential of every square foot. We analyze flow, function, and form to create layouts that enhance daily living and working experiences.',
    featuredImage: { node: { sourceUrl: '', altText: '' } },
  },
  {
    id: '3',
    title: 'Custom Furniture',
    excerpt: 'Bespoke furniture pieces designed for your space',
    content: 'Our custom furniture service brings unique, handcrafted pieces that perfectly complement your interior design. From concept sketches to final production, we create furniture that is both beautiful and functional.',
    featuredImage: { node: { sourceUrl: '', altText: '' } },
  },
];

const serviceFeatures: { [key: string]: string[] } = {
  'Interior Design': [
    'Complete design concept development',
    'Material and finish selection',
    'Custom color palettes',
    '3D visualization and renderings',
    'Project management and installation',
  ],
  'Space Planning': [
    'Functional layout optimization',
    'Traffic flow analysis',
    'Furniture placement strategies',
    'Ergonomic considerations',
    'Spatial efficiency maximization',
  ],
  'Custom Furniture': [
    'Bespoke design creation',
    'Material sourcing and selection',
    'Artisan craftsmanship',
    'Quality control oversight',
    'Delivery and installation',
  ],
  'Lighting Design': [
    'Ambient lighting strategies',
    'Task lighting solutions',
    'Accent and feature lighting',
    'Smart lighting integration',
    'Energy efficiency optimization',
  ],
  'Commercial Design': [
    'Brand-aligned workspace design',
    'Employee wellness focus',
    'Productivity optimization',
    'Flexible space solutions',
    'Corporate identity integration',
  ],
  'Consultation': [
    'Initial concept development',
    'Budget planning and management',
    'Vendor and contractor coordination',
    'Timeline development',
    'Expert guidance and support',
  ],
};

const processSteps = [
  {
    title: 'Discovery',
    description: 'We begin by understanding your vision, needs, and goals through in-depth consultation.',
  },
  {
    title: 'Design',
    description: 'Our team develops comprehensive design concepts with detailed renderings and specifications.',
  },
  {
    title: 'Development',
    description: 'We refine the design, select materials, and coordinate with craftsmen and suppliers.',
  },
  {
    title: 'Delivery',
    description: 'Professional installation and final styling bring your vision to life with precision.',
  },
];
