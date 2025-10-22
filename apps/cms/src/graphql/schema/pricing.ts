import { gql } from 'graphql-tag';

export const pricingTypeDefs = gql`
  scalar DateTime

  type PricingPlan {
    id: ID!
    nameEn: String!
    nameAr: String
    descriptionEn: String!
    descriptionAr: String
    price: Float
    currency: String!
    pricingModel: String!
    pricePrefix: String
    priceSuffix: String
    tier: String!
    popular: Boolean!
    recommended: Boolean!
    featuresEn: [String!]!
    featuresAr: [String!]!
    includedServices: [String!]!
    deliverables: [String!]!
    limitations: [String!]!
    minProjectSize: String
    maxProjectSize: String
    estimatedTimeline: String
    ctaTextEn: String!
    ctaTextAr: String
    ctaLink: String
    icon: String
    color: String
    badge: String
    order: Int!
    locale: String!
    featured: Boolean!
    published: Boolean!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  input PricingPlanFilterInput {
    locale: String
    tier: String
    popular: Boolean
    recommended: Boolean
    featured: Boolean
    published: Boolean
  }

  input CreatePricingPlanInput {
    nameEn: String!
    nameAr: String
    descriptionEn: String!
    descriptionAr: String
    price: Float
    currency: String
    pricingModel: String
    pricePrefix: String
    priceSuffix: String
    tier: String!
    popular: Boolean
    recommended: Boolean
    featuresEn: [String!]!
    featuresAr: [String!]
    includedServices: [String!]
    deliverables: [String!]
    limitations: [String!]
    minProjectSize: String
    maxProjectSize: String
    estimatedTimeline: String
    ctaTextEn: String
    ctaTextAr: String
    ctaLink: String
    icon: String
    color: String
    badge: String
    order: Int
    locale: String
    featured: Boolean
    published: Boolean
  }

  input UpdatePricingPlanInput {
    nameEn: String
    nameAr: String
    descriptionEn: String
    descriptionAr: String
    price: Float
    currency: String
    pricingModel: String
    pricePrefix: String
    priceSuffix: String
    tier: String
    popular: Boolean
    recommended: Boolean
    featuresEn: [String!]
    featuresAr: [String!]
    includedServices: [String!]
    deliverables: [String!]
    limitations: [String!]
    minProjectSize: String
    maxProjectSize: String
    estimatedTimeline: String
    ctaTextEn: String
    ctaTextAr: String
    ctaLink: String
    icon: String
    color: String
    badge: String
    order: Int
    locale: String
    featured: Boolean
    published: Boolean
  }

  extend type Query {
    pricingPlans(filter: PricingPlanFilterInput, limit: Int = 20, offset: Int = 0): [PricingPlan!]!
    pricingPlan(id: ID!): PricingPlan
    pricingPlansCount(filter: PricingPlanFilterInput): Int!
    pricingPlansByTier(tier: String!, locale: String): [PricingPlan!]!
  }

  extend type Mutation {
    createPricingPlan(input: CreatePricingPlanInput!): PricingPlan!
    updatePricingPlan(id: ID!, input: UpdatePricingPlanInput!): PricingPlan!
    deletePricingPlan(id: ID!): Boolean!
  }
`;
