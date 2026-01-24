import { createDataAttribute } from '@sanity/visual-editing/create-data-attribute'
import { projectId, dataset } from '@/sanity/env'

/**
 * Creates data attributes for Sanity visual editing.
 * These attributes enable click-to-edit functionality in the Presentation tool.
 */
export const dataAttribute = createDataAttribute({
  projectId,
  dataset,
})

/**
 * Helper to create data attributes for homepage sections.
 * @param homepageId - The _id of the homepage document
 * @param sectionKey - The _key of the section in the sections array
 * @param fieldPath - The path to the field within the section (e.g., 'headline.en')
 */
export function homepageSectionAttr(
  homepageId: string,
  sectionKey: string,
  fieldPath: string
) {
  // Return empty object if missing required params
  if (!homepageId || !sectionKey) {
    return {}
  }

  try {
    return dataAttribute({
      id: homepageId,
      type: 'homepage',
      path: `sections[_key=="${sectionKey}"].${fieldPath}`,
    })
  } catch {
    // Return empty object if visual editing fails
    return {}
  }
}

/**
 * Helper for array items within homepage sections.
 * @param homepageId - The _id of the homepage document
 * @param sectionKey - The _key of the section
 * @param arrayName - The name of the array field (e.g., 'stats', 'faqs')
 * @param itemIndex - The index of the item in the array
 * @param fieldPath - The path to the field within the array item
 */
export function homepageArrayItemAttr(
  homepageId: string,
  sectionKey: string,
  arrayName: string,
  itemIndex: number,
  fieldPath: string
) {
  // Return empty object if missing required params
  if (!homepageId || !sectionKey) {
    return {}
  }

  try {
    return dataAttribute({
      id: homepageId,
      type: 'homepage',
      path: `sections[_key=="${sectionKey}"].${arrayName}[${itemIndex}].${fieldPath}`,
    })
  } catch {
    // Return empty object if visual editing fails
    return {}
  }
}

// Type for homepage section data passed to components
export interface HomepageEditingContext {
  homepageId: string
  sectionKey: string
}
