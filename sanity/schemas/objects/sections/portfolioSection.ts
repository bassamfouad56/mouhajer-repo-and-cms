import { defineField, defineType } from 'sanity'
import { Image } from 'lucide-react'

export default defineType({
  name: 'portfolioSection',
  title: 'Portfolio Showcase Section',
  type: 'object',
  icon: Image,
  fields: [
    defineField({
      name: 'enabled',
      title: 'Enabled',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'sectionTitle',
      title: 'Section Title',
      type: 'object',
      fields: [
        { name: 'en', type: 'string', title: 'English' },
        { name: 'ar', type: 'string', title: 'Arabic' },
      ],
    }),
    defineField({
      name: 'sectionSubtitle',
      title: 'Section Subtitle',
      type: 'object',
      fields: [
        { name: 'en', type: 'text', title: 'English', rows: 2 },
        { name: 'ar', type: 'text', title: 'Arabic', rows: 2 },
      ],
    }),
    defineField({
      name: 'displayMode',
      title: 'Display Mode',
      type: 'string',
      options: {
        list: [
          { title: 'Auto (from Sanity projects)', value: 'auto' },
          { title: 'Manual Selection', value: 'manual' },
        ],
        layout: 'radio',
      },
      initialValue: 'auto',
    }),
    defineField({
      name: 'featuredProjects',
      title: 'Featured Projects',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'project' }],
        },
      ],
      description: 'Manually select projects to feature (only used in Manual mode)',
      hidden: ({ parent }) => parent?.displayMode !== 'manual',
    }),
    defineField({
      name: 'maxProjects',
      title: 'Maximum Projects to Show',
      type: 'number',
      initialValue: 12,
      validation: (Rule) => Rule.min(3).max(24),
    }),
    defineField({
      name: 'ctaText',
      title: 'CTA Button Text',
      type: 'object',
      fields: [
        { name: 'en', type: 'string', title: 'English' },
        { name: 'ar', type: 'string', title: 'Arabic' },
      ],
    }),
    defineField({
      name: 'ctaLink',
      title: 'CTA Link',
      type: 'string',
      initialValue: '/projects',
    }),
  ],
  preview: {
    select: {
      enabled: 'enabled',
      mode: 'displayMode',
    },
    prepare({ enabled, mode }) {
      return {
        title: 'Portfolio Showcase',
        subtitle: enabled ? `Mode: ${mode}` : 'Disabled',
      }
    },
  },
})
