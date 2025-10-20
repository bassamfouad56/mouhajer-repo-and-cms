import { gql } from 'graphql-tag';

export const userTypeDefs = gql`
  enum UserRole {
    USER
    ADMIN
  }

  type User {
    id: ID!
    name: String!
    email: String!
    role: UserRole!
    image: String
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  input CreateUserInput {
    name: String!
    email: String!
    password: String!
    role: UserRole
  }

  input UpdateUserInput {
    name: String
    email: String
    password: String
    role: UserRole
    image: String
  }

  input UserFilterInput {
    role: UserRole
    search: String
  }

  type UsersResponse {
    users: [User!]!
    total: Int!
    hasMore: Boolean!
  }

  extend type Query {
    users(
      filter: UserFilterInput
      limit: Int = 10
      offset: Int = 0
    ): UsersResponse!
    user(id: ID!): User
    me: User
  }

  extend type Mutation {
    createUser(input: CreateUserInput!): User!
    updateUser(id: ID!, input: UpdateUserInput!): User!
    deleteUser(id: ID!): Boolean!
  }
`;
