"use client";

import {
  ProjectFilters,
  FilterOption,
  getProjectTypesForCategory,
  LOCATION_OPTIONS,
} from "@/types/filters";
import { FilterSection, FilterCheckbox } from "./FilterSection";

interface SanityService {
  _id: string;
  title: string | { en?: string; ar?: string };
  slug: { current: string };
}

interface FilterSidebarProps {
  filters: ProjectFilters;
  onChange: (filters: ProjectFilters) => void;
  services?: SanityService[];
  projectTypeCounts?: Record<string, number>;
  locationCounts?: Record<string, number>;
  serviceCounts?: Record<string, number>;
}

export function FilterSidebar({
  filters,
  onChange,
  services = [],
  projectTypeCounts,
  locationCounts,
  serviceCounts,
}: FilterSidebarProps) {
  const projectTypes = getProjectTypesForCategory(filters.category);
  const hasActiveFilters =
    filters.projectTypes.length > 0 ||
    filters.locations.length > 0 ||
    filters.services.length > 0;

  // Handlers
  const toggleProjectType = (type: string) => {
    const newTypes = filters.projectTypes.includes(type)
      ? filters.projectTypes.filter((t) => t !== type)
      : [...filters.projectTypes, type];

    onChange({ ...filters, projectTypes: newTypes });
  };

  const toggleLocation = (location: string) => {
    const newLocations = filters.locations.includes(location)
      ? filters.locations.filter((l) => l !== location)
      : [...filters.locations, location];

    onChange({ ...filters, locations: newLocations });
  };

  const toggleService = (serviceSlug: string) => {
    const newServices = filters.services.includes(serviceSlug)
      ? filters.services.filter((s) => s !== serviceSlug)
      : [...filters.services, serviceSlug];

    onChange({ ...filters, services: newServices });
  };

  const clearAll = () => {
    onChange({
      ...filters,
      projectTypes: [],
      locations: [],
      services: [],
    });
  };

  return (
    <aside className="h-fit border-r border-neutral-200 bg-white">
      <div className="p-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h3 className="font-Satoshi text-sm font-medium uppercase tracking-[0.2em] text-neutral-400">
            Filters
          </h3>

          {/* Clear All Button */}
          {hasActiveFilters && (
            <button
              onClick={clearAll}
              className="font-Satoshi text-xs uppercase tracking-wider text-[#c9a962] transition-colors hover:text-neutral-950"
            >
              Clear All
            </button>
          )}
        </div>

        {/* Project Type Filter */}
        {projectTypes.length > 0 && (
          <FilterSection title="Project Type" defaultExpanded>
            <div className="space-y-1">
              {projectTypes.map((type) => (
                <FilterCheckbox
                  key={type.value}
                  label={type.label}
                  value={type.value}
                  checked={filters.projectTypes.includes(type.value)}
                  onChange={() => toggleProjectType(type.value)}
                  count={projectTypeCounts?.[type.value]}
                />
              ))}
            </div>
          </FilterSection>
        )}

        {/* Location Filter */}
        <FilterSection title="Location" defaultExpanded>
          <div className="space-y-1">
            {LOCATION_OPTIONS.map((location) => (
              <FilterCheckbox
                key={location.value}
                label={location.label}
                value={location.value}
                checked={filters.locations.includes(location.value)}
                onChange={() => toggleLocation(location.value)}
                count={locationCounts?.[location.value]}
              />
            ))}
          </div>
        </FilterSection>

        {/* Service Filter */}
        {services.length > 0 && (
          <FilterSection title="Services" defaultExpanded>
            <div className="space-y-1">
              {services.map((service) => {
                const serviceTitle =
                  typeof service.title === "string"
                    ? service.title
                    : service.title?.en || service.title?.ar || "";
                const serviceSlug = service.slug.current;

                return (
                  <FilterCheckbox
                    key={service._id}
                    label={serviceTitle}
                    value={serviceSlug}
                    checked={filters.services.includes(serviceSlug)}
                    onChange={() => toggleService(serviceSlug)}
                    count={serviceCounts?.[serviceSlug]}
                  />
                );
              })}
            </div>
          </FilterSection>
        )}
      </div>
    </aside>
  );
}
