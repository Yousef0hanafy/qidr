import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';

export async function GET() {
  try {
    const session = await getSession();
    return NextResponse.json({ isLoggedIn: session?.isLoggedIn === true });
  } catch (error) {
    console.error('Error checking auth:', error);
    return NextResponse.json({ isLoggedIn: false });
  }
}
