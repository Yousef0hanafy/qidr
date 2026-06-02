export type Language = 'ar' | 'en'

const translations: Record<Language, Record<string, string>> = {
  ar: {
    // General UI
    menu: 'القائمة',
    search: 'البحث',
    all: 'الكل',
    categories: 'الفئات',
    from: 'من',
    price: 'السعر',
    SAR: 'ر.س',
    calories: 'السعرات الحرارية',
    nutritional_info: 'المعلومات الغذائية',
    allergens: 'المواد المسببة للحساسية',
    variants: 'الخيارات',
    available: 'متوفر',
    out_of_stock: 'غير متوفر',
    hidden: 'مخفي',
    no_results: 'لا توجد نتائج',
    rate_experience: 'قيّم تجربتك',
    submit_feedback: 'إرسال الملاحظات',
    name_optional: 'الاسم (اختياري)',
    your_feedback: 'ملاحظاتك',
    feedback_sent: 'تم إرسال ملاحظاتك بنجاح!',
    close: 'إغلاق',
    select_branch: 'اختر الفرع',
    promotions: 'العروض',
    view_menu: 'عرض القائمة',
    social_media: 'وسائل التواصل الاجتماعي',
    contact_us: 'تواصل معنا',
    location: 'الموقع',
    navigate: 'التنقل',
    copyright: '© جميع الحقوق محفوظة ',
    powered_by: 'بدعم من',
    welcome_message: 'أهلاً وسهلاً بكم في قدر',

    // Auth & Admin
    admin: 'الإدارة',
    login: 'تسجيل الدخول',
    password: 'كلمة المرور',
    sign_in: 'دخول',
    invalid_password: 'كلمة المرور غير صحيحة',
    dashboard: 'لوحة التحكم',

    // CRUD
    branches: 'الفروع',
    categories: 'الفئات',
    items: 'العناصر',
    add: 'إضافة',
    edit: 'تعديل',
    delete: 'حذف',
    save: 'حفظ',
    cancel: 'إلغاء',
    actions: 'الإجراءات',
    status: 'الحالة',
    active: 'نشط',
    inactive: 'غير نشط',
    manage_variants: 'إدارة الخيارات',
    variant_name: 'اسم الخيار',
    price: 'السعر',
    availability: 'التوفر',

    // Promotion Management
    promotion_management: 'إدارة العروض',
    feedback_management: 'إدارة الملاحظات',
    date: 'التاريخ',
    all_branches: 'جميع الفروع',
    assign_branches: 'تعيين الفروع',
    schedule: 'الجدولة',
    start_date: 'تاريخ البدء',
    end_date: 'تاريخ الانتهاء',

    // Forms
    upload_image: 'رفع صورة',
    enter_name_ar: 'أدخل الاسم بالعربية',
    enter_name_en: 'أدخل الاسم بالإنجليزية',
    enter_description_ar: 'أدخل الوصف بالعربية',
    enter_description_en: 'أدخل الوصف بالإنجليزية',
    enter_address: 'أدخل العنوان',
    enter_price: 'أدخل السعر',
    enter_variant: 'أدخل الخيار',
    select_status: 'اختر الحالة',

    // QR Code
    qr_code: 'رمز QR',
    download_qr: 'تحميل رمز QR',
    regenerate_qr: 'إعادة إنشاء رمز QR',

    // Product Details
    calories_info: 'معلومات السعرات الحرارية',
    allergen_info: 'معلومات الحساسية',
    nutrition_info: 'المعلومات الغذائية',
    product_details: 'تفاصيل المنتج',

    // Language
    change_language: 'تغيير اللغة',
    search_placeholder: 'ابحث في القائمة...',

    // Empty States
    no_items: 'لا توجد عناصر',
    no_categories: 'لا توجد فئات',
    no_branches: 'لا توجد فروع',
    choose_branch_to_browse: 'اختر فرعًا لتصفح القائمة',

    // Promotions
    promotions_offers: 'العروض والتخفيضات',
    our_menu: 'قائمتنا',
    todays_offers: 'عروض اليوم',
    scroll_to_menu: 'انتقل إلى القائمة',

    // Review
    rate_your_experience: 'قيّم تجربتك',
    how_was_your_experience: 'كيف كانت تجربتك؟',
    leave_feedback: 'اترك ملاحظاتك',
    redirect_google: 'انتقل إلى تقييم Google',
    back_to_menu: 'العودة إلى القائمة',
    no_promotions: 'لا توجد عروض حاليًا',

    // CRUD Labels
    add_branch: 'إضافة فرع',
    add_category: 'إضافة فئة',
    add_item: 'إضافة عنصر',
    add_promotion: 'إضافة عرض',
    edit_branch: 'تعديل الفرع',
    edit_category: 'تعديل الفئة',
    edit_item: 'تعديل العنصر',
    edit_promotion: 'تعديل العرض',

    // Confirmations
    delete_confirm: 'هل أنت متأكد من الحذف؟',
    confirm: 'تأكيد',

    // Details
    branch_details: 'تفاصيل الفرع',
    category_details: 'تفاصيل الفئة',
    item_details: 'تفاصيل العنصر',
    promotion_details: 'تفاصيل العرض',

    // Feedback
    no_feedback_yet: 'لا توجد ملاحظات بعد',

    // Stats
    total_items: 'إجمالي العناصر',
    total_branches: 'إجمالي الفروع',
    total_feedback: 'إجمالي الملاحظات',
    avg_rating: 'متوسط التقييم',
  },
  en: {
    // General UI
    menu: 'Menu',
    search: 'Search',
    all: 'All',
    categories: 'Categories',
    from: 'From',
    price: 'Price',
    SAR: 'SAR',
    calories: 'Calories',
    nutritional_info: 'Nutritional Information',
    allergens: 'Allergens',
    variants: 'Variants',
    available: 'Available',
    out_of_stock: 'Out of Stock',
    hidden: 'Hidden',
    no_results: 'No results found',
    rate_experience: 'Rate Your Experience',
    submit_feedback: 'Submit Feedback',
    name_optional: 'Name (Optional)',
    your_feedback: 'Your Feedback',
    feedback_sent: 'Your feedback has been sent successfully!',
    close: 'Close',
    select_branch: 'Select Branch',
    promotions: 'Promotions',
    view_menu: 'View Menu',
    social_media: 'Social Media',
    contact_us: 'Contact Us',
    location: 'Location',
    navigate: 'Navigate',
    copyright: '© All Rights Reserved ',
    powered_by: 'Powered by',
    welcome_message: 'Welcome to Qidr',

    // Auth & Admin
    admin: 'Admin',
    login: 'Login',
    password: 'Password',
    sign_in: 'Sign In',
    invalid_password: 'Invalid password',
    dashboard: 'Dashboard',

    // CRUD
    branches: 'Branches',
    categories: 'Categories',
    items: 'Items',
    add: 'Add',
    edit: 'Edit',
    delete: 'Delete',
    save: 'Save',
    cancel: 'Cancel',
    actions: 'Actions',
    status: 'Status',
    active: 'Active',
    inactive: 'Inactive',
    manage_variants: 'Manage Variants',
    variant_name: 'Variant Name',
    price: 'Price',
    availability: 'Availability',

    // Promotion Management
    promotion_management: 'Promotion Management',
    feedback_management: 'Feedback Management',
    date: 'Date',
    all_branches: 'All Branches',
    assign_branches: 'Assign Branches',
    schedule: 'Schedule',
    start_date: 'Start Date',
    end_date: 'End Date',

    // Forms
    upload_image: 'Upload Image',
    enter_name_ar: 'Enter name in Arabic',
    enter_name_en: 'Enter name in English',
    enter_description_ar: 'Enter description in Arabic',
    enter_description_en: 'Enter description in English',
    enter_address: 'Enter address',
    enter_price: 'Enter price',
    enter_variant: 'Enter variant',
    select_status: 'Select status',

    // QR Code
    qr_code: 'QR Code',
    download_qr: 'Download QR',
    regenerate_qr: 'Regenerate QR',

    // Product Details
    calories_info: 'Calories Info',
    allergen_info: 'Allergen Info',
    nutrition_info: 'Nutrition Info',
    product_details: 'Product Details',

    // Language
    change_language: 'Change Language',
    search_placeholder: 'Search the menu...',

    // Empty States
    no_items: 'No items yet',
    no_categories: 'No categories yet',
    no_branches: 'No branches yet',
    choose_branch_to_browse: 'Choose a branch to browse the menu',

    // Promotions
    promotions_offers: 'Promotions & Offers',
    our_menu: 'Our Menu',
    todays_offers: "Today's Offers",
    scroll_to_menu: 'Scroll to Menu',

    // Review
    rate_your_experience: 'Rate Your Experience',
    how_was_your_experience: 'How was your experience?',
    leave_feedback: 'Leave your feedback',
    redirect_google: 'Redirect to Google Review',
    back_to_menu: 'Back to Menu',
    no_promotions: 'No promotions available',

    // CRUD Labels
    add_branch: 'Add Branch',
    add_category: 'Add Category',
    add_item: 'Add Item',
    add_promotion: 'Add Promotion',
    edit_branch: 'Edit Branch',
    edit_category: 'Edit Category',
    edit_item: 'Edit Item',
    edit_promotion: 'Edit Promotion',

    // Confirmations
    delete_confirm: 'Are you sure you want to delete?',
    confirm: 'Confirm',

    // Details
    branch_details: 'Branch Details',
    category_details: 'Category Details',
    item_details: 'Item Details',
    promotion_details: 'Promotion Details',

    // Feedback
    no_feedback_yet: 'No feedback yet',

    // Stats
    total_items: 'Total Items',
    total_branches: 'Total Branches',
    total_feedback: 'Total Feedback',
    avg_rating: 'Average Rating',
  },
}

/**
 * Get a translation by language and key.
 * Falls back to the English translation if the key is missing in the target language,
 * and returns the key itself if no translation is found at all.
 */
export function getTranslation(lang: Language, key: string): string {
  return translations[lang]?.[key] ?? translations.en[key] ?? key
}

/**
 * Helper hook-friendly function to get all translations for a given language.
 */
export function getTranslations(lang: Language): Record<string, string> {
  return translations[lang] ?? translations.en
}
