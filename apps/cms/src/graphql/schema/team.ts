import { gql } from 'graphql-tag';

export const teamTypeDefs = gql`
  scalar DateTime

  type TeamMember {
    id: ID!
    nameEn: String!
    nameAr: String
    roleEn: String!
    roleAr: String
    bioEn: String!
    bioAr: String
    specialties: [String!]!
    yearsExperience: Int
    education: String
    certifications: [String!]!
    profileImage: String
    coverImage: String
    email: String
    phone: String
    linkedin: String
    instagram: String
    behance: String
    portfolio: String
    department: String
    order: Int!
    locale: String!
    featured: Boolean!
    published: Boolean!
    joinedAt: DateTime
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  input TeamMemberFilterInput {
    locale: String
    department: String
    featured: Boolean
    published: Boolean
  }

  input CreateTeamMemberInput {
    nameEn: String!
    nameAr: String
    roleEn: String!
    roleAr: String
    bioEn: String!
    bioAr: String
    specialties: [String!]
    yearsExperience: Int
    education: String
    certifications: [String!]
    profileImage: String
    coverImage: String
    email: String
    phone: String
    linkedin: String
    instagram: String
    behance: String
    portfolio: String
    department: String
    order: Int
    locale: String
    featured: Boolean
    published: Boolean
    joinedAt: DateTime
  }

  input UpdateTeamMemberInput {
    nameEn: String
    nameAr: String
    roleEn: String
    roleAr: String
    bioEn: String
    bioAr: String
    specialties: [String!]
    yearsExperience: Int
    education: String
    certifications: [String!]
    profileImage: String
    coverImage: String
    email: String
    phone: String
    linkedin: String
    instagram: String
    behance: String
    portfolio: String
    department: String
    order: Int
    locale: String
    featured: Boolean
    published: Boolean
    joinedAt: DateTime
  }

  extend type Query {
    teamMembers(filter: TeamMemberFilterInput, limit: Int = 20, offset: Int = 0): [TeamMember!]!
    teamMember(id: ID!): TeamMember
    teamMembersCount(filter: TeamMemberFilterInput): Int!
    teamMembersByDepartment(department: String!, locale: String): [TeamMember!]!
  }

  extend type Mutation {
    createTeamMember(input: CreateTeamMemberInput!): TeamMember!
    updateTeamMember(id: ID!, input: UpdateTeamMemberInput!): TeamMember!
    deleteTeamMember(id: ID!): Boolean!
  }
`;
