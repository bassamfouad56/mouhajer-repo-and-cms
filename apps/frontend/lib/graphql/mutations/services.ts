import { gql } from '@apollo/client';

export const CREATE_SERVICE = gql`
  mutation CreateService($input: CreateServiceInput!) {
    createService(input: $input) {
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

export const UPDATE_SERVICE = gql`
  mutation UpdateService($id: ID!, $input: UpdateServiceInput!) {
    updateService(id: $id, input: $input) {
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
      updatedAt
    }
  }
`;

export const DELETE_SERVICE = gql`
  mutation DeleteService($id: ID!) {
    deleteService(id: $id)
  }
`;
