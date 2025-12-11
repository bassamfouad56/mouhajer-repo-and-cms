import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  groups: [
    { name: 'general', title: 'General' },
    { name: 'sectionImages', title: 'Section Images' },
    { name: 'founder', title: 'Founder' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    // General Settings
    defineField({
      name: 'siteName',
      title: 'Site Name',
      type: 'string',
      group: 'general',
      initialValue: 'Mouhajer International Design',
    }),
    defineField({
      name: 'siteTagline',
      title: 'Tagline',
      type: 'string',
      group: 'general',
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      group: 'general',
      options: { hotspot: true },
    }),
    defineField({
      name: 'logoAlt',
      title: 'Logo (Dark Background)',
      type: 'image',
      group: 'general',
      options: { hotspot: true },
    }),

    // Section Background Images
    defineField({
      name: 'heroImage',
      title: 'Hero Section Background',
      type: 'image',
      group: 'sectionImages',
      options: { hotspot: true },
      description: 'Main hero section background image',
    }),
    defineField({
      name: 'aboutImage',
      title: 'About Section Image',
      type: 'image',
      group: 'sectionImages',
      options: { hotspot: true },
      description: 'Image displayed in the About section',
    }),
    defineField({
      name: 'statsBackgroundImage',
      title: 'Stats Section Background',
      type: 'image',
      group: 'sectionImages',
      options: { hotspot: true },
      description: 'Background image for the stats/numbers section',
    }),
    defineField({
      name: 'whyChooseUsImage',
      title: 'Why Choose Us Section Image',
      type: 'image',
      group: 'sectionImages',
      options: { hotspot: true },
      description: 'Main image for Why Choose Us section',
    }),
    defineField({
      name: 'whyChooseUsSecondaryImage',
      title: 'Why Choose Us Secondary Image',
      type: 'image',
      group: 'sectionImages',
      options: { hotspot: true },
      description: 'Secondary/decorative image for Why Choose Us section',
    }),
    defineField({
      name: 'contactBackgroundImage',
      title: 'Contact Section Background',
      type: 'image',
      group: 'sectionImages',
      options: { hotspot: true },
      description: 'Background image for the contact section',
    }),
    defineField({
      name: 'processImages',
      title: 'Process Step Images',
      type: 'array',
      group: 'sectionImages',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'step', type: 'string', title: 'Step Name' },
            { name: 'image', type: 'image', title: 'Image', options: { hotspot: true } },
          ],
        },
      ],
      description: 'Images for each process step',
    }),

    // Founder Info
    defineField({
      name: 'founderName',
      title: 'Founder Name',
      type: 'string',
      group: 'founder',
      initialValue: 'Mariam Mouhajer',
    }),
    defineField({
      name: 'founderTitle',
      title: 'Founder Title',
      type: 'string',
      group: 'founder',
      initialValue: 'Founder & Creative Director',
    }),
    defineField({
      name: 'founderImage',
      title: 'Founder Image',
      type: 'image',
      group: 'founder',
      options: { hotspot: true },
    }),
    defineField({
      name: 'founderQuote',
      title: 'Founder Quote',
      type: 'text',
      group: 'founder',
      rows: 3,
    }),
    defineField({
      name: 'founderBio',
      title: 'Founder Bio',
      type: 'array',
      group: 'founder',
      of: [{ type: 'block' }],
    }),

    // SEO
    defineField({
      name: 'defaultSeoTitle',
      title: 'Default SEO Title',
      type: 'string',
      group: 'seo',
    }),
    defineField({
      name: 'defaultSeoDescription',
      title: 'Default SEO Description',
      type: 'text',
      group: 'seo',
      rows: 3,
    }),
    defineField({
      name: 'ogImage',
      title: 'Default OG Image',
      type: 'image',
      group: 'seo',
      description: 'Default social sharing image',
    }),
  ],
  preview: {
    select: {
      title: 'siteName',
      media: 'logo',
    },
  },
})
