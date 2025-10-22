import { gql } from 'graphql-tag';

export const activityTypeDefs = gql`
  type Activity {
    id: ID!
    type: String!
    description: String!
    userId: String
    userName: String
    metadata: JSON
    createdAt: DateTime!
  }

  input ActivityFilterInput {
    type: String
    userId: String
    startDate: DateTime
    endDate: DateTime
  }

  type ActivityResponse {
    activities: [Activity!]!
    total: Int!
    hasMore: Boolean!
  }

  extend type Query {
    activityLogs(
      filter: ActivityFilterInput
      limit: Int = 20
      offset: Int = 0
    ): ActivityResponse!
    activityLog(id: ID!): Activity
  }

  extend type Mutation {
    logActivity(
      type: String!
      description: String!
      metadata: JSON
    ): Activity!
  }
`;
