import { createClient } from '@sanity/client'
import { readFileSync } from 'fs'
import { resolve } from 'path'

// Load .env.local
try {
  const envPath = resolve(process.cwd(), '.env.local')
  const envContent = readFileSync(envPath, 'utf8')
  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^#=]+)=(.*)$/)
    if (match) {
      const key = match[1].trim()
      const value = match[2].trim().replace(/^["']|["']$/g, '')
      if (!process.env[key]) {
        process.env[key] = value
      }
    }
  })
} catch (e) {
  console.log('Note: Could not load .env.local')
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'b6q28exv',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'mouhajer-db',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

const DOCUMENT_ID = '7WZciq5UK6HSJWlcfda7Gp'

async function fixBlogPost() {
  console.log('Fetching document...')

  // Fetch the raw document to see what we're working with
  const doc = await client.getDocument(DOCUMENT_ID)

  if (!doc) {
    console.error('Document not found!')
    return
  }

  console.log('Current document structure:')
  console.log(JSON.stringify(doc, null, 2))

  // Build the patch based on what needs fixing
  const patch = {}

  // Fix title - convert from string to localized object
  if (typeof doc.title === 'string') {
    patch.title = {
      en: doc.title,
      ar: doc.title, // Use same value for Arabic, can be updated later
    }
    console.log('\n✓ Will convert title from string to localized object')
  } else if (doc.title && !doc.title.en) {
    // Title exists but might be malformed
    patch.title = {
      en: 'Turnkey vs Split Contract: Why One Contract Wins',
      ar: 'العقد الشامل مقابل العقود المنفصلة: لماذا يفوز عقد واحد',
    }
    console.log('\n✓ Will set localized title')
  }

  // Fix slug - ensure it's in the correct format
  if (typeof doc.slug === 'string') {
    patch.slug = {
      _type: 'slug',
      current: doc.slug,
    }
    console.log('✓ Will convert slug from string to slug object')
  } else if (doc.slug && !doc.slug._type) {
    patch.slug = {
      _type: 'slug',
      current: doc.slug.current || 'turnkey-vs-split-contract',
    }
    console.log('✓ Will fix slug object type')
  }

  // Fix author - check name and role
  if (doc.author) {
    let authorNeedsFix = false
    const newAuthor = { ...doc.author }

    // Fix author.name if it's not a string
    if (typeof doc.author.name !== 'string' && doc.author.name !== undefined) {
      newAuthor.name = typeof doc.author.name === 'object'
        ? (doc.author.name.en || doc.author.name.ar || 'Eng. Maher Mouhajer')
        : 'Eng. Maher Mouhajer'
      authorNeedsFix = true
      console.log('✓ Will fix author.name')
    }

    // Fix author.role - should be {en, ar} object
    if (typeof doc.author.role === 'string') {
      newAuthor.role = {
        en: doc.author.role,
        ar: doc.author.role, // Use same for now, can be translated later
      }
      authorNeedsFix = true
      console.log('✓ Will convert author.role from string to localized object')
    }

    if (authorNeedsFix) {
      patch.author = newAuthor
    }
  }

  // Fix excerpt - should be {en, ar} object
  if (typeof doc.excerpt === 'string') {
    patch.excerpt = {
      en: doc.excerpt,
      ar: doc.excerpt, // Use same for now, can be translated later
    }
    console.log('✓ Will convert excerpt from string to localized object')
  }

  // Fix tags - remove invalid entries or convert to references
  if (doc.tags && Array.isArray(doc.tags)) {
    const invalidTags = doc.tags.filter(tag => typeof tag === 'string' || (tag && !tag._ref))
    if (invalidTags.length > 0) {
      // We'll need to unset tags for now, then they can be re-added properly
      console.log('✓ Will remove invalid tags (they need to be re-added as references)')
      patch.tags = [] // Clear invalid tags
    }
  }

  if (Object.keys(patch).length === 0) {
    console.log('\nNo fixes needed!')
    return
  }

  console.log('\nPatches to apply:')
  console.log(JSON.stringify(patch, null, 2))

  // Ask for confirmation
  console.log('\nApplying fixes...')

  try {
    const result = await client
      .patch(DOCUMENT_ID)
      .set(patch)
      .commit()

    console.log('\n✅ Document updated successfully!')
    console.log('Updated document ID:', result._id)
  } catch (error) {
    console.error('\n❌ Error updating document:', error.message)

    // If there's a type mismatch, try unset + set approach
    if (error.message.includes('type')) {
      console.log('\nTrying alternative approach (unset then set)...')

      try {
        // First unset the problematic fields
        const fieldsToUnset = Object.keys(patch)
        await client
          .patch(DOCUMENT_ID)
          .unset(fieldsToUnset)
          .commit()

        // Then set them with correct types
        const result = await client
          .patch(DOCUMENT_ID)
          .set(patch)
          .commit()

        console.log('\n✅ Document updated successfully with alternative approach!')
        console.log('Updated document ID:', result._id)
      } catch (retryError) {
        console.error('\n❌ Retry also failed:', retryError.message)
      }
    }
  }
}

fixBlogPost().catch(console.error)
