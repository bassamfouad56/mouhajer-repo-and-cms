import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'service',
  title: 'Service',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'object',
      fields: [
        { name: 'en', type: 'string', title: 'English' },
        { name: 'ar', type: 'string', title: 'Arabic' },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'object',
      fields: [
        { name: 'en', type: 'text', title: 'English', rows: 3 },
        { name: 'ar', type: 'text', title: 'Arabic', rows: 3 },
      ],
    }),
    defineField({
      name: 'mainImage',
      title: 'Main Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
        },
      ],
    }),
    defineField({
      name: 'icon',
      title: 'Icon Name',
      type: 'string',
      description: 'Lucide icon name (e.g., Home, Building, Palette)',
    }),
    defineField({
      name: 'features',
      title: 'Features',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'title',
              type: 'object',
              title: 'Feature Title',
              fields: [
                { name: 'en', type: 'string', title: 'English' },
                { name: 'ar', type: 'string', title: 'Arabic' },
              ],
            },
            {
              name: 'description',
              type: 'object',
              title: 'Description',
              fields: [
                { name: 'en', type: 'text', title: 'English', rows: 2 },
                { name: 'ar', type: 'text', title: 'Arabic', rows: 2 },
              ],
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'process',
      title: 'Process Steps',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'step',
              type: 'number',
              title: 'Step Number',
            },
            {
              name: 'title',
              type: 'object',
              title: 'Step Title',
              fields: [
                { name: 'en', type: 'string', title: 'English' },
                { name: 'ar', type: 'string', title: 'Arabic' },
              ],
            },
            {
              name: 'description',
              type: 'object',
              title: 'Description',
              fields: [
                { name: 'en', type: 'text', title: 'English', rows: 3 },
                { name: 'ar', type: 'text', title: 'Arabic', rows: 3 },
              ],
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [
        {
          type: 'block',
        },
        {
          type: 'image',
          options: {
            hotspot: true,
          },
        },
      ],
    }),
    defineField({
      name: 'relatedProjects',
      title: 'Related Projects',
      type: 'array',
      of: [{ type: 'reference', to: { type: 'project' } }],
    }),
    defineField({
      name: 'featured',
      title: 'Featured Service',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      fields: [
        {
          name: 'metaTitle',
          type: 'object',
          title: 'Meta Title',
          fields: [
            { name: 'en', type: 'string', title: 'English' },
            { name: 'ar', type: 'string', title: 'Arabic' },
          ],
        },
        {
          name: 'metaDescription',
          type: 'object',
          title: 'Meta Description',
          fields: [
            { name: 'en', type: 'text', title: 'English', rows: 3 },
            { name: 'ar', type: 'text', title: 'Arabic', rows: 3 },
          ],
        },
        {
          name: 'keywords',
          type: 'array',
          title: 'Keywords',
          of: [{ type: 'string' }],
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title.en',
      media: 'mainImage',
      order: 'order',
    },
    prepare(selection) {
      const { title, media, order } = selection
      return {
        title: title || 'Untitled',
        subtitle: order ? `Order: ${order}` : 'No order set',
        media,
      }
    },
  },
})
