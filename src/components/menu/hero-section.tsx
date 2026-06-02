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

  // Sync from store
  useEffect(() => {
    setLocalSearch(searchQuery)
  }, [searchQuery])

  // Debounced search
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
      className="relative overflow-hidden bg-[#1A1A2E]"
    >
      {/* Subtle decorative glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-72 bg-[#D4A843]/8 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-6 sm:py-8 flex flex-col items-center gap-4">
        {/* Logo + Restaurant name */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-full bg-[#D4A843]/20 flex items-center justify-center border border-[#D4A843]/40">
            <UtensilsCrossed className="w-5 h-5 text-[#D4A843]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[#D4A843]">قدر</span>
            <span className="text-white/30 text-sm">/</span>
            <span className="text-base font-medium text-white/70">Qidr</span>
          </div>
        </motion.div>

        {/* Branch selector — compact inline */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="w-full max-w-sm"
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
          className="w-full max-w-md"
        >
          <div
            className={cn(
              'relative flex items-center rounded-xl border bg-white/5 backdrop-blur-sm transition-all duration-300',
              isFocused
                ? 'border-[#D4A843]/50 shadow-sm shadow-[#D4A843]/10'
                : 'border-white/15'
            )}
          >
            <Search
              className={cn(
                'size-4 shrink-0 transition-colors duration-300',
                isRTL ? 'ml-3' : 'mr-3',
                isFocused ? 'text-[#D4A843]' : 'text-white/40'
              )}
            />
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={getTranslation(language, 'search_placeholder')}
              className="flex-1 h-10 bg-transparent text-white placeholder:text-white/35 outline-none text-sm px-0"
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
                  <X className="size-3.5 text-white/50" />
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </header>
  )
}
