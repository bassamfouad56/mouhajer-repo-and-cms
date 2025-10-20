import { GraphQLContext } from '../context';
import { GraphQLError } from 'graphql';

export const blogResolvers = {
  Query: {
    blogPosts: async (
      _: unknown,
      args: {
        filter?: {
          category?: string;
          featured?: boolean;
          status?: string;
          search?: string;
          tag?: string;
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

      if (filter.tag) {
        where.tags = { has: filter.tag };
      }

      if (filter.search) {
        where.OR = [
          { titleEn: { contains: filter.search, mode: 'insensitive' } },
          { titleAr: { contains: filter.search, mode: 'insensitive' } },
          { excerptEn: { contains: filter.search, mode: 'insensitive' } },
          { excerptAr: { contains: filter.search, mode: 'insensitive' } },
          { contentEn: { contains: filter.search, mode: 'insensitive' } },
          { contentAr: { contains: filter.search, mode: 'insensitive' } },
        ];
      }

      const [posts, total] = await Promise.all([
        prisma.blogPost.findMany({
          where,
          take: limit,
          skip: offset,
          orderBy: { createdAt: 'desc' },
        }),
        prisma.blogPost.count({ where }),
      ]);

      return {
        posts,
        total,
        hasMore: offset + limit < total,
      };
    },

    blogPost: async (
      _: unknown,
      args: { id?: string; slugEn?: string; slugAr?: string },
      context: GraphQLContext
    ) => {
      const { prisma } = context;

      if (args.id) {
        return prisma.blogPost.findUnique({
          where: { id: args.id },
        });
      }

      if (args.slugEn) {
        return prisma.blogPost.findUnique({
          where: { slugEn: args.slugEn },
        });
      }

      if (args.slugAr) {
        return prisma.blogPost.findUnique({
          where: { slugAr: args.slugAr },
        });
      }

      throw new GraphQLError('Must provide id, slugEn, or slugAr', {
        extensions: { code: 'BAD_REQUEST' },
      });
    },
  },

  Mutation: {
    createBlogPost: async (
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

      return prisma.blogPost.create({
        data: {
          ...args.input,
          tags: args.input.tags ?? [],
          featured: args.input.featured ?? false,
          status: args.input.status ?? 'draft',
        },
      });
    },

    updateBlogPost: async (
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

      return prisma.blogPost.update({
        where: { id: args.id },
        data: args.input,
      });
    },

    deleteBlogPost: async (
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

      await prisma.blogPost.delete({
        where: { id: args.id },
      });

      return true;
    },
  },
};
