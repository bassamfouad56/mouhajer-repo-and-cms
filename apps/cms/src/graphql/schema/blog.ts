import { gql } from 'graphql-tag';

export const blogTypeDefs = gql`
  type BlogPost {
    id: ID!
    titleEn: String!
    titleAr: String!
    slugEn: String!
    slugAr: String!
    excerptEn: String!
    excerptAr: String!
    contentEn: String!
    contentAr: String!
    featuredImage: String
    category: String
    tags: [String!]!
    author: String
    publishedAt: DateTime
    featured: Boolean!
    status: String!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  input CreateBlogPostInput {
    titleEn: String!
    titleAr: String!
    slugEn: String!
    slugAr: String!
    excerptEn: String!
    excerptAr: String!
    contentEn: String!
    contentAr: String!
    featuredImage: String
    category: String
    tags: [String!]
    author: String
    publishedAt: DateTime
    featured: Boolean
    status: String
  }

  input UpdateBlogPostInput {
    titleEn: String
    titleAr: String
    slugEn: String
    slugAr: String
    excerptEn: String
    excerptAr: String
    contentEn: String
    contentAr: String
    featuredImage: String
    category: String
    tags: [String!]
    author: String
    publishedAt: DateTime
    featured: Boolean
    status: String
  }

  input BlogPostFilterInput {
    category: String
    featured: Boolean
    status: String
    search: String
    tag: String
  }

  type BlogPostsResponse {
    posts: [BlogPost!]!
    total: Int!
    hasMore: Boolean!
  }

  extend type Query {
    blogPosts(
      filter: BlogPostFilterInput
      limit: Int = 10
      offset: Int = 0
    ): BlogPostsResponse!
    blogPost(id: ID, slugEn: String, slugAr: String): BlogPost
  }

  extend type Mutation {
    createBlogPost(input: CreateBlogPostInput!): BlogPost!
    updateBlogPost(id: ID!, input: UpdateBlogPostInput!): BlogPost!
    deleteBlogPost(id: ID!): Boolean!
  }
`;
