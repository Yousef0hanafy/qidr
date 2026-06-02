import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST() {
  try {
    // Check if data already exists
    const existingBranches = await db.branch.count();
    if (existingBranches > 0) {
      return NextResponse.json({ message: 'Database already has data. Skipping seed.' }, { status: 200 });
    }

    // Seed branches
    const branch1 = await db.branch.create({
      data: {
        name_ar: 'الفرع الرئيسي',
        name_en: 'Main Branch',
        slug: 'main',
        address: 'شارع الملك فهد، الرياض',
        phone: '+966 11 234 5678',
        whatsapp: '+966 55 123 4567',
        instagram: '@qidr_main',
        isActive: true,
      },
    });

    const branch2 = await db.branch.create({
      data: {
        name_ar: 'فرع جدة',
        name_en: 'Jeddah Branch',
        slug: 'jeddah',
        address: 'شارع التحلية، جدة',
        phone: '+966 12 345 6789',
        whatsapp: '+966 55 987 6543',
        instagram: '@qidr_jeddah',
        isActive: true,
      },
    });

    // Seed categories
    const cat1 = await db.category.create({
      data: { name_ar: 'المشروبات الساخنة', name_en: 'Hot Drinks', sortOrder: 1 },
    });
    const cat2 = await db.category.create({
      data: { name_ar: 'المشروبات الباردة', name_en: 'Cold Drinks', sortOrder: 2 },
    });
    const cat3 = await db.category.create({
      data: { name_ar: 'الحلويات', name_en: 'Desserts', sortOrder: 3 },
    });
    const cat4 = await db.category.create({
      data: { name_ar: 'المقبلات', name_en: 'Appetizers', sortOrder: 4 },
    });
    const cat5 = await db.category.create({
      data: { name_ar: 'الأطباق الرئيسية', name_en: 'Main Courses', sortOrder: 5 },
    });

    // Seed items
    const items = await Promise.all([
      db.item.create({
        data: {
          categoryId: cat1.id,
          name_ar: 'قهوة عربية',
          name_en: 'Arabic Coffee',
          description_ar: 'قهوة عربية تقليدية بالهيل',
          description_en: 'Traditional Arabic coffee with cardamom',
          calories: 5,
        },
      }),
      db.item.create({
        data: {
          categoryId: cat1.id,
          name_ar: 'شاي أحمر',
          name_en: 'Red Tea',
          description_ar: 'شاي أحمر سادة أو بالحليب',
          description_en: 'Plain red tea or with milk',
          calories: 30,
        },
      }),
      db.item.create({
        data: {
          categoryId: cat2.id,
          name_ar: 'سموذي فراولة',
          name_en: 'Strawberry Smoothie',
          description_ar: 'سموذي فراولة طازج بالحليب',
          description_en: 'Fresh strawberry smoothie with milk',
          calories: 220,
        },
      }),
      db.item.create({
        data: {
          categoryId: cat2.id,
          name_ar: 'موهيتو',
          name_en: 'Mojito',
          description_ar: 'موهيتو بالنعناع والليمون',
          description_en: 'Mint and lime mojito',
          calories: 80,
        },
      }),
      db.item.create({
        data: {
          categoryId: cat3.id,
          name_ar: 'كنافة نابلسية',
          name_en: 'Nablusi Kunafa',
          description_ar: 'كنافة بالجبن النابلسي',
          description_en: 'Kunafa with Nabulsi cheese',
          calories: 450,
          allergens: 'Gluten, Dairy',
        },
      }),
      db.item.create({
        data: {
          categoryId: cat4.id,
          name_ar: 'حمص بالطحينة',
          name_en: 'Hummus',
          description_ar: 'حمص كريمي مع طحينة وزيت زيتون',
          description_en: 'Creamy hummus with tahini and olive oil',
          calories: 180,
          allergens: 'Gluten',
        },
      }),
      db.item.create({
        data: {
          categoryId: cat4.id,
          name_ar: 'متبل',
          name_en: 'Mtabbal',
          description_ar: 'متبل باذنجان بالطحينة',
          description_en: 'Smoky eggplant dip with tahini',
          calories: 150,
        },
      }),
      db.item.create({
        data: {
          categoryId: cat5.id,
          name_ar: 'منسف أردني',
          name_en: 'Jordanian Mansaf',
          description_ar: 'منسف أردني تقليدي باللحم الجملي',
          description_en: 'Traditional Jordanian mansaf with lamb',
          calories: 800,
          allergens: 'Gluten, Dairy',
        },
      }),
      db.item.create({
        data: {
          categoryId: cat5.id,
          name_ar: 'مشاوي مشكلة',
          name_en: 'Mixed Grill',
          description_ar: 'طبق مشاوي مشكلة مع أرز بسمتي',
          description_en: 'Mixed grill platter with basmati rice',
          calories: 650,
          allergens: 'Gluten',
        },
      }),
    ]);

    // Seed variants for both branches
    const variantData = [
      // Hot Drinks - Arabic Coffee
      { item: items[0], variants: [
        { name_ar: 'صغير', name_en: 'Small', price: 8 },
        { name_ar: 'وسيط', name_en: 'Medium', price: 12 },
        { name_ar: 'كبير', name_en: 'Large', price: 15 },
      ]},
      // Hot Drinks - Red Tea
      { item: items[1], variants: [
        { name_ar: 'سادة', name_en: 'Plain', price: 5 },
        { name_ar: 'بالحليب', name_en: 'With Milk', price: 8 },
      ]},
      // Cold Drinks - Strawberry Smoothie
      { item: items[2], variants: [
        { name_ar: 'صغير', name_en: 'Small', price: 15 },
        { name_ar: 'كبير', name_en: 'Large', price: 20 },
      ]},
      // Cold Drinks - Mojito
      { item: items[3], variants: [
        { name_ar: 'كلاسيك', name_en: 'Classic', price: 18 },
        { name_ar: 'بالفريز', name_en: 'With Strawberry', price: 22 },
      ]},
      // Desserts - Kunafa
      { item: items[4], variants: [
        { name_ar: 'قطعة', name_en: 'Single Slice', price: 20 },
        { name_ar: 'حجم عائلي', name_en: 'Family Size', price: 50 },
      ]},
      // Appetizers - Hummus
      { item: items[5], variants: [
        { name_ar: 'صغير', name_en: 'Small', price: 10 },
        { name_ar: 'كبير', name_en: 'Large', price: 18 },
      ]},
      // Appetizers - Mtabbal
      { item: items[6], variants: [
        { name_ar: 'حجم واحد', name_en: 'Regular', price: 12 },
      ]},
      // Main Courses - Mansaf
      { item: items[7], variants: [
        { name_ar: 'شخص واحد', name_en: 'Single Person', price: 55 },
        { name_ar: 'لشخصين', name_en: 'For Two', price: 95 },
        { name_ar: 'عائلي', name_en: 'Family', price: 160 },
      ]},
      // Main Courses - Mixed Grill
      { item: items[8], variants: [
        { name_ar: 'شخص واحد', name_en: 'Single Person', price: 45 },
        { name_ar: 'لشخصين', name_en: 'For Two', price: 80 },
        { name_ar: 'عائلي', name_en: 'Family', price: 140 },
      ]},
    ];

    for (const { item, variants } of variantData) {
      for (const branch of [branch1, branch2]) {
        for (const v of variants) {
          await db.branchItemVariant.create({
            data: {
              branchId: branch.id,
              itemId: item.id,
              variantName_ar: v.name_ar,
              variantName_en: v.name_en,
              price: v.price,
              available: true,
              status: 'available',
            },
          });
        }
      }
    }

    // Seed promotions
    await db.promotion.create({
      data: {
        title_ar: 'عرض الافتتاح',
        title_en: 'Grand Opening Offer',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2025-12-31'),
        active: true,
        branches: {
          create: [
            { branchId: branch1.id },
            { branchId: branch2.id },
          ],
        },
      },
    });

    // Seed settings
    const defaultSettings = [
      { key: 'site_name_ar', value: 'قدر' },
      { key: 'site_name_en', value: 'Qidr' },
      { key: 'primary_color', value: '#D4A843' },
      { key: 'secondary_color', value: '#1A1A2E' },
      { key: 'accent_color', value: '#E94560' },
      { key: 'welcome_message_ar', value: 'أهلاً وسهلاً بكم في قدر' },
      { key: 'welcome_message_en', value: 'Welcome to Qidr' },
      { key: 'currency', value: 'SAR' },
      { key: 'currency_symbol', value: 'ر.س' },
    ];

    await db.settings.createMany({ data: defaultSettings });

    // Seed some sample feedback
    await db.feedback.createMany({
      data: [
        {
          branchId: branch1.id,
          rating: 5,
          customerName: 'أحمد',
          feedbackMessage: 'مكان رائع وأكل لذيذ!',
        },
        {
          branchId: branch1.id,
          rating: 4,
          customerName: 'Sarah',
          feedbackMessage: 'Great food and friendly staff',
        },
        {
          branchId: branch2.id,
          rating: 5,
          customerName: 'محمد',
          feedbackMessage: 'أفضل منسف بالرياض',
        },
      ],
    });

    return NextResponse.json({
      message: 'Database seeded successfully',
      data: {
        branches: 2,
        categories: 5,
        items: 9,
        promotions: 1,
        settings: defaultSettings.length,
        feedbacks: 3,
      },
    });
  } catch (error) {
    console.error('Error seeding database:', error);
    return NextResponse.json({ error: 'Failed to seed database' }, { status: 500 });
  }
}
