/**
 * Filter types for advanced project filtering system
 */

export type MainCategory = 'residential' | 'commercial' | 'hospitality' | 'ongoing' | 'all';

export interface ProjectFilters {
  category: MainCategory;
  projectTypes: string[];
  locations: string[];
  services: string[];
  search: string;
}

export interface FilterOption {
  label: string;
  value: string;
  count?: number;
}

export interface CategoryCount {
  residential: number;
  commercial: number;
  hospitality: number;
  ongoing: number;
}

// Project type mappings per category
export const PROJECT_TYPES: Record<Exclude<MainCategory, 'all' | 'ongoing'>, FilterOption[]> = {
  residential: [
    { label: 'Villa', value: 'villa' },
    { label: 'Apartment', value: 'apartment' },
    { label: 'Penthouse', value: 'penthouse' },
    { label: 'Townhouse', value: 'townhouse' },
    { label: 'Palace', value: 'palace' },
  ],
  commercial: [
    { label: 'Office', value: 'office' },
    { label: 'Retail Store', value: 'retail-store' },
    { label: 'Showroom', value: 'showroom' },
    { label: 'Medical Clinic', value: 'medical-clinic' },
    { label: 'Educational', value: 'educational' },
  ],
  hospitality: [
    { label: 'Hotel', value: 'hotel' },
    { label: 'Restaurant', value: 'restaurant' },
    { label: 'Cafe', value: 'cafe' },
    { label: 'Bar & Lounge', value: 'bar-lounge' },
    { label: 'Spa', value: 'spa' },
  ],
};

// UAE Cities for location filtering
export const LOCATION_OPTIONS: FilterOption[] = [
  { label: 'Dubai', value: 'dubai' },
  { label: 'Abu Dhabi', value: 'abu-dhabi' },
  { label: 'Sharjah', value: 'sharjah' },
  { label: 'Ajman', value: 'ajman' },
  { label: 'Ras Al Khaimah', value: 'ras-al-khaimah' },
  { label: 'Fujairah', value: 'fujairah' },
  { label: 'Umm Al Quwain', value: 'umm-al-quwain' },
];

// Category metadata for tabs
export const CATEGORY_METADATA: Record<Exclude<MainCategory, 'all'>, {
  label: string;
  icon: string;
  description: string;
}> = {
  residential: {
    label: 'Residential',
    icon: '🏠',
    description: 'Luxury villas, apartments, and penthouses',
  },
  commercial: {
    label: 'Commercial',
    icon: '🏢',
    description: 'Offices, retail spaces, and corporate interiors',
  },
  hospitality: {
    label: 'Hospitality',
    icon: '🏨',
    description: 'Hotels, restaurants, and leisure spaces',
  },
  ongoing: {
    label: 'Ongoing',
    icon: '⚙️',
    description: 'Current projects in development',
  },
};

// Helper functions
export function parseArrayParam(param: string | null): string[] {
  if (!param) return [];
  return param.split(',').filter(Boolean);
}

export function serializeArrayParam(arr: string[]): string {
  return arr.join(',');
}

export function getCategoryLabel(category: MainCategory): string {
  if (category === 'all') return 'All Projects';
  return CATEGORY_METADATA[category].label;
}

export function getProjectTypesForCategory(category: MainCategory): FilterOption[] {
  if (category === 'all' || category === 'ongoing') return [];
  return PROJECT_TYPES[category] || [];
}
