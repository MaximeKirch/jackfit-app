import { create } from 'zustand'

interface UIStore {
  isInfoSheetOpen: boolean
  openInfoSheet: () => void
  closeInfoSheet: () => void
}

export const useUIStore = create<UIStore>((set) => ({
  isInfoSheetOpen: false,
  openInfoSheet: () => set({ isInfoSheetOpen: true }),
  closeInfoSheet: () => set({ isInfoSheetOpen: false }),
}))
