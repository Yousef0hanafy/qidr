'use client'

import { Flame, AlertTriangle, Leaf, Wheat, Milk, Fish, Egg, Nut } from 'lucide-react'
import { motion } from 'framer-motion'
import { useMenuStore } from '@/store/menu-store'
import { cn } from '@/lib/utils'

interface Item {
  id: string
  name_ar: string
  name_en: string
  description_ar?: string | null
  description_en?: string | null
  imageUrl?: string | null
  calories?: number | null
  allergens?: string | null
  nutritionalFacts?: string | null
  isActive: boolean
  category?: {
    id: string
    name_ar: string
    name_en: string
  }
  variants?: { id: string; price: number; available: boolean; status: string; variantName_ar: string; variantName_en: string }[]
}

interface NutritionGuideProps {
  items: Item[]
  language: 'ar' | 'en'
  onProductClick: (item: Item) => void
}

function AllergenIcon({ type }: { type: string }) {
  const lower = type.toLowerCase()
  if (lower.includes('gluten') || lower.includes('wheat')) return <Wheat className="size-4 text-amber-400" />
  if (lower.includes('dairy') || lower.includes('milk')) return <Milk className="size-4 text-blue-300" />
  if (lower.includes('fish')) return <Fish className="size-4 text-cyan-400" />
  if (lower.includes('egg')) return <Egg className="size-4 text-yellow-300" />
  if (lower.includes('nut') || lower.includes('peanut')) return <Nut className="size-4 text-orange-400" />
  return <AlertTriangle className="size-4 text-red-400" />
}

function CalorieBadge({ calories, language }: { calories: number | null; language: 'ar' | 'en' }) {
  const level = !calories
    ? 'low'
    : calories < 100
      ? 'low'
      : calories < 300
        ? 'medium'
        : 'high'

  const colorMap = {
    low: 'text-green-400 bg-green-400/10 border-green-400/20',
    medium: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
    high: 'text-red-400 bg-red-400/10 border-red-400/20',
  }

  return (
    <span className={cn(
      'inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border',
      colorMap[level]
    )}>
      <Flame className="size-3" />
      {calories || 0} {language === 'ar' ? 'سعرة' : 'cal'}
    </span>
  )
}

export function NutritionGuide({ items, language, onProductClick }: NutritionGuideProps) {
  const isRTL = language === 'ar'
  const activeItems = items.filter((i) => i.isActive)

  // Group allergens
  const allergenList = [...new Set(
    activeItems
      .filter((i) => i.allergens)
      .flatMap((i) => i.allergens!.split(',').map((a) => a.trim().toLowerCase()))
      .filter(Boolean)
  )]

  // Stats
  const avgCalories = activeItems.length > 0
    ? Math.round(activeItems.reduce((sum, i) => sum + (i.calories || 0), 0) / activeItems.length)
    : 0
  const itemsWithAllergens = activeItems.filter((i) => i.allergens).length
  const lowCalItems = activeItems.filter((i) => i.calories && i.calories < 150).length

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} lang={language} className="w-full">
      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-white/5 rounded-xl p-3 text-center border border-white/5">
          <Flame className="size-5 text-[#D4956A] mx-auto mb-1" />
          <p className="text-lg font-bold text-[#D4956A]">{avgCalories}</p>
          <p className="text-[10px] text-[#D4C8BB]/50">
            {language === 'ar' ? 'متوسط السعرات' : 'Avg Calories'}
          </p>
        </div>
        <div className="bg-white/5 rounded-xl p-3 text-center border border-white/5">
          <AlertTriangle className="size-5 text-amber-400 mx-auto mb-1" />
          <p className="text-lg font-bold text-amber-400">{itemsWithAllergens}</p>
          <p className="text-[10px] text-[#D4C8BB]/50">
            {language === 'ar' ? 'يحتوي حساسية' : 'Has Allergens'}
          </p>
        </div>
        <div className="bg-white/5 rounded-xl p-3 text-center border border-white/5">
          <Leaf className="size-5 text-green-400 mx-auto mb-1" />
          <p className="text-lg font-bold text-green-400">{lowCalItems}</p>
          <p className="text-[10px] text-[#D4C8BB]/50">
            {language === 'ar' ? 'خيار صحي' : 'Healthy Choice'}
          </p>
        </div>
      </div>

      {/* Allergen legend */}
      {allergenList.length > 0 && (
        <div className="mb-6 bg-white/3 rounded-xl p-4 border border-white/5">
          <h3 className="text-sm font-semibold text-[#D4956A] mb-3 flex items-center gap-2">
            <AlertTriangle className="size-4" />
            {language === 'ar' ? 'رموز الحساسية' : 'Allergen Legend'}
          </h3>
          <div className="flex flex-wrap gap-3">
            {allergenList.map((a) => (
              <div key={a} className="flex items-center gap-1.5">
                <AllergenIcon type={a} />
                <span className="text-xs text-[#D4C8BB]/60 capitalize">{a}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Items list with nutrition info */}
      <h3 className="text-sm font-semibold text-[#D4C8BB]/70 mb-3">
        {language === 'ar' ? 'المعلومات الغذائية لجميع الأصناف' : 'Nutritional Info for All Items'}
      </h3>

      <div className="flex flex-col divide-y divide-white/5">
        {activeItems.map((item, idx) => {
          const name = isRTL ? item.name_ar : item.name_en
          const desc = isRTL ? item.description_ar : item.description_en
          const catName = item.category
            ? (isRTL ? item.category.name_ar : item.category.name_en)
            : null

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: idx * 0.02 }}
              onClick={() => onProductClick(item)}
              className="flex items-start gap-3 py-3 px-1 cursor-pointer hover:bg-white/3 rounded-lg transition-colors -mx-1"
            >
              {/* Item image */}
              <div className="shrink-0 w-12 h-12 rounded-lg overflow-hidden bg-white/5 ring-1 ring-white/10">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={name} className="w-full h-full object-cover" loading="lazy" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Flame className="size-4 text-[#D4956A]/20" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="text-sm font-medium text-[#D4956A] truncate">{name}</h4>
                  {item.calories != null && <CalorieBadge calories={item.calories} language={language} />}
                </div>
                {catName && (
                  <p className="text-[10px] text-[#D4C8BB]/30 mt-0.5">{catName}</p>
                )}
                {item.allergens && (
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-[10px] text-amber-400/60">{language === 'ar' ? 'حساسية' : 'Allergens'}:</span>
                    <div className="flex gap-1">
                      {item.allergens.split(',').map((a) => (
                        <AllergenIcon key={a.trim()} type={a.trim()} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
