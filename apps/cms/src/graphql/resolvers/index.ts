import { GraphQLScalarType, Kind } from 'graphql';
import { projectResolvers } from './projects';
import { serviceResolvers } from './services';
import { blogResolvers } from './blog';
import { settingsResolvers } from './settings';
import { crmResolvers } from './crm';
import { pageResolvers } from './pages';
import { mediaResolvers } from './media';
import { navigationResolvers } from './navigation';
import { userResolvers } from './users';
import { adResolvers } from './ads';
import { roomRedesignResolvers } from './room-redesign';
import { activityResolvers } from './activity';
import { testimonialResolvers } from './testimonials';
import { faqResolvers } from './faq';
import { teamResolvers } from './team';
import { pricingResolvers } from './pricing';
import { caseStudyResolvers } from './case-studies';
import { initializeBlueprintResolvers } from './blueprints';

// Custom DateTime scalar
const dateTimeScalar = new GraphQLScalarType({
  name: 'DateTime',
  description: 'Date custom scalar type',
  serialize(value: any) {
    if (value instanceof Date) {
      return value.toISOString();
    }
    return value;
  },
  parseValue(value: any) {
    return new Date(value);
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      return new Date(ast.value);
    }
    return null;
  },
});

// Custom JSON scalar
const jsonScalar = new GraphQLScalarType({
  name: 'JSON',
  description: 'JSON custom scalar type',
  serialize(value: any) {
    return value;
  },
  parseValue(value: any) {
    return value;
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      return JSON.parse(ast.value);
    }
    if (ast.kind === Kind.OBJECT) {
      return ast;
    }
    return null;
  },
});

// Export function to initialize resolvers (now async for blueprint resolvers)
export async function initializeResolvers(prisma: any) {
  // Initialize dynamic blueprint resolvers
  const blueprintResolvers = await initializeBlueprintResolvers(prisma);

  return {
    DateTime: dateTimeScalar,
    JSON: jsonScalar,

    Query: {
      ...projectResolvers.Query,
      ...serviceResolvers.Query,
      ...blogResolvers.Query,
      ...settingsResolvers.Query,
      ...crmResolvers.Query,
      ...pageResolvers.Query,
      ...mediaResolvers.Query,
      ...navigationResolvers.Query,
      ...userResolvers.Query,
      ...adResolvers.Query,
      ...roomRedesignResolvers.Query,
      ...activityResolvers.Query,
      ...testimonialResolvers.Query,
      ...faqResolvers.Query,
      ...teamResolvers.Query,
      ...pricingResolvers.Query,
      ...caseStudyResolvers.Query,
      ...blueprintResolvers.Query, // Dynamic blueprint queries
    },

    Mutation: {
      ...projectResolvers.Mutation,
      ...serviceResolvers.Mutation,
      ...blogResolvers.Mutation,
      ...settingsResolvers.Mutation,
      ...crmResolvers.Mutation,
      ...pageResolvers.Mutation,
      ...mediaResolvers.Mutation,
      ...navigationResolvers.Mutation,
      ...userResolvers.Mutation,
      ...adResolvers.Mutation,
      ...roomRedesignResolvers.Mutation,
      ...activityResolvers.Mutation,
      ...testimonialResolvers.Mutation,
      ...faqResolvers.Mutation,
      ...teamResolvers.Mutation,
      ...pricingResolvers.Mutation,
      ...caseStudyResolvers.Mutation,
      ...blueprintResolvers.Mutation, // Dynamic blueprint mutations
    },

    NavigationItem: navigationResolvers.NavigationItem,
  };
}

// For backwards compatibility, export static resolvers
// (These will be replaced with dynamic resolvers at runtime)
export const resolvers = {
  DateTime: dateTimeScalar,
  JSON: jsonScalar,

  Query: {
    ...projectResolvers.Query,
    ...serviceResolvers.Query,
    ...blogResolvers.Query,
    ...settingsResolvers.Query,
    ...crmResolvers.Query,
    ...pageResolvers.Query,
    ...mediaResolvers.Query,
    ...navigationResolvers.Query,
    ...userResolvers.Query,
    ...adResolvers.Query,
    ...roomRedesignResolvers.Query,
    ...activityResolvers.Query,
    ...testimonialResolvers.Query,
    ...faqResolvers.Query,
    ...teamResolvers.Query,
    ...pricingResolvers.Query,
    ...caseStudyResolvers.Query,
  },

  Mutation: {
    ...projectResolvers.Mutation,
    ...serviceResolvers.Mutation,
    ...blogResolvers.Mutation,
    ...settingsResolvers.Mutation,
    ...crmResolvers.Mutation,
    ...pageResolvers.Mutation,
    ...mediaResolvers.Mutation,
    ...navigationResolvers.Mutation,
    ...userResolvers.Mutation,
    ...adResolvers.Mutation,
    ...roomRedesignResolvers.Mutation,
    ...activityResolvers.Mutation,
    ...testimonialResolvers.Mutation,
    ...faqResolvers.Mutation,
    ...teamResolvers.Mutation,
    ...pricingResolvers.Mutation,
    ...caseStudyResolvers.Mutation,
  },

  NavigationItem: navigationResolvers.NavigationItem,
};
