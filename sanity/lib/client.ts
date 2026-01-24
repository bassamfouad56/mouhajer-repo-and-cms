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

// Client with stega encoding for visual editing in draft mode
// Stega embeds invisible edit markers that the Presentation tool uses
export const clientWithStega = projectId
  ? createClient({
      apiVersion,
      dataset,
      projectId,
      useCdn: false,
      token,
      stega: {
        enabled: true,
        studioUrl: '/studio',
      },
    })
  : {
      fetch: async () => [],
    }
