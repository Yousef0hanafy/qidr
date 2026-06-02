'use client'

import { Flame, Clock, AlertTriangle, Leaf } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
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

interface ProductModalProps {
  item: Item | null
  language: 'ar' | 'en'
  isOpen: boolean
  onClose: () => void
}

export function ProductModal({
  item,
  language,
  isOpen,
  onClose,
}: ProductModalProps) {
  const isRTL = language === 'ar'

  if (!item) return null

  const name = language === 'ar' ? item.name_ar : item.name_en
  const description =
    language === 'ar' ? item.description_ar : item.description_en
  const categoryName =
    language === 'ar' ? item.category.name_ar : item.category.name_en

  const availableVariants = item.variants.filter(
    (v) => v.status === 'available' || v.available
  )
  const unavailableVariants = item.variants.filter(
    (v) => v.status === 'out_of_stock' || !v.available
  )

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className={cn(
          'max-w-[360px] sm:max-w-[420px] p-0 gap-0 overflow-hidden rounded-2xl max-h-[80vh] overflow-y-auto bg-[#1A1410] border-white/10',
          '[&>button]:top-2 [&>button]:right-2 [&>button]:text-[#D4C8BB]/60 [&>button]:hover:text-[#D4956A]'
        )}
        showCloseButton={true}
      >
        {/* Image — compact height */}
        <div className="relative w-full h-[160px] sm:h-[200px] overflow-hidden bg-[#120D08]">
          {item.imageUrl ? (
            <AnimatePresence>
              <motion.img
                key={item.imageUrl}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                src={item.imageUrl}
                alt={name}
                className="w-full h-full object-cover"
              />
            </AnimatePresence>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-[#D4956A]/5">
              <Flame className="w-10 h-10 text-[#D4956A]/15" />
            </div>
          )}

          {/* Category badge */}
          <div className="absolute top-2 left-2">
            <Badge className="bg-[#1A1410]/90 backdrop-blur-sm text-[#D4956A] border border-[#D4956A]/20 rounded-full px-2 py-0.5 text-[10px]">
              {categoryName}
            </Badge>
          </div>
        </div>

        {/* Content — compact padding */}
        <div className="p-4 sm:p-5" dir={isRTL ? 'rtl' : 'ltr'} lang={language}>
          <DialogTitle className="text-base sm:text-lg font-bold text-[#D4956A] mb-1.5">
            {name}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {name} - {categoryName}
          </DialogDescription>

          {description && (
            <p className="text-[#D4C8BB]/60 text-xs sm:text-sm leading-relaxed mb-3">
              {description}
            </p>
          )}

          {/* Quick info badges */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {item.calories && (
              <div className="flex items-center gap-1 bg-[#D4956A]/10 text-[#D4956A] text-[11px] px-2 py-1 rounded-full">
                <Clock className="size-3" />
                <span>
                  {item.calories} {getTranslation(language, 'calories')}
                </span>
              </div>
            )}
            {item.allergens && (
              <div className="flex items-center gap-1 bg-red-500/10 text-red-400 text-[11px] px-2 py-1 rounded-full">
                <AlertTriangle className="size-3" />
                <span>{getTranslation(language, 'allergens')}</span>
              </div>
            )}
            {item.nutritionalFacts && (
              <div className="flex items-center gap-1 bg-green-500/10 text-green-400 text-[11px] px-2 py-1 rounded-full">
                <Leaf className="size-3" />
                <span>{getTranslation(language, 'nutritional_info')}</span>
              </div>
            )}
          </div>

          <Separator className="bg-white/10 mb-4" />

          {/* Variants — compact */}
          {item.variants.length > 0 && (
            <div>
              <h3 className="font-bold text-[#D4956A] text-sm mb-2">
                {getTranslation(language, 'variants')}
              </h3>
              <div className="space-y-1.5">
                {/* Available variants */}
                {availableVariants.map((variant) => {
                  const vName =
                    language === 'ar'
                      ? variant.variantName_ar
                      : variant.variantName_en
                  return (
                    <div
                      key={variant.id}
                      className="flex items-center justify-between p-2.5 rounded-lg bg-white/5 border border-white/8"
                    >
                      <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                        <span className="text-xs font-medium text-[#D4C8BB]">
                          {vName}
                        </span>
                      </div>
                      <span className="font-bold text-[#D4956A] text-xs">
                        {variant.price.toFixed(2)}{' '}
                        {getTranslation(language, 'SAR')}
                      </span>
                    </div>
                  )
                })}

                {/* Unavailable variants */}
                {unavailableVariants.map((variant) => {
                  const vName =
                    language === 'ar'
                      ? variant.variantName_ar
                      : variant.variantName_en
                  return (
                    <div
                      key={variant.id}
                      className="flex items-center justify-between p-2.5 rounded-lg bg-white/3 border border-white/5 opacity-50"
                    >
                      <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#D4C8BB]/30" />
                        <span className="text-xs font-medium text-[#D4C8BB]/50 line-through">
                          {vName}
                        </span>
                      </div>
                      <Badge
                        variant="secondary"
                        className="text-[10px] text-[#D4C8BB]/40 bg-white/5"
                      >
                        {getTranslation(language, 'out_of_stock')}
                      </Badge>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Allergens detail */}
          {item.allergens && (
            <>
              <Separator className="my-4 bg-white/10" />
              <div>
                <h3 className="font-bold text-[#D4956A] text-sm mb-1.5">
                  {getTranslation(language, 'allergen_info')}
                </h3>
                <p className="text-xs text-[#D4C8BB]/60 leading-relaxed">
                  {item.allergens}
                </p>
              </div>
            </>
          )}

          {/* Nutritional info */}
          {item.nutritionalFacts && (
            <>
              <Separator className="my-4 bg-white/10" />
              <div>
                <h3 className="font-bold text-[#D4956A] text-sm mb-1.5">
                  {getTranslation(language, 'nutrition_info')}
                </h3>
                <p className="text-xs text-[#D4C8BB]/60 leading-relaxed whitespace-pre-line">
                  {item.nutritionalFacts}
                </p>
              </div>
            </>
          )}

          {/* Availability status */}
          {availableVariants.length > 0 && unavailableVariants.length === 0 && (
            <div className="mt-4">
              <Badge className="bg-green-500/15 text-green-400 border border-green-500/20 rounded-full px-2.5 py-0.5 text-[11px]">
                ✓ {getTranslation(language, 'available')}
              </Badge>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
