'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { Search, X, ChevronDown, MapPin, Globe, Coffee, UtensilsCrossed, Leaf } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useMenuStore } from '@/store/menu-store'
import { getTranslation } from '@/lib/i18n'
import { cn } from '@/lib/utils'

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
  const [showBranchPicker, setShowBranchPicker] = useState(false)

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

  const currentBranch = branches.find((b) => b.id === selectedBranch)
  const branchLabel = currentBranch
    ? isRTL
      ? currentBranch.name_ar
      : currentBranch.name_en
    : getTranslation(language, 'select_branch')

  // Menu type cards - 3 circular navigation types like the reference
  const menuTypes = [
    {
      id: 'breakfast',
      name_ar: 'الفطور',
      name_en: 'Breakfast',
      image: '/images/menu-types/breakfast.png',
      icon: Coffee,
    },
    {
      id: 'menu',
      name_ar: 'منيو المطعم',
      name_en: 'Restaurant Menu',
      image: '/images/menu-types/restaurant-menu.png',
      icon: UtensilsCrossed,
    },
    {
      id: 'nutrition',
      name_ar: 'الارشادات الغذائية',
      name_en: 'Nutritional Guide',
      image: '/images/menu-types/nutritional-guide.png',
      icon: Leaf,
    },
  ]

  return (
    <header
      dir={isRTL ? 'rtl' : 'ltr'}
      lang={language}
      className="relative z-30"
    >
      {/* ─── HERO IMAGE SECTION ─── */}
      {/* z-30: Highest layer — background image sits behind everything */}
      <div className="relative w-full h-[260px] sm:h-[300px]">
        <img
          src="/images/hero-bg.png"
          alt="Qidr Restaurant"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-[#1A1410]" />
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#1A1410] to-transparent" />
      </div>

      {/* ─── HERO CONTENT OVERLAY ─── */}
      {/* z-30: Logo + name on top of the hero image */}
      <div className="absolute inset-0 z-30 flex flex-col items-center pointer-events-none">
        {/* Language switcher — pointer-events-auto so it's clickable */}
        <div className="absolute top-3 left-3 sm:top-4 sm:left-4 pointer-events-auto z-[35]">
          <button
            onClick={() => useMenuStore.getState().setLanguage(language === 'ar' ? 'en' : 'ar')}
            className="flex items-center gap-1.5 bg-black/30 backdrop-blur-sm rounded-full px-3 py-1.5 text-white/80 hover:text-white text-xs transition-colors"
          >
            <Globe className="size-3.5" />
            <span>{language === 'ar' ? 'EN' : 'عربي'}</span>
          </button>
        </div>

        {/* Logo + Restaurant name */}
        <div className="mt-auto mb-4 sm:mb-6 flex flex-col items-center gap-2">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-[3px] border-[#D4956A]/50 shadow-lg shadow-black/30">
              <Image
                src="/Qidr.avif"
                alt="Qidr Logo"
                width={96}
                height={96}
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-center"
          >
            <h1 className="text-2xl sm:text-3xl font-bold text-[#D4956A] drop-shadow-lg">
              {language === 'ar' ? 'قدر' : 'Qidr'}
            </h1>
            <p className="text-white/50 text-xs mt-0.5">
              {getTranslation(language, 'welcome_message')}
            </p>
          </motion.div>
        </div>
      </div>

      {/* ─── BRANCH SELECTOR + SEARCH ─── */}
      {/* z-20: Below hero content, above category nav. Branch dropdown gets z-50 */}
      <div className="relative z-20 max-w-[552px] mx-auto px-4 -mt-2">
        {/* Branch selector - compact */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="mb-3"
        >
          <div className="relative">
            <button
              onClick={() => setShowBranchPicker(!showBranchPicker)}
              className="w-full flex items-center justify-between gap-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl h-9 px-3 text-[#D4956A] text-xs sm:text-sm hover:bg-white/8 transition-colors"
            >
              <div className="flex items-center gap-2">
                <MapPin className="size-3 text-[#D4956A]/50" />
                <span className="text-[#D4956A]/70 truncate">{branchLabel}</span>
              </div>
              <ChevronDown className={cn(
                "size-3.5 text-[#D4956A]/40 transition-transform shrink-0",
                showBranchPicker && "rotate-180"
              )} />
            </button>

            {/* Branch dropdown — z-50 so it goes over everything */}
            <AnimatePresence>
              {showBranchPicker && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="absolute top-full left-0 right-0 mt-1 bg-[#120D08] border border-white/10 rounded-xl overflow-hidden shadow-2xl z-50"
                >
                  {branches.map((branch) => (
                    <button
                      key={branch.id}
                      onClick={() => {
                        onSelectBranch(branch.id)
                        setShowBranchPicker(false)
                      }}
                      className={cn(
                        "w-full text-left px-4 py-2.5 text-sm transition-colors",
                        selectedBranch === branch.id
                          ? "bg-[#D4956A]/15 text-[#D4956A]"
                          : "text-[#D4C8BB]/70 hover:bg-white/5 hover:text-[#D4C8BB]"
                      )}
                    >
                      {isRTL ? branch.name_ar : branch.name_en}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Search bar */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mb-4"
        >
          <div
            className={cn(
              'relative flex items-center rounded-xl border bg-white/5 backdrop-blur-sm transition-all duration-300',
              isFocused
                ? 'border-[#D4956A]/40 shadow-sm shadow-[#D4956A]/5'
                : 'border-white/10'
            )}
          >
            <Search
              className={cn(
                'size-4 shrink-0 transition-colors duration-300',
                isRTL ? 'ml-3' : 'mr-3',
                isFocused ? 'text-[#D4956A]' : 'text-[#D4C8BB]/35'
              )}
            />
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={getTranslation(language, 'search_placeholder')}
              className="flex-1 h-9 bg-transparent text-[#D4956A] placeholder:text-[#D4C8BB]/30 outline-none text-sm px-0"
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
                  <X className="size-3.5 text-[#D4C8BB]/40" />
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* ─── 3 MENU TYPE CARDS ─── */}
        {/* الفطور / منيو المطعم / الارشادات الغذائية */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="flex justify-center gap-6 sm:gap-10 mb-4"
        >
          {menuTypes.map((type, idx) => {
            const Icon = type.icon
            return (
              <button
                key={type.id}
                className="flex flex-col items-center gap-2 group focus:outline-none"
              >
                <motion.div
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-[72px] h-[72px] sm:w-[80px] sm:h-[80px] rounded-full overflow-hidden ring-2 ring-[#D4956A]/25 group-hover:ring-[#D4956A]/60 transition-all duration-300 shadow-lg shadow-black/20"
                >
                  <img
                    src={type.image}
                    alt={isRTL ? type.name_ar : type.name_en}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </motion.div>
                <span className="text-[11px] sm:text-xs text-[#D4956A]/80 group-hover:text-[#D4956A] font-medium transition-colors text-center max-w-[80px] sm:max-w-[90px] leading-tight">
                  {isRTL ? type.name_ar : type.name_en}
                </span>
              </button>
            )
          })}
        </motion.div>
      </div>
    </header>
  )
}
