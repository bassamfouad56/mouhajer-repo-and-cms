import { gql } from 'graphql-tag';

export const adTypeDefs = gql`
  type Ad {
    id: ID!
    titleEn: String!
    titleAr: String!
    descriptionEn: String
    descriptionAr: String
    imageUrl: String
    linkUrl: String
    placement: String!
    active: Boolean!
    startDate: DateTime
    endDate: DateTime
    impressions: Int!
    clicks: Int!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  input CreateAdInput {
    titleEn: String!
    titleAr: String!
    descriptionEn: String
    descriptionAr: String
    imageUrl: String
    linkUrl: String
    placement: String!
    active: Boolean
    startDate: DateTime
    endDate: DateTime
  }

  input UpdateAdInput {
    titleEn: String
    titleAr: String
    descriptionEn: String
    descriptionAr: String
    imageUrl: String
    linkUrl: String
    placement: String
    active: Boolean
    startDate: DateTime
    endDate: DateTime
  }

  input AdFilterInput {
    placement: String
    active: Boolean
  }

  type AdsResponse {
    ads: [Ad!]!
    total: Int!
    hasMore: Boolean!
  }

  extend type Query {
    ads(
      filter: AdFilterInput
      limit: Int = 10
      offset: Int = 0
    ): AdsResponse!
    ad(id: ID!): Ad
    activeAds(placement: String): [Ad!]!
  }

  extend type Mutation {
    createAd(input: CreateAdInput!): Ad!
    updateAd(id: ID!, input: UpdateAdInput!): Ad!
    deleteAd(id: ID!): Boolean!
    trackAdImpression(id: ID!): Boolean!
    trackAdClick(id: ID!): Boolean!
  }
`;
