"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import {
  ProjectFilters,
  PROJECT_TYPES,
  LOCATION_OPTIONS,
} from "@/types/filters";

interface AppliedFiltersProps {
  filters: ProjectFilters;
  onChange: (filters: ProjectFilters) => void;
}

export function AppliedFilters({ filters, onChange }: AppliedFiltersProps) {
  const hasFilters =
    filters.projectTypes.length > 0 || filters.locations.length > 0;

  if (!hasFilters) return null;

  // Get labels for applied filters
  const getProjectTypeLabel = (value: string): string => {
    for (const category of Object.values(PROJECT_TYPES)) {
      const type = category.find((t) => t.value === value);
      if (type) return type.label;
    }
    return value;
  };

  const getLocationLabel = (value: string): string => {
    return LOCATION_OPTIONS.find((l) => l.value === value)?.label || value;
  };

  // Remove handlers
  const removeProjectType = (type: string) => {
    onChange({
      ...filters,
      projectTypes: filters.projectTypes.filter((t) => t !== type),
    });
  };

  const removeLocation = (location: string) => {
    onChange({
      ...filters,
      locations: filters.locations.filter((l) => l !== location),
    });
  };

  const clearAll = () => {
    onChange({
      ...filters,
      projectTypes: [],
      locations: [],
    });
  };

  return (
    <div className="mb-6 flex flex-wrap items-center gap-2">
      <span className="mr-2 font-Satoshi text-xs uppercase tracking-[0.2em] text-neutral-400">
        Applied:
      </span>

      <AnimatePresence mode="popLayout">
        {/* Project Type Chips */}
        {filters.projectTypes.map((type) => (
          <FilterChip
            key={`type-${type}`}
            label={getProjectTypeLabel(type)}
            onRemove={() => removeProjectType(type)}
          />
        ))}

        {/* Location Chips */}
        {filters.locations.map((location) => (
          <FilterChip
            key={`location-${location}`}
            label={getLocationLabel(location)}
            onRemove={() => removeLocation(location)}
          />
        ))}
      </AnimatePresence>

      {/* Clear All */}
      {hasFilters && (
        <button
          onClick={clearAll}
          className="font-Satoshi text-xs uppercase tracking-wider text-neutral-500 transition-colors hover:text-[#c9a962]"
        >
          Clear All
        </button>
      )}
    </div>
  );
}

// Filter Chip Component
interface FilterChipProps {
  label: string;
  onRemove: () => void;
}

function FilterChip({ label, onRemove }: FilterChipProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.2 }}
      className="group flex items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1.5 transition-all hover:border-[#c9a962] hover:bg-[#c9a962]/5"
    >
      <span className="font-Satoshi text-xs font-light text-neutral-700 group-hover:text-neutral-900">
        {label}
      </span>
      <button
        onClick={onRemove}
        className="flex items-center justify-center rounded-full transition-colors hover:bg-[#c9a962]/10"
        aria-label={`Remove ${label} filter`}
      >
        <X
          className="h-3 w-3 text-neutral-500 transition-colors group-hover:text-[#c9a962]"
          strokeWidth={2.5}
        />
      </button>
    </motion.div>
  );
}
