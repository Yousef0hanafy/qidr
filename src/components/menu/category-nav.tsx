'use client'

import { useRef, useEffect, useCallback } from 'react'
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
  onSelect: (categoryId: string) => void
}

export function CategoryNav({
  categories,
  selectedCategory,
  onSelect,
}: CategoryNavProps) {
  const { language } = useMenuStore()
  const scrollRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<Map<string, HTMLButtonElement>>(new Map())

  // Auto-scroll the nav bar to center the active thumbnail
  useEffect(() => {
    if (selectedCategory && scrollRef.current) {
      const activeEl = itemRefs.current.get(selectedCategory)
      if (activeEl) {
        const scrollEl = scrollRef.current
        const scrollLeft =
          activeEl.offsetLeft -
          scrollEl.offsetWidth / 2 +
          activeEl.offsetWidth / 2
        scrollEl.scrollTo({ left: scrollLeft, behavior: 'smooth' })
      }
    }
  }, [selectedCategory])

  const handleClick = useCallback(
    (categoryId: string) => {
      onSelect(categoryId)
      // Scroll the page to the matching category section
      const section = document.getElementById(`category-${categoryId}`)
      if (section) {
        const navHeight = scrollRef.current?.offsetHeight || 90
        const top =
          section.getBoundingClientRect().top + window.scrollY - navHeight - 8
        window.scrollTo({ top, behavior: 'smooth' })
      }
    },
    [onSelect]
  )

  if (categories.length === 0) return null

  return (
    <nav
      dir={language === 'ar' ? 'rtl' : 'ltr'}
      lang={language}
      className="sticky top-0 z-40 bg-[#1A1A2E] border-b border-[#D4A843]/15 shadow-lg"
    >
      <div
        ref={scrollRef}
        className="flex gap-5 overflow-x-auto px-5 py-3"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.id
          const catName = language === 'ar' ? cat.name_ar : cat.name_en

          return (
            <button
              key={cat.id}
              ref={(el) => {
                if (el) itemRefs.current.set(cat.id, el)
              }}
              onClick={() => handleClick(cat.id)}
              className="shrink-0 flex flex-col items-center gap-1.5 group focus:outline-none"
              aria-label={catName}
            >
              {/* Circular thumbnail */}
              <motion.div
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.94 }}
                className={cn(
                  'w-[52px] h-[52px] rounded-full border-[3px] overflow-hidden transition-all duration-300',
                  isActive
                    ? 'border-[#D4A843] scale-110 shadow-lg shadow-[#D4A843]/30'
                    : 'border-white/15 group-hover:border-[#D4A843]/40'
                )}
              >
                {cat.imageUrl ? (
                  <img
                    src={cat.imageUrl}
                    alt={catName}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full bg-[#D4A843]/20 flex items-center justify-center">
                    <span className="text-[#F1CDAF] text-sm font-bold">
                      {catName.charAt(0)}
                    </span>
                  </div>
                )}
              </motion.div>

              {/* Small label */}
              <span
                className={cn(
                  'text-[11px] leading-tight text-center transition-colors duration-300 max-w-[64px] line-clamp-2',
                  isActive
                    ? 'text-[#D4A843] font-semibold'
                    : 'text-[#F1CDAF]/60 group-hover:text-[#F1CDAF]'
                )}
              >
                {catName}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
