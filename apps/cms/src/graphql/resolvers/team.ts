import { GraphQLError } from 'graphql';

export const teamResolvers = {
  Query: {
    teamMembers: async (_: any, { filter, limit = 20, offset = 0 }: any, { prisma }: any) => {
      const where: any = {};

      if (filter) {
        if (filter.locale) where.locale = filter.locale;
        if (filter.department) where.department = filter.department;
        if (filter.featured !== undefined) where.featured = filter.featured;
        if (filter.published !== undefined) where.published = filter.published;
      }

      const teamMembers = await prisma.teamMember.findMany({
        where,
        take: limit,
        skip: offset,
        orderBy: [
          { order: 'asc' },
          { createdAt: 'desc' },
        ],
      });

      return teamMembers;
    },

    teamMember: async (_: any, { id }: any, { prisma }: any) => {
      const teamMember = await prisma.teamMember.findUnique({
        where: { id },
      });

      if (!teamMember) {
        throw new GraphQLError('Team member not found', {
          extensions: { code: 'NOT_FOUND' },
        });
      }

      return teamMember;
    },

    teamMembersCount: async (_: any, { filter }: any, { prisma }: any) => {
      const where: any = {};

      if (filter) {
        if (filter.locale) where.locale = filter.locale;
        if (filter.department) where.department = filter.department;
        if (filter.featured !== undefined) where.featured = filter.featured;
        if (filter.published !== undefined) where.published = filter.published;
      }

      return await prisma.teamMember.count({ where });
    },

    teamMembersByDepartment: async (_: any, { department, locale }: any, { prisma }: any) => {
      const where: any = {
        department,
        published: true,
      };

      if (locale) {
        where.locale = locale;
      }

      const teamMembers = await prisma.teamMember.findMany({
        where,
        orderBy: { order: 'asc' },
      });

      return teamMembers;
    },
  },

  Mutation: {
    createTeamMember: async (_: any, { input }: any, { prisma, user }: any) => {
      // Check authentication
      if (!user) {
        throw new GraphQLError('Unauthorized - Please log in', {
          extensions: { code: 'UNAUTHORIZED' },
        });
      }

      // Check permissions (admin or editor can create)
      if (user.role !== 'admin' && user.role !== 'editor') {
        throw new GraphQLError('Forbidden - Admin or Editor access required', {
          extensions: { code: 'FORBIDDEN' },
        });
      }

      const teamMember = await prisma.teamMember.create({
        data: {
          ...input,
          locale: input.locale || 'en',
          featured: input.featured !== undefined ? input.featured : false,
          published: input.published !== undefined ? input.published : true,
          order: input.order !== undefined ? input.order : 0,
          specialties: input.specialties || [],
          certifications: input.certifications || [],
        },
      });

      return teamMember;
    },

    updateTeamMember: async (_: any, { id, input }: any, { prisma, user }: any) => {
      // Check authentication
      if (!user) {
        throw new GraphQLError('Unauthorized - Please log in', {
          extensions: { code: 'UNAUTHORIZED' },
        });
      }

      // Check permissions
      if (user.role !== 'admin' && user.role !== 'editor') {
        throw new GraphQLError('Forbidden - Admin or Editor access required', {
          extensions: { code: 'FORBIDDEN' },
        });
      }

      // Check if team member exists
      const exists = await prisma.teamMember.findUnique({ where: { id } });
      if (!exists) {
        throw new GraphQLError('Team member not found', {
          extensions: { code: 'NOT_FOUND' },
        });
      }

      const teamMember = await prisma.teamMember.update({
        where: { id },
        data: input,
      });

      return teamMember;
    },

    deleteTeamMember: async (_: any, { id }: any, { prisma, user }: any) => {
      // Check authentication
      if (!user) {
        throw new GraphQLError('Unauthorized - Please log in', {
          extensions: { code: 'UNAUTHORIZED' },
        });
      }

      // Check permissions (only admin can delete)
      if (user.role !== 'admin') {
        throw new GraphQLError('Forbidden - Admin access required', {
          extensions: { code: 'FORBIDDEN' },
        });
      }

      // Check if team member exists
      const exists = await prisma.teamMember.findUnique({ where: { id } });
      if (!exists) {
        throw new GraphQLError('Team member not found', {
          extensions: { code: 'NOT_FOUND' },
        });
      }

      await prisma.teamMember.delete({ where: { id } });

      return true;
    },
  },
};
