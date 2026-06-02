'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { Search, X, ChevronDown, MapPin, Globe } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useMenuStore, type MenuMode } from '@/store/menu-store'
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
  const { language, searchQuery, setSearchQuery, menuMode, setMenuMode } = useMenuStore()
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

  // Menu type cards — each controls what content is shown below
  const menuTypes: { id: MenuMode; name_ar: string; name_en: string; image: string }[] = [
    {
      id: 'snacks',
      name_ar: 'تسالي',
      name_en: 'Snacks',
      image: '/images/menu-types/snacks.png',
    },
    {
      id: 'menu',
      name_ar: 'منيو المطعم',
      name_en: 'Restaurant Menu',
      image: '/images/menu-types/restaurant-menu.png',
    },
    {
      id: 'nutrition',
      name_ar: 'الارشادات الغذائية',
      name_en: 'Nutritional Guide',
      image: '/images/menu-types/nutritional-guide.png',
    },
  ]

  return (
    <header
      dir={isRTL ? 'rtl' : 'ltr'}
      lang={language}
      className="relative z-30"
    >
      {/* ─── LOGO + NAME AT THE VERY TOP ─── */}
      <div className="bg-[#1A1410] border-b border-white/5">
        <div className="max-w-[552px] mx-auto px-4 pt-4 pb-3 flex items-center justify-between">
          {/* Logo + Name */}
          <motion.div
            initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-2.5"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden border-2 border-[#D4956A]/40 shadow-md">
              <Image
                src="/Qidr.avif"
                alt="Qidr Logo"
                width={44}
                height={44}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-[#D4956A] leading-tight">
                {language === 'ar' ? 'قدر' : 'Qidr'}
              </h1>
              <p className="text-[10px] text-[#D4C8BB]/40 leading-tight">
                {getTranslation(language, 'welcome_message')}
              </p>
            </div>
          </motion.div>

          {/* Language switcher */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            onClick={() => useMenuStore.getState().setLanguage(language === 'ar' ? 'en' : 'ar')}
            className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-3 py-1.5 text-[#D4C8BB]/60 hover:text-[#D4956A] hover:border-[#D4956A]/25 text-xs transition-all"
          >
            <Globe className="size-3" />
            <span>{language === 'ar' ? 'EN' : 'عربي'}</span>
          </motion.button>
        </div>
      </div>

      {/* ─── HERO IMAGE ─── */}
      <div className="relative w-full h-[200px] sm:h-[240px]">
        <img
          src="/images/hero-bg.png"
          alt="Qidr Restaurant"
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1A1410]/60 via-black/20 to-[#1A1410]" />
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[#1A1410] to-transparent" />
      </div>

      {/* ─── BRANCH + SEARCH + 3 MENU TYPE CARDS ─── */}
      <div className="relative z-20 max-w-[552px] mx-auto px-4 -mt-4">
        {/* Branch selector — compact */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
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
          transition={{ duration: 0.35, delay: 0.15 }}
          className="mb-5"
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

        {/* ─── 3 MENU TYPE CARDS — functional, active state ─── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.2 }}
          className="flex justify-center gap-6 sm:gap-10 mb-5"
        >
          {menuTypes.map((type) => {
            const isActive = menuMode === type.id
            return (
              <button
                key={type.id}
                onClick={() => setMenuMode(type.id)}
                className="flex flex-col items-center gap-2 group focus:outline-none"
              >
                <motion.div
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  className={cn(
                    "w-[68px] h-[68px] sm:w-[78px] sm:h-[78px] rounded-full overflow-hidden transition-all duration-300 shadow-lg shadow-black/20",
                    isActive
                      ? "ring-[3px] ring-[#D4956A] ring-offset-2 ring-offset-[#1A1410] scale-105"
                      : "ring-2 ring-[#D4956A]/20 group-hover:ring-[#D4956A]/50"
                  )}
                >
                  <img
                    src={type.image}
                    alt={isRTL ? type.name_ar : type.name_en}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </motion.div>
                <span className={cn(
                  "text-[10px] sm:text-[11px] font-medium transition-colors text-center max-w-[76px] sm:max-w-[86px] leading-tight",
                  isActive
                    ? "text-[#D4956A]"
                    : "text-[#D4C8BB]/50 group-hover:text-[#D4C8BB]/80"
                )}>
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
