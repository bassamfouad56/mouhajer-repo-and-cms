import { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { corsHeaders } from '@/lib/cors';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const resource = searchParams.get('resource');
    const userId = searchParams.get('userId');
    const limit = parseInt(searchParams.get('limit') || '50');

    const where: any = {};
    if (action) where.action = action;
    if (resource) where.resource = resource;
    if (userId) where.userId = userId;

    const logs = await prisma.activityLog.findMany({
      where,
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit
    });

    return Response.json(logs, { headers: corsHeaders });
  } catch (error: any) {
    console.error('Error fetching activity logs:', error);
    return Response.json(
      { error: error.message || 'Failed to fetch activity logs' },
      { status: 500, headers: corsHeaders }
    );
  }
}
