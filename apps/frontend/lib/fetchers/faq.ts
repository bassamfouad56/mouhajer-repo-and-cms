import { queryGraphQL } from '../graphql/server-client';

export interface FAQ {
  id: string;
  questionEn: string;
  questionAr: string | null;
  answerEn: string;
  answerAr: string | null;
  category: string | null;
  order: number;
  locale: string;
  featured: boolean;
  published: boolean;
  keywords: string[];
  viewCount: number;
  helpfulCount: number;
  createdAt: string;
  updatedAt: string;
}

export async function getFAQs(
  locale: string = 'en',
  options: {
    category?: string;
    featured?: boolean;
    limit?: number;
    offset?: number;
  } = {}
): Promise<FAQ[]> {
  const query = `
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

  const filter: any = {
    locale,
    published: true,
  };

  if (options.category) {
    filter.category = options.category;
  }

  if (options.featured !== undefined) {
    filter.featured = options.featured;
  }

  try {
    const data = await queryGraphQL({
      query,
      variables: {
        filter,
        limit: options.limit || 20,
        offset: options.offset || 0,
      },
    });

    return data.faqs || [];
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    return [];
  }
}

export async function getFAQ(id: string): Promise<FAQ | null> {
  const query = `
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

  try {
    const data = await queryGraphQL({
      query,
      variables: { id },
    });

    return data.faq || null;
  } catch (error) {
    console.error('Error fetching FAQ:', error);
    return null;
  }
}

export async function getFAQsCount(
  locale: string = 'en',
  options: {
    category?: string;
    featured?: boolean;
  } = {}
): Promise<number> {
  const query = `
    query GetFAQsCount($filter: FAQFilterInput) {
      faqsCount(filter: $filter)
    }
  `;

  const filter: any = {
    locale,
    published: true,
  };

  if (options.category) {
    filter.category = options.category;
  }

  if (options.featured !== undefined) {
    filter.featured = options.featured;
  }

  try {
    const data = await queryGraphQL({
      query,
      variables: { filter },
    });

    return data.faqsCount || 0;
  } catch (error) {
    console.error('Error fetching FAQs count:', error);
    return 0;
  }
}

export async function getFAQsByCategory(
  category: string,
  locale: string = 'en'
): Promise<FAQ[]> {
  const query = `
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

  try {
    const data = await queryGraphQL({
      query,
      variables: { category, locale },
    });

    return data.faqsByCategory || [];
  } catch (error) {
    console.error('Error fetching FAQs by category:', error);
    return [];
  }
}
