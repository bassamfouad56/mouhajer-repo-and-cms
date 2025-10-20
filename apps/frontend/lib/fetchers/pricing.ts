import { queryGraphQL } from '../graphql/server-client';

export interface PricingPlan {
  id: string;
  nameEn: string;
  nameAr?: string;
  descriptionEn: string;
  descriptionAr?: string;
  price?: number;
  currency: string;
  pricingModel: string;
  pricePrefix?: string;
  priceSuffix?: string;
  tier: string;
  popular: boolean;
  recommended: boolean;
  featuresEn: string[];
  featuresAr: string[];
  includedServices: string[];
  deliverables: string[];
  limitations: string[];
  minProjectSize?: string;
  maxProjectSize?: string;
  estimatedTimeline?: string;
  ctaTextEn: string;
  ctaTextAr?: string;
  ctaLink?: string;
  icon?: string;
  color?: string;
  badge?: string;
  order: number;
  locale: string;
  featured: boolean;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PricingPlanFilterInput {
  locale?: string;
  tier?: string;
  popular?: boolean;
  recommended?: boolean;
  featured?: boolean;
  published?: boolean;
}

export interface GetPricingPlansOptions {
  filter?: PricingPlanFilterInput;
  limit?: number;
  offset?: number;
}

export async function getPricingPlans(options: GetPricingPlansOptions = {}): Promise<PricingPlan[]> {
  const { filter, limit = 20, offset = 0 } = options;

  const query = `
    query GetPricingPlans($filter: PricingPlanFilterInput, $limit: Int, $offset: Int) {
      pricingPlans(filter: $filter, limit: $limit, offset: $offset) {
        id
        nameEn
        nameAr
        descriptionEn
        descriptionAr
        price
        currency
        pricingModel
        pricePrefix
        priceSuffix
        tier
        popular
        recommended
        featuresEn
        featuresAr
        includedServices
        deliverables
        limitations
        minProjectSize
        maxProjectSize
        estimatedTimeline
        ctaTextEn
        ctaTextAr
        ctaLink
        icon
        color
        badge
        order
        locale
        featured
        published
        createdAt
        updatedAt
      }
    }
  `;

  try {
    const data = await queryGraphQL({
      query,
      variables: { filter, limit, offset },
    });

    return data.pricingPlans || [];
  } catch (error) {
    console.error('Error fetching pricing plans:', error);
    return [];
  }
}

export async function getPricingPlan(id: string): Promise<PricingPlan | null> {
  const query = `
    query GetPricingPlan($id: ID!) {
      pricingPlan(id: $id) {
        id
        nameEn
        nameAr
        descriptionEn
        descriptionAr
        price
        currency
        pricingModel
        pricePrefix
        priceSuffix
        tier
        popular
        recommended
        featuresEn
        featuresAr
        includedServices
        deliverables
        limitations
        minProjectSize
        maxProjectSize
        estimatedTimeline
        ctaTextEn
        ctaTextAr
        ctaLink
        icon
        color
        badge
        order
        locale
        featured
        published
        createdAt
        updatedAt
      }
    }
  `;

  try {
    const data = await queryGraphQL({
      query,
      variables: { id },
    });

    return data.pricingPlan || null;
  } catch (error) {
    console.error('Error fetching pricing plan:', error);
    return null;
  }
}

export async function getPricingPlansByTier(tier: string, locale?: string): Promise<PricingPlan[]> {
  const query = `
    query GetPricingPlansByTier($tier: String!, $locale: String) {
      pricingPlansByTier(tier: $tier, locale: $locale) {
        id
        nameEn
        nameAr
        descriptionEn
        descriptionAr
        price
        currency
        pricingModel
        pricePrefix
        priceSuffix
        tier
        popular
        recommended
        featuresEn
        featuresAr
        includedServices
        deliverables
        limitations
        minProjectSize
        maxProjectSize
        estimatedTimeline
        ctaTextEn
        ctaTextAr
        ctaLink
        icon
        color
        badge
        order
        locale
        featured
        published
        createdAt
        updatedAt
      }
    }
  `;

  try {
    const data = await queryGraphQL({
      query,
      variables: { tier, locale },
    });

    return data.pricingPlansByTier || [];
  } catch (error) {
    console.error('Error fetching pricing plans by tier:', error);
    return [];
  }
}

export async function getPricingPlansCount(filter?: PricingPlanFilterInput): Promise<number> {
  const query = `
    query GetPricingPlansCount($filter: PricingPlanFilterInput) {
      pricingPlansCount(filter: $filter)
    }
  `;

  try {
    const data = await queryGraphQL({
      query,
      variables: { filter },
    });

    return data.pricingPlansCount || 0;
  } catch (error) {
    console.error('Error fetching pricing plans count:', error);
    return 0;
  }
}
