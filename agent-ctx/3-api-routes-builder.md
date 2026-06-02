---
Task ID: 3
Agent: API Routes Builder
Task: Create all API routes for branches, categories, items, variants, promotions, feedback, auth, upload, QR, settings, seed

Work Log:
- Created `/src/app/api/branches/route.ts` — GET all branches (with active filter), POST create branch (admin)
- Created `/src/app/api/branches/[id]/route.ts` — GET single branch (with promotions + counts), PUT update, PATCH toggle, DELETE (admin)
- Created `/src/app/api/categories/route.ts` — GET all categories ordered by sortOrder (with item counts), POST create (admin)
- Created `/src/app/api/categories/[id]/route.ts` — PUT update, DELETE (admin)
- Created `/src/app/api/items/route.ts` — GET all items with category + variants (filter by branchId, categoryId), POST create (admin)
- Created `/src/app/api/items/[id]/route.ts` — GET single item with variants (filter by branchId), PUT update, DELETE (admin)
- Created `/src/app/api/variants/route.ts` — GET variants by branchId+itemId, POST create, PUT update, DELETE by id (admin)
- Created `/src/app/api/promotions/route.ts` — GET active promotions (filter by branchId), POST create with branch relations (admin)
- Created `/src/app/api/promotions/[id]/route.ts` — PUT update (with branch relation sync), DELETE (admin)
- Created `/src/app/api/feedback/route.ts` — GET all feedback with branch info (admin), POST submit feedback (public)
- Created `/src/app/api/upload/route.ts` — POST file upload with sharp optimization (max 800px, quality 80 JPEG), saves to /public/uploads/ (admin)
- Created `/src/app/api/qr/route.ts` — GET QR code generation as data URL for branch slug (public)
- Created `/src/app/api/settings/route.ts` — GET all settings as key-value map, PUT upsert settings (admin)
- Created `/src/app/api/auth/route.ts` — POST admin login with password verification via iron-session (public)
- Created `/src/app/api/auth/logout/route.ts` — POST destroy admin session (public)
- Created `/src/app/api/auth/check/route.ts` — GET check admin authentication status (public)
- Created `/src/app/api/seed/route.ts` — POST seed database with demo data: 2 branches, 5 categories, 9 items, variants for both branches, 1 promotion, 9 settings, 3 feedback entries (admin, idempotent)
- Created `/public/uploads/` directory for file uploads

Stage Summary:
- 17 API route files created covering all CRUD operations for the platform
- All admin routes protected with iron-session authentication
- Public routes available for menu browsing, feedback submission, QR code generation
- Database seeded with comprehensive Arabic/English demo data (2 branches, 5 categories, 9 items, multi-size variants)
- Image upload with sharp optimization (resize + JPEG quality 80)
- Settings use key-value upsert pattern for flexible configuration
- ESLint passed with zero errors
