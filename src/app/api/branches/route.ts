import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/session';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get('active') === 'true';

    const branches = await db.branch.findMany({
      where: activeOnly ? { isActive: true } : undefined,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(branches);
  } catch (error) {
    console.error('Error fetching branches:', error);
    return NextResponse.json({ error: 'Failed to fetch branches' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session?.isLoggedIn) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name_ar, name_en, slug, address, googleMapLink, phone, whatsapp, instagram, tiktok, snapchat, facebook, websiteUrl } = body;

    if (!name_ar || !name_en || !slug) {
      return NextResponse.json({ error: 'name_ar, name_en, and slug are required' }, { status: 400 });
    }

    const existingBranch = await db.branch.findUnique({ where: { slug } });
    if (existingBranch) {
      return NextResponse.json({ error: 'Branch with this slug already exists' }, { status: 409 });
    }

    const branch = await db.branch.create({
      data: { name_ar, name_en, slug, address, googleMapLink, phone, whatsapp, instagram, tiktok, snapchat, facebook, websiteUrl },
    });

    return NextResponse.json(branch, { status: 201 });
  } catch (error) {
    console.error('Error creating branch:', error);
    return NextResponse.json({ error: 'Failed to create branch' }, { status: 500 });
  }
}
