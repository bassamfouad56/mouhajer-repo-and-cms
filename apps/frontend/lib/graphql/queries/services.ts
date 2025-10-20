import { gql } from '@apollo/client';

export const GET_SERVICES = gql`
  query GetServices($filter: ServiceFilterInput, $limit: Int, $offset: Int) {
    services(filter: $filter, limit: $limit, offset: $offset) {
      services {
        id
        titleEn
        titleAr
        descriptionEn
        descriptionAr
        shortDescriptionEn
        shortDescriptionAr
        icon
        featuresEn
        featuresAr
        price
        duration
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

export const GET_SERVICE = gql`
  query GetService($id: ID!) {
    service(id: $id) {
      id
      titleEn
      titleAr
      descriptionEn
      descriptionAr
      shortDescriptionEn
      shortDescriptionAr
      icon
      featuresEn
      featuresAr
      price
      duration
      featured
      status
      createdAt
      updatedAt
    }
  }
`;

export const GET_FEATURED_SERVICES = gql`
  query GetFeaturedServices($limit: Int) {
    services(filter: { featured: true, status: "published" }, limit: $limit) {
      services {
        id
        titleEn
        titleAr
        shortDescriptionEn
        shortDescriptionAr
        icon
        featuresEn
        featuresAr
      }
      total
    }
  }
`;
