import { cmsGraphqlUrl } from '@/lib/cms-config';
import { GET_PROJECTS } from './queries/homepage';

export async function queryGraphQL({ query, variables }: { query: string; variables?: any }) {
  const response = await fetch(cmsGraphqlUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 300 },
  });

  if (!response.ok) {
    // Log the error response body for debugging
    const errorText = await response.text();
    console.error(`[GraphQL] Request failed with status ${response.status}`);
    console.error(`[GraphQL] URL: ${cmsGraphqlUrl}`);
    console.error(`[GraphQL] Query (first 200 chars): ${query.substring(0, 200)}...`);
    console.error(`[GraphQL] Variables:`, variables);
    console.error(`[GraphQL] Response body:`, errorText);
    throw new Error(`GraphQL request failed: ${response.status}`);
  }

  const { data, errors } = await response.json();

  if (errors) {
    console.error(`[GraphQL] GraphQL errors:`, errors);
    throw new Error(`GraphQL errors: ${errors.map((e: any) => e.message).join(', ')}`);
  }

  return data;
}

// Fetch page by slug
export async function fetchPageBySlug(slug: string, locale: string) {
  const query = `
    query GetPageBySlug($slugEn: String, $slugAr: String) {
      pageBySlug(slugEn: $slugEn, slugAr: $slugAr) {
        id
        titleEn
        titleAr
        slugEn
        slugAr
        descriptionEn
        descriptionAr
        seoMetaTitleEn
        seoMetaTitleAr
        seoMetaDescEn
        seoMetaDescAr
        seoKeywords
        status
        blocks {
          id
          type
          data
          order
        }
      }
    }
  `;

  const variables = locale === 'ar' ? { slugAr: slug } : { slugEn: slug };

  try {
    const data = await queryGraphQL({ query, variables });
    return data.pageBySlug;
  } catch (error) {
    console.error('Error fetching page:', error);
    return null;
  }
}

// Fetch featured projects
export async function fetchFeaturedProjects(locale: string, limit: number = 10) {
  try {
    const data = await queryGraphQL({
      query: GET_PROJECTS,
      variables: {
        filter: { featured: true, status: 'published' },
        limit,
      },
    });

    return data.projects?.projects || [];
  } catch (error) {
    console.error('Error fetching featured projects:', error);
    return [];
  }
}

// Fetch all projects count
export async function fetchProjectsCount() {
  const query = `
    query GetProjectsCount {
      projects {
        total
      }
    }
  `;

  try {
    const data = await queryGraphQL({ query });
    return data.projects?.total || 0;
  } catch (error) {
    console.error('Error fetching projects count:', error);
    return 0;
  }
}
