import { GraphQLContext } from '../context';
import { GraphQLError } from 'graphql';

export const settingsResolvers = {
  Query: {
    settings: async (_: unknown, __: unknown, context: GraphQLContext) => {
      const { prisma } = context;
      return prisma.settings.findUnique({
        where: { id: 'default' },
      });
    },
  },

  Mutation: {
    updateSettings: async (
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

      if (user.role !== 'admin') {
        throw new GraphQLError('Insufficient permissions', {
          extensions: { code: 'FORBIDDEN' },
        });
      }

      return prisma.settings.upsert({
        where: { id: 'default' },
        update: args.input,
        create: {
          id: 'default',
          ...args.input,
        },
      });
    },
  },
};
