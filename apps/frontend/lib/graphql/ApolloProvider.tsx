'use client';

// NOTE: This file is currently unused. GraphQL/Apollo Client was replaced with REST API.
// Commenting out to avoid build errors. Remove this file if not needed in the future.

// import { ApolloProvider as ApolloProviderBase } from '@apollo/client';
// import { apolloClient } from './client';

export function ApolloProvider({ children }: { children: React.ReactNode }) {
  // return (
  //   <ApolloProviderBase client={apolloClient}>
  //     {children}
  //   </ApolloProviderBase>
  // );
  return <>{children}</>;
}
