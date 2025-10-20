import { gql } from '@apollo/client';

export const CREATE_BLOG_POST = gql`
  mutation CreateBlogPost($input: CreateBlogPostInput!) {
    createBlogPost(input: $input) {
      id
      titleEn
      titleAr
      slugEn
      slugAr
      excerptEn
      excerptAr
      contentEn
      contentAr
      featuredImage
      category
      tags
      author
      publishedAt
      featured
      status
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_BLOG_POST = gql`
  mutation UpdateBlogPost($id: ID!, $input: UpdateBlogPostInput!) {
    updateBlogPost(id: $id, input: $input) {
      id
      titleEn
      titleAr
      slugEn
      slugAr
      excerptEn
      excerptAr
      contentEn
      contentAr
      featuredImage
      category
      tags
      author
      publishedAt
      featured
      status
      updatedAt
    }
  }
`;

export const DELETE_BLOG_POST = gql`
  mutation DeleteBlogPost($id: ID!) {
    deleteBlogPost(id: $id)
  }
`;
