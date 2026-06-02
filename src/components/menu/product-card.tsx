'use client'

import { useMemo } from 'react'
import { Flame } from 'lucide-react'
import { getTranslation } from '@/lib/i18n'
import { cn } from '@/lib/utils'

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

interface ProductCardProps {
  item: Item
  language: 'ar' | 'en'
  onClick: () => void
}

export function ProductCard({ item, language, onClick }: ProductCardProps) {
  const isRTL = language === 'ar'

  // Calculate min price from available variants
  const priceInfo = useMemo(() => {
    if (!item.variants || item.variants.length === 0) return null
    const availableVariants = item.variants.filter(
      (v) => v.status === 'available' || v.available
    )
    if (availableVariants.length === 0) return null
    const prices = availableVariants.map((v) => v.price)
    const minPrice = Math.min(...prices)
    const maxPrice = Math.max(...prices)
    return { min: minPrice, max: maxPrice, count: availableVariants.length }
  }, [item.variants])

  // Check if all variants are out of stock
  const isOutOfStock = useMemo(() => {
    if (!item.variants || item.variants.length === 0) return false
    return item.variants.every(
      (v) => v.status === 'out_of_stock' || !v.available
    )
  }, [item.variants])

  const name = language === 'ar' ? item.name_ar : item.name_en
  const description =
    language === 'ar' ? item.description_ar : item.description_en

  return (
    <div
      onClick={onClick}
      className={cn(
        'flex items-center gap-3 cursor-pointer group transition-all duration-200 py-3 px-2 sm:px-0 rounded-xl hover:bg-white/5 active:bg-white/8',
        isRTL ? 'flex-row' : 'flex-row-reverse',
        isOutOfStock && 'opacity-50'
      )}
    >
      {/* Image - compact 72px, fixed size */}
      <div className="shrink-0 w-[72px] h-[72px] sm:w-[80px] sm:h-[80px] rounded-xl overflow-hidden ring-1 ring-white/10">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-[#D4956A]/8">
            <Flame className="w-6 h-6 sm:w-8 sm:h-8 text-[#D4956A]/20" />
          </div>
        )}
      </div>

      {/* Text content - flex-1 with min-w-0 to prevent text overflow */}
      <div className={cn('flex-1 min-w-0 flex flex-col justify-center gap-1', isRTL ? 'text-right' : 'text-left')}>
        {/* Name */}
        <h3 className="text-sm sm:text-[15px] font-semibold text-[#D4956A] leading-tight truncate">
          {name}
        </h3>

        {/* Description */}
        {description && (
          <p className="text-[#D4C8BB]/50 text-[11px] sm:text-xs leading-snug line-clamp-1">
            {description}
          </p>
        )}

        {/* Calories + Price row */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Calories */}
          {item.calories && !isOutOfStock && (
            <span className="inline-flex items-center gap-0.5 text-[#D4C8BB]/60 text-[10px] sm:text-[11px]">
              🔥 {item.calories} {language === 'ar' ? 'سعرة' : 'cal'}
            </span>
          )}

          {/* Out of stock */}
          {isOutOfStock && (
            <span className="text-[10px] sm:text-[11px] text-red-400/80 font-medium">
              {getTranslation(language, 'out_of_stock')}
            </span>
          )}

          {/* Price badge */}
          {priceInfo && !isOutOfStock && (
            <span className="inline-flex items-center gap-1 bg-[#1A1410] text-[#F2EAE0] text-[10px] sm:text-[11px] font-semibold px-2 py-[2px] rounded-md">
              {priceInfo.min.toFixed(2)} {getTranslation(language, 'SAR')}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
