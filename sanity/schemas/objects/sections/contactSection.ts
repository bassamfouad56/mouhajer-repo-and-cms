import { defineField, defineType } from 'sanity'
import { Mail } from 'lucide-react'

export default defineType({
  name: 'contactSection',
  title: 'Contact Section',
  type: 'object',
  icon: Mail,
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
      name: 'backgroundImage',
      title: 'Background Image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'theme',
      title: 'Theme',
      type: 'string',
      options: {
        list: [
          { title: 'Light', value: 'light' },
          { title: 'Dark', value: 'dark' },
        ],
        layout: 'radio',
      },
      initialValue: 'light',
    }),
    defineField({
      name: 'contactInfo',
      title: 'Contact Information',
      type: 'object',
      fields: [
        { name: 'email', type: 'string', title: 'Email' },
        { name: 'phone', type: 'string', title: 'Phone' },
        {
          name: 'address',
          type: 'object',
          title: 'Address',
          fields: [
            { name: 'en', type: 'text', title: 'English', rows: 3 },
            { name: 'ar', type: 'text', title: 'Arabic', rows: 3 },
          ],
        },
        { name: 'hours', type: 'string', title: 'Business Hours' },
      ],
    }),
  ],
  preview: {
    select: {
      enabled: 'enabled',
      media: 'backgroundImage',
    },
    prepare({ enabled, media }) {
      return {
        title: 'Contact Section',
        subtitle: enabled ? 'Enabled' : 'Disabled',
        media,
      }
    },
  },
})
