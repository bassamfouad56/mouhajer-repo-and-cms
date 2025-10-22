import { gql } from 'graphql-tag';

export const roomRedesignTypeDefs = gql`
  type RoomRedesignImage {
    id: ID!
    userId: String
    originalImageUrl: String!
    redesignedImageUrl: String
    status: String!
    roomType: String
    designStyle: String
    error: String
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  input RoomRedesignFilterInput {
    status: String
    userId: String
  }

  type RoomRedesignResponse {
    images: [RoomRedesignImage!]!
    total: Int!
    hasMore: Boolean!
  }

  extend type Query {
    roomRedesigns(
      filter: RoomRedesignFilterInput
      limit: Int = 10
      offset: Int = 0
    ): RoomRedesignResponse!
    roomRedesign(id: ID!): RoomRedesignImage
    myRoomRedesigns: [RoomRedesignImage!]!
  }

  extend type Mutation {
    verifyRoomRedesign(id: ID!): RoomRedesignImage!
    deleteRoomRedesign(id: ID!): Boolean!
  }
`;
