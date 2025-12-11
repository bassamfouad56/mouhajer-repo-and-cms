import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'client',
  title: 'Client',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Client Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
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
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Hospitality', value: 'hospitality' },
          { title: 'Corporate', value: 'corporate' },
          { title: 'Private', value: 'private' },
          { title: 'Government', value: 'government' },
          { title: 'Retail', value: 'retail' },
          { title: 'Real Estate', value: 'real-estate' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      description: 'Brief description of the partnership or project',
    }),
    defineField({
      name: 'website',
      title: 'Website',
      type: 'url',
    }),
    defineField({
      name: 'featured',
      title: 'Featured Client',
      type: 'boolean',
      initialValue: false,
      description: 'Show on homepage and featured sections',
    }),
    defineField({
      name: 'isConfidential',
      title: 'Confidential',
      type: 'boolean',
      initialValue: false,
      description: 'Hide client name/details but show in counts',
    }),
    defineField({
      name: 'projects',
      title: 'Related Projects',
      type: 'array',
      of: [{ type: 'reference', to: { type: 'project' } }],
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      initialValue: 100,
      description: 'Lower numbers appear first',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      media: 'logo',
      category: 'category',
      featured: 'featured',
    },
    prepare(selection) {
      const { title, media, category, featured } = selection
      return {
        title: `${title}${featured ? ' ⭐' : ''}`,
        subtitle: category,
        media,
      }
    },
  },
})
