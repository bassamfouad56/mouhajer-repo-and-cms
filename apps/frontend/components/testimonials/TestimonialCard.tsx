'use client';

import { Star, Quote } from 'lucide-react';
import Image from 'next/image';

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

interface TestimonialCardProps {
  testimonial: Testimonial;
  locale: string;
}

export default function TestimonialCard({ testimonial, locale }: TestimonialCardProps) {
  const { name, role, rating, comment, project, image, date } = testimonial;

  return (
    <article className="bg-card rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-border">
      {/* Quote Icon */}
      <div className="mb-4">
        <Quote className="w-10 h-10 text-primary/30" aria-hidden="true" />
      </div>

      {/* Rating */}
      <div className="flex gap-1 mb-4" aria-label={`Rating: ${rating} out of 5 stars`}>
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-5 h-5 ${
              i < rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }`}
            aria-hidden="true"
          />
        ))}
      </div>

      {/* Comment */}
      <p className="text-foreground mb-6 leading-relaxed">
        "{comment}"
      </p>

      {/* Project Info */}
      <div className="mb-6 text-sm text-muted-foreground">
        <span className="font-semibold text-primary">{project}</span>
      </div>

      {/* Author Info */}
      <div className="flex items-center gap-4 pt-4 border-t border-border">
        {image && (
          <div className="relative w-12 h-12 rounded-full overflow-hidden bg-muted">
            <Image
              src={image}
              alt={name}
              fill
              className="object-cover"
              sizes="48px"
            />
          </div>
        )}
        {!image && (
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-primary font-bold text-lg">
              {name.charAt(0)}
            </span>
          </div>
        )}
        <div className="flex-1">
          <div className="font-semibold text-foreground">{name}</div>
          <div className="text-sm text-muted-foreground">{role}</div>
        </div>
      </div>

      {/* Date */}
      <time
        dateTime={date}
        className="block mt-4 text-xs text-muted-foreground"
      >
        {new Date(date).toLocaleDateString(locale === 'ar' ? 'ar-AE' : 'en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
      </time>
    </article>
  );
}
