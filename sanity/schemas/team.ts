import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'team',
  title: 'Team Member',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Full Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
    }),
    defineField({
      name: 'role',
      title: 'Job Title / Role',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'department',
      title: 'Department',
      type: 'string',
      options: {
        list: [
          { title: 'Leadership', value: 'leadership' },
          { title: 'Design', value: 'design' },
          { title: 'Architecture', value: 'architecture' },
          { title: 'Engineering', value: 'engineering' },
          { title: 'Project Management', value: 'project-management' },
          { title: 'Manufacturing', value: 'manufacturing' },
          { title: 'Operations', value: 'operations' },
          { title: 'Business Development', value: 'business-development' },
        ],
      },
    }),
    defineField({
      name: 'image',
      title: 'Photo',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
        },
      ],
    }),
    defineField({
      name: 'bio',
      title: 'Short Bio',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'fullBio',
      title: 'Full Biography',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'Detailed biography for individual page',
    }),
    defineField({
      name: 'qualifications',
      title: 'Qualifications',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Degrees, certifications, etc.',
    }),
    defineField({
      name: 'expertise',
      title: 'Areas of Expertise',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'yearsExperience',
      title: 'Years of Experience',
      type: 'number',
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'email',
    }),
    defineField({
      name: 'linkedin',
      title: 'LinkedIn URL',
      type: 'url',
    }),
    defineField({
      name: 'isFounder',
      title: 'Is Founder',
      type: 'boolean',
      initialValue: false,
      description: 'Enable for founder/CEO pages',
    }),
    defineField({
      name: 'founderContent',
      title: 'Founder Page Content',
      type: 'object',
      hidden: ({ document }) => !document?.isFounder,
      fields: [
        {
          name: 'philosophy',
          title: 'Design Philosophy',
          type: 'text',
          rows: 4,
        },
        {
          name: 'vision',
          title: 'Vision Statement',
          type: 'text',
          rows: 4,
        },
        {
          name: 'journey',
          title: 'Career Journey',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                { name: 'year', type: 'string', title: 'Year' },
                { name: 'milestone', type: 'string', title: 'Milestone' },
                { name: 'description', type: 'text', title: 'Description' },
              ],
            },
          ],
        },
        {
          name: 'awards',
          title: 'Personal Awards',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                { name: 'title', type: 'string', title: 'Award Title' },
                { name: 'year', type: 'string', title: 'Year' },
                { name: 'organization', type: 'string', title: 'Awarding Organization' },
              ],
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      initialValue: false,
      description: 'Show on About page leadership section',
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      initialValue: 100,
      description: 'Lower numbers appear first',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'role',
      media: 'image',
      isFounder: 'isFounder',
    },
    prepare(selection) {
      const { title, subtitle, media, isFounder } = selection
      return {
        title: `${title}${isFounder ? ' 👑' : ''}`,
        subtitle,
        media,
      }
    },
  },
  orderings: [
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
    {
      title: 'Name',
      name: 'nameAsc',
      by: [{ field: 'name', direction: 'asc' }],
    },
  ],
})
