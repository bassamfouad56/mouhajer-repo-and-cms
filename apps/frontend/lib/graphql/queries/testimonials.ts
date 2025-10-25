import { gql } from '@apollo/client';

export const GET_TESTIMONIALS = gql`
  query GetTestimonials($filter: TestimonialFilterInput, $limit: Int, $offset: Int) {
    testimonials(filter: $filter, limit: $limit, offset: $offset) {
      id
      name
      role
      company
      commentEn
      commentAr
      rating
      projectTitle
      projectType
      clientImage
      projectImage
      locale
      featured
      published
      reviewDate
      createdAt
      updatedAt
    }
  }
`;

export const GET_TESTIMONIAL = gql`
  query GetTestimonial($id: ID!) {
    testimonial(id: $id) {
      id
      name
      role
      company
      commentEn
      commentAr
      rating
      projectTitle
      projectType
      clientImage
      projectImage
      locale
      featured
      published
      reviewDate
      createdAt
      updatedAt
    }
  }
`;

export const GET_TESTIMONIALS_BY_PROJECT_TYPE = gql`
  query GetTestimonialsByProjectType($projectType: String!, $locale: String) {
    testimonialsByProjectType(projectType: $projectType, locale: $locale) {
      id
      name
      role
      company
      commentEn
      commentAr
      rating
      projectTitle
      projectType
      clientImage
      projectImage
      featured
      reviewDate
      createdAt
    }
  }
`;

export const GET_TESTIMONIALS_COUNT = gql`
  query GetTestimonialsCount($filter: TestimonialFilterInput) {
    testimonialsCount(filter: $filter)
  }
`;
