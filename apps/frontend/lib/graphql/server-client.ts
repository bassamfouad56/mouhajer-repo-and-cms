export async function queryGraphQL({ query, variables }: { query: string; variables?: any }) {
  const response = await fetch(process.env['NEXT_PUBLIC_GRAPHQL_URL'] || 'http://localhost:3010/api/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 300 },
  });

  if (!response.ok) {
    throw new Error(`GraphQL request failed: ${response.status}`);
  }

  const { data, errors } = await response.json();
  
  if (errors) {
    throw new Error(`GraphQL errors: ${errors.map((e: any) => e.message).join(', ')}`);
  }

  return data;
}