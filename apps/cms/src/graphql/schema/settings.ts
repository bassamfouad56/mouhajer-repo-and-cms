import { gql } from 'graphql-tag';

export const settingsTypeDefs = gql`
  type Settings {
    id: ID!
    siteNameEn: String!
    siteNameAr: String!
    siteDescriptionEn: String!
    siteDescriptionAr: String!
    contactEmail: String
    contactPhone: String
    contactAddressEn: String
    contactAddressAr: String
    socialFacebook: String
    socialInstagram: String
    socialTwitter: String
    socialLinkedin: String
    socialYoutube: String
    seoMetaTitleEn: String
    seoMetaTitleAr: String
    seoMetaDescriptionEn: String
    seoMetaDescriptionAr: String
    seoKeywords: [String!]!
    primaryColor: String
    logoUrl: String
    faviconUrl: String
    updatedAt: DateTime!
  }

  input UpdateSettingsInput {
    siteNameEn: String
    siteNameAr: String
    siteDescriptionEn: String
    siteDescriptionAr: String
    contactEmail: String
    contactPhone: String
    contactAddressEn: String
    contactAddressAr: String
    socialFacebook: String
    socialInstagram: String
    socialTwitter: String
    socialLinkedin: String
    socialYoutube: String
    seoMetaTitleEn: String
    seoMetaTitleAr: String
    seoMetaDescriptionEn: String
    seoMetaDescriptionAr: String
    seoKeywords: [String!]
    primaryColor: String
    logoUrl: String
    faviconUrl: String
  }

  extend type Query {
    settings: Settings!
  }

  extend type Mutation {
    updateSettings(input: UpdateSettingsInput!): Settings!
  }
`;
