'use client'

import { Globe } from 'lucide-react'
import { motion } from 'framer-motion'
import { useMenuStore } from '@/store/menu-store'
import { Button } from '@/components/ui/button'

export function LanguageSwitcher() {
  const { language, setLanguage } = useMenuStore()

  const toggleLanguage = () => {
    setLanguage(language === 'ar' ? 'en' : 'ar')
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="fixed top-4 z-50"
      style={{ [language === 'ar' ? 'left' : 'right']: '1rem' }}
    >
      <Button
        variant="outline"
        size="sm"
        onClick={toggleLanguage}
        className="rounded-full bg-[#003327]/90 backdrop-blur-sm border-[#F1CDAB]/25 text-[#F1CDAB] hover:bg-[#F1CDAB]/15 hover:border-[#F1CDAB]/40 transition-all duration-300 shadow-lg gap-1.5"
      >
        <Globe className="size-4 text-[#F1CDAB]/70" />
        <span className="text-sm font-medium">
          {language === 'ar' ? 'EN' : 'عربي'}
        </span>
      </Button>
    </motion.div>
  )
}
