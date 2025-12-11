import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'faq',
  title: 'FAQ',
  type: 'document',
  fields: [
    defineField({
      name: 'question',
      title: 'Question',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'answer',
      title: 'Answer',
      type: 'array',
      of: [{ type: 'block' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'shortAnswer',
      title: 'Short Answer',
      type: 'text',
      rows: 3,
      description: 'Plain text answer for SEO and snippets',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'General', value: 'general' },
          { title: 'Services', value: 'services' },
          { title: 'Process', value: 'process' },
          { title: 'Pricing', value: 'pricing' },
          { title: 'Timeline', value: 'timeline' },
          { title: 'Materials', value: 'materials' },
          { title: 'Warranty', value: 'warranty' },
          { title: 'Contact', value: 'contact' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'relatedService',
      title: 'Related Service',
      type: 'reference',
      to: { type: 'service' },
      description: 'Link to relevant service page',
    }),
    defineField({
      name: 'relatedIndustry',
      title: 'Related Industry',
      type: 'reference',
      to: { type: 'industry' },
      description: 'Link to relevant industry page',
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      initialValue: false,
      description: 'Show on homepage FAQ section',
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
      title: 'question',
      subtitle: 'category',
      featured: 'featured',
    },
    prepare(selection) {
      const { title, subtitle, featured } = selection
      return {
        title: `${featured ? '⭐ ' : ''}${title}`,
        subtitle: subtitle,
      }
    },
  },
  orderings: [
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
    {
      title: 'Category',
      name: 'categoryAsc',
      by: [{ field: 'category', direction: 'asc' }],
    },
  ],
})
