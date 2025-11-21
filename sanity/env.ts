export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-11-21'

export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || ''

export const useCdn = false

// Token for server-side usage
export const token = process.env.SANITY_API_TOKEN || ''
