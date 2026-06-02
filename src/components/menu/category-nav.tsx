'use client'

import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useMenuStore } from '@/store/menu-store'
import { cn } from '@/lib/utils'

interface Category {
  id: string
  name_ar: string
  name_en: string
  imageUrl: string | null
  sortOrder: number
}

interface CategoryNavProps {
  categories: Category[]
  selectedCategory: string | null
  onSelect: (categoryId: string | null) => void
}

export function CategoryNav({
  categories,
  selectedCategory,
  onSelect,
}: CategoryNavProps) {
  const { language } = useMenuStore()
  const isRTL = language === 'ar'
  const scrollRef = useRef<HTMLDivElement>(null)
  const activeRef = useRef<HTMLButtonElement>(null)

  // Auto-scroll to active category
  useEffect(() => {
    if (activeRef.current && scrollRef.current) {
      const scrollEl = scrollRef.current
      const activeEl = activeRef.current
      const scrollLeft =
        activeEl.offsetLeft -
        scrollEl.offsetWidth / 2 +
        activeEl.offsetWidth / 2
      scrollEl.scrollTo({ left: scrollLeft, behavior: 'smooth' })
    }
  }, [selectedCategory])

  if (categories.length === 0) return null

  return (
    <div
      dir={isRTL ? 'rtl' : 'ltr'}
      lang={language}
      className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm"
    >
      <div
        ref={scrollRef}
        className="flex gap-1 overflow-x-auto px-4 py-3"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {/* All button */}
        <button
          ref={selectedCategory === null ? activeRef : undefined}
          onClick={() => onSelect(null)}
          className={cn(
            'shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap',
            selectedCategory === null
              ? 'bg-[#D4A843] text-white shadow-md shadow-[#D4A843]/20'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          )}
        >
          {language === 'ar' ? 'الكل' : 'All'}
        </button>

        {categories.map((cat) => (
          <button
            key={cat.id}
            ref={selectedCategory === cat.id ? activeRef : undefined}
            onClick={() => onSelect(cat.id)}
            className={cn(
              'shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap',
              selectedCategory === cat.id
                ? 'bg-[#D4A843] text-white shadow-md shadow-[#D4A843]/20'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            )}
          >
            {cat.imageUrl && (
              <img
                src={cat.imageUrl}
                alt=""
                className="w-5 h-5 rounded-full object-cover"
              />
            )}
            {language === 'ar' ? cat.name_ar : cat.name_en}
          </button>
        ))}
      </div>
    </div>
  )
}
