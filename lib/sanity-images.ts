/**
 * Sanity Image Utilities
 *
 * Helper functions to fetch and use images from Sanity CMS
 */

import { client } from '@/sanity/lib/client'
import imageUrlBuilder from '@sanity/image-url'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'

// Image URL builder
const builder = imageUrlBuilder(client)

/**
 * Get optimized image URL from Sanity
 */
export function urlFor(source: SanityImageSource) {
  return builder.image(source)
}

/**
 * Fetch random images from Sanity by category/tag
 */
export async function getSanityImages(options: {
  count?: number
  category?: 'project' | 'service' | 'award' | 'all'
  random?: boolean
}) {
  const { count = 1, category = 'all', random = true } = options

  try {
    let query = `*[_type == "sanity.imageAsset"]`

    if (random) {
      query += ` | order(_createdAt desc)[0...${count * 3}]` // Fetch more for randomization
    } else {
      query += ` | order(_createdAt desc)[0...${count}]`
    }

    query += ` {
      _id,
      url,
      "width": metadata.dimensions.width,
      "height": metadata.dimensions.height,
      "alt": originalFilename,
      originalFilename
    }`

    const images = await client.fetch(query)

    if (random && images.length > count) {
      // Shuffle and return requested count
      return images
        .sort(() => Math.random() - 0.5)
        .slice(0, count)
    }

    return images
  } catch (error) {
    console.error('Error fetching Sanity images:', error)
    return []
  }
}

/**
 * Get a single random image from Sanity
 */
export async function getRandomSanityImage(): Promise<string | null> {
  const images = await getSanityImages({ count: 1, random: true })
  return images[0]?.url || null
}

/**
 * Get project images from Sanity
 */
export async function getProjectImages(projectId: string) {
  try {
    const project = await client.fetch(
      `*[_type == "project" && _id == $projectId][0] {
        images[] {
          asset-> {
            _id,
            url,
            "width": metadata.dimensions.width,
            "height": metadata.dimensions.height,
            "alt": originalFilename
          }
        }
      }`,
      { projectId }
    )

    return project?.images?.map((img: any) => img.asset) || []
  } catch (error) {
    console.error('Error fetching project images:', error)
    return []
  }
}

/**
 * Get images for a specific project slug
 */
export async function getProjectImagesBySlug(slug: string) {
  try {
    const project = await client.fetch(
      `*[_type == "project" && slug.current == $slug][0] {
        images[] {
          asset-> {
            _id,
            url,
            "width": metadata.dimensions.width,
            "height": metadata.dimensions.height,
            "alt": originalFilename
          }
        }
      }`,
      { slug }
    )

    return project?.images?.map((img: any) => img.asset) || []
  } catch (error) {
    console.error('Error fetching project images by slug:', error)
    return []
  }
}

/**
 * Get unused Sanity images (not referenced anywhere)
 */
export async function getUnusedSanityImages(count: number = 10) {
  try {
    // Get all image references
    const allRefs = await client.fetch(`
      *[_type in ["project", "service", "blog", "award"]] {
        "refs": [
          mainImage.asset._ref,
          icon.asset._ref,
          ...images[].asset._ref,
          ...gallery[].asset._ref,
          projectImage.asset._ref
        ]
      }
    `)

    const usedRefs = new Set()
    allRefs.forEach((doc: any) => {
      doc.refs?.forEach((ref: string) => {
        if (ref) usedRefs.add(ref)
      })
    })

    // Get unused images
    const allImages = await client.fetch(`
      *[_type == "sanity.imageAsset"] {
        _id,
        url,
        "width": metadata.dimensions.width,
        "height": metadata.dimensions.height,
        "alt": originalFilename,
        originalFilename
      }
    `)

    const unusedImages = allImages
      .filter((img: any) => !usedRefs.has(img._id))
      .slice(0, count)

    return unusedImages
  } catch (error) {
    console.error('Error fetching unused images:', error)
    return []
  }
}

/**
 * Map Sanity image to component-friendly format
 */
export function mapSanityImage(sanityImage: any) {
  if (!sanityImage) return null

  return {
    src: sanityImage.url || sanityImage.asset?.url,
    alt: sanityImage.alt || sanityImage.originalFilename || 'Image',
    width: sanityImage.width || sanityImage.asset?.metadata?.dimensions?.width,
    height: sanityImage.height || sanityImage.asset?.metadata?.dimensions?.height,
  }
}
