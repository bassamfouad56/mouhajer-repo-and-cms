import { GraphQLError } from 'graphql';

export const caseStudyResolvers = {
  Query: {
    caseStudies: async (_: any, { filter, limit = 20, offset = 0 }: any, { prisma }: any) => {
      const where: any = {};

      if (filter) {
        if (filter.locale) where.locale = filter.locale;
        if (filter.projectType) where.projectType = filter.projectType;
        if (filter.featured !== undefined) where.featured = filter.featured;
        if (filter.published !== undefined) where.published = filter.published;
      }

      const caseStudies = await prisma.caseStudy.findMany({
        where,
        take: limit,
        skip: offset,
        orderBy: [
          { order: 'asc' },
          { completionDate: 'desc' },
        ],
      });

      return caseStudies;
    },

    caseStudy: async (_: any, { id }: any, { prisma }: any) => {
      const caseStudy = await prisma.caseStudy.findUnique({
        where: { id },
      });

      if (!caseStudy) {
        throw new GraphQLError('Case study not found', {
          extensions: { code: 'NOT_FOUND' },
        });
      }

      return caseStudy;
    },

    caseStudiesCount: async (_: any, { filter }: any, { prisma }: any) => {
      const where: any = {};

      if (filter) {
        if (filter.locale) where.locale = filter.locale;
        if (filter.projectType) where.projectType = filter.projectType;
        if (filter.featured !== undefined) where.featured = filter.featured;
        if (filter.published !== undefined) where.published = filter.published;
      }

      return await prisma.caseStudy.count({ where });
    },

    caseStudiesByProjectType: async (_: any, { projectType, locale }: any, { prisma }: any) => {
      const where: any = {
        projectType,
        published: true,
      };

      if (locale) {
        where.locale = locale;
      }

      const caseStudies = await prisma.caseStudy.findMany({
        where,
        orderBy: { completionDate: 'desc' },
      });

      return caseStudies;
    },
  },

  Mutation: {
    createCaseStudy: async (_: any, { input }: any, { prisma, user }: any) => {
      if (!user) {
        throw new GraphQLError('Unauthorized - Please log in', {
          extensions: { code: 'UNAUTHORIZED' },
        });
      }

      if (user.role !== 'admin' && user.role !== 'editor') {
        throw new GraphQLError('Forbidden - Admin or Editor access required', {
          extensions: { code: 'FORBIDDEN' },
        });
      }

      const caseStudy = await prisma.caseStudy.create({
        data: {
          ...input,
          locale: input.locale || 'en',
          featured: input.featured !== undefined ? input.featured : false,
          published: input.published !== undefined ? input.published : true,
          timelineMet: input.timelineMet !== undefined ? input.timelineMet : true,
          showClientName: input.showClientName !== undefined ? input.showClientName : false,
          order: input.order !== undefined ? input.order : 0,
          beforeImages: input.beforeImages || [],
          afterImages: input.afterImages || [],
          gallery: input.gallery || [],
          features: input.features || [],
          stylesTags: input.stylesTags || [],
          teamMembers: input.teamMembers || [],
          contractors: input.contractors || [],
          keywords: input.keywords || [],
          tags: input.tags || [],
        },
      });

      return caseStudy;
    },

    updateCaseStudy: async (_: any, { id, input }: any, { prisma, user }: any) => {
      if (!user) {
        throw new GraphQLError('Unauthorized - Please log in', {
          extensions: { code: 'UNAUTHORIZED' },
        });
      }

      if (user.role !== 'admin' && user.role !== 'editor') {
        throw new GraphQLError('Forbidden - Admin or Editor access required', {
          extensions: { code: 'FORBIDDEN' },
        });
      }

      const exists = await prisma.caseStudy.findUnique({ where: { id } });
      if (!exists) {
        throw new GraphQLError('Case study not found', {
          extensions: { code: 'NOT_FOUND' },
        });
      }

      const caseStudy = await prisma.caseStudy.update({
        where: { id },
        data: input,
      });

      return caseStudy;
    },

    deleteCaseStudy: async (_: any, { id }: any, { prisma, user }: any) => {
      if (!user) {
        throw new GraphQLError('Unauthorized - Please log in', {
          extensions: { code: 'UNAUTHORIZED' },
        });
      }

      if (user.role !== 'admin') {
        throw new GraphQLError('Forbidden - Admin access required', {
          extensions: { code: 'FORBIDDEN' },
        });
      }

      const exists = await prisma.caseStudy.findUnique({ where: { id } });
      if (!exists) {
        throw new GraphQLError('Case study not found', {
          extensions: { code: 'NOT_FOUND' },
        });
      }

      await prisma.caseStudy.delete({ where: { id } });

      return true;
    },
  },
};
