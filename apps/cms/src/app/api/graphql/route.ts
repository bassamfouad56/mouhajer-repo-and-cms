import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { NextRequest } from 'next/server';
import { typeDefs } from '@/graphql/schema';
import { initializeResolvers } from '@/graphql/resolvers';
import { createContext, GraphQLContext } from '@/graphql/context';
import { prisma } from '@/lib/prisma';

const isProduction = process.env.NODE_ENV === 'production';

// Promise-based singleton pattern for handler caching
// This ensures the handler is created only ONCE, preventing multiple Apollo Server initializations
let handlerPromise: Promise<ReturnType<typeof startServerAndCreateNextHandler>> | null = null;

async function getHandler() {
  // Return existing handler promise if already initializing or initialized
  if (handlerPromise) {
    return handlerPromise;
  }

  // Create new initialization promise
  handlerPromise = (async () => {
    console.log('🔄 Initializing GraphQL server with blueprint resolvers...');

    try {
      const resolvers = await initializeResolvers(prisma);

      const server = new ApolloServer<GraphQLContext>({
        typeDefs,
        resolvers,
        introspection: !isProduction, // disable in production
        plugins: isProduction
          ? []
          : [
              ApolloServerPluginLandingPageLocalDefault({
                embed: true,
                includeCookies: true,
              }),
            ],
      });

      // Create handler ONCE - this internally calls server.start() or startInBackground...
      const handler = startServerAndCreateNextHandler<NextRequest, GraphQLContext>(
        server,
        {
          context: async (req) => createContext(),
        }
      );

      console.log('✅ GraphQL server initialized with dynamic blueprint resolvers');

      return handler;
    } catch (error) {
      // Reset on error so we can retry
      handlerPromise = null;
      console.error('❌ Failed to initialize GraphQL server:', error);
      throw error;
    }
  })();

  return handlerPromise;
}

export async function GET(request: NextRequest) {
  const handler = await getHandler();
  return handler(request);
}

export async function POST(request: NextRequest) {
  const handler = await getHandler();
  return handler(request);
}

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
