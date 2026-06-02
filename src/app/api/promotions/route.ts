import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/session';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const branchId = searchParams.get('branchId');

    const promotions = await db.promotion.findMany({
      where: {
        active: true,
        ...(branchId
          ? {
              branches: {
                some: { branchId },
              },
            }
          : {}),
      },
      include: {
        branches: {
          include: {
            branch: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(promotions);
  } catch (error) {
    console.error('Error fetching promotions:', error);
    return NextResponse.json({ error: 'Failed to fetch promotions' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session?.isLoggedIn) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title_ar, title_en, imageUrl, startDate, endDate, branchIds } = body;

    if (!title_ar || !title_en || !startDate || !endDate) {
      return NextResponse.json({ error: 'title_ar, title_en, startDate, and endDate are required' }, { status: 400 });
    }

    const promotion = await db.promotion.create({
      data: {
        title_ar,
        title_en,
        imageUrl: imageUrl || null,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        ...(branchIds && branchIds.length > 0
          ? {
              branches: {
                create: branchIds.map((branchId: string) => ({ branchId })),
              },
            }
          : {}),
      },
      include: {
        branches: {
          include: {
            branch: true,
          },
        },
      },
    });

    return NextResponse.json(promotion, { status: 201 });
  } catch (error) {
    console.error('Error creating promotion:', error);
    return NextResponse.json({ error: 'Failed to create promotion' }, { status: 500 });
  }
}
