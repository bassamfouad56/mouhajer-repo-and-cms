import { GraphQLContext } from '../context';
import { GraphQLError } from 'graphql';

export const activityResolvers = {
  Query: {
    activityLogs: async (
      _: any,
      { filter, limit = 20, offset = 0 }: any,
      { prisma, user }: GraphQLContext
    ) => {
      if (!user || user.role !== 'admin') {
        throw new GraphQLError('Unauthorized - Admin access required', {
          extensions: { code: 'UNAUTHORIZED' },
        });
      }

      const where: any = {};

      if (filter?.type) {
        where.type = filter.type;
      }

      if (filter?.userId) {
        where.userId = filter.userId;
      }

      if (filter?.startDate || filter?.endDate) {
        where.createdAt = {};
        if (filter.startDate) {
          where.createdAt.gte = new Date(filter.startDate);
        }
        if (filter.endDate) {
          where.createdAt.lte = new Date(filter.endDate);
        }
      }

      const [activities, total] = await Promise.all([
        prisma.activity.findMany({
          where,
          orderBy: { createdAt: 'desc' },
          take: limit,
          skip: offset,
        }),
        prisma.activity.count({ where }),
      ]);

      return {
        activities,
        total,
        hasMore: offset + limit < total,
      };
    },

    activityLog: async (
      _: any,
      { id }: any,
      { prisma, user }: GraphQLContext
    ) => {
      if (!user || user.role !== 'admin') {
        throw new GraphQLError('Unauthorized - Admin access required', {
          extensions: { code: 'UNAUTHORIZED' },
        });
      }

      return await prisma.activity.findUnique({
        where: { id },
      });
    },
  },

  Mutation: {
    logActivity: async (
      _: any,
      { type, description, metadata }: any,
      { prisma, user }: GraphQLContext
    ) => {
      return await prisma.activity.create({
        data: {
          type,
          description,
          userId: user?.id,
          userName: user?.name,
          metadata: metadata || {},
        },
      });
    },
  },
};
