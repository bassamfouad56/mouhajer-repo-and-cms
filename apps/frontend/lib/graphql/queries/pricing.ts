import { gql } from '@apollo/client';

export const GET_PRICING_PLANS = gql`
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

export const GET_PRICING_PLAN = gql`
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

export const GET_PRICING_PLANS_BY_TIER = gql`
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

export const GET_PRICING_PLANS_COUNT = gql`
  query GetPricingPlansCount($filter: PricingPlanFilterInput) {
    pricingPlansCount(filter: $filter)
  }
`;
