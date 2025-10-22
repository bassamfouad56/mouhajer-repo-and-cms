import { GraphQLContext } from '../context';
import { GraphQLError } from 'graphql';

export const pageResolvers = {
  Query: {
    pages: async (
      _: any,
      { filter, limit = 10, offset = 0 }: any,
      { prisma }: GraphQLContext
    ) => {
      const where: any = {};

      if (filter?.status) {
        where.status = filter.status;
      }

      if (filter?.featured !== undefined) {
        where.featured = filter.featured;
      }

      if (filter?.search) {
        where.OR = [
          { titleEn: { contains: filter.search, mode: 'insensitive' } },
          { titleAr: { contains: filter.search, mode: 'insensitive' } },
          { descriptionEn: { contains: filter.search, mode: 'insensitive' } },
          { descriptionAr: { contains: filter.search, mode: 'insensitive' } },
        ];
      }

      const [pages, total] = await Promise.all([
        prisma.page.findMany({
          where,
          include: {
            blocks: {
              orderBy: { order: 'asc' },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: limit,
          skip: offset,
        }),
        prisma.page.count({ where }),
      ]);

      return {
        pages,
        total,
        hasMore: offset + limit < total,
      };
    },

    page: async (_: any, { id }: any, { prisma }: GraphQLContext) => {
      return await prisma.page.findUnique({
        where: { id },
        include: {
          blocks: {
            orderBy: { order: 'asc' },
          },
        },
      });
    },

    pageBySlug: async (
      _: any,
      { slugEn, slugAr }: any,
      { prisma }: GraphQLContext
    ) => {
      const where: any = {};
      if (slugEn) where.slugEn = slugEn;
      if (slugAr) where.slugAr = slugAr;

      return await prisma.page.findFirst({
        where,
        include: {
          blocks: {
            orderBy: { order: 'asc' },
          },
        },
      });
    },
  },

  Mutation: {
    createPage: async (
      _: any,
      { input }: any,
      { prisma, user }: GraphQLContext
    ) => {
      if (!user || user.role !== 'admin') {
        throw new GraphQLError('Unauthorized - Admin access required', {
          extensions: { code: 'UNAUTHORIZED' },
        });
      }

      return await prisma.page.create({
        data: {
          titleEn: input.titleEn,
          titleAr: input.titleAr,
          slugEn: input.slugEn,
          slugAr: input.slugAr,
          descriptionEn: input.descriptionEn || '',
          descriptionAr: input.descriptionAr || '',
          seoMetaTitleEn: input.seoMetaTitleEn,
          seoMetaTitleAr: input.seoMetaTitleAr,
          seoMetaDescEn: input.seoMetaDescEn,
          seoMetaDescAr: input.seoMetaDescAr,
          seoKeywords: input.seoKeywords || [],
          status: input.status || 'draft',
          featured: input.featured || false,
          blocks: {
            create: (input.blocks || []).map((block: any, index: number) => ({
              type: block.type,
              data: block.data,
              order: block.order ?? index,
            })),
          },
        },
        include: {
          blocks: {
            orderBy: { order: 'asc' },
          },
        },
      });
    },

    updatePage: async (
      _: any,
      { id, input }: any,
      { prisma, user }: GraphQLContext
    ) => {
      if (!user || user.role !== 'admin') {
        throw new GraphQLError('Unauthorized - Admin access required', {
          extensions: { code: 'UNAUTHORIZED' },
        });
      }

      // If blocks are provided, delete existing and create new ones
      if (input.blocks) {
        await prisma.block.deleteMany({ where: { pageId: id } });
      }

      return await prisma.page.update({
        where: { id },
        data: {
          ...(input.titleEn && { titleEn: input.titleEn }),
          ...(input.titleAr && { titleAr: input.titleAr }),
          ...(input.slugEn && { slugEn: input.slugEn }),
          ...(input.slugAr && { slugAr: input.slugAr }),
          ...(input.descriptionEn !== undefined && { descriptionEn: input.descriptionEn }),
          ...(input.descriptionAr !== undefined && { descriptionAr: input.descriptionAr }),
          ...(input.seoMetaTitleEn !== undefined && { seoMetaTitleEn: input.seoMetaTitleEn }),
          ...(input.seoMetaTitleAr !== undefined && { seoMetaTitleAr: input.seoMetaTitleAr }),
          ...(input.seoMetaDescEn !== undefined && { seoMetaDescEn: input.seoMetaDescEn }),
          ...(input.seoMetaDescAr !== undefined && { seoMetaDescAr: input.seoMetaDescAr }),
          ...(input.seoKeywords && { seoKeywords: input.seoKeywords }),
          ...(input.status && { status: input.status }),
          ...(input.featured !== undefined && { featured: input.featured }),
          ...(input.blocks && {
            blocks: {
              create: input.blocks.map((block: any, index: number) => ({
                type: block.type,
                data: block.data,
                order: block.order ?? index,
              })),
            },
          }),
        },
        include: {
          blocks: {
            orderBy: { order: 'asc' },
          },
        },
      });
    },

    deletePage: async (
      _: any,
      { id }: any,
      { prisma, user }: GraphQLContext
    ) => {
      if (!user || user.role !== 'admin') {
        throw new GraphQLError('Unauthorized - Admin access required', {
          extensions: { code: 'UNAUTHORIZED' },
        });
      }

      await prisma.page.delete({ where: { id } });
      return true;
    },
  },
};
