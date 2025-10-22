const DEFAULT_CMS_URL = 'https://mouhajer-cms.vercel.app';

/**
 * Shared CMS endpoint configuration.
 * Prefer the explicit `NEXT_PUBLIC_CMS_API_URL` so the frontend can talk to
 * the live CMS even when it is hosted separately from the public site URL.
 */
export const cmsBaseUrl =
  process.env['NEXT_PUBLIC_CMS_API_URL'] ||
  process.env['NEXT_PUBLIC_CMS_URL'] ||
  DEFAULT_CMS_URL;

/**
 * GraphQL endpoint exposed by the CMS.
 * Falls back to `${cmsBaseUrl}/api/graphql` so a single env var update keeps both in sync.
 */
export const cmsGraphqlUrl =
  process.env['NEXT_PUBLIC_GRAPHQL_URL'] || `${cmsBaseUrl}/api/graphql`;

