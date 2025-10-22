import { GraphQLContext } from '../context';
import { GraphQLError } from 'graphql';

// Helper function to generate slug
function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export const serviceResolvers = {
  Query: {
    services: async (
      _: unknown,
      args: {
        filter?: {
          featured?: boolean;
          status?: string;
          search?: string;
          targetLocation?: string;
        };
        limit?: number;
        offset?: number;
      },
      context: GraphQLContext
    ) => {
      const { filter = {}, limit = 10, offset = 0 } = args;
      const { prisma } = context;

      const where: any = {};

      if (filter.featured !== undefined) {
        where.featured = filter.featured;
      }

      if (filter.status) {
        where.status = filter.status;
      }

      if (filter.targetLocation) {
        where.targetLocations = {
          has: filter.targetLocation,
        };
      }

      if (filter.search) {
        where.OR = [
          { titleEn: { contains: filter.search, mode: 'insensitive' } },
          { titleAr: { contains: filter.search, mode: 'insensitive' } },
          { descriptionEn: { contains: filter.search, mode: 'insensitive' } },
          { descriptionAr: { contains: filter.search, mode: 'insensitive' } },
          { seoKeywordsEn: { hasSome: [filter.search] } },
          { seoKeywordsAr: { hasSome: [filter.search] } },
        ];
      }

      const [services, total] = await Promise.all([
        prisma.service.findMany({
          where,
          take: limit,
          skip: offset,
          orderBy: { createdAt: 'desc' },
        }),
        prisma.service.count({ where }),
      ]);

      return {
        services,
        total,
        hasMore: offset + limit < total,
      };
    },

    service: async (_: unknown, args: { id: string }, context: GraphQLContext) => {
      const { prisma } = context;
      const service = await prisma.service.findUnique({
        where: { id: args.id },
      });

      // Increment view count
      if (service) {
        await prisma.service.update({
          where: { id: args.id },
          data: { viewCount: { increment: 1 } },
        });
      }

      return service;
    },

    serviceBySlug: async (
      _: unknown,
      args: { slugEn?: string; slugAr?: string },
      context: GraphQLContext
    ) => {
      const { prisma } = context;

      if (!args.slugEn && !args.slugAr) {
        throw new GraphQLError('Either slugEn or slugAr must be provided', {
          extensions: { code: 'BAD_REQUEST' },
        });
      }

      const service = await prisma.service.findFirst({
        where: args.slugEn
          ? { slugEn: args.slugEn }
          : { slugAr: args.slugAr },
      });

      // Increment view count
      if (service) {
        await prisma.service.update({
          where: { id: service.id },
          data: { viewCount: { increment: 1 } },
        });
      }

      return service;
    },
  },

  Service: {
    relatedServices: async (parent: any, _: unknown, context: GraphQLContext) => {
      const { prisma } = context;
      if (!parent.relatedServiceIds || parent.relatedServiceIds.length === 0) {
        return [];
      }

      return prisma.service.findMany({
        where: {
          id: { in: parent.relatedServiceIds },
        },
      });
    },
  },

  Mutation: {
    createService: async (
      _: unknown,
      args: { input: any },
      context: GraphQLContext
    ) => {
      const { prisma, user } = context;

      if (!user) {
        throw new GraphQLError('Authentication required', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }

      if (user.role !== 'admin' && user.role !== 'editor') {
        throw new GraphQLError('Insufficient permissions', {
          extensions: { code: 'FORBIDDEN' },
        });
      }

      // Generate slugs if not provided
      const slugEn = args.input.slugEn || generateSlug(args.input.titleEn);
      const slugAr = args.input.slugAr || generateSlug(args.input.titleAr);

      return prisma.service.create({
        data: {
          ...args.input,
          slugEn,
          slugAr,
          images: args.input.images || [],
          seoKeywordsEn: args.input.seoKeywordsEn || [],
          seoKeywordsAr: args.input.seoKeywordsAr || [],
          targetLocations: args.input.targetLocations || [],
          serviceArea: args.input.serviceArea || [],
          relatedServiceIds: args.input.relatedServiceIds || [],
          featured: args.input.featured ?? false,
          status: args.input.status ?? 'published',
          viewCount: 0,
        },
      });
    },

    updateService: async (
      _: unknown,
      args: { id: string; input: any },
      context: GraphQLContext
    ) => {
      const { prisma, user } = context;

      if (!user) {
        throw new GraphQLError('Authentication required', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }

      if (user.role !== 'admin' && user.role !== 'editor') {
        throw new GraphQLError('Insufficient permissions', {
          extensions: { code: 'FORBIDDEN' },
        });
      }

      return prisma.service.update({
        where: { id: args.id },
        data: args.input,
      });
    },

    deleteService: async (
      _: unknown,
      args: { id: string },
      context: GraphQLContext
    ) => {
      const { prisma, user } = context;

      if (!user) {
        throw new GraphQLError('Authentication required', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }

      if (user.role !== 'admin') {
        throw new GraphQLError('Insufficient permissions', {
          extensions: { code: 'FORBIDDEN' },
        });
      }

      await prisma.service.delete({
        where: { id: args.id },
      });

      return true;
    },
  },
};
