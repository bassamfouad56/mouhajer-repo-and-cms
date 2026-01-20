import { defineField, defineType } from 'sanity'
import { Users } from 'lucide-react'

export default defineType({
  name: 'logoMarqueeSection',
  title: 'Logo Marquee Section',
  type: 'object',
  icon: Users,
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
          { title: 'Auto (from Sanity clients)', value: 'auto' },
          { title: 'Manual Selection', value: 'manual' },
        ],
        layout: 'radio',
      },
      initialValue: 'auto',
    }),
    defineField({
      name: 'selectedClients',
      title: 'Selected Clients',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'client' }],
        },
      ],
      hidden: ({ parent }) => parent?.displayMode !== 'manual',
    }),
    defineField({
      name: 'animationSpeed',
      title: 'Animation Speed',
      type: 'string',
      options: {
        list: [
          { title: 'Slow', value: 'slow' },
          { title: 'Normal', value: 'normal' },
          { title: 'Fast', value: 'fast' },
        ],
      },
      initialValue: 'normal',
    }),
  ],
  preview: {
    select: {
      enabled: 'enabled',
      title: 'sectionTitle.en',
    },
    prepare({ enabled, title }) {
      return {
        title: 'Logo Marquee',
        subtitle: enabled ? title || 'Trusted Partners' : 'Disabled',
      }
    },
  },
})
