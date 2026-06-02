'use client'

import { useMenuStore } from '@/store/menu-store'
import { getTranslation } from '@/lib/i18n'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { MapPin } from 'lucide-react'

interface Branch {
  id: string
  name_ar: string
  name_en: string
  slug: string
  isActive: boolean
}

interface BranchSelectorProps {
  branches: Branch[]
  selectedBranch: string | null
  onSelect: (branchId: string | null) => void
}

export function BranchSelector({
  branches,
  selectedBranch,
  onSelect,
}: BranchSelectorProps) {
  const { language } = useMenuStore()

  const handleSelect = (value: string) => {
    onSelect(value === '__none__' ? null : value)
  }

  return (
    <Select value={selectedBranch ?? '__none__'} onValueChange={handleSelect}>
      <SelectTrigger className="w-full bg-white/10 backdrop-blur-sm border-white/20 text-white rounded-xl h-12 px-4 [&>span]:text-white [&>svg]:text-[#D4A843] hover:bg-white/15 transition-colors">
        <div className="flex items-center gap-2">
          <MapPin className="size-4 text-[#D4A843] shrink-0" />
          <SelectValue
            placeholder={getTranslation(language, 'select_branch')}
          />
        </div>
      </SelectTrigger>
      <SelectContent className="bg-[#1A1A2E] border-white/20 rounded-xl">
        {branches.map((branch) => (
          <SelectItem
            key={branch.id}
            value={branch.id}
            className="text-white/90 hover:bg-[#D4A843]/20 hover:text-[#D4A843] rounded-lg cursor-pointer data-[state=checked]:bg-[#D4A843]/20 data-[state=checked]:text-[#D4A843] transition-colors"
          >
            {language === 'ar' ? branch.name_ar : branch.name_en}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
