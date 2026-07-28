import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'

interface NotifStore {
  firstOpenAt: string | null
  hasCompletedFirstWorkoutObserved: boolean
  setFirstOpenAt: (iso: string) => void
  markFirstWorkoutObserved: () => void
}

export const useNotifStore = create<NotifStore>()(
  persist(
    (set) => ({
      firstOpenAt:                      null,
      hasCompletedFirstWorkoutObserved: false,
      setFirstOpenAt:           (iso) => set({ firstOpenAt: iso }),
      markFirstWorkoutObserved: ()    => set({ hasCompletedFirstWorkoutObserved: true }),
    }),
    {
      name:    'notif-storage',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
)
