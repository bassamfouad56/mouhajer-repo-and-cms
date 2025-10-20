import { gql } from 'graphql-tag';

export const projectTypeDefs = gql`
  type Project {
    id: ID!
    titleEn: String!
    titleAr: String!
    descriptionEn: String!
    descriptionAr: String!
    images: [String!]!
    category: String!
    featured: Boolean!
    status: String!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  input CreateProjectInput {
    titleEn: String!
    titleAr: String!
    descriptionEn: String!
    descriptionAr: String!
    images: [String!]!
    category: String!
    featured: Boolean
    status: String
  }

  input UpdateProjectInput {
    titleEn: String
    titleAr: String
    descriptionEn: String
    descriptionAr: String
    images: [String!]
    category: String
    featured: Boolean
    status: String
  }

  input ProjectFilterInput {
    category: String
    featured: Boolean
    status: String
    search: String
  }

  type ProjectsResponse {
    projects: [Project!]!
    total: Int!
    hasMore: Boolean!
  }

  extend type Query {
    projects(
      filter: ProjectFilterInput
      limit: Int = 10
      offset: Int = 0
    ): ProjectsResponse!
    project(id: ID!): Project
  }

  extend type Mutation {
    createProject(input: CreateProjectInput!): Project!
    updateProject(id: ID!, input: UpdateProjectInput!): Project!
    deleteProject(id: ID!): Boolean!
  }
`;
