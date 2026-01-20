"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface FilterSectionProps {
  title: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
}

export function FilterSection({
  title,
  children,
  defaultExpanded = true,
}: FilterSectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className="border-b border-neutral-200 last:border-0">
      {/* Section Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between py-4 text-left transition-colors hover:bg-neutral-50"
      >
        <span className="font-Satoshi text-sm font-medium uppercase tracking-[0.15em] text-neutral-900">
          {title}
        </span>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="h-4 w-4 text-neutral-500" strokeWidth={2} />
        </motion.div>
      </button>

      {/* Section Content */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="pb-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Checkbox component for filter options
interface FilterCheckboxProps {
  label: string;
  value: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  count?: number;
}

export function FilterCheckbox({
  label,
  value,
  checked,
  onChange,
  count,
}: FilterCheckboxProps) {
  return (
    <label className="group flex cursor-pointer items-center justify-between py-2 transition-colors hover:bg-neutral-50">
      <div className="flex items-center gap-3">
        {/* Custom Checkbox */}
        <div className="relative flex items-center justify-center">
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            className="peer h-4 w-4 cursor-pointer appearance-none rounded border border-neutral-300 bg-white transition-all checked:border-[#c9a962] checked:bg-[#c9a962]"
          />
          {/* Checkmark */}
          <svg
            className="pointer-events-none absolute h-3 w-3 text-white opacity-0 transition-opacity peer-checked:opacity-100"
            viewBox="0 0 12 10"
            fill="none"
          >
            <path
              d="M1 5L4.5 8.5L11 1.5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Label */}
        <span className="font-Satoshi text-sm font-light text-neutral-700 group-hover:text-neutral-900">
          {label}
        </span>
      </div>

      {/* Count Badge */}
      {count !== undefined && (
        <span className="rounded-full bg-neutral-100 px-2 py-0.5 font-Satoshi text-xs text-neutral-500">
          {count}
        </span>
      )}
    </label>
  );
}
