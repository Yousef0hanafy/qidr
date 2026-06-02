'use client'

import { useState, useEffect, useCallback } from 'react'
import { Search, X, UtensilsCrossed } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useMenuStore } from '@/store/menu-store'
import { getTranslation } from '@/lib/i18n'
import { cn } from '@/lib/utils'
import { BranchSelector } from './branch-selector'

interface Branch {
  id: string
  name_ar: string
  name_en: string
  slug: string
  isActive: boolean
}

interface HeroSectionProps {
  branches: Branch[]
  selectedBranch: string | null
  onSelectBranch: (branchId: string) => void
}

export function HeroSection({
  branches,
  selectedBranch,
  onSelectBranch,
}: HeroSectionProps) {
  const { language, searchQuery, setSearchQuery } = useMenuStore()
  const isRTL = language === 'ar'
  const [localSearch, setLocalSearch] = useState(searchQuery)
  const [isFocused, setIsFocused] = useState(false)

  useEffect(() => {
    setLocalSearch(searchQuery)
  }, [searchQuery])

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(localSearch)
    }, 300)
    return () => clearTimeout(timer)
  }, [localSearch, setSearchQuery])

  const clearSearch = useCallback(() => {
    setLocalSearch('')
    setSearchQuery('')
  }, [setSearchQuery])

  return (
    <header
      dir={isRTL ? 'rtl' : 'ltr'}
      lang={language}
      className="relative overflow-hidden bg-[#003327]"
    >
      {/* Subtle decorative glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-[#F1CDAB]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-[552px] mx-auto px-4 py-6 flex flex-col items-center gap-4">
        {/* Logo + Restaurant name */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-3"
        >
          <div className="w-11 h-11 rounded-full bg-[#F1CDAB]/15 flex items-center justify-center border border-[#F1CDAB]/25">
            <UtensilsCrossed className="w-5 h-5 text-[#F1CDAB]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[#F1CDAB]">قدر</span>
            <span className="text-white/20 text-sm">/</span>
            <span className="text-sm font-medium text-[#F3E5D8]/50">Qidr</span>
          </div>
        </motion.div>

        {/* Branch selector */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="w-full max-w-xs"
        >
          <BranchSelector
            branches={branches}
            selectedBranch={selectedBranch}
            onSelect={onSelectBranch}
          />
        </motion.div>

        {/* Search bar */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="w-full max-w-sm"
        >
          <div
            className={cn(
              'relative flex items-center rounded-xl border bg-white/5 backdrop-blur-sm transition-all duration-300',
              isFocused
                ? 'border-[#F1CDAB]/40 shadow-sm shadow-[#F1CDAB]/5'
                : 'border-white/10'
            )}
          >
            <Search
              className={cn(
                'size-4 shrink-0 transition-colors duration-300',
                isRTL ? 'ml-3' : 'mr-3',
                isFocused ? 'text-[#F1CDAB]' : 'text-[#F3E5D8]/35'
              )}
            />
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={getTranslation(language, 'search_placeholder')}
              className="flex-1 h-10 bg-transparent text-[#F1CDAB] placeholder:text-[#F3E5D8]/30 outline-none text-sm px-0"
              dir={isRTL ? 'rtl' : 'ltr'}
            />
            <AnimatePresence>
              {localSearch.length > 0 && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={clearSearch}
                  className={cn(
                    'shrink-0 p-1 rounded-full hover:bg-white/10 transition-colors',
                    isRTL ? 'ml-3' : 'mr-3'
                  )}
                >
                  <X className="size-3.5 text-[#F3E5D8]/40" />
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </header>
  )
}
