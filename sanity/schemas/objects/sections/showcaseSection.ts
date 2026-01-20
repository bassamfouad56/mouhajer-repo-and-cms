import { defineField, defineType } from 'sanity'
import { Sparkles } from 'lucide-react'

export default defineType({
  name: 'showcaseSection',
  title: 'Unified Showcase Section',
  type: 'object',
  icon: Sparkles,
  description: 'The Mouhajer Promise - multi-phase showcase section',
  fields: [
    defineField({
      name: 'enabled',
      title: 'Enabled',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'backgroundImage',
      title: 'Background Image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'clientTypes',
      title: 'Client Types (Phase 1)',
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
              name: 'stat',
              type: 'object',
              title: 'Statistic',
              fields: [
                { name: 'value', type: 'string', title: 'Value (e.g., 200+)' },
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
            },
            { name: 'link', type: 'string', title: 'Link URL' },
          ],
          preview: {
            select: {
              title: 'title.en',
              subtitle: 'subtitle.en',
            },
          },
        },
      ],
      validation: (Rule) => Rule.max(3),
    }),
    defineField({
      name: 'panels',
      title: 'Service Panels (Phase 2)',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'number', type: 'string', title: 'Panel Number (e.g., 01)' },
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
              name: 'services',
              type: 'array',
              title: 'Services List',
              of: [
                {
                  type: 'object',
                  fields: [
                    { name: 'en', type: 'string', title: 'English' },
                    { name: 'ar', type: 'string', title: 'Arabic' },
                  ],
                },
              ],
            },
            { name: 'image', type: 'image', title: 'Panel Background', options: { hotspot: true } },
            { name: 'link', type: 'string', title: 'Link URL' },
          ],
          preview: {
            select: {
              number: 'number',
              title: 'title.en',
              media: 'image',
            },
            prepare({ number, title, media }) {
              return {
                title: `${number} - ${title}`,
                media,
              }
            },
          },
        },
      ],
      validation: (Rule) => Rule.max(5),
    }),
  ],
  preview: {
    select: {
      enabled: 'enabled',
    },
    prepare({ enabled }) {
      return {
        title: 'Unified Showcase (The Promise)',
        subtitle: enabled ? 'Enabled' : 'Disabled',
      }
    },
  },
})
