import { gql } from '@apollo/client';

export const GET_SETTINGS = gql`
  query GetSettings {
    settings {
      id
      siteNameEn
      siteNameAr
      siteDescriptionEn
      siteDescriptionAr
      contactEmail
      contactPhone
      contactAddressEn
      contactAddressAr
      socialFacebook
      socialInstagram
      socialTwitter
      socialLinkedin
      socialYoutube
      seoMetaTitleEn
      seoMetaTitleAr
      seoMetaDescriptionEn
      seoMetaDescriptionAr
      seoKeywords
      primaryColor
      logoUrl
      faviconUrl
      updatedAt
    }
  }
`;
