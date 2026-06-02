import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const [
      totalBranches,
      totalCategories,
      totalItems,
      feedbackData,
    ] = await Promise.all([
      db.branch.count(),
      db.category.count(),
      db.item.count(),
      db.feedback.findMany({ select: { rating: true } }),
    ]);

    const totalFeedback = feedbackData.length;
    const averageRating =
      totalFeedback > 0
        ? (
            feedbackData.reduce((acc, f) => acc + f.rating, 0) / totalFeedback
          ).toFixed(1)
        : '0.0';

    return NextResponse.json({
      totalBranches,
      totalCategories,
      totalItems,
      totalFeedback,
      averageRating,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
