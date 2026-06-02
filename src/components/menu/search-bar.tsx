'use client'

import { useState, useEffect, useCallback } from 'react'
import { Search, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useMenuStore } from '@/store/menu-store'
import { getTranslation } from '@/lib/i18n'
import { cn } from '@/lib/utils'

export function SearchBar() {
  const { language, searchQuery, setSearchQuery } = useMenuStore()
  const isRTL = language === 'ar'
  const [localValue, setLocalValue] = useState(searchQuery)
  const [isFocused, setIsFocused] = useState(false)

  // Sync from store
  useEffect(() => {
    setLocalValue(searchQuery)
  }, [searchQuery])

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(localValue)
    }, 300)
    return () => clearTimeout(timer)
  }, [localValue, setSearchQuery])

  const clearSearch = useCallback(() => {
    setLocalValue('')
    setSearchQuery('')
  }, [setSearchQuery])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      dir={isRTL ? 'rtl' : 'ltr'}
      lang={language}
      className="w-full max-w-xl mx-auto px-4"
    >
      <div
        className={cn(
          'relative flex items-center rounded-xl border bg-white shadow-sm transition-all duration-300',
          isFocused
            ? 'border-[#D4A843] shadow-md shadow-[#D4A843]/10'
            : 'border-gray-200 shadow-sm'
        )}
      >
        <Search
          className={cn(
            'size-5 shrink-0 transition-colors duration-300',
            isRTL ? 'ml-3' : 'mr-3',
            isFocused ? 'text-[#D4A843]' : 'text-gray-400'
          )}
        />
        <input
          type="text"
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={getTranslation(language, 'search_placeholder')}
          className="flex-1 h-12 bg-transparent text-[#1A1A2E] placeholder:text-gray-400 outline-none text-sm sm:text-base px-0"
          dir={isRTL ? 'rtl' : 'ltr'}
        />
        <AnimatePresence>
          {localValue.length > 0 && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={clearSearch}
              className={cn(
                'shrink-0 p-1 rounded-full hover:bg-gray-100 transition-colors',
                isRTL ? 'ml-3' : 'mr-3'
              )}
            >
              <X className="size-4 text-gray-400" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
