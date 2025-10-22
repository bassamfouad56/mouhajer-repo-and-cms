import { gql } from '@apollo/client';

export const GET_FAQS = gql`
  query GetFAQs($filter: FAQFilterInput, $limit: Int, $offset: Int) {
    faqs(filter: $filter, limit: $limit, offset: $offset) {
      id
      questionEn
      questionAr
      answerEn
      answerAr
      category
      order
      locale
      featured
      published
      keywords
      viewCount
      helpfulCount
      createdAt
      updatedAt
    }
  }
`;

export const GET_FAQ = gql`
  query GetFAQ($id: ID!) {
    faq(id: $id) {
      id
      questionEn
      questionAr
      answerEn
      answerAr
      category
      order
      locale
      featured
      published
      keywords
      viewCount
      helpfulCount
      createdAt
      updatedAt
    }
  }
`;

export const GET_FAQS_COUNT = gql`
  query GetFAQsCount($filter: FAQFilterInput) {
    faqsCount(filter: $filter)
  }
`;

export const GET_FAQS_BY_CATEGORY = gql`
  query GetFAQsByCategory($category: String!, $locale: String) {
    faqsByCategory(category: $category, locale: $locale) {
      id
      questionEn
      questionAr
      answerEn
      answerAr
      category
      order
      locale
      featured
      published
      keywords
      viewCount
      helpfulCount
      createdAt
      updatedAt
    }
  }
`;
