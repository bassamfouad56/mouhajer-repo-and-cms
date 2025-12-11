import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'location',
  title: 'Location',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Location Name',
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
        source: 'name.en',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'type',
      title: 'Location Type',
      type: 'string',
      options: {
        list: [
          { title: 'Region', value: 'region' },
          { title: 'Country', value: 'country' },
          { title: 'City', value: 'city' },
          { title: 'Area/District', value: 'area' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'parent',
      title: 'Parent Location',
      type: 'reference',
      to: [{ type: 'location' }],
      description: 'e.g., Dubai belongs to UAE, UAE belongs to GCC',
    }),
    defineField({
      name: 'countryCode',
      title: 'Country Code',
      type: 'string',
      description: 'ISO 3166-1 alpha-2 code (e.g., AE, SA, QA)',
      hidden: ({ document }) => document?.type !== 'country',
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
      name: 'description',
      title: 'Description',
      type: 'object',
      fields: [
        { name: 'en', type: 'text', title: 'English', rows: 3 },
        { name: 'ar', type: 'text', title: 'Arabic', rows: 3 },
      ],
    }),
    defineField({
      name: 'coordinates',
      title: 'Coordinates',
      type: 'object',
      fields: [
        { name: 'lat', type: 'number', title: 'Latitude' },
        { name: 'lng', type: 'number', title: 'Longitude' },
      ],
    }),
    defineField({
      name: 'featured',
      title: 'Featured Location',
      type: 'boolean',
      initialValue: false,
      description: 'Show in location filters on homepage',
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
      ],
    }),
  ],
  preview: {
    select: {
      title: 'name.en',
      type: 'type',
      parent: 'parent.name.en',
      media: 'mainImage',
    },
    prepare(selection) {
      const { title, type, parent, media } = selection
      const typeLabels: Record<string, string> = {
        region: '🌍',
        country: '🏳️',
        city: '🏙️',
        area: '📍',
      }
      return {
        title: `${typeLabels[type] || ''} ${title}`,
        subtitle: parent ? `in ${parent}` : type?.charAt(0).toUpperCase() + type?.slice(1),
        media,
      }
    },
  },
  orderings: [
    {
      title: 'Type then Name',
      name: 'typeAsc',
      by: [
        { field: 'type', direction: 'asc' },
        { field: 'name.en', direction: 'asc' },
      ],
    },
  ],
})
