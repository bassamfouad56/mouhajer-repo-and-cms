'use client';

import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Industry, Service, Project } from '@/lib/wordpress';
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
  Users,
  Award,
  TrendingUp,
} from 'lucide-react';

interface IndustriesProps {
  industries: Industry[];
  services?: Service[];
  projects?: Project[];
}

export function Industries({ industries, services = [], projects = [] }: IndustriesProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);

  // Render only CMS industries
  const displayIndustries = industries;

  return (
    <section
      ref={sectionRef}
      id="industries"
      className="relative overflow-hidden bg-gradient-to-b from-[#faf8f5] via-[#f8f6f3] to-[#faf8f5] px-6 py-32 lg:px-12 lg:py-48"
    >
      {/* Background Effects */}
      <div className="absolute left-1/4 top-0 h-[500px] w-[500px] rounded-full bg-[#c9a962]/5 blur-[120px]" />
      <div className="absolute bottom-0 right-1/4 h-[500px] w-[500px] rounded-full bg-[#c9a962]/5 blur-[120px]" />

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
              WHO WE SERVE
            </span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#c9a962]/50" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mb-6 font-SchnyderS text-5xl font-light tracking-tight text-[#262420] sm:text-6xl lg:text-7xl"
          >
            Industries We Transform
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mx-auto max-w-2xl font-Satoshi text-lg font-light leading-relaxed text-[#3d3a36]/70"
          >
            Bringing expertise and innovation across diverse sectors, creating
            spaces that inspire and elevate every industry we touch.
          </motion.p>
        </div>

        {/* Industries Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {displayIndustries.map((industry, index) => (
            <IndustryCard
              key={industry.id}
              industry={industry}
              index={index}
              isSelected={selectedIndustry === industry.id}
              onSelect={() => setSelectedIndustry(industry.id === selectedIndustry ? null : industry.id)}
              relatedServices={services.filter(s =>
                industry.acfFields?.relatedServices?.includes(s.id)
              )}
              relatedProjects={projects.filter(p =>
                industry.acfFields?.relatedProjects?.includes(p.id)
              )}
            />
          ))}
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-24 grid gap-8 md:grid-cols-3"
        >
          <div className="text-center">
            <div className="mb-4 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[#c9a962]/30">
                <Building2 className="h-8 w-8 text-[#c9a962]" />
              </div>
            </div>
            <div className="mb-2 font-SchnyderS text-4xl font-light text-[#262420]">8+</div>
            <div className="font-Satoshi text-sm font-light tracking-wider text-[#3d3a36]/60">
              INDUSTRIES SERVED
            </div>
          </div>
          <div className="text-center">
            <div className="mb-4 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[#c9a962]/30">
                <Award className="h-8 w-8 text-[#c9a962]" />
              </div>
            </div>
            <div className="mb-2 font-SchnyderS text-4xl font-light text-[#262420]">150+</div>
            <div className="font-Satoshi text-sm font-light tracking-wider text-[#3d3a36]/60">
              PROJECTS COMPLETED
            </div>
          </div>
          <div className="text-center">
            <div className="mb-4 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[#c9a962]/30">
                <Users className="h-8 w-8 text-[#c9a962]" />
              </div>
            </div>
            <div className="mb-2 font-SchnyderS text-4xl font-light text-[#262420]">98%</div>
            <div className="font-Satoshi text-sm font-light tracking-wider text-[#3d3a36]/60">
              CLIENT SATISFACTION
            </div>
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-24 text-center"
        >
          <div className="mb-8 h-px w-full bg-gradient-to-r from-transparent via-[#c9a962]/30 to-transparent" />
          <p className="mb-6 font-Satoshi text-sm font-light tracking-wider text-[#3d3a36]/60">
            READY TO TRANSFORM YOUR INDUSTRY?
          </p>
          <a
            href="#contact"
            className="group inline-flex items-center gap-3 border border-[#c9a962] bg-[#c9a962] px-10 py-5 font-Satoshi text-sm font-light tracking-widest text-white transition-all hover:bg-transparent hover:text-[#c9a962]"
          >
            <span>DISCUSS YOUR PROJECT</span>
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-2" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}

function IndustryCard({
  industry,
  index,
  isSelected,
  onSelect,
  relatedServices,
  relatedProjects,
}: {
  industry: Industry;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
  relatedServices: Service[];
  relatedProjects: Project[];
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: '-50px' });

  // Get icon component based on industry title
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
    const IconComponent = iconMap[title] || Building2;
    return <IconComponent className="h-6 w-6" />;
  };

  const projectCount = industry.acfFields?.stats?.projectsCompleted || relatedProjects.length || 0;
  const serviceCount = relatedServices.length || 0;

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.05 }}
      className="group relative h-full cursor-pointer"
      onClick={onSelect}
    >
      {/* Card */}
      <div className={`relative flex h-full flex-col overflow-hidden bg-white/60 backdrop-blur-sm transition-all duration-500 ${
        isSelected ? 'bg-white/90' : 'hover:bg-white/80'
      }`}>
        {/* Top Border */}
        <div className={`h-1 w-full bg-gradient-to-r from-transparent via-[#e8e6e3] to-transparent transition-all duration-500 ${
          isSelected ? 'via-[#c9a962]' : 'group-hover:via-[#c9a962]/50'
        }`} />

        <div className="flex flex-1 flex-col p-8">
          {/* Icon */}
          <div className="mb-6">
            <div className={`flex h-12 w-12 items-center justify-center rounded-full border transition-all duration-500 ${
              isSelected
                ? 'border-[#c9a962] bg-[#c9a962] text-white'
                : 'border-[#e8e6e3] text-[#3d3a36]/60 group-hover:border-[#c9a962]/50'
            }`}>
              {getIcon(industry.title)}
            </div>
          </div>

          {/* Title */}
          <h3 className={`mb-4 font-SchnyderS text-xl font-light tracking-tight transition-all duration-500 lg:text-2xl ${
            isSelected ? 'text-[#262420]' : 'text-[#262420]/90 group-hover:text-[#262420]'
          }`}>
            {industry.title}
          </h3>

          {/* Description */}
          <p className="mb-6 flex-1 font-Satoshi text-sm font-light leading-relaxed text-[#3d3a36]/70">
            {industry.excerpt || industry.acfFields?.description || ''}
          </p>

          {/* Stats */}
          <div className="mb-6 flex items-center gap-6 font-Satoshi text-xs font-light text-[#3d3a36]/60">
            {projectCount > 0 && (
              <div className="flex items-center gap-2">
                <TrendingUp size={14} />
                <span>{projectCount} Projects</span>
              </div>
            )}
            {serviceCount > 0 && (
              <div className="flex items-center gap-2">
                <Award size={14} />
                <span>{serviceCount} Services</span>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="mb-4 h-px w-full bg-gradient-to-r from-transparent via-[#e8e6e3] to-transparent" />

          {/* Expandable Content */}
          <motion.div
            initial={false}
            animate={{
              height: isSelected ? 'auto' : 0,
              opacity: isSelected ? 1 : 0,
            }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            {relatedServices.length > 0 && (
              <div className="mb-4">
                <div className="mb-2 font-Satoshi text-xs font-light tracking-wider text-[#3d3a36]/60">
                  RELATED SERVICES
                </div>
                <div className="flex flex-wrap gap-2">
                  {relatedServices.slice(0, 3).map(service => (
                    <span
                      key={service.id}
                      className="rounded-full border border-[#e8e6e3] px-3 py-1 font-Satoshi text-xs font-light text-[#3d3a36]/70"
                    >
                      {service.title}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {relatedProjects.length > 0 && (
              <div className="mb-4">
                <div className="mb-2 font-Satoshi text-xs font-light tracking-wider text-[#3d3a36]/60">
                  FEATURED PROJECTS
                </div>
                <div className="space-y-2">
                  {relatedProjects.slice(0, 2).map(project => (
                    <div
                      key={project.id}
                      className="font-Satoshi text-sm font-light text-[#262420]/80"
                    >
                      → {project.title}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* Learn More */}
          <div className={`flex items-center gap-2 font-Satoshi text-xs font-light tracking-wider transition-all ${
            isSelected
              ? 'gap-4 text-[#c9a962]'
              : 'text-[#3d3a36]/60 group-hover:gap-4 group-hover:text-[#c9a962]'
          }`}>
            <span>{isSelected ? 'SHOW LESS' : 'EXPLORE'}</span>
            <ArrowRight
              size={14}
              className={`transition-all ${
                isSelected ? 'rotate-90' : 'group-hover:translate-x-1'
              }`}
            />
          </div>
        </div>

        {/* Decorative Elements */}
        <div className={`absolute -right-12 -top-12 h-32 w-32 rounded-full blur-3xl transition-all duration-500 ${
          isSelected ? 'bg-[#c9a962]/10' : 'bg-[#c9a962]/5 group-hover:bg-[#c9a962]/10'
        }`} />
      </div>
    </motion.div>
  );
}

