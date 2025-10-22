import { NextRequest } from 'next/server';
import { corsResponse } from '@/lib/cors';
import { seedHomePage } from '@/lib/seed-home-page';
import { auth, isAdmin } from '@/lib/auth';

export async function POST(request: NextRequest) {
  // Security: Only allow in development OR for authenticated admin users
  if (process.env.NODE_ENV !== 'development') {
    const session = await auth();

    if (!session || !(await isAdmin())) {
      return corsResponse(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }
  }

  try {
    const homePage = await seedHomePage();

    return corsResponse({
      success: true,
      message: 'Home page seeded successfully',
      data: homePage
    });
  } catch (error) {
    console.error('Seed error:', error);
    return corsResponse(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return corsResponse({ message: 'Use POST to seed Home page' });
}