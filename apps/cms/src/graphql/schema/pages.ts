import { gql } from 'graphql-tag';

export const pageTypeDefs = gql`
  type Block {
    id: ID!
    type: String!
    data: JSON!
    order: Int!
  }

  type Page {
    id: ID!
    titleEn: String!
    titleAr: String!
    slugEn: String!
    slugAr: String!
    descriptionEn: String
    descriptionAr: String
    blocks: [Block!]!
    seoMetaTitleEn: String
    seoMetaTitleAr: String
    seoMetaDescEn: String
    seoMetaDescAr: String
    seoKeywords: [String!]!
    status: String!
    featured: Boolean!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  input BlockInput {
    type: String!
    data: JSON!
    order: Int
  }

  input CreatePageInput {
    titleEn: String!
    titleAr: String!
    slugEn: String!
    slugAr: String!
    descriptionEn: String
    descriptionAr: String
    blocks: [BlockInput!]
    seoMetaTitleEn: String
    seoMetaTitleAr: String
    seoMetaDescEn: String
    seoMetaDescAr: String
    seoKeywords: [String!]
    status: String
    featured: Boolean
  }

  input UpdatePageInput {
    titleEn: String
    titleAr: String
    slugEn: String
    slugAr: String
    descriptionEn: String
    descriptionAr: String
    blocks: [BlockInput!]
    seoMetaTitleEn: String
    seoMetaTitleAr: String
    seoMetaDescEn: String
    seoMetaDescAr: String
    seoKeywords: [String!]
    status: String
    featured: Boolean
  }

  input PageFilterInput {
    status: String
    featured: Boolean
    search: String
  }

  type PagesResponse {
    pages: [Page!]!
    total: Int!
    hasMore: Boolean!
  }

  extend type Query {
    pages(
      filter: PageFilterInput
      limit: Int = 10
      offset: Int = 0
    ): PagesResponse!
    page(id: ID!): Page
    pageBySlug(slugEn: String, slugAr: String): Page
  }

  extend type Mutation {
    createPage(input: CreatePageInput!): Page!
    updatePage(id: ID!, input: UpdatePageInput!): Page!
    deletePage(id: ID!): Boolean!
  }
`;
