import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'
import i18n, { detectSystemLocale, type SupportedLocale } from '@/shared/i18n'

interface LocaleStore {
  locale: SupportedLocale
  setLocale: (locale: SupportedLocale) => void
}

export const useLocaleStore = create<LocaleStore>()(
  persist(
    (set) => ({
      locale: detectSystemLocale(),
      setLocale: (locale) => {
        void i18n.changeLanguage(locale)
        set({ locale })
      },
    }),
    {
      name: 'locale-storage',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        if (state?.locale) void i18n.changeLanguage(state.locale)
      },
    }
  )
)
