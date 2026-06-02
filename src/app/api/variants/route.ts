import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/session';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const branchId = searchParams.get('branchId');
    const itemId = searchParams.get('itemId');

    if (!branchId || !itemId) {
      return NextResponse.json({ error: 'branchId and itemId are required' }, { status: 400 });
    }

    const variants = await db.branchItemVariant.findMany({
      where: { branchId, itemId },
      orderBy: { price: 'asc' },
    });

    return NextResponse.json(variants);
  } catch (error) {
    console.error('Error fetching variants:', error);
    return NextResponse.json({ error: 'Failed to fetch variants' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session?.isLoggedIn) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { branchId, itemId, variantName_ar, variantName_en, price, available, status } = body;

    if (!branchId || !itemId || !variantName_ar || !variantName_en || price === undefined) {
      return NextResponse.json(
        { error: 'branchId, itemId, variantName_ar, variantName_en, and price are required' },
        { status: 400 }
      );
    }

    const variant = await db.branchItemVariant.create({
      data: {
        branchId,
        itemId,
        variantName_ar,
        variantName_en,
        price,
        available: available ?? true,
        status: status || 'available',
      },
    });

    return NextResponse.json(variant, { status: 201 });
  } catch (error) {
    console.error('Error creating variant:', error);
    return NextResponse.json({ error: 'Failed to create variant' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session?.isLoggedIn) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: 'Variant id is required' }, { status: 400 });
    }

    const variant = await db.branchItemVariant.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(variant);
  } catch (error) {
    console.error('Error updating variant:', error);
    return NextResponse.json({ error: 'Failed to update variant' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session?.isLoggedIn) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Variant id is required' }, { status: 400 });
    }

    await db.branchItemVariant.delete({ where: { id } });

    return NextResponse.json({ message: 'Variant deleted successfully' });
  } catch (error) {
    console.error('Error deleting variant:', error);
    return NextResponse.json({ error: 'Failed to delete variant' }, { status: 500 });
  }
}
