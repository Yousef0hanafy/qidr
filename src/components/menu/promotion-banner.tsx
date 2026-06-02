'use client'

import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useMenuStore } from '@/store/menu-store'

interface Promotion {
  id: string
  title_ar: string
  title_en: string
  imageUrl: string | null
}

interface PromotionBannerProps {
  promotions: Promotion[]
}

export function PromotionBanner({ promotions }: PromotionBannerProps) {
  const { language } = useMenuStore()
  const scrollRef = useRef<HTMLDivElement>(null)

  // Auto-scroll effect
  useEffect(() => {
    if (promotions.length <= 1 || !scrollRef.current) return

    const scrollEl = scrollRef.current
    let scrollPos = 0
    const speed = 0.5

    const interval = setInterval(() => {
      scrollPos += speed
      if (scrollPos >= scrollEl.scrollWidth / 2) {
        scrollPos = 0
      }
      scrollEl.scrollLeft = scrollPos
    }, 16)

    return () => clearInterval(interval)
  }, [promotions.length])

  if (promotions.length === 0) return null

  // Duplicate for infinite scroll effect
  const duplicated = [...promotions, ...promotions]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      dir={language === 'ar' ? 'rtl' : 'ltr'}
      lang={language}
      className="w-full"
    >
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide px-4 py-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {duplicated.map((promo, idx) => (
          <div
            key={`${promo.id}-${idx}`}
            className="shrink-0 w-72 sm:w-80 h-40 sm:h-44 rounded-2xl overflow-hidden relative group cursor-pointer"
          >
            {/* Background image or gradient fallback */}
            {promo.imageUrl ? (
              <img
                src={promo.imageUrl}
                alt={language === 'ar' ? promo.title_ar : promo.title_en}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-[#D4A843] to-[#B8912E]" />
            )}

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

            {/* Text content */}
            <div className="absolute inset-0 flex items-end p-5">
              <div>
                <h3 className="text-white font-bold text-lg leading-tight">
                  {language === 'ar' ? promo.title_ar : promo.title_en}
                </h3>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
