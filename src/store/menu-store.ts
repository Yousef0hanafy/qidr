import { create } from 'zustand'

type Language = 'ar' | 'en'

interface Product {
  id: string
  [key: string]: unknown
}

interface MenuState {
  // Language
  language: Language
  setLanguage: (lang: Language) => void

  // Branch selection
  selectedBranch: string | null
  setSelectedBranch: (branchId: string | null) => void

  // Search
  searchQuery: string
  setSearchQuery: (query: string) => void

  // Category filter
  selectedCategory: string | null
  setSelectedCategory: (categoryId: string | null) => void

  // Product detail modal
  isProductModalOpen: boolean
  selectedProduct: Product | null
  openProductModal: (product: Product) => void
  closeProductModal: () => void

  // Review modal
  isReviewModalOpen: boolean
  setIsReviewModalOpen: (open: boolean) => void

  // Computed
  isRTL: boolean
}

export const useMenuStore = create<MenuState>((set, get) => ({
  // Language
  language: 'ar',
  setLanguage: (lang: Language) => set({ language: lang }),

  // Branch selection
  selectedBranch: null,
  setSelectedBranch: (branchId) => set({ selectedBranch: branchId }),

  // Search
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),

  // Category filter
  selectedCategory: null,
  setSelectedCategory: (categoryId) => set({ selectedCategory: categoryId }),

  // Product detail modal
  isProductModalOpen: false,
  selectedProduct: null,
  openProductModal: (product) =>
    set({ isProductModalOpen: true, selectedProduct: product }),
  closeProductModal: () =>
    set({ isProductModalOpen: false, selectedProduct: null }),

  // Review modal
  isReviewModalOpen: false,
  setIsReviewModalOpen: (open) => set({ isReviewModalOpen: open }),

  // Computed: RTL is true when language is Arabic
  get isRTL() {
    return get().language === 'ar'
  },
}))
