import { defineField, defineType } from 'sanity'
import { ImageIcon } from 'lucide-react'

export default defineType({
  name: 'imageSeparator',
  title: 'Image Separator',
  type: 'object',
  icon: ImageIcon,
  fields: [
    defineField({
      name: 'style',
      title: 'Display Style',
      type: 'string',
      options: {
        list: [
          { title: 'Full-width Cinematic', value: 'fullwidth' },
          { title: 'Contained', value: 'contained' },
          { title: 'Narrow / Focused', value: 'narrow' },
          { title: 'Side-by-Side Duo', value: 'duo' },
          { title: 'Before / After Slider', value: 'beforeAfter' },
        ],
        layout: 'radio',
      },
      initialValue: 'fullwidth',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
          description: 'Important for accessibility and SEO',
        },
      ],
      hidden: ({ parent }) => parent?.style === 'duo' || parent?.style === 'beforeAfter',
    }),
    defineField({
      name: 'imageLeft',
      title: 'Left Image (Before)',
      type: 'image',
      options: { hotspot: true },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
        },
      ],
      hidden: ({ parent }) => parent?.style !== 'duo' && parent?.style !== 'beforeAfter',
    }),
    defineField({
      name: 'imageRight',
      title: 'Right Image (After)',
      type: 'image',
      options: { hotspot: true },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
        },
      ],
      hidden: ({ parent }) => parent?.style !== 'duo' && parent?.style !== 'beforeAfter',
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'object',
      fields: [
        { name: 'en', type: 'string', title: 'English' },
        { name: 'ar', type: 'string', title: 'Arabic' },
      ],
    }),
    defineField({
      name: 'enableParallax',
      title: 'Enable Parallax Effect',
      type: 'boolean',
      initialValue: true,
      description: 'Adds a subtle parallax scrolling effect (full-width only)',
      hidden: ({ parent }) => parent?.style !== 'fullwidth',
    }),
    defineField({
      name: 'aspectRatio',
      title: 'Aspect Ratio',
      type: 'string',
      options: {
        list: [
          { title: '16:9 (Cinematic)', value: '16/9' },
          { title: '4:3 (Standard)', value: '4/3' },
          { title: '3:2 (Classic)', value: '3/2' },
          { title: '1:1 (Square)', value: '1/1' },
          { title: '21:9 (Ultra-wide)', value: '21/9' },
        ],
      },
      initialValue: '16/9',
      hidden: ({ parent }) => parent?.style === 'fullwidth',
    }),
  ],
  preview: {
    select: {
      style: 'style',
      media: 'image',
      mediaLeft: 'imageLeft',
      caption: 'caption.en',
    },
    prepare({ style, media, mediaLeft, caption }) {
      const styleLabels: Record<string, string> = {
        fullwidth: 'Full-width Cinematic',
        contained: 'Contained Image',
        narrow: 'Narrow / Focused',
        duo: 'Side-by-Side Duo',
        beforeAfter: 'Before / After Slider',
      }
      return {
        title: styleLabels[style] || 'Image Separator',
        subtitle: caption || 'No caption',
        media: media || mediaLeft,
      }
    },
  },
})
