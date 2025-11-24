/**
 * Custom Professional Icons for Mouhajer Design
 *
 * Tailored, minimalist SVG icons designed specifically for
 * an architecture and interior design firm.
 */

import React from 'react';

interface IconProps {
  className?: string;
  strokeWidth?: number;
}

/**
 * Architecture/Building Icon - Minimalist architectural blueprint style
 */
export const ArchitectureIcon: React.FC<IconProps> = ({ className = 'h-12 w-12', strokeWidth = 1 }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="square"
    strokeLinejoin="miter"
    className={className}
  >
    <path d="M3 21V9l9-6 9 6v12" />
    <path d="M9 21V12h6v9" />
    <path d="M9 6h2" />
    <path d="M13 6h2" />
    <path d="M9 9h2" />
    <path d="M13 9h2" />
  </svg>
);

/**
 * Interior Design Icon - Sophisticated layout/floor plan style
 */
export const InteriorDesignIcon: React.FC<IconProps> = ({ className = 'h-12 w-12', strokeWidth = 1 }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="square"
    strokeLinejoin="miter"
    className={className}
  >
    <rect x="3" y="3" width="18" height="18" />
    <path d="M3 9h18" />
    <path d="M9 9v12" />
    <path d="M9 3v6" />
    <circle cx="6" cy="6" r="0.5" fill="currentColor" />
    <circle cx="15" cy="6" r="0.5" fill="currentColor" />
  </svg>
);

/**
 * Residential Icon - Clean house/home silhouette
 */
export const ResidentialIcon: React.FC<IconProps> = ({ className = 'h-12 w-12', strokeWidth = 1 }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="square"
    strokeLinejoin="miter"
    className={className}
  >
    <path d="M3 12l9-9 9 9" />
    <path d="M5 10v11h14V10" />
    <path d="M10 21V15h4v6" />
    <path d="M9 7h6" />
  </svg>
);

/**
 * Commercial Icon - Modern office building
 */
export const CommercialIcon: React.FC<IconProps> = ({ className = 'h-12 w-12', strokeWidth = 1 }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="square"
    strokeLinejoin="miter"
    className={className}
  >
    <path d="M4 3h16v18H4z" />
    <path d="M8 7h2" />
    <path d="M14 7h2" />
    <path d="M8 11h2" />
    <path d="M14 11h2" />
    <path d="M8 15h2" />
    <path d="M14 15h2" />
    <path d="M10 21v-4h4v4" />
  </svg>
);

/**
 * Hospitality Icon - Elegant hotel/hospitality symbol
 */
export const HospitalityIcon: React.FC<IconProps> = ({ className = 'h-12 w-12', strokeWidth = 1 }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="square"
    strokeLinejoin="miter"
    className={className}
  >
    <path d="M3 20h18" />
    <path d="M6 20V8l6-5 6 5v12" />
    <path d="M12 3v5" />
    <path d="M9 13h6" />
    <path d="M9 16h6" />
  </svg>
);

/**
 * Retail Icon - Shop/storefront design
 */
export const RetailIcon: React.FC<IconProps> = ({ className = 'h-12 w-12', strokeWidth = 1 }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="square"
    strokeLinejoin="miter"
    className={className}
  >
    <path d="M4 7V4h16v3" />
    <path d="M4 7l2 3h12l2-3" />
    <path d="M6 10v10h12V10" />
    <path d="M10 20v-6h4v6" />
  </svg>
);

/**
 * Healthcare Icon - Medical/wellness facility
 */
export const HealthcareIcon: React.FC<IconProps> = ({ className = 'h-12 w-12', strokeWidth = 1 }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="square"
    strokeLinejoin="miter"
    className={className}
  >
    <circle cx="12" cy="12" r="9" />
    <path d="M12 8v8" />
    <path d="M8 12h8" />
  </svg>
);

/**
 * Restaurants/F&B Icon - Dining/food service
 */
export const RestaurantIcon: React.FC<IconProps> = ({ className = 'h-12 w-12', strokeWidth = 1 }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="square"
    strokeLinejoin="miter"
    className={className}
  >
    <path d="M3 2v7c0 1.1.9 2 2 2h2" />
    <path d="M7 2v20" />
    <path d="M21 15V2l-3 5-3-5v13" />
    <path d="M15 15v6" />
  </svg>
);

/**
 * Check/Success Icon - Minimalist checkmark for features
 */
export const CheckIcon: React.FC<IconProps> = ({ className = 'h-6 w-6', strokeWidth = 1.5 }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="square"
    strokeLinejoin="miter"
    className={className}
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M8 12l3 3 5-6" />
  </svg>
);

/**
 * Process Step Icon - Numbered circle for process steps
 */
export const ProcessStepIcon: React.FC<IconProps & { number?: number }> = ({
  className = 'h-12 w-12',
  strokeWidth = 1,
  number = 1
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="square"
    strokeLinejoin="miter"
    className={className}
  >
    <circle cx="12" cy="12" r="10" />
    <text
      x="12"
      y="16"
      textAnchor="middle"
      fill="currentColor"
      fontSize="10"
      fontWeight="300"
    >
      {number}
    </text>
  </svg>
);

/**
 * Default/Generic Service Icon
 */
export const ServiceIcon: React.FC<IconProps> = ({ className = 'h-12 w-12', strokeWidth = 1 }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="square"
    strokeLinejoin="miter"
    className={className}
  >
    <rect x="3" y="3" width="18" height="18" />
    <path d="M3 9h18" />
    <path d="M3 15h18" />
    <path d="M9 3v18" />
    <path d="M15 3v18" />
  </svg>
);

/**
 * Map icon names to components for easy lookup
 */
export const iconMap = {
  architecture: ArchitectureIcon,
  'interior-design': InteriorDesignIcon,
  residential: ResidentialIcon,
  commercial: CommercialIcon,
  hospitality: HospitalityIcon,
  retail: RetailIcon,
  healthcare: HealthcareIcon,
  restaurant: RestaurantIcon,
  'fb': RestaurantIcon,
  default: ServiceIcon,
};

/**
 * Get icon component by service slug
 */
export function getServiceIcon(slug: string) {
  const lowerSlug = slug.toLowerCase();

  // Try exact match first
  if (iconMap[lowerSlug as keyof typeof iconMap]) {
    return iconMap[lowerSlug as keyof typeof iconMap];
  }

  // Try partial match
  for (const [key, icon] of Object.entries(iconMap)) {
    if (lowerSlug.includes(key)) {
      return icon;
    }
  }

  // Return default icon
  return iconMap.default;
}

export default {
  ArchitectureIcon,
  InteriorDesignIcon,
  ResidentialIcon,
  CommercialIcon,
  HospitalityIcon,
  RetailIcon,
  HealthcareIcon,
  RestaurantIcon,
  CheckIcon,
  ProcessStepIcon,
  ServiceIcon,
  getServiceIcon,
};
