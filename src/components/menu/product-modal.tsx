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
          'max-w-lg sm:max-w-2xl p-0 gap-0 overflow-hidden rounded-2xl max-h-[90vh] overflow-y-auto bg-[#003327] border-white/10',
          '[&>button]:top-3 [&>button]:right-3 [&>button]:text-[#F3E5D8]/60 [&>button]:hover:text-[#F1CDAB]'
        )}
        showCloseButton={true}
      >
        {/* Image */}
        <div className="relative aspect-[16/9] sm:aspect-video w-full overflow-hidden bg-[#002419]">
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
            <div className="w-full h-full flex items-center justify-center bg-[#F1CDAB]/5">
              <Flame className="w-16 h-16 text-[#F1CDAB]/15" />
            </div>
          )}

          {/* Category badge */}
          <div className="absolute top-3 left-3">
            <Badge className="bg-[#003327]/90 backdrop-blur-sm text-[#F1CDAB] border border-[#F1CDAB]/20 rounded-full px-3">
              {categoryName}
            </Badge>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6" dir={isRTL ? 'rtl' : 'ltr'} lang={language}>
          <DialogTitle className="text-xl sm:text-2xl font-bold text-[#F1CDAB] mb-2">
            {name}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {name} - {categoryName}
          </DialogDescription>

          {description && (
            <p className="text-[#F3E5D8]/60 text-sm sm:text-base leading-relaxed mb-4">
              {description}
            </p>
          )}

          {/* Quick info badges */}
          <div className="flex flex-wrap gap-2 mb-5">
            {item.calories && (
              <div className="flex items-center gap-1.5 bg-[#F1CDAB]/10 text-[#F1CDAB] text-xs px-3 py-1.5 rounded-full">
                <Clock className="size-3.5" />
                <span>
                  {item.calories} {getTranslation(language, 'calories')}
                </span>
              </div>
            )}
            {item.allergens && (
              <div className="flex items-center gap-1.5 bg-red-500/10 text-red-400 text-xs px-3 py-1.5 rounded-full">
                <AlertTriangle className="size-3.5" />
                <span>{getTranslation(language, 'allergens')}</span>
              </div>
            )}
            {item.nutritionalFacts && (
              <div className="flex items-center gap-1.5 bg-green-500/10 text-green-400 text-xs px-3 py-1.5 rounded-full">
                <Leaf className="size-3.5" />
                <span>{getTranslation(language, 'nutritional_info')}</span>
              </div>
            )}
          </div>

          <Separator className="bg-white/10 mb-5" />

          {/* Variants */}
          {item.variants.length > 0 && (
            <div>
              <h3 className="font-bold text-[#F1CDAB] text-base mb-3">
                {getTranslation(language, 'variants')}
              </h3>
              <div className="space-y-2">
                {/* Available variants */}
                {availableVariants.map((variant) => {
                  const vName =
                    language === 'ar'
                      ? variant.variantName_ar
                      : variant.variantName_en
                  return (
                    <div
                      key={variant.id}
                      className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/8"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-400" />
                        <span className="text-sm font-medium text-[#F3E5D8]">
                          {vName}
                        </span>
                      </div>
                      <span className="font-bold text-[#F1CDAB] text-sm">
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
                      className="flex items-center justify-between p-3 rounded-xl bg-white/3 border border-white/5 opacity-50"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-[#F3E5D8]/30" />
                        <span className="text-sm font-medium text-[#F3E5D8]/50 line-through">
                          {vName}
                        </span>
                      </div>
                      <Badge
                        variant="secondary"
                        className="text-xs text-[#F3E5D8]/40 bg-white/5"
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
              <Separator className="my-5 bg-white/10" />
              <div>
                <h3 className="font-bold text-[#F1CDAB] text-base mb-2">
                  {getTranslation(language, 'allergen_info')}
                </h3>
                <p className="text-sm text-[#F3E5D8]/60 leading-relaxed">
                  {item.allergens}
                </p>
              </div>
            </>
          )}

          {/* Nutritional info */}
          {item.nutritionalFacts && (
            <>
              <Separator className="my-5 bg-white/10" />
              <div>
                <h3 className="font-bold text-[#F1CDAB] text-base mb-2">
                  {getTranslation(language, 'nutrition_info')}
                </h3>
                <p className="text-sm text-[#F3E5D8]/60 leading-relaxed whitespace-pre-line">
                  {item.nutritionalFacts}
                </p>
              </div>
            </>
          )}

          {/* Availability status */}
          {availableVariants.length > 0 && unavailableVariants.length === 0 && (
            <div className="mt-5">
              <Badge className="bg-green-500/15 text-green-400 border border-green-500/20 rounded-full px-3 py-1">
                ✓ {getTranslation(language, 'available')}
              </Badge>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
