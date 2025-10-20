import { gql } from 'graphql-tag';

export const testimonialTypeDefs = gql`
  scalar DateTime

  type Testimonial {
    id: ID!
    name: String!
    role: String
    company: String
    commentEn: String!
    commentAr: String
    rating: Int!
    projectTitle: String
    projectType: String
    clientImage: String
    projectImage: String
    locale: String!
    featured: Boolean!
    published: Boolean!
    reviewDate: DateTime!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  input TestimonialFilterInput {
    locale: String
    rating: Int
    featured: Boolean
    published: Boolean
  }

  input CreateTestimonialInput {
    name: String!
    role: String
    company: String
    commentEn: String!
    commentAr: String
    rating: Int!
    projectTitle: String
    projectType: String
    clientImage: String
    projectImage: String
    locale: String
    featured: Boolean
    published: Boolean
  }

  input UpdateTestimonialInput {
    name: String
    role: String
    company: String
    commentEn: String
    commentAr: String
    rating: Int
    projectTitle: String
    projectType: String
    clientImage: String
    projectImage: String
    locale: String
    featured: Boolean
    published: Boolean
  }

  extend type Query {
    testimonials(filter: TestimonialFilterInput, limit: Int = 10, offset: Int = 0): [Testimonial!]!
    testimonial(id: ID!): Testimonial
    testimonialsCount(filter: TestimonialFilterInput): Int!
  }

  extend type Mutation {
    createTestimonial(input: CreateTestimonialInput!): Testimonial!
    updateTestimonial(id: ID!, input: UpdateTestimonialInput!): Testimonial!
    deleteTestimonial(id: ID!): Boolean!
  }
`;
