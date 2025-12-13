import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { documentInternationalization } from '@sanity/document-internationalization'
import { media } from 'sanity-plugin-media'
import { schemaTypes } from './sanity/schemas'

export default defineConfig({
  name: 'default',
  title: 'Mouhajer Design',

  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'r97logzc',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',

  basePath: '/studio',

  plugins: [
    structureTool(),
    visionTool(),
    media(),
    documentInternationalization({
      // Supported languages
      supportedLanguages: [
        { id: 'en', title: 'English' },
        { id: 'ar', title: 'Arabic' }
      ],
      // Document types that should be translatable
      schemaTypes: ['project', 'service', 'industry', 'post'],
    }),
  ],

  schema: {
    types: schemaTypes,
  },
})
