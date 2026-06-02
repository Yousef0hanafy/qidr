'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { useMenuStore } from '@/store/menu-store'
import { HeroSection } from '@/components/menu/hero-section'
import { PromotionBanner } from '@/components/menu/promotion-banner'
import { CategoryNav } from '@/components/menu/category-nav'
import { ProductGrid } from '@/components/menu/product-grid'
import { ProductModal } from '@/components/menu/product-modal'
import { ReviewModal } from '@/components/menu/review-modal'
import { MenuFooter } from '@/components/menu/menu-footer'
import { LanguageSwitcher } from '@/components/menu/language-switcher'

interface Branch {
  id: string
  name_ar: string
  name_en: string
  slug: string
  address?: string
  googleMapLink?: string
  phone?: string
  whatsapp?: string
  instagram?: string
  tiktok?: string
  snapchat?: string
  facebook?: string
  isActive: boolean
}

interface Category {
  id: string
  name_ar: string
  name_en: string
  imageUrl?: string
  sortOrder: number
}

interface Variant {
  id: string
  branchId: string
  itemId: string
  variantName_ar: string
  variantName_en: string
  price: number
  available: boolean
  status: string
}

interface Item {
  id: string
  categoryId: string
  name_ar: string
  name_en: string
  description_ar?: string
  description_en?: string
  imageUrl?: string
  calories?: number
  allergens?: string
  nutritionalFacts?: string
  isActive: boolean
  category?: Category
  variants?: Variant[]
}

interface Promotion {
  id: string
  title_ar: string
  title_en: string
  imageUrl?: string
  startDate: string
  endDate: string
  active: boolean
}

export default function MenuPage() {
  const {
    language,
    selectedBranch,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    isProductModalOpen,
    selectedProduct,
    closeProductModal,
    isReviewModalOpen,
    setIsReviewModalOpen,
  } = useMenuStore()

  const isRTL = language === 'ar'

  const [branches, setBranches] = useState<Branch[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [items, setItems] = useState<Item[]>([])
  const [promotions, setPromotions] = useState<Promotion[]>([])
  const [loading, setLoading] = useState(true)

  const isScrollingRef = useRef(false)

  // ── Fetch branches ───────────────────────────────────────────────
  useEffect(() => {
    async function fetchBranches() {
      try {
        const res = await fetch('/api/branches')
        if (res.ok) {
          const data = await res.json()
          setBranches(data)
          if (!selectedBranch && data.length > 0) {
            const firstActive = data.find((b: Branch) => b.isActive)
            if (firstActive) {
              useMenuStore.getState().setSelectedBranch(firstActive.id)
            }
          }
        }
      } catch (err) {
        console.error('Failed to fetch branches:', err)
      }
    }
    fetchBranches()
  }, [])

  // ── Fetch categories ────────────────────────────────────────────
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch('/api/categories')
        if (res.ok) {
          setCategories(await res.json())
        }
      } catch (err) {
        console.error('Failed to fetch categories:', err)
      }
    }
    fetchCategories()
  }, [])

  // ── Fetch items ─────────────────────────────────────────────────
  useEffect(() => {
    async function fetchItems() {
      if (!selectedBranch) return
      setLoading(true)
      try {
        const res = await fetch(`/api/items?branchId=${selectedBranch}`)
        if (res.ok) {
          setItems(await res.json())
        }
      } catch (err) {
        console.error('Failed to fetch items:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchItems()
  }, [selectedBranch])

  // ── Fetch promotions ────────────────────────────────────────────
  useEffect(() => {
    async function fetchPromotions() {
      try {
        const url = selectedBranch
          ? `/api/promotions?branchId=${selectedBranch}`
          : '/api/promotions'
        const res = await fetch(url)
        if (res.ok) {
          setPromotions(await res.json())
        }
      } catch (err) {
        console.error('Failed to fetch promotions:', err)
      }
    }
    fetchPromotions()
  }, [selectedBranch])

  // ── URL hash for branch slug ───────────────────────────────────
  useEffect(() => {
    const hash = window.location.hash
    if (hash.startsWith('#branch=')) {
      const slug = hash.replace('#branch=', '')
      const branch = branches.find((b) => b.slug === slug)
      if (branch) {
        useMenuStore.getState().setSelectedBranch(branch.id)
      }
    }
  }, [branches])

  const currentBranch = branches.find((b) => b.id === selectedBranch)

  // ── Category nav click → scroll to section ──────────────────────
  const handleCategorySelect = useCallback(
    (categoryId: string) => {
      isScrollingRef.current = true
      setSelectedCategory(categoryId)

      const section = document.getElementById(`category-${categoryId}`)
      if (section) {
        const navHeight =
          document.querySelector('nav.sticky')?.getBoundingClientRect()
            .height ?? 110
        const top =
          section.getBoundingClientRect().top + window.scrollY - navHeight - 8
        window.scrollTo({ top, behavior: 'smooth' })
      }

      setTimeout(() => {
        isScrollingRef.current = false
      }, 600)
    },
    [setSelectedCategory]
  )

  // ── IntersectionObserver callback from ProductGrid ──────────────
  const handleCategoryInView = useCallback(
    (categoryId: string) => {
      if (!isScrollingRef.current && !searchQuery.trim()) {
        setSelectedCategory(categoryId)
      }
    },
    [setSelectedCategory, searchQuery]
  )

  const handleProductClick = useCallback(
    (item: Item) => {
      useMenuStore.getState().openProductModal(item)
    },
    []
  )

  return (
    <div
      dir={isRTL ? 'rtl' : 'ltr'}
      lang={language}
      className="min-h-screen flex flex-col bg-[#003327]"
    >
      {/* Language Switcher — fixed */}
      <LanguageSwitcher />

      {/* Compact Hero Header */}
      <HeroSection
        branches={branches}
        selectedBranch={selectedBranch}
        onSelectBranch={(branchId: string) => {
          useMenuStore.getState().setSelectedBranch(branchId)
        }}
      />

      {/* Promotions Banner */}
      {promotions.length > 0 && (
        <div className="py-3">
          <PromotionBanner promotions={promotions} />
        </div>
      )}

      {/* Category Navigation — sticky with circular thumbnails */}
      {categories.length > 0 && selectedBranch && (
        <CategoryNav
          categories={categories}
          selectedCategory={selectedCategory}
          onSelect={handleCategorySelect}
        />
      )}

      {/* Menu Content — centered, max-w like reference */}
      <main className="flex-1 pb-8">
        <div className="max-w-[552px] mx-auto">
          {!selectedBranch ? (
            <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
              <div className="w-14 h-14 rounded-full bg-[#F1CDAB]/10 flex items-center justify-center mb-5">
                <svg
                  className="w-7 h-7 text-[#F1CDAB]/60"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <h2 className="text-lg font-bold text-[#F1CDAB] mb-2">
                {language === 'ar'
                  ? 'اختر فرعًا لتصفح القائمة'
                  : 'Choose a branch to browse the menu'}
              </h2>
              <p className="text-[#F3E5D8]/40 text-sm">
                {language === 'ar'
                  ? 'يرجى اختيار الفرع من القائمة أعلاه'
                  : 'Please select a branch from the selector above'}
              </p>
            </div>
          ) : loading ? (
            <div className="px-2 py-6">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 py-3 animate-pulse"
                >
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-white/8 rounded w-3/4" />
                    <div className="h-2 bg-white/5 rounded w-1/2" />
                    <div className="h-3 bg-white/8 rounded w-1/4" />
                  </div>
                  <div className="w-[100px] h-[100px] bg-white/8 rounded-lg shrink-0" />
                </div>
              ))}
            </div>
          ) : (
            <ProductGrid
              items={items}
              categories={categories}
              language={language}
              searchQuery={searchQuery}
              onProductClick={handleProductClick}
              onCategoryInView={handleCategoryInView}
            />
          )}
        </div>
      </main>

      {/* Product Detail Modal */}
      {isProductModalOpen && selectedProduct && (
        <ProductModal
          item={selectedProduct}
          language={language}
          isOpen={isProductModalOpen}
          onClose={closeProductModal}
        />
      )}

      {/* Review Modal */}
      {isReviewModalOpen && (
        <ReviewModal
          isOpen={isReviewModalOpen}
          onClose={() => setIsReviewModalOpen(false)}
          branchId={selectedBranch || ''}
        />
      )}

      {/* Footer */}
      <MenuFooter
        branch={currentBranch || null}
        language={language}
        onRateClick={() => setIsReviewModalOpen(true)}
      />
    </div>
  )
}
