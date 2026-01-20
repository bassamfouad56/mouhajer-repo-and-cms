import { defineField, defineType } from 'sanity'
import { PlayCircle } from 'lucide-react'

export default defineType({
  name: 'heroSection',
  title: 'Hero Section',
  type: 'object',
  icon: PlayCircle,
  fields: [
    defineField({
      name: 'enabled',
      title: 'Enabled',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'headline',
      title: 'Headline',
      type: 'object',
      fields: [
        { name: 'en', type: 'string', title: 'English' },
        { name: 'ar', type: 'string', title: 'Arabic' },
      ],
    }),
    defineField({
      name: 'subheadline',
      title: 'Subheadline',
      type: 'object',
      fields: [
        { name: 'en', type: 'text', title: 'English', rows: 2 },
        { name: 'ar', type: 'text', title: 'Arabic', rows: 2 },
      ],
    }),
    defineField({
      name: 'videoUrl',
      title: 'Background Video URL',
      type: 'string',
      description: 'Path to video file (e.g., /banner-2s.mp4)',
    }),
    defineField({
      name: 'fallbackImage',
      title: 'Fallback Image',
      type: 'image',
      options: { hotspot: true },
      description: 'Shown while video loads or on mobile',
    }),
    defineField({
      name: 'primaryCta',
      title: 'Primary CTA Button',
      type: 'object',
      fields: [
        {
          name: 'text',
          type: 'object',
          title: 'Button Text',
          fields: [
            { name: 'en', type: 'string', title: 'English' },
            { name: 'ar', type: 'string', title: 'Arabic' },
          ],
        },
        { name: 'link', type: 'string', title: 'Link URL' },
      ],
    }),
    defineField({
      name: 'secondaryCta',
      title: 'Secondary CTA Button',
      type: 'object',
      fields: [
        {
          name: 'text',
          type: 'object',
          title: 'Button Text',
          fields: [
            { name: 'en', type: 'string', title: 'English' },
            { name: 'ar', type: 'string', title: 'Arabic' },
          ],
        },
        { name: 'link', type: 'string', title: 'Link URL' },
      ],
    }),
    defineField({
      name: 'showAwardBadge',
      title: 'Show Award Badge',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'showScrollIndicator',
      title: 'Show Scroll Indicator',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      enabled: 'enabled',
      headline: 'headline.en',
    },
    prepare({ enabled, headline }) {
      return {
        title: 'Hero Section',
        subtitle: enabled ? headline || 'No headline set' : 'Disabled',
      }
    },
  },
})
