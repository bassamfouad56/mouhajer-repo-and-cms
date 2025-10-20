import { GraphQLContext } from '../context';
import { GraphQLError } from 'graphql';

export const projectResolvers = {
  Query: {
    projects: async (
      _: unknown,
      args: {
        filter?: {
          category?: string;
          featured?: boolean;
          status?: string;
          search?: string;
        };
        limit?: number;
        offset?: number;
      },
      context: GraphQLContext
    ) => {
      const { filter = {}, limit = 10, offset = 0 } = args;
      const { prisma } = context;

      const where: any = {};

      if (filter.category) {
        where.category = filter.category;
      }

      if (filter.featured !== undefined) {
        where.featured = filter.featured;
      }

      if (filter.status) {
        where.status = filter.status;
      }

      if (filter.search) {
        where.OR = [
          { titleEn: { contains: filter.search, mode: 'insensitive' } },
          { titleAr: { contains: filter.search, mode: 'insensitive' } },
          { descriptionEn: { contains: filter.search, mode: 'insensitive' } },
          { descriptionAr: { contains: filter.search, mode: 'insensitive' } },
        ];
      }

      const [projects, total] = await Promise.all([
        prisma.project.findMany({
          where,
          take: limit,
          skip: offset,
          orderBy: { createdAt: 'desc' },
        }),
        prisma.project.count({ where }),
      ]);

      return {
        projects,
        total,
        hasMore: offset + limit < total,
      };
    },

    project: async (_: unknown, args: { id: string }, context: GraphQLContext) => {
      const { prisma } = context;
      return prisma.project.findUnique({
        where: { id: args.id },
      });
    },
  },

  Mutation: {
    createProject: async (
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

      return prisma.project.create({
        data: {
          ...args.input,
          featured: args.input.featured ?? false,
          status: args.input.status ?? 'published',
        },
      });
    },

    updateProject: async (
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

      return prisma.project.update({
        where: { id: args.id },
        data: args.input,
      });
    },

    deleteProject: async (
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

      await prisma.project.delete({
        where: { id: args.id },
      });

      return true;
    },
  },
};
