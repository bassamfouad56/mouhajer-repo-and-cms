import { GraphQLContext } from '../context';
import { GraphQLError } from 'graphql';

export const roomRedesignResolvers = {
  Query: {
    roomRedesigns: async (
      _: any,
      { filter, limit = 10, offset = 0 }: any,
      { prisma, user }: GraphQLContext
    ) => {
      if (!user || user.role !== 'admin') {
        throw new GraphQLError('Unauthorized - Admin access required', {
          extensions: { code: 'UNAUTHORIZED' },
        });
      }

      const where: any = {};

      if (filter?.status) {
        where.status = filter.status;
      }

      if (filter?.userId) {
        where.userId = filter.userId;
      }

      const [images, total] = await Promise.all([
        prisma.roomRedesign.findMany({
          where,
          orderBy: { createdAt: 'desc' },
          take: limit,
          skip: offset,
        }),
        prisma.roomRedesign.count({ where }),
      ]);

      return {
        images,
        total,
        hasMore: offset + limit < total,
      };
    },

    roomRedesign: async (
      _: any,
      { id }: any,
      { prisma, user }: GraphQLContext
    ) => {
      const redesign = await prisma.roomRedesign.findUnique({
        where: { id },
      });

      // Only allow admin or the owner to view
      if (
        redesign &&
        (!user || (user.id !== redesign.userId && user.role !== 'admin'))
      ) {
        throw new GraphQLError('Unauthorized', {
          extensions: { code: 'UNAUTHORIZED' },
        });
      }

      return redesign;
    },

    myRoomRedesigns: async (
      _: any,
      __: any,
      { prisma, user }: GraphQLContext
    ) => {
      if (!user) {
        throw new GraphQLError('Not authenticated', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }

      return await prisma.roomRedesign.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
      });
    },
  },

  Mutation: {
    verifyRoomRedesign: async (
      _: any,
      { id }: any,
      { prisma, user }: GraphQLContext
    ) => {
      if (!user) {
        throw new GraphQLError('Not authenticated', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }

      const redesign = await prisma.roomRedesign.findUnique({
        where: { id },
      });

      if (!redesign) {
        throw new GraphQLError('Room redesign not found', {
          extensions: { code: 'NOT_FOUND' },
        });
      }

      // Only allow admin or the owner
      if (user.id !== redesign.userId && user.role !== 'admin') {
        throw new GraphQLError('Unauthorized', {
          extensions: { code: 'UNAUTHORIZED' },
        });
      }

      return await prisma.roomRedesign.update({
        where: { id },
        data: { status: 'verified' },
      });
    },

    deleteRoomRedesign: async (
      _: any,
      { id }: any,
      { prisma, user }: GraphQLContext
    ) => {
      if (!user) {
        throw new GraphQLError('Not authenticated', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }

      const redesign = await prisma.roomRedesign.findUnique({
        where: { id },
      });

      if (!redesign) {
        throw new GraphQLError('Room redesign not found', {
          extensions: { code: 'NOT_FOUND' },
        });
      }

      // Only allow admin or the owner
      if (user.id !== redesign.userId && user.role !== 'admin') {
        throw new GraphQLError('Unauthorized', {
          extensions: { code: 'UNAUTHORIZED' },
        });
      }

      await prisma.roomRedesign.delete({ where: { id } });
      return true;
    },
  },
};
