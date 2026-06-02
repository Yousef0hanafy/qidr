'use client'

import { motion } from 'framer-motion'
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
          color: 'hover:text-pink-500',
        },
        branch.tiktok && {
          icon: Music2,
          href: branch.tiktok,
          label: 'TikTok',
          color: 'hover:text-black',
        },
        branch.snapchat && {
          icon: Ghost,
          href: branch.snapchat,
          label: 'Snapchat',
          color: 'hover:text-yellow-500',
        },
        branch.facebook && {
          icon: Facebook,
          href: branch.facebook,
          label: 'Facebook',
          color: 'hover:text-blue-600',
        },
      ].filter(Boolean)
    : []

  return (
    <footer
      dir={isRTL ? 'rtl' : 'ltr'}
      lang={language}
      className="bg-[#1A1A2E] text-white mt-12"
    >
      <div className="max-w-4xl mx-auto px-4 pt-10 pb-8">
        {/* Top section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
          {/* Contact info */}
          <div className="space-y-4">
            <h3 className="text-[#D4A843] font-bold text-lg">
              {getTranslation(language, 'contact_us')}
            </h3>
            {branch?.phone && (
              <a
                href={`tel:${branch.phone}`}
                className="flex items-center gap-2 text-white/70 hover:text-[#D4A843] transition-colors"
              >
                <Phone className="size-4 text-[#D4A843]" />
                <span className="text-sm">{branch.phone}</span>
              </a>
            )}
            {branch?.whatsapp && (
              <a
                href={`https://wa.me/${branch.whatsapp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-white/70 hover:text-green-400 transition-colors"
              >
                <MessageCircle className="size-4 text-green-400" />
                <span className="text-sm">WhatsApp</span>
              </a>
            )}
            {branch?.address && (
              <div className="flex items-start gap-2 text-white/70">
                <MapPin className="size-4 text-[#D4A843] shrink-0 mt-0.5" />
                <span className="text-sm">{branch.address}</span>
              </div>
            )}
            {branch?.googleMapLink && (
              <a
                href={branch.googleMapLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 text-white text-sm px-4 py-2 rounded-xl transition-all duration-300"
              >
                <ExternalLink className="size-4" />
                {getTranslation(language, 'navigate')}
              </a>
            )}
          </div>

          {/* Social & Review */}
          <div className="space-y-4">
            {socialLinks.length > 0 && (
              <div>
                <h3 className="text-[#D4A843] font-bold text-lg mb-3">
                  {getTranslation(language, 'social_media')}
                </h3>
                <div className="flex gap-3">
                  {socialLinks.map((link) =>
                    link ? (
                      <a
                        key={link.label}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:bg-white/20 transition-all duration-300 ${link.color}`}
                        aria-label={link.label}
                      >
                        <link.icon className="size-5" />
                      </a>
                    ) : null
                  )}
                </div>
              </div>
            )}

            {/* Rate button */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setIsReviewModalOpen(true)}
              className="w-full flex items-center justify-center gap-2 bg-[#D4A843] hover:bg-[#D4A843]/90 text-[#1A1A2E] font-semibold px-6 py-3 rounded-xl transition-all duration-300 shadow-lg shadow-[#D4A843]/20"
            >
              <Star className="size-4" />
              {getTranslation(language, 'rate_experience')}
            </motion.button>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 pt-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
            {/* Copyright */}
            <div className="text-white/40 text-center sm:text-start">
              <span>{getTranslation(language, 'copyright')}</span>
              <span className="mx-1">{new Date().getFullYear()}</span>
            </div>

            {/* Powered by */}
            <div className="flex items-center gap-1.5 text-white/40">
              <span>{getTranslation(language, 'powered_by')}</span>
              <div className="flex items-center gap-1 text-[#D4A843] font-semibold">
                <UtensilsCrossed className="size-4" />
                <span>Qidr</span>
                <span className="text-white/30 font-normal">/ قدر</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
