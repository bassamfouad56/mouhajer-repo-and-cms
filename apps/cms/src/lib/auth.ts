/**
 * NextAuth Configuration for Mouhajer CMS
 * Handles authentication with credentials and JWT sessions
 */

import NextAuth, { type DefaultSession } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { prisma } from './prisma';
import { PrismaAdapter } from '@auth/prisma-adapter';

// Extend the built-in session types
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: string;
      email: string;
      name: string;
    } & DefaultSession['user'];
  }

  interface User {
    role: string;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user || !user.active) {
          return null;
        }

        const isValidPassword = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!isValidPassword) {
          return null;
        }

        // Update last login
        await prisma.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        });

        // Log login activity
        await prisma.activityLog.create({
          data: {
            userId: user.id,
            action: 'login',
            resource: 'user',
            resourceId: user.id,
          },
        });

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
});

/**
 * Helper function to get current user session
 */
export async function getCurrentUser() {
  const session = await auth();
  return session?.user;
}

/**
 * Helper function to check if user has required role
 */
export async function hasRole(requiredRole: string | string[]) {
  const user = await getCurrentUser();
  if (!user) return false;

  const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
  return roles.includes(user.role);
}

/**
 * Helper function to check if user is admin
 */
export async function isAdmin() {
  return await hasRole('admin');
}

/**
 * Helper function to log activity
 */
export async function logActivity(
  action: string,
  resource: string,
  resourceId?: string,
  details?: any
) {
  const user = await getCurrentUser();
  if (!user) return;

  await prisma.activityLog.create({
    data: {
      userId: user.id,
      action,
      resource,
      resourceId,
      details: details ? JSON.parse(JSON.stringify(details)) : null,
    },
  });
}
