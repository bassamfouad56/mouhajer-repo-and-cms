import { gql } from '@apollo/client';

export const GET_BLOG_POSTS = gql`
  query GetBlogPosts($filter: BlogPostFilterInput, $limit: Int, $offset: Int) {
    blogPosts(filter: $filter, limit: $limit, offset: $offset) {
      posts {
        id
        titleEn
        titleAr
        slugEn
        slugAr
        excerptEn
        excerptAr
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
      total
      hasMore
    }
  }
`;

export const GET_BLOG_POST = gql`
  query GetBlogPost($id: ID, $slugEn: String, $slugAr: String) {
    blogPost(id: $id, slugEn: $slugEn, slugAr: $slugAr) {
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

export const GET_FEATURED_BLOG_POSTS = gql`
  query GetFeaturedBlogPosts($limit: Int) {
    blogPosts(filter: { featured: true, status: "published" }, limit: $limit) {
      posts {
        id
        titleEn
        titleAr
        slugEn
        slugAr
        excerptEn
        excerptAr
        featuredImage
        category
        publishedAt
      }
      total
    }
  }
`;
