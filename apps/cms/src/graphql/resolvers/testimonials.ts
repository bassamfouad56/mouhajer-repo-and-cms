import { GraphQLError } from 'graphql';

export const testimonialResolvers = {
  Query: {
    testimonials: async (_: any, { filter, limit = 10, offset = 0 }: any, { prisma }: any) => {
      const where: any = {};

      if (filter) {
        if (filter.locale) where.locale = filter.locale;
        if (filter.rating !== undefined) where.rating = filter.rating;
        if (filter.featured !== undefined) where.featured = filter.featured;
        if (filter.published !== undefined) where.published = filter.published;
      }

      const testimonials = await prisma.testimonial.findMany({
        where,
        take: limit,
        skip: offset,
        orderBy: {
          reviewDate: 'desc',
        },
      });

      return testimonials;
    },

    testimonial: async (_: any, { id }: any, { prisma }: any) => {
      const testimonial = await prisma.testimonial.findUnique({
        where: { id },
      });

      if (!testimonial) {
        throw new GraphQLError('Testimonial not found', {
          extensions: { code: 'NOT_FOUND' },
        });
      }

      return testimonial;
    },

    testimonialsCount: async (_: any, { filter }: any, { prisma }: any) => {
      const where: any = {};

      if (filter) {
        if (filter.locale) where.locale = filter.locale;
        if (filter.rating !== undefined) where.rating = filter.rating;
        if (filter.featured !== undefined) where.featured = filter.featured;
        if (filter.published !== undefined) where.published = filter.published;
      }

      return await prisma.testimonial.count({ where });
    },
  },

  Mutation: {
    createTestimonial: async (_: any, { input }: any, { prisma, user }: any) => {
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

      const testimonial = await prisma.testimonial.create({
        data: {
          ...input,
          locale: input.locale || 'en',
          featured: input.featured !== undefined ? input.featured : false,
          published: input.published !== undefined ? input.published : true,
        },
      });

      return testimonial;
    },

    updateTestimonial: async (_: any, { id, input }: any, { prisma, user }: any) => {
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

      // Check if testimonial exists
      const exists = await prisma.testimonial.findUnique({ where: { id } });
      if (!exists) {
        throw new GraphQLError('Testimonial not found', {
          extensions: { code: 'NOT_FOUND' },
        });
      }

      const testimonial = await prisma.testimonial.update({
        where: { id },
        data: input,
      });

      return testimonial;
    },

    deleteTestimonial: async (_: any, { id }: any, { prisma, user }: any) => {
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

      // Check if testimonial exists
      const exists = await prisma.testimonial.findUnique({ where: { id } });
      if (!exists) {
        throw new GraphQLError('Testimonial not found', {
          extensions: { code: 'NOT_FOUND' },
        });
      }

      await prisma.testimonial.delete({ where: { id } });

      return true;
    },
  },
};
