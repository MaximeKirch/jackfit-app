import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'

interface NotifStore {
  firstOpenAt: string | null
  hasCompletedFirstWorkoutObserved: boolean
  setFirstOpenAt: (iso: string) => void
  markFirstWorkoutObserved: () => void
  reset: () => void
}

const INITIAL_NOTIF_STATE = {
  firstOpenAt:                      null,
  hasCompletedFirstWorkoutObserved: false,
}

export const useNotifStore = create<NotifStore>()(
  persist(
    (set) => ({
      ...INITIAL_NOTIF_STATE,
      setFirstOpenAt:           (iso) => set({ firstOpenAt: iso }),
      markFirstWorkoutObserved: ()    => set({ hasCompletedFirstWorkoutObserved: true }),
      reset: () => set(INITIAL_NOTIF_STATE),
    }),
    {
      name:    'notif-storage',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
)
