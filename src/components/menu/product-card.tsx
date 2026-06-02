'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Flame } from 'lucide-react'
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
  const description = language === 'ar' ? item.description_ar : item.description_en

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      onClick={onClick}
      className={cn(
        'relative rounded-2xl overflow-hidden bg-white shadow-md cursor-pointer group transition-shadow duration-300 hover:shadow-xl',
        isOutOfStock && 'opacity-70'
      )}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#1A1A2E]/5 to-[#D4A843]/10">
            <Flame className="w-12 h-12 text-[#D4A843]/30" />
          </div>
        )}

        {/* Out of stock overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <Badge
              variant="destructive"
              className="text-sm px-3 py-1 rounded-full"
            >
              {getTranslation(language, 'out_of_stock')}
            </Badge>
          </div>
        )}

        {/* Calories badge */}
        {item.calories && !isOutOfStock && (
          <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
            {item.calories} {getTranslation(language, 'calories')}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-[#1A1A2E] text-base leading-tight mb-1.5 line-clamp-1">
          {name}
        </h3>

        {description && (
          <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 mb-3">
            {description}
          </p>
        )}

        {/* Price */}
        {priceInfo && !isOutOfStock && (
          <div className="flex items-center justify-between">
            <div className="text-[#D4A843] font-bold text-lg">
              {getTranslation(language, 'from')} {priceInfo.min.toFixed(2)}{' '}
              <span className="text-sm font-medium text-[#D4A843]/80">
                {getTranslation(language, 'SAR')}
              </span>
            </div>
            {priceInfo.count > 1 && (
              <span className="text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">
                {priceInfo.count} {getTranslation(language, 'variants')}
              </span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  )
}
