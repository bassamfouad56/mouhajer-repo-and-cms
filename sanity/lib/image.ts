import createImageUrlBuilder from '@sanity/image-url'
import type { Image } from 'sanity'

import { dataset, projectId } from '../env'

// Only create imageBuilder if we have valid credentials
const imageBuilder = projectId && dataset
  ? createImageUrlBuilder({
      projectId,
      dataset,
    })
  : null

export const urlForImage = (source: Image) => {
  // Return null if imageBuilder is not available or source is invalid
  if (!imageBuilder || !source) {
    return null
  }

  try {
    return imageBuilder.image(source).auto('format').fit('max')
  } catch (error) {
    console.error('Error building image URL:', error)
    return null
  }
}

// Safe version that returns a URL string or fallback
export const getSafeImageUrl = (
  source: Image | null | undefined,
  width: number = 800,
  height: number = 600,
  fallback: string = '/placeholder.jpg'
): string => {
  if (!source || !imageBuilder) {
    return fallback
  }

  try {
    const builder = imageBuilder.image(source).auto('format').fit('max')
    return builder.width(width).height(height).url() || fallback
  } catch (error) {
    console.error('Error building image URL:', error)
    return fallback
  }
}
