import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/session';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const branchId = searchParams.get('branchId');
    const categoryId = searchParams.get('categoryId');

    const items = await db.item.findMany({
      where: {
        isActive: true,
        ...(categoryId ? { categoryId } : {}),
      },
      include: {
        category: true,
        itemVariants: branchId
          ? {
              where: { branchId },
              orderBy: { price: 'asc' },
            }
          : false,
      },
      orderBy: { createdAt: 'desc' },
    });

    // Map itemVariants to variants for frontend compatibility
    const mappedItems = items.map((item) => ({
      ...item,
      variants: item.itemVariants,
      itemVariants: undefined,
    }));

    return NextResponse.json(mappedItems);
  } catch (error) {
    console.error('Error fetching items:', error);
    return NextResponse.json({ error: 'Failed to fetch items' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session?.isLoggedIn) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { categoryId, name_ar, name_en, description_ar, description_en, imageUrl, calories, allergens, nutritionalFacts } = body;

    if (!categoryId || !name_ar || !name_en) {
      return NextResponse.json({ error: 'categoryId, name_ar, and name_en are required' }, { status: 400 });
    }

    const item = await db.item.create({
      data: {
        categoryId,
        name_ar,
        name_en,
        description_ar: description_ar || null,
        description_en: description_en || null,
        imageUrl: imageUrl || null,
        calories: calories ?? null,
        allergens: allergens || null,
        nutritionalFacts: nutritionalFacts || null,
      },
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error('Error creating item:', error);
    return NextResponse.json({ error: 'Failed to create item' }, { status: 500 });
  }
}
