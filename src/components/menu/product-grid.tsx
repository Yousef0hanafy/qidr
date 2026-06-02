'use client'

import { useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SearchX } from 'lucide-react'
import { useMenuStore } from '@/store/menu-store'
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
  selectedCategory: string | null
  onProductClick: (item: Item) => void
}

export function ProductGrid({
  items,
  categories,
  language,
  searchQuery,
  selectedCategory,
  onProductClick,
}: ProductGridProps) {
  const isRTL = language === 'ar'

  // Filter items
  const filteredItems = useMemo(() => {
    let filtered = items.filter((item) => item.isActive)

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter((item) => item.categoryId === selectedCategory)
    }

    // Filter by search query
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
  }, [items, selectedCategory, searchQuery])

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

  // Get sorted categories that have items
  const activeCategories = useMemo(() => {
    return categories
      .filter((cat) => groupedItems[cat.id]?.length)
      .sort((a, b) => a.sortOrder - b.sortOrder)
  }, [categories, groupedItems])

  if (filteredItems.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-20 px-4"
        dir={isRTL ? 'rtl' : 'ltr'}
        lang={language}
      >
        <SearchX className="w-16 h-16 text-gray-300 mb-4" />
        <p className="text-gray-400 text-lg font-medium">
          {getTranslation(language, 'no_results')}
        </p>
      </motion.div>
    )
  }

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} lang={language} className="w-full">
      {activeCategories.map((category, catIdx) => (
        <div key={category.id} id={`category-${category.id}`} className="mb-10">
          {/* Category heading */}
          <motion.div
            initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: catIdx * 0.05 }}
            className="flex items-center gap-3 mb-6 px-4"
          >
            <h2 className="text-xl sm:text-2xl font-bold text-[#1A1A2E]">
              {language === 'ar' ? category.name_ar : category.name_en}
            </h2>
            <div className="flex-1 h-px bg-gradient-to-r from-[#D4A843]/40 to-transparent" />
          </motion.div>

          {/* Items grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 px-4">
            <AnimatePresence mode="popLayout">
              {groupedItems[category.id].map((item, itemIdx) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: itemIdx * 0.05 }}
                >
                  <ProductCard
                    item={item}
                    language={language}
                    onClick={() => onProductClick(item)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      ))}
    </div>
  )
}
