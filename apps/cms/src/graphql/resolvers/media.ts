import { GraphQLContext } from '../context';
import { GraphQLError } from 'graphql';

export const mediaResolvers = {
  Query: {
    mediaFiles: async (
      _: any,
      { filter, limit = 20, offset = 0 }: any,
      { prisma }: GraphQLContext
    ) => {
      const where: any = {};

      if (filter?.type) {
        where.type = filter.type;
      }

      if (filter?.search) {
        where.OR = [
          { filename: { contains: filter.search, mode: 'insensitive' } },
          { originalName: { contains: filter.search, mode: 'insensitive' } },
          { altEn: { contains: filter.search, mode: 'insensitive' } },
          { altAr: { contains: filter.search, mode: 'insensitive' } },
        ];
      }

      const [files, total] = await Promise.all([
        prisma.mediaFile.findMany({
          where,
          orderBy: { createdAt: 'desc' },
          take: limit,
          skip: offset,
        }),
        prisma.mediaFile.count({ where }),
      ]);

      return {
        files,
        total,
        hasMore: offset + limit < total,
      };
    },

    mediaFile: async (_: any, { id }: any, { prisma }: GraphQLContext) => {
      return await prisma.mediaFile.findUnique({
        where: { id },
      });
    },
  },

  Mutation: {
    updateMedia: async (
      _: any,
      { id, input }: any,
      { prisma, user }: GraphQLContext
    ) => {
      if (!user || user.role !== 'admin') {
        throw new GraphQLError('Unauthorized - Admin access required', {
          extensions: { code: 'UNAUTHORIZED' },
        });
      }

      return await prisma.mediaFile.update({
        where: { id },
        data: {
          ...(input.altEn !== undefined && { altEn: input.altEn }),
          ...(input.altAr !== undefined && { altAr: input.altAr }),
          ...(input.captionEn !== undefined && { captionEn: input.captionEn }),
          ...(input.captionAr !== undefined && { captionAr: input.captionAr }),
        },
      });
    },

    deleteMedia: async (
      _: any,
      { id }: any,
      { prisma, user }: GraphQLContext
    ) => {
      if (!user || user.role !== 'admin') {
        throw new GraphQLError('Unauthorized - Admin access required', {
          extensions: { code: 'UNAUTHORIZED' },
        });
      }

      await prisma.mediaFile.delete({ where: { id } });
      return true;
    },
  },
};
