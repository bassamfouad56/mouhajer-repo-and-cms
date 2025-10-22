import { gql } from '@apollo/client';

// String version for server-side fetching
export const GET_SERVICES_STRING = `
  query GetServices($filter: ServiceFilterInput, $limit: Int, $offset: Int) {
    services(filter: $filter, limit: $limit, offset: $offset) {
      services {
        id
        titleEn
        titleAr
        slugEn
        slugAr
        descriptionEn
        descriptionAr
        shortDescriptionEn
        shortDescriptionAr
        icon
        images
        featuresEn
        featuresAr
        price
        duration
        featured
        status
        seoMetaTitleEn
        seoMetaTitleAr
        seoMetaDescEn
        seoMetaDescAr
        seoKeywordsEn
        seoKeywordsAr
        targetLocations
        serviceArea
        faqs
        viewCount
        averageRating
        createdAt
        updatedAt
      }
      total
      hasMore
    }
  }
`;

export const GET_SERVICES = gql`
  query GetServices($filter: ServiceFilterInput, $limit: Int, $offset: Int) {
    services(filter: $filter, limit: $limit, offset: $offset) {
      services {
        id
        titleEn
        titleAr
        slugEn
        slugAr
        descriptionEn
        descriptionAr
        shortDescriptionEn
        shortDescriptionAr
        icon
        images
        featuresEn
        featuresAr
        price
        duration
        featured
        status
        seoMetaTitleEn
        seoMetaTitleAr
        seoMetaDescEn
        seoMetaDescAr
        seoKeywordsEn
        seoKeywordsAr
        targetLocations
        serviceArea
        faqs
        viewCount
        averageRating
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
      slugEn
      slugAr
      descriptionEn
      descriptionAr
      shortDescriptionEn
      shortDescriptionAr
      icon
      images
      featuresEn
      featuresAr
      price
      duration
      featured
      status
      seoMetaTitleEn
      seoMetaTitleAr
      seoMetaDescEn
      seoMetaDescAr
      seoKeywordsEn
      seoKeywordsAr
      targetLocations
      serviceArea
      faqs
      viewCount
      averageRating
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
        slugEn
        slugAr
        shortDescriptionEn
        shortDescriptionAr
        icon
        images
        featuresEn
        featuresAr
        price
        duration
        seoMetaTitleEn
        seoMetaTitleAr
        seoMetaDescEn
        seoMetaDescAr
        seoKeywordsEn
        seoKeywordsAr
        targetLocations
        serviceArea
        viewCount
        averageRating
      }
      total
    }
  }
`;
