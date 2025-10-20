'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface Question {
  id: string;
  question: string;
  answer: string;
}

interface FAQAccordionProps {
  questions: Question[];
  locale: string;
}

export default function FAQAccordion({ questions, locale }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleQuestion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-4">
      {questions.map((question, index) => (
        <div
          key={question.id}
          className="border border-border rounded-lg overflow-hidden bg-card"
        >
          <button
            onClick={() => toggleQuestion(index)}
            className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-muted/50 transition-colors"
            aria-expanded={openIndex === index}
            aria-controls={`faq-answer-${question.id}`}
          >
            <span className="font-semibold text-lg pr-8">
              {question.question}
            </span>
            <ChevronDown
              className={`w-5 h-5 text-muted-foreground transition-transform flex-shrink-0 ${
                openIndex === index ? 'rotate-180' : ''
              }`}
              aria-hidden="true"
            />
          </button>

          <div
            id={`faq-answer-${question.id}`}
            className={`overflow-hidden transition-all duration-300 ${
              openIndex === index
                ? 'max-h-96 opacity-100'
                : 'max-h-0 opacity-0'
            }`}
            aria-hidden={openIndex !== index}
          >
            <div className="px-6 pb-6 text-muted-foreground leading-relaxed">
              {question.answer}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
