import { gql } from '@apollo/client';

export const GET_TESTIMONIALS = gql`
  query GetTestimonials($filter: TestimonialFilterInput, $limit: Int, $offset: Int) {
    testimonials(filter: $filter, limit: $limit, offset: $offset) {
      id
      nameEn
      nameAr
      roleEn
      roleAr
      companyEn
      companyAr
      testimonialEn
      testimonialAr
      rating
      projectType
      avatarUrl
      locale
      featured
      published
      createdAt
      updatedAt
    }
  }
`;

export const GET_TESTIMONIAL = gql`
  query GetTestimonial($id: ID!) {
    testimonial(id: $id) {
      id
      nameEn
      nameAr
      roleEn
      roleAr
      companyEn
      companyAr
      testimonialEn
      testimonialAr
      rating
      projectType
      avatarUrl
      locale
      featured
      published
      createdAt
      updatedAt
    }
  }
`;

export const GET_TESTIMONIALS_BY_PROJECT_TYPE = gql`
  query GetTestimonialsByProjectType($projectType: String!, $locale: String) {
    testimonialsByProjectType(projectType: $projectType, locale: $locale) {
      id
      nameEn
      nameAr
      roleEn
      roleAr
      companyEn
      companyAr
      testimonialEn
      testimonialAr
      rating
      projectType
      avatarUrl
      featured
      createdAt
    }
  }
`;

export const GET_TESTIMONIALS_COUNT = gql`
  query GetTestimonialsCount($filter: TestimonialFilterInput) {
    testimonialsCount(filter: $filter)
  }
`;
