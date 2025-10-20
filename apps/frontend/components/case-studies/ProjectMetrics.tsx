'use client';

import { TrendingUp } from 'lucide-react';

interface Metric {
  label: string;
  value: string;
  icon?: React.ReactNode;
}

interface ProjectMetricsProps {
  metrics: Metric[];
  locale: string;
}

export default function ProjectMetrics({ metrics, locale }: ProjectMetricsProps) {
  return (
    <section className="py-16 md:py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <TrendingUp className="w-8 h-8 text-primary" aria-hidden="true" />
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {locale === 'en' ? 'Project Impact' : 'تأثير المشروع'}
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
          {metrics.map((metric, index) => (
            <div
              key={index}
              className="bg-card rounded-xl p-6 text-center shadow-lg border border-border"
            >
              {metric.icon && (
                <div className="flex justify-center mb-3">{metric.icon}</div>
              )}
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                {metric.value}
              </div>
              <div className="text-sm text-muted-foreground">{metric.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
