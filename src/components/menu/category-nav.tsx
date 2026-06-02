'use client'

import { useRef, useEffect, useCallback } from 'react'
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
        const navHeight = scrollRef.current?.offsetHeight || 110
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
      className="sticky top-0 z-40 bg-[#003327] shadow-lg"
    >
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto px-4 py-4 hide-scrollbar"
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
              className="shrink-0 flex flex-col items-center gap-2 group focus:outline-none"
              aria-label={catName}
            >
              {/* Circular thumbnail - 70px */}
              <div
                className={cn(
                  'w-[68px] h-[68px] rounded-full overflow-hidden transition-all duration-300',
                  isActive
                    ? 'ring-[3px] ring-[#F1CDAB] ring-offset-2 ring-offset-[#003327] scale-105'
                    : 'ring-[2px] ring-white/15 group-hover:ring-[#F1CDAB]/40'
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
                  <div className="w-full h-full bg-[#F1CDAB]/15 flex items-center justify-center">
                    <span className="text-[#F1CDAB] text-lg font-bold">
                      {catName.charAt(0)}
                    </span>
                  </div>
                )}
              </div>

              {/* Category name */}
              <span
                className={cn(
                  'text-xs text-center transition-colors duration-300 max-w-[76px] line-clamp-1',
                  isActive
                    ? 'text-[#F1CDAB] font-semibold'
                    : 'text-[#F3E5D8]/70 group-hover:text-[#F3E5D8]'
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
