'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import TestimonialCard from './TestimonialCard';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  rating: number;
  comment: string;
  project: string;
  image?: string;
  date: string;
}

interface TestimonialGridProps {
  testimonials: Testimonial[];
  locale: string;
}

export default function TestimonialGrid({ testimonials, locale }: TestimonialGridProps) {
  const t = useTranslations('testimonials');
  const [filter, setFilter] = useState<'all' | 5 | 4>('all');

  const filteredTestimonials = testimonials.filter(testimonial => {
    if (filter === 'all') return true;
    return testimonial.rating === filter;
  });

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        {/* Filter Buttons */}
        <div className="flex justify-center gap-4 mb-12">
          <button
            onClick={() => setFilter('all')}
            className={`px-6 py-2 rounded-full transition-colors ${
              filter === 'all'
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
            aria-label={t('filter.all')}
          >
            {t('filter.all')}
          </button>
          <button
            onClick={() => setFilter(5)}
            className={`px-6 py-2 rounded-full transition-colors ${
              filter === 5
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
            aria-label={t('filter.fiveStars')}
          >
            ⭐⭐⭐⭐⭐ {t('filter.fiveStars')}
          </button>
          <button
            onClick={() => setFilter(4)}
            className={`px-6 py-2 rounded-full transition-colors ${
              filter === 4
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
            aria-label={t('filter.fourStars')}
          >
            ⭐⭐⭐⭐ {t('filter.fourStars')}
          </button>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTestimonials.map((testimonial) => (
            <TestimonialCard
              key={testimonial.id}
              testimonial={testimonial}
              locale={locale}
            />
          ))}
        </div>

        {filteredTestimonials.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            {t('noReviews')}
          </div>
        )}
      </div>
    </section>
  );
}
