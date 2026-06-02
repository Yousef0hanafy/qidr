'use client'

import { useMemo, useEffect, useRef, useCallback } from 'react'
import { SearchX } from 'lucide-react'
import { getTranslation } from '@/lib/i18n'
import { ProductCard } from './product-card'

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
  description_ar: string | null
  description_en: string | null
  imageUrl: string | null
  calories: number | null
  allergens: string | null
  nutritionalFacts: string | null
  isActive: boolean
  variants: Variant[]
  category: {
    id: string
    name_ar: string
    name_en: string
  }
}

interface Category {
  id: string
  name_ar: string
  name_en: string
  imageUrl: string | null
  sortOrder: number
}

interface ProductGridProps {
  items: Item[]
  categories: Category[]
  language: 'ar' | 'en'
  searchQuery: string
  onProductClick: (item: Item) => void
  onCategoryInView: (categoryId: string) => void
}

export function ProductGrid({
  items,
  categories,
  language,
  searchQuery,
  onProductClick,
  onCategoryInView,
}: ProductGridProps) {
  const isRTL = language === 'ar'
  const sectionRefs = useRef<Map<string, HTMLElement>>(new Map())

  const onCategoryInViewRef = useRef(onCategoryInView)
  useEffect(() => {
    onCategoryInViewRef.current = onCategoryInView
  }, [onCategoryInView])

  // Filter items by search query
  const filteredItems = useMemo(() => {
    let filtered = items.filter((item) => item.isActive)

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      filtered = filtered.filter((item) => {
        const nameMatch =
          item.name_ar.toLowerCase().includes(query) ||
          item.name_en.toLowerCase().includes(query)
        const descMatch =
          item.description_ar?.toLowerCase().includes(query) ||
          item.description_en?.toLowerCase().includes(query)
        return nameMatch || descMatch
      })
    }

    return filtered
  }, [items, searchQuery])

  // Group by category
  const groupedItems = useMemo(() => {
    const groups: Record<string, Item[]> = {}
    filteredItems.forEach((item) => {
      if (!groups[item.categoryId]) {
        groups[item.categoryId] = []
      }
      groups[item.categoryId].push(item)
    })
    return groups
  }, [filteredItems])

  // Sorted categories that have items
  const activeCategories = useMemo(() => {
    return categories
      .filter((cat) => groupedItems[cat.id]?.length)
      .sort((a, b) => a.sortOrder - b.sortOrder)
  }, [categories, groupedItems])

  // IntersectionObserver
  useEffect(() => {
    if (searchQuery.trim() || activeCategories.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const intersecting = entries.filter((e) => e.isIntersecting)
        if (intersecting.length > 0) {
          const best = intersecting.reduce((prev, cur) =>
            cur.intersectionRatio > prev.intersectionRatio ? cur : prev
          )
          const id = best.target.id.replace('category-', '')
          onCategoryInViewRef.current(id)
        }
      },
      { rootMargin: '-10% 0px -55% 0px', threshold: 0 }
    )

    sectionRefs.current.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [activeCategories, searchQuery])

  const setSectionRef = useCallback(
    (id: string) => (el: HTMLElement | null) => {
      if (el) sectionRefs.current.set(id, el)
      else sectionRefs.current.delete(id)
    },
    []
  )

  // Empty state
  if (filteredItems.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center py-20 px-4"
        dir={isRTL ? 'rtl' : 'ltr'}
        lang={language}
      >
        <SearchX className="w-14 h-14 text-[#D4C8BB]/25 mb-4" />
        <p className="text-[#D4C8BB]/50 text-base font-medium">
          {getTranslation(language, 'no_results')}
        </p>
      </div>
    )
  }

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} lang={language} className="w-full">
      {activeCategories.map((category) => (
        <section
          key={category.id}
          id={`category-${category.id}`}
          ref={setSectionRef(category.id)}
          className="mb-6"
        >
          {/* Section heading */}
          <div className="flex items-center gap-3 mb-4 px-2">
            <h2 className="text-lg font-bold text-[#D4956A] whitespace-nowrap">
              {language === 'ar' ? category.name_ar : category.name_en}
            </h2>
            <div className="flex-1 h-px bg-[#D4956A]/20" />
          </div>

          {/* Single-column card list */}
          <div className="flex flex-col divide-y divide-white/8">
            {groupedItems[category.id].map((item) => (
              <ProductCard
                key={item.id}
                item={item}
                language={language}
                onClick={() => onProductClick(item)}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
