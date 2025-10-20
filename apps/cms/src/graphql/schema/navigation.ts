import { gql } from 'graphql-tag';

export const navigationTypeDefs = gql`
  type NavigationItem {
    id: ID!
    labelEn: String!
    labelAr: String!
    urlEn: String!
    urlAr: String!
    order: Int!
    parentId: String
    children: [NavigationItem!]
    published: Boolean!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  input CreateNavigationInput {
    labelEn: String!
    labelAr: String!
    urlEn: String!
    urlAr: String!
    order: Int
    parentId: ID
    published: Boolean
  }

  input UpdateNavigationInput {
    labelEn: String
    labelAr: String
    urlEn: String
    urlAr: String
    order: Int
    parentId: ID
    published: Boolean
  }

  input ReorderNavigationInput {
    id: ID!
    order: Int!
  }

  type NavigationResponse {
    items: [NavigationItem!]!
    total: Int!
  }

  extend type Query {
    navigation(published: Boolean): NavigationResponse!
    navigationItem(id: ID!): NavigationItem
    publicNavigation: NavigationResponse!
  }

  extend type Mutation {
    createNavigationItem(input: CreateNavigationInput!): NavigationItem!
    updateNavigationItem(id: ID!, input: UpdateNavigationInput!): NavigationItem!
    deleteNavigationItem(id: ID!): Boolean!
    reorderNavigation(items: [ReorderNavigationInput!]!): Boolean!
  }
`;
