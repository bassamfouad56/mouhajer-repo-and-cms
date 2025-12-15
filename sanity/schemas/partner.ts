import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'partner',
  title: 'Partners',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Partner Name',
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
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Hospitality', value: 'hospitality' },
          { title: 'Developers', value: 'developers' },
          { title: 'Corporate', value: 'corporate' },
          { title: 'Suppliers', value: 'suppliers' },
          { title: 'Consultants', value: 'consultants' },
        ],
      },
    }),
    defineField({
      name: 'website',
      title: 'Website URL',
      type: 'url',
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      validation: (Rule) => Rule.min(0),
    }),
  ],
  preview: {
    select: {
      title: 'name',
      media: 'logo',
      category: 'category',
    },
    prepare(selection) {
      const { title, media, category } = selection
      return {
        title,
        subtitle: category ? `Category: ${category}` : 'No category',
        media,
      }
    },
  },
})
