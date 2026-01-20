import { algoliasearch } from 'algoliasearch'

const appId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID || ''
const searchKey = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY || ''
const adminKey = process.env.ALGOLIA_ADMIN_KEY || ''

// Search client for frontend (uses search-only key)
export const searchClient = algoliasearch(appId, searchKey)

// Admin client for indexing (server-side only)
export const getAdminClient = () => {
  if (!adminKey) {
    throw new Error('ALGOLIA_ADMIN_KEY is required for indexing')
  }
  return algoliasearch(appId, adminKey)
}

export const ALGOLIA_INDEX_NAME = 'mouhajer_content'
