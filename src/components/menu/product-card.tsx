'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Flame, Zap } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
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
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ x: isRTL ? -4 : 4 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      onClick={onClick}
      className={cn(
        'flex items-center gap-3 bg-white rounded-2xl p-3 shadow-sm cursor-pointer group transition-colors duration-200 border border-gray-100/80 hover:border-[#D4A843]/20 hover:bg-[#FFFDF7]',
        isOutOfStock && 'opacity-60'
      )}
    >
      {/* Text content (left in LTR, right in RTL via flex + dir) */}
      <div className="flex-1 min-w-0 flex flex-col justify-center gap-1">
        {/* Name + calories pill */}
        <div className="flex items-center gap-1.5">
          <h3 className="font-bold text-[#1A1A2E] text-sm leading-tight truncate">
            {name}
          </h3>
          {item.calories && !isOutOfStock && (
            <span className="shrink-0 inline-flex items-center gap-0.5 bg-orange-50 text-orange-600 text-[10px] leading-none px-1.5 py-[3px] rounded-full font-medium">
              <Zap className="size-[10px]" />
              {item.calories}
            </span>
          )}
          {isOutOfStock && (
            <Badge
              variant="destructive"
              className="shrink-0 text-[10px] px-1.5 py-0 rounded-full h-[18px]"
            >
              {getTranslation(language, 'out_of_stock')}
            </Badge>
          )}
        </div>

        {/* Description */}
        {description && (
          <p className="text-[#9CA3AF] text-xs leading-snug line-clamp-1">
            {description}
          </p>
        )}

        {/* Price */}
        <div className="flex items-center gap-2">
          {priceInfo && !isOutOfStock && (
            <span className="text-[#D4A843] font-bold text-sm">
              {priceInfo.min.toFixed(2)}{' '}
              <span className="text-xs font-medium text-[#D4A843]/70">
                {getTranslation(language, 'SAR')}
              </span>
            </span>
          )}
          {priceInfo && priceInfo.count > 1 && (
            <span className="text-[10px] text-[#9CA3AF]">
              {priceInfo.count} {getTranslation(language, 'variants')}
            </span>
          )}
        </div>
      </div>

      {/* Small square rounded image (right in LTR, left in RTL) */}
      <div className="shrink-0 w-[80px] h-[80px] sm:w-[100px] sm:h-[100px] rounded-2xl overflow-hidden bg-gray-100">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#1A1A2E]/5 to-[#D4A843]/10">
            <Flame className="w-6 h-6 text-[#D4A843]/30" />
          </div>
        )}
      </div>
    </motion.div>
  )
}
