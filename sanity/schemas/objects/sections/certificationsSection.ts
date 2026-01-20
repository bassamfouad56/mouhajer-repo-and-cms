import { defineField, defineType } from 'sanity'
import { Award } from 'lucide-react'

export default defineType({
  name: 'certificationsSection',
  title: 'Certifications & Awards Section',
  type: 'object',
  icon: Award,
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
      name: 'certifications',
      title: 'ISO Certifications',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'name', type: 'string', title: 'Certification Name' },
            { name: 'code', type: 'string', title: 'Code (e.g., ISO 9001)' },
            {
              name: 'description',
              type: 'object',
              title: 'Description',
              fields: [
                { name: 'en', type: 'string', title: 'English' },
                { name: 'ar', type: 'string', title: 'Arabic' },
              ],
            },
            { name: 'icon', type: 'image', title: 'Icon/Badge' },
          ],
          preview: {
            select: {
              title: 'code',
              subtitle: 'name',
              media: 'icon',
            },
          },
        },
      ],
    }),
    defineField({
      name: 'awards',
      title: 'Awards',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'title',
              type: 'object',
              title: 'Award Title',
              fields: [
                { name: 'en', type: 'string', title: 'English' },
                { name: 'ar', type: 'string', title: 'Arabic' },
              ],
            },
            { name: 'year', type: 'string', title: 'Year' },
            { name: 'organization', type: 'string', title: 'Awarding Organization' },
            { name: 'certificate', type: 'image', title: 'Certificate Image' },
            { name: 'downloadUrl', type: 'url', title: 'Download URL' },
            { name: 'externalUrl', type: 'url', title: 'External Link' },
          ],
          preview: {
            select: {
              title: 'title.en',
              year: 'year',
              media: 'certificate',
            },
            prepare({ title, year, media }) {
              return {
                title: title || 'Untitled Award',
                subtitle: year,
                media,
              }
            },
          },
        },
      ],
    }),
  ],
  preview: {
    select: {
      enabled: 'enabled',
    },
    prepare({ enabled }) {
      return {
        title: 'Certifications & Awards',
        subtitle: enabled ? 'Enabled' : 'Disabled',
      }
    },
  },
})
