'use client'

import { useState } from 'react'
import { Star, Send, ExternalLink, CheckCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useMenuStore } from '@/store/menu-store'
import { getTranslation } from '@/lib/i18n'

interface ReviewModalProps {
  isOpen: boolean
  onClose: () => void
  branchId: string | null
}

export function ReviewModal({ isOpen, onClose, branchId }: ReviewModalProps) {
  const { language } = useMenuStore()
  const isRTL = language === 'ar'

  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [name, setName] = useState('')
  const [feedback, setFeedback] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmitFeedback = async () => {
    if (!branchId || rating === 0) return

    setIsSubmitting(true)
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          branchId,
          rating,
          customerName: name || null,
          feedbackMessage: feedback || null,
        }),
      })
      if (res.ok) {
        setIsSuccess(true)
      }
    } catch {
      // silently handle
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRedirectGoogle = () => {
    window.open('https://maps.app.goo.gl/c6Q9yMS1EnqZULdE8', '_blank')
  }

  const resetAndClose = () => {
    setRating(0)
    setHoverRating(0)
    setName('')
    setFeedback('')
    setIsSuccess(false)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && resetAndClose()}>
      <DialogContent className="max-w-md sm:max-w-lg rounded-2xl overflow-hidden p-0 bg-[#003327] border-white/10 [&>button]:text-[#F3E5D8]/60 [&>button]:hover:text-[#F1CDAB]">
        <div
          className="p-6 sm:p-8"
          dir={isRTL ? 'rtl' : 'ltr'}
          lang={language}
        >
          <DialogTitle className="text-xl font-bold text-[#F1CDAB] text-center mb-2">
            {getTranslation(language, 'rate_your_experience')}
          </DialogTitle>
          <DialogDescription className="text-center text-[#F3E5D8]/50 text-sm mb-6">
            {getTranslation(language, 'how_was_your_experience')}
          </DialogDescription>

          <AnimatePresence mode="wait">
            {isSuccess ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex flex-col items-center gap-4 py-6"
              >
                <CheckCircle className="w-16 h-16 text-green-400" />
                <p className="text-[#F3E5D8] font-medium text-center">
                  {getTranslation(language, 'feedback_sent')}
                </p>
                <Button
                  onClick={resetAndClose}
                  className="mt-2 bg-[#F1CDAB]/20 hover:bg-[#F1CDAB]/30 text-[#F1CDAB] rounded-full px-6 border border-[#F1CDAB]/20"
                >
                  {getTranslation(language, 'close')}
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col items-center gap-5"
              >
                {/* Stars */}
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      className="p-1 transition-transform hover:scale-110"
                    >
                      <Star
                        className={cn_star(
                          star,
                          rating,
                          hoverRating
                        )}
                        fill={
                          star <= (hoverRating || rating)
                            ? '#F1CDAB'
                            : 'none'
                        }
                      />
                    </button>
                  ))}
                </div>

                {/* Conditional content based on rating */}
                <AnimatePresence mode="wait">
                  {rating > 0 && rating <= 3 && (
                    <motion.div
                      key="feedback-form"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="w-full space-y-4 overflow-hidden"
                    >
                      <Input
                        placeholder={getTranslation(
                          language,
                          'name_optional'
                        )}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="rounded-xl bg-white/5 border-white/15 text-[#F1CDAB] placeholder:text-[#F3E5D8]/30 focus:border-[#F1CDAB]/40 focus:ring-[#F1CDAB]/20"
                        dir={isRTL ? 'rtl' : 'ltr'}
                      />
                      <Textarea
                        placeholder={getTranslation(
                          language,
                          'your_feedback'
                        )}
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        className="rounded-xl bg-white/5 border-white/15 text-[#F1CDAB] placeholder:text-[#F3E5D8]/30 focus:border-[#F1CDAB]/40 focus:ring-[#F1CDAB]/20 min-h-24"
                        dir={isRTL ? 'rtl' : 'ltr'}
                      />
                      <Button
                        onClick={handleSubmitFeedback}
                        disabled={isSubmitting || !feedback.trim()}
                        className="w-full bg-[#F1CDAB]/20 hover:bg-[#F1CDAB]/30 text-[#F1CDAB] rounded-xl h-12 font-medium border border-[#F1CDAB]/20"
                      >
                        <Send className="size-4" />
                        {getTranslation(language, 'submit_feedback')}
                      </Button>
                    </motion.div>
                  )}

                  {rating > 3 && (
                    <motion.div
                      key="google-redirect"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="w-full space-y-4 overflow-hidden"
                    >
                      <Button
                        onClick={handleRedirectGoogle}
                        className="w-full bg-green-600/80 hover:bg-green-600 text-white rounded-xl h-12 font-medium"
                      >
                        <ExternalLink className="size-4" />
                        {getTranslation(language, 'redirect_google')}
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function cn_star(
  star: number,
  rating: number,
  hoverRating: number
): string {
  const isActive = star <= (hoverRating || rating)
  return `w-10 h-10 transition-colors duration-200 ${
    isActive ? 'text-[#F1CDAB]' : 'text-[#F3E5D8]/20'
  }`
}
