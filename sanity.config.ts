import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { documentInternationalization } from '@sanity/document-internationalization'
import { media } from 'sanity-plugin-media'
import { schemaTypes } from './sanity/schemas'
import { projectId, dataset } from './sanity/env'

export default defineConfig({
  name: 'default',
  title: 'Mouhajer Design',

  projectId,
  dataset,

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
