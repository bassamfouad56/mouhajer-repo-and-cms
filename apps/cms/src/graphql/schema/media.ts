import { gql } from 'graphql-tag';

export const mediaTypeDefs = gql`
  type MediaFile {
    id: ID!
    filename: String!
    originalName: String!
    url: String!
    thumbnailUrl: String
    mimeType: String!
    type: String!
    size: Int!
    width: Int
    height: Int
    altEn: String
    altAr: String
    captionEn: String
    captionAr: String
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  input UpdateMediaInput {
    altEn: String
    altAr: String
    captionEn: String
    captionAr: String
  }

  input MediaFilterInput {
    type: String
    search: String
  }

  type MediaResponse {
    files: [MediaFile!]!
    total: Int!
    hasMore: Boolean!
  }

  type Media {
    id: ID!
    title: String!
    url: String!
    type: String!
    altText: String
    caption: String
    size: Int!
    tags: [String!]
    createdAt: DateTime!
  }

  type MediaListResponse {
    media: [Media!]!
    total: Int!
    hasMore: Boolean!
  }

  extend type Query {
    mediaFiles(
      filter: MediaFilterInput
      limit: Int = 20
      offset: Int = 0
    ): MediaResponse!
    mediaFile(id: ID!): MediaFile
    media(limit: Int = 50, tags: [String!]): MediaListResponse!
  }

  extend type Mutation {
    updateMedia(id: ID!, input: UpdateMediaInput!): MediaFile!
    deleteMedia(id: ID!): Boolean!
  }
`;
