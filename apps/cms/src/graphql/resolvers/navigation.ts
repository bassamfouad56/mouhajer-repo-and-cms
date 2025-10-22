import { GraphQLContext } from '../context';
import { GraphQLError } from 'graphql';

export const navigationResolvers = {
  Query: {
    navigation: async (
      _: any,
      { published }: any,
      { prisma }: GraphQLContext
    ) => {
      const where: any = {};
      if (published !== undefined) {
        where.published = published;
      }

      const items = await prisma.navigationItem.findMany({
        where,
        orderBy: { order: 'asc' },
      });

      return {
        items,
        total: items.length,
      };
    },

    navigationItem: async (_: any, { id }: any, { prisma }: GraphQLContext) => {
      return await prisma.navigationItem.findUnique({
        where: { id },
      });
    },

    publicNavigation: async (_: any, __: any, { prisma }: GraphQLContext) => {
      const items = await prisma.navigationItem.findMany({
        where: { published: true },
        orderBy: { order: 'asc' },
      });

      return {
        items,
        total: items.length,
      };
    },
  },

  Mutation: {
    createNavigationItem: async (
      _: any,
      { input }: any,
      { prisma, user }: GraphQLContext
    ) => {
      if (!user || user.role !== 'admin') {
        throw new GraphQLError('Unauthorized - Admin access required', {
          extensions: { code: 'UNAUTHORIZED' },
        });
      }

      return await prisma.navigationItem.create({
        data: {
          labelEn: input.labelEn,
          labelAr: input.labelAr,
          urlEn: input.urlEn,
          urlAr: input.urlAr,
          order: input.order || 0,
          parentId: input.parentId || null,
          published: input.published ?? true,
        },
      });
    },

    updateNavigationItem: async (
      _: any,
      { id, input }: any,
      { prisma, user }: GraphQLContext
    ) => {
      if (!user || user.role !== 'admin') {
        throw new GraphQLError('Unauthorized - Admin access required', {
          extensions: { code: 'UNAUTHORIZED' },
        });
      }

      return await prisma.navigationItem.update({
        where: { id },
        data: {
          ...(input.labelEn && { labelEn: input.labelEn }),
          ...(input.labelAr && { labelAr: input.labelAr }),
          ...(input.urlEn && { urlEn: input.urlEn }),
          ...(input.urlAr && { urlAr: input.urlAr }),
          ...(input.order !== undefined && { order: input.order }),
          ...(input.parentId !== undefined && { parentId: input.parentId }),
          ...(input.published !== undefined && { published: input.published }),
        },
      });
    },

    deleteNavigationItem: async (
      _: any,
      { id }: any,
      { prisma, user }: GraphQLContext
    ) => {
      if (!user || user.role !== 'admin') {
        throw new GraphQLError('Unauthorized - Admin access required', {
          extensions: { code: 'UNAUTHORIZED' },
        });
      }

      await prisma.navigationItem.delete({ where: { id } });
      return true;
    },

    reorderNavigation: async (
      _: any,
      { items }: any,
      { prisma, user }: GraphQLContext
    ) => {
      if (!user || user.role !== 'admin') {
        throw new GraphQLError('Unauthorized - Admin access required', {
          extensions: { code: 'UNAUTHORIZED' },
        });
      }

      // Update each item's order
      await Promise.all(
        items.map((item: any) =>
          prisma.navigationItem.update({
            where: { id: item.id },
            data: { order: item.order },
          })
        )
      );

      return true;
    },
  },

  NavigationItem: {
    children: async (parent: any, _: any, { prisma }: GraphQLContext) => {
      return await prisma.navigationItem.findMany({
        where: { parentId: parent.id },
        orderBy: { order: 'asc' },
      });
    },
  },
};
