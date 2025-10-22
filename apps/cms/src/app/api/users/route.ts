/**
 * Users API Route
 * Handles user management operations (admin only)
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth, logActivity } from '@/lib/auth';
import { validateRequest, userSchema } from '@/lib/validations';
import { corsResponse } from '@/lib/cors';
import bcrypt from 'bcryptjs';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || session.user.role !== 'admin') {
      return corsResponse(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');
    const active = searchParams.get('active');

    const where: any = {};
    if (role) where.role = role;
    if (active !== null) where.active = active === 'true';

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        active: true,
        avatar: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
        // Exclude password
      },
      orderBy: { createdAt: 'desc' },
    });

    return corsResponse(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return corsResponse(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || session.user.role !== 'admin') {
      return corsResponse(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validation = await validateRequest(userSchema, body);

    if (!validation.success) {
      return corsResponse(
        { error: validation.error },
        { status: 400 }
      );
    }

    const { name, email, password, role, active } = validation.data;

    // Check if user with email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return corsResponse(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        active,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        active: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Log activity
    await logActivity('create', 'user', user.id, { name, email, role });

    return corsResponse(user, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return corsResponse(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}
