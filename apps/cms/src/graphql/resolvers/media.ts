import { GraphQLContext } from '../context';
import { GraphQLError } from 'graphql';

export const mediaResolvers = {
  Query: {
    media: async (
      _: any,
      { limit = 50, tags }: any,
      { prisma }: GraphQLContext
    ) => {
      const where: any = {};

      if (tags && tags.length > 0) {
        where.tags = {
          hasSome: tags,
        };
      }

      const [files, total] = await Promise.all([
        prisma.mediaFile.findMany({
          where,
          orderBy: { createdAt: 'desc' },
          take: limit,
        }),
        prisma.mediaFile.count({ where }),
      ]);

      console.log('[GraphQL media resolver] Fetched files:', files.length);
      console.log('[GraphQL media resolver] Sample file:', files[0]);

      // Transform MediaFile to Media format expected by frontend
      const media = files.map((file: any) => ({
        id: file.id,
        title: file.originalName || file.filename,
        url: file.url,
        type: file.type,
        altText: file.altEn || file.altAr || '',
        caption: file.captionEn || file.captionAr || '',
        size: file.size,
        tags: file.tags || [],
        createdAt: file.createdAt,
      }));

      return {
        media,
        total,
        hasMore: limit < total,
      };
    },

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
