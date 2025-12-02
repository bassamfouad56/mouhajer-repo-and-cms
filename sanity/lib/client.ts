import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId, useCdn, token } from '../env'

// Only create a real client if projectId is available
// This prevents build errors when Sanity env vars are not set
export const client = projectId
  ? createClient({
      apiVersion,
      dataset,
      projectId,
      useCdn,
      token,
    })
  : {
      // Stub client that returns empty results when Sanity is not configured
      fetch: async () => [],
    }
