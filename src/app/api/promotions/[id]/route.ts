import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/session';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();

    if (!session?.isLoggedIn) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { branchIds, ...updateData } = body;

    // If branchIds provided, update the relation
    if (branchIds && Array.isArray(branchIds)) {
      await db.promotionBranch.deleteMany({ where: { promotionId: id } });

      if (branchIds.length > 0) {
        await db.promotionBranch.createMany({
          data: branchIds.map((branchId: string) => ({ promotionId: id, branchId })),
        });
      }
    }

    const promotion = await db.promotion.update({
      where: { id },
      data: {
        ...updateData,
        ...(updateData.startDate ? { startDate: new Date(updateData.startDate) } : {}),
        ...(updateData.endDate ? { endDate: new Date(updateData.endDate) } : {}),
      },
      include: {
        branches: {
          include: {
            branch: true,
          },
        },
      },
    });

    return NextResponse.json(promotion);
  } catch (error) {
    console.error('Error updating promotion:', error);
    return NextResponse.json({ error: 'Failed to update promotion' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();

    if (!session?.isLoggedIn) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    await db.promotion.delete({ where: { id } });

    return NextResponse.json({ message: 'Promotion deleted successfully' });
  } catch (error) {
    console.error('Error deleting promotion:', error);
    return NextResponse.json({ error: 'Failed to delete promotion' }, { status: 500 });
  }
}
