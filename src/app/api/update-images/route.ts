import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST() {
  try {
    // Update category images
    const categoryImages: Record<string, string> = {
      'Hot Drinks': '/images/categories/hot-drinks.png',
      'Cold Drinks': '/images/categories/cold-drinks.png',
      'Desserts': '/images/categories/desserts.png',
      'Appetizers': '/images/categories/appetizers.png',
      'Main Courses': '/images/categories/main-courses.png',
    };

    // Update item images
    const itemImages: Record<string, string> = {
      'Arabic Coffee': '/images/items/arabic-coffee.png',
      'Red Tea': '/images/items/red-tea.png',
      'Strawberry Smoothie': '/images/items/strawberry-smoothie.png',
      'Mojito': '/images/items/mojito.png',
      'Nablusi Kunafa': '/images/items/kunafa.png',
      'Hummus': '/images/items/hummus.png',
      'Mtabbal': '/images/items/mtabbal.png',
      'Jordanian Mansaf': '/images/items/mansaf.png',
      'Mixed Grill': '/images/items/mixed-grill.png',
    };

    let categoryCount = 0;
    let itemCount = 0;

    // Update categories
    for (const [name_en, imageUrl] of Object.entries(categoryImages)) {
      const result = await db.category.updateMany({
        where: { name_en },
        data: { imageUrl },
      });
      categoryCount += result.count;
    }

    // Update items
    for (const [name_en, imageUrl] of Object.entries(itemImages)) {
      const result = await db.item.updateMany({
        where: { name_en },
        data: { imageUrl },
      });
      itemCount += result.count;
    }

    return NextResponse.json({
      message: 'Images updated successfully',
      data: {
        categoriesUpdated: categoryCount,
        itemsUpdated: itemCount,
      },
    });
  } catch (error) {
    console.error('Error updating images:', error);
    return NextResponse.json({ error: 'Failed to update images' }, { status: 500 });
  }
}
