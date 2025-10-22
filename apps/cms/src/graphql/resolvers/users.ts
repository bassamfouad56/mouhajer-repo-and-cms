import { GraphQLContext } from '../context';
import { GraphQLError } from 'graphql';
import bcrypt from 'bcryptjs';

export const userResolvers = {
  Query: {
    users: async (
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

      if (filter?.role) {
        where.role = filter.role;
      }

      if (filter?.search) {
        where.OR = [
          { name: { contains: filter.search, mode: 'insensitive' } },
          { email: { contains: filter.search, mode: 'insensitive' } },
        ];
      }

      const [users, total] = await Promise.all([
        prisma.user.findMany({
          where,
          orderBy: { createdAt: 'desc' },
          take: limit,
          skip: offset,
        }),
        prisma.user.count({ where }),
      ]);

      return {
        users,
        total,
        hasMore: offset + limit < total,
      };
    },

    user: async (_: any, { id }: any, { prisma, user }: GraphQLContext) => {
      if (!user || user.role !== 'admin') {
        throw new GraphQLError('Unauthorized - Admin access required', {
          extensions: { code: 'UNAUTHORIZED' },
        });
      }

      return await prisma.user.findUnique({
        where: { id },
      });
    },

    me: async (_: any, __: any, { prisma, user }: GraphQLContext) => {
      if (!user) {
        throw new GraphQLError('Not authenticated', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }

      return await prisma.user.findUnique({
        where: { id: user.id },
      });
    },
  },

  Mutation: {
    createUser: async (
      _: any,
      { input }: any,
      { prisma, user }: GraphQLContext
    ) => {
      if (!user || user.role !== 'admin') {
        throw new GraphQLError('Unauthorized - Admin access required', {
          extensions: { code: 'UNAUTHORIZED' },
        });
      }

      const hashedPassword = await bcrypt.hash(input.password, 10);

      return await prisma.user.create({
        data: {
          name: input.name,
          email: input.email,
          password: hashedPassword,
          role: input.role || 'USER',
        },
      });
    },

    updateUser: async (
      _: any,
      { id, input }: any,
      { prisma, user }: GraphQLContext
    ) => {
      if (!user || user.role !== 'admin') {
        throw new GraphQLError('Unauthorized - Admin access required', {
          extensions: { code: 'UNAUTHORIZED' },
        });
      }

      const updateData: any = {};

      if (input.name) updateData.name = input.name;
      if (input.email) updateData.email = input.email;
      if (input.role) updateData.role = input.role;
      if (input.image !== undefined) updateData.image = input.image;

      if (input.password) {
        updateData.password = await bcrypt.hash(input.password, 10);
      }

      return await prisma.user.update({
        where: { id },
        data: updateData,
      });
    },

    deleteUser: async (
      _: any,
      { id }: any,
      { prisma, user }: GraphQLContext
    ) => {
      if (!user || user.role !== 'admin') {
        throw new GraphQLError('Unauthorized - Admin access required', {
          extensions: { code: 'UNAUTHORIZED' },
        });
      }

      await prisma.user.delete({ where: { id } });
      return true;
    },
  },
};
