import { ApolloClient, InMemoryCache } from '@apollo/client';
import { cmsGraphqlUrl } from '@/lib/cms-config';

export const apolloClient = new ApolloClient({
  uri: cmsGraphqlUrl,
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
  },
});
