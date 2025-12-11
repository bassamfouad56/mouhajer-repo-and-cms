import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'projectType',
  title: 'Project Type',
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
        source: 'title.en',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'object',
      fields: [
        { name: 'en', type: 'text', title: 'English', rows: 3 },
        { name: 'ar', type: 'text', title: 'Arabic', rows: 3 },
      ],
    }),
    defineField({
      name: 'sector',
      title: 'Parent Sector',
      type: 'reference',
      to: [{ type: 'industry' }],
      description: 'Which industry/sector does this project type belong to?',
    }),
    defineField({
      name: 'icon',
      title: 'Icon Name',
      type: 'string',
      description: 'Lucide icon name (e.g., Hotel, Home, Building2, Store)',
    }),
    defineField({
      name: 'mainImage',
      title: 'Featured Image',
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
      name: 'order',
      title: 'Display Order',
      type: 'number',
      initialValue: 100,
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
            { name: 'en', type: 'string', title: 'English', validation: (Rule) => Rule.max(60) },
            { name: 'ar', type: 'string', title: 'Arabic', validation: (Rule) => Rule.max(60) },
          ],
        },
        {
          name: 'metaDescription',
          type: 'object',
          title: 'Meta Description',
          fields: [
            { name: 'en', type: 'text', title: 'English', rows: 3, validation: (Rule) => Rule.max(160) },
            { name: 'ar', type: 'text', title: 'Arabic', rows: 3, validation: (Rule) => Rule.max(160) },
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
      sector: 'sector.title.en',
      media: 'mainImage',
    },
    prepare(selection) {
      const { title, sector, media } = selection
      return {
        title,
        subtitle: sector ? `Sector: ${sector}` : 'No sector',
        media,
      }
    },
  },
  orderings: [
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
})
