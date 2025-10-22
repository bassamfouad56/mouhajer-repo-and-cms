import { GraphQLError } from 'graphql';

export const pricingResolvers = {
  Query: {
    pricingPlans: async (_: any, { filter, limit = 20, offset = 0 }: any, { prisma }: any) => {
      const where: any = {};

      if (filter) {
        if (filter.locale) where.locale = filter.locale;
        if (filter.tier) where.tier = filter.tier;
        if (filter.popular !== undefined) where.popular = filter.popular;
        if (filter.recommended !== undefined) where.recommended = filter.recommended;
        if (filter.featured !== undefined) where.featured = filter.featured;
        if (filter.published !== undefined) where.published = filter.published;
      }

      const pricingPlans = await prisma.pricingPlan.findMany({
        where,
        take: limit,
        skip: offset,
        orderBy: [
          { order: 'asc' },
          { createdAt: 'desc' },
        ],
      });

      return pricingPlans;
    },

    pricingPlan: async (_: any, { id }: any, { prisma }: any) => {
      const pricingPlan = await prisma.pricingPlan.findUnique({
        where: { id },
      });

      if (!pricingPlan) {
        throw new GraphQLError('Pricing plan not found', {
          extensions: { code: 'NOT_FOUND' },
        });
      }

      return pricingPlan;
    },

    pricingPlansCount: async (_: any, { filter }: any, { prisma }: any) => {
      const where: any = {};

      if (filter) {
        if (filter.locale) where.locale = filter.locale;
        if (filter.tier) where.tier = filter.tier;
        if (filter.popular !== undefined) where.popular = filter.popular;
        if (filter.recommended !== undefined) where.recommended = filter.recommended;
        if (filter.featured !== undefined) where.featured = filter.featured;
        if (filter.published !== undefined) where.published = filter.published;
      }

      return await prisma.pricingPlan.count({ where });
    },

    pricingPlansByTier: async (_: any, { tier, locale }: any, { prisma }: any) => {
      const where: any = {
        tier,
        published: true,
      };

      if (locale) {
        where.locale = locale;
      }

      const pricingPlans = await prisma.pricingPlan.findMany({
        where,
        orderBy: { order: 'asc' },
      });

      return pricingPlans;
    },
  },

  Mutation: {
    createPricingPlan: async (_: any, { input }: any, { prisma, user }: any) => {
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

      const pricingPlan = await prisma.pricingPlan.create({
        data: {
          ...input,
          locale: input.locale || 'en',
          currency: input.currency || 'AED',
          pricingModel: input.pricingModel || 'fixed',
          popular: input.popular !== undefined ? input.popular : false,
          recommended: input.recommended !== undefined ? input.recommended : false,
          featured: input.featured !== undefined ? input.featured : false,
          published: input.published !== undefined ? input.published : true,
          order: input.order !== undefined ? input.order : 0,
          featuresEn: input.featuresEn || [],
          featuresAr: input.featuresAr || [],
          includedServices: input.includedServices || [],
          deliverables: input.deliverables || [],
          limitations: input.limitations || [],
          ctaTextEn: input.ctaTextEn || 'Get Started',
          ctaTextAr: input.ctaTextAr || 'ابدأ الآن',
        },
      });

      return pricingPlan;
    },

    updatePricingPlan: async (_: any, { id, input }: any, { prisma, user }: any) => {
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

      // Check if pricing plan exists
      const exists = await prisma.pricingPlan.findUnique({ where: { id } });
      if (!exists) {
        throw new GraphQLError('Pricing plan not found', {
          extensions: { code: 'NOT_FOUND' },
        });
      }

      const pricingPlan = await prisma.pricingPlan.update({
        where: { id },
        data: input,
      });

      return pricingPlan;
    },

    deletePricingPlan: async (_: any, { id }: any, { prisma, user }: any) => {
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

      // Check if pricing plan exists
      const exists = await prisma.pricingPlan.findUnique({ where: { id } });
      if (!exists) {
        throw new GraphQLError('Pricing plan not found', {
          extensions: { code: 'NOT_FOUND' },
        });
      }

      await prisma.pricingPlan.delete({ where: { id } });

      return true;
    },
  },
};
