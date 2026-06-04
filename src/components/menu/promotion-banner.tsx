'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Calendar } from 'lucide-react'
import { useMenuStore } from '@/store/menu-store'

interface Promotion {
  id: string
  title_ar: string
  title_en: string
  description_ar?: string
  description_en?: string
  imageUrl: string | null
  startDate: string
  endDate: string
  active: boolean
}

interface PromotionBannerProps {
  promotions: Promotion[]
}

export function PromotionBanner({ promotions }: PromotionBannerProps) {
  const { language } = useMenuStore()
  const [selectedPromo, setSelectedPromo] = useState<Promotion | null>(null)

  if (promotions.length === 0) return null

  const isRtl = language === 'ar'

  // لمضاعفة العناصر حتى نضمن عدم وجود مساحات فارغة أثناء الحركة اللانهائية
  const duplicatedPromotions = [...promotions, ...promotions, ...promotions]

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString(isRtl ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        dir={isRtl ? 'rtl' : 'ltr'}
        lang={language}
        className="w-full overflow-hidden py-2"
      >
        {/* الحاوية الخارجية التي تخفي الأطراف الزائدة */}
        <div className="flex w-full overflow-hidden mask-gradient">
          <motion.div
            className="flex gap-4 px-4 shrink-0"
            /* التحريك بناءً على اتجاه اللغة لضمان السلاسة التامة */
            animate={{
              x: isRtl ? ['0%', '33.33%'] : ['0%', '-33.33%'],
            }}
            transition={{
              ease: 'linear',
              duration: promotions.length * 6, // سرعة ديناميكية تعتمد على عدد العناصر
              repeat: Infinity,
            }}
            /* إيقاف الحركة مؤقتًا عند مرور الماوس لتحسين الـ UX */
            whileHover={{ animationPlayState: 'paused' }}
          >
            {duplicatedPromotions.map((promo, index) => (
              <div
                key={`${promo.id}-${index}`}
                onClick={() => setSelectedPromo(promo)}
                className="shrink-0 w-72 sm:w-80 h-40 sm:h-44 rounded-2xl overflow-hidden relative group cursor-pointer shadow-md select-none"
              >
                {promo.imageUrl ? (
                  <img
                    src={promo.imageUrl}
                    alt={isRtl ? promo.title_ar : promo.title_en}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-[#D4956A]/30 to-[#D4956A]/10" />
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                <div className="absolute inset-0 flex items-end p-5">
                  <div>
                    <h3 className="text-white font-bold text-base sm:text-lg leading-tight">
                      {isRtl ? promo.title_ar : promo.title_en}
                    </h3>
                    <p className="text-white/60 text-xs mt-1">
                      {isRtl ? 'اضغط للتفاصيل' : 'Tap for details'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Promotion Detail Modal */}
      <AnimatePresence>
        {selectedPromo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={() => setSelectedPromo(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', duration: 0.3 }}
              className="relative w-full max-w-md rounded-2xl overflow-hidden bg-[#1A1410] border border-white/10 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
              dir={isRtl ? 'rtl' : 'ltr'}
            >
              {/* Image */}
              {selectedPromo.imageUrl ? (
                <div className="aspect-[16/9] w-full overflow-hidden bg-black/40 flex items-center justify-center">
                  <img
                    src={selectedPromo.imageUrl}
                    alt={isRtl ? selectedPromo.title_ar : selectedPromo.title_en}
                    className="w-full h-full object-contain" 
                  />
                </div>
              ) : (
                <div className="aspect-[16/9] w-full bg-gradient-to-br from-[#D4956A]/20 to-[#D4956A]/5" />
              )}

              {/* Close button */}
              <button
                onClick={() => setSelectedPromo(null)}
                className={`absolute top-3 ${isRtl ? 'left-3' : 'right-3'} w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white/70 hover:text-white hover:bg-black/70 transition-colors`}
              >
                <X className="size-4" />
              </button>

              {/* Content */}
              <div className="p-5">
                <h3 className="text-xl font-bold text-[#D4956A] mb-2">
                  {isRtl ? selectedPromo.title_ar : selectedPromo.title_en}
                </h3>

                {(selectedPromo.description_ar || selectedPromo.description_en) && (
                  <p className="text-[#D4C8BB]/70 text-sm leading-relaxed mb-4">
                    {isRtl 
                      ? (selectedPromo.description_ar || selectedPromo.description_en) 
                      : (selectedPromo.description_en || selectedPromo.description_ar)}
                  </p>
                )}

                {/* Dates */}
                <div className="flex items-center gap-4 text-[#D4C8BB]/50 text-xs">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="size-3.5" />
                    <span>
                      {formatDate(selectedPromo.startDate)} — {formatDate(selectedPromo.endDate)}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
