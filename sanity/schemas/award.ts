import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'award',
  title: 'Award / Certification',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Award Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'type',
      title: 'Type',
      type: 'string',
      options: {
        list: [
          { title: 'Award', value: 'award' },
          { title: 'Certification', value: 'certification' },
          { title: 'Recognition', value: 'recognition' },
          { title: 'Membership', value: 'membership' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'organization',
      title: 'Awarding Organization',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'year',
      title: 'Year Received',
      type: 'number',
      validation: (Rule) => Rule.min(1990).max(new Date().getFullYear() + 1),
    }),
    defineField({
      name: 'image',
      title: 'Award Image / Logo',
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
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Design Excellence', value: 'design' },
          { title: 'Construction Quality', value: 'construction' },
          { title: 'Sustainability', value: 'sustainability' },
          { title: 'Innovation', value: 'innovation' },
          { title: 'Safety', value: 'safety' },
          { title: 'Business Excellence', value: 'business' },
        ],
      },
    }),
    defineField({
      name: 'project',
      title: 'Related Project',
      type: 'reference',
      to: { type: 'project' },
      description: 'If this award was for a specific project',
    }),
    defineField({
      name: 'projectName',
      title: 'Project Name',
      type: 'string',
      description: 'Name of the project (if not linked as reference)',
    }),
    defineField({
      name: 'projectImage',
      title: 'Project Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      description: 'Image of the awarded project (alternative to linked project)',
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
        },
      ],
    }),
    defineField({
      name: 'level',
      title: 'Award Level',
      type: 'string',
      options: {
        list: [
          { title: '5-Star', value: '5-Star' },
          { title: 'Best', value: 'Best' },
          { title: 'Winner', value: 'Winner' },
          { title: 'Finalist', value: 'Finalist' },
          { title: 'Highly Commended', value: 'Highly Commended' },
        ],
      },
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle / Short Description',
      type: 'string',
      description: 'Brief description of the achievement',
    }),
    defineField({
      name: 'certificateUrl',
      title: 'Certificate URL',
      type: 'url',
      description: 'Link to certificate or verification page',
    }),
    defineField({
      name: 'certificatePath',
      title: 'Certificate File Path',
      type: 'string',
      description: 'Path to local PDF file in public/awards (e.g., /awards/certificate.pdf)',
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
      title: 'title',
      subtitle: 'organization',
      media: 'image',
      year: 'year',
      type: 'type',
    },
    prepare(selection) {
      const { title, subtitle, media, year, type } = selection
      const icon = type === 'certification' ? '📜' : type === 'award' ? '🏆' : '⭐'
      return {
        title: `${icon} ${title}`,
        subtitle: `${subtitle}${year ? ` (${year})` : ''}`,
        media,
      }
    },
  },
  orderings: [
    {
      title: 'Year (Newest)',
      name: 'yearDesc',
      by: [{ field: 'year', direction: 'desc' }],
    },
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
})
