'use client';

import Image from 'next/image';
import { Calendar, MapPin, DollarSign, Clock, ArrowRight } from 'lucide-react';

interface CaseStudy {
  id: string;
  title: string;
  location: string;
  category: string;
  budget: string;
  duration: string;
  completion: string;
  excerpt: string;
  image: string;
  slug: string;
}

interface CaseStudyCardProps {
  caseStudy: CaseStudy;
  locale: string;
}

export default function CaseStudyCard({ caseStudy, locale }: CaseStudyCardProps) {
  const { title, location, category, budget, duration, completion, excerpt, image, slug } =
    caseStudy;

  return (
    <article className="bg-card rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-border group">
      {/* Project Image */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute top-4 left-4">
          <span className="bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-semibold">
            {category}
          </span>
        </div>
      </div>

      {/* Project Details */}
      <div className="p-6">
        <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
          {title}
        </h3>

        <p className="text-muted-foreground mb-6 leading-relaxed line-clamp-3">
          {excerpt}
        </p>

        {/* Project Metadata */}
        <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="w-4 h-4" aria-hidden="true" />
            <span>{location}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="w-4 h-4" aria-hidden="true" />
            <span>{completion}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <DollarSign className="w-4 h-4" aria-hidden="true" />
            <span>{budget}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="w-4 h-4" aria-hidden="true" />
            <span>{duration}</span>
          </div>
        </div>

        {/* CTA */}
        <a
          href={`/${locale}/case-studies/${slug}`}
          className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all"
        >
          <span>{locale === 'en' ? 'View Case Study' : 'عرض دراسة الحالة'}</span>
          <ArrowRight className="w-5 h-5" aria-hidden="true" />
        </a>
      </div>
    </article>
  );
}
