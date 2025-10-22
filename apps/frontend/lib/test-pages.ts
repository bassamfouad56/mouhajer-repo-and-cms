import { queryGraphQL } from './graphql/server-client';

export async function testPagesQuery() {
  try {
    // Test if pages query exists
    const testQuery = `
      query TestPages {
        pages {
          pages {
            id
            title
            slug
          }
        }
      }
    `;
    
    const result = await queryGraphQL({ query: testQuery });
    console.log('Pages test result:', result);
    return result;
  } catch (error) {
    console.error('Pages query failed:', error);
    
    // Try alternative query structure
    try {
      const altQuery = `
        query TestPagesAlt {
          allPages {
            id
            title
            slug
          }
        }
      `;
      
      const altResult = await queryGraphQL({ query: altQuery });
      console.log('Alternative pages query result:', altResult);
      return altResult;
    } catch (altError) {
      console.error('Alternative pages query also failed:', altError);
      return null;
    }
  }
}