import { defineField, defineType } from 'sanity'
import { HelpCircle } from 'lucide-react'

export default defineType({
  name: 'faqSection',
  title: 'FAQ Section',
  type: 'object',
  icon: HelpCircle,
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
        { name: 'en', type: 'string', title: 'English' },
        { name: 'ar', type: 'string', title: 'Arabic' },
      ],
    }),
    defineField({
      name: 'faqs',
      title: 'FAQ Items',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'question',
              type: 'object',
              title: 'Question',
              fields: [
                { name: 'en', type: 'string', title: 'English' },
                { name: 'ar', type: 'string', title: 'Arabic' },
              ],
            },
            {
              name: 'answer',
              type: 'object',
              title: 'Answer',
              fields: [
                { name: 'en', type: 'text', title: 'English', rows: 4 },
                { name: 'ar', type: 'text', title: 'Arabic', rows: 4 },
              ],
            },
          ],
          preview: {
            select: {
              question: 'question.en',
            },
            prepare({ question }) {
              return {
                title: question || 'Untitled Question',
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
      faqs: 'faqs',
    },
    prepare({ enabled, faqs }) {
      return {
        title: 'FAQ Section',
        subtitle: enabled ? `${faqs?.length || 0} questions` : 'Disabled',
      }
    },
  },
})
