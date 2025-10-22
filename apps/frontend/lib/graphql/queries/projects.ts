import { gql } from '@apollo/client';

export const GET_PROJECTS = gql`
  query GetProjects($filter: ProjectFilterInput, $limit: Int, $offset: Int) {
    projects(filter: $filter, limit: $limit, offset: $offset) {
      projects {
        id
        titleEn
        titleAr
        descriptionEn
        descriptionAr
        images
        category
        featured
        status
        createdAt
        updatedAt
      }
      total
      hasMore
    }
  }
`;

export const GET_PROJECT = gql`
  query GetProject($id: ID!) {
    project(id: $id) {
      id
      titleEn
      titleAr
      descriptionEn
      descriptionAr
      images
      category
      featured
      status
      createdAt
      updatedAt
    }
  }
`;

export const GET_FEATURED_PROJECTS = gql`
  query GetFeaturedProjects($limit: Int) {
    projects(filter: { featured: true, status: "published" }, limit: $limit) {
      projects {
        id
        titleEn
        titleAr
        descriptionEn
        descriptionAr
        images
        category
      }
      total
    }
  }
`;
