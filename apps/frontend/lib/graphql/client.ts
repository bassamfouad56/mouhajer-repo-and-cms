import { ApolloClient, InMemoryCache, HttpLink, from } from '@apollo/client';
import { onError } from '@apollo/client/link/error';

const httpLink = new HttpLink({
  uri: process.env['NEXT_PUBLIC_GRAPHQL_URL'] || 'http://localhost:3010/api/graphql',
});

const errorLink = onError((errorResponse: any) => {
  const { graphQLErrors, networkError } = errorResponse || {};
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, path }: any) =>
      console.error(`GraphQL error: ${message} at ${path}`)
    );
  }
  if (networkError) {
    console.error(`Network error: ${networkError}`);
  }
});

export const apolloClient = new ApolloClient({
  link: from([errorLink, httpLink]),
  cache: new InMemoryCache(),
  defaultOptions: {
    query: {
      fetchPolicy: 'cache-first',
      errorPolicy: 'all',
    },
  },
  ssrMode: typeof window === 'undefined',
});
