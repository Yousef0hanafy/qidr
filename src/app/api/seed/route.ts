import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    // Check if data already exists (skip unless force=true)
    const url = new URL(request.url, 'http://localhost');
    const force = url.searchParams.get('force') === 'true';
    
    if (!force) {
      const existingBranches = await db.branch.count();
      if (existingBranches > 0) {
        return NextResponse.json({ message: 'Database already has data. Use ?force=true to re-seed.' }, { status: 200 });
      }
    } else {
      // Clear all existing data in reverse dependency order
      await db.feedback.deleteMany();
      await db.branchItemVariant.deleteMany();
      await db.promotionBranch.deleteMany();
      await db.promotion.deleteMany();
      await db.item.deleteMany();
      await db.category.deleteMany();
      await db.branch.deleteMany();
      await db.settings.deleteMany();
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

    // Seed categories with imageUrl
    const cat1 = await db.category.create({
      data: {
        name_ar: 'المشروبات الساخنة',
        name_en: 'Hot Drinks',
        imageUrl: '/images/categories/hot-drinks.png',
        sortOrder: 1,
      },
    });
    const cat2 = await db.category.create({
      data: {
        name_ar: 'المشروبات الباردة',
        name_en: 'Cold Drinks',
        imageUrl: '/images/categories/cold-drinks.png',
        sortOrder: 2,
      },
    });
    const cat3 = await db.category.create({
      data: {
        name_ar: 'الحلويات',
        name_en: 'Desserts',
        imageUrl: '/images/categories/desserts.png',
        sortOrder: 3,
      },
    });
    const cat4 = await db.category.create({
      data: {
        name_ar: 'المقبلات',
        name_en: 'Appetizers',
        imageUrl: '/images/categories/appetizers.png',
        sortOrder: 4,
      },
    });
    const cat5 = await db.category.create({
      data: {
        name_ar: 'الأطباق الرئيسية',
        name_en: 'Main Courses',
        imageUrl: '/images/categories/main-courses.png',
        sortOrder: 5,
      },
    });

    // Seed items (existing 9 + 14 new = 23 total)
    const items = await Promise.all([
      // === HOT DRINKS (5 items) ===
      db.item.create({
        data: {
          categoryId: cat1.id,
          name_ar: 'قهوة عربية',
          name_en: 'Arabic Coffee',
          description_ar: 'قهوة عربية تقليدية بالهيل',
          description_en: 'Traditional Arabic coffee with cardamom',
          calories: 5,
          imageUrl: '/images/items/arabic-coffee.png',
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
          imageUrl: '/images/items/red-tea.png',
        },
      }),
      db.item.create({
        data: {
          categoryId: cat1.id,
          name_ar: 'لاتيه',
          name_en: 'Latte',
          description_ar: 'لاتيه كريمي بحليب طازج مع رغوة حليب',
          description_en: 'Creamy latte with fresh milk and foam',
          calories: 150,
          allergens: 'Dairy',
          imageUrl: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=400&fit=crop',
        },
      }),
      db.item.create({
        data: {
          categoryId: cat1.id,
          name_ar: 'قهوة تركية',
          name_en: 'Turkish Coffee',
          description_ar: 'قهوة تركية تقليدية غنية بالنكهة',
          description_en: 'Traditional rich-flavored Turkish coffee',
          calories: 15,
          imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefda?w=400&h=400&fit=crop',
        },
      }),
      db.item.create({
        data: {
          categoryId: cat1.id,
          name_ar: 'شوكولاتة ساخنة',
          name_en: 'Hot Chocolate',
          description_ar: 'شوكولاتة ساخنة غنية بالكريمة',
          description_en: 'Rich hot chocolate with cream',
          calories: 280,
          allergens: 'Dairy',
          imageUrl: 'https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?w=400&h=400&fit=crop',
        },
      }),

      // === COLD DRINKS (5 items) ===
      db.item.create({
        data: {
          categoryId: cat2.id,
          name_ar: 'سموذي فراولة',
          name_en: 'Strawberry Smoothie',
          description_ar: 'سموذي فراولة طازج بالحليب',
          description_en: 'Fresh strawberry smoothie with milk',
          calories: 220,
          imageUrl: '/images/items/strawberry-smoothie.png',
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
          imageUrl: '/images/items/mojito.png',
        },
      }),
      db.item.create({
        data: {
          categoryId: cat2.id,
          name_ar: 'أمريكانو مثلج',
          name_en: 'Iced Americano',
          description_ar: 'أمريكانو مثلج بنكهة قوية ومنعشة',
          description_en: 'Refreshing iced Americano with bold flavor',
          calories: 10,
          imageUrl: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=400&h=400&fit=crop',
        },
      }),
      db.item.create({
        data: {
          categoryId: cat2.id,
          name_ar: 'عصير برتقال طازج',
          name_en: 'Fresh Orange Juice',
          description_ar: 'عصير برتقال طبيعي ١٠٠٪ بدون سكر مضاف',
          description_en: '100% natural orange juice, no added sugar',
          calories: 110,
          imageUrl: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&h=400&fit=crop',
        },
      }),
      db.item.create({
        data: {
          categoryId: cat2.id,
          name_ar: 'ليمون بالنعناع',
          name_en: 'Lemon Mint',
          description_ar: 'مشروب ليمون بالنعناع الطازج والثلج',
          description_en: 'Fresh lemon and mint drink with ice',
          calories: 45,
          imageUrl: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=400&fit=crop',
        },
      }),

      // === DESSERTS (4 items) ===
      db.item.create({
        data: {
          categoryId: cat3.id,
          name_ar: 'كنافة نابلسية',
          name_en: 'Nablusi Kunafa',
          description_ar: 'كنافة بالجبن النابلسي',
          description_en: 'Kunafa with Nabulsi cheese',
          calories: 450,
          allergens: 'Gluten, Dairy',
          imageUrl: '/images/items/kunafa.png',
        },
      }),
      db.item.create({
        data: {
          categoryId: cat3.id,
          name_ar: 'بقلاوة',
          name_en: 'Baklava',
          description_ar: 'بقلاوة شرقية بالمكسرات والقطر',
          description_en: 'Oriental baklava with nuts and syrup',
          calories: 320,
          allergens: 'Gluten, Nuts',
          imageUrl: 'https://images.unsplash.com/photo-1519676867240-f03562e64571?w=400&h=400&fit=crop',
        },
      }),
      db.item.create({
        data: {
          categoryId: cat3.id,
          name_ar: 'تشيز كيك',
          name_en: 'Cheesecake',
          description_ar: 'تشيز كيك كلاسيكي بصلصة التوت',
          description_en: 'Classic cheesecake with berry sauce',
          calories: 350,
          allergens: 'Gluten, Dairy, Eggs',
          imageUrl: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=400&fit=crop',
        },
      }),
      db.item.create({
        data: {
          categoryId: cat3.id,
          name_ar: 'كيك الشوكولاتة السيّال',
          name_en: 'Chocolate Lava Cake',
          description_ar: 'كيك شوكولاتة ساخن بقلب سيّال غني',
          description_en: 'Warm chocolate cake with a rich molten center',
          calories: 400,
          allergens: 'Gluten, Dairy, Eggs',
          imageUrl: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=400&h=400&fit=crop',
        },
      }),

      // === APPETIZERS (6 items) ===
      db.item.create({
        data: {
          categoryId: cat4.id,
          name_ar: 'حمص بالطحينة',
          name_en: 'Hummus',
          description_ar: 'حمص كريمي مع طحينة وزيت زيتون',
          description_en: 'Creamy hummus with tahini and olive oil',
          calories: 180,
          allergens: 'Gluten',
          imageUrl: '/images/items/hummus.png',
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
          imageUrl: '/images/items/mtabbal.png',
        },
      }),
      db.item.create({
        data: {
          categoryId: cat4.id,
          name_ar: 'فتوش',
          name_en: 'Fattoush',
          description_ar: 'سلطة فتوش بالخضار الطازجة وخبز مقرمش',
          description_en: 'Fresh vegetable salad with crispy bread',
          calories: 120,
          allergens: 'Gluten',
          imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=400&fit=crop',
        },
      }),
      db.item.create({
        data: {
          categoryId: cat4.id,
          name_ar: 'تبولة',
          name_en: 'Tabouleh',
          description_ar: 'تبولة لبنانية بالبقدونس والبرغل',
          description_en: 'Lebanese tabouleh with parsley and bulgur',
          calories: 95,
          allergens: 'Gluten',
          imageUrl: 'https://images.unsplash.com/photo-1582169296194-e4d644c48063?w=400&h=400&fit=crop',
        },
      }),
      db.item.create({
        data: {
          categoryId: cat4.id,
          name_ar: 'فلافل',
          name_en: 'Falafel',
          description_ar: 'فلافل مقرمشة بالطحينة والخضار',
          description_en: 'Crispy falafel with tahini and vegetables',
          calories: 250,
          allergens: 'Gluten',
          imageUrl: 'https://images.unsplash.com/photo-1593001874117-c99c800e3eb6?w=400&h=400&fit=crop',
        },
      }),

      // === MAIN COURSES (6 items) ===
      db.item.create({
        data: {
          categoryId: cat5.id,
          name_ar: 'منسف أردني',
          name_en: 'Jordanian Mansaf',
          description_ar: 'منسف أردني تقليدي باللحم الجملي',
          description_en: 'Traditional Jordanian mansaf with lamb',
          calories: 800,
          allergens: 'Gluten, Dairy',
          imageUrl: '/images/items/mansaf.png',
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
          imageUrl: '/images/items/mixed-grill.png',
        },
      }),
      db.item.create({
        data: {
          categoryId: cat5.id,
          name_ar: 'دجاج مشوي',
          name_en: 'Grilled Chicken',
          description_ar: 'دجاج مشوي على الفحم مع خضار وأرز',
          description_en: 'Charcoal grilled chicken with vegetables and rice',
          calories: 450,
          imageUrl: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=400&h=400&fit=crop',
        },
      }),
      db.item.create({
        data: {
          categoryId: cat5.id,
          name_ar: 'كباب لحم',
          name_en: 'Lamb Kebab',
          description_ar: 'كباب لحم ضاني مشوي مع صلصة البندورة',
          description_en: 'Grilled lamb kebab with tomato sauce',
          calories: 520,
          imageUrl: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=400&h=400&fit=crop',
        },
      }),
      db.item.create({
        data: {
          categoryId: cat5.id,
          name_ar: 'شاورما',
          name_en: 'Shawarma',
          description_ar: 'شاورما لحم أو دجاج معطحينة ومخللات',
          description_en: 'Beef or chicken shawarma with tahini and pickles',
          calories: 380,
          allergens: 'Gluten',
          imageUrl: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=400&h=400&fit=crop',
        },
      }),
      db.item.create({
        data: {
          categoryId: cat5.id,
          name_ar: 'صيادية سمك',
          name_en: 'Fish Sayadieh',
          description_ar: 'صيادية سمك بالأرز والبهارات العربية',
          description_en: 'Fish sayadieh with rice and Arabic spices',
          calories: 420,
          allergens: 'Fish',
          imageUrl: 'https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?w=400&h=400&fit=crop',
        },
      }),
    ]);

    // Seed variants for both branches (all 23 items)
    const variantData = [
      // Hot Drinks - Arabic Coffee (items[0])
      { item: items[0], variants: [
        { name_ar: 'صغير', name_en: 'Small', price: 8 },
        { name_ar: 'وسيط', name_en: 'Medium', price: 12 },
        { name_ar: 'كبير', name_en: 'Large', price: 15 },
      ]},
      // Hot Drinks - Red Tea (items[1])
      { item: items[1], variants: [
        { name_ar: 'سادة', name_en: 'Plain', price: 5 },
        { name_ar: 'بالحليب', name_en: 'With Milk', price: 8 },
      ]},
      // Hot Drinks - Latte (items[2])
      { item: items[2], variants: [
        { name_ar: 'صغير', name_en: 'Small', price: 15 },
        { name_ar: 'وسيط', name_en: 'Medium', price: 20 },
        { name_ar: 'كبير', name_en: 'Large', price: 25 },
      ]},
      // Hot Drinks - Turkish Coffee (items[3])
      { item: items[3], variants: [
        { name_ar: 'فنجان', name_en: 'Cup', price: 10 },
      ]},
      // Hot Drinks - Hot Chocolate (items[4])
      { item: items[4], variants: [
        { name_ar: 'صغير', name_en: 'Small', price: 18 },
        { name_ar: 'كبير', name_en: 'Large', price: 24 },
      ]},

      // Cold Drinks - Strawberry Smoothie (items[5])
      { item: items[5], variants: [
        { name_ar: 'صغير', name_en: 'Small', price: 15 },
        { name_ar: 'كبير', name_en: 'Large', price: 20 },
      ]},
      // Cold Drinks - Mojito (items[6])
      { item: items[6], variants: [
        { name_ar: 'كلاسيك', name_en: 'Classic', price: 18 },
        { name_ar: 'بالفريز', name_en: 'With Strawberry', price: 22 },
      ]},
      // Cold Drinks - Iced Americano (items[7])
      { item: items[7], variants: [
        { name_ar: 'صغير', name_en: 'Small', price: 12 },
        { name_ar: 'كبير', name_en: 'Large', price: 16 },
      ]},
      // Cold Drinks - Fresh Orange Juice (items[8])
      { item: items[8], variants: [
        { name_ar: 'كوب', name_en: 'Cup', price: 14 },
        { name_ar: 'كاراتيه', name_en: 'Carafe', price: 28 },
      ]},
      // Cold Drinks - Lemon Mint (items[9])
      { item: items[9], variants: [
        { name_ar: 'بدون سكر', name_en: 'No Sugar', price: 12 },
        { name_ar: 'بسكر عادي', name_en: 'Regular Sugar', price: 12 },
      ]},

      // Desserts - Kunafa (items[10])
      { item: items[10], variants: [
        { name_ar: 'قطعة', name_en: 'Single Slice', price: 20 },
        { name_ar: 'حجم عائلي', name_en: 'Family Size', price: 50 },
      ]},
      // Desserts - Baklava (items[11])
      { item: items[11], variants: [
        { name_ar: 'قطعتان', name_en: 'Two Pieces', price: 15 },
        { name_ar: 'ربع كيلو', name_en: 'Quarter Kilo', price: 45 },
        { name_ar: 'نصف كيلو', name_en: 'Half Kilo', price: 80 },
      ]},
      // Desserts - Cheesecake (items[12])
      { item: items[12], variants: [
        { name_ar: 'قطعة', name_en: 'Slice', price: 22 },
      ]},
      // Desserts - Chocolate Lava Cake (items[13])
      { item: items[13], variants: [
        { name_ar: 'قطعة', name_en: 'Slice', price: 28 },
      ]},

      // Appetizers - Hummus (items[14])
      { item: items[14], variants: [
        { name_ar: 'صغير', name_en: 'Small', price: 10 },
        { name_ar: 'كبير', name_en: 'Large', price: 18 },
      ]},
      // Appetizers - Mtabbal (items[15])
      { item: items[15], variants: [
        { name_ar: 'حجم واحد', name_en: 'Regular', price: 12 },
      ]},
      // Appetizers - Fattoush (items[16])
      { item: items[16], variants: [
        { name_ar: 'حجم واحد', name_en: 'Regular', price: 16 },
        { name_ar: 'حجم كبير', name_en: 'Large', price: 24 },
      ]},
      // Appetizers - Tabouleh (items[17])
      { item: items[17], variants: [
        { name_ar: 'حجم واحد', name_en: 'Regular', price: 14 },
        { name_ar: 'حجم كبير', name_en: 'Large', price: 22 },
      ]},
      // Appetizers - Falafel (items[18])
      { item: items[18], variants: [
        { name_ar: '٤ قطع', name_en: '4 Pieces', price: 12 },
        { name_ar: '٨ قطع', name_en: '8 Pieces', price: 20 },
        { name_ar: '١٢ قطعة', name_en: '12 Pieces', price: 28 },
      ]},

      // Main Courses - Mansaf (items[19])
      { item: items[19], variants: [
        { name_ar: 'شخص واحد', name_en: 'Single Person', price: 55 },
        { name_ar: 'لشخصين', name_en: 'For Two', price: 95 },
        { name_ar: 'عائلي', name_en: 'Family', price: 160 },
      ]},
      // Main Courses - Mixed Grill (items[20])
      { item: items[20], variants: [
        { name_ar: 'شخص واحد', name_en: 'Single Person', price: 45 },
        { name_ar: 'لشخصين', name_en: 'For Two', price: 80 },
        { name_ar: 'عائلي', name_en: 'Family', price: 140 },
      ]},
      // Main Courses - Grilled Chicken (items[21])
      { item: items[21], variants: [
        { name_ar: 'نصف دجاجة', name_en: 'Half Chicken', price: 35 },
        { name_ar: 'دجاجة كاملة', name_en: 'Whole Chicken', price: 58 },
      ]},
      // Main Courses - Lamb Kebab (items[22])
      { item: items[22], variants: [
        { name_ar: '٥ أسياخ', name_en: '5 Skewers', price: 48 },
        { name_ar: '١٠ أسياخ', name_en: '10 Skewers', price: 85 },
      ]},
      // Main Courses - Shawarma (items[23])
      { item: items[23], variants: [
        { name_ar: 'ساندويتش لحم', name_en: 'Beef Sandwich', price: 18 },
        { name_ar: 'ساندويتش دجاج', name_en: 'Chicken Sandwich', price: 15 },
        { name_ar: 'صحن لحم', name_en: 'Beef Plate', price: 32 },
        { name_ar: 'صحن دجاج', name_en: 'Chicken Plate', price: 28 },
      ]},
      // Main Courses - Fish Sayadieh (items[24])
      { item: items[24], variants: [
        { name_ar: 'شخص واحد', name_en: 'Single Person', price: 52 },
        { name_ar: 'لشخصين', name_en: 'For Two', price: 90 },
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
        endDate: new Date('2027-12-31'),
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
        items: 25,
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
