import { gql } from 'graphql-tag';

export const faqTypeDefs = gql`
  scalar DateTime

  type FAQ {
    id: ID!
    questionEn: String!
    questionAr: String
    answerEn: String!
    answerAr: String
    category: String
    order: Int!
    locale: String!
    featured: Boolean!
    published: Boolean!
    keywords: [String!]!
    viewCount: Int!
    helpfulCount: Int!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  input FAQFilterInput {
    locale: String
    category: String
    featured: Boolean
    published: Boolean
  }

  input CreateFAQInput {
    questionEn: String!
    questionAr: String
    answerEn: String!
    answerAr: String
    category: String
    order: Int
    locale: String
    featured: Boolean
    published: Boolean
    keywords: [String!]
  }

  input UpdateFAQInput {
    questionEn: String
    questionAr: String
    answerEn: String
    answerAr: String
    category: String
    order: Int
    locale: String
    featured: Boolean
    published: Boolean
    keywords: [String!]
  }

  extend type Query {
    faqs(filter: FAQFilterInput, limit: Int = 20, offset: Int = 0): [FAQ!]!
    faq(id: ID!): FAQ
    faqsCount(filter: FAQFilterInput): Int!
    faqsByCategory(category: String!, locale: String): [FAQ!]!
  }

  extend type Mutation {
    createFAQ(input: CreateFAQInput!): FAQ!
    updateFAQ(id: ID!, input: UpdateFAQInput!): FAQ!
    deleteFAQ(id: ID!): Boolean!
    incrementFAQHelpful(id: ID!): FAQ!
  }
`;
