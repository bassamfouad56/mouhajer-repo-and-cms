import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

// POST /api/navigation/reorder - Batch update order of nav items
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const { items } = data;

    if (!Array.isArray(items)) {
      return NextResponse.json(
        { error: 'Items must be an array of {id, order} objects' },
        { status: 400 }
      );
    }

    // Update order for each item in a transaction
    await prisma.$transaction(
      items.map((item: { id: string; order: number }) =>
        prisma.navItem.update({
          where: { id: item.id },
          data: { order: item.order }
        })
      )
    );

    return NextResponse.json({ message: 'Order updated successfully' });
  } catch (error) {
    console.error('Error reordering navigation items:', error);
    return NextResponse.json(
      { error: 'Failed to reorder navigation items' },
      { status: 500 }
    );
  }
}
