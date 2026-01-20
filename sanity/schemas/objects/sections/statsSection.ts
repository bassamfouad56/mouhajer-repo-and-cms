import { defineField, defineType } from 'sanity'
import { BarChart3 } from 'lucide-react'

export default defineType({
  name: 'statsSection',
  title: 'Stats Section',
  type: 'object',
  icon: BarChart3,
  fields: [
    defineField({
      name: 'enabled',
      title: 'Enabled',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'stats',
      title: 'Statistics',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'value', type: 'number', title: 'Number Value' },
            { name: 'suffix', type: 'string', title: 'Suffix (e.g., +, %)' },
            {
              name: 'label',
              type: 'object',
              title: 'Label',
              fields: [
                { name: 'en', type: 'string', title: 'English' },
                { name: 'ar', type: 'string', title: 'Arabic' },
              ],
            },
          ],
          preview: {
            select: {
              value: 'value',
              suffix: 'suffix',
              label: 'label.en',
            },
            prepare({ value, suffix, label }) {
              return {
                title: `${value}${suffix || ''} - ${label}`,
              }
            },
          },
        },
      ],
      validation: (Rule) => Rule.max(6),
    }),
    defineField({
      name: 'backgroundImages',
      title: 'Background Images',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            { name: 'alt', type: 'string', title: 'Alt Text' },
          ],
        },
      ],
      description: 'Images rotate automatically in the background',
    }),
  ],
  preview: {
    select: {
      enabled: 'enabled',
      stats: 'stats',
    },
    prepare({ enabled, stats }) {
      return {
        title: 'Stats Section',
        subtitle: enabled ? `${stats?.length || 0} statistics` : 'Disabled',
      }
    },
  },
})
