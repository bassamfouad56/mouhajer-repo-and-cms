import { GraphQLContext } from '../context';
import { GraphQLError } from 'graphql';

export const adResolvers = {
  Query: {
    ads: async (
      _: any,
      { filter, limit = 10, offset = 0 }: any,
      { prisma }: GraphQLContext
    ) => {
      const where: any = {};

      if (filter?.placement) {
        where.placement = filter.placement;
      }

      if (filter?.active !== undefined) {
        where.active = filter.active;
      }

      const [ads, total] = await Promise.all([
        prisma.ad.findMany({
          where,
          orderBy: { createdAt: 'desc' },
          take: limit,
          skip: offset,
        }),
        prisma.ad.count({ where }),
      ]);

      return {
        ads,
        total,
        hasMore: offset + limit < total,
      };
    },

    ad: async (_: any, { id }: any, { prisma }: GraphQLContext) => {
      return await prisma.ad.findUnique({
        where: { id },
      });
    },

    activeAds: async (
      _: any,
      { placement }: any,
      { prisma }: GraphQLContext
    ) => {
      const now = new Date();
      const where: any = {
        active: true,
        OR: [
          { startDate: null },
          { startDate: { lte: now } },
        ],
        AND: [
          {
            OR: [
              { endDate: null },
              { endDate: { gte: now } },
            ],
          },
        ],
      };

      if (placement) {
        where.placement = placement;
      }

      return await prisma.ad.findMany({
        where,
        orderBy: { createdAt: 'desc' },
      });
    },
  },

  Mutation: {
    createAd: async (
      _: any,
      { input }: any,
      { prisma, user }: GraphQLContext
    ) => {
      if (!user || user.role !== 'admin') {
        throw new GraphQLError('Unauthorized - Admin access required', {
          extensions: { code: 'UNAUTHORIZED' },
        });
      }

      return await prisma.ad.create({
        data: {
          titleEn: input.titleEn,
          titleAr: input.titleAr,
          descriptionEn: input.descriptionEn,
          descriptionAr: input.descriptionAr,
          imageUrl: input.imageUrl,
          linkUrl: input.linkUrl,
          placement: input.placement,
          active: input.active ?? true,
          startDate: input.startDate,
          endDate: input.endDate,
          impressions: 0,
          clicks: 0,
        },
      });
    },

    updateAd: async (
      _: any,
      { id, input }: any,
      { prisma, user }: GraphQLContext
    ) => {
      if (!user || user.role !== 'admin') {
        throw new GraphQLError('Unauthorized - Admin access required', {
          extensions: { code: 'UNAUTHORIZED' },
        });
      }

      return await prisma.ad.update({
        where: { id },
        data: {
          ...(input.titleEn && { titleEn: input.titleEn }),
          ...(input.titleAr && { titleAr: input.titleAr }),
          ...(input.descriptionEn !== undefined && { descriptionEn: input.descriptionEn }),
          ...(input.descriptionAr !== undefined && { descriptionAr: input.descriptionAr }),
          ...(input.imageUrl !== undefined && { imageUrl: input.imageUrl }),
          ...(input.linkUrl !== undefined && { linkUrl: input.linkUrl }),
          ...(input.placement && { placement: input.placement }),
          ...(input.active !== undefined && { active: input.active }),
          ...(input.startDate !== undefined && { startDate: input.startDate }),
          ...(input.endDate !== undefined && { endDate: input.endDate }),
        },
      });
    },

    deleteAd: async (
      _: any,
      { id }: any,
      { prisma, user }: GraphQLContext
    ) => {
      if (!user || user.role !== 'admin') {
        throw new GraphQLError('Unauthorized - Admin access required', {
          extensions: { code: 'UNAUTHORIZED' },
        });
      }

      await prisma.ad.delete({ where: { id } });
      return true;
    },

    trackAdImpression: async (
      _: any,
      { id }: any,
      { prisma }: GraphQLContext
    ) => {
      await prisma.ad.update({
        where: { id },
        data: {
          impressions: { increment: 1 },
        },
      });
      return true;
    },

    trackAdClick: async (
      _: any,
      { id }: any,
      { prisma }: GraphQLContext
    ) => {
      await prisma.ad.update({
        where: { id },
        data: {
          clicks: { increment: 1 },
        },
      });
      return true;
    },
  },
};
