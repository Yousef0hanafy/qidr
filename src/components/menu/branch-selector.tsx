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
      <SelectTrigger className="w-full bg-white/8 backdrop-blur-sm border-white/15 text-[#D4956A] rounded-xl h-11 px-4 [&>span]:text-[#D4956A] [&>svg]:text-[#D4956A]/60 hover:bg-white/12 transition-colors">
        <div className="flex items-center gap-2">
          <MapPin className="size-4 text-[#D4956A]/60 shrink-0" />
          <SelectValue
            placeholder={getTranslation(language, 'select_branch')}
          />
        </div>
      </SelectTrigger>
      <SelectContent className="bg-[#1A1410] border-white/15 rounded-xl">
        {branches.map((branch) => (
          <SelectItem
            key={branch.id}
            value={branch.id}
            className="text-[#D4C8BB]/90 hover:bg-[#D4956A]/15 hover:text-[#D4956A] rounded-lg cursor-pointer data-[state=checked]:bg-[#D4956A]/15 data-[state=checked]:text-[#D4956A] transition-colors"
          >
            {language === 'ar' ? branch.name_ar : branch.name_en}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
