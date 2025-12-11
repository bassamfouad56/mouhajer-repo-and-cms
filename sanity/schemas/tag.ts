import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'tag',
  title: 'Tag',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Tag Name',
      type: 'object',
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
      options: {
        source: 'name.en',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Tag Category',
      type: 'string',
      options: {
        list: [
          { title: 'Award', value: 'award' },
          { title: 'Style', value: 'style' },
          { title: 'Material', value: 'material' },
          { title: 'Scale', value: 'scale' },
          { title: 'Status', value: 'status' },
          { title: 'Budget Range', value: 'budget' },
          { title: 'Feature', value: 'feature' },
          { title: 'Certification', value: 'certification' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'object',
      fields: [
        { name: 'en', type: 'text', title: 'English', rows: 2 },
        { name: 'ar', type: 'text', title: 'Arabic', rows: 2 },
      ],
    }),
    defineField({
      name: 'icon',
      title: 'Icon Name',
      type: 'string',
      description: 'Lucide icon name (e.g., Award, Gem, Sparkles)',
    }),
    defineField({
      name: 'color',
      title: 'Tag Color',
      type: 'string',
      description: 'Hex color code (e.g., #d4af37)',
    }),
    defineField({
      name: 'featured',
      title: 'Featured Tag',
      type: 'boolean',
      initialValue: false,
      description: 'Show in quick filters',
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      initialValue: 100,
    }),
  ],
  preview: {
    select: {
      title: 'name.en',
      category: 'category',
    },
    prepare(selection) {
      const { title, category } = selection
      const categoryIcons: Record<string, string> = {
        award: '🏆',
        style: '🎨',
        material: '💎',
        scale: '📐',
        status: '📊',
        budget: '💰',
        feature: '✨',
        certification: '📜',
      }
      return {
        title: `${categoryIcons[category] || '🏷️'} ${title}`,
        subtitle: category?.charAt(0).toUpperCase() + category?.slice(1),
      }
    },
  },
  orderings: [
    {
      title: 'Category then Name',
      name: 'categoryAsc',
      by: [
        { field: 'category', direction: 'asc' },
        { field: 'name.en', direction: 'asc' },
      ],
    },
  ],
})
