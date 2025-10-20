'use client';

import { useState } from 'react';
import FAQAccordion from './FAQAccordion';

interface Question {
  id: string;
  question: string;
  answer: string;
}

interface FAQCategory {
  category: string;
  questions: Question[];
}

interface FAQCategoriesProps {
  faqs: FAQCategory[];
  locale: string;
}

export default function FAQCategories({ faqs, locale }: FAQCategoriesProps) {
  const [activeCategory, setActiveCategory] = useState(0);

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-4 mb-12 justify-center">
            {faqs.map((faq, index) => (
              <button
                key={index}
                onClick={() => setActiveCategory(index)}
                className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                  activeCategory === index
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                }`}
                aria-label={`Show ${faq.category} questions`}
                aria-pressed={activeCategory === index}
              >
                {faq.category}
              </button>
            ))}
          </div>

          {/* FAQ Accordion */}
          <FAQAccordion
            questions={faqs[activeCategory].questions}
            locale={locale}
          />
        </div>
      </div>
    </section>
  );
}
