import { gql } from 'graphql-tag';

export const serviceTypeDefs = gql`
  type ServiceFAQ {
    questionEn: String!
    questionAr: String!
    answerEn: String!
    answerAr: String!
  }

  type Service {
    id: ID!
    titleEn: String!
    titleAr: String!
    slugEn: String
    slugAr: String
    descriptionEn: String!
    descriptionAr: String!
    shortDescriptionEn: String!
    shortDescriptionAr: String!
    icon: String
    images: [String!]!
    featuresEn: [String!]!
    featuresAr: [String!]!
    price: String
    duration: String
    featured: Boolean!
    status: String!

    # SEO Fields
    seoMetaTitleEn: String
    seoMetaTitleAr: String
    seoMetaDescEn: String
    seoMetaDescAr: String
    seoKeywordsEn: [String!]!
    seoKeywordsAr: [String!]!
    targetLocations: [String!]!
    serviceArea: [String!]!

    # Additional Features
    faqs: [ServiceFAQ!]
    relatedServices: [Service!]

    # Analytics
    viewCount: Int!
    averageRating: Float

    createdAt: DateTime!
    updatedAt: DateTime!
  }

  input ServiceFAQInput {
    questionEn: String!
    questionAr: String!
    answerEn: String!
    answerAr: String!
  }

  input CreateServiceInput {
    titleEn: String!
    titleAr: String!
    slugEn: String
    slugAr: String
    descriptionEn: String!
    descriptionAr: String!
    shortDescriptionEn: String!
    shortDescriptionAr: String!
    icon: String
    images: [String!]
    featuresEn: [String!]!
    featuresAr: [String!]!
    price: String
    duration: String
    featured: Boolean
    status: String

    # SEO Fields
    seoMetaTitleEn: String
    seoMetaTitleAr: String
    seoMetaDescEn: String
    seoMetaDescAr: String
    seoKeywordsEn: [String!]
    seoKeywordsAr: [String!]
    targetLocations: [String!]
    serviceArea: [String!]

    # Additional Features
    faqs: [ServiceFAQInput!]
    relatedServiceIds: [ID!]
  }

  input UpdateServiceInput {
    titleEn: String
    titleAr: String
    slugEn: String
    slugAr: String
    descriptionEn: String
    descriptionAr: String
    shortDescriptionEn: String
    shortDescriptionAr: String
    icon: String
    images: [String!]
    featuresEn: [String!]
    featuresAr: [String!]
    price: String
    duration: String
    featured: Boolean
    status: String

    # SEO Fields
    seoMetaTitleEn: String
    seoMetaTitleAr: String
    seoMetaDescEn: String
    seoMetaDescAr: String
    seoKeywordsEn: [String!]
    seoKeywordsAr: [String!]
    targetLocations: [String!]
    serviceArea: [String!]

    # Additional Features
    faqs: [ServiceFAQInput!]
    relatedServiceIds: [ID!]
  }

  input ServiceFilterInput {
    featured: Boolean
    status: String
    search: String
    targetLocation: String
  }

  type ServicesResponse {
    services: [Service!]!
    total: Int!
    hasMore: Boolean!
  }

  extend type Query {
    services(
      filter: ServiceFilterInput
      limit: Int = 10
      offset: Int = 0
    ): ServicesResponse!
    service(id: ID!): Service
    serviceBySlug(slugEn: String, slugAr: String): Service
  }

  extend type Mutation {
    createService(input: CreateServiceInput!): Service!
    updateService(id: ID!, input: UpdateServiceInput!): Service!
    deleteService(id: ID!): Boolean!
  }
`;
