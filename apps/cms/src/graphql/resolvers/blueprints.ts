import { PrismaClient } from '@prisma/client';

// Helper function to get blueprint by name
async function getBlueprintByName(prisma: PrismaClient, name: string) {
  const blueprint = await prisma.contentBlueprint.findUnique({
    where: { name },
  });

  if (!blueprint) {
    throw new Error(`Blueprint "${name}" not found`);
  }

  return blueprint;
}

// Helper function to map instance data to GraphQL type
function mapInstanceToGraphQL(instance: any, locale: 'EN' | 'AR') {
  const data = locale === 'EN' ? instance.dataEn : instance.dataAr;

  return {
    id: instance.id,
    ...data,
    status: instance.status,
    publishedAt: instance.publishedAt,
    createdAt: instance.createdAt,
    updatedAt: instance.updatedAt,
  };
}

// Helper function to pluralize blueprint names
function pluralize(str: string): string {
  if (str.endsWith('y')) {
    return str.slice(0, -1) + 'ies';
  }
  if (str.endsWith('s') || str.endsWith('x') || str.endsWith('z') || str.endsWith('ch') || str.endsWith('sh')) {
    return str + 'es';
  }
  return str + 's';
}

// Dynamic resolver generator for all blueprints
export async function generateBlueprintResolvers(prisma: PrismaClient) {
  const blueprints = await prisma.contentBlueprint.findMany();

  const queries: any = {
    // Blueprint metadata queries
    blueprints: async () => {
      return await prisma.contentBlueprint.findMany({
        orderBy: { name: 'asc' },
      });
    },

    blueprint: async (_: any, { id }: { id: string }) => {
      return await prisma.contentBlueprint.findUnique({
        where: { id },
      });
    },
  };

  const mutations: any = {};

  // Generate resolvers for each blueprint
  for (const blueprint of blueprints) {
    const blueprintName = blueprint.name;
    const queryName = blueprintName.toLowerCase();
    const pluralQueryName = pluralize(queryName);

    // Query: Get all instances (if allowMultiple)
    if (blueprint.allowMultiple) {
      queries[pluralQueryName] = async (
        _: any,
        {
          locale = 'EN',
          filter = {},
          limit = 10,
          offset = 0,
          orderBy = 'createdAt',
          orderDirection = 'desc',
        }: {
          locale?: 'EN' | 'AR';
          filter?: any;
          limit?: number;
          offset?: number;
          orderBy?: string;
          orderDirection?: 'asc' | 'desc';
        }
      ) => {
        const where: any = {
          blueprintId: blueprint.id,
        };

        // Apply filters
        if (filter.status) {
          where.status = filter.status;
        }

        if (filter.publishedAt_gte || filter.publishedAt_lte) {
          where.publishedAt = {};
          if (filter.publishedAt_gte) {
            where.publishedAt.gte = new Date(filter.publishedAt_gte);
          }
          if (filter.publishedAt_lte) {
            where.publishedAt.lte = new Date(filter.publishedAt_lte);
          }
        }

        // Text search (searches in both EN and AR data)
        if (filter.search) {
          // This is a simplified search - in production, you'd want full-text search
          const searchTerm = filter.search.toLowerCase();
          where.OR = [
            { dataEn: { path: [], string_contains: searchTerm } },
            { dataAr: { path: [], string_contains: searchTerm } },
          ];
        }

        const instances = await prisma.blueprintInstance.findMany({
          where,
          take: limit,
          skip: offset,
          orderBy: { [orderBy]: orderDirection },
        });

        return instances.map((inst) => mapInstanceToGraphQL(inst, locale));
      };
    }

    // Query: Get single instance by ID
    queries[queryName] = async (
      _: any,
      { id, locale = 'EN' }: { id: string; locale?: 'EN' | 'AR' }
    ) => {
      const instance = await prisma.blueprintInstance.findUnique({
        where: { id },
      });

      if (!instance) {
        return null;
      }

      // Verify it's the correct blueprint type
      if (instance.blueprintId !== blueprint.id) {
        return null;
      }

      return mapInstanceToGraphQL(instance, locale);
    };

    // Mutation: Create instance
    mutations[`create${blueprintName}`] = async (
      _: any,
      { input, locale = 'EN' }: { input: any; locale?: 'EN' | 'AR' }
    ) => {
      const { status, publishedAt, ...data } = input;

      const instance = await prisma.blueprintInstance.create({
        data: {
          blueprintId: blueprint.id,
          dataEn: data, // Initially same data for both locales
          dataAr: data, // User can translate later
          status: status || 'draft',
          publishedAt: publishedAt ? new Date(publishedAt) : null,
        },
      });

      return mapInstanceToGraphQL(instance, locale);
    };

    // Mutation: Update instance
    mutations[`update${blueprintName}`] = async (
      _: any,
      { id, input, locale = 'EN' }: { id: string; input: any; locale?: 'EN' | 'AR' }
    ) => {
      const { status, publishedAt, ...data } = input;

      // Fetch existing instance to merge data
      const existing = await prisma.blueprintInstance.findUnique({
        where: { id },
      });

      if (!existing) {
        throw new Error(`Instance with ID ${id} not found`);
      }

      // Merge new data with existing data for the specified locale
      const updatedDataEn =
        locale === 'EN'
          ? { ...existing.dataEn, ...data }
          : existing.dataEn;
      const updatedDataAr =
        locale === 'AR'
          ? { ...existing.dataAr, ...data }
          : existing.dataAr;

      const updateData: any = {
        dataEn: updatedDataEn,
        dataAr: updatedDataAr,
      };

      if (status !== undefined) {
        updateData.status = status;
      }

      if (publishedAt !== undefined) {
        updateData.publishedAt = publishedAt ? new Date(publishedAt) : null;
      }

      const instance = await prisma.blueprintInstance.update({
        where: { id },
        data: updateData,
      });

      return mapInstanceToGraphQL(instance, locale);
    };

    // Mutation: Delete instance
    mutations[`delete${blueprintName}`] = async (
      _: any,
      { id }: { id: string }
    ) => {
      // Check if blueprint is a system blueprint
      if (blueprint.isSystem) {
        throw new Error(`Cannot delete instances of system blueprint "${blueprintName}"`);
      }

      await prisma.blueprintInstance.delete({
        where: { id },
      });

      return true;
    };

    // Mutation: Duplicate instance (if not system blueprint)
    if (!blueprint.isSystem) {
      mutations[`duplicate${blueprintName}`] = async (
        _: any,
        { id }: { id: string }
      ) => {
        const original = await prisma.blueprintInstance.findUnique({
          where: { id },
        });

        if (!original) {
          throw new Error(`Instance with ID ${id} not found`);
        }

        const duplicate = await prisma.blueprintInstance.create({
          data: {
            blueprintId: original.blueprintId,
            pageId: original.pageId,
            dataEn: original.dataEn,
            dataAr: original.dataAr,
            status: 'draft', // New duplicates start as draft
            order: original.order,
          },
        });

        return mapInstanceToGraphQL(duplicate, 'EN');
      };
    }
  }

  return {
    Query: queries,
    Mutation: mutations,
  };
}

// Export static resolvers for common operations
export const blueprintResolvers = {
  Query: {
    // These will be replaced by dynamically generated resolvers
    // This is just a placeholder structure
  },

  Mutation: {
    // Blueprint CRUD operations (for managing blueprints themselves)
    createBlueprint: async (
      _: any,
      { input }: { input: any },
      { prisma, user }: { prisma: PrismaClient; user: any }
    ) => {
      // Only admins can create blueprints
      if (!user || user.role !== 'admin') {
        throw new Error('Only admins can create blueprints');
      }

      return await prisma.contentBlueprint.create({
        data: {
          ...input,
          createdBy: user.id,
        },
      });
    },

    updateBlueprint: async (
      _: any,
      { id, input }: { id: string; input: any },
      { prisma, user }: { prisma: PrismaClient; user: any }
    ) => {
      // Only admins can update blueprints
      if (!user || user.role !== 'admin') {
        throw new Error('Only admins can update blueprints');
      }

      // Check if it's a system blueprint
      const blueprint = await prisma.contentBlueprint.findUnique({
        where: { id },
      });

      if (blueprint?.isSystem) {
        throw new Error('Cannot modify system blueprints');
      }

      return await prisma.contentBlueprint.update({
        where: { id },
        data: input,
      });
    },

    deleteBlueprint: async (
      _: any,
      { id }: { id: string },
      { prisma, user }: { prisma: PrismaClient; user: any }
    ) => {
      // Only admins can delete blueprints
      if (!user || user.role !== 'admin') {
        throw new Error('Only admins can delete blueprints');
      }

      // Check if it's a system blueprint
      const blueprint = await prisma.contentBlueprint.findUnique({
        where: { id },
      });

      if (blueprint?.isSystem) {
        throw new Error('Cannot delete system blueprints');
      }

      // Delete all instances first
      await prisma.blueprintInstance.deleteMany({
        where: { blueprintId: id },
      });

      // Then delete the blueprint
      await prisma.contentBlueprint.delete({
        where: { id },
      });

      return true;
    },
  },
};

// Export function to initialize dynamic resolvers
export async function initializeBlueprintResolvers(prisma: PrismaClient) {
  console.log('🔄 Initializing dynamic blueprint resolvers...');

  const dynamicResolvers = await generateBlueprintResolvers(prisma);

  console.log(`✅ Generated resolvers for ${Object.keys(dynamicResolvers.Query).length - 2} blueprint queries`);
  console.log(`✅ Generated resolvers for ${Object.keys(dynamicResolvers.Mutation).length} blueprint mutations`);

  // Merge static and dynamic resolvers
  return {
    Query: {
      ...blueprintResolvers.Query,
      ...dynamicResolvers.Query,
    },
    Mutation: {
      ...blueprintResolvers.Mutation,
      ...dynamicResolvers.Mutation,
    },
  };
}
