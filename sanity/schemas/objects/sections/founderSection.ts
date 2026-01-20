import { defineField, defineType } from 'sanity'
import { User } from 'lucide-react'

export default defineType({
  name: 'founderSection',
  title: 'Founder Message Section',
  type: 'object',
  icon: User,
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
      name: 'founderName',
      title: 'Founder Name',
      type: 'string',
    }),
    defineField({
      name: 'founderTitle',
      title: 'Founder Title',
      type: 'object',
      fields: [
        { name: 'en', type: 'string', title: 'English' },
        { name: 'ar', type: 'string', title: 'Arabic' },
      ],
    }),
    defineField({
      name: 'founderImage',
      title: 'Founder Image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'quote',
      title: 'Main Quote',
      type: 'object',
      fields: [
        { name: 'en', type: 'text', title: 'English', rows: 4 },
        { name: 'ar', type: 'text', title: 'Arabic', rows: 4 },
      ],
    }),
    defineField({
      name: 'message',
      title: 'Message Body',
      type: 'object',
      fields: [
        { name: 'en', type: 'text', title: 'English', rows: 6 },
        { name: 'ar', type: 'text', title: 'Arabic', rows: 6 },
      ],
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
      name: 'founderName',
      media: 'founderImage',
    },
    prepare({ enabled, name, media }) {
      return {
        title: 'Founder Message',
        subtitle: enabled ? name || 'No name set' : 'Disabled',
        media,
      }
    },
  },
})
