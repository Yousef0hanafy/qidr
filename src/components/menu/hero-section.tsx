'use client'

import { useState, useEffect } from 'react'
import { ChevronDown, UtensilsCrossed } from 'lucide-react'
import { motion } from 'framer-motion'
import { useMenuStore } from '@/store/menu-store'
import { getTranslation } from '@/lib/i18n'
import { BranchSelector } from './branch-selector'

interface Branch {
  id: string
  name_ar: string
  name_en: string
  slug: string
  isActive: boolean
}

interface Settings {
  [key: string]: string
}

export function HeroSection() {
  const { language, selectedBranch, setSelectedBranch } = useMenuStore()
  const isRTL = language === 'ar'
  const [branches, setBranches] = useState<Branch[]>([])
  const [settings, setSettings] = useState<Settings>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const [branchesRes, settingsRes] = await Promise.all([
          fetch('/api/branches'),
          fetch('/api/settings'),
        ])
        if (branchesRes.ok) {
          const branchesData = await branchesRes.json()
          setBranches(branchesData.filter((b: Branch) => b.isActive))
          if (branchesData.length > 0 && !selectedBranch) {
            const firstActive = branchesData.find((b: Branch) => b.isActive)
            if (firstActive) setSelectedBranch(firstActive.id)
          }
        }
        if (settingsRes.ok) {
          const settingsData = await settingsRes.json()
          setSettings(settingsData)
        }
      } catch {
        // silently handle
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [selectedBranch, setSelectedBranch])

  const welcomeMessage =
    settings.welcome_message_ar || settings.welcome_message_en || ''
  const subtitle = isRTL ? welcomeMessage || 'نرحب بكم في قدر' : welcomeMessage || 'Welcome to Qidr'

  return (
    <div
      dir={isRTL ? 'rtl' : 'ltr'}
      lang={language}
      className="relative min-h-[70vh] flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Dark background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1A1A2E] via-[#16213E] to-[#1A1A2E]" />

      {/* Decorative gold accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#D4A843]/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-[#D4A843]/5 rounded-full blur-2xl" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-[#D4A843]/5 rounded-full blur-2xl" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-8 px-4 text-center">
        {/* Logo icon */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="mb-2"
        >
          <div className="w-20 h-20 rounded-full bg-[#D4A843]/20 flex items-center justify-center border-2 border-[#D4A843]/40">
            <UtensilsCrossed className="w-10 h-10 text-[#D4A843]" />
          </div>
        </motion.div>

        {/* Restaurant name */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
          className="text-5xl sm:text-6xl md:text-7xl font-bold text-white tracking-wide"
        >
          <span className="text-[#D4A843]">قدر</span>
          <span className="text-white/60 mx-3">/</span>
          <span className="text-white/90">Qidr</span>
        </motion.h1>

        {/* Welcome message */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
          className="text-lg sm:text-xl text-white/70 max-w-md"
        >
          {subtitle}
        </motion.p>

        {/* Branch selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
          className="w-full max-w-xs"
        >
          {loading ? (
            <div className="h-12 rounded-xl bg-white/10 animate-pulse" />
          ) : (
            <BranchSelector
              branches={branches}
              selectedBranch={selectedBranch}
              onSelect={setSelectedBranch}
            />
          )}
        </motion.div>

        {/* View menu CTA */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: 'easeOut' }}
          onClick={() => {
            const el = document.getElementById('menu-content')
            el?.scrollIntoView({ behavior: 'smooth' })
          }}
          className="mt-2 px-8 py-3 rounded-xl bg-[#D4A843] text-[#1A1A2E] font-semibold text-lg hover:bg-[#D4A843]/90 transition-all duration-300 shadow-lg shadow-[#D4A843]/20"
        >
          {getTranslation(language, 'view_menu')}
        </motion.button>

        {/* Scroll down chevron */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-8"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ChevronDown className="w-8 h-8 text-[#D4A843]/60" />
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
