// Validate API version - must be '1' or date in YYYY-MM-DD format
const rawApiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-11-21'
const validApiVersionRegex = /^(1|20\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))$/
export const apiVersion = validApiVersionRegex.test(rawApiVersion) ? rawApiVersion : '2024-11-21'

// Validate and sanitize dataset - lowercase, numbers, underscores, dashes, max 64 chars
const rawDataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const validDatasetRegex = /^[a-z0-9_-]{1,64}$/
export const dataset = validDatasetRegex.test(rawDataset) ? rawDataset : 'production'

// Validate and sanitize projectId - only allow a-z, 0-9, and dashes
const rawProjectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'r97logzc'
const validProjectIdRegex = /^[a-z0-9-]+$/
export const projectId = validProjectIdRegex.test(rawProjectId) ? rawProjectId : 'r97logzc'

export const useCdn = false

// Token for server-side usage
export const token = process.env.SANITY_API_TOKEN || ''
