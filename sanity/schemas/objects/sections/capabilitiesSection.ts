import { defineField, defineType } from 'sanity'
import { Layers } from 'lucide-react'

export default defineType({
  name: 'capabilitiesSection',
  title: 'Capabilities Section',
  type: 'object',
  icon: Layers,
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
      name: 'capabilities',
      title: 'Capabilities',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'title',
              type: 'object',
              title: 'Title',
              fields: [
                { name: 'en', type: 'string', title: 'English' },
                { name: 'ar', type: 'string', title: 'Arabic' },
              ],
            },
            {
              name: 'subtitle',
              type: 'object',
              title: 'Subtitle',
              fields: [
                { name: 'en', type: 'string', title: 'English' },
                { name: 'ar', type: 'string', title: 'Arabic' },
              ],
            },
            {
              name: 'description',
              type: 'object',
              title: 'Description',
              fields: [
                { name: 'en', type: 'text', title: 'English', rows: 3 },
                { name: 'ar', type: 'text', title: 'Arabic', rows: 3 },
              ],
            },
            {
              name: 'image',
              type: 'image',
              title: 'Background Image',
              options: { hotspot: true },
            },
            {
              name: 'link',
              type: 'string',
              title: 'Link URL',
            },
          ],
          preview: {
            select: {
              title: 'title.en',
              subtitle: 'subtitle.en',
              media: 'image',
            },
            prepare({ title, subtitle, media }) {
              return {
                title: title || 'Untitled',
                subtitle,
                media,
              }
            },
          },
        },
      ],
      validation: (Rule) => Rule.max(8),
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
    }),
  ],
  preview: {
    select: {
      enabled: 'enabled',
      capabilities: 'capabilities',
    },
    prepare({ enabled, capabilities }) {
      return {
        title: 'Capabilities Section',
        subtitle: enabled ? `${capabilities?.length || 0} capabilities` : 'Disabled',
      }
    },
  },
})
