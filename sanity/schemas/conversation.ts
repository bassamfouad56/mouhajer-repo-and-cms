import { defineField, defineType } from 'sanity';

/**
 * Conversation Schema - Tracks AI Chatbot Conversations
 * Stores all chat interactions for admin review and lead tracking
 */
export default defineType({
  name: 'conversation',
  title: 'Chatbot Conversations',
  type: 'document',
  fields: [
    defineField({
      name: 'conversationId',
      title: 'Conversation ID',
      type: 'string',
      validation: (Rule) => Rule.required(),
      description: 'Unique identifier for this conversation session',
    }),
    defineField({
      name: 'messages',
      title: 'Messages',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'role',
              title: 'Role',
              type: 'string',
              options: {
                list: [
                  { title: 'User', value: 'user' },
                  { title: 'Assistant', value: 'assistant' },
                ],
              },
            },
            {
              name: 'content',
              title: 'Content',
              type: 'text',
            },
            {
              name: 'timestamp',
              title: 'Timestamp',
              type: 'datetime',
            },
            {
              name: 'source',
              title: 'Source',
              type: 'string',
              description: 'Where the response came from',
              options: {
                list: [
                  { title: 'Ollama (AI)', value: 'ollama' },
                  { title: 'Keyword Fallback', value: 'keyword' },
                  { title: 'Generic Fallback', value: 'fallback' },
                ],
              },
            },
            {
              name: 'latency',
              title: 'Response Latency (ms)',
              type: 'number',
              description: 'How long it took to generate response',
            },
          ],
          preview: {
            select: {
              role: 'role',
              content: 'content',
              timestamp: 'timestamp',
            },
            prepare({ role, content, timestamp }) {
              const preview = content?.substring(0, 100) || '';
              const time = timestamp ? new Date(timestamp).toLocaleTimeString() : '';
              return {
                title: `${role === 'user' ? '👤' : '🤖'} ${preview}`,
                subtitle: time,
              };
            },
          },
        },
      ],
    }),
    defineField({
      name: 'userEmail',
      title: 'User Email',
      type: 'string',
      validation: (Rule) => Rule.email(),
      description: 'Email captured during conversation (optional)',
    }),
    defineField({
      name: 'userPhone',
      title: 'User Phone',
      type: 'string',
      description: 'Phone number captured during conversation (optional)',
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Active', value: 'active' },
          { title: 'Converted to Lead', value: 'converted' },
          { title: 'Abandoned', value: 'abandoned' },
          { title: 'Resolved', value: 'resolved' },
        ],
      },
      initialValue: 'active',
    }),
    defineField({
      name: 'leadScore',
      title: 'Lead Score',
      type: 'number',
      validation: (Rule) => Rule.min(1).max(10),
      description: '1-10 score based on sales intent (auto-calculated or manual)',
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
          { title: 'Interior Design', value: 'interior' },
          { title: 'Landscape Design', value: 'landscape' },
          { title: 'General Inquiry', value: 'general' },
        ],
      },
      description: 'Auto-detected or manually set service interest',
    }),
    defineField({
      name: 'metadata',
      title: 'Metadata',
      type: 'object',
      fields: [
        { name: 'userAgent', type: 'string', title: 'User Agent' },
        { name: 'referrer', type: 'string', title: 'Referrer' },
        { name: 'pageUrl', type: 'string', title: 'Page URL' },
        { name: 'locale', type: 'string', title: 'Language' },
      ],
    }),
    defineField({
      name: 'stats',
      title: 'Statistics',
      type: 'object',
      fields: [
        { name: 'totalMessages', type: 'number', title: 'Total Messages', initialValue: 0 },
        { name: 'ollamaMessages', type: 'number', title: 'AI Messages', initialValue: 0 },
        { name: 'fallbackMessages', type: 'number', title: 'Fallback Messages', initialValue: 0 },
        { name: 'avgLatency', type: 'number', title: 'Avg Response Time (ms)' },
      ],
    }),
    defineField({
      name: 'relatedLead',
      title: 'Related Lead',
      type: 'reference',
      to: [{ type: 'lead' }],
      description: 'Link to lead record if converted',
    }),
    defineField({
      name: 'notes',
      title: 'Internal Notes',
      type: 'text',
      description: 'Admin notes about this conversation',
    }),
    defineField({
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'lastMessageAt',
      title: 'Last Message At',
      type: 'datetime',
    }),
  ],
  preview: {
    select: {
      email: 'userEmail',
      status: 'status',
      score: 'leadScore',
      created: 'createdAt',
      messageCount: 'stats.totalMessages',
    },
    prepare({ email, status, score, created, messageCount }) {
      const date = created ? new Date(created).toLocaleDateString() : 'N/A';
      const scoreStr = score ? `⭐${score}` : '';
      const msgCount = messageCount || 0;
      return {
        title: email || 'Anonymous User',
        subtitle: `${status} | ${msgCount} msgs | ${scoreStr} | ${date}`,
      };
    },
  },
  orderings: [
    {
      title: 'Most Recent',
      name: 'recentDesc',
      by: [{ field: 'lastMessageAt', direction: 'desc' }],
    },
    {
      title: 'Highest Lead Score',
      name: 'scoreDesc',
      by: [{ field: 'leadScore', direction: 'desc' }],
    },
    {
      title: 'Status',
      name: 'status',
      by: [{ field: 'status', direction: 'asc' }],
    },
  ],
});
