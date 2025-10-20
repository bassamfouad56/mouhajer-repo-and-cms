'use client';

import { useState } from 'react';
import CaseStudyCard from './CaseStudyCard';

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

interface CaseStudyGridProps {
  caseStudies: CaseStudy[];
  locale: string;
}

export default function CaseStudyGrid({ caseStudies, locale }: CaseStudyGridProps) {
  const [filter, setFilter] = useState<string>('all');

  // Get unique categories
  const categories = ['all', ...new Set(caseStudies.map((cs) => cs.category))];

  const filteredCaseStudies =
    filter === 'all'
      ? caseStudies
      : caseStudies.filter((cs) => cs.category === filter);

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-4 justify-center mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors capitalize ${
                filter === category
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              {category === 'all'
                ? locale === 'en'
                  ? 'All Projects'
                  : 'جميع المشاريع'
                : category}
            </button>
          ))}
        </div>

        {/* Case Studies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCaseStudies.map((caseStudy) => (
            <CaseStudyCard key={caseStudy.id} caseStudy={caseStudy} locale={locale} />
          ))}
        </div>

        {/* No Results */}
        {filteredCaseStudies.length === 0 && (
          <div className="text-center py-16">
            <p className="text-xl text-muted-foreground">
              {locale === 'en'
                ? 'No case studies found in this category'
                : 'لم يتم العثور على دراسات حالة في هذه الفئة'}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
