import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'lead',
  title: 'AI Image Generation Leads',
  type: 'document',
  fields: [
    defineField({
      name: 'email',
      title: 'Email Address',
      type: 'string',
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: 'prompt',
      title: 'User Prompt',
      type: 'text',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'serviceCategory',
      title: 'Service Category',
      type: 'string',
      options: {
        list: [
          { title: 'Residential Design', value: 'residential' },
          { title: 'Commercial Design', value: 'commercial' },
          { title: 'Hospitality Design', value: 'hospitality' },
          { title: 'MEP Engineering', value: 'mep' },
          { title: 'Interior Design', value: 'interior' },
          { title: 'Landscape Design', value: 'landscape' },
        ],
      },
    }),
    defineField({
      name: 'uploadedImage',
      title: 'User Uploaded Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'generatedImage',
      title: 'AI Generated Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'generatedImagePath',
      title: 'External Storage Path',
      type: 'string',
      description: 'Path to the image on Mac Mini external drive',
    }),
    defineField({
      name: 'status',
      title: 'Lead Status',
      type: 'string',
      options: {
        list: [
          { title: 'New', value: 'new' },
          { title: 'Processing', value: 'processing' },
          { title: 'Completed', value: 'completed' },
          { title: 'Email Sent', value: 'sent' },
          { title: 'Follow-up Required', value: 'follow_up' },
          { title: 'Converted', value: 'converted' },
          { title: 'Lost', value: 'lost' },
        ],
      },
      initialValue: 'new',
    }),
    defineField({
      name: 'modelUsed',
      title: 'AI Model Used',
      type: 'string',
      description: 'Which Ollama model was used for generation',
    }),
    defineField({
      name: 'generationTime',
      title: 'Generation Time (seconds)',
      type: 'number',
    }),
    defineField({
      name: 'emailSentAt',
      title: 'Email Sent At',
      type: 'datetime',
    }),
    defineField({
      name: 'notes',
      title: 'Internal Notes',
      type: 'text',
    }),
    defineField({
      name: 'phoneNumber',
      title: 'Phone Number',
      type: 'string',
    }),
    defineField({
      name: 'projectBudget',
      title: 'Estimated Project Budget',
      type: 'string',
      options: {
        list: [
          { title: 'Under $50k', value: 'under_50k' },
          { title: '$50k - $100k', value: '50k_100k' },
          { title: '$100k - $250k', value: '100k_250k' },
          { title: '$250k - $500k', value: '250k_500k' },
          { title: '$500k - $1M', value: '500k_1m' },
          { title: 'Over $1M', value: 'over_1m' },
        ],
      },
    }),
    defineField({
      name: 'timeline',
      title: 'Project Timeline',
      type: 'string',
    }),
    defineField({
      name: 'source',
      title: 'Lead Source',
      type: 'string',
      initialValue: 'ai_chatbot',
      options: {
        list: [
          { title: 'AI Chatbot', value: 'ai_chatbot' },
          { title: 'Contact Form', value: 'contact_form' },
          { title: 'Website', value: 'website' },
          { title: 'Referral', value: 'referral' },
        ],
      },
    }),
    defineField({
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'lastFollowUp',
      title: 'Last Follow-up Date',
      type: 'datetime',
    }),
    defineField({
      name: 'nextFollowUp',
      title: 'Next Follow-up Date',
      type: 'datetime',
    }),
  ],
  preview: {
    select: {
      email: 'email',
      status: 'status',
      service: 'serviceCategory',
      createdAt: 'createdAt',
    },
    prepare({ email, status, service, createdAt }) {
      const date = createdAt ? new Date(createdAt).toLocaleDateString() : 'N/A';
      return {
        title: email,
        subtitle: `${service || 'N/A'} | ${status} | ${date}`,
      };
    },
  },
  orderings: [
    {
      title: 'Created Date, Newest',
      name: 'createdAtDesc',
      by: [{ field: 'createdAt', direction: 'desc' }],
    },
    {
      title: 'Status',
      name: 'statusAsc',
      by: [{ field: 'status', direction: 'asc' }],
    },
  ],
});
