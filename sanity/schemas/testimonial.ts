import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'testimonial',
  title: 'Testimonial',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Client Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'role',
      title: 'Role / Position',
      type: 'object',
      description: 'e.g., CEO, Director, Homeowner',
      fields: [
        { name: 'en', type: 'string', title: 'English' },
        { name: 'ar', type: 'string', title: 'Arabic' },
      ],
    }),
    defineField({
      name: 'company',
      title: 'Company',
      type: 'object',
      fields: [
        { name: 'en', type: 'string', title: 'English' },
        { name: 'ar', type: 'string', title: 'Arabic' },
      ],
    }),
    defineField({
      name: 'image',
      title: 'Photo',
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
      name: 'quote',
      title: 'Testimonial Quote',
      type: 'object',
      fields: [
        { name: 'en', type: 'text', title: 'English', rows: 5 },
        { name: 'ar', type: 'text', title: 'Arabic', rows: 5 },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'rating',
      title: 'Rating',
      type: 'number',
      options: {
        list: [
          { title: '5 Stars', value: 5 },
          { title: '4 Stars', value: 4 },
          { title: '3 Stars', value: 3 },
        ],
      },
      initialValue: 5,
    }),
    defineField({
      name: 'project',
      title: 'Related Project',
      type: 'reference',
      to: { type: 'project' },
      description: 'Link to the project this testimonial is about',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Residential', value: 'residential' },
          { title: 'Commercial', value: 'commercial' },
          { title: 'Hospitality', value: 'hospitality' },
        ],
      },
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      initialValue: false,
      description: 'Show on homepage and featured sections',
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
      subtitle: 'company.en',
      media: 'image',
      featured: 'featured',
    },
    prepare(selection) {
      const { title, subtitle, media, featured } = selection
      return {
        title: `${title}${featured ? ' ⭐' : ''}`,
        subtitle: subtitle || 'No company',
        media,
      }
    },
  },
})
