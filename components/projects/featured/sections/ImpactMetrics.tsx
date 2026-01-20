"use client";

import { useRef, useEffect, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useInView,
} from "framer-motion";

interface HighlightStat {
  value?: string;
  label?: { en?: string; ar?: string };
  suffix?: string;
}

interface ImpactMetricsProps {
  area?: number;
  duration?: {
    startDate?: string;
    endDate?: string;
    months?: number;
  };
  budget?: {
    amount?: number;
    currency?: string;
    range?: string;
  };
  units?: {
    count?: number;
    label?: string;
  };
  year?: number;
  status?: string;
  highlightStats?: HighlightStat[];
  locale: string;
}

// Animated Counter Component
function AnimatedCounter({
  value,
  suffix = "",
  duration = 2000,
}: {
  value: number;
  suffix?: string;
  duration?: number;
}) {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!isInView) return;

    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setDisplayValue(Math.floor(value * easeOutQuart));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [value, duration, isInView]);

  return (
    <span ref={ref} className="tabular-nums">
      {displayValue.toLocaleString()}
      {suffix}
    </span>
  );
}

// Radial Progress Ring
function RadialProgress({
  value,
  max,
  label,
  suffix = "",
  delay = 0,
}: {
  value: number;
  max: number;
  label: string;
  suffix?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const percentage = (value / max) * 100;

  return (
    <motion.div
      ref={ref}
      className="flex flex-col items-center"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ delay, duration: 0.6 }}
    >
      <div className="relative w-32 h-32 md:w-40 md:h-40">
        {/* Background Ring */}
        <svg className="w-full h-full -rotate-90">
          <circle
            cx="50%"
            cy="50%"
            r="45%"
            fill="none"
            stroke="rgba(201, 169, 98, 0.1)"
            strokeWidth="4"
          />
          {/* Progress Ring */}
          <motion.circle
            cx="50%"
            cy="50%"
            r="45%"
            fill="none"
            stroke="#c9a962"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={`${percentage * 2.827} 282.7`}
            initial={{ strokeDasharray: "0 282.7" }}
            animate={
              isInView ? { strokeDasharray: `${percentage * 2.827} 282.7` } : {}
            }
            transition={{ delay: delay + 0.3, duration: 1.5, ease: "easeOut" }}
          />
        </svg>
        {/* Center Value */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl md:text-4xl font-light text-white">
            <AnimatedCounter value={value} suffix={suffix} />
          </span>
        </div>
      </div>
      <span className="mt-4 text-white/60 text-sm tracking-wider uppercase text-center">
        {label}
      </span>
    </motion.div>
  );
}

export function ImpactMetrics({
  area,
  duration,
  budget,
  units,
  year,
  status,
  highlightStats,
  locale,
}: ImpactMetricsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isRTL = locale === "ar";

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 0.3], [50, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);

  const labels = {
    en: {
      area: "Total Area",
      sqm: "sqm",
      duration: "Duration",
      months: "months",
      budget: "Budget",
      units: "Units",
      year: "Year",
      status: "Status",
    },
    ar: {
      area: "المساحة الكلية",
      sqm: "م²",
      duration: "المدة",
      months: "شهر",
      budget: "الميزانية",
      units: "الوحدات",
      year: "السنة",
      status: "الحالة",
    },
  };

  const t = isRTL ? labels.ar : labels.en;

  // Build metrics array from available data
  const metrics: Array<{
    value: string | number;
    label: string;
    suffix?: string;
    isLarge?: boolean;
  }> = [];

  // Add highlight stats first (from CMS)
  if (highlightStats && highlightStats.length > 0) {
    highlightStats.forEach((stat) => {
      if (stat.value) {
        metrics.push({
          value: stat.value,
          label: isRTL
            ? stat.label?.ar || stat.label?.en || ""
            : stat.label?.en || "",
          suffix: stat.suffix,
          isLarge: true,
        });
      }
    });
  }

  // Add standard project metrics if no highlight stats
  if (metrics.length === 0) {
    if (area) {
      metrics.push({
        value: area,
        label: t.area,
        suffix: ` ${t.sqm}`,
        isLarge: true,
      });
    }
    if (duration?.months) {
      metrics.push({
        value: duration.months,
        label: t.duration,
        suffix: ` ${t.months}`,
      });
    }
    if (units?.count) {
      metrics.push({ value: units.count, label: units.label || t.units });
    }
    if (year) {
      metrics.push({ value: year, label: t.year });
    }
  }

  // Budget display
  const getBudgetDisplay = () => {
    if (!budget) return null;
    if (budget.amount) {
      const formatter = new Intl.NumberFormat(isRTL ? "ar-AE" : "en-AE", {
        style: "currency",
        currency: budget.currency || "AED",
        maximumFractionDigits: 0,
      });
      return formatter.format(budget.amount);
    }
    if (budget.range) {
      const ranges: Record<string, string> = {
        "under-10m": isRTL ? "أقل من 10 مليون" : "Under 10M",
        "10m-50m": "10M - 50M",
        "50m-100m": "50M - 100M",
        "100m-plus": "100M+",
      };
      return ranges[budget.range] || budget.range;
    }
    return null;
  };

  const budgetDisplay = getBudgetDisplay();
  if (budgetDisplay && metrics.length < 6) {
    metrics.push({ value: budgetDisplay, label: t.budget });
  }

  // Status display
  const getStatusDisplay = () => {
    if (!status) return null;
    const statuses: Record<string, { en: string; ar: string }> = {
      completed: { en: "Completed", ar: "مكتمل" },
      "in-progress": { en: "In Progress", ar: "قيد التنفيذ" },
      awarded: { en: "Awarded", ar: "تم الترسية" },
      "on-hold": { en: "On Hold", ar: "معلق" },
    };
    return isRTL ? statuses[status]?.ar : statuses[status]?.en;
  };

  const statusDisplay = getStatusDisplay();

  if (metrics.length === 0) return null;

  return (
    <section
      ref={containerRef}
      className="relative py-24 md:py-32 bg-gradient-to-b from-[#0a0a0a] to-[#111] overflow-hidden"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #c9a962 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <motion.div
        className="relative z-10 max-w-7xl mx-auto px-6 md:px-16"
        style={{ y, opacity }}
      >
        {/* Section Header */}
        <motion.div
          className="text-center mb-16 md:mb-24"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-[#c9a962] text-sm tracking-[0.3em] uppercase block mb-4">
            {isRTL ? "أرقام مؤثرة" : "Impact Numbers"}
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl text-white font-light">
            {isRTL ? "قصة النجاح بالأرقام" : "The Story in Numbers"}
          </h2>
        </motion.div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 md:gap-12">
          {metrics.map((metric, index) => (
            <motion.div
              key={index}
              className="text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
            >
              {/* Value with animated counter */}
              <div
                className={`${metric.isLarge ? "text-4xl md:text-5xl lg:text-6xl" : "text-3xl md:text-4xl"} font-light text-white mb-3`}
              >
                {typeof metric.value === "number" ? (
                  <AnimatedCounter
                    value={metric.value}
                    suffix={metric.suffix}
                  />
                ) : (
                  <span>
                    {metric.value}
                    {metric.suffix}
                  </span>
                )}
              </div>
              {/* Label */}
              <div className="text-white/50 text-sm tracking-wider uppercase">
                {metric.label}
              </div>
              {/* Decorative line */}
              <motion.div
                className="w-12 h-px bg-[#c9a962]/30 mx-auto mt-4"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 + 0.3, duration: 0.6 }}
              />
            </motion.div>
          ))}
        </div>

        {/* Status Badge */}
        {statusDisplay && (
          <motion.div
            className="mt-16 flex justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <div
              className={`inline-flex items-center gap-3 px-6 py-3 border ${
                status === "completed"
                  ? "border-green-500/30 bg-green-500/10"
                  : status === "in-progress"
                    ? "border-[#c9a962]/30 bg-[#c9a962]/10"
                    : "border-white/20 bg-white/5"
              } rounded-full`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  status === "completed"
                    ? "bg-green-500"
                    : status === "in-progress"
                      ? "bg-[#c9a962] animate-pulse"
                      : "bg-white/50"
                }`}
              />
              <span className="text-white/80 text-sm tracking-wider uppercase">
                {statusDisplay}
              </span>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Decorative Corner Elements */}
      <motion.div
        className="absolute top-8 left-8 w-20 h-20 border-l border-t border-[#c9a962]/20"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
      />
      <motion.div
        className="absolute bottom-8 right-8 w-20 h-20 border-r border-b border-[#c9a962]/20"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5 }}
      />
    </section>
  );
}
