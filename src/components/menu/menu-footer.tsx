'use client'

import {
  Instagram,
  Music2,
  Ghost,
  Facebook,
  Phone,
  MessageCircle,
  MapPin,
  Star,
  ExternalLink,
  UtensilsCrossed,
} from 'lucide-react'
import { motion } from 'framer-motion'
import { useMenuStore } from '@/store/menu-store'
import { getTranslation } from '@/lib/i18n'

interface Branch {
  id: string
  name_ar: string
  name_en: string
  slug: string
  address: string | null
  googleMapLink: string | null
  phone: string | null
  whatsapp: string | null
  instagram: string | null
  tiktok: string | null
  snapchat: string | null
  facebook: string | null
  websiteUrl: string | null
  isActive: boolean
}

interface MenuFooterProps {
  branch: Branch | null
  language: 'ar' | 'en'
  onRateClick?: () => void
}

export function MenuFooter({ branch, language }: MenuFooterProps) {
  const { setIsReviewModalOpen } = useMenuStore()
  const isRTL = language === 'ar'

  const socialLinks = branch
    ? [
        branch.instagram && {
          icon: Instagram,
          href: branch.instagram,
          label: 'Instagram',
          color: 'hover:text-pink-400',
        },
        branch.tiktok && {
          icon: Music2,
          href: branch.tiktok,
          label: 'TikTok',
          color: 'hover:text-white',
        },
        branch.snapchat && {
          icon: Ghost,
          href: branch.snapchat,
          label: 'Snapchat',
          color: 'hover:text-yellow-400',
        },
        branch.facebook && {
          icon: Facebook,
          href: branch.facebook,
          label: 'Facebook',
          color: 'hover:text-blue-400',
        },
      ].filter(Boolean)
    : []

  return (
    <footer
      dir={isRTL ? 'rtl' : 'ltr'}
      lang={language}
      className="bg-[#002419] text-[#F3E5D8] mt-12"
    >
      <div className="max-w-[552px] mx-auto px-4 pt-10 pb-8">
        {/* Social icons row */}
        {socialLinks.length > 0 && (
          <div className="flex justify-center gap-4 mb-8">
            {socialLinks.map((link) =>
              link ? (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-10 h-10 rounded-full bg-white/8 flex items-center justify-center text-[#F3E5D8]/50 hover:bg-white/15 transition-all duration-300 ${link.color}`}
                  aria-label={link.label}
                >
                  <link.icon className="size-5" />
                </a>
              ) : null
            )}
          </div>
        )}

        {/* Contact info */}
        <div className="space-y-3 mb-8">
          {branch?.phone && (
            <a
              href={`tel:${branch.phone}`}
              className="flex items-center justify-center gap-2 text-[#F3E5D8]/60 hover:text-[#F1CDAB] transition-colors text-sm"
            >
              <Phone className="size-4" />
              <span>{branch.phone}</span>
            </a>
          )}
          {branch?.whatsapp && (
            <a
              href={`https://wa.me/${branch.whatsapp.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 text-[#F3E5D8]/60 hover:text-green-400 transition-colors text-sm"
            >
              <MessageCircle className="size-4" />
              <span>WhatsApp</span>
            </a>
          )}
          {branch?.address && (
            <div className="flex items-center justify-center gap-2 text-[#F3E5D8]/50 text-sm">
              <MapPin className="size-4 shrink-0" />
              <span>{branch.address}</span>
            </div>
          )}
          {branch?.googleMapLink && (
            <a
              href={branch.googleMapLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 text-[#F1CDAB] hover:text-[#F3E5D8] transition-colors text-sm"
            >
              <ExternalLink className="size-4" />
              <span>{getTranslation(language, 'navigate')}</span>
            </a>
          )}
        </div>

        {/* Rate button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsReviewModalOpen(true)}
          className="w-full flex items-center justify-center gap-2 bg-[#F1CDAB]/15 hover:bg-[#F1CDAB]/25 text-[#F1CDAB] font-semibold px-6 py-3 rounded-xl transition-all duration-300 border border-[#F1CDAB]/20"
        >
          <Star className="size-4" />
          {getTranslation(language, 'rate_experience')}
        </motion.button>

        {/* Divider */}
        <div className="border-t border-white/8 pt-6 mt-8">
          <div className="flex flex-col items-center gap-2 text-sm">
            <div className="text-[#F3E5D8]/30 text-center">
              <span>{getTranslation(language, 'copyright')}</span>
              <span className="mx-1">{new Date().getFullYear()}</span>
            </div>
            <div className="flex items-center gap-1.5 text-[#F3E5D8]/30">
              <span>{getTranslation(language, 'powered_by')}</span>
              <div className="flex items-center gap-1 text-[#F1CDAB]/60 font-semibold">
                <UtensilsCrossed className="size-3.5" />
                <span>Qidr</span>
                <span className="text-[#F3E5D8]/20 font-normal">/ قدر</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
