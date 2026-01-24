import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { presentationTool, defineDocuments, defineLocations } from 'sanity/presentation'
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
    presentationTool({
      previewUrl: {
        draftMode: {
          enable: '/api/draft/enable',
        },
      },
      resolve: {
        mainDocuments: defineDocuments([
          {
            route: '/:locale',
            filter: `_type == "homepage"`,
          },
          {
            route: '/:locale/projects/:slug',
            filter: `_type == "project" && slug.current == $slug`,
          },
          {
            route: '/:locale/services/:slug',
            filter: `_type == "service" && slug.current == $slug`,
          },
          {
            route: '/:locale/industries/:slug',
            filter: `_type == "industry" && slug.current == $slug`,
          },
          {
            route: '/:locale/blog/:slug',
            filter: `_type == "post" && slug.current == $slug`,
          },
        ]),
        locations: {
          homepage: defineLocations({
            select: { title: 'title' },
            resolve: () => ({
              locations: [
                { title: 'Homepage (EN)', href: '/en' },
                { title: 'Homepage (AR)', href: '/ar' },
              ],
            }),
          }),
          project: defineLocations({
            select: { title: 'title', slug: 'slug.current' },
            resolve: (doc) => ({
              locations: [
                { title: doc?.title?.en || doc?.title || 'Project', href: `/en/projects/${doc?.slug}` },
              ],
            }),
          }),
          service: defineLocations({
            select: { title: 'title', slug: 'slug.current' },
            resolve: (doc) => ({
              locations: [
                { title: doc?.title?.en || doc?.title || 'Service', href: `/en/services/${doc?.slug}` },
              ],
            }),
          }),
          industry: defineLocations({
            select: { title: 'title', slug: 'slug.current' },
            resolve: (doc) => ({
              locations: [
                { title: doc?.title?.en || doc?.title || 'Industry', href: `/en/industries/${doc?.slug}` },
              ],
            }),
          }),
          post: defineLocations({
            select: { title: 'title', slug: 'slug.current' },
            resolve: (doc) => ({
              locations: [
                { title: doc?.title || 'Blog Post', href: `/en/blog/${doc?.slug}` },
              ],
            }),
          }),
        },
      },
    }),
    visionTool({
      defaultApiVersion: '2024-11-21',
    }),
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
