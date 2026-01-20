import { defineField, defineType } from 'sanity'
import { Award } from 'lucide-react'

export default defineType({
  name: 'partnersSection',
  title: 'Partners & Testimonials Section',
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
      name: 'showPartners',
      title: 'Show Partners Logos',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'showTestimonials',
      title: 'Show Testimonials',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'featuredTestimonials',
      title: 'Featured Testimonials',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'testimonial' }],
        },
      ],
      hidden: ({ parent }) => !parent?.showTestimonials,
    }),
  ],
  preview: {
    select: {
      enabled: 'enabled',
    },
    prepare({ enabled }) {
      return {
        title: 'Partners & Testimonials',
        subtitle: enabled ? 'Enabled' : 'Disabled',
      }
    },
  },
})
