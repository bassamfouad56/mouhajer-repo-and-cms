import { defineField, defineType } from 'sanity'
import { Building } from 'lucide-react'

export default defineType({
  name: 'industriesSection',
  title: 'Industries Section',
  type: 'object',
  icon: Building,
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
      name: 'displayMode',
      title: 'Display Mode',
      type: 'string',
      options: {
        list: [
          { title: 'Auto (from Sanity industries)', value: 'auto' },
          { title: 'Manual Selection', value: 'manual' },
        ],
        layout: 'radio',
      },
      initialValue: 'auto',
    }),
    defineField({
      name: 'featuredIndustries',
      title: 'Featured Industries',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'industry' }],
        },
      ],
      hidden: ({ parent }) => parent?.displayMode !== 'manual',
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
      initialValue: '/industries',
    }),
  ],
  preview: {
    select: {
      enabled: 'enabled',
    },
    prepare({ enabled }) {
      return {
        title: 'Industries Section',
        subtitle: enabled ? 'Enabled' : 'Disabled',
      }
    },
  },
})
