import { GraphQLError } from 'graphql';

export const faqResolvers = {
  Query: {
    faqs: async (_: any, { filter, limit = 20, offset = 0 }: any, { prisma }: any) => {
      const where: any = {};

      if (filter) {
        if (filter.locale) where.locale = filter.locale;
        if (filter.category) where.category = filter.category;
        if (filter.featured !== undefined) where.featured = filter.featured;
        if (filter.published !== undefined) where.published = filter.published;
      }

      const faqs = await prisma.fAQ.findMany({
        where,
        take: limit,
        skip: offset,
        orderBy: [
          { order: 'asc' },
          { createdAt: 'desc' },
        ],
      });

      return faqs;
    },

    faq: async (_: any, { id }: any, { prisma }: any) => {
      const faq = await prisma.fAQ.findUnique({
        where: { id },
      });

      if (!faq) {
        throw new GraphQLError('FAQ not found', {
          extensions: { code: 'NOT_FOUND' },
        });
      }

      // Increment view count
      await prisma.fAQ.update({
        where: { id },
        data: { viewCount: { increment: 1 } },
      });

      return faq;
    },

    faqsCount: async (_: any, { filter }: any, { prisma }: any) => {
      const where: any = {};

      if (filter) {
        if (filter.locale) where.locale = filter.locale;
        if (filter.category) where.category = filter.category;
        if (filter.featured !== undefined) where.featured = filter.featured;
        if (filter.published !== undefined) where.published = filter.published;
      }

      return await prisma.fAQ.count({ where });
    },

    faqsByCategory: async (_: any, { category, locale }: any, { prisma }: any) => {
      const where: any = {
        category,
        published: true,
      };

      if (locale) {
        where.locale = locale;
      }

      const faqs = await prisma.fAQ.findMany({
        where,
        orderBy: { order: 'asc' },
      });

      return faqs;
    },
  },

  Mutation: {
    createFAQ: async (_: any, { input }: any, { prisma, user }: any) => {
      // Check authentication
      if (!user) {
        throw new GraphQLError('Unauthorized - Please log in', {
          extensions: { code: 'UNAUTHORIZED' },
        });
      }

      // Check permissions (admin or editor can create)
      if (user.role !== 'admin' && user.role !== 'editor') {
        throw new GraphQLError('Forbidden - Admin or Editor access required', {
          extensions: { code: 'FORBIDDEN' },
        });
      }

      const faq = await prisma.fAQ.create({
        data: {
          ...input,
          locale: input.locale || 'en',
          featured: input.featured !== undefined ? input.featured : false,
          published: input.published !== undefined ? input.published : true,
          order: input.order !== undefined ? input.order : 0,
          keywords: input.keywords || [],
        },
      });

      return faq;
    },

    updateFAQ: async (_: any, { id, input }: any, { prisma, user }: any) => {
      // Check authentication
      if (!user) {
        throw new GraphQLError('Unauthorized - Please log in', {
          extensions: { code: 'UNAUTHORIZED' },
        });
      }

      // Check permissions
      if (user.role !== 'admin' && user.role !== 'editor') {
        throw new GraphQLError('Forbidden - Admin or Editor access required', {
          extensions: { code: 'FORBIDDEN' },
        });
      }

      // Check if FAQ exists
      const exists = await prisma.fAQ.findUnique({ where: { id } });
      if (!exists) {
        throw new GraphQLError('FAQ not found', {
          extensions: { code: 'NOT_FOUND' },
        });
      }

      const faq = await prisma.fAQ.update({
        where: { id },
        data: input,
      });

      return faq;
    },

    deleteFAQ: async (_: any, { id }: any, { prisma, user }: any) => {
      // Check authentication
      if (!user) {
        throw new GraphQLError('Unauthorized - Please log in', {
          extensions: { code: 'UNAUTHORIZED' },
        });
      }

      // Check permissions (only admin can delete)
      if (user.role !== 'admin') {
        throw new GraphQLError('Forbidden - Admin access required', {
          extensions: { code: 'FORBIDDEN' },
        });
      }

      // Check if FAQ exists
      const exists = await prisma.fAQ.findUnique({ where: { id } });
      if (!exists) {
        throw new GraphQLError('FAQ not found', {
          extensions: { code: 'NOT_FOUND' },
        });
      }

      await prisma.fAQ.delete({ where: { id } });

      return true;
    },

    incrementFAQHelpful: async (_: any, { id }: any, { prisma }: any) => {
      // Public mutation - no authentication required
      // Check if FAQ exists
      const exists = await prisma.fAQ.findUnique({ where: { id } });
      if (!exists) {
        throw new GraphQLError('FAQ not found', {
          extensions: { code: 'NOT_FOUND' },
        });
      }

      const faq = await prisma.fAQ.update({
        where: { id },
        data: {
          helpfulCount: { increment: 1 },
        },
      });

      return faq;
    },
  },
};
