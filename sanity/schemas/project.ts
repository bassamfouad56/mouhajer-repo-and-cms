import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  groups: [
    { name: 'basic', title: 'Basic Info', default: true },
    { name: 'classification', title: 'Classification' },
    { name: 'details', title: 'Project Details' },
    { name: 'media', title: 'Media' },
    { name: 'content', title: 'Content' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    // ===== BASIC INFO =====
    defineField({
      name: 'title',
      title: 'Title',
      type: 'object',
      group: 'basic',
      fields: [
        { name: 'en', type: 'string', title: 'English' },
        { name: 'ar', type: 'string', title: 'Arabic' },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'basic',
      options: {
        source: 'title.en',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'object',
      group: 'basic',
      fields: [
        { name: 'en', type: 'text', title: 'English', rows: 3 },
        { name: 'ar', type: 'text', title: 'Arabic', rows: 3 },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'featured',
      title: 'Featured Project',
      type: 'boolean',
      group: 'basic',
      initialValue: false,
      description: 'Show on homepage and featured sections',
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      group: 'basic',
      initialValue: () => new Date().toISOString(),
    }),

    // ===== CLASSIFICATION (Taxonomy) =====
    defineField({
      name: 'sector',
      title: 'Sector (Industry)',
      type: 'reference',
      group: 'classification',
      to: [{ type: 'industry' }],
      description: 'Primary sector: Hospitality, Corporate, Healthcare, etc.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'projectType',
      title: 'Project Type',
      type: 'reference',
      group: 'classification',
      to: [{ type: 'projectType' }],
      description: 'What type of project: Hotel, Restaurant, Villa, Office, etc.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'services',
      title: 'Services Provided',
      type: 'array',
      group: 'classification',
      of: [{ type: 'reference', to: { type: 'service' } }],
      description: 'What services were delivered',
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'reference',
      group: 'classification',
      to: [{ type: 'location' }],
      description: 'City/Area where project is located',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      group: 'classification',
      of: [{ type: 'reference', to: { type: 'tag' } }],
      description: 'Awards, styles, materials, features, etc.',
    }),
    // Legacy category field (keep for backwards compatibility)
    defineField({
      name: 'category',
      title: 'Legacy Category',
      type: 'string',
      group: 'classification',
      hidden: true,
      options: {
        list: [
          { title: 'Residential', value: 'residential' },
          { title: 'Commercial', value: 'commercial' },
          { title: 'Hospitality', value: 'hospitality' },
          { title: 'Institutional', value: 'institutional' },
          { title: 'Retail', value: 'retail' },
        ],
      },
    }),

    // ===== PROJECT DETAILS =====
    defineField({
      name: 'client',
      title: 'Client',
      type: 'object',
      group: 'details',
      fields: [
        { name: 'en', type: 'string', title: 'English' },
        { name: 'ar', type: 'string', title: 'Arabic' },
      ],
    }),
    defineField({
      name: 'clientRef',
      title: 'Client (Reference)',
      type: 'reference',
      group: 'details',
      to: [{ type: 'client' }],
      description: 'Link to client record for logo and details',
    }),
    defineField({
      name: 'year',
      title: 'Year Completed',
      type: 'number',
      group: 'details',
      validation: (Rule) => Rule.min(2000).max(new Date().getFullYear() + 2),
    }),
    defineField({
      name: 'duration',
      title: 'Project Duration',
      type: 'object',
      group: 'details',
      fields: [
        { name: 'startDate', type: 'date', title: 'Start Date' },
        { name: 'endDate', type: 'date', title: 'End Date' },
        { name: 'months', type: 'number', title: 'Duration (Months)' },
      ],
    }),
    defineField({
      name: 'area',
      title: 'Area (sqm)',
      type: 'number',
      group: 'details',
    }),
    defineField({
      name: 'budget',
      title: 'Budget',
      type: 'object',
      group: 'details',
      fields: [
        { name: 'amount', type: 'number', title: 'Amount' },
        { name: 'currency', type: 'string', title: 'Currency', initialValue: 'AED' },
        {
          name: 'range',
          type: 'string',
          title: 'Budget Range',
          options: {
            list: [
              { title: 'Under 10M AED', value: 'under-10m' },
              { title: '10M - 50M AED', value: '10m-50m' },
              { title: '50M - 100M AED', value: '50m-100m' },
              { title: '100M+ AED', value: '100m-plus' },
            ],
          },
        },
      ],
    }),
    defineField({
      name: 'status',
      title: 'Project Status',
      type: 'string',
      group: 'details',
      options: {
        list: [
          { title: 'Completed', value: 'completed' },
          { title: 'In Progress', value: 'in-progress' },
          { title: 'Awarded', value: 'awarded' },
          { title: 'On Hold', value: 'on-hold' },
        ],
      },
      initialValue: 'completed',
    }),
    defineField({
      name: 'units',
      title: 'Number of Units',
      type: 'object',
      group: 'details',
      description: 'Rooms, apartments, offices, etc.',
      fields: [
        { name: 'count', type: 'number', title: 'Count' },
        { name: 'label', type: 'string', title: 'Label (e.g., Rooms, Units, Floors)' },
      ],
    }),

    // ===== MEDIA =====
    defineField({
      name: 'mainImage',
      title: 'Main Image',
      type: 'image',
      group: 'media',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'object',
          title: 'Alternative Text',
          fields: [
            { name: 'en', type: 'string', title: 'English' },
            { name: 'ar', type: 'string', title: 'Arabic' },
          ],
        },
      ],
    }),
    defineField({
      name: 'gallery',
      title: 'Gallery',
      type: 'array',
      group: 'media',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: 'alt',
              type: 'object',
              title: 'Alternative Text',
              fields: [
                { name: 'en', type: 'string', title: 'English' },
                { name: 'ar', type: 'string', title: 'Arabic' },
              ],
            },
            {
              name: 'caption',
              type: 'object',
              title: 'Caption',
              fields: [
                { name: 'en', type: 'string', title: 'English' },
                { name: 'ar', type: 'string', title: 'Arabic' },
              ],
            },
            {
              name: 'category',
              type: 'string',
              title: 'Image Category',
              options: {
                list: [
                  { title: 'Exterior', value: 'exterior' },
                  { title: 'Interior', value: 'interior' },
                  { title: 'Detail', value: 'detail' },
                  { title: 'Before', value: 'before' },
                  { title: 'After', value: 'after' },
                  { title: 'Process', value: 'process' },
                ],
              },
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'videoUrl',
      title: 'Video URL',
      type: 'url',
      group: 'media',
      description: 'YouTube or Vimeo video URL',
    }),

    // ===== CONTENT =====
    defineField({
      name: 'challenge',
      title: 'The Challenge',
      type: 'object',
      group: 'content',
      fields: [
        { name: 'en', type: 'text', title: 'English', rows: 4 },
        { name: 'ar', type: 'text', title: 'Arabic', rows: 4 },
      ],
    }),
    defineField({
      name: 'approach',
      title: 'Design Approach',
      type: 'object',
      group: 'content',
      fields: [
        { name: 'en', type: 'text', title: 'English', rows: 4 },
        { name: 'ar', type: 'text', title: 'Arabic', rows: 4 },
      ],
    }),
    defineField({
      name: 'scope',
      title: 'Scope of Work',
      type: 'array',
      group: 'content',
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
              name: 'description',
              type: 'object',
              title: 'Description',
              fields: [
                { name: 'en', type: 'text', title: 'English', rows: 2 },
                { name: 'ar', type: 'text', title: 'Arabic', rows: 2 },
              ],
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'outcome',
      title: 'The Outcome',
      type: 'object',
      group: 'content',
      fields: [
        { name: 'en', type: 'text', title: 'English', rows: 4 },
        { name: 'ar', type: 'text', title: 'Arabic', rows: 4 },
      ],
    }),
    defineField({
      name: 'testimonial',
      title: 'Client Testimonial',
      type: 'object',
      group: 'content',
      fields: [
        {
          name: 'quote',
          type: 'object',
          title: 'Quote',
          fields: [
            { name: 'en', type: 'text', title: 'English', rows: 3 },
            { name: 'ar', type: 'text', title: 'Arabic', rows: 3 },
          ],
        },
        { name: 'author', type: 'string', title: 'Author Name' },
        { name: 'role', type: 'string', title: 'Author Role' },
      ],
    }),
    defineField({
      name: 'content',
      title: 'Full Content',
      type: 'array',
      group: 'content',
      of: [
        {
          type: 'block',
        },
        {
          type: 'image',
          options: {
            hotspot: true,
          },
        },
      ],
    }),

    // ===== SEO =====
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      group: 'seo',
      fields: [
        {
          name: 'metaTitle',
          type: 'object',
          title: 'Meta Title',
          fields: [
            { name: 'en', type: 'string', title: 'English', validation: (Rule) => Rule.max(60) },
            { name: 'ar', type: 'string', title: 'Arabic', validation: (Rule) => Rule.max(60) },
          ],
        },
        {
          name: 'metaDescription',
          type: 'object',
          title: 'Meta Description',
          fields: [
            { name: 'en', type: 'text', title: 'English', rows: 3, validation: (Rule) => Rule.max(160) },
            { name: 'ar', type: 'text', title: 'Arabic', rows: 3, validation: (Rule) => Rule.max(160) },
          ],
        },
        {
          name: 'keywords',
          type: 'array',
          title: 'Keywords',
          of: [{ type: 'string' }],
        },
        {
          name: 'canonicalUrl',
          type: 'url',
          title: 'Canonical URL',
          description: 'Override the default canonical URL',
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title.en',
      media: 'mainImage',
      sector: 'sector.title.en',
      projectType: 'projectType.title.en',
      location: 'location.name.en',
      status: 'status',
    },
    prepare(selection) {
      const { title, media, sector, projectType, location, status } = selection
      const statusIcons: Record<string, string> = {
        completed: '✅',
        'in-progress': '🔄',
        awarded: '🏆',
        'on-hold': '⏸️',
      }
      return {
        title: `${statusIcons[status] || ''} ${title}`,
        subtitle: [projectType, sector, location].filter(Boolean).join(' • '),
        media,
      }
    },
  },
  orderings: [
    {
      title: 'Year (Newest)',
      name: 'yearDesc',
      by: [{ field: 'year', direction: 'desc' }],
    },
    {
      title: 'Title',
      name: 'titleAsc',
      by: [{ field: 'title.en', direction: 'asc' }],
    },
  ],
})
