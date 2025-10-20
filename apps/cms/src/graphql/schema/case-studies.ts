import { gql } from 'graphql-tag';

export const caseStudyTypeDefs = gql`
  scalar DateTime

  type CaseStudy {
    id: ID!
    titleEn: String!
    titleAr: String
    summaryEn: String!
    summaryAr: String
    clientName: String
    clientType: String
    showClientName: Boolean!
    projectType: String!
    location: String
    projectSize: String
    completionDate: DateTime
    duration: String
    challengeEn: String!
    challengeAr: String
    solutionEn: String!
    solutionAr: String
    resultsEn: String!
    resultsAr: String
    heroImage: String
    beforeImages: [String!]!
    afterImages: [String!]!
    gallery: [String!]!
    videoUrl: String
    features: [String!]!
    stylesTags: [String!]!
    budget: Float
    budgetSaved: Float
    timelineMet: Boolean!
    clientSatisfaction: Int
    teamMembers: [String!]!
    contractors: [String!]!
    keywords: [String!]!
    tags: [String!]!
    order: Int!
    locale: String!
    featured: Boolean!
    published: Boolean!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  input CaseStudyFilterInput {
    locale: String
    projectType: String
    featured: Boolean
    published: Boolean
  }

  input CreateCaseStudyInput {
    titleEn: String!
    titleAr: String
    summaryEn: String!
    summaryAr: String
    clientName: String
    clientType: String
    showClientName: Boolean
    projectType: String!
    location: String
    projectSize: String
    completionDate: DateTime
    duration: String
    challengeEn: String!
    challengeAr: String
    solutionEn: String!
    solutionAr: String
    resultsEn: String!
    resultsAr: String
    heroImage: String
    beforeImages: [String!]
    afterImages: [String!]
    gallery: [String!]
    videoUrl: String
    features: [String!]
    stylesTags: [String!]
    budget: Float
    budgetSaved: Float
    timelineMet: Boolean
    clientSatisfaction: Int
    teamMembers: [String!]
    contractors: [String!]
    keywords: [String!]
    tags: [String!]
    order: Int
    locale: String
    featured: Boolean
    published: Boolean
  }

  input UpdateCaseStudyInput {
    titleEn: String
    titleAr: String
    summaryEn: String
    summaryAr: String
    clientName: String
    clientType: String
    showClientName: Boolean
    projectType: String
    location: String
    projectSize: String
    completionDate: DateTime
    duration: String
    challengeEn: String
    challengeAr: String
    solutionEn: String
    solutionAr: String
    resultsEn: String
    resultsAr: String
    heroImage: String
    beforeImages: [String!]
    afterImages: [String!]
    gallery: [String!]
    videoUrl: String
    features: [String!]
    stylesTags: [String!]
    budget: Float
    budgetSaved: Float
    timelineMet: Boolean
    clientSatisfaction: Int
    teamMembers: [String!]
    contractors: [String!]
    keywords: [String!]
    tags: [String!]
    order: Int
    locale: String
    featured: Boolean
    published: Boolean
  }

  extend type Query {
    caseStudies(filter: CaseStudyFilterInput, limit: Int = 20, offset: Int = 0): [CaseStudy!]!
    caseStudy(id: ID!): CaseStudy
    caseStudiesCount(filter: CaseStudyFilterInput): Int!
    caseStudiesByProjectType(projectType: String!, locale: String): [CaseStudy!]!
  }

  extend type Mutation {
    createCaseStudy(input: CreateCaseStudyInput!): CaseStudy!
    updateCaseStudy(id: ID!, input: UpdateCaseStudyInput!): CaseStudy!
    deleteCaseStudy(id: ID!): Boolean!
  }
`;
