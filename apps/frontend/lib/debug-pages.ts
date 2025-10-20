import { queryGraphQL } from './graphql/server-client';

export async function debugPages() {
  try {
    // Check what pages exist
    const allPagesQuery = `
      query DebugAllPages {
        allPages {
          id
          title
          slug
        }
      }
    `;
    
    const result = await queryGraphQL({ query: allPagesQuery });
    console.log('All pages in CMS:', result);
    return result;
  } catch (error) {
    console.error('Debug pages failed:', error);
    return null;
  }
}